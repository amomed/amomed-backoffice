import React  from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { signout } from './utils/SignOut'

export const AppTopbar = (props) => {

    return (
        <div className="layout-topbar">
            
            <button 
            type="button" 
            className="p-link  layout-menu-button layout-topbar-button" 
            onClick={props.onToggleMenuClick}>
                <i className="pi pi-bars"/>
            </button>

            <Link to="/dashboard" className="layout-topbar-logo">
                <img src='assets/layout/images/logo.png' alt="logo"/>
                <span>Amomed backoffice</span>
            </Link>

            

            <button type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={props.onMobileTopbarMenuClick}>
                <i className="pi pi-ellipsis-v" />
            </button>

                <ul className={classNames("layout-topbar-menu lg:flex origin-top", {'layout-topbar-menu-mobile-active': props.mobileTopbarMenuActive })}>
                    {/* <li>
                        <button className="p-link layout-topbar-button" onClick={props.onMobileSubTopbarMenuClick}>
                            <i className="pi pi-calendar"/>
                            <span>Events</span>
                        </button>
                    </li> 
                    <li>
                        <button className="p-link layout-topbar-button" onClick={props.onMobileSubTopbarMenuClick}>
                            <i className="pi pi-bell"/>
                            <span>Settings</span>
                        </button>
                    </li>*/}
                    <li>
                        <button className="p-link layout-topbar-button" 
                        onClick={signout}>
                            <i className="pi pi-sign-out"/>
                            <span>se deconnecter</span>
                        </button>
                    </li>
                </ul>
        </div>
    );
}
