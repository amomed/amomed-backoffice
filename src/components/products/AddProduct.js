import React,{ useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Formik, Field } from 'formik';
import * as Yup from 'yup'
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { InputSwitch } from 'primereact/inputswitch';
import {CategoryService}  from '../../service/CategoryService'
import { BrandsService } from '../../service/BrandsService';
import { ProductService } from '../../service/ProductService';
import {ImageService} from '../../service/ImageService';
import { FileUpload } from 'primereact/fileupload';
import { InputTextarea } from 'primereact/inputtextarea';

const AddProduct = () => {
    const [dialogVisibility, setDialogVisibility] = useState(false);
    const [categories, setCategories] = useState([])
    const [brands, setBrands] = useState([])
    const [totalSize, setTotalSize] = useState(0)
    const hideDialog = () => setDialogVisibility(false)
    const openModal = () => setDialogVisibility(true)
    let fileUploadRef = useRef(null);
    const toast = useRef(null);

    const initialValues = {
        reference: '',
        nameProduct: '',
        category: null,
        underCategory: null,
        priceProduct:'',
        description:'',
        quantityStock:0,
        minOrderQuantity: 1,
        active:true,
    }

    //get categories when the model is open
    useEffect(() => {
        if(dialogVisibility){
            getAllCategories()
        }
    },[dialogVisibility])

    
    async function getAllCategories () {
        const categoryService = new CategoryService()
        const response = await categoryService.getCategories()
        let _categories = []
        if(response.data){
            response.data.map(category => {
                _categories.push(
                    { label: category.nameCategory, value: category._id }
                )
            })
            setCategories(_categories)
        } else {
            console.log(response.error)
        }
    }

    async function getBrandsBySelectedCategory(categoryId) {
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
        fileUploadRef.clear()
        values.photos = firebaseUrl
        _addProduct(values)
    }

    //when an image added
    const onTemplateSelect = (e) => {
        setTotalSize(e.files[0].size + totalSize)
    }

    //when an image removed
    const onTemplateRemove = (e) => {
        setTotalSize(totalSize - e.file.size)
    }

    //when all images removed
    const onTemplateClear = () => {
        setTotalSize(0)
    }

    //create products
    async function onsubmit(values,actions){
        fileUploadRef.upload()
    }

    async function _addProduct(values){

        const productService = new ProductService()
        const response = await productService.addProduct(values)
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
        minOrderQuantity: Yup.number().required('quantité minimal obligatoire')
                                        .test(
                                            'Is positive?', 
                                            'La quantité doit être supérieure à 0!', 
                                            (value) => value > 0
                                        ),
        active: Yup.bool(),
    })

    const renderFooter = () => {
        return (
            <div>
                <Button label="annuler" className='w-auto p-button-text mr-2' icon="pi pi-times" onClick={hideDialog}/>
                <Button onClick={() => console.log("pressed")} label="sauvegarder" className='w-auto p-button-text p-button-success' icon="pi pi-check" />
            </div>
        );
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
    <Button label="ajouter" 
    icon="pi pi-plus" 
    className="mr-2" onClick={openModal} />
    
    <Dialog draggable={false} visible={dialogVisibility} breakpoints={{'1080px': '100vw', '640px': '100vw'}}
            maximizable header={`Ajouter un nouveau produit`} modal 
            className="p-fluid" onHide={hideDialog}>
            <div className='m-2 p-5'>
            <Formik 
            enableReinitialize={true}
            initialValues={initialValues} 
            validationSchema={validationSchema}
            onSubmit={onsubmit} >
            {({ handleChange, handleSubmit,
                isSubmitting,handleBlur, values, errors, touched, setFieldValue 
            }) =>
            {
                const isFormFieldValid = (name) => !!(touched[name] && errors[name]);
                const getFormErrorMessage = (name) => {
                    return isFormFieldValid(name) && <small className="p-error mt-2">{errors[name]}</small>;
                };

                return(
                <div className='grid'>

                <div className='col-6'>

                <div className='mb-3 flex flex-column'>
                    <p className="mb-2">SKU</p>
                    <InputText
                    onChange={handleChange('reference') } 
                    placeholder='SKU'
                    onBlur={handleBlur('reference')}
                    className={classNames({ 'p-invalid':  isFormFieldValid('reference')})}
                    />
                    {getFormErrorMessage('reference')}
                </div>

                <div className='mb-3 flex flex-column'>
                    <p className="mb-2">nom de produit</p>
                    <InputText
                    onChange={handleChange('nameProduct')} 
                    placeholder='nom de produit'
                    onBlur={handleBlur('nameProduct')}
                    className={classNames({ 'p-invalid':  isFormFieldValid('nameProduct')})}
                    />
                    {getFormErrorMessage('nameProduct')}
                </div>

                <div className='mb-3 flex flex-column'>
                    <p className="mb-2">prix</p>
                    <InputText 
                    type={'number'}
                    onChange={handleChange('priceProduct')} 
                    placeholder='prix'
                    onBlur={handleBlur('priceProduct')}
                    className={classNames({ 'p-invalid':  isFormFieldValid('priceProduct')})}
                    />
                    {getFormErrorMessage('priceProduct')}
                </div>

                <div className='mb-3 flex flex-column'>
                    <p className="mb-2">quantité</p>
                    <InputText 
                    type={'number'}
                    value={values.quantityStock}
                    onChange={handleChange('quantityStock')} 
                    placeholder='quantité'
                    onBlur={handleBlur('quantityStock')}
                    className={classNames({ 'p-invalid':  isFormFieldValid('quantityStock')})}
                    />
                    {getFormErrorMessage('quantityStock')}
                </div>

                <div className='mb-3 flex flex-column'>
                    <p className="mb-2">quantité minimal</p>
                    <InputText 
                    type={'number'}
                    value={values.minOrderQuantity}
                    onChange={handleChange('minOrderQuantity')} 
                    placeholder='quantité minimal'
                    onBlur={handleBlur('minOrderQuantity')}
                    className={classNames({ 'p-invalid':  isFormFieldValid('minOrderQuantity')})}
                    />
                    {getFormErrorMessage('minOrderQuantity')}
                </div>

                <div className='mb-3 flex flex-column'>
                    <p className="mb-2">description</p>
                    <InputTextarea  
                    rows='4' cols='50'
                    onChange={handleChange('description')} 
                    placeholder='description de produit'
                    onBlur={handleBlur('description')}
                    className={classNames({ 'p-invalid':  isFormFieldValid('description')})}
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
                        placeholder = "choisissez une catégorie"
                        className={classNames({ 'p-invalid':  isFormFieldValid('description')})} /> 
                        {getFormErrorMessage('category')}
                    </div>
                    {/* Dropdown brands */}
                    {
                    values.category != null &&
                    <div className='mb-3'>
                        <p className="mb-2">marque</p>
                        <div className='flex align-items-center'>
                            <Dropdown className='w-full'
                            value={values.underCategory}
                            onChange={handleChange('underCategory')}
                            options={brands}
                            placeholder="sélectionner une marque" />
                            <Button 
                            onClick={() => setFieldValue('underCategory',null) }
                            icon="pi pi-filter-slash" 
                            className="ml-2 p-button-secondary" aria-label="filter" />
                        </div>
                    </div>
                    }
                    <div className='mb-3'>
                        <p className="mb-2">actif</p>
                        <InputSwitch checked={values.active} onChange={handleChange('active')}/>
                    </div>
                    {/* template upload images */}
                    <div>
                        <Toast ref={toast}></Toast>
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
                                onSelect={onTemplateSelect}
                                onError={onTemplateClear} onClear={onTemplateClear} onRemove={onTemplateRemove}
                                emptyTemplate={<p className="m-0">Faites glisser et déposez les images ici pour les télécharger.</p>} />
                        </div>
                    </div>  
                                        
                </div>  

                {/* Submit */}
                <div className='w-full mt-4 flex align-items-center justify-content-end'>
                    <Button 
                        disabled={isSubmitting}
                        onClick={handleSubmit} 
                        label={isSubmitting ?'loading' : 'sauvegarder'}
                        loading={isSubmitting}
                        className='w-auto p-button-text p-button-success' 
                        icon="pi pi-check"  
                        type='submit' /> 
                </div>   
                
                </div>
                )
            }}
            </Formik>

            </div>

        </Dialog>
    </>
  )
}

export default AddProduct

