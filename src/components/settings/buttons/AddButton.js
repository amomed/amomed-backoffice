import { Button } from "primereact/button"
import React , { useState } from "react"

const AddButton = ({onAddClicked, setEmailValue, setPhoneValue}) => {

    const [loading,setLoading] = useState(false)
 
    const _onAddClicked = async () => {
        setLoading(true)
        await onAddClicked()
        setLoading(false)
        setEmailValue ? setEmailValue("") : setPhoneValue("")
    }

    return (
        <Button
        loading={loading}
        icon="pi pi-plus" 
        className="ml-2 p-button-outlined"
        onClick={()=> _onAddClicked()}
        />
    )
}

export default AddButton