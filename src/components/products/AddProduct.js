import React,{ useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { CategoryService }  from '../../service/CategoryService'
import SimpleProduct from './SimpleProduct';
import VariantProduct from './VariantProduct';

const AddProduct = ({setLazyParams}) => {
    const [dialogVisibility, setDialogVisibility] = useState(false);
    const [categories, setCategories] = useState([])
    const [visibleForm,setVidibleForm]=useState(null)
    const openModal = () => setDialogVisibility(true)


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

    const hideDialog = () => 
    {
        setDialogVisibility(false)
        setVidibleForm(null)
    }


    const displayForm=(val)=>{
        setVidibleForm(val)
    }

  

  return (
    <>
    <Button label="ajouter" 
    icon="pi pi-plus" 
    className="mr-2" onClick={openModal} />
    
        <Dialog draggable={false} visible={dialogVisibility} 
            breakpoints={{'1080px': '100vw', '640px': '100vw'}}
            maximizable 
            header={`Ajouter un nouveau produit`} 
            modal 
            className="p-fluid" 
            onHide={hideDialog}>

        {visibleForm === null 
        &&<div className='flex flex-column align-items-center justify-content-center'>
            <Button 
            onClick={()=>displayForm('simple')}
            label='produit simple' 
            className='p-button-outlined' />

            <Button 
            onClick={()=>displayForm('variant')}
            label='produit avec variables' 
            className='mt-2 p-button-outlined' />
        </div>}

            {
                visibleForm !== null
                && <>
                {
                    visibleForm === 'simple' 
                    ? <SimpleProduct 
                        setDialogVisibility={setDialogVisibility}
                        setLazyParams={setLazyParams} 
                        hideDialog={hideDialog} 
                        categories={categories}
                        dialogVisibility={dialogVisibility} /> 
                    : <VariantProduct
                        setDialogVisibility={setDialogVisibility}
                        setLazyParams={setLazyParams} 
                        hideDialog={hideDialog} 
                        categories={categories}
                        dialogVisibility={dialogVisibility}/>
                }
                </>
            }
        


        </Dialog>
    </>
  )
}

export default AddProduct

