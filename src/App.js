import React, { useState, useEffect, useRef } from 'react';
import AppLayout from './components/AppLayout';
import { UserProvider } from './context';

import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'prismjs/themes/prism-coy.css';
import './assets/demo/flags/flags.css';
import './assets/demo/Demos.scss';
import './assets/layout/layout.scss';
import './App.scss';
import '../src/css/global.css'
import 'react-toastify/dist/ReactToastify.css'; // react toastify css
import { ToastContainer, toast } from 'react-toastify';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import {app} from './utils/firebase'
import { SettingsService } from './service/SettingsService';

const App = () => {
    const settingsService = new SettingsService()
    useEffect(() => {
        document.title = 'Amomed backoffice | Admin';
        const messaging = getMessaging(app);
        getTokenUser(messaging)
        onMessage(messaging, (payload) => {
            showNotification(payload.data.message)
        })
        
    }, []);

    function getTokenUser (messaging){
        getToken(messaging, { vapidKey: 'BIKep2mn696ilTlsPXinooVOe4DZ-Ch_QdgZounbE36X2afH1zr9BMYUnslRiuEmHe3OOgmQT82W0nRwpJNrulo' }).then(async(currentToken) => {
        if (currentToken) {
            console.log(currentToken)
            addTokenToDatabase(currentToken)
            // Send the token to your server and update the UI if necessary
            // ...
        } else {
            // Show permission request UI
            console.log('No registration token available. Request permission to generate one.');
            // ...
        }
        }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        // ...
        });
    }

    async function addTokenToDatabase(currentToken){
        const response = await settingsService.getAmomedInfo()
        if(response.data){
            let amomedInfo = {}
            let tokenExists = false
            if(response.data.length > 0) {
                amomedInfo._id = response.data[0]._id  
                if((response.data[0].tokens.filter((token) => token == currentToken)).length > 0)
                    tokenExists = true
            }
            if(!tokenExists) {
                amomedInfo.token = currentToken
                await settingsService.addAmomedInfo(amomedInfo)
            }
        }
    }

    function showNotification (data){
        toast(({ closeToast }) => <div><b>{data}</b></div>,{
            type: 'success',
            autoClose:false,
            position: "top-right",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
    });
    }

    return (
        <UserProvider>
            <AppLayout/>
            <ToastContainer />
        </UserProvider>
    );

}

export default App;
