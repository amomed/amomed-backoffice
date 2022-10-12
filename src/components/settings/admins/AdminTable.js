import React,{ useState, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import AddAdmin from './AddAdmin'
import { Badge } from 'primereact/badge';
import PreviewAdmin from './PreviewAdmin';
import EditAdmin from './EditAdmin';
import SingleDelete from '../../SingleDelete';
import { Column } from 'primereact/column';

const ADMINS = [
    {
        id:0,
        name:'Morad',
        type:'superior',
        username:'morad@amomed',
        password:'123456789'
    },
    {
        id:1,
        name:'Ilhame',
        type:'inferior',
        username:'ilhame@amomed',
        password:'54871033'
    }
]

const AdminTable = () => {
    const dt = useRef(null);

    const typeTemplate = (rowData) =>{
        return(
            <Badge severity={rowData.type === 'superior' ? 'info' : 'warning'} 
            value={rowData.type === 'superior' ? 'admin supérieur' : 'sous admin'}/>
        )
      }
    
      const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <PreviewAdmin rowData={rowData} />
                <EditAdmin rowData={rowData}/>
                {
                    rowData.type === 'inferior'
                    && <SingleDelete table='admins' rowData={rowData.name} />
                }
            </div>
        );
      }

  return (
    <>
    <div className="col-12 lg:col-6 xl:col-6">
    <div className="card p-fluid">
    <div className='mb-2 flex align-items-center justify-content-between'>
    <h4>Admin</h4>
    <AddAdmin/>
    </div>
    <DataTable stripedRows ref={dt} rowHover paginator
        responsiveLayout="scroll" value={ADMINS}
        size='normal'
        dataKey="id" rows={5}  
        className="datatable-responsive"
        paginatorTemplate="PrevPageLink PageLinks NextPageLink CurrentPageReport"
        emptyMessage="aucune produit trouvée">
                <Column field="name" header="nom"></Column>
                <Column field="type" header="type" body={typeTemplate} ></Column>   
                <Column body={actionBodyTemplate}></Column>                    
        </DataTable>
    </div>
    </div>
    </>
  )
}

export default AdminTable