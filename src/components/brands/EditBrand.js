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
    const imageService = new ImageService()
    const [dialogVisibility, setDialogVisibility] = useState(false);
    const [content] = useState(rowData);
    const [numberFiles, setNumberFiles] = useState(0)
    const hideDialog = () => setDialogVisibility(false)
    const openModal = () => setDialogVisibility(true)
    let fileUploadRef = useRef(null)
    const [loading,setLoading] = useState(false);

    const initialValues = {
        _id:content._id,
        name: content.nameUnderCategory,
        category:content?.category?._id,
        image: content?.photo?.url,
        status:content.active,
        deletedImage: null
    }
    
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('nom de marque obligatoire')
    })

    const onSubmit = async (values,actions) => {
       if(values.deletedImage != null ){
            fileUploadRef.upload()
        }
        else {
            const data = {
                nameUnderCategory: values.name,
                category: values.category,
                active: values.status,
                photo: {url: values.image}
            }
            
            await updateSubCategory(values._id,data)
            hideDialog()
        }
       
    }

    const clearUrl = (url,setFieldValue)=>{
        setFieldValue('deletedImage',url)
        setFieldValue('image',null)
    }

    //-----------handle template images-------------//
    //when the selected images uploaded
    const myUploader = async(values,event) => {
        const files = event.files
        const blob = await fetch(files[0]?.objectURL).then(r => r.blob()); //get blob url
        const category_url = await imageService.uploadImage(blob,`brands/${files[0].name}`) // upload to firebase and get url
        const data = {
            nameUnderCategory: values.name,
            category: values.category,
            active: values.status,
            photo: {url: category_url?.data}
        }
        console.log(data)
        await imageService.deletImage(values.deletedImage)
        await updateSubCategory(values._id,data)
        hideDialog()
    }

    //when an image added
    const onTemplateSelect = (e,setFieldValue) => {
        setNumberFiles(1)
        setFieldValue('image','image')
    }

    //when an image removed
    const onTemplateRemove = (e,setFieldValue) => {
        setNumberFiles(0)
        setFieldValue('image',null)
    }

    //when all images removed
    const onTemplateClear = (e,setFieldValue) => {
        setNumberFiles(0)
        setFieldValue('image',null)

    }

    const headerTemplate = (options, deletedImage) => {
        const { className, chooseButton, cancelButton } = options;
        return (
            <div className={className} style={{backgroundColor: 'transparent', display: 'flex', alignItems: 'center'}}>
                {deletedImage != null  && chooseButton}
                {cancelButton}
            </div>
        );
    }


  return (
    <>
    <Button icon="pi pi-pencil" className="p-button-sm p-button-rounded p-button-text p-button-warning" onClick={openModal} />
    
    {/* MODAL */}
    <Dialog draggable={false} visible={dialogVisibility} breakpoints={{'1900px': '60vw', '640px': '100vw'}}
        header="Modifier marque" modal 
        className="p-fluid" onHide={hideDialog}>
        
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ 
            handleChange,handleBlur, 
            handleSubmit,isSubmitting, values, setFieldValue,
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
            {/* IMAGE DISPLAY */}
            {values.deletedImage == null
            && <div className="field flex align-items-center ">
            <img src={values.image} alt={values.name} width='100'/>
            <Button 
            loading={loading}
            onClick={()=> clearUrl(values.image,setFieldValue) }
            icon="pi pi-times"
            className='ml-2 p-button-rounded p-button-outlined p-button-danger'/>
            </div>
            }
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
            headerTemplate={(options) => headerTemplate(options,values.deletedImage)}
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