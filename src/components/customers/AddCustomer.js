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
import Cities from '../../utils/Ville.json'
import { CustomersService } from '../../service/CustomersService';

const AddCustomer = ({types, setLazyParams}) => {

    const [dialogVisibility, setDialogVisibility] = useState(false);
    const toast = React.useRef(null);
    const hideDialog = () => setDialogVisibility(false)
    const openModal = () => setDialogVisibility(true)
    

    const initialValues = {
        ice: '',
        businessName: '',
        phone: '',
        address: '',
        type: null,
        ville: '',
        password: '',
        active: true,
    }
    
    const validationSchema = Yup.object().shape({
        ice: Yup.string().required('ice obligatoire'),
        businessName: Yup.string().required("nom d'établissment obligatoire"),
        phone: Yup.string().required('numéro de téléphone obligatoire'),
        address: Yup.string().required('address obligatoire'),
        type: Yup.string().required('type obligatoire'),
        ville: Yup.string().required('ville obligatoire'),
        password: Yup.number().required('mot de pass obligatoire') 
    })


    const onSubmit = (values,actions) => {
        const {ice, businessName, phone, address, type, ville, active, password} = values
        const data = {
            ISE:ice,
            nameEntreprise:businessName,
            phoneNumber:phone,
            address: address,
            customerType: type,
            city: ville,
            active: active,
            password: password
        }
        _createCustomer(data)
    }

    const _createCustomer = async (data) => {
        const customerService = new CustomersService()
        const response = await customerService.createCustomer(data)
        if(response.data){
            hideDialog()
            setLazyParams({
                first: 0,
                rows: 2,
                page: 1,
                filters : {
                    customerType: null,
                    active: null,
                    city : null,
                    nameEntreprise : null,
                    phoneNumber: null,
                    ISE: null,
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
        <Button label="ajouter" 
        icon="pi pi-plus" 
        className="mr-2" 
        onClick={openModal} />

        <Dialog draggable={false} visible={dialogVisibility} breakpoints={{'1080px': '100vw', '640px': '100vw'}}
                maximizable header={`Ajouter nouveau client`} modal 
                className="p-fluid" onHide={hideDialog}>
               
                <div className='m-2 p-5'>

                <Formik 
                enableReinitialize={true}
                initialValues={initialValues} 
                validationSchema={validationSchema} 
                onSubmit={onSubmit}>
                {({ handleChange, handleSubmit,
                isSubmitting, values, errors, touched })=>{
                    
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
                            <p className="mb-2">mot de pass</p>
                            <InputText placeholder='mot de pass'
                            className={classNames({ 'p-invalid':  isFormFieldValid('password')})}
                            onChange={handleChange('password')}
                            value={values.password}
                            />
                            {getFormErrorMessage('password')}
                        </div>

                        <div className='mb-3'>
                        <p className="mb-2">actif</p>
                        <InputSwitch checked={values.active} 
                        onChange={handleChange('active')}/>
                    </div>
    
                    </div>
                    
                    </div>

                    <div className='mt-4 flex align-items-center justify-content-end'>
                    <Button label="annuler" className='w-auto p-button-text mr-2' icon="pi pi-times" onClick={hideDialog}/>
                    <Button onClick={handleSubmit} 
                    label="sauvegarder" 
                    className='w-auto p-button-text p-button-success' 
                    icon="pi pi-check" />
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

export default AddCustomer