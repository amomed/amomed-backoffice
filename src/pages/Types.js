import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { TypesService } from '../service/TypesService';
import { InputSwitch } from 'primereact/inputswitch';
import AddType from '../components/types/AddType';
import EditType from '../components/types/EditType';

const Types = () => {
    const typesService = new TypesService();
    const [loading, setLoading] = useState(true);
    const [types, setTypes] = useState(null);
    const [selectedTypes, setSelectedType] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        getData()
    }, []);

    async function getData() {
        const response = await typesService.getCustomersTypes();
        if(response.data){
            setTypes(response.data) 
            setLoading(false)
        }else{
            console.log(response.error) 
            setLoading(false)
        }
    }


    // UPDATE CUSTOMER TYPES
    const updateType = async(_id,data) => {
        const response = await typesService.updateType(_id,data)
        if(response.data){
            getData()
            
        } else {
            console.log(response.error);
        }
    }

    // UPDATE TYPE STATUS
    const updateTypeStatus = async(_id,active) => {
        const response = await typesService.updateType(_id,{active})
        if(response.data){
            getData()
        } else {
            console.log(response.error);
        }
    }


    // CREATE CUSTOMER TYPES
    const createType = async (customerType) => {
        const typesService = new TypesService();
        const response = await typesService.createType(customerType)
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
                    <AddType createType={createType}/>
                </div>
            </React.Fragment>
        )
    }


    const statusBodyTemplate = (rowData) => {
        return (
            <InputSwitch checked={rowData.active} 
            onChange={(e) => updateTypeStatus(rowData._id,e.value)} />
        )
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <EditType updateType={updateType} rowData={rowData} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gérer les Types</h5>
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
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                  
                    <DataTable size='small' stripedRows ref={dt} value={types} responsiveLayout="scroll"
                        loading={loading} rowHover selection={selectedTypes} onSelectionChange={(e) => setSelectedType(e.value)}
                        globalFilter={globalFilter} header={header} 
                        dataKey="_id" rows={10} className="datatable-responsive"
                         emptyMessage="aucune marque trouvée">
                            <Column field="customerType" header="Name"></Column>
                            <Column field="active" header="status" body={statusBodyTemplate}></Column>
                            <Column body={actionBodyTemplate}></Column>
                    </DataTable>
                </div>
            </div>
        </div>
  )
}

export default Types