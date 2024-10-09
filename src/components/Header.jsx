import React from 'react'
import { db } from '../firebase'



const Header = () => {
    return (
        <>
            <div className="nav"></div>
            <div className="banner">
                <div className="banner-title">Scum Product Price</div>
                <div className="banner-version">Update V.0.0.1</div>
                <button className='btn-signIn'>Sign in</button>
            </div>
        </>
    )
}

export default Header