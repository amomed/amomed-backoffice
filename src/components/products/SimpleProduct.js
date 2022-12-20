import React,{ useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Formik, Field } from 'formik';
import * as Yup from 'yup'
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputSwitch } from 'primereact/inputswitch';
import {CategoryService}  from '../../service/CategoryService'
import { BrandsService } from '../../service/BrandsService';
import { ProductService } from '../../service/ProductService';
import { VariantService } from '../../service/VariantService';
import {ImageService} from '../../service/ImageService';
import { FileUpload } from 'primereact/fileupload';
import { InputTextarea } from 'primereact/inputtextarea';
import { Editor } from 'primereact/editor';
import { v4 as uuidv4 } from 'uuid';


const SimpleProduct = ({categories,hideDialog,dialogVisibility,setLazyParams,setDialogVisibility}) => {
    // const [categories, setCategories] = useState([])
    const [brands, setBrands] = useState([])
    const [totalSize, setTotalSize] = useState(0)
    const [loading, setloading] = useState(false) 
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
        setloading(true)
        let firebaseUrl = []
        const imageService = new ImageService()
        const files = event.files
        
        for(let i =0; i < files.length; i++ ){
            const blob = await fetch(files[i].objectURL).then(r => r.blob()); //get blob url
            const url_product = await imageService.uploadImage(blob,`products/${files[i].name}${uuidv4()}`) // upload to firebase and get url
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
            photos: values.photos
        }
        const productService = new ProductService()
        const response = await productService.addProduct(product)
        if(response.data){
            const variant = {
                product: response.data._id,
                reference: values.reference,
                priceProduct: values.priceProduct,
                quantityStock: values.quantityStock,
                minOrderQuantity: values.minOrderQuantity,
            }
            const responseVariant = await addVariant(variant)
            if(responseVariant.data){
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
                hideDialog()
            }

        } else {
            console.log(response.error)
        }
    }

    async function addVariant(variant){
        const variantService = new VariantService()
        const response = await variantService.addVariant(variant)
        return response
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
  
                <div className='grid mb-3'>
                {/* SKU */}
                <div className='col-12 md:col-6 flex flex-column'>
                    <p className="mb-2">SKU</p>
                    <InputText
                    onChange={handleChange('reference') } 
                    placeholder='SKU'
                    onBlur={handleBlur('reference')}
                    className={classNames({ 'p-invalid':  isFormFieldValid('reference')})}
                    />
                    {getFormErrorMessage('reference')}
                </div> 

                {/* NAME PRODUCT */}
                <div className='col-12 md:col-6 flex flex-column'>
                    <p className="mb-2">nom de produit</p>
                    <InputText
                    onChange={handleChange('nameProduct')} 
                    placeholder='nom de produit'
                    onBlur={handleBlur('nameProduct')}
                    className={classNames({ 'p-invalid':  isFormFieldValid('nameProduct')})}
                    />
                    {getFormErrorMessage('nameProduct')}
                </div>
                </div>
                               
                {/* DESCRIPTION */}
                <div className='mb-3 flex flex-column'>
                    <p className="mb-2">description</p>
                     <InputTextarea  
                    rows='12' cols='50'
                    onChange={handleChange('description')} 
                    placeholder='description de produit'
                    onBlur={handleBlur('description')}
                    className={classNames({ 'p-invalid':  isFormFieldValid('description')})}
                    /> 
                    {/* <Editor style={{ height: '320px' }} 
                    onBlur={handleBlur('description')}
                    value={values.description}
                    className={classNames({ 'p-invalid':  isFormFieldValid('description')})}
                    onChange={handleChange('description')} /> */}
                    {getFormErrorMessage('description')}
                </div>

                {/* PRICE PRODUCT */}
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

                <div className='grid mb-3'>
              
                <div className='col-12 md:col-6 flex flex-column'>
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

                <div className='col-12 md:col-6 flex flex-column'>
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

                </div> 

                {/* VARIANTS */}
                {/* <TabView>
                    <TabPanel header="Dimensions">
                        <div className='col-12 md:col-6 flex flex-column'>
                            <p className="mb-2 text-sm">ajouter les dimensions</p>
                            <InputText />
                        </div>
                    </TabPanel>
                    <TabPanel header="Volume">
                        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
                        architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
                    voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.</p>
                    </TabPanel>
                    <TabPanel header="Taille">
                        <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati
                        cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
                    Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.</p>
                    </TabPanel>
                    <TabPanel header="Pointure">
                        <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati
                        cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
                    Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.</p>
                    </TabPanel>
                </TabView> */}

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

                    {/* ACTIVE */}
                    <div className='mt-3'>
                        <p className="mb-2">actif</p>
                        <InputSwitch checked={values.active} onChange={handleChange('active')}/>
                    </div>
                                        
                </div>  

                {/* Submit */}
                <div className='w-full mt-4 flex align-items-center justify-content-end'>
                    <Button 
                        loading={loading}
                        onClick={handleSubmit} 
                        label={loading ?'loading' : 'sauvegarder'}
                        className='w-auto p-button-text p-button-success' 
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

export default SimpleProduct