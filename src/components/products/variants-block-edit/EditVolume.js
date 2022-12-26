import React, { useState, useEffect } from 'react'
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Divider } from 'primereact/divider';
import { AutoComplete } from 'primereact/autocomplete';
const COLORS = require('../../../utils/Colors.json')

 

const EditVolume = ({editVariant, colorIncluded, variantData}) => {

  return (
    <>
    {
      colorIncluded
      ? <WithColor editVariant={editVariant} variantData={variantData}/>
      : <WithoutColor editVariant={editVariant} variantData={variantData}/>
    }
    </>
     
  )
}

export default EditVolume

// WITH COLOR
const WithColor=({editVariant, variantData})=>{

  const [options,setOptions]=useState([])
  const [colors,setColors]=useState(COLORS)
  const [values, setValues] = useState({
    color: variantData.item.colors,
    quantityStock: variantData.item.quantityStock,
    variantValue:variantData.item.volume
  });
  const [variant, setVariant] = useState({
    _id: variantData.item._id,
    reference: variantData.item.reference,
    minOrderQuantity: variantData.item.minOrderQuantity,
    priceProduct: variantData.item.priceProduct 
  });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setValues({
      color: variantData.item.colors,
      quantityStock: variantData.item.quantityStock,
      variantValue:variantData.item.volume
    })
    setVariant({
      _id: variantData.item._id,
      reference: variantData.item.reference,
      minOrderQuantity: variantData.item.minOrderQuantity,
      priceProduct: variantData.item.priceProduct 
    })
    setOptions(variantData.item.colors)
  },[variantData])
  console.log(values.color)

  const handleVariantInputChange = (e) => {
    const { name, value } = e.target;
    setVariant({
      ...variant,
      [name]: value,
    });
  };

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

   // ADD COLOR OPTIONS
   const addOptionLine=()=>{
    const data = {
        color: {nameColor: values.color.name, codeColor: values.color.hex},
        quantityStock:values.quantityStock,
        variantValue:values.variantValue
    }
    const resetValues = {
        color:'',
        quantityStock:0,
        minOrderQuantity:1,
        variantValue:values.variantValue
     }
    if(values.color !== '' && values.variantValue !== '' && values.quantityStock !== '' ){
      setOptions([...options,data])
      setValues(resetValues)
      setErrorMessage('')
    }else{
      setErrorMessage('remplir tout les champs')
    }
    
  }

  // PUSH VARIANT
  const _editVariant=()=>{
    let colorArr=[]
   
    // REFACTOR COLORS ARRAY
    options.forEach(item=>{
      colorArr.push({
        color:{nameColor:item.color.nameColor, codeColor: item.color.codeColor},
        quantityStock: Number(item.quantityStock)
      })
    })

    let totalQuantity=0;
    for(let i=0; i<colorArr.length; i++){
        totalQuantity += colorArr[i].quantityStock
    }
    
    const data = {
      _id: variant._id,
      reference:variant.reference,
      priceProduct:Number(variant.priceProduct),
      minOrderQuantity: Number(variant.minOrderQuantity),
      quantityStock:totalQuantity,
      size:null,
      volume:values.variantValue,
      shoeSize:null,
      color: {nameColor: null, codeColor: null},
      dimensions: null ,
      colors: colorArr
    }

    if(variant.reference !== '' && options.length > 0 && variant.priceProduct !== '' && variant.minOrderQuantity !== ''){
      editVariant(variantData.index, data)
      setOptions([])
      setValues({variantValue:''})
      setErrorMessage('')
    }else{
      setErrorMessage('remplir tout les champs')
    }

  }

  //REMOVE OPTION
  const removeOption=(item,index)=>{
    const newArr=[...options]
    newArr.splice(index,1)
    setOptions(newArr)
    setColors([...colors,item.color])
  }

  // UNIQUE COLORS
  const colorFilter = () => {
    let uniqueColors = []
    let exists = false
    if(options.length > 0) {
      colors.map((item) => {
        exists = false
        options.map(({color}) => {
          if(item.hex === color.codeColor) {
            exists = true
            return;
          }
        })
        !exists && uniqueColors.push(item)
      })
    }
    else{
      uniqueColors = colors
    }
    setColors(uniqueColors)
  }

  useEffect(()=>{
    colorFilter()
  },[options])
  
  return (
    <>
    <div className='card flex flex-column w-full mt-4 surface-200'>
      <div className='w-full flex justify-content-between'>

        <div className='mr-2 w-3'>
        <InputText
          value={values.variantValue} 
          name='variantValue'
          onChange={handleInputChange}
          disabled={options.length > 0}
          placeholder='volume'/>
          <label className='text-sm'>{'volume'}</label>
        </div>

        <div className='mr-2 w-3'>
          <InputText 
          placeholder='sku'
          value={variant.reference}
          onChange={handleVariantInputChange}
          name='reference'
          />
          <label className='text-sm'>reference</label>
        </div>

        <div className='mr-2 w-3'>
          <InputText 
          placeholder='prix' 
          value={variant.priceProduct}
          onChange={handleVariantInputChange}
          name='priceProduct'
          type={'number'} />
          <label className='text-sm'>prix</label>
        </div>

        <div className='w-3'>
            <InputText 
            placeholder='quantité minimal'
            type={'number'} 
            value={variant.minOrderQuantity}
            onChange={handleVariantInputChange}
            name='minOrderQuantity'
            />
            <label className='text-sm'>quantité minimal</label>
        </div>

      </div>

      <Divider/>

      <div className='w-full flex flex-column justify-content-between'>
      {
      options.length!==0
        &&<div className='mb-3 card flex flex-column align-items-center'>
        {
        options.map((item,index)=>{
          
            return(
              <div key={index} className='justify-content-between align-items-center flex w-full'>
                <div className='w-full flex align-items-center'>
                  <div className='mr-5'><p>{values.variantValue}</p></div>
                  <div className='flex mr-5 w-2'>
                    <div style={{height:20,width:20,backgroundColor:item.color.codeColor}} />
                    <p className='ml-1'>{item.color.nameColor}</p>
                  </div>
                  <div className='align-items-center mr-5 flex'>
                    <span className='font-bold mr-1'>quantité :</span>
                    <p>{item.quantityStock} pcs</p>
                  </div>
                </div>
                <Button 
                onClick={()=>removeOption(item,index)}
                label='supprimer' 
                className='w-auto p-button-sm p-button-danger p-button-text' />
              </div>
            )
          })
        }
      </div>
      }

        <div className='flex justify-content-between'>

          <div className='w-11 w-full flex align-items-center'>

          <div className='mr-2 w-6'>
            <Dropdown 
            value={values.color} 
            itemTemplate={itemTemplate}
            options={colors} 
            onChange={handleInputChange}
            name='color'
            optionLabel="name" 
            placeholder="selectionnez un couleur" />
            <label className='text-sm'>couleur</label>
          </div>
            

          <div className='mr-2 w-6' >
            <InputText 
            value={values.quantityStock} 
            onChange={handleInputChange}
            placeholder='quantité' 
            name='quantityStock'
            type={'number'} />
            <label className='text-sm'>quantityStock</label>
          </div>

          </div>

          <div>
            <Button 
            onClick={addOptionLine}
            icon='pi pi-plus' className='p-button-outlined' />
          </div>

        </div>
      </div>
      <p style={{color:'#f00'}} className='mt-2 mb-2'>{errorMessage}</p>
      <Button 
      onClick={_editVariant}
      icon='pi pi-pencil'
      label='modifier variable' 
      className='mt-4 p-button-secondary w-auto align-self-end' />

    </div>
    </>
  )
}

