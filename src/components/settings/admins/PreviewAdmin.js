import React,{ useState } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog';



const PreviewAdmin = ({rowData}) => {
    const { name, type, username, password } = rowData
    const [dialogVisibility, setDialogVisibility] = useState(false);
    const hideDialog = () => setDialogVisibility(false)
    const openModal = () => setDialogVisibility(true)
  return (
    <>
    <Button onClick={openModal} icon="pi pi-eye" className="p-button-sm p-button-rounded p-button-text p-button-info" />
    <Dialog draggable={false} visible={dialogVisibility} breakpoints={{'1080px': '100vw', '640px': '100vw'}}
            header={name} modal 
            className="p-fluid" onHide={hideDialog}>

            <div className='m-2 p-2'>
                
            <div className='flex pb-2'>
                <p className='text-lg font-bold mr-3'>nom :</p>
                <p className='text-base'>{name}</p>
            </div>
            <div className='flex pb-2'>
                <p className='text-lg font-bold mr-3'>type :</p>
                <p className='text-base'>{
                    type === 'superior'
                    ? 'admin supérieur'
                    : 'sous admin'
                }</p>
            </div>
            <div className='flex pb-2'>
                <p className='text-lg font-bold mr-3'>psuedo :</p>
                <p className='text-base'>{username}</p>
            </div>
            <div className='flex pb-2'>
                <p className='text-lg font-bold mr-3'>mot de pass :</p>
                <p className='text-base'>{password}</p>
            </div>
            </div>


    </Dialog>
    </>
  )
}

export default PreviewAdmin