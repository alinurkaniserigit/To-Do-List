import React, { useState } from 'react';
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';

import Base from '../components/Layout/Base';
import AuthBase from '../components/Layout/AuthBase';
import RestrictedRoute from './RestrictedRoute';

import Lists from '../pages/Lists';
import ListDetails from '../pages/ListDetails';
import Login from '../pages/Login';
import Register from '../pages/Register';
import NotFound from '../pages/NotFound';
import Home from '../pages/Home';
import Groups from '../pages/Groups';
import ActivateAccount from '../pages/ActivateAccount'
import DeleteUserAndBlock from '../pages/DeleteUserAndBlock';
import { UserContext } from '../contexts';


const listofPages = [
    '/sign-in',
    '/register',
    '/activate-account',
    '/delete-account',
    '/404'
];


const Routes = ({ location }) => {
    const [user, setUser] = useState(); //get current user
    //create the user 
    const value = { user: {isAuthenticated:!!localStorage.getItem('user'), user: JSON.parse(localStorage.getItem('user'))}, setUser };
    console.log(location.pathname.split("/")[1])

    if(listofPages.some(item=>location.pathname.indexOf(item)>-1)) {
        return (
            <UserContext.Provider value={ value }>
                <AuthBase>
                    <Switch location={location}>
                        <Route exact path="/sign-in" component={Login}/>
                        <Route exact path="/register" component={Register}/>
                        <Route path="/activate-account/:token" component={ActivateAccount}/>
                        <Route path="/delete-account/:token" component={DeleteUserAndBlock}/>
                        <Route exact path="/404" component={NotFound}/>
                    </Switch>
                    
                </AuthBase>
            </UserContext.Provider>
        )
    }
    else {
        
        return (
            <UserContext.Provider value={ value }>
                <Base>
                    <Switch location={location}>
                        <RestrictedRoute exact path="/" component={Home} />
                        <RestrictedRoute exact path="/lists" component={Lists}/>
                        <RestrictedRoute path="/lists/:id" component={ListDetails}/>
                        
                        <RestrictedRoute exact path="/groups" component={Groups}/>
                            
                        <Redirect to={"/"}/>
                    </Switch>
                </Base>
            </UserContext.Provider>
        )
    }
}

export default withRouter(Routes);