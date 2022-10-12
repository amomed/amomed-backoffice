import React,{ useState, useEffect } from 'react'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'


const MultipleDelete = ({disabled}) => {
    const [deleteTypeDialog, setDeleteTypeDialog] = useState(false);

    const confirmDeleteSelected = () => setDeleteTypeDialog(true) 
    const hideDeleteTypeDialog = () => setDeleteTypeDialog(false)

    const deleteTypeDialogFooter = (
        <>
            <Button label="non" icon="pi pi-times" className="p-button-text" onClick={hideDeleteTypeDialog} />
            <Button label="oui" icon="pi pi-trash" className="p-button-text p-button-danger" onClick={()=>console.log('fg')} />
        </>
    );

  return (
    <>
    <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={disabled} />
    <Dialog visible={deleteTypeDialog} 
    style={{ width: '450px' }} 
    header="Confirmer" modal 
    footer={deleteTypeDialogFooter} 
    onHide={hideDeleteTypeDialog}>
        <div className="flex align-items-center justify-content-center">
            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
            <div className="flex flex-column align-items-start justify-content-center">
                <span>{'Êtes-vous sûr de vouloir supprimer les lignes sélectionnées ?'}</span>
                <span>{'cette action est irréversible'}</span>
            </div>
        </div>
    </Dialog>
    </>
  )
}

export default MultipleDelete