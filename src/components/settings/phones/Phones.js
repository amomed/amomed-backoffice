import React from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'


const Phones = () => {
  return (
    <div className="col-12 lg:col-6 xl:col-6">
                <div className="card p-fluid">
                <h4>numéro de télephone de support</h4>
                    <div className='flex'>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">+212</span>
                            <InputText disabled 
                            value={'624446157'}
                            placeholder="numéro de support" />
                        </div>
                        <Button icon="pi pi-trash" 
                        className="ml-2 p-button-rounded p-button-danger p-button-text" 
                        aria-label="delete" />
                    </div>

                    <div className='flex mt-2'>
                        <div className="p-inputgroup">
                            <span className="p-inputgroup-addon">+212</span>
                            <InputText placeholder="numéro de support" />
                        </div>
                        <Button icon="pi pi-plus" 
                        className="ml-2 p-button-outlined" 
                        aria-label="delete" />
                    </div>

                    <div className='mt-3 flex justify-content-end'>
                    <Button className='w-auto p-button-success'>sauvegarder</Button>
                    </div>
                </div>
            </div>
  )
}

export default Phones