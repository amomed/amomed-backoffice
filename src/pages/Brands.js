import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { BrandsService } from '../service/BrandsService';
import { CategoryService } from '../service/CategoryService';
import { InputSwitch } from 'primereact/inputswitch';
import AddBrand from '../components/brands/AddBrand';
import EditBrand from '../components/brands/EditBrand';

const Brands = () => {
    const subCategoryService = new BrandsService();
    const categoryService = new CategoryService();
    const [categories, setCategories] = useState(null);
    const [loading, setLoading] = useState(true);
    const [brands, setBrands] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const dt = useRef(null);

    const getCategories=async()=>{
        const response = await categoryService.getCategories()
        let _categories = []
        if(response.data){
            response.data.map(category => {
                _categories.push(
                    { label: category.nameCategory, value: category._id }
                )
            })
            setCategories(_categories)
        } else {
            console.log(response.error)
        }
    }

    async function getData(){
        const response = await subCategoryService.getSubCategories()
        if(response.data){
            setBrands(response.data)
            getCategories()
            setLoading(false)
        } else {
            console.log(response.error);
            setLoading(false)

        }
    }


    useEffect(() => {
        getData()
    }, []);


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <AddBrand categories={categories} createSubCategory={createSubCategory} />
                </div>
            </React.Fragment>
        )
    }


    // const imageTemplate = (rowData) => {
    //     return (
    //         <img src={rowData.img} alt={rowData.img} className="shadow-2" width="100" />
    //     )
    // }


    // UPDATE SUB CATEGORY STATUS
    const updateStatusSubCategoty = async(_id,active) => {
        const response = await subCategoryService.updateSubCategory(_id,{active})
        if(response.data){
            getData()
        } else {
            console.log(response.error);
        }
    }

    // CREATE SUB CATEGORY
    const createSubCategory = async (data) => {
        const response = await subCategoryService.createSubCategory(data)
        if(response.data){
            getData()
        } else {
            console.log(response.error);
        }
    }

    // UPDATE SUB CATEGORY
    const updateSubCategory = async (id,data) => {
        const response = await subCategoryService.updateSubCategory(id,data)
        if(response.data){
            getData()
        } else {
            console.log(response.error);
        }
    }

    // STATUS BODY TEMPLATE
    const statusBodyTemplate = (rowData) => {
        return (
            <InputSwitch checked={rowData.active} 
            onChange={(e) => 
                updateStatusSubCategoty(rowData._id,e.value)
            } />
        )
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
               <EditBrand updateSubCategory={updateSubCategory} categories={categories} rowData={rowData}/>
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gérer les Marques</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );


  return (
    <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                  
                    <DataTable size='small' stripedRows ref={dt} value={brands} responsiveLayout="scroll"
                        loading={loading} rowHover
                        globalFilter={globalFilter} header={header} paginator
                        dataKey="id" rows={25} rowsPerPageOptions={[5, 10, 25, 50]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} brands"
                        emptyMessage="aucune marque trouvée">
                            <Column sortable field="nameUnderCategory" header="marque"></Column>
                            <Column sortable field="category.nameCategory" header="catégorie"></Column>
                            {/* <Column field="img" header="image" body={imageTemplate}></Column> */}
                            <Column sortable field="active" header="status" body={statusBodyTemplate}></Column>
                            <Column body={actionBodyTemplate}></Column>
                    </DataTable>
                </div>
            </div>
        </div>
  )
}

export default Brands