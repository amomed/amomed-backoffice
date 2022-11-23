import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Field, Formik } from 'formik';
import * as Yup from 'yup'
import { ImageService } from '../../service/ImageService';


const AddCategory=({createCategory})=>{

    const FILE_SIZE = 2000000;
    const SUPPORTED_FORMATS = [
      "image/jpg",
      "image/jpeg",
      "image/png"
    ];

    const imageService = new ImageService()
    const [dialogVisibility, setDialogVisibility] = useState(false);
    const hideDialog = () => setDialogVisibility(false)
    const openNew = () => setDialogVisibility(true)

    const initialValues = {
        name: '',
        file:''
    } 
    
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('nom de catégorie obligatoire'),
        file: Yup.mixed().required("image obligatoire")
        .test(
          "fileSize",
          "taille maximale est 2 Mo",
            value => value && value.size <= FILE_SIZE
        )
        .test(
            "fileFormat",
            "seuls ces formats sont supportés : .jpg .jpeg .png",
            value => value && SUPPORTED_FORMATS.includes(value.type)
        )
       
    })

    const onSubmit=(values,actions)=>{
        handleSubmit(values)
    }

    const handleSubmit = async(values) => {
        const response = await imageService.uploadImage(values.file,`categories/${values.name}`)
        if(response.data){
            const data = {
                nameCategory:values.name,
                photo:{
                    url:response.data
                }
            }
            await createCategory(data)
            hideDialog()
        } else {
            console.log(response.error)
        }
    };


    return(
        <>
        <Button 
        label="ajouter" 
        icon="pi pi-plus" 
        className="mr-2" 
        onClick={openNew} />
        
        {/* MODAL */}
        <Dialog draggable={false} visible={dialogVisibility} breakpoints={{'1900px': '60vw', '640px': '100vw'}}
            header="Ajouter nouveau catégorie" modal 
            className="p-fluid" onHide={hideDialog}>
            
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ handleChange, handleBlur, handleSubmit,isSubmitting, errors, touched })=>{
               
                const isFormFieldValid = (name) => !!(touched[name] && errors[name]);
                const getFormErrorMessage = (name) => {
                    return isFormFieldValid(name) && <small className="p-error">{errors[name]}</small>;
                };

                return(
                    <>
                <div className='mb-3'>
                    <p className="mb-2">nom de catégorie</p>
                    <InputText
                    onChange={handleChange('name')} 
                    placeholder='nom de catégorie'
                    onBlur={handleBlur('name')}
                    className={classNames({ 'p-invalid':  isFormFieldValid('name')})}
                    />
                    {getFormErrorMessage('name')}
                </div>

                <div className='mb-3 flex flex-column'>
                    <p className="mb-2">image</p>
                    <Field name="file" component={ImageUpload} />
                    {getFormErrorMessage('file')}
                </div>
                

            <div className='mt-4 flex align-items-center justify-content-end'>
                <Button label="annuler" className='w-auto p-button-text mr-2' icon="pi pi-times" onClick={hideDialog}/>
                <Button 
                    disabled={isSubmitting}
                    onClick={handleSubmit} 
                    label={isSubmitting?'loading':'sauvegarder'}
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

export default AddCategory

const ImageUpload=({ form, field })=>{
    return(
        
        <input
        name={field.name}
        type="file"
        accept="image/*"
        onChange={e => form.setFieldValue(field.name, e.target.files[0])}
      />
      
    )
}