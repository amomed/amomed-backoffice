import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ProductsCard from '../components/dashboard/ProductsCard';
import OrdersCard from '../components/dashboard/OrdersCard';
import CustomersCard from '../components/dashboard/CustomersCard';
import RevenueCard from '../components/dashboard/RevenueCard';
import { DashboardService } from '../service/DashboardService';



const Dashboard = () => {
    const dashboardService = new DashboardService()
    const dt = useRef(null);
    const [products,setProducts] = useState(null);
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 10,
        page: 1,
    })
    const [totalRecords, setTotalRecords] = useState(0)
    const [loading, setLoading] = useState(false)
    const [statistics, setStatistcs] = useState({
        totalProducts : 0,
        totalCustomers : {
            total: 0,
            active: 0,
            unactive: 0
        },
        orders : {
            ENCOURS: 0,
            EXPEDIE: 0,
            LIVRE: 0,
            RETOUR: 0,
            ANNULEE: 0,
            revenue: 0,
        },
    })


    useEffect(() => {
        lazyLoadData()
    },[lazyParams])

    useEffect(() => {
        getData()
    },[])

    async function lazyLoadData(){
        setLoading(true)
        const response = await dashboardService.getBestSellingProducts(lazyParams,totalRecords)
        if(response.data){
            setProducts(response.data.products)
            setTotalRecords(response.data.totalDocuments)
        } else {
            console.log(response.error)
        }
        setLoading(false)
    }

    async function getData(){
        const {totalProducts} = await getTotalProducts()
        const {totalCustomers} = await getTotalCustomers()
        const orders = await getStatistics()
        const _statistics = {
            totalProducts : totalProducts ,
            totalCustomers : totalCustomers,
            orders : orders,
        }
        setStatistcs(_statistics)
    }

    async function getTotalProducts(){
        const response = await dashboardService.getTotalProducts()
        if(response.data){
            return response.data
        } else {
            console.log(response)
        }
    }

    async function getTotalCustomers(){
        const response = await dashboardService.getTotalCustomers()
        if(response.data){
            return response.data
        } else {
            console.log(response.error)
        }
    }

    async function getStatistics(){
        const response = await dashboardService.getStatistics()
        if(response.data){
            return response.data
        } else {
            console.log(response.error)
        }
    }

    const onPage = (event) => {
        setLazyParams({
            first: event.first,
            rows: 10,
            page: event.page + 1,
        })
    }


    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">produits les plus vendus</h5>
        </div>
    );

    return (
        <>
        <div className="grid">

            <ProductsCard totalProducts={statistics.totalProducts}/>

            <OrdersCard orders={statistics.orders}/>

            <CustomersCard totalCustomers={statistics.totalCustomers}/>

            <RevenueCard revenue={statistics.orders.revenue}/>

        </div>

        {/* DATATABLE */}
        <div className="grid">
                <div className="col-12">
                    <div className="card">

                    <DataTable 
                    paginator 
                    lazy
                    first={lazyParams.first}
                    loading={loading}
                    rows={10} 
                    totalRecords={totalRecords} 
                    onPage={onPage} 
                    size='small' 
                    ref={dt} 
                    value={products} 
                    responsiveLayout="scroll"
                    rowHover
                    header={header} 
                    dataKey="id" 
                    paginatorTemplate=" PrevPageLink PageLinks NextPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="afficher {first} à {last} de {totalRecords} produits"
                    className="datatable-responsive"
                    emptyMessage="aucun commande trouvée">
                            <Column field="reference" header="sku"></Column>
                            <Column field="nameProduct" header="nom"></Column>
                            <Column field="totalOrdered" header="nombre de ventes"></Column>
                    </DataTable>
                    </div>
                </div>
        </div>
        </>
        
    );
}


export default Dashboard;