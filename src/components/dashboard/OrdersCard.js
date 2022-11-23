import React from 'react'

const OrdersCard = ({orders}) => {
    const {ENCOURS, EXPEDIE, LIVRE, RETOUR, ANNULEE} = orders
  return (
    <div className="col-12 md:col-6 xl:col-3">
        <div className="card mb-0 flex justify-content-between">
            
            <div className='flex flex-column'>
            <span className="block text-500 font-medium mb-3">Commandes</span>
            <div className='flex align-items-center'>
                <span className="text-900 font-medium text-xl mr-2">{LIVRE}</span>
                <span className="text-500">Livré</span>
            </div>
            <div className='flex align-items-center'>
                <span className="text-900 font-medium text-xl mr-2">{EXPEDIE}</span>
                <span className="text-500">Expedié</span>
            </div>
            <div className='flex align-items-center'>
                <span className="text-900 font-medium text-xl mr-2">{ENCOURS}</span>
                <span className="text-500">En cours</span>
            </div>
            <div className='flex align-items-center'>
                <span className="text-900 font-medium text-xl mr-2">{ANNULEE}</span>
                <span className="text-500">Annulée</span>
            </div>
            <div className='flex align-items-center'>
                <span className="text-900 font-medium text-xl mr-2">{RETOUR}</span>
                <span className="text-500">Retour</span>
            </div>
            </div>
            <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{width: '2.5rem', height: '2.5rem'}}>
                <i className="pi pi-box text-purple-500 text-xl"/>
            </div>
        </div>
    </div>
  )
}

export default OrdersCard