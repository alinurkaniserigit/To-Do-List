import React, {useEffect, useContext} from 'react';
import {useHistory} from 'react-router-dom'
import Header from '../../Header'
import Footer from '../../Footer'
import { UserContext } from '../../../contexts';
import './base.scss';

const Base = props => {
    const { user, setUser } = useContext(UserContext);
    const history = useHistory();

    /*
        If user isn't authenticated go to sign in file again and reload
    */
    useEffect(() => {
        if(!user?.user){
            history.push('/sign-in')
            window.location.reload();
        }
    }, [user])
    return(
        <div className="wrapper">
            <Header />
            <section className="base-section">
                { props.children }
            </section>

            <Footer />
        </div>
    )
}

export default Base;
