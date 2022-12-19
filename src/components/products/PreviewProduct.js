import React,{ useState } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'

const PreviewProduct = ({rowData,setToggleMenu}) => {
    const { nameProduct,photos,active,category,underCategory,description,quantityStock } = rowData
    const [dialogVisibility, setDialogVisibility] = useState(false);
    const hideDialog = () => {
        setToggleMenu(null)
        setDialogVisibility(false)
    }
    const openModal = () => setDialogVisibility(true)

  return (
    <>
    {/* <Button icon="pi pi-eye" className="p-button-sm p-button-rounded p-button-text p-button-info" onClick={openModal} /> */}
    <div 
          className='align-items-center flex p-2 pl-3 pr-6 menu-child'
          onClick={openModal}
          >
              <i className='pi pi-eye'></i>
              <span className='uppercase ml-2'>apercu</span>
    </div>

    <Dialog draggable={false} visible={dialogVisibility}
            breakpoints={{'1800px': '100vw', '640px': '100vw'}}
            maximizable header={`Détail de ${nameProduct}`} modal 
            className="p-fluid" onHide={hideDialog}>

            <div className='grid'>
            <div className='col-6'>
                <div className='flex pb-2'>
                    <p className='text-lg font-bold mr-3'>nom:</p>
                    <p className='text-base'>{nameProduct}</p>
                </div>
                <div className='flex pb-2'>
                    <p className='text-lg font-bold mr-3'>catégorie:</p>
                    <p className='text-base'>{category.nameCategory}</p>
                </div>
                {
                    underCategory && (
                    <div className='flex pb-2'>
                        <p className='text-lg font-bold mr-3'>marque:</p>
                        <p className='text-base'>{underCategory}</p>
                    </div>
                    )
                }
                <div className='flex pb-2'>
                    <p className='text-lg font-bold mr-3'>description:</p>
                    <p className='text-base'>{description}</p>
                </div>
                <div className='flex pb-2'>
                    <p className='text-lg font-bold mr-3'>quantité de stock:</p>
                    <p style={{color:quantityStock>20?'#1CA44E':'#F00'}} 
                    className='text-base font-bold'>{quantityStock}pcs</p>
                </div>
                <div className='flex pb-2'>
                    <p className='text-lg font-bold mr-3'>status:</p>
                    <p className='text-base'>
                        {
                            active 
                            ?<p className='font-bold' style={{color:'#1CA44E'}}>activé</p>
                            :<p className='font-bold' style={{color:'#f00'}}>déactivé</p>
                        }
                    </p>
                </div>
            </div>
            <div className='col-6'>
                <div className='flex-column pb-2'>
                    <p className='text-lg font-bold'>images:</p>
                    <div className='flex flex-wrap'>
                        {
                            photos.map((url,index)=>{
                                if(url){
                                    return (<img 
                                        className='mr-2'
                                        src={url} 
                                        key={index.toString()} 
                                        alt={nameProduct}
                                        width='150' />)
                                }
                                })
                        }
                    </div>
                </div>
            </div>
            </div>

    </Dialog>
    </>
  )
}

export default PreviewProduct