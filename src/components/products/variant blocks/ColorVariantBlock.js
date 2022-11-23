import React, { useState, useEffect } from 'react'
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
const COLORS = require('../../../utils/Colors.json')
 

const ColorVariantBlock = ({pushVariants}) => {

  const initialValues = {
      color: '',
      quantityStock:0,
      minOrderQuantity:1,
      priceProduct:0,
      reference:''
  }

    const [values, setValues] = useState(initialValues);
    const [errorMessage, setErrorMessage] = useState('');


    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setValues({
        ...values,
        [name]: value,
      });
    };

    // COLOR DROPDOWN
    const itemTemplate = (item) => {
      return (
          <div className="country-item flex">
            <div style={{height:20,width:20,backgroundColor:item.hex}} className='mr-2'/>
            <div>{item.name}</div>
          </div>
      );
    }

    const addVariant=()=>{
      const data = {
        reference:values.reference,
        priceProduct:Number(values.priceProduct),
        minOrderQuantity: Number(values.minOrderQuantity),
        quantityStock:Number(values.quantityStock),
        size:null,
        volume:null,
        shoeSize:null,
        color:values.color,
        dimensions: null,
        colors:[]
      }
      if(values.color !== '' && values.reference !== '' && values.priceProduct !=='' && values.quantityStock !== '' && values.minOrderQuantity !== '' ){
        console.log(data)
        pushVariants(data)
        setErrorMessage('')
      }else{
        setErrorMessage('remplir touts les champs')
      }
    }



  return (
      <div className='card flex flex-column w-full mt-4 surface-200'>
        
        <div className='w-full flex justify-content-between'>
          <div className='mr-2 w-6'>
            <InputText placeholder='sku'
            value={values.reference} 
            onChange={handleInputChange}
            name='reference'/>
            <label className='text-sm'>sku</label>
          </div>
          <div className='w-6' >
            <InputText placeholder='prix' type={'number'}
            value={values.priceProduct} 
            onChange={handleInputChange}
            name='priceProduct'/>
            <label className='text-sm'>prix</label>
          </div>
        </div>
  
        
  
          <div className='mt-3 flex justify-content-between'>

            <div className='mr-2 w-4'>
            <Dropdown 
            value={values.color} 
            itemTemplate={itemTemplate}
            options={COLORS} 
            onChange={handleInputChange}
            name='color'
            optionLabel="name" 
            placeholder="selectionnez un couleur" />
            <label className='text-sm'>couleur</label>
          </div>
  
          <div className='mr-2 w-4' >
            <InputText 
            value={values.quantityStock} 
            onChange={handleInputChange}
            placeholder='quantité' 
            name='quantityStock'
            type={'number'} />
            <label className='text-sm'>quantité</label>
          </div>
  
          <div className='mr-2 w-4'>
            <InputText 
            value={values.minOrderQuantity} 
            onChange={handleInputChange}
            placeholder='quantité minimal' 
            name='minOrderQuantity'
            type={'number'} />
              <label className='text-sm'>quantité minimal</label>
          </div>
          </div>

          <p style={{color:'#f00'}} className='mt-2 mb-2'>{errorMessage}</p>
        
        <Button
        onClick={addVariant} 
        icon='pi pi-plus' 
        label='ajouter variable' 
        className='mt-3 p-button-secondary w-auto align-self-end' />
  
      </div>
  )
}

export default ColorVariantBlock