import React,{ useState, useEffect, useRef } from 'react'
import { Editor } from 'primereact/editor';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import AdminTable from '../components/settings/admins/AdminTable';
import Emails from '../components/settings/emails/Emails'
import Phones from '../components/settings/phones/Phones'
import Terms from '../components/settings/terms/Terms';


const Settings = () => {
    
    
   
    return (
    <div className="grid">

            {/* ADMIN TABLE */}
            {/* <AdminTable/> */}

            {/* PHONES */}
            <Phones/>
 
            {/* EMAILS */}
            <Emails/>

            {/* TERMS */}
            <Terms/>
            
         </div>
  )
}

export default Settings