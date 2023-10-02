import React, {useEffect} from 'react'
import { Button, Typography } from '@mui/material';
import { useMutation } from '@apollo/client';
import { removeUserMutation, addUserToBlockListMutation} from '../../gql/mutations'
import { useHistory, useParams } from 'react-router-dom'
import { toast } from 'material-react-toastify';

import './register.scss'

function DeleteUserAndBlock() {
    const { token } = useParams();
    const [handleRemove, { data:dataRemove, error:errorRemove }] = useMutation(removeUserMutation);
    const [handleBlock, { data:dataBlock, error:errorBlock }] = useMutation(addUserToBlockListMutation);
    const history = useHistory();
    
    
    //if mutation doesn't turn error write success message and go sign in page
    useEffect(() => {
        //console.log("remove",dataRemove?.removeUser?.removeUser);
        if(dataRemove?.addUserToBlockList){
            toast.success('Your account is successfully removed')
        }
    }, [dataRemove])
    

    //if mutation doesn't turn error write success message and go sign in page
    useEffect(() => {
        console.log("block",dataBlock?.addUserToBlockList);
        if(dataBlock?.addUserToBlockList){
            toast.success('Your account is successfully blocked')
        }
    }, [dataBlock])
    
    //on calling register mutation set args
    const onDelete = e => {
        handleRemove({
            variables: {
                token
            }
        });
    };

    //on calling register mutation set args
    const onBlock = e => {
        handleBlock({
            variables: {
                token
            }
        });
    };

    const onClose = e =>{
        history.push('/sign-in')
    }

    return (
        <div className="register">
            <Typography variant="h4" align="center" gutterBottom component="div">
                You can delete your account and block it.
            </Typography>
            <div className="register__form">
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: -1 }}
              onClick={e=> onDelete()}
            >
              Delete
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: -1, mb: 2 }}
              onClick={e=> {onBlock();onDelete();}}
            >
              Block and Delete
            </Button>
            </div>
            <div className="register__action">
                <Button
                    onClick ={e=> onClose()}
                >Close</Button>
            </div>
        </div>
    )
}

export default DeleteUserAndBlock
