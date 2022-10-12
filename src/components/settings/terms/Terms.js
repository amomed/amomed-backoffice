import React, { useState } from 'react'
import { Button } from 'primereact/button';
import { Editor } from 'primereact/editor';

const Terms = () => {

    const [text1, setText1] = useState('<div>Hello World!</div><div>PrimeReact <b>Editor</b> Rocks</div><div><br></div>');

  return (
    <div className="col-12 lg:col-6 xl:col-6">
    <div className="card p-fluid">
    <h4>terms et conditions</h4>
    <Editor style={{ height: '320px' }} 
    value={text1} 
    onTextChange={(e) => setText1(e.htmlValue)} />
    <div className='mt-3 flex justify-content-end'>
        <Button className='w-auto p-button-success'>sauvegarder</Button>
    </div>
    </div>
    
    </div>
  )
}

export default Terms