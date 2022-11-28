import React,{useState} from 'react'
import { Button } from 'primereact/button'
import { Checkbox } from 'primereact/checkbox'
import { Dropdown } from 'primereact/dropdown'
import ColorVariantBlock from './ColorVariantBlock'
import DimensionVariantBlock from './DimensionVariantBlock'
import PointureVariantBlock from './PointureVariantBlock'
import SizeVariantBlock from './SizeVariantBlock'
import VolumeVariantBlock from './VolumeVariantBlock'

const VARIANTS = [
    { value:'Couleur', name: 'Couleur', id: '0' },
    { value:'Dimension', name: 'Dimension', id: '1' },
    { value:'Taille', name: 'Taille', id: '2' },
    { value:'Pointure', name: 'Pointure', id: '3' },
    { value:'Volume', name: 'Volume', id: '4' }
];

const Variants = ({variantList,pushVariants,removeVariant}) => {

    const [selectedVariant,setSelectedVariant]=useState(null)
    const [checked,setChecked]=useState(null)
    const [renderedBlock,setRendredBlock]=useState(null)
    const [colorIncluded,setColorState]=useState(false)
    const onVariantChange=(e)=> setSelectedVariant(e.value)
    

    // RENDER BLOCK OF SELECTED VARIANT
    const renderBlock = () =>{
        if(checked){
            setColorState(true)
            setRendredBlock(selectedVariant)
        }else{
            setColorState(false)
            setRendredBlock(selectedVariant)
        }
    }

    // COLOR CHECKBOX
    const checkBoxTest = () =>{
        if(selectedVariant !== null && selectedVariant !== 'Couleur'){
            return true
        }
        return -1
    }

    const variantValue=(item)=>{
        if(item?.dimensions !== null) return <span className='w-2'>{item?.dimensions} cm</span>
        else if(item?.size !== null) return <span className='w-2'>{item?.size}</span>
        else if(item?.volume !== null) return <span className='w-2'>{item?.volume} ml</span>
        else if(item?.shoeSize !== null) return <span className='w-2'>{item?.shoeSize}</span>
        else if(item?.color.nameColor !== null) return <span className='w-2'>{item?.color?.nameColor}</span>
    }

  return (
    <>

    <h5>Variants</h5>
        <div className='mb-3 flex flex-column'>
        <div className='flex w-full justify-content-between mb-4'>
        
        <div className='flex'>
            <Dropdown 
            value={selectedVariant} 
            options={VARIANTS} 
            onChange={onVariantChange} 
            optionLabel="name" 
            disabled={variantList.length > 0}
            placeholder="sélectionnez" />
            { checkBoxTest() !== -1
            && <div className="flex align-items-center ml-4">
                <Checkbox
                disabled={variantList.length > 0}
                inputId="binary"
                checked={checked}
                onChange={e => setChecked(e.checked)} />
                <label className='ml-1'>Couleur inclus</label>
            </div>}
        </div>

        <Button 
            onClick={renderBlock} 
            label='valider' 
            className='w-auto p-button-outlined' />

        </div>

        {/* VARIANT LIST */}
        {
        variantList.length > 0
        && 
        <>
        {
            variantList.map((item,index)=>{
            
                return(
                    <div key={index.toString()} 
                    className='justify-content-between align-items-center flex w-full card'>
                       <div className='w-10 justify-content-between align-items-center flex'>
                        {variantValue(item)}      
                        <span>{item?.reference}</span>      
                        <span>{item?.priceProduct} dh</span> 
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
                        <div className='ml-3'>
                            <Button 
                            onClick={()=>removeVariant(index)}
                            label='supprimer' 
                            className='p-button-text p-button-danger p-button-sm' />
                        </div>
                    </div>
                )
            })
        }
        </>
    }

        { renderedBlock === 'Dimension' 
        && <DimensionVariantBlock pushVariants={pushVariants} colorIncluded={colorIncluded}/>}
        
        { renderedBlock === 'Volume' && 
        <VolumeVariantBlock pushVariants={pushVariants} colorIncluded={colorIncluded}/>}
        
        { renderedBlock === 'Taille' && 
        <SizeVariantBlock pushVariants={pushVariants} colorIncluded={colorIncluded}/>}
        
        { renderedBlock === 'Pointure' && 
        <PointureVariantBlock pushVariants={pushVariants} colorIncluded={colorIncluded}/>}
        
        { renderedBlock === 'Couleur' && 
        <ColorVariantBlock pushVariants={pushVariants}/>}

        </div>
    </>
  )
}

export default Variants