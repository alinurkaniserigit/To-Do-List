import React, {useEffect} from 'react'
import { Button, Typography } from '@mui/material';
import { useMutation } from '@apollo/client';
import { confirmationMutation} from '../../gql/mutations'

import { useHistory,useParams } from 'react-router-dom'

import './activate-account.scss'

function ActivateAccount() {
    const { token } = useParams();
    const history = useHistory();
    //const { user, setUser } = useContext(UserContext);

    const [handleConfirmation, { data, error }] = useMutation(confirmationMutation); //call create group mutation once

    //on calling register mutation set variables
    const onVerification = e => {
        handleConfirmation({
            variables: {
                token
            }
          });
    };

    //if selects close button go to register page
    const onClose = e=>{
        history.push('/register')
    }

    //if there isn't a token go to sign in page
    useEffect(() => {
        !token && history.push('/sign-in')
    }, [])

    //if mutation doesn't turn error write success message and go sign in page
    useEffect(() => {
        if(data){
            history.push('/sign-in')
        }
    }, [data])

    //if there is an error set user to unauthenticated
    useEffect(() => {
        if(error){
        }
    }, [error])


    return (
        <div className="register">
            <Typography variant="h4" gutterBottom component="div">
                Confirm Account
            </Typography>
            <div className="register__form">
            
            <div className="activate-account__actions">
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2, mb: 1 }}
                    onClick={e=> onVerification()}
                >
                Confirm
                </Button>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 1, mb: 2 }}
                    onClick={e=> onClose()}
                >
                Close
                </Button>
            </div>
            </div>
            
        </div>
    )
}

export default ActivateAccount