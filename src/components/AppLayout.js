import React, { useState, useEffect, useRef, useContext } from 'react';
import classNames from 'classnames';
import { Route, useLocation, Routes } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { AppTopbar } from '../AppTopbar';
import { AppFooter } from '../AppFooter';
import { AppMenu } from '../AppMenu';
import { AppConfig } from '../AppConfig';


import MenuDemo from './MenuDemo';
import Dashboard from '../pages/Dashboard';
import Categories from '../pages/Categories';
import Brands from '../pages/Brands';
import Types from '../pages/Types';
import Products from '../pages/Products';
import Customers from '../pages/Customers';
import Settings from '../pages/Settings';
import Login from '../pages/Login';
import { UserContext } from '../context'

import PrimeReact from 'primereact/api';
import { Tooltip } from 'primereact/tooltip';
import Orders from '../pages/Orders';
import Proposals from '../pages/Proposals';
import { AuthRouter } from '../routes/ProtectedRoutes';


const AppLayout = () => {
    const { userInfo: { isAuth } } = useContext(UserContext)
    console.log('login state',isAuth)
    const [layoutMode, setLayoutMode] = useState('static');
    const [layoutColorMode, setLayoutColorMode] = useState('light')
    const [inputStyle, setInputStyle] = useState('outlined');
    const [ripple, setRipple] = useState(true);
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);
    const copyTooltipRef = useRef();
    const location = useLocation();

    PrimeReact.ripple = true;

    let menuClick = false;
    let mobileTopbarMenuClick = false;

    useEffect(() => {
        if (mobileMenuActive) {
            addClass(document.body, "body-overflow-hidden");
        } else {
            removeClass(document.body, "body-overflow-hidden");
        }
    }, [mobileMenuActive]);

    useEffect(() => {
        copyTooltipRef && copyTooltipRef.current && copyTooltipRef.current.updateTargetEvents();
    }, [location]);


    const onWrapperClick = (event) => {
        if (!menuClick) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }

        if (!mobileTopbarMenuClick) {
            setMobileTopbarMenuActive(false);
        }

        mobileTopbarMenuClick = false;
        menuClick = false;
    }

    const onToggleMenuClick = (event) => {
        menuClick = true;

        if (isDesktop()) {
            if (layoutMode === 'overlay') {
                if (mobileMenuActive === true) {
                    setOverlayMenuActive(true);
                }

                setOverlayMenuActive((prevState) => !prevState);
                setMobileMenuActive(false);
            }
            else if (layoutMode === 'static') {
                setStaticMenuInactive((prevState) => !prevState);
            }
        }
        else {
            setMobileMenuActive((prevState) => !prevState);
        }

        event.preventDefault();
    }

    const onSidebarClick = () => {
        menuClick = true;
    }

    const onMobileTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        setMobileTopbarMenuActive((prevState) => !prevState);
        event.preventDefault();
    }

    const onMobileSubTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        event.preventDefault();
    }

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    }

    const isDesktop = () => {
        return window.innerWidth >= 992;
    }

    const menu = [
        {
            label: 'Acceuil',
            items: [{
                label: 'Tableau de bord', icon: 'pi pi-fw pi-home', to: '/dashboard'
            }]
        },
        {
            label: 'Produits',
            items: [
                { label: 'Catégories', icon: 'pi pi-fw pi-th-large', to: '/categories' },
                { label: 'Marques', icon: 'pi pi-fw pi-folder', to: '/brands' },
                { label: 'Produits', icon: 'pi pi-fw pi-pencil', to: '/products' }
            ]
        },
        {
            label: 'Commandes',
            items: [
                { label: 'Commandes', icon: 'pi pi-fw pi-dollar', to: '/orders' }
            ]
        },
        {
            label: 'Utilisateurs',
            items: [
                { label: 'Utilisateurs', icon: 'pi pi-fw pi-users', to: '/customers' },
                { label: 'Types', icon: 'pi pi-fw pi-circle', to: '/types' },
            ]
        },
        {
            label: 'paramètres',
            items: [
                { label: 'propositions', icon: 'pi pi-volume-off', to: '/proposals' },
                { label: 'paramètres', icon: 'pi pi-fw pi-cog', to: '/settings' }
                
            ]
        }
    ];

    const addClass = (element, className) => {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    const removeClass = (element, className) => {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    const wrapperClass = classNames('layout-wrapper', {
        'layout-overlay': layoutMode === 'overlay',
        'layout-static': layoutMode === 'static',
        'layout-static-sidebar-inactive': staticMenuInactive && layoutMode === 'static',
        'layout-overlay-sidebar-active': overlayMenuActive && layoutMode === 'overlay',
        'layout-mobile-sidebar-active': mobileMenuActive,
        'p-input-filled': inputStyle === 'filled',
        'p-ripple-disabled': ripple === false,
        'layout-theme-light': layoutColorMode === 'light'
    });

  return (
    <>
    {isAuth 
    ?<div className={wrapperClass} onClick={onWrapperClick}>
            <Tooltip ref={copyTooltipRef} target=".block-action-copy" position="bottom" content="Copied to clipboard" event="focus" />

            <AppTopbar 
            onToggleMenuClick={onToggleMenuClick} 
            layoutColorMode={layoutColorMode}
            mobileTopbarMenuActive={mobileTopbarMenuActive} 
            onMobileTopbarMenuClick={onMobileTopbarMenuClick} 
            onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick} />

            <div className="layout-sidebar" onClick={onSidebarClick}>
                <AppMenu model={menu} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode} />
            </div>

            <div className="layout-main-container">
                <div className="layout-main">
                    <Routes>
                        
                        <Route path="/dashboard" element={<Dashboard />} />
                        {/* <Route path="/menu" component={MenuDemo} /> */}
                        <Route path="/categories" element={<Categories/>} />
                        <Route path="/types" element={<Types/>} />
                        <Route path="/brands" element={<Brands/>} />
                        <Route path="/products" element={<Products/>} />
                        <Route path="/customers" element={<Customers/>} />
                        <Route path="/orders" element={<Orders/>} />
                        <Route path="/settings" element={<Settings/>} />
                        <Route path="/proposals" element={<Proposals/>} />
                        
                    </Routes>

                </div>

                <AppFooter layoutColorMode={layoutColorMode} />
            </div>

            <AppConfig />

            <CSSTransition classNames="layout-mask" timeout={{ enter: 200, exit: 200 }} in={mobileMenuActive} unmountOnExit>
                <div className="layout-mask p-component-overlay"></div>
            </CSSTransition>

    </div>
    :
    <Routes>
        <Route element={<AuthRouter isAuth={isAuth} />}>
            <Route path="/" element={<Login/>} />
        </Route>
    </Routes>}
    </>
  )
}

export default AppLayout