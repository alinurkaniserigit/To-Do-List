import React, {useState, useContext, useEffect} from 'react'
import { TextField, Button, Typography } from '@mui/material';
import { useLazyQuery } from '@apollo/client';
import { LOGIN_QUERY } from '../../gql/queries'
import { UserContext } from '../../contexts';
import { useHistory } from 'react-router-dom'

import './login.scss'

function Login() {
    const [email, setEmail] = useState(''); //email state
    const [password, setPassword] = useState(''); //password state
    const [handleLogin, { data, error }] = useLazyQuery(LOGIN_QUERY); //call login query as lazyquery to be able to call it multiple times
    const history = useHistory(); //history on changing pages
    const { user, setUser } = useContext(UserContext); //get user


    useEffect(() => {
        if(data){
            localStorage.setItem('token', data.login?.token || "login");
            localStorage.setItem('user', JSON.stringify(data.login));
            setUser({isAuthenticated: true, user: {...data.login}});
        }
    }, [data])

    useEffect(() => {
        if(error){
            setUser({isAuthenticated: false, user: null})
        }
    }, [error])

    const onLogin = e => {
        handleLogin({
            variables: {
                email,
                password
            }
          });
    };
    const handleEmailChange = e => {
        setEmail(e.target.value);
    };
    const handlePasswordChange = e => {
        setPassword(e.target.value);
    };
    return (
        <div className="login">
            <Typography variant="h4" gutterBottom component="div">
                Login
            </Typography>
            <div className="login__form">
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={ email }
              onChange={ handleEmailChange }
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={ password }
              onChange={ handlePasswordChange }
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 2 }}
              onClick={e=> onLogin()}
            >
              Sign In
            </Button>
            </div>
            <div className="login__action">
                <Button onClick={()=>history.push('/register')}>Register</Button>
            </div>
        </div>
    )
}

export default Login
