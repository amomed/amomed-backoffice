import React,{useEffect, useState} from 'react'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { VariantService } from '../../service/VariantService';
import DimensionVariantBlock from './variant blocks/DimensionVariantBlock';
import ColorVariantBlock from './variant blocks/ColorVariantBlock';
import PointureVariantBlock from './variant blocks/PointureVariantBlock';
import SizeVariantBlock from './variant blocks/SizeVariantBlock';
import EditColor from './variants-block-edit/EditColor'
import EditDimension from './variants-block-edit/EditDimension'
import EditPointure from './variants-block-edit/EditPointure'
import EditSize from './variants-block-edit/EditSize'
import EditVolume from './variants-block-edit/EditVolume'


const COLORS = require('../../utils/Colors.json')

const VARIANTS = [
  { value:'Couleur', name: 'Couleur', id: '0' },
  { value:'Dimension', name: 'Dimension', id: '1' },
  { value:'Taille', name: 'Taille', id: '2' },
  { value:'Pointure', name: 'Pointure', id: '3' },
  { value:'Volume', name: 'Volume', id: '4' }
];

const EditVariants = ({productId, setLazyParams, lazyParams, setToggleMenu}) => {

    const variantService = new VariantService()
    const initialValues = {
      reference: '',
      minOrderQuantity:1,
      priceProduct:0,
      colors:[],
      color:'',
      variantValue:''
    }
    const [dialogVisibility, setDialogVisibility] = useState(false);
    const [visibilityBlocks, setVisiblityBlocks] = useState({
      addBlock : false,
      editBlock : false,
    })
    const [selectedVariant,setSelectedVariant]=useState(null)
    const [selectedEditVariant,setSelectedEditVariant]=useState(null)
    const [checked,setChecked]=useState(null)
    const [values,setValues]=useState(initialValues)
    const [options,setOptions]=useState(initialValues.colors)
    const [colors,setColors]=useState(COLORS)
    const [variantData,setVariantData]=useState([])
    const [deletedVariant, setDeletedVariant]=useState([])
    const [loading , setLoading] = useState(true)
    const [disabled, setDisabled] = useState({
      variantType : true,
      colors : true,
      validate : false
    })
    const [renderedBlock,setRendredBlock]=useState(null)
    const [colorIncluded,setColorState]=useState(false)

    const onVariantChange=(e)=> setSelectedVariant(e.value)
    const openModal = () => setDialogVisibility(true)
    const hideDialog = () => {
      setToggleMenu(null)
      setDialogVisibility(false)
  }
    useEffect(() => {
      if(dialogVisibility) {
        getData()
      }
    },[dialogVisibility])
    console.log(variantData)


    useEffect(() => {
      !loading && handleAvailabilitySelectVariant()
    },[variantData])

    async function getData (){
      const response = await variantService.getVariantsByProduct(productId)
      if(response.data){
        setVariantData(response.data)
        setLoading(false)
        renderSelectedVariant(response.data[0])
      }
    }

    const renderSelectedVariant = (variant) => {
      if(variant.size != null){
        setSelectedVariant("Taille")
      } else if(variant.color.nameColor != null){
        setSelectedVariant("Couleur")
      }
      else if(variant.dimensions != null){
        setSelectedVariant("Dimension")
      } else if(variant.volume != null){
        setSelectedVariant("Volume")
      }
      else if(variant.shoeSize != null){
        setSelectedVariant("Pointure")
      }
      setChecked(variant.colors.length > 0 ? true : false)
    }

    // RENDER BLOCK OF SELECTED VARIANT
    const renderBlock = () =>{
      setVisiblityBlocks({addBlock: true, editBlock: false});
      if(checked){
          setColorState(true)
          setRendredBlock(selectedVariant)
      }else{
          setColorState(false)
          setRendredBlock(selectedVariant)
      }
    }

    const renderBlockEdit = () => {
      if(checked){
          setColorState(true)
          setRendredBlock(selectedVariant)
      }else{
          setColorState(false)
          setRendredBlock(selectedVariant)
      }
    }

    const handleAvailabilitySelectVariant = () => {
      variantData.length == 0 ? setDisabled({
        variantType : false,
        colors : false,
        validate : false
      }) : setDisabled({
          variantType : true,
          colors : true,
          validate : false
      })
    }

    const removeVariant = (index) => {
      const _variants = [...variantData]
      setDeletedVariant([...deletedVariant,variantData[index]._id])
      _variants.splice(index,1)
      setVariantData(_variants)
    }

    const deleteVariantFromDatabase = async () => {
      for (let i = 0; i<deletedVariant.length ; i++) {
        await variantService.deleteVariant(deletedVariant[i])
      }
    }    
    console.log(deletedVariant)
    // PUSH VARIANTS
    const pushVariants=(data)=>{
      setVariantData([...variantData,data])
    }

    const editVariant = (index, data) => {
      setVisiblityBlocks({addBlock:false, editBlock: false})
      const _variants = [...variantData]
      _variants[index] = data
      console.log(data)
      setVariantData(_variants)
    }

    const handleClickEdit = (item, index) => {
      const data = {item, index}
      setSelectedEditVariant(data)
      setVisiblityBlocks({addBlock:false, editBlock: true})
      renderBlockEdit()
    }

    // UNIQUE COLORS
    const colorFilter=()=>{
      let newArr = []
      let uniqueColors = [...colors]

      if(options.length !== 0){
        options.forEach((item, index) => {
          newArr.push(item?.color);
        })
      }
      
      if(newArr.length > 0){
      for (let i = 0; i < uniqueColors.length; i++) {
        for (let j = 0 ; j < newArr.length; j++) {
            if (uniqueColors[i].hex === newArr[j].hex) {
                uniqueColors.splice(i, 1)
              }
            }
          }
        }
      setColors(uniqueColors)
    }

    const onSave = async () => {
      setLoading(true)
      const variantService = new VariantService()
      for (let i = 0 ; i<variantData.length ; i++) {
        if(variantData[i]._id) {
          await variantService.editVariant(variantData[i]._id, variantData[i])
        } else {
          const _variantData = {...variantData[i],product: productId}
          console.log("variantData: ",_variantData)
          await variantService.addVariant(_variantData)
        }
      }
      await deleteVariantFromDatabase()
      hideDialog()
      setLazyParams({
        first: lazyParams.first,
        rows: lazyParams.rows,
        page: lazyParams.page,
        filters : {
            selectedCategory: lazyParams.filters.selectedCategory,
            active: lazyParams.filters.active,
            reference: lazyParams.filters.reference,
        },
        sortfield: lazyParams.sortfield,
        sortorder: lazyParams.sortorder
      })
      setLoading(false)

    }

    React.useEffect(()=>{
      colorFilter()
    },[options])


    // RENDER values VALUE
    const variantValue=(item)=>{
      if(item?.dimensions !== null) return <span className='w-2'>{item?.dimensions} cm</span>
      else if(item?.size !== null) return <span className='w-2'>{item?.size}</span>
      else if(item?.volume !== null) return <span className='w-2'>{item?.volume} ml</span>
      else if(item?.shoeSize !== null) return <span className='w-2'>{item?.shoeSize}</span>
      else if(item?.color?.nameColor !== null) return <span className='w-2'>{item?.color?.nameColor}</span>
  }

   // COLOR DROPDOWN
   const itemTemplate = (item) => {
    return (
        <div className="country-item flex">
          <div style={{height:20,width:20,backgroundColor:item.hex}} className='mr-2'/>
          <div>{item.name}</div>
        </div>
    );
  }

  return (
    <>
    <div 
        className='align-items-center flex p-2 pl-3 pr-6 menu-child'
        onClick={openModal}>
        <i className='pi pi-table'></i>
        <span className='uppercase ml-2'>modifier variable</span>
    </div>
    
        <Dialog draggable={false} visible={dialogVisibility} 
            breakpoints={{'1080px': '100vw', '640px': '100vw'}}
            maximizable
            header={`Modifier les variable de produit`} 
            modal 
            className="p-fluid" 
            onHide={hideDialog}>
        <div className='grid p-5'>
          <div className='col-6'>
          <div className='flex w-full justify-content-between mb-4'>
            <div className='flex'>
                <Dropdown 
                value={selectedVariant}
                options={VARIANTS} 
                disabled={disabled.variantType}
                onChange={onVariantChange} 
                optionLabel="name" 
                placeholder="sélectionnez" />
                <div className="flex align-items-center ml-4">
                    <Checkbox
                    disabled={disabled.colors}
                    inputId="binary"
                    checked={checked}
                    onChange={e => setChecked(e.checked)} />
                    <label className='ml-1'>Couleur inclus</label>
                </div>
            </div>
            <Button
            disabled={disabled.validate}
            onClick= {() => renderBlock()}
            label='valider' 
            className='w-auto p-button-outlined' />
          </div>
        {visibilityBlocks.addBlock && 
        <>
        { renderedBlock === 'Dimension' 
        && <DimensionVariantBlock pushVariants={pushVariants} colorIncluded={colorIncluded}/>}
        
        { renderedBlock === 'Volume' && 
        <EditVolume pushVariants={pushVariants} colorIncluded={colorIncluded}/>}
        
        { renderedBlock === 'Taille' && 
        <SizeVariantBlock pushVariants={pushVariants} colorIncluded={colorIncluded}/>}
        
        { renderedBlock === 'Pointure' && 
        <PointureVariantBlock pushVariants={pushVariants} colorIncluded={colorIncluded}/>}
        
        { renderedBlock === 'Couleur' && 
        <ColorVariantBlock pushVariants={pushVariants}/>}
        </>
        }
        {visibilityBlocks.editBlock && 
        <>
        { renderedBlock === 'Dimension' 
        && <EditDimension editVariant={editVariant} colorIncluded={colorIncluded} variantData={selectedEditVariant}/>}
        
        { renderedBlock === 'Volume' && 
        <EditVolume editVariant={editVariant} colorIncluded={colorIncluded}  variantData={selectedEditVariant}/>}
        
        { renderedBlock === 'Taille' && 
        <EditSize editVariant={editVariant} colorIncluded={colorIncluded}  variantData={selectedEditVariant}/>}
        
        { renderedBlock === 'Pointure' && 
        <EditPointure editVariant={editVariant} colorIncluded={colorIncluded}  variantData={selectedEditVariant}/>}
        
        { renderedBlock === 'Couleur' && 
        <EditColor editVariant={editVariant}  variantData={selectedEditVariant}/>}
        </>
        }

          </div>

          <div className='col-6'>
            {
              variantData.map((item,index)=>{
                return(
                  <div key={index.toString()} 
                    className='justify-content-between align-items-center flex w-full card'>
                        <div className='w-10 justify-content-between align-items-center flex'>
                        {variantValue(item)}
                        <span>{item.quantityStock}</span>      
                        <span>{item.priceProduct}dh</span> 
                        {
                            item?.colors?.length > 0
                            &&
                            <>
                            { item?.colors?.length > 1 
                            ? <div className='w-3 flex align-items-center'> 
                                    <div className='multiColor'/>
                                    <span>multicouleur</span> 
                                </div>
                            : <div className='w-3 flex align-items-center'>
                                <div style={{marginRight:5,width:20,height:20,backgroundColor:item?.colors[0]?.color?.codeColor}}></div>
                                <span>{item?.colors[0]?.color?.nameColor}</span>
                            </div>
                            }
                            </> 
                        }  
                        </div> 
                        <div className='ml-3 flex align-items-center'>
                            <Button
                            onClick={()=>handleClickEdit(item, index)} 
                              icon='pi pi-pencil' 
                              className='p-button-text p-button-secondary p-button-sm' />
                            <Button 
                              icon='pi pi-trash' 
                              className='p-button-text p-button-danger p-button-sm'
                              onClick={()=>removeVariant(index)} 
                              />
                        </div>
                         

                </div>
                )
              })
            }
          </div>
          {/* Submit */}
          <div className='w-full mt-4 flex align-items-center justify-content-end'>
              <Button
                loading={loading}
                onClick={() => onSave()}
                label={loading ? 'loading' : 'sauvegarder'}
                className='w-auto p-button-success' 
                type='submit' /> 
          </div>  
        </div>


        </Dialog>
    </>
  )
}

export default EditVariants