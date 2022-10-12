import React,{ useState, useEffect } from 'react'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Formik } from 'formik';
import * as Yup from 'yup'
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { CustomersService } from '../../service/CustomersService';


const EditCustomerPassword = ({rowData}) => {

    const customerService = new CustomersService()
    const [dialogVisibility, setDialogVisibility] = useState(false);
    const hideDialog = () => setDialogVisibility(false)
    const openModal = () => setDialogVisibility(true)
    
    const initialValues = {
        password:'',
        repeatPassword:''
    }
    
    const validationSchema = Yup.object().shape({
        password: Yup.string().required('saisir le mot de pass').min(8,'8 caractères'),
        repeatPassword:  Yup.string()
                            .required('saisir le mot de pass')
                            .oneOf([Yup.ref('password'), null],'les mots de passe ne correspondent pas')
    })

    const onSubmit = async(values,actions) => {
        console.log(values)
        const response = await customerService.updatePassword(rowData._id, values.password)
        if(response.data){
            hideDialog()
        } else {
            console.log(response.error)
        }
    }


    return (
        <>
        <Button icon="pi pi-lock" className="p-button-sm p-button-rounded p-button-text p-button-info" onClick={openModal} />
        <Dialog draggable={false}
                visible={dialogVisibility} 
                breakpoints={{'1080px': '100vw', '640px': '100vw'}}
                header={`Ajouter nouveau client`} modal 
                className="p-fluid" onHide={hideDialog}>

                <div className='p-2'>
                <Formik 
                enableReinitialize={true}
                initialValues={initialValues} 
                validationSchema={validationSchema} 
                onSubmit={onSubmit}>
                {({ 
                    handleChange, 
                    handleSubmit,
                    isSubmitting, 
                    values, 
                    errors, 
                    touched })=>{
                    
                    const isFormFieldValid = (name) => !!(touched[name] && errors[name]);
                    const getFormErrorMessage = (name) => {
                        return isFormFieldValid(name) && <small className="p-error">{errors[name]}</small>;
                    };
    
                    return(
                        <>
                    <div className='grid'>
                        
                    <div className='col-12'>
    
                        <div className='mb-3'>
                            <p className="mb-2">nouveau mot de pass</p>
                            <InputText placeholder='mot de pass'
                            className={classNames({ 'p-invalid':  isFormFieldValid('password')})}
                            onChange={handleChange('password')}
                            />
                            {getFormErrorMessage('password')}
                        </div>

                        <div className='mb-3'>
                            <p className="mb-2">{"répéter mot de pass"}</p>
                            <InputText placeholder="répéter mot de pass"
                            className={classNames({ 'p-invalid':  isFormFieldValid('repeatPassword')})}
                            onChange={handleChange('repeatPassword')}
                            />
                            {getFormErrorMessage('repeatPassword')}
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

export default EditCustomerPassword