import { Button } from 'primereact/button'
import React from 'react'
import SingleDelete from '../SingleDelete'
import EditCustomer from './EditCustomer'
import EditCustomerPassword from './EditCustomerPassword'

const OptionsMenu = ({rowData,setToggleMenu,toggleMenu,setLazyParams,_deleteCustomer,types}) => {
    return (
        <>
          <Button 
          onClick={() => setToggleMenu(rowData._id === toggleMenu ? null : rowData._id )}
          icon={toggleMenu === rowData._id ? 'pi pi-times' : 'pi pi-bars'} className='p-button-text p-button-secondary p-2' />
          {
          rowData._id === toggleMenu 
            && <div className='pb-2 pt-2 options-menu'>
                <EditCustomer rowData={rowData} types={types} setLazyParams={setLazyParams}/> 
                <EditCustomerPassword rowData={rowData} />
                <SingleDelete _deleteCustomer={_deleteCustomer}  table='products' rowData={rowData} />
            </div>
          }
       </>
      )
}

export default OptionsMenu