const WithoutColor=({ editVariant, variantData}) => {
 
  const initialValues = {
    variantValue: variantData.item.dimension,
    quantityStock:variantData.item.quantityStock,
    minOrderQuantity:variantData.item.minOrderQuantity,
    priceProduct:variantData.item.priceProduct,
    reference:variantData.item.reference
}
 
  const [values, setValues] = useState(initialValues);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setValues({
      _id: variantData.item._id,
      color: variantData.item.COLORS,
      quantityStock: variantData.item.quantityStock,
      variantValue:variantData.item.volume,
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

  const _editVariant=()=>{
    const data = {
      _id: values._id,
      reference:values.reference,
      priceProduct:Number(values.priceProduct),
      minOrderQuantity: Number(values.minOrderQuantity),
      quantityStock:Number(values.quantityStock),
      size:null,
      volume:values.variantValue,
      shoeSize:null,
      color: {nameColor: null, codeColor: null},
      dimensions: null,
      colors: []
    }
    
    if(values.variantValue !== '' && values.reference !== '' && values.priceProduct !== '' && values.quantityStock !== '' && values.minOrderQuantity !== ''){
      editVariant(variantData.index, data)
      setValues(initialValues)
      setErrorMessage('')
    }else{
      setErrorMessage('remplir tout les champs')
    }
    
  }

  
  return (
    <>
    <div className='card flex flex-column w-full mt-4 surface-200'>
      <div className='w-full flex justify-content-between'>

      <div className='mr-2' >
        <InputText
          value={values.variantValue} 
          name='variantValue'
          onChange={handleInputChange}
          placeholder='volume'/>
          <label className='text-sm'>volume</label>
      </div>

      <div className='mr-2'>
        <InputText placeholder='sku'
        value={values.reference} 
        name='reference'
        onChange={handleInputChange}  />
        <label className='text-sm'>reference</label>
      </div>

      <div>
        <InputText placeholder='prix' type={'number'}
        value={values.priceProduct} 
        name='priceProduct'
        onChange={handleInputChange} />
        <label className='text-sm'>prix</label>
      </div>

      </div>

      <Divider/>

      <div className='w-full flex justify-content-between'>
     
      <div className='mr-2 w-6'>
        <InputText 
          value={values.quantityStock} 
          onChange={handleInputChange}
          name='quantityStock'
          placeholder='quantité' 
          type={'number'} />
        <label className='text-sm'>quantité</label>
      </div>
      
      <div className='mr-2 w-6'>
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
      className='mt-4 p-button-secondary w-auto align-self-end' />

    </div>
    </>
  )
}