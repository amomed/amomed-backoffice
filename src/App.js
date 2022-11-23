import React, { useState, useEffect, useRef } from 'react';
import AppLayout from './components/AppLayout';
import Login from './pages/Login';
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


const App = () => {
    return (
        <UserProvider>
            <AppLayout/>
            <ToastContainer />
        </UserProvider>
    );

}

export default App;
