import React, {useState, useContext, useEffect} from 'react'
import { TextField, Button, Typography } from '@mui/material';
import { gql, useMutation, useQuery } from '@apollo/client';
import { registerMutation} from '../../gql/mutations'
import { UserContext } from '../../contexts';
import { useHistory } from 'react-router-dom';

import './register.scss'

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [handleRegister, { data, error }] = useMutation(registerMutation);
    const history = useHistory();

    //const { user, setUser } = useContext(UserContext);

    //if mutation doesn't turn error write success message and go sign in page
    useEffect(() => {
        if(data){
            //history.push(`/activate-account/${data?.register?.token}`)
            history.push("/sign-in")
        }
    }, [data])

    //if there is an error set user to unauthenticated
    useEffect(() => {
        if(error){
            //setUser({isAuthenticated: false, user: null})
            history.push('/register')
        }
    }, [error])

    //on calling register mutation set variables
    const onRegister = e => {
        handleRegister({
            variables: {
                name,
                email,
                password
            }
          });
    };

    const onClose = e =>{
        history.push('/sign-in')
    }

    //input fields handlers
    const handleNameChange = e => {
        setName(e.target.value);
    };
    const handleEmailChange = e => {
        setEmail(e.target.value);
    };
    const handlePasswordChange = e => {
        setPassword(e.target.value);
    };

    return (
        <div className="register">
            <Typography variant="h4" gutterBottom component="div">
                Register
            </Typography>
            <div className="register__form">
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={ name }
              onChange={ handleNameChange }
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
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
              onClick={e=> onRegister()}
            >
              Register
            </Button>
            </div>
            <div className="register__action">
                <Button
                    onClick ={e=> onClose()}
                >Already have an account? Sign in.</Button>
            </div>
        </div>
    )
}

export default Register