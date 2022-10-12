import React from 'react';

export const AppFooter = (props) => {

    return (
        <div className="layout-footer">
            <img src={props.layoutColorMode === 'light' ? 'assets/layout/images/dev-time.png' : 'assets/layout/images/dev-time.png'} alt="Logo" height="20" className="mr-2" />
            developed by
            <span className="font-medium ml-2">devtime.tech</span>
        </div>
    );
}
