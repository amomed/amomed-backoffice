import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Field, Formik } from 'formik';
import { Divider } from 'primereact/divider';
import * as Yup from 'yup'


const AddOrder = ({customers,products}) => {
    const [dialogVisibility, setDialogVisibility] = useState(false);
    const hideDialog = () => setDialogVisibility(false)
    const openModal = () => setDialogVisibility(true)

    const initialValues = {
       
    } 
    
    const validationSchema = Yup.object().shape({
        
    })

    const onSubmit=(values,actions)=>{
        console.log(values)
    }


return(
    <>
    <Button label="ajouter" icon="pi pi-plus" className="p-button-success mr-2" onClick={openModal} />
    
    {/* MODAL */}
    <Dialog maximizable draggable={false} visible={dialogVisibility} breakpoints={{'1900px': '60vw', '640px': '100vw'}}
        header="Ajouter un commande" modal 
        className="p-fluid" onHide={hideDialog}>
        
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ handleChange, handleBlur, handleSubmit,isSubmitting, errors, touched })=>{
            
            const isFormFieldValid = (name) => !!(touched[name] && errors[name]);
            const getFormErrorMessage = (name) => {
                return isFormFieldValid(name) && <small className="p-error">{errors[name]}</small>;
            };

            return(
            <div className='grid'>

                <div className='col-6'>
                    
                    {/* CUSTOMERS */}
                    <div className='mb-3 flex flex-column'>
                        <p className="font-bold mb-2">client</p>
                        <div className='flex'>
                        <InputText
                            placeholder="recherche par nom d'établissment"/>
                        <Button icon='pi pi-search' className='p-3 ml-2 w-auto'/>                        
                        </div>
                    </div>

                    <Divider />

                    {/* DISPLAY PRODUCT */}
                   
                    <div style={{backgroundColor:'#f0f0f0',borderRadius:10}} className='mb-3 flex flex-column col-6 w-full max-w-full'>
                        <div className='flex justify-content-between align-items-center flex-wrap'>
                            <div className='flex align-items-center'>
                                <div style={{width:20,height:20,backgroundColor:'#6366F1',borderRadius:13,cursor:'pointer'}} className='mr-2 flex align-items-center justify-content-center p-3'>
                                    <i style={{color:'#fff'}} className='pi pi-minus'></i>
                                </div>
                                <b>5</b>
                                <div style={{width:20,height:20,backgroundColor:'#6366F1',borderRadius:13,cursor:'pointer'}} className='ml-2 flex align-items-center justify-content-center p-3'>
                                    <i style={{color:'#fff'}} className='pi pi-plus'></i>
                                </div>
                            </div>
                            <img src='https://www.pngmart.com/files/21/Face-Mask-PNG-Isolated-Pic.png' width='60'/>
                            <div>
                                <p>AC452I</p>
                            </div>
                            <Button className='ml-2 p-button-rounded p-button-danger p-button-text w-auto'>
                               <b>retirer</b>
                            </Button>
                        </div>
                    </div>
                   

                    {/* PRODUCT */}
                    <div className='mb-3 flex flex-column'>
                        <p className="font-bold mb-2">produits</p>
                        <div className='flex'>
                        <InputText
                            placeholder='recherche par SKU'/>
                        <Button icon='pi pi-search' className='p-3 ml-2 w-auto'/>                        
                        </div>
                    </div>
                </div>

                <div className='col-6'>
                    <div className='mb-3 flex flex-column'>
                            <p className="font-bold mb-2">Total TTC</p>
                            <p>51200dh</p>
                    </div>
                    <div className='mb-3 flex flex-column'>
                            <p className="font-bold mb-2">Quantité total</p>
                            <p>20pcs</p>
                    </div>
                </div>

                {/* <div className='mt-4 flex align-items-center justify-content-end'>
                    <Button label="annuler" className='w-auto p-button-text mr-2' icon="pi pi-times" onClick={hideDialog}/>
                    <Button 
                    disabled={isSubmitting}
                    onClick={handleSubmit} 
                    label={isSubmitting?'loading':'sauvegarder'}
                    loading={isSubmitting} 
                    className='w-auto p-button-text p-button-success' 
                    icon="pi pi-check"  
                    type='submit' />
                </div> */}

            </div>
            )
        }}
        </Formik>
        
    </Dialog>
    </>
)
}

export default AddOrder