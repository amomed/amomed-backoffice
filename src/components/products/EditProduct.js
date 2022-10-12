import React,{ useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Formik } from 'formik';
import * as Yup from 'yup'
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { classNames, ConnectedOverlayScrollHandler } from 'primereact/utils';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputSwitch } from 'primereact/inputswitch';
import { BrandsService } from '../../service/BrandsService';
import { ImageService } from '../../service/ImageService';
import { ProductService } from '../../service/ProductService';



const EditProduct = ({rowData,categories,setLazyParams}) => {
    const [dialogVisibility, setDialogVisibility] = useState(false);
    const [brands,setBrands] = useState([])
    const {_id,reference, nameProduct, category, underCategory, priceProduct, photos, description, quantityStock, minOrderQuantity, active } = rowData;
    const hideDialog = () => setDialogVisibility(false)
    const openModal = () => setDialogVisibility(true)
    const toast = React.useRef(null);
    let fileUploadRef = useRef(null);

    const initialValues = {
        _id: _id,
        reference: reference,
        nameProduct: nameProduct,
        category: category._id,
        underCategory: underCategory,
        priceProduct: priceProduct,
        photos: photos,
        deletedImages: [],
        numberImages: 0,
        description: description,
        quantityStock: quantityStock,
        minOrderQuantity: minOrderQuantity,
        active: active,
    }
    
    const validationSchema = Yup.object().shape({
        reference: Yup.string().required('sku obligatoire'),
        nameProduct: Yup.string().required('nom obligatoire'),
        category: Yup.string().required('catégorie obligatoire'),
        priceProduct: Yup.string().required('prix obligatoire'),
        description: Yup.string().required('description obligatoire'),
        quantityStock: Yup.number().required('quantité obligatoire')
                        .test(
                            'Is positive?', 
                            'La quantité doit être supérieure ou égale 0 !', 
                            (value) => value >= 0
                        ),
        minOrderQuantity:Yup.number().required('quantité obligatoire')
                            .test(
                                'Is positive?', 
                                'La quantité doit être supérieure à 0 !', 
                                (value) => value > 0
                            ),
    })


  

    useEffect(() => {
        if(dialogVisibility){
            getBrandsBySelectedCategory(category._id)
        }
    },[dialogVisibility])
    // get selected brands when a category changed
    async function getBrandsBySelectedCategory(categoryId) {
        console.log(categoryId)
        const brandsService = new BrandsService()
        const response = await brandsService.getBrandsByCategory(categoryId)
        let _brands = []
        if(response.data){
            response.data.map(brand => {
                _brands.push(
                    { label: brand.nameUnderCategory, value: brand._id  }
                )
            })
            setBrands(_brands)
        } else {
            console.log(response.error)
        }
    }

    function onClickRemoveImage (url,photos, deletedImages ,setFieldValue){
        let undeletedPhotos = []
        undeletedPhotos = photos.filter((u) => u != url)
        setFieldValue('photos',undeletedPhotos)
        let _deleteImages = deletedImages
        _deleteImages.push(url)
        setFieldValue('deletedImages',_deleteImages)
    }

    async function _deleteImages(urls){
        const imageService = new ImageService()
        for(let i = 0; i < urls.length; i++){
            await imageService.deletImage(urls[i])
        }
    }

    async function _editProduct(_id ,data){
        const productService = new ProductService()
        const response = await productService.updatedProduct(_id ,data)
        if(response.data){
            hideDialog()
            setLazyParams({
                first: 0,
                rows: 2,
                page: 1,
                filters : {
                    selectedCategory: null,
                    active: null,
                },
                sortfield: null,
                sortorder: -1
            })
        } else {
            console.log(response.error)
        }
    }
    
    const onSubmit = async (values,actions) => {
        await _deleteImages(values.deletedImages)
        if(values.numberImages > 0){
            fileUploadRef.upload()
        } else {
            await _editProduct(values._id,values)
        }
    }

    //-----------handle template images-------------//
    //when the selected images uploaded
    const myUploader = async(values,event) => {
        let firebaseUrl = []
        const imageService = new ImageService()
        const files = event.files
        
        for(let i =0; i < files.length; i++ ){
            const blob = await fetch(files[i].objectURL).then(r => r.blob()); //get blob url
            const url_product = await imageService.uploadImage(blob,`products/${files[i].name}`) // upload to firebase and get url
            firebaseUrl.push(url_product.data)
        }
        values.photos = values.photos.length > 0 ? values.photos.concat(firebaseUrl) : firebaseUrl
        const { reference, nameProduct, category, underCategory, priceProduct, photos, description, quantityStock, minOrderQuantity, active } = values
        const data = {
            reference,
            nameProduct,
            category,
            underCategory,
            priceProduct,
            photos, 
            description,
            quantityStock, 
            minOrderQuantity, 
            active
        }
        fileUploadRef.clear()
        await _editProduct(values._id, data)
        
        
    }

    //when an image added
    const onTemplateSelect = (e, setFieldValue) => {
        setFieldValue("numberImages",e.files.length)
    }

    //when an image removed
    const onTemplateRemove = (e, numberImages ,setFieldValue) => {
        setFieldValue("numberImages",numberImages - 1)
    }

    //when all images removed
    const onTemplateClear = (e, setFieldValue) => {
        setFieldValue("numberImages",0)
    }

    const headerTemplate = (options) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;    
        return (
            <div className={className} style={{backgroundColor: 'transparent', display: 'flex', alignItems: 'center'}}>
                {chooseButton}
                {cancelButton}
            </div>
        );
    }

  return (
    <>
    <Button icon="pi pi-pencil" className="p-button-sm p-button-rounded p-button-text p-button-warning" onClick={openModal} />
    <Dialog draggable={false} visible={dialogVisibility} breakpoints={{'1080px': '100vw', '640px': '100vw'}}
            maximizable header={`Modifier ${reference}`} modal 
            className="p-fluid" onHide={hideDialog} >
            <Toast ref={toast}></Toast>
            <div className='m-2 p-5'>
            { !active && <div style={{backgroundColor:'#FFD1CE',borderRadius:30}} className='flex mb-5 p-3 align-items-center'>
                <i className="pi pi-exclamation-circle text-xl"/>
                <p className='font-bold ml-3'>{"ce produit n'est pas actif"}</p>
            </div>}
            <Formik 
            enableReinitialize={true}
            initialValues={initialValues} 
            validationSchema={validationSchema} 
            onSubmit={onSubmit}>
            {({ handleChange, handleSubmit,
            isSubmitting, values, errors, touched, setFieldValue })=>{
                
                const isFormFieldValid = (name) => !!(touched[name] && errors[name]);
                const getFormErrorMessage = (name) => {
                    return isFormFieldValid(name) && <small className="p-error">{errors[name]}</small>;
                };

                return(
                <>
                <div className='grid'>

                <div className='col-6'>

                <div className='mb-3'>
                    <p className="mb-2">SKU</p>
                    <InputText placeholder='sku'
                    className={classNames({ 'p-invalid':  isFormFieldValid('reference')})}
                    onChange={handleChange('reference')}
                    value={values.reference}
                    />
                    {getFormErrorMessage('reference')}
                </div>

                <div className='mb-3'>
                    <p className="mb-2">nom de produit</p>
                    <InputText placeholder='nom de produit' 
                    className={classNames({ 'p-invalid':  isFormFieldValid('nameProduct')})}
                    onChange={handleChange('nameProduct')}
                    value={values.nameProduct}
                    />
                    {getFormErrorMessage('nameProduct')}
                </div>

                <div className='mb-3'>
                    <p className="mb-2">prix</p>
                    <InputText placeholder='prix' 
                    className={classNames({ 'p-invalid':  isFormFieldValid('priceProduct')})}
                    onChange={handleChange('priceProduct')}
                    value={values.priceProduct}
                    />
                    {getFormErrorMessage('priceProduct')}
                </div>

                <div className='mb-3'>
                    <p className="mb-2">quantité</p>
                    <InputText type={'number'} placeholder='quantité' 
                    className={classNames({ 'p-invalid':  isFormFieldValid('quantityStock')})}
                    onChange={handleChange('quantityStock')}
                    value={values.quantityStock}
                    />
                    {getFormErrorMessage('quantityStock')}
                </div>

                <div className='mb-3'>
                    <p className="mb-2">quantité minimal</p>
                    <InputText type={'number'} placeholder='quantité minimal' 
                    className={classNames({ 'p-invalid':  isFormFieldValid('minOrderQuantity')})}
                    onChange={handleChange('minOrderQuantity')}
                    value={values.minOrderQuantity}
                    />
                    {getFormErrorMessage('minOrderQuantity')}
                </div>

                <div className='mb-3'>
                    <p className="mb-2">description</p>
                    <InputTextarea rows={8} cols={30} placeholder='description' 
                    className={classNames({ 'p-invalid':  isFormFieldValid('description')})}
                    onChange={handleChange('description')}
                    value={values.description}
                    />
                    {getFormErrorMessage('description')}
                </div>

                </div>
            
                <div className='col-6'>
                    {/* Dropdown category */}
                    <div className='mb-3'>
                    <p className="mb-2">catégorie</p>
                        <Dropdown 
                        value={values.category}
                        onChange={(e) => { handleChange('category')(e); getBrandsBySelectedCategory(e.value)}}
                        options={categories}
                        placeholder="choisissez une catégorie" />
                    </div>
                    {/* Dropdown brands */}
                    {brands.length > 0 && 
                    <div className='mb-3'>
                        <p className="mb-2">marque</p>
                        <div className='flex align-items-center'>
                            <Dropdown className='w-full'
                            value={values.underCategory}
                            onChange={handleChange('underCategory')}
                            options={brands}
                            placeholder="sélectionner une marque" />
                            <Button 
                            onClick={()=>setFieldValue('underCategory',null)}
                            icon="pi pi-filter-slash" 
                            className="ml-2 p-button-secondary" aria-label="filter" />
                        </div>
                    </div>
                    }

                    <div className='mb-3'>
                        <p className="mb-2">actif</p>
                        <InputSwitch checked={values.active} onChange={handleChange('active')}/>
                    </div>

                    {/* Block images */}
                    <div className='mb-3 flex flex-wrap'>
                    {values.photos.length > 0 &&
                    values.photos.map(url => {
                        return(
                            <div className="field flex flex-column align-items-center">
                            <img src={url} alt={values.nameProduct} width='100'/>
                            <Button
                            onClick={() => onClickRemoveImage(url, values.photos, values.deletedImages ,setFieldValue)}
                            icon="pi pi-times"
                            className='ml-2 p-button-rounded p-button-outlined p-button-danger p-button-sm'/>
                            </div>
                        )
                    })
                    }
                    </div>
                    {/* template upload images */}
                    <div>
                        <h5>Images</h5>
                        <FileUpload name="demo[]" url="https://primefaces.org/primereact/showcase/upload.php" 
                            ref={(el) => fileUploadRef = el} 
                            multiple
                            headerTemplate={headerTemplate}
                            accept="image/*" 
                            maxFileSize={2000000}
                            customUpload
                            uploadHandler={(e) => myUploader(values,e)}
                            onSelect={(e) => onTemplateSelect(e,setFieldValue)}
                            onError={(e) => onTemplateClear(e, setFieldValue)} 
                            onClear={(e) => onTemplateClear(e, setFieldValue)} 
                            onRemove={(e) => onTemplateRemove(e, values.numberImages, setFieldValue)}
                            emptyTemplate={<p className="m-0">Faites glisser et déposez les images ici pour les télécharger.</p>} />                     
                    </div> 

                    
                </div>     
                
                </div>
                <div className='mt-4 flex align-items-center justify-content-end'>
                <Button label="annuler" className='w-auto p-button-text mr-2' icon="pi pi-times" onClick={hideDialog}/>
                <Button 
                    disabled={isSubmitting}
                    onClick={handleSubmit} 
                    label={'modifier'}
                    className='w-auto p-button-text p-button-warning' 
                    icon="pi pi-pencil"  
                    type='submit' /> 
                </div>
                </>
                )
            }}
            </Formik>

            </div>

        </Dialog>
    </>
  )
}

export default EditProduct