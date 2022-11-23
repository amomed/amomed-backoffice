import React, { createContext, useState, useEffect } from 'react';
// -------------------------

// User data context
export const UserContext = createContext(null)

export const UserProvider = ({ children }) => {

     const [userInfo, setUserInfo] = useState({ isAuth: false })
     const getData = async () => {

          // Get user token
          let info;
          info = null;

          // Get user data by token
          try {
            info = await window.localStorage.getItem('userInfo');
            if(info){
              const data = {isAuth: true}
               setUserInfo(data)
            }
          } catch (error) {
               console.log(error)
          }
     
     };
     useEffect(() => {
          getData();
     }, []);


     return (
          <>
            <UserContext.Provider value={{ userInfo }}>
                {children}
            </UserContext.Provider>
          </>
     )
}
