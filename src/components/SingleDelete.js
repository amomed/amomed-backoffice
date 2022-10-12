import React,{ useState, useEffect } from 'react'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';


const SingleDelete=({rowData,table, deleteProduct, _deleteCustomer})=> {

const [deleteCategoryDialog, setDeleteCategorytDialog] = useState(false);
const confirmDeleteCategory = () => setDeleteCategorytDialog(true) 
const hideDeleteCategoryDialog = () => setDeleteCategorytDialog(false) 

const handleDelete = (_id) => {
    if (deleteProduct)
        deleteProduct(_id)
    else if(_deleteCustomer)
        _deleteCustomer(_id)
    hideDeleteCategoryDialog(_id)


}

const showDataName = () => {
    if(rowData.nameProduct){
        return rowData.nameProduct
    } else if(rowData.nameEntreprise){
        return rowData.nameEntreprise
    }
}



const deleteCategoryDialogFooter = (
    <>
        <Button label="non" icon="pi pi-times" className="p-button-text" onClick={hideDeleteCategoryDialog} />
        <Button label="oui" icon="pi pi-trash" className="p-button-text p-button-danger" 
                onClick={()=> { handleDelete(rowData._id)}}/>
    </>
);


return (
    <>
    <Button icon="pi pi-trash" className="p-button-sm p-button-rounded p-button-text p-button-danger" onClick={() => confirmDeleteCategory()} />
        <Dialog visible={deleteCategoryDialog} style={{ width: '450px' }} header="Confirmer" modal 
        footer={deleteCategoryDialogFooter} 
        onHide={hideDeleteCategoryDialog}>

        <div className="flex align-items-center justify-content-center"> 
        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
            <div className="flex flex-column align-items-start justify-content-center">
                <span className='mt-2'>Voulez-vous vraiment supprimer <b>{showDataName()}</b>?</span>
                <span>{'cette action est irréversible'}</span>
        </div>
        </div>
        </Dialog>
    </>
  )
}

export default SingleDelete