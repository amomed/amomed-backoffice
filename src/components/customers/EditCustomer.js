import React,{ useState, useEffect } from 'react'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Formik } from 'formik';
import * as Yup from 'yup'
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { InputSwitch } from 'primereact/inputswitch';
import Cities from '../../utils/Ville_V2.json'
import { CustomersService } from '../../service/CustomersService';


const EditCustomer = ({rowData, types, setLazyParams}) => {

    const customerService = new CustomersService()
    const [dialogVisibility, setDialogVisibility] = useState(false);
    const toast = React.useRef(null);
    const hideDialog = () => setDialogVisibility(false)
    const openModal = () => setDialogVisibility(true)
    const {_id, ISE, nameEntreprise, phoneNumber, address, active, customerType, city} = rowData
    

    const initialValues = {
        ice: ISE,
        businessName: nameEntreprise,
        phone: phoneNumber,
        address: address,
        type: customerType._id,
        ville: city,
        active:active,
    }
    
    const validationSchema = Yup.object().shape({
        ice: Yup.string().required('ice obligatoire'),
        businessName: Yup.string().required("nom d'établissment obligatoire"),
        phone: Yup.string().required('numéro de téléphone obligatoire'),
        address: Yup.string().required('address obligatoire'),
        type: Yup.string().required('type obligatoire'),
        ville: Yup.string().required('ville obligatoire'),
    })


    const onSubmit=(values,actions)=>{
        const {ice, businessName, phone, address, type, ville, active} = values
        console.log(_id)
        const data = {
            ISE:ice,
            nameEntreprise:businessName,
            phoneNumber:phone,
            address: address,
            customerType: type,
            city: ville,
            active: active
        }
        _updateCutomer(data)
    }

    const _updateCutomer = async (data) => {
        const response = await customerService.updateCustomer(_id, data)
        if(response.data){
            hideDialog()
            setLazyParams({
                first: 0,
                rows: 10,
                page: 1,
                filters : {
                    customerType: null,
                    active: null,
                    city : null,
                    nameEntreprise : null,
                    phoneNumber: null,
                    ISE: null ,
                },
            })
        } else {
            console.log(response.error)
        }
    }

    const selectedCountryTemplate = (option, props) => {
        if (option) {
            return (
                <div className="country-item country-item-value">
                    <div>{option.ville}</div>
                </div>
            );
        }

        return (
            <span>
                {props.placeholder}
            </span>
        );
    }

    const countryOptionTemplate = (option) => {
        return (
            <div className="country-item">
                <div>{option.ville}</div>
            </div>
        );
    }


    return (
        <>
        {/* <Button icon="pi pi-pencil" 
        className="p-button-sm p-button-rounded p-button-text p-button-warning" 
        onClick={openModal} /> */}
        
        <div 
          className='align-items-center flex p-2 pl-3 pr-6 menu-child'
          onClick={openModal}
          >
              <i className='pi pi-pencil'></i>
              <span className='uppercase ml-2'>modifier</span>
        </div>
        
        <Dialog draggable={false} 
        visible={dialogVisibility} 
        breakpoints={{'1080px': '100vw', '640px': '100vw'}}
        maximizable 
        header={`Modifier ${nameEntreprise}`} modal 
        className="p-fluid" onHide={hideDialog} >

                <div className='p-4'>
                { !active && <div style={{backgroundColor:'#FFD1CE',borderRadius:30}} className='flex mb-5 p-3 align-items-center'>
                    <i className="pi pi-exclamation-circle text-xl"/>
                    <p className='font-bold ml-3'>{"ce clients n'est pas actif"}</p>
                </div>}
                <Formik 
                enableReinitialize={true}
                initialValues={initialValues} 
                validationSchema={validationSchema} 
                onSubmit={onSubmit}>
                {({ handleChange, handleSubmit,
                isSubmitting, values, errors, touched })=>{
                    console.log(values.type)
                    
                    const isFormFieldValid = (name) => !!(touched[name] && errors[name]);
                    const getFormErrorMessage = (name) => {
                        return isFormFieldValid(name) && <small className="p-error">{errors[name]}</small>;
                    };
    
                    return(
                <>
                    <div className='grid'>
    
                    <div className='col-6'>
    
                        <div className='mb-3'>
                            <p className="mb-2">ICE</p>
                            <InputText placeholder='ice'
                            className={classNames({ 'p-invalid':  isFormFieldValid('ice')})}
                            onChange={handleChange('ice')}
                            value={values.ice}
                            />
                            {getFormErrorMessage('ice')}
                        </div>

                        <div className='mb-3'>
                            <p className="mb-2">{"nom d'établissment"}</p>
                            <InputText placeholder="nom d'établissment"
                            className={classNames({ 'p-invalid':  isFormFieldValid('businessName')})}
                            onChange={handleChange('businessName')}
                            value={values.businessName}
                            />
                            {getFormErrorMessage('businessName')}
                        </div>

                        <div className='mb-3'>
                            <p className="mb-2">phone</p>
                            <InputText placeholder='numéro de télephone'
                            className={classNames({ 'p-invalid':  isFormFieldValid('phone')})}
                            onChange={handleChange('phone')}
                            value={values.phone}
                            />
                            {getFormErrorMessage('phone')}
                        </div>

                        <div className='mb-3'>
                            <p className="mb-2">address</p>
                            <InputText placeholder='address'
                            className={classNames({ 'p-invalid':  isFormFieldValid('address')})}
                            onChange={handleChange('address')}
                            value={values.address}
                            />
                            {getFormErrorMessage('address')}
                        </div>

                    </div>
                
                    <div className='col-6'>
    
                        <div className='mb-3'>
                        <p className="mb-2">type</p>
                            <Dropdown 
                            value={values.type}
                            onChange={handleChange('type')}
                            options={types}
                            placeholder="choisissez une type" />
                        </div>
                        

                    <div className='mb-3'>
                        <p className="mb-2">ville</p>
                            <Dropdown value={values.ville}
                            options={Cities} 
                            onChange={handleChange('ville')} 
                            optionLabel="ville" optionValue="ville"
                            filterBy="ville" filter
                            placeholder="Sélectionnez une ville"
                            valueTemplate={selectedCountryTemplate} 
                            itemTemplate={countryOptionTemplate} />
                    </div>
                    <div className='mb-3'>
                        <p className="mb-2">actif</p>
                        <InputSwitch checked={values.active} 
                        onChange={handleChange('active')}/>
                    </div>

                    </div>  
                    
                    </div>
                    <div className='mt-8 flex align-items-center justify-content-end'>   
                    <Button 
                        disabled={isSubmitting}
                        onClick={handleSubmit} 
                        label={'modifier'}
                        className='w-auto p-button-text p-button-warning' 
                        icon="pi pi-pencil"  
                        type='submit' /> 
                    </div>
                </>
                    )
                }}
                </Formik>
    
                </div>
    
            </Dialog>
        </>
      )
}

export default EditCustomer