import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { Formik } from 'formik';
import * as Yup from 'yup'
import { InputSwitch } from 'primereact/inputswitch';

const EditType = ({rowData,updateType}) => {
  const [dialogVisibility, setDialogVisibility] = useState(false);
  const [content] = useState(rowData);
  const hideDialog = () => setDialogVisibility(false)
  const openModal = () => setDialogVisibility(true)

  const initialValues = {
    _id:content._id,
    name: content.customerType,
    status: content.active
  }

  const validationSchema = Yup.object().shape({
      name: Yup.string().required('type obligatoire'),
      status: Yup.bool()
  })

  const onSubmit = async (values,actions) => {
    const data = {
      customerType: values.name,
      active: values.status
    }
    await updateType(values._id,data)
    hideDialog()
  }

  return (
    <>
    <Button icon="pi pi-pencil" className="p-button-sm p-button-rounded p-button-text p-button-warning" onClick={openModal} />
    
    {/* MODAL */}
    <Dialog draggable={false} visible={dialogVisibility} breakpoints={{'1900px': '60vw', '640px': '100vw'}}
        header="Ajouter nouveau catégorie" modal 
        className="p-fluid" onHide={hideDialog}>
        
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ 
            handleChange,handleBlur, 
            handleSubmit,isSubmitting, values, 
            errors, touched })=>{
                
            const isFormFieldValid = (name) => !!(touched[name] && errors[name]);
            const getFormErrorMessage = (name) => {
                return isFormFieldValid(name) && <small className="p-error">{errors[name]}</small>;
            };

            return(
            <>
            {/* NAME */}
            <div className='mb-3'>
                <p className="mb-2">nom de la marque</p>
                <div className="field flex flex-column">
                <InputText 
                value={values.name}
                onChange={handleChange('name')} 
                placeholder='nom de marque'
                onBlur={handleBlur('name')}
                className={classNames({ 'p-invalid':  isFormFieldValid('name')})} />
                {getFormErrorMessage('name')}
            </div>

            {/* STATUS */}
            <div className='mb-3'>
            <p className="mb-2">status</p>
            <InputSwitch checked={values.status} 
            onChange={handleChange('status')} />
            </div>
            
            
        </div>
        <div className='mt-4 flex align-items-center justify-content-end'>
            <Button label="annuler" className='w-auto p-button-text mr-2' icon="pi pi-times" 
            onClick={hideDialog}/>
            <Button onClick={handleSubmit} 
            label={isSubmitting?'loading':'modifier'}
            disabled={isSubmitting}
            loading={isSubmitting}
            className='w-auto p-button-text p-button-warning' 
            icon="pi pi-pencil"  type='submit' />
        </div>
        </>
            )
        }}
        </Formik>
        
        </Dialog>
    </>
  )
}

export default EditType