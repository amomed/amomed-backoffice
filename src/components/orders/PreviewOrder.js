import React,{ useState, useRef } from 'react'
import { Button } from 'primereact/button'
import { SplitButton } from 'primereact/splitbutton'
import { Dialog } from 'primereact/dialog'
import { Badge } from 'primereact/badge'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'

const PreviewOrder = ({rowData}) => {
    const {numOrder, customer, date, quantityTotal, totalPriceOrder, status, orderDetail } = rowData
    const [dialogVisibility, setDialogVisibility] = useState(false);
    const hideDialog = () => setDialogVisibility(false)
    const openModal = () => setDialogVisibility(true)
    const dt = useRef(null);

    const items = [
        {
            label: 'imprimé BL',
            icon: 'pi pi-file',
            command: () => {
                  alert('clicked')
            }
        },
        {
            label: 'imprimé facture',
            icon: 'pi pi-print',
            command: () => {
                  alert('clicked')
            }
        }
    ];

    // ORDER DATE
    const orderDate=(dt)=>{
        const date = dt.split('T')[0]
        return date
    } 

    // ORDER STATUS
    const statusCheck=(status)=>{
        let severity=''
        if(status === 'Livré') severity = 'success'
        else if (status === 'Expédié') severity = 'info'
        else if (status === 'Annulée') severity = 'danger'
        else severity = 'warning'
        return(
            <Badge value={status} severity={severity} />
        )
    }

    const imageTemplate=(rowData)=>{
        const { product, color, variant } = rowData
        return(
            <>
            {
                product?.photos.length === 0
                ? <i className='pi pi-image text-xl'></i>
                : <img src={product?.photos[0]} alt={product?.nameProduct} width='50' />
            }
            </>
        )
    }


    const productNameTemplate=(rowData)=>{
        console.log('rowData', rowData)
        const { product, color, variant } = rowData
        return(
            <>
            {
                product !== null
                ? <>
                 <p style={{fontSize:12}}>{product?.nameProduct}</p>
                 <p style={{fontSize:12}}>{displayVariants(variant,color)}</p>
                 </>
                : <p style={{color:'#f00'}}>{"ce produit n'existe plus"}</p>
            }
            </>
        )
    }

    function displayVariants(variant, selectedColor){
        const {size, dimensions, volume, color, shoeSize} = variant
        let text = ""
        if(size != null)
          text+= `taille : ${size} `
        if(dimensions != null)
          text+= `dimensions : ${dimensions} `
        if(volume != null )
          text+= `volume : ${volume} `
        if(color.nameColor != null)
          text+= `couleur : ${color.nameColor} `
        if(shoeSize != null)
          text+= `pointure : ${shoeSize} `
        if(selectedColor.nameColor != null)
          text+= `couleur : ${selectedColor.nameColor} `
      
        return text
      }

  return (
    <>
        <Button onClick={openModal} 
        type="button" icon="pi pi-eye" className="p-button-sm p-button-rounded p-button-outlined p-button-text" 
        />

        <Dialog
        maximized
        draggable={false} 
        visible={dialogVisibility} 
        modal 
        className="p-fluid" onHide={hideDialog}>

            {/* HEADER */}
            <div className='grid mb-4'>
                <div className='col-12 lg:col-6'>
                    <p className='font-bold text-3xl'>Détail de commande 541283</p>
                </div>
                <div className='col-12 lg:col-6'>
                    <div className='w-auto flex justify-content-end'>
                        <SplitButton className="p-button-text w-auto" 
                        icon='pi pi-cog' label="options" model={items} />
                    </div>
                </div>
            </div>

            <div className='grid'>
                <div className='col-12 lg:col-4'>
                <div className='mb-4 flex align-items-center'>
                    <i className='pi pi-file text-3xl mr-2'/>
                    <p className='font-bold text-xl'>Détail</p>
                </div>
                    {/* NUM COMMANDE */}
                    <div className='mb-2 flex'>
                        <p className='mr-2'><b>numéro de commande :</b></p>
                        <p>{numOrder}</p>
                    </div>
                    {/* DATE COMMANDE */}
                    <div className='mb-2 flex'>
                        <p className='mr-2'><b>date de la commande :</b></p>
                        <p>{orderDate(date)}</p>
                    </div>
                    {/* QUANTITY */}
                    <div className='mb-2 flex'>
                        <p className='mr-2'><b>quantité total :</b></p>
                        <p>{quantityTotal} pcs</p>
                    </div>
                    {/* PRICE */}
                    <div className='mb-2 flex'>
                        <p className='mr-2 text-green-500'><b>total:</b></p>
                        <p className='text-green-500'>{totalPriceOrder}dh TTC</p>
                    </div>
                    {/* PRICE */}
                    <div className='mb-2 flex'>
                        <p className='mr-2'><b>status:</b></p>
                        {statusCheck(status)}
                    </div>
                </div>

                
                
                <div className='col-12 lg:col-4'>
                    {/* CUSTOMER */}
                    <div className='mb-4 flex align-items-center'>
                        <i className='pi pi-user text-3xl mr-2'/>
                        <p className='font-bold text-xl'>Client</p>
                    </div>
                    {customer === null 
                    ? <p style={{color:'#f00'}} className='font-bold'>ce client n'existe plus</p>
                    : <>
                    <div className='mb-2 flex'>
                        <p className='mr-2'><b>Nom du client</b></p>
                        <p>{customer?.nameEntreprise}</p>
                    </div>
                    {/* ICE */}
                    <div className='mb-2 flex'>
                        <p className='mr-2'><b>ICE :</b></p>
                        <p>{customer?.ISE}</p>
                    </div>
                    {/* PHONE NUMBER */}
                    <div className='mb-2 flex'>
                        <p className='mr-2'><b>Numéro de téléphone :</b></p>
                        <p>{customer?.phoneNumber}</p>
                    </div>
                    {/* CITY */}
                    <div className='mb-2 flex'>
                        <p className='mr-2'><b>Ville :</b></p>
                        <p>{customer?.city}</p>
                    </div>
                    {/* ADDRESS */}
                    <div className='mb-2 flex'>
                        <p className='mr-2'><b>Address :</b></p>
                        <p>{customer?.address}</p>
                    </div>
                    </>}
                </div>
                
                <div className='col-12 lg:col-4'>


                {/* CUSTOMER */}
                <div className='mb-4 flex align-items-center'>
                    <i className='pi pi-box text-3xl mr-2'/>
                    <p className='font-bold text-xl'>Produits</p>
                </div>        

                <DataTable size='small' 
                        stripedRows 
                        rowHover
                        paginator
                        ref={dt} 
                        value={orderDetail} 
                        responsiveLayout="scroll"
                        dataKey="id" 
                        rows={5} 
                        filterDisplay="row"
                        paginatorTemplate="PrevPageLink PageLinks NextPageLink  RowsPerPageDropdown"
                        currentPageReportTemplate="afficher {first} à {last} de {totalRecords} produits"
                        rowsPerPageOptions={[5, 10, 25, 50]} 
                        className="datatable-responsive"
                        emptyMessage="aucun commande trouvée">
                                <Column field="product.nameProduct" header="produit" body={productNameTemplate} ></Column>
                                <Column field="product.photos" header="image" body={imageTemplate}></Column>
                                <Column field="product.priceProduct" header="prix unitaire"></Column>
                                <Column field="quantityOrdered" header="quantité" ></Column>
                                <Column field="totalPrice" header="prix total" ></Column>
                        </DataTable>

                </div>
            </div>


    </Dialog>
    </>
  )
}

export default PreviewOrder