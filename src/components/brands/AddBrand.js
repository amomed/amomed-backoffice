import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { Formik } from 'formik';
import * as Yup from 'yup'
import { FileUpload } from 'primereact/fileupload';
import { ImageService } from '../../service/ImageService';
import { v4 as uuidv4 } from 'uuid';

const AddBrand = ({categories,createSubCategory}) => {
    
    const [dialogVisibility, setDialogVisibility] = useState(false);
    const hideDialog = () => setDialogVisibility(false)
    const openNew = () => setDialogVisibility(true)
    let fileUploadRef = useRef(null);

    const initialValues = {
        name: '',
        category:'',
        numberImages: 0,
        status:true
    }
    
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('nom de marque obligatoire'),
        category: Yup.string().required('categorie obligatoire'),
        numberImages: Yup.number().required('images obligatoire')
                        .test(
                            'Is positive?', 
                            '', 
                            (value) => value > 0),
        status:Yup.bool()

    })

    const headerTemplate = (options) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        return (
            <div className={className} style={{backgroundColor: 'transparent', display: 'flex', alignItems: 'center'}}>
                {chooseButton}
                {cancelButton}
            </div>
        );
    } 


    //when an image added
    const onTemplateSelect = (setFieldValue) => {
        setFieldValue('numberImages',1)
    }

    //when an image removed
    const onTemplateRemove = (setFieldValue) => {
        setFieldValue('numberImages',0)
    }

    //when all images removed
    const onTemplateClear = (setFieldValue) => {
        setFieldValue('numberImages',0)
    }

    const myUploader = async(values,event) => {
        const imageService = new ImageService()
        const {objectURL, name} = event.files[0]
        const blob = await fetch(objectURL).then(r => r.blob()); //get blob url
        const url_image = await imageService.uploadImage(blob,`brands/${name}${uuidv4()}`) // upload to firebase and get url
        const data = {
            nameUnderCategory:values.name,
            category: values.category,
            active:values.status,
            photo : { url:url_image.data }
        }
        await createSubCategory(data)
        hideDialog()
        
    }

    const onSubmit = async (values,actions) => {
        fileUploadRef.upload()
    }
    
    
    return(
        <>
        <Button 
        label="ajouter" 
        icon="pi pi-plus" 
        className="mr-2" 
        onClick={openNew} />
        
        {/* MODAL */}
        <Dialog draggable={false} visible={dialogVisibility} breakpoints={{'1900px': '60vw', '640px': '100vw'}}
            header="Ajouter nouveau marque" modal 
            className="p-fluid" onHide={hideDialog}>
            
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ handleChange,handleBlur, handleSubmit,isSubmitting, values, errors, touched, setFieldValue })=>{
               
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
                    {getFormErrorMessage('status')}
                </div>
                {/*template image */}      
                <div>
                    <h5>Images</h5>
                    <FileUpload name="demo[]" url="https://primefaces.org/primereact/showcase/upload.php" 
                        ref={(el) => fileUploadRef = el}
                        headerTemplate={headerTemplate}
                        accept="image/*" 
                        maxFileSize={2000000}
                        customUpload
                        uploadHandler={(e) => myUploader(values,e)}
                        onSelect={(e) => onTemplateSelect(setFieldValue)}
                        onError={(e) => onTemplateClear(setFieldValue)} onClear={(e) =>onTemplateClear(setFieldValue)} onRemove={onTemplateRemove}
                        emptyTemplate={<p className="m-0">Faites glisser et déposez les images ici pour les télécharger.</p>} />

                </div>          
                
            </div>
            <div className='mt-4 flex align-items-center justify-content-end'>
                <Button label="annuler" className='w-auto p-button-text mr-2' icon="pi pi-times" 
                onClick={hideDialog}/>
                <Button onClick={handleSubmit} 
                label={isSubmitting?'loading':'sauvegarder'}
                disabled={isSubmitting}
                loading={isSubmitting}
                className='w-auto p-button-text p-button-success' 
                icon="pi pi-check"  type='submit' />
            </div>
            </>
                )
            }}
            </Formik>
            
            </Dialog>
        </>
    )
}

export default AddBrand