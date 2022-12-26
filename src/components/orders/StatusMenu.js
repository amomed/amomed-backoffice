import React, { useState } from 'react'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

const StatusMenu = ({rowData,setToggleMenu,toggleMenu, updateOrderStatus}) => {

  // MENU ITEMS
  const Items=()=>{
    const [updateDialog, setUpdateDialog] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState(null)
    const hideUpdateDialog = () => {
      setUpdateDialog(false) 
      setToggleMenu(null)
    }
  

    let filteredStatus = []
    switch(rowData.status){
      case 'EN COURS' : filteredStatus = ['ÉXPEDIÉ','ANNULÉE']; break;
      case 'ÉXPEDIÉ' : filteredStatus = ['LIVRÉ']; break;
      case 'LIVRÉ' : filteredStatus = ['RETOUR']; break;
    }

    const iconType = (st) => {
      if(st === 'LIVRÉ'){
        return 'pi pi-check-circle'
      }else if(st === 'ANNULÉE'){
        return 'pi pi-times-circle'
      }else if(st === 'ÉXPEDIÉ'){
        return 'pi pi-car'
      }else if(st === 'RETOUR'){
          return 'pi pi-arrow-right'
      }else return 'pi pi-box'
    }

    const onStatusClicked = () => {
      rowData.status = selectedStatus
      updateOrderStatus(rowData)
      setToggleMenu(rowData._id === toggleMenu ? null : rowData._id )
    }

    const updateDialogFooter = () => {
        return (
          <>
            <Button label="non" icon="pi pi-times" className="p-button-text" onClick={hideUpdateDialog} />
            <Button label="oui" icon="pi pi-check" className="p-button-text p-button-success" 
                    onClick={()=> { onStatusClicked()}}/>
          </>
        )
    }

    const DialogConfirmation = () => {
      return (
        <>
        <Dialog visible={updateDialog} style={{ width: '450px' }} header="Confirmer" modal 
        footer={updateDialogFooter} 
        onHide={hideUpdateDialog}>
        <div className="flex align-items-center justify-content-center"> 
        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
            <div className="flex flex-column align-items-start justify-content-center">
                <span className='mt-2'>êtes-vous sûr de vouloir <b>{selectedStatus}</b> cette commande</span>
        </div>
        </div>
      </Dialog>
        </>
      )

    }
  
    return(
      <>
      {
        filteredStatus.map(val=>{
          return(
          <>
            {DialogConfirmation()}
            <div 
            key={val} className='align-items-center flex p-2 pl-3 pr-6 menu-child'
            onClick={() => {
              setSelectedStatus(val)
              setUpdateDialog(true)
             }}
            >
                <i className={iconType(val)}></i>
                <span className='uppercase ml-2'>{val}</span>
            </div>
            </> 
          )
        })
      }
      </>
    )
  }

  return (
    <>
      <Button 
      onClick={() => setToggleMenu(rowData._id === toggleMenu ? null : rowData._id )}
      icon={toggleMenu === rowData._id ? 'pi pi-times' : 'pi pi-bars'} className='p-button-text p-button-secondary p-2' />
      {
      rowData._id === toggleMenu 
        && <div className='pb-2 pt-2 options-menu'>
            {Items()}
        </div>
      }
   </>
  )
}

export default StatusMenu