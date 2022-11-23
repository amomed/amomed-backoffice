import React from 'react'

const CustomersCard = ({totalCustomers}) => {
    const {total, active, unactive} = totalCustomers
  return (
    <div className="col-12 md:col-6 xl:col-3">
        <div className="card mb-0 flex justify-content-between">
            <div className='flex flex-column'>
            <span className="block text-500 font-medium mb-3">Utilisateurs</span>

            <div className='flex align-items-center'>
                <span className="text-900 font-medium text-xl mr-2">{total}</span>
                <span className="text-500">Total</span>
            </div>
            <div className='flex align-items-center'>
                <span className="text-900 font-medium text-xl mr-2">{active}</span>
                <span className="text-500">Active</span>
            </div>
            <div className='flex align-items-center'>
                <span className="text-900 font-medium text-xl mr-2">{unactive}</span>
                <span className="text-500">non active</span>
            </div>
            </div>
            <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{width: '2.5rem', height: '2.5rem'}}>
                <i className="pi pi-user text-orange-500 text-xl"/>
            </div>
        </div>
    </div>
  )
}

export default CustomersCard