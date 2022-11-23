import React,{ useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Formik, Field } from 'formik';
import * as Yup from 'yup'
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { FileUpload } from 'primereact/fileupload';
import { InputTextarea } from 'primereact/inputtextarea';
import Variants from './variant blocks/Variants';
import { BrandsService } from '../../service/BrandsService';
import { ProductService } from '../../service/ProductService';
import {ImageService} from '../../service/ImageService';
import { VariantService } from '../../service/VariantService';

const VariantProduct = ({categories,hideDialog,setLazyParams}) => {

     const [brands, setBrands] = useState([])
     const [totalSize, setTotalSize] = useState(0)
     const [loading, setloading] = useState(false) 
     const [variantList,setVariantList] = useState([])
     let fileUploadRef = useRef(null);

     const initialValues = {
        nameProduct: '',
        category: null,
        underCategory: null,
        active:true,
     }

     // YUP VALIDATION
     const validationSchema = Yup.object().shape({
        nameProduct: Yup.string().required('nom obligatoire'),
        category: Yup.string().required('catégorie obligatoire'),
        description: Yup.string().required('description obligatoire'),
        active: Yup.bool(),
    })

    // GET BRANDS BY SELECTED CATEGORY
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
 
     //when the selected images uploaded
     const myUploader = async(values,event) => {
         setloading(true)
         let firebaseUrl = []
         const imageService = new ImageService()
         const files = event.files
         
         for(let i =0; i < files.length; i++ ){
             const blob = await fetch(files[i].objectURL).then(r => r.blob()); //get blob url
             const url_product = await imageService.uploadImage(blob,`products/${files[i].name}`) // upload to firebase and get url
             firebaseUrl.push(url_product.data)
         }
         values.photos = firebaseUrl
         await _addProduct(values)
         setloading(false)
 
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
        const product = {
            nameProduct: values.nameProduct,
            category: values.category,
            underCategory: values.underCategory,
            description: values.description,
            photos: values.photos,
            hasVariant: true
        }
        const productService = new ProductService()
        const response = await productService.addProduct(product)
        if(response.data){
            await addVariants(response.data._id)
            hideDialog()
            setLazyParams({
                first: 0,
                rows: 2,
                page: 1,
                filters : {
                    selectedCategory: null,
                    active: null,
                    reference: null,
                },
                sortfield: null,
                sortorder: -1
            })
        } else {
            console.log(response.error)
        }
    }

    async function addVariants(productId){
        const variantService = new VariantService()
        let variant = {}
        for(let i=0 ; i < variantList.length ; i++){
            variant = {
                product: productId,
                reference: variantList[i].reference,
                priceProduct:  variantList[i].priceProduct,
                quantityStock:  variantList[i].quantityStock,
                minOrderQuantity: variantList[i].minOrderQuantity,
                size: variantList[i].size,
                volume:variantList[i].volume,
                shoeSize:variantList[i].shoeSize,
                color:variantList[i].color,
                dimensions: variantList[i].dimensions,
                colors:variantList[i].colors
            }
            await variantService.addVariant(variant)
        }
    }
 
    // UPLOAD IMAGE TEMPLATE
    const headerTemplate = (options) => {
         const { className, chooseButton, uploadButton, cancelButton } = options;
         return (
             <div className={className} style={{backgroundColor: 'transparent', display: 'flex', alignItems: 'center'}}>
                 {chooseButton}
                 {cancelButton}
             </div>
         );
    } 

    // PUSH VARIANTS
    const pushVariants=(data)=>{
        setVariantList([...variantList,data])
    }

    // REMOVE VARIANT
    const removeVariant=(index)=>{
        const newArr=[...variantList]
        newArr.splice(index,1)
        setVariantList(newArr)
    }


   return (
     <div className='pl-0 md:pl-8 pr-0 md:pr-8 mt-2'>
             <Formik 
             enableReinitialize={true}
             initialValues={initialValues} 
             validationSchema={validationSchema}
             onSubmit={onsubmit} >
             {({ handleChange, 
                 handleSubmit,
                 isSubmitting,
                 handleBlur,
                 values, 
                 errors, 
                 touched, 
                 setFieldValue 
             }) =>
             {
                 const isFormFieldValid = (name) => !!(touched[name] && errors[name]);
                 const getFormErrorMessage = (name) => {
                     return isFormFieldValid(name) && <small className="p-error mt-2">{errors[name]}</small>;
                 };
 
                 return(
                 <div className='grid'>
 
                 <div className='col-12 md:col-8'>
 
                 {/* NAME PRODUCT */}
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
                                
                 {/* DESCRIPTION */}
                 <div className='mb-3 flex flex-column'>
                     <p className="mb-2">description</p>
                      <InputTextarea  
                     rows='10' cols='50'
                     onChange={handleChange('description')} 
                     placeholder='description de produit'
                     onBlur={handleBlur('description')}
                     className={classNames({ 'p-invalid':  isFormFieldValid('description')})}
                     /> 
                     {getFormErrorMessage('description')}
                 </div>
                 
 
                {/* VARIANTS */}
                <Variants removeVariant={removeVariant} variantList={variantList} pushVariants={pushVariants}/>

                 </div>
             
                 {/* RIGHT COLUMN */}
                 <div className='col-12 md:col-4'>
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
                     
 
                     {/* IMAGES */}
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
 
                 {/* Submit */}
                 <div className='w-full mt-4 flex align-items-center justify-content-end'>
                     <Button 
                         loading={loading}
                         onClick={handleSubmit} 
                         label={loading ?'loading' : 'sauvegarder'}
                         className='w-auto p-button-success' 
                         icon="pi pi-check"  
                         type='submit' /> 
                 </div>   
                 
                 </div>
                 )
             }}
             </Formik>
     </div>
   )
}

export default VariantProduct