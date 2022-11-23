import React from 'react'

const RevenueCard = ({revenue}) => {
  return (
    <div className="col-12 md:col-6 xl:col-3">
    <div className="card mb-0">
            <div className="flex justify-content-between mb-3">
                <div>
                    <span className="block text-500 font-medium mb-3">Revenue</span>
                    <div className="text-900 font-medium text-xl">{revenue} dh</div>
                </div>
                <div className="flex align-items-center justify-content-center bg-green-100 border-round" style={{width: '2.5rem', height: '2.5rem'}}>
                    <i className="pi pi-dollar text-green-500 text-xl"/>
                </div>
            </div>
    </div>
</div>
  )
}

export default RevenueCard