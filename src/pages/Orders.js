import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { OrderService } from '../service/OrderService';
import PreviewOrder from '../components/orders/PreviewOrder';
import { Dropdown } from 'primereact/dropdown';
import { locale, addLocale } from 'primereact/api';
import StatusMenu from '../components/orders/StatusMenu';

const STATUS=[
    {
        label:'Tous les status',
        value: null
    },
    {
        label:'EN COURS',
        value:'EN COURS'
    },
    {
        label:'ÉXPEDIÉ',
        value:'ÉXPEDIÉ'
    },
    {
        label:'LIVRÉ',
        value:'LIVRÉ'
    },
    {
        label:'RETOUR',
        value:'RETOUR'
    },
    {
        label:'ANNULÉE',
        value:'ANNULÉE'
    }
]

const Orders = () => {
    const orderService = new OrderService();
    const [orders, setOrders] = useState(null);
    //--------------------------------------------
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const dt = useRef(null);
    const menu = useRef(null)
    const [toggleOptions, setToggleOptions] = useState(null); // toggle options state
    const [toggleMenu, setToggleMenu] = useState(null); // toggle menu state
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

    addLocale('fr', {
        firstDayOfWeek: 1,
        dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
        dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
        dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
        monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre' ],
        monthNamesShort: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc' ],
        today: "aujourd'hui",
        clear: 'réinitialiser'
    });
    
    locale('fr');


    useEffect(() => {
        lazyLoadData()
    }, [lazyParams]);

    // GET ORDERS
    async function lazyLoadData(){
        setLoading(true)
        const response = await orderService.getAllOrders(lazyParams,totalRecords)
        if(response.data){
            setOrders(response.data.orders)
            setTotalRecords(response.data.totalDocuments)
        } else {
            console.log(response.error)
        }
        setLoading(false)
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

    const onDateChanged = (event) => {
        setLazyParams({
            first: 0,
            rows: 10,
            page: 1,
            filters : {
                date: event.target.value, 
                status: lazyParams.filters.status, 
                customer: lazyParams.filters.customer,
                numOrder: lazyParams.filters.numOrder
            },
            sortfield: null,
            sortorder: -1
        })
    }

    const onNumOrderChanged = (event) => {
        setLazyParams({
            first: 0,
            rows: 10,
            page: 1,
            filters : {
                date: lazyParams.filters.date, 
                status: lazyParams.filters.status, 
                customer: lazyParams.filters.customer,
                numOrder: event.target.value
            },
            sortfield: null,
            sortorder: -1
        })

    }

    const onStatusChanged = (event) => {
        setLazyParams({
            first: 0,
            rows: 10,
            page: 1,
            filters : {
                date: lazyParams.filters.date, 
                status: event.value, 
                customer: lazyParams.filters.customer,
                numOrder: lazyParams.filters.numOrder
            },
            sortfield: null,
            sortorder: -1
        })
    }

    const updateOrderStatus = async (order) => {
        setLoading(true)
        const response = await orderService.updateOrderStatus(order)
        if(response.error){
            console.log(response.error)
        }
        setLoading(false)
    } 

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions flex">
                <Button 
                onClick={() => setToggleOptions(rowData._id === toggleOptions ? null : rowData._id )}
                icon={toggleOptions === rowData._id ? 'pi pi-times' : 'pi pi-cog'}
                className='p-button-text p-button-secondary p-button-rounded p-button-sm'
                 />

                {
                    toggleOptions === rowData._id && 
                    <>
                        <PreviewOrder rowData={rowData} />
                        <Button tooltip='Imprimer BL' 
                                onClick={() => {window.open(rowData.urlFacture)}}
                                tooltipOptions={{position:'bottom'}}
                                type="button" 
                                icon="pi pi-file" 
                                className="p-button-sm p-button-rounded p-button-outlined p-button-text p-button-success"/>
                    </>
                }

            {/* STATUS CHANGE */}
            { (rowData.status !== 'RETOUR' || rowData.status !== 'ANNULÉE')
            && <StatusMenu 
            rowData={rowData} 
            setToggleMenu={setToggleMenu} 
            toggleMenu={toggleMenu} 
            updateOrderStatus={updateOrderStatus} />}

            </div>
        );
    }


    const statusCheck=(status)=>{
        let severity=''
        if(status === 'LIVRÉ') severity = '#09c902'
        else if (status === 'ÉXPEDIÉ') severity = '#2c00db'
        else if (status === 'ANNULÉE') severity = '#f00'
        else if (status === 'EN COURS') severity = '#ff9100'
        else severity = '#6e6d6d'
        return(
            <div style={{backgroundColor:severity,borderRadius:8,display:'inline-block'}} className='pr-2 pl-2'>
                <p className='font-bold' style={{color:'#fff'}}>{status}</p>
            </div>
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
            <p>{rowData.totalPriceOrder}dh</p>
        )
    }

    const commandeFilter=()=>{
        return(
            <InputText 
            placeholder='# commande' 
            value={lazyParams.filters.numOrder} 
            onChange={onNumOrderChanged} />
        )
    }

    const dateFilter=()=>{
        return(
            <Calendar
            local={'fr'}
            showButtonBar
            onChange={onDateChanged} 
            value={lazyParams.filters.date}
            placeholder='date' 
            id="basic"/>
        )
    }


    const textTemplate=(rowData,field)=>{
        let val =''
        if(field==='numOrder') val = rowData.numOrder
        else if(field==='customer') {
            if(rowData.customer !== null)
            val = rowData.customer.nameEntreprise
            else val = "client n'existe plus" 
        }
        return(
        <p>{val}</p>
      )}

      const dateTemplate=(rowData)=>{
        const date = new Date(rowData.createdAt).toLocaleDateString("fr")
        return (
            <p>{date}</p>
        )
    }

      const statusFilter=()=>{
        return(
            <Dropdown 
            placeholder='STATUT'
            value={lazyParams.filters.status}
            options={STATUS}
            onChange={onStatusChanged}
            style={{width:150}} />
        )
      }

      const emptyMessage = () => (
        <div className='pt-5 pb-5 flex align-items-center justify-centent-center'>
            <p>pas de commandes pour cette date</p>
        </div>
      )



    return (
        <div className="grid crud-demo">
                <div className="col-12">
                    <div className="card">

                    <DataTable 
                    size='small' 
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
                    emptyMessage={emptyMessage}>
                            <Column filter showFilterMenu={false} filterElement={commandeFilter} body={(val)=>textTemplate(val,'numOrder')} field="numOrder" header="# commande"></Column>
                            <Column filter showFilterMenu={false} filterElement={dateFilter} field="date" header="date" body={dateTemplate}></Column>
                            <Column body={(val)=>textTemplate(val,'customer')} field="customer.nameEntreprise" header="client"></Column>
                            <Column filter showFilterMenu={false} filterElement={statusFilter} field="status" header="statut" body={statusBodyTemplate} ></Column>
                            <Column sortable field="totalPriceOrder" header="total" body={priceBodyTemplate}></Column>
                            <Column field="quantityTotal" header="quantité"></Column>
                            <Column body={actionBodyTemplate}></Column>
                    </DataTable>
                    </div>
                </div>
            </div>
      )
}

export default Orders