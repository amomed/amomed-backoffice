import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { CategoryService } from '../service/CategoryService';
import { InputSwitch } from 'primereact/inputswitch';
import AddCategory from '../components/Categories/AddCategory';
import EditCategory from '../components/Categories/EditCategory';


const Categories = () => {
    const categoryService = new CategoryService();
    const [categories, setCategories] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const dt = useRef(null);

    useEffect(() => {
        getData()
    }, []);

    async function getData(){
        const response = await categoryService.getCategories()
        if(response.data){
            setCategories(response.data)
            setLoading(false)
        } else {
            console.log(response.error);
            setLoading(false)
        }
    }

    const updateStatusCategoty = async(_id,active) => {
        const response = await categoryService.updateCategory(_id,{active})
        if(response.data){
            getData()
        } else {
            console.log(response.error);
        }
    }

    const createCategory = async (nameCateogry,url) => {
        const response = await categoryService.createCategory(nameCateogry,url)
        if(response.data){
            getData()
        } else {
            console.log(response.error);
        }
    }

    const updateCtagory=async(_id,values)=>{
       
        const response = await categoryService.updateCategory(_id,values)
        if(response.data){
            getData()
        } else {
            console.log(response.error);
        }
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <AddCategory createCategory={createCategory}/>
                </div>
            </React.Fragment>
        )
    }

    const imageTemplate = (rowData) => {
        return (
            <>
            {
                rowData.photo.url !== null
                ? <img src={rowData.photo.url} alt={rowData.photo.url} className="shadow-2" width="50" />
                : <b style={{color:'#f00'}}>aucune image</b>
            }
            </>   
        )
    }


    const statusBodyTemplate = (rowData) => {
        return (
            <InputSwitch checked={rowData.active} onChange={(e) => 
                updateStatusCategoty(rowData._id,e.value)
            } />
        )
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <EditCategory updateCtagory={updateCtagory} rowData={rowData} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gérer les catégories</h5>
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
                    <DataTable size='small' 
                    loading={loading}
                    stripedRows 
                    ref={dt} 
                    value={categories} 
                    responsiveLayout="scroll"
                    rowHover 
                    selection={selectedCategory} 
                    onSelectionChange={(e) => setSelectedCategory(e.value)}
                    globalFilter={globalFilter} 
                    header={header}
                    dataKey="id" 
                    rows={10} 
                    rowsPerPageOptions={[5, 10, 25]} 
                    className="datatable-responsive"
                    emptyMessage="aucune catégorie trouvée">
                            <Column sortable field="nameCategory" header="Name"></Column>
                            <Column field="photo" header="image" body={imageTemplate}></Column>
                            <Column sortable field="active" header="status" body={statusBodyTemplate}></Column>
                            <Column body={actionBodyTemplate}></Column>
                    </DataTable>
                </div>
            </div>
        </div>
  )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Categories, comparisonFn);

