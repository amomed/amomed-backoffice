import React from 'react'

const CButton = ({onClick,children,className}) => {
  return (
    <button onClick={onClick} className={className}>
        <i className='pi pi-plus mr-2'></i>
        {children}
    </button>
  )
}

export default CButton