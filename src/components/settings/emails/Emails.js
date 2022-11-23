import React, { useState } from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import AddButton from '../buttons/AddButton'
import RemoveButton from '../buttons/RemoveButton'

const Emails = ({emails, addAmomedInfo, deleteAmomedInfo}) => {
   const [emailValue, setEmailValue] = useState(null)

   const onAddClicked = async () => {
    await addAmomedInfo({email: emailValue})
   }

   const onRemoveClicked = async (email) => {
    await deleteAmomedInfo({email: email})
   }

  return (
    <div className="col-12 lg:col-6 xl:col-6">
                <div className="card p-fluid">
                <h4>les émails de support</h4>
                {emails.map(email => (
                <div className='flex mb-1'>
                    <div className="p-inputgroup">
                        <InputText disabled type={'email'}
                        value={email}/>
                    </div>
                    <RemoveButton onRemoveClicked={onRemoveClicked} email={email} />
                </div>
                ))}
                <div className='flex mt-2'>
                    <div className="p-inputgroup">
                        <InputText placeholder="email d'admin" value={emailValue} onChange={(e) => setEmailValue(e.target.value)} />
                    </div>
                    <AddButton onAddClicked={onAddClicked} setEmailValue={setEmailValue} />
                </div>
                </div>
            </div>
  )
}

export default Emails