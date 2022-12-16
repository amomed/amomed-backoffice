import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputSwitch } from 'primereact/inputswitch';
import { Badge } from 'primereact/badge';
import PreviewProduct from '../components/products/PreviewProduct';
import EditProduct from '../components/products/EditProduct';
import SingleDelete from '../components/SingleDelete';
import { Dropdown } from 'primereact/dropdown';
import { ProductService } from '../service/ProductService';
import { CategoryService } from '../service/CategoryService';
import AddProduct from '../components/products/AddProduct';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import OptionsMenu from '../components/products/OptionsMenu';


const Products = () => {

    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [toggleOptions, setToggleOptions] = useState(null); // toggle options state
    const [toggleMenu, setToggleMenu] = useState(null); // toggle menu state
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 10,
        page: 1,
        filters : {
            selectedCategory: null,
            active: null,
            reference: null,
            nameProduct : null,
        },
        sortfield: null,
        sortorder: -1
    });
    const [products, setProducts] = useState(null);
    const [categories, setCategories] = useState(null)
    const [categories2, setCategories2] = useState([])
    const dt = useRef(null);

    // get products
    useEffect(() => {
        lazyLoadData();
    },[lazyParams])

    //get categories
    useEffect(() => {
        getCategories()
    },[])

    //load products
    async function lazyLoadData (){
        setLoading(true);
        const productsService = new ProductService()
        const response = await productsService.getProducts(lazyParams,totalRecords);
        if(response.data){
            setProducts(response.data.products)
            setTotalRecords(response.data.totalDocuments)
        } else {
            console.log(response.error)
        }
        setLoading(false)
    }
  
    //get categories
    async function getCategories(){
        const categoryService = new CategoryService()
        const  response = await categoryService.getCategories()
        let _categories = [{
            label: 'Toutes les catégories', value: null
        }]
        let _categories2 = []
        if(response.data){
            response.data.map(category => {
                _categories.push({ 
                    label: category.nameCategory, 
                    value: category._id 
                })
                _categories2.push({ 
                    label: category.nameCategory, 
                    value: category._id 
                })
            })
            setCategories(_categories)
            setCategories2(_categories2)
        } else {
            console.log(response.error)
        }
        
    }


    const imageTemplate = (rowData) => {
        if(rowData.photos){
            return(
                <img src={rowData.photos[0]} alt={rowData.nameProduct} className="shadow-2" width="50" />
            )
        }else{
        return (
            <p>{"aucune image"}</p>            
            )
        }
    }

    const statusBodyTemplate = (rowData) => {
        return (
            <>
            {
              rowData.active
              ? <Badge value='activé' size="small" severity="success"></Badge>
              : <Badge value='désactivé' size="small" severity="danger"></Badge>
            }
            </>
          )
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <OptionsMenu 
                rowData={rowData} 
                setToggleMenu={setToggleMenu} 
                toggleMenu={toggleMenu} 
                categories={categories2} 
                setLazyParams={setLazyParams}
                deleteProduct={deleteProduct} />
            </div>
        );
    }

    const quantityTemplate = (rowData) => {
        let severity = 'success'
        if(rowData.quantityStock <= 20){
            severity = 'danger'
        }
        return(
            <Badge 
            value={rowData.quantityStock.toString()}
            severity={severity}
            />
        )
    }

    const priceTemplate=(rowData)=>{
        if(rowData.maxPrice.price === rowData.minPrice.price)
            return <p>{rowData.minPrice.price}dh</p>
        else return <p>{`${rowData.maxPrice.price} - ${rowData.minPrice.price}dh`}</p>
    }

    const onPage = (event) => {
        setLazyParams({
            first: event.first,
            rows: 10,
            page: event.page + 1,
            filters : {
                selectedCategory: lazyParams.filters.selectedCategory,
                active: lazyParams.filters.active,
                reference: lazyParams.filters.reference,
                nameProduct: lazyParams.filters.nameProduct,
            },
            sortfield: lazyParams.sortfield,
            sortorder: lazyParams.sortorder,
            
        })
    }

    const onSort = (event) => {
        let sortorder 
        if(lazyParams.sortfield == null){
            sortorder = 1
        } else {
            if(event.sortField == 'priceProduct'){
                    sortorder = lazyParams.sortfield == 'quantityStock' ? 1 : lazyParams.sortorder * -1
            } else {
                sortorder = lazyParams.sortfield == 'priceProduct' ? 1 : lazyParams.sortorder * -1
            }
        }
        setLazyParams({
            first: 0,
            rows: 10,
            page: 1,
            filters : {
                selectedCategory: lazyParams.filters.selectedCategory,
                active: lazyParams.filters.active,
                reference: lazyParams.filters.reference,
                nameProduct: lazyParams.filters.nameProduct,
            },
            sortfield: event.sortField,
            sortorder: sortorder
        })    
    }

    const onChangeCategory = (event) => {
        setLazyParams({
            first: 0,
            rows: 10,
            page: 1,
            filters : {
                selectedCategory: event.value,
                active: lazyParams.filters.active,
                reference: lazyParams.filters.reference,
                nameProduct: lazyParams.filters.nameProduct,
            },
            sortfield: null,
            sortorder: -1
        })
    }

    const updateStatusProduct = async (productId,active) => {
        const productsService = new ProductService();
        const response = await productsService.updatedProduct(productId,{active})
        if(response.data){
            lazyLoadData()
        } else {
            console.log(response.error)
        }
    }

    const deleteProduct = async (productId) => {
        const productsService = new ProductService();
        const response = await productsService.removeProduct(productId)
        if(response.data){
            lazyLoadData()
        } else {
            console.log(response.error)
        }
    }

  

    const onNameProductChanged = (event) => {
        setLazyParams({
            first: 0,
            rows: 10,
            page: 1,
            filters : {
                selectedCategory: lazyParams.filters.selectedCategory,
                active: lazyParams.filters.active,
                reference: lazyParams.filters.reference,
                nameProduct: event.target.value,
            },
            sortfield: null,
            sortorder: -1
        })
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gérer les produits</h5>
        </div>
    );

    //--------------FILTERS-----------------------------
    const categoryFilter = () => {
        return <Dropdown 
                  value={lazyParams.filters.selectedCategory}
                  placeholder='Toutes les catégories'
                  options={categories} 
                  onChange={onChangeCategory}
                  className="p-column-filter" />; 
    }


    const nameProductFilter=()=>{
        return(
          <InputText placeholder='nom de produit' onChange={onNameProductChanged} value={lazyParams.filters.nameProduct}/>
        )
      }

      console.log('products :',products)

  return (
    <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <div className='mb-4'>
                        <AddProduct setLazyParams={setLazyParams}/>
                    </div>
                    <DataTable
                    paginator 
                    lazy
                    first={lazyParams.first}
                    loading={loading}
                    rows={10} 
                    totalRecords={totalRecords} 
                    onPage={onPage} 
                    onSort={onSort}
                    filterDisplay="row"
                    stripedRows 
                    ref={dt} 
                    rowHover 
                    responsiveLayout="scroll" 
                    value={products}
                    header={header} 
                    size='small'
                    dataKey="id" 
                    className="datatable-responsive"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    emptyMessage="aucune produit trouvée">
                            <Column field="category.nameCategory" header="categorie" filter showFilterMenu={false} filterElement={categoryFilter}></Column>
                            <Column field="nameProduct" header="nom" filter showFilterMenu={false} filterElement={nameProductFilter} ></Column>
                            <Column field="photos" header="image" body={imageTemplate}></Column>
                            <Column sortable field="priceProduct" header="prix" body={priceTemplate}></Column>
                            <Column sortable field="quantityStock" header="quantité" body={quantityTemplate}></Column>
                            <Column field="active" header="status" body={statusBodyTemplate}></Column>
                            <Column body={actionBodyTemplate}></Column>
                    </DataTable>
                </div>
            </div>
        </div>
  )
}

// const comparisonFn = function (prevProps, nextProps) {
//     return prevProps.location.pathname === nextProps.location.pathname;
// };

export default React.memo(Products);

