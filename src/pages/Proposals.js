import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Badge } from 'primereact/badge';

const DATA=[
  {
    id:0,
    customer:'pharmacie ritaj',
    proposition:'doliprane',
    date:'2022-10-07'
  }
]

const Proposals = () => {
  const dt = useRef(null);


  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
        <h5 className="m-0">Les propositions des clients</h5>
    </div>
);

  return (
    <div className="grid crud-demo">
            <div className="col-12">

                <div className="card">
                    <DataTable size='small' 
                    stripedRows 
                    paginator
                    ref={dt} 
                    value={DATA} 
                    responsiveLayout="scroll"
                    rowHover 
                    header={header}
                    dataKey="id" 
                    rows={10} 
                    filterDisplay="row"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="afficher {first} à {last} de {totalRecords} commandes"
                    rowsPerPageOptions={[5, 10, 25, 50]} 
                    className="datatable-responsive"
                    emptyMessage="aucun proposition trouvée">
                            <Column field="date" header="date"></Column>
                            <Column field="customer" header="client"></Column>
                            <Column field="proposition" header="proposition"></Column>
                    </DataTable>
                </div>

            </div>
        </div>
  )
}

export default Proposals