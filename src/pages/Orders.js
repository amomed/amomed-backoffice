import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Badge } from 'primereact/badge';
import { OrderService } from '../service/OrderService';
import PreviewOrder from '../components/orders/PreviewOrder';
import { Dropdown } from 'primereact/dropdown';

const STATUS=[
    {
        label:'toutes les status',
        value:'1'
    },
    {
        label:'Livré',
        value:'2'
    },
    {
        label:'Éxpédié',
        value:'3'
    },
    {
        label:'Retour',
        value:'4'
    },
    {
        label:'En cours',
        value:'5'
    }]

const Orders = () => {
    const orderService = new OrderService();
    const [orders, setOrders] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const dt = useRef(null);
    const [toggleOptions, setToggleOptions] = useState(null); // toggle options state
    const [totalRecords, setTotalRecords] = useState(0);
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 10,
        page: 1,
        filters : {
            date: null, 
            status: null, 
            customer: null,
            numOrder: null
        },
        sortfield: null,
        sortorder: -1
    });


    useEffect(() => {
        lazyLoadData()
    }, [lazyParams]);

    // GET ORDERS
    async function lazyLoadData(){
        const response = await orderService.getAllOrders(lazyParams,totalRecords)
        if(response.data){
            setOrders(response.data.orders)
            setTotalRecords(response.data.totalDocuments)
            setLoading(false)
        } else {
            console.log(response.error)
            setLoading(false)
        }
    }

    const onPage = (event) => {
        setLazyParams({
            first: event.first,
            rows: 10,
            page: event.page + 1,
            filters : {
                date: lazyParams.filters.date, 
                status: lazyParams.filters.status, 
                customer: lazyParams.filters.customer,
                numOrder: lazyParams.filters.numOrder
            },
            sortfield: lazyParams.sortfield,
            sortorder: lazyParams.sortorder
        })
    }

    const onSort = (event) => {
        setLazyParams({
            first: 0,
            rows: 10,
            page: event.page + 1,
            filters : {
                date: lazyParams.filters.date, 
                status: lazyParams.filters.status, 
                customer: lazyParams.filters.customer,
                numOrder: lazyParams.filters.numOrder
            },
            sortfield: event.sortfield,
            sortorder: lazyParams.sortorder * -1
        })
    }


    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">

                <Button 
                onClick={()=>setToggleOptions(rowData._id === toggleOptions ? null : rowData._id )}
                icon={toggleOptions === rowData._id ? 'pi pi-times' : 'pi pi-cog'}
                className='p-button-text p-button-rounded p-button-sm'
                 />

                {
                    toggleOptions === rowData._id && 
                    <>
                        <PreviewOrder rowData={rowData} />
                        <Button tooltip='imprimé BL' 
                        tooltipOptions={{position:'bottom'}}
                                type="button" 
                                icon="pi pi-file" 
                                className="p-button-sm p-button-rounded p-button-outlined p-button-text p-button-success"/>
                        <Button tooltip='imprimé facture' 
                        tooltipOptions={{position:'bottom'}}
                                type="button" 
                                icon="pi pi-print" 
                                className="p-button-sm p-button-rounded p-button-outlined p-button-text p-button-warning"/>
                    </>
                }
            </div>
        );
    }

    const dateTemplate=(rowData)=>{
        const date = rowData.createdAt.split('T')[0]
        return (
            <p style={{width:150}}>{date}</p>
        )
    }

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

    const statusBodyTemplate=(rowData)=>{
        return(statusCheck(rowData.status))
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gérer les commandes</h5>
        </div>
    );

    const priceBodyTemplate=(rowData)=>{
        return(
            <p className='font-bold'>{rowData.totalPriceOrder}dh</p>
        )
    }

    const commandeFilter=()=>{
        return(
            <InputText placeholder='num commande' />
        )
    }

    const dateFilter=()=>{
        return(
            <Calendar placeholder='date' id="basic"/>
        )
    }

    const customerFilter=()=>{
        return(
            <InputText placeholder='nom client' />
        )
    }

    const textTemplate=(rowData,field)=>{
        console.log(rowData)
        let val =''
        if(field==='numOrder') val = rowData.numOrder
        else if(field==='customer') {
            if(rowData.customer !== null)
            val = rowData.customer.nameEntreprise
            else val = "client n'existe plus" 
        }
    
        return(
        <p style={{width:110}}>{val}</p>
      )}

      const statusFilter=()=>{
        return(
            <Dropdown 
            placeholder='statut'
            options={STATUS} 
            style={{width:120}}
            className="p-column-filter" />
        )
      }



    return (
        <div className="grid crud-demo">
                <div className="col-12">
                    <div className="card">

                    <DataTable size='small' 
                    lazy
                    first={lazyParams.first}
                    loading={loading}
                    totalRecords={totalRecords} 
                    paginator
                    onPage={onPage}
                    onSort={onSort}
                    ref={dt} 
                    value={orders} 
                    responsiveLayout="scroll"
                    rowHover 
                    selection={selectedCategory}
                    header={header}
                    dataKey="id" 
                    rows={10} 
                    filterDisplay="row"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="afficher {first} à {last} de {totalRecords} commandes"
                    className="datatable-responsive"
                    emptyMessage="aucun commande trouvée">
                            <Column filter showFilterMenu={false} filterElement={commandeFilter} body={(val)=>textTemplate(val,'numOrder')} field="numOrder" header="# commande"></Column>
                            <Column filter showFilterMenu={false} filterElement={dateFilter} field="date" header="date" body={dateTemplate}></Column>
                            <Column filter showFilterMenu={false} filterElement={customerFilter} body={(val)=>textTemplate(val,'customer')} field="customer.nameEntreprise" header="client"></Column>
                            <Column filter showFilterMenu={false} filterElement={statusFilter} field="status" header="statut" body={statusBodyTemplate} ></Column>
                            <Column sortable field="totalPriceOrder" header="total" body={priceBodyTemplate}></Column>
                            <Column sortable field="quantityTotal" header="quantité total"></Column>
                            <Column body={actionBodyTemplate}></Column>
                    </DataTable>
                    </div>
                </div>
            </div>
      )
}

export default Orders