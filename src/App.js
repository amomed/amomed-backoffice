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
import { ToastContainer } from 'react-toastify';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { onBackgroundMessage } from "firebase/messaging/sw";
import {app} from './utils/firebase'

const App = () => {
    
    useEffect(() => {
        document.title = 'Amomed backoffice | Admin';
        // const messaging = getMessaging(app);
        // getTokenUser(messaging)
        // onMessage(messaging, (payload) => {
        //     console.log('Message received. ', payload);
            // ...
        // });
        // onBackgroundMessage(messaging, (payload) => {
        //     console.log('[firebase-messaging-sw.js] Received background message ', payload);
        //     // Customize notification here
        //     const notificationTitle = 'Background Message Title';
        //     const notificationOptions = {
        //       body: 'Background Message body.',
        //       icon: '/firebase-logo.png'
        //     };
          
        //     self.registration.showNotification(notificationTitle,
        //       notificationOptions);
        // });
    }, []);

    function getTokenUser (messaging){
        getToken(messaging, { vapidKey: 'BIKep2mn696ilTlsPXinooVOe4DZ-Ch_QdgZounbE36X2afH1zr9BMYUnslRiuEmHe3OOgmQT82W0nRwpJNrulo' }).then((currentToken) => {
        if (currentToken) {
            console.log(currentToken)
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

    return (
        <UserProvider>
            <AppLayout/>
            <ToastContainer />
        </UserProvider>
    );

}

export default App;
