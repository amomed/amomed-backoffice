import { Button } from 'primereact/button'
import React from 'react'
import PreviewProduct from './PreviewProduct'
import EditProduct from './EditProduct'
import SingleDelete from '../SingleDelete'
import EditVariants from './EditVariants'

const OptionsMenu = ({rowData,setToggleMenu,toggleMenu,deleteProduct,categories,setLazyParams,lazyParams}) => {
    return (
        <>
          <Button 
          onClick={() => setToggleMenu(rowData._id === toggleMenu ? null : rowData._id )}
          icon={toggleMenu === rowData._id ? 'pi pi-times' : 'pi pi-bars'} className='p-button-text p-button-secondary p-2' />
          {
            rowData._id === toggleMenu 
              && <div className='pb-2 pt-2 options-menu'>
                  <PreviewProduct rowData={rowData} setToggleMenu={setToggleMenu} />
                  <EditProduct rowData={rowData} categories={categories} setLazyParams={setLazyParams} lazyParams={lazyParams} setToggleMenu={setToggleMenu}/>
                  {rowData.hasVariant && <EditVariants productId={rowData._id} setLazyParams={setLazyParams} setToggleMenu={setToggleMenu} toggleMenu={toggleMenu} lazyParams={lazyParams}/>}
                  <SingleDelete table='products' rowData={rowData} deleteProduct={deleteProduct} setToggleMenu={setToggleMenu}/>
              </div>
          }
       </>
      )
}

export default OptionsMenu