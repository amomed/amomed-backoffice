import React from 'react'

export const signout=()=>{
    window.localStorage.clear()
    window.location.replace('/')
}