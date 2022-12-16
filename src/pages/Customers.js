import React,{ useEffect, useRef, useState } from 'react'
import { DataTable } from 'primereact/datatable';
import { Badge } from 'primereact/badge';
import { Toolbar } from 'primereact/toolbar';
import { Column } from 'primereact/column';
import SingleDelete from '../components/SingleDelete';
import EditCustomer from '../components/customers/EditCustomer';
import AddCustomer from '../components/customers/AddCustomer';
import Cities from '../../src/utils/Ville.json'
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import EditCustomerPassword from '../components/customers/EditCustomerPassword';
//services
import { TypesService } from '../service/TypesService';
import { CustomersService } from '../service/CustomersService';
import OptionsMenu from '../components/customers/OptionsMenu';


const Customers = () => {
    const typesService = new TypesService();
    const customerService = new CustomersService();
    const [customers, setCustomers] = useState(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const [toggleOptions, setToggleOptions] = useState(null); // toggle options state
    const toast = useRef(null);
    const [types, setTypes] = useState([])
    const [types2, setTypes2] = useState([])
    const [loading, setLoading] = useState(false);
    const dt = useRef(null);
    const menu = useRef(null);
    const [toggleMenu, setToggleMenu] = useState(null); // toggle menu state
    const [lazyParams, setLazyParams] = useState({
      first: 0,
      rows: 10,
      page: 1,
      filters : {
          customerType: null,
          active: null,
          city : null,
          nameEntreprise : null,
          phoneNumber: null,
          ISE: null,
      },
  });

    useEffect(() => {
        lazyLoadData();
    },[lazyParams])

    // get all types of customers
    useEffect(() => {
      getTypes()
    }, []);

    //load customers
    async function lazyLoadData (){
      setLoading(true);
      const response = await customerService.getCustomers(lazyParams,totalRecords);
      if(response.data){
          setCustomers(response.data.customers)
          setTotalRecords(response.data.totalDocuments)
      } else {
          console.log(response.error)
      }
      setLoading(false)
    }
    async function getTypes(){
      setLoading(true);
      const response = await typesService.getCustomersTypes();
      let _types = []
      _types.push({ label: "Toutes les types", value: null, active:true })
      if(response.data){
        response.data.map(type => {
          _types.push({ label: type.customerType, value: type._id, active: type.active })
        })
        setTypes(_types)
        setTypes2(_types.filter((val,index) => index > 0 && val.active === true))
      } else {
        console.log(response.error);
      }
      setLoading(false);
    }

    const leftToolbarTemplate = () => {
      return (
          <React.Fragment>
              <div className="my-2">
                  <AddCustomer types={types2} setLazyParams={setLazyParams} />
              </div>
          </React.Fragment>
      )
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

  const textTemplate=(rowData,field)=>{
    let val =''
    if(field==='address') val = rowData.address
    else if(field==='ice') val = rowData.ISE
    else if(field==='phone') val = rowData.phoneNumber
    else val = rowData.nameEntreprise

    return(
    <p style={{width:150}}>{val}</p>
  )}


  const actionBodyTemplate = (rowData) => {
    return (
        <div className="actions flex">    
        <OptionsMenu 
        rowData={rowData}
        setToggleMenu={setToggleMenu} 
        toggleMenu={toggleMenu}
        _deleteCustomer={_deleteCustomer}
        types={types2} 
        setLazyParams={setLazyParams} />  
          {/* <Button 
          onClick={()=>setToggleOptions(rowData._id === toggleOptions ? null : rowData._id )}
          icon={toggleOptions === rowData._id ? 'pi pi-times' : 'pi pi-cog'}
          className='p-button-outlined p-button-rounded p-button-sm' />

          { toggleOptions === rowData._id && 
            <>
              <SingleDelete table='customers' rowData={rowData} _deleteCustomer={_deleteCustomer}/>
              <EditCustomer rowData={rowData} types={types2} setLazyParams={setLazyParams}/> 
              <EditCustomerPassword rowData={rowData}/>
            </>
          } */}
        </div>
    );
  }

  const _deleteCustomer = async (_id) => {
    try {
      const response = await customerService.deleteCustomer(_id)
      if(response.data){
        lazyLoadData()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const onChangeType = (e) => {
    setLazyParams({
      first: 0,
      rows: 10,
      page: 1,
      filters : {
        customerType: e.value,
        active: lazyParams.filters.active,
        city: lazyParams.filters.city,
        nameEntreprise : lazyParams.filters.nameEntreprise,
        phoneNumber: lazyParams.filters.phoneNumber,
        ISE: lazyParams.filters.ISE ,
      }
    })
  }

  const onChangeCity = (e) => {
    const city = e.value == "Toutes les villes" ? null : e.value
    setLazyParams({
      first: 0,
      rows: 10,
      page: 1,
      filters : {
          customerType: lazyParams.filters.customerType,
          active: lazyParams.filters.active,
          city: city,
          nameEntreprise : lazyParams.filters.nameEntreprise,
          phoneNumber: lazyParams.filters.phoneNumber,
          ISE: lazyParams.filters.ISE ,
      }
    })
  }

  const onPage = (event) => {
    setLazyParams({
        first: event.first,
        rows: 10,
        page: event.page + 1,
        filters : {
          customerType: lazyParams.filters.customerType,
          active: lazyParams.filters.active,
          city: lazyParams.filters.city,
          nameEntreprise : lazyParams.filters.nameEntreprise,
          phoneNumber: lazyParams.filters.phoneNumber,
          ISE: lazyParams.filters.ISE ,
        }
    })
  }

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
        <h5 className="m-0">Gérer les utilisateurs</h5>
    </div>
  );


  const cityFilter = (options) => {
    return <Dropdown 
            value={lazyParams.filters.city}
            placeholder='villes'
            filter
            optionLabel="ville" optionValue="ville"
            options={Cities} 
            onChange={onChangeCity}
            style={{width:130}}
            className="p-column-filter" />; 
  }

  const typeFilter = (options) => {
    return <Dropdown 
            value={lazyParams.filters.customerType}
            placeholder='types'
            options={types}
            style={{width:130}} 
            onChange={onChangeType}
            className="p-column-filter" />; 
  }

  const iceFilter=()=>{
    return(
      <InputText placeholder='ice' onChange={onIceChanged} value={lazyParams.filters.ISE}/>
    )
  }

  const nameFilter=()=>{
    return(
      <InputText placeholder="nom" onChange={onNameChanged} value={lazyParams.filters.nameEntreprise} />
    )
  }

  const phoneFilter=()=>{
    return(
      <InputText placeholder="téléphone" onChange={onPhoneNumberChanged} value={lazyParams.filters.phoneNumber} />
    )
  }

  const onIceChanged = (event) => {
    setLazyParams({
      first: 0,
      rows: 10,
      page: 1,
      filters : {
        customerType: lazyParams.filters.customerType,
        active: lazyParams.filters.active,
        city: lazyParams.filters.city,
        nameEntreprise : lazyParams.filters.nameEntreprise,
        phoneNumber: lazyParams.filters.phoneNumber,
        ISE: event.target.value,
      }
    })
  }

  const onNameChanged = (event) => {
    setLazyParams({
      first: 0,
      rows: 10,
      page: 1,
      filters : {
        customerType: lazyParams.filters.customerType,
        active: lazyParams.filters.active,
        city: lazyParams.filters.city,
        nameEntreprise : event.target.value,
        phoneNumber: lazyParams.filters.phoneNumber,
        ISE: lazyParams.filters.ISE,
      }
    })
  }

  const onPhoneNumberChanged = (event) => {
    setLazyParams({
      first: 0,
      rows: 10,
      page: 1,
      filters : {
        customerType: lazyParams.filters.customerType,
        active: lazyParams.filters.active,
        city: lazyParams.filters.city,
        nameEntreprise : lazyParams.filters.nameEntreprise,
        phoneNumber: event.target.value,
        ISE: lazyParams.filters.ISE,
      }
    })
  }


  return (
    <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                  
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable 
                       paginator 
                       lazy
                       first={lazyParams.first}
                       loading={loading}
                       rows={10} 
                       totalRecords={totalRecords} 
                       onPage={onPage} 
                       filterDisplay="row"
                       stripedRows 
                       ref={dt} 
                       rowHover 
                       responsiveLayout="scroll" 
                       value={customers}
                       header={header} 
                       size='small' 
                       dataKey="id" 
                       className="datatable-responsive"
                       paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                       currentPageReportTemplate="Affichée {first} à {last} de {totalRecords} clients"
                       emptyMessage="aucune client trouvée">
                            <Column  filter showFilterMenu={false} filterElement={iceFilter} field="ISE" header="ice" body={(val)=>textTemplate(val,'ice')}></Column>
                            <Column  filter showFilterMenu={false} filterElement={nameFilter} body={(val)=>textTemplate(val,'nameEntreprise')} field="nameEntreprise" header="nom d'établissment" ></Column>
                            <Column  filter showFilterMenu={false} filterElement={phoneFilter} field="phoneNumber" header="numéro téléphone" body={(val)=>textTemplate(val,'phone')}></Column>
                            <Column  field="address" header="address" body={(val)=>textTemplate(val,'address')}></Column>
                            <Column  filter filterElement={typeFilter} showFilterMenu={false} field="customerType.customerType" header="type"></Column>
                            <Column  filter filterElement={cityFilter} showFilterMenu={false} field="city" header="ville"></Column>
                            <Column  field="active" header="status" body={statusBodyTemplate}></Column>
                            <Column body={actionBodyTemplate}></Column>
                    </DataTable>
                </div>
            </div>
        </div>
  )
}

export default Customers