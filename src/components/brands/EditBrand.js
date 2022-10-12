import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { Formik } from 'formik';
import * as Yup from 'yup'
import { InputSwitch } from 'primereact/inputswitch';
import { FileUpload } from 'primereact/fileupload';
import { ImageService } from '../../service/ImageService';


const EditBrand = ({categories,rowData,updateSubCategory}) => {
    const [dialogVisibility, setDialogVisibility] = useState(false);
    const [content] = useState(rowData);
    const hideDialog = () => setDialogVisibility(false)
    const openModal = () => setDialogVisibility(true)

    const initialValues = {
        _id:content._id,
        name: content.nameUnderCategory,
        category:content?.category?._id,
        image: content?.photo?.url,
        status:content.active,
        deletedImage: null
    }
    
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('nom de marque obligatoire'),
        status: Yup.bool()
    })

    const onSubmit = async (values,actions) => {
        const data = {
            nameUnderCategory: values.name,
            category: {
                _id: values.category
            },
            active: values.status
        }
       await updateSubCategory(values._id,data)
       hideDialog()
    }

    const clearUrl = (url,setFieldValue)=>{
        setFieldValue('deletedImage',url)
        setFieldValue('image',null)

    }

    //-----------handle template images-------------//
    //when the selected images uploaded
    const myUploader = async(values,event) => {
        const files = event.files
        const blob = await fetch(files[0].objectURL).then(r => r.blob()); //get blob url
        const category_url = await imageService.uploadImage(blob,`categories/${files[0].name}`) // upload to firebase and get url
        const data = {
            nameCategory: values.name,
            active : values.status,
            photo : { url: category_url.data }
        }
        await imageService.deletImage(values.deletedImage)
        await updateCtagory(_id,data)
        fileUploadRef.clear()
    }

    //when an image added
    const onTemplateSelect = (e,setFieldValue) => {
        setFieldValue('image','image')
    }

    //when an image removed
    const onTemplateRemove = (e,setFieldValue) => {
        setFieldValue('image',null)
    }

    //when all images removed
    const onTemplateClear = (e,setFieldValue) => {
        setFieldValue('image',null)

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
            
            <div className='mb-3'>

            {/* NAME */}
            <div className="field flex flex-column">
            <p className="mb-2">nom de la marque</p>
                <InputText 
                value={values.name}
                onChange={handleChange('name')} 
                placeholder='nom de marque'
                onBlur={handleBlur('name')}
                className={classNames({ 'p-invalid':  isFormFieldValid('name')})} />
                {getFormErrorMessage('name')}
            </div>

            {/* CATEGORY */}
            <div className='mb-3'>
                <p className="mb-2">catégorie</p>
                <Dropdown 
                value={values.category}
                onChange={handleChange('category')}
                options={categories}
                placeholder = "choisissez une catégorie"
                className={classNames({ 'p-invalid':  isFormFieldValid('category')})} /> 
                {getFormErrorMessage('category')}
            </div>

            {/* STATUS */}
            <div className='mb-3'>
            <p className="mb-2">status</p>
            <InputSwitch checked={values.status} 
            onChange={handleChange('status')} />
            </div>
            {/* template image */}
            {values.deletedImage !== null && 
            <FileUpload 
            mode="advanced" 
            ref={(el) => fileUploadRef = el}
            name="demo[]"
            customUpload 
            url="https://primefaces.org/primereact/showcase/upload.php" 
            accept="image/*" 
            maxFileSize={2000000}
            headerTemplate={headerTemplate}
            uploadHandler={(e) => myUploader(values,e)}
            onSelect={(e) => onTemplateSelect(e,setFieldValue)}
            onError={(e) => onTemplateClear(e,setFieldValue)} 
            onClear={(e) => onTemplateClear(e,setFieldValue)} 
            onRemove={(e) => onTemplateRemove(e,setFieldValue)}
            emptyTemplate={<p className="m-0">Faites glisser et déposez l'image ici pour le télécharger.</p>}
            />
            }
    
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

export default EditBrand