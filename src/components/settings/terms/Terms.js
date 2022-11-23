import React, { useState } from 'react'
import { Button } from 'primereact/button';
import { Editor } from 'primereact/editor';

const Terms = ({termsConditions, addAmomedInfo}) => {

  const [text1, setText1] = useState(termsConditions);
  const [loading, setLoading] = useState(false)
  
  const onSauvegarderClicked = async () => {
    setLoading(true)
    await addAmomedInfo({ termsConditions: text1 })
    setLoading(false)
  }

  return (
    <div className="col-12 lg:col-6 xl:col-6">
    <div className="card p-fluid">
    <h4>terms et conditions</h4>
    <Editor style={{ height: '320px' }} 
    value={text1} 
    onTextChange={(e) => setText1(e.htmlValue)} />
    <div className='mt-3 flex justify-content-end'>
        <Button 
        loading={loading} 
        disabled={loading}
        label='sauvegarder'
        className='w-auto p-button-success' 
        onClick={() => onSauvegarderClicked()} 
        />
    </div>
    </div>
    </div>
  )
}

export default Terms