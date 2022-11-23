import React, { useState, useEffect } from 'react'
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
const COLORS = require('../../../utils/Colors.json')
 
const EditColor = ({editVariant, variantData}) => {

  const initialValues = {
      color: variantData.item.color,
      quantityStock: variantData.item.quantityStock,
      minOrderQuantity: variantData.item.minOrderQuantity,
      priceProduct: variantData.item.priceProduct,
      reference: variantData.item.reference
  }

  const [values, setValues] = useState(initialValues);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setValues({
      _id: variantData.item._id,
      color: variantData.item.color,
      quantityStock: variantData.item.quantityStock,
      variantValue:variantData.item.color,
      minOrderQuantity:variantData.item.minOrderQuantity,
      priceProduct:variantData.item.priceProduct,
      reference:variantData.item.reference
    })
  },[variantData])

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

  const _editVariant = () => {
    const _data = {
      _id: values._id,
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
      editVariant(variantData.index, _data)
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
        onClick={_editVariant} 
        icon='pi pi-pencil' 
        label='modifier variable' 
        className='mt-3 p-button-secondary w-auto align-self-end' />
      </div>
  )
}

export default EditColor