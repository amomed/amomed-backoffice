import React from 'react'
import { Button } from 'primereact/button';


const StatusMenu = ({rowData,setToggleMenu,toggleMenu, updateOrderStatus}) => {

// MENU ITEMS
const Items=()=>{

let orderStatus = ['EN COURS','ÉXPEDIÉ','LIVRÉ','RETOUR','ANNULÉE']
let filteredStatus = orderStatus.filter(val => val !== rowData.status)


  const iconType = (st) => {
    if(st === 'LIVRÉ'){
      return 'pi pi-check-circle'
    }else if(st === 'ANNULÉE'){
      return 'pi pi-times-circle'
    }else if(st === 'ÉXPEDIÉ'){
      return 'pi pi-car'
    }else if(st === 'RETOUR'){
        return 'pi pi-arrow-right'
    }else return 'pi pi-box'
  }

  const onStatusClicked = (status) => {
    rowData.status = status
    updateOrderStatus(rowData)
    setToggleMenu(rowData._id === toggleMenu ? null : rowData._id )
  }



  return(
    <>
    {
      filteredStatus.map(val=>{
        return(
          <div 
          key={val} className='align-items-center flex p-2 pl-3 pr-6 menu-child'
          onClick={() => onStatusClicked(val)}
          >
              <i className={iconType(val)}></i>
              <span className='uppercase ml-2'>{val}</span>
          </div>
        )
      })
    }
    </>
  )
}

  return (
    <>
      <Button 
      onClick={() => setToggleMenu(rowData._id === toggleMenu ? null : rowData._id )}
      icon={toggleMenu === rowData._id ? 'pi pi-times' : 'pi pi-bars'} className='p-button-text p-button-secondary p-2' />
      {
      rowData._id === toggleMenu 
        && <div className='pb-2 pt-2 options-menu'>
            {Items()}
        </div>
      }
   </>
  )
}

export default StatusMenu