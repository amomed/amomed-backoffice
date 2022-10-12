import React, { useEffect, useState, useRef } from 'react'
import { Button } from 'primereact/button'
import { classNames } from 'primereact/utils';
import { Formik } from 'formik';
import * as Yup from 'yup'
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

const AddAdmin = () => {

    const [dialogVisibility, setDialogVisibility] = useState(false);
    const hideDialog = () => setDialogVisibility(false)
    const openNew = () => setDialogVisibility(true)

    const initialValues = {
        name: '',
        type: 'inferior',
        username: '',
        password: ''
    }
    
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('champ obligatoire'),
        username: Yup.string().required('champ obligatoire'),
        password: Yup.string().required('champ obligatoire').min(8,'8 caractére minimum'),
    })

    const onSubmit=(values,actions)=>{
        console.log(values)
    }


  return (
    <>
        <Button onClick={openNew} icon="pi pi-plus" className="p-button-outlined"/>
        <Dialog  visible={dialogVisibility} breakpoints={{'1900px': '60vw', '640px': '100vw'}}
            header="Ajouter nouveau admin" modal 
            className="p-fluid" onHide={hideDialog}>
            
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ handleChange,handleBlur, handleSubmit,isSubmitting, values, errors, touched })=>{
               
                const isFormFieldValid = (name) => !!(touched[name] && errors[name]);
                const getFormErrorMessage = (name) => {
                    return isFormFieldValid(name) && <small className="p-error">{errors[name]}</small>;
                };

                return(
                    <>
                    {/* NAME */}
                    <div className="field">
                        <InputText id="name" placeholder='nom'  
                        className={classNames({ 'p-invalid':  isFormFieldValid('name') })}
                        onChange={handleChange('name')} onBlur={handleBlur('name')}
                        />
                        {getFormErrorMessage('name')}
                    </div>

                    {/* USERNAME */}
                    <div className="field">
                        <InputText id="username" placeholder='psuedo'  
                        className={classNames({ 'p-invalid':  isFormFieldValid('username') })}
                        onChange={handleChange('username')} onBlur={handleBlur('username')}
                        />
                        {getFormErrorMessage('username')}
                    </div>

                    {/* PASSWORD */}
                    <div className="field">
                        <InputText id="name" placeholder='mot de pass'  
                        className={classNames({ 'p-invalid':  isFormFieldValid('password') })}
                        onChange={handleChange('password')} onBlur={handleBlur('password')}
                        />
                        {getFormErrorMessage('password')}
                    </div>
            <div className='mt-4 flex align-items-center justify-content-end'>
                <Button label="annuler" className='w-auto p-button-text mr-2' icon="pi pi-times" onClick={hideDialog}/>
                <Button onClick={handleSubmit} label="sauvegarder" className='w-auto p-button-text p-button-success' icon="pi pi-check"  type='submit' />
            </div>
            </>
                )
            }}
            </Formik>
            
        </Dialog>
    </>
  )
}

export default AddAdmin