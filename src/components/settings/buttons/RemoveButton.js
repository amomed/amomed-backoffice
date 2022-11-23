import { Button } from "primereact/button"
import React , { useState } from "react"

const RemoveButton = ({onRemoveClicked, email, phone}) => {

    const [loading,setLoading] = useState(false)

    const _onRemoveClicked = async () => {
        const value = email ? email : phone
        setLoading(true)
        await onRemoveClicked(value)
        setLoading(false)
    }

    return (
    <>
        <Button 
        loading={loading}
        icon="pi pi-trash" 
        className="ml-2 p-button-rounded p-button-danger p-button-text" 
        aria-label="delete"
        onClick={() => _onRemoveClicked()}
        />
    </>    
    )

}

export default RemoveButton