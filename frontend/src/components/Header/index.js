import React, {useContext} from 'react'
import {Link, useHistory} from 'react-router-dom';
import {UserContext} from '../../contexts';
import './header.scss';

function Header(props) {
    const {isAuthPage} = props;
    const history = useHistory(); //holding the history for returning back the old pages
    const { setUser } = useContext(UserContext);
    const menuItems = [
        {
            name: 'Home',
            path: '/'
        },
        {
            name: 'Groups',
            path: '/groups'
        },
        {
            name: 'Lists',
            path: '/lists'
        },
    ]

    /*
        On the logout operation remove the user from localstorage
        Change the usercontext content to unauthenticated
        Go to sign in file
    */
    const handleLogout = () => {
        localStorage.setItem('token', 'login');
        localStorage.removeItem('user');
        setUser({user: null, isAuthenticated: false})
        history.push('/sign-in');
    };

    return (
        <div className="header">
            <div className="header__name">To-do-list</div>
            {!isAuthPage && <div className="header__nav">
                {menuItems.map((item, index) => {
                    return <div key={index} className="header__nav-item"><Link style={{display: 'block'}} key={index} to={item.path}>{item.name}</Link></div>
                })}
                <div className="header__nav-item" onClick={handleLogout}>Logout</div>
            </div>
            }
        </div>
    )
}

export default Header

