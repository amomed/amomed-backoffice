import React from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { useState } from 'react'
import AddButton from '../buttons/AddButton'
import RemoveButton from '../buttons/RemoveButton'


const Phones = ({phones, addAmomedInfo, deleteAmomedInfo}) => {

    const [phoneValue, setPhoneValue] = useState(null)

    const onAddClicked = async() => {
        if(phoneValue.length === 9)
            await addAmomedInfo({phoneNumber: phoneValue})
    }

    const onRemoveClicked = async (phone) => {
        await deleteAmomedInfo({phoneNumber: phone})
    }
    

  return (
    <div className="col-12 lg:col-6 xl:col-6">
                <div className="card p-fluid">
                <h4>numéro de télephone de support</h4>
                {phones.map(phone => (
                <div className='flex mb-1'>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">+212</span>
                        <InputText disabled 
                        value={phone}
                        placeholder="numéro de support" />
                    </div>
                    <RemoveButton onRemoveClicked={onRemoveClicked} phone={phone} />
                </div>
                ))}
                <div className='flex mt-2'>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">+212</span>
                        <InputText placeholder="numéro de support" 
                        value={phoneValue} 
                        onChange={(e) => setPhoneValue(e.target.value)} />
                    </div>
                    <AddButton onAddClicked={onAddClicked} setPhoneValue={setPhoneValue} />
                </div>
                </div>
            </div>
  )
}

export default Phones