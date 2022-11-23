import React,{ useState } from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { AppConfig } from '../AppConfig'
import { Formik } from 'formik';
import * as Yup from 'yup'
import { classNames } from 'primereact/utils';
import api from '../utils/Api'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {

    const [inpuType,setType]=useState('password')

    const initialValues = {
        username: '',
        password: ''
    }
    
    const validationSchema = Yup.object().shape({
        username: Yup.string().required('champ obligatoire'),
        password: Yup.string().required('champ obligatoire'),
    })

    const onSubmit=(values,actions)=>{
        console.log(values)
        const data = {
            email: values.username,
            password: values.password
        }
        api.post('admin/login', data)
          .then(res => {
                window.localStorage.setItem('userInfo', JSON.stringify(res.data));
                window.location.replace("/dashboard");
          })
          .catch((err) => {
               toast.error(err.response.data.message);
               actions.setSubmitting(false)
          })
    }

  return (
    <div className='grid bg-white w-screen h-screen'>
        
        <div style={{borderRightWidth:5,borderLeftColor:'#b1b1b1'}} 
        className='col-12 lg:col-6 flex align-items-center justify-content-center'>
            <img src='assets/layout/images/logo.png' width='300' height='300' alt='logo' />
        </div>

        <div className="col-12 lg:col-6 flex flex-column justify-content-center">
             
            <div className='p-8'>
            <h3 className="m-0 text-start text-2xl">se connecter</h3>
            <p className="m-0 mb-5 text-start">bienvenue au backoffice</p>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ handleChange,handleBlur, handleSubmit,
            isSubmitting, values, errors, touched })=>{
    
            const isFormFieldValid = (name) => !!(touched[name] && errors[name]);
            const getFormErrorMessage = (name) => {
                return isFormFieldValid(name) && <small className="p-error">{errors[name]}</small>;
            };

                return(
                <div>
                    <div className="field flex flex-column" >
                        <input
                        onChange={handleChange('username')} 
                        onBlur={handleBlur('username')}
                        className={classNames({ 'c-input-invalid':  isFormFieldValid('username')},'c-input')}
                        placeholder='psuedo'/>
                    </div>

                    <div className="field flex flex-column">
                        
                        <div className='flex w-full'>
                        <input 
                        onChange={handleChange('password')} 
                        onBlur={handleBlur('password')}
                        type={inpuType} 
                        placeholder='mot de pass'
                        className={classNames({ 'c-input-invalid':  isFormFieldValid('password')},'c-input w-full')}/>
                        <div 
                        onClick={()=>setType(inpuType==='password'?'text':'password')}
                        style={{backgroundColor:'#eee',borderRadius:15,width:45,cursor:'pointer'}} 
                        className='flex align-items-center justify-content-center ml-2'>
                            <i className={inpuType==='password'?'pi pi-eye':'pi pi-eye-slash'}></i>
                        </div>
                        </div>
                    </div>

                    <div>
                    <Button onClick={handleSubmit} 
                    label="se connecter" 
                    type='submit'
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    className='p-buttom-xl' />
                    </div>
                
            </div>
                )
            }}
            </Formik>
            </div>
            

        </div>

       
        <AppConfig/>
    </div>
  )
}

export default Login