import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Formik } from 'formik';
import * as Yup from 'yup'

const AddType = ({createType}) => {
    const [dialogVisibility, setDialogVisibility] = useState(false);
    const hideDialog = () => setDialogVisibility(false)
    const openNew = () => setDialogVisibility(true)

    const initialValues = {
        name: '',
        image: ''
    }
    
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('champ obligatoire')
    })

    const onSubmit=(values,actions)=>{
        createType({ customerType: values.name })
        hideDialog()
    }
    
    return(
        <>
        <Button 
        label="ajouter" 
        icon="pi pi-plus" 
        className="mr-2" 
        onClick={openNew} />
        
        {/* MODAL */}
        <Dialog visible={dialogVisibility} breakpoints={{'1900px': '60vw', '640px': '100vw'}}
            header="Ajouter nouveau type" modal 
            className="p-fluid" onHide={hideDialog}>
            
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ handleChange,handleBlur, handleSubmit,isSubmitting, values, errors, touched })=>{
               
                const isFormFieldValid = (name) => !!(touched[name] && errors[name]);
                const getFormErrorMessage = (name) => {
                    return isFormFieldValid(name) && <small className="p-error">{errors[name]}</small>;
                };

                return(
                    <>
                    <div className="field flex flex-column">
                    <InputText
                    onChange={handleChange('name')} 
                    placeholder='type des clients'
                    onBlur={handleBlur('name')}
                    className={classNames({ 'p-invalid':  isFormFieldValid('name')})}
                    />
                    {getFormErrorMessage('name')}
                    </div>
            <div className='mt-4 flex align-items-center justify-content-end'>
                <Button label="annuler" className='w-auto p-button-text mr-2' icon="pi pi-times" onClick={hideDialog}/>
                <Button onClick={handleSubmit} 
                label={isSubmitting?'loading':'sauvegarder'}
                disabled={isSubmitting}
                loading={isSubmitting} 
                className='w-auto p-button-text p-button-success' 
                icon="pi pi-check"  
                type='submit' />
            </div>
            </>
                )
            }}
            </Formik>
            
        </Dialog>
        </>
    )
}

export default AddType