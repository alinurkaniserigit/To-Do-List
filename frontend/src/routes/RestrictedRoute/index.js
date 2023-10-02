import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom';
import { UserContext } from '../../contexts';

const RestrictedRoute = props => {
    const { user } = useContext(UserContext);

    //if user can access the page return true
    const canAccessThePage = () => {
        
        return user?.isAuthenticated
    }
    
    //If user can access go to nex page with props, else go to sign in page
    return (
        <>
            {canAccessThePage() ? <Route {...props}/> : <Redirect to={ '/sign-in' } />}
        </>
    )
}

export default RestrictedRoute;