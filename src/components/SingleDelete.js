import React,{ useState, useEffect } from 'react'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';


const SingleDelete=({rowData,table, deleteProduct, _deleteCustomer,setToggleMenu})=> {

const [deleteDialog, setDeleteDialog] = useState(false);
const confirmDelete = () => setDeleteDialog(true) 
const hideDeleteDialog = () => {
    deleteProduct && setToggleMenu(null)
    setDeleteDialog(false) 
}

const handleDelete = (_id) => {
    if (deleteProduct)
        deleteProduct(_id)
    else if(_deleteCustomer)
        _deleteCustomer(_id)
    hideDeleteDialog()


}

const showDataName = () => {
    if(rowData.nameProduct){
        return rowData.nameProduct
    } else if(rowData.nameEntreprise){
        return rowData.nameEntreprise
    }
}



const deleteDialogFooter = (
    <>
        <Button label="non" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDialog} />
        <Button label="oui" icon="pi pi-trash" className="p-button-text p-button-danger" 
                onClick={()=> { handleDelete(rowData._id)}}/>
    </>
);


return (
    <>

    <div 
          className='align-items-center flex p-2 pl-3 pr-6 menu-child'
          onClick={() => confirmDelete()}
          >
              <i style={{color:'#f00'}} className='pi pi-trash'></i>
              <span className='uppercase ml-2' style={{color:'#f00'}}>supprimmer</span>
    </div>

    <Dialog visible={deleteDialog} style={{ width: '450px' }} header="Confirmer" modal 
        footer={deleteDialogFooter} 
        onHide={hideDeleteDialog}>
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