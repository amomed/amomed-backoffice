import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProposalsService } from '../service/ProposalsService';


const Proposals = () => {
  const dt = useRef(null);
  const propsalsService = new ProposalsService()
  const [proposals, setProposals] = useState(null)
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    rows: 10,
    page: 1
  })
  const [totalRecords, setTotalRecords] = useState(0)
  const [loading, setLoading] = useState(false)

  const lazyLoadData = async () => {
    setLoading(true)
    const response = await propsalsService.getPropsals(lazyParams, totalRecords)
    if(response.data){
      setProposals(response.data.suggestions)
      setTotalRecords(response.data.totalDocuments)
    } else {
      console.log(response.error)
    }
    setLoading(false)
  }

  useEffect(() => {
    lazyLoadData()
  },[lazyParams])

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
        <h5 className="m-0">Les propositions des clients</h5>
    </div>
);

    const dateTemplate = (rowData) => {
      const date = new Date(rowData.createdAt).toLocaleDateString("fr")
      return date
    }

    const onPage = (event) => {
      setLazyParams({
        first: event.first,
        rows: 10,
        page: event.page + 1,
      })
    }

  return (
    <div className="grid crud-demo">
            <div className="col-12">

                <div className="card">
                    <DataTable size='small' 
                    lazy first={lazyParams.first} totalRecords={totalRecords}
                    onPage={onPage}
                    loading={loading}
                    stripedRows 
                    paginator
                    ref={dt} 
                    value={proposals} 
                    responsiveLayout="scroll"
                    rowHover 
                    header={header}
                    dataKey="id" 
                    rows={10} 
                    filterDisplay="row"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="afficher {first} à {last} de {totalRecords} propositions"
                    className="datatable-responsive"
                    emptyMessage="aucun proposition trouvée">
                            <Column body={dateTemplate} field="createdAt" header="date"></Column>
                            <Column  field="customer.nameEntreprise" header="client"></Column>
                            <Column field="body" header="proposition"></Column>
                    </DataTable>
                </div>

            </div>
        </div>
  )
}

export default Proposals