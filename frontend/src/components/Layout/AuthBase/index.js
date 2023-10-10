import React, { useContext, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import Header from '../../Header'
import Footer from '../../Footer'
import { UserContext } from '../../../contexts';

import './auth-base.scss';

const AuthBase = props => {
    const { user, setUser } = useContext(UserContext);
    const history = useHistory();

    //if user is authenticated go to home page and reload the window
    useEffect(() => {
        if(user?.user){
            history.push('/')
            window.location.reload();
        }
    }, [user])

    /*
        Put header
        Put props
        Put footer
    */
    return (
    <div className="wrapper">
        <Header isAuthPage={true}/>
        <section className="auth-base">
            { props.children }
        </section>

        <Footer />
    </div>);
}

export default AuthBase;
