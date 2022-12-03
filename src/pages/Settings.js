import React,{ useState, useEffect, useRef } from 'react'
import { Editor } from 'primereact/editor';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import AdminTable from '../components/settings/admins/AdminTable';
import Emails from '../components/settings/emails/Emails'
import Phones from '../components/settings/phones/Phones'
import Terms from '../components/settings/terms/Terms';
import { SettingsService } from '../service/SettingsService';

const Settings = () => {
  const settingsService = new SettingsService()
  const [amomedInfo, setAmomedInfo] = useState({})
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    getData()
  },[])

  async function getData(){
    const response = await settingsService.getAmomedInfo()
    if(response.data){
      response.data.length > 0 && setAmomedInfo(response.data[0])
    } else {
      console.log(response.error)
    }
    setLoading(false)
  }

  async function addAmomedInfo(_amomedInfo){
    console.log(amomedInfo)
    if(Object.keys(amomedInfo).length > 0){
      _amomedInfo._id = amomedInfo._id
    }
    const response = await settingsService.addAmomedInfo(_amomedInfo)
    if(response.data){
      getData()
    } else {
      console.log(response.error)
    }
  }

  async function _deleteAmomedInfo(_amomedInfo){
    _amomedInfo._id = amomedInfo._id
    const response = await settingsService.deleteAmomedInfo(_amomedInfo)
    if(response.data){
      getData()
    } else {
      console.log(response.error)
    }
  }

  return (
    <div className="grid">
      {!loading && 
        <div className="grid">
        {/* <AdminTable/>  */}
        <Phones phones = {amomedInfo?.phonesNumbers} addAmomedInfo={addAmomedInfo} deleteAmomedInfo={_deleteAmomedInfo}/>
        <Emails emails ={amomedInfo?.emails} addAmomedInfo={addAmomedInfo} deleteAmomedInfo={_deleteAmomedInfo}/>
        <Terms termsConditions={amomedInfo?.termsConditions} addAmomedInfo={addAmomedInfo} deleteAmomedInfo={_deleteAmomedInfo} />
        </div>    
      }
    </div>  
  )
}

export default Settings