import React,{ useState } from 'react'
import { Button } from 'primereact/button'
import { classNames } from 'primereact/utils';
import { Formik } from 'formik';
import * as Yup from 'yup'
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';


const EditAdmin = ({rowData}) => {

    const [dialogVisibility, setDialogVisibility] = useState(false);
    const [content,setContent]=useState(rowData)
    const hideDialog = () => setDialogVisibility(false)
    const openModal = () => setDialogVisibility(true)

    const initialValues = {
        name: content.name,
        type: 'inferior',
        username: content.username,
        password: content.password
    }
    
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('champ obligatoire'),
        username: Yup.string().required('champ obligatoire'),
        password: Yup.string().required('champ obligatoire').min(8,'8 caractére minimum'),
    })

    const onSubmit=(values,actions)=>{
        console.log(values)
    }


  return (
    <>
        <Button icon="pi pi-pencil" className="p-button-sm p-button-rounded p-button-text p-button-warning" onClick={openModal} />
    
        <Dialog  visible={dialogVisibility} breakpoints={{'1900px': '60vw', '640px': '100vw'}}
            header={`modifier les infos de ${rowData.name}`} modal 
            className="p-fluid" onHide={hideDialog}>
            
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ handleChange,handleBlur, handleSubmit,isSubmitting, values, errors, touched })=>{
               
                const isFormFieldValid = (name) => !!(touched[name] && errors[name]);
                const getFormErrorMessage = (name) => {
                    return isFormFieldValid(name) && <small className="p-error">{errors[name]}</small>;
                };

                return(
                    <>
                    {/* NAME */}
                    <div className="field">
                        <InputText id="name" placeholder='nom'  
                        className={classNames({ 'p-invalid':  isFormFieldValid('name') })}
                        onChange={handleChange('name')} onBlur={handleBlur('name')}
                        value={values.name}
                        />
                        {getFormErrorMessage('name')}
                    </div>

                    {/* USERNAME */}
                    <div className="field">
                        <InputText id="username" placeholder='psuedo'  
                        className={classNames({ 'p-invalid':  isFormFieldValid('username') })}
                        onChange={handleChange('username')} onBlur={handleBlur('username')}
                        value={values.username}
                        />
                        {getFormErrorMessage('username')}
                    </div>

                    {/* PASSWORD */}
                    <div className="field">
                        <InputText id="password" placeholder='mot de pass'  
                        className={classNames({ 'p-invalid':  isFormFieldValid('password') })}
                        onChange={handleChange('password')} onBlur={handleBlur('password')}
                        value={values.password}
                        />
                        {getFormErrorMessage('password')}
                    </div>
            <div className='mt-4 flex align-items-center justify-content-end'>
                <Button label="annuler" className='w-auto p-button-text mr-2' icon="pi pi-times" onClick={hideDialog}/>
                <Button onClick={handleSubmit} label="modifier" className='w-auto p-button-text p-button-warning' icon="pi pi-pencil"  type='submit' />
            </div>
            </>
                )
            }}
            </Formik>
            
        </Dialog>
    </>
  )
}

export default EditAdmin