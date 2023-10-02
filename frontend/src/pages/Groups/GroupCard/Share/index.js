import React, {useState, useEffect} from 'react'
import { Modal, TextField, Button, Typography, Box, Select, MenuItem, FormControl, InputLabel} from '@mui/material';
import { useMutation } from '@apollo/client';
import { addUserToGroupMutation } from '../../../../gql/mutations'

import './group-share.scss';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

//create a Groupshare component to use in GroupCard index.js
function GroupShare(props) {
    const { modalOpen, setModalOpen, groupId, name, refetch } = props; //variables from props
    //state
    const [state, setState] = useState({
        email: '',
        groupId: groupId
    });

    const [handleUserShare, { data, loading, error }] = useMutation(addUserToGroupMutation); //calling the mutation

    //If we click the create button fills the variables state with given email, and current group's id
    const onListCreate = () => {
        handleUserShare({
            variables: {
                ...state 
            }
        })
    };

    //If data changes, refetch and close the modal
    useEffect(() => {
        if(data){
            refetch();
            setModalOpen(false);
        }
    }, [data])

    //Changes the given target's value and fill's state
    const handleChange = e => {
        setState({...state, [e.target.name]: e.target.value});
    };

    //close modal
    const handleModalClose = e => {
        setModalOpen(false);
    };

    //modal screen 
    /*
        Share group text
        Information text
        Get email input with textfield, at each change in the value change the state.email
        Creating a share button calls onListCreate method
        Creating a cancel button to close 
    */ 
    return (
    <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <Typography id="modal-modal-title" variant="h4" component="h2">
                Share Group
            </Typography>
            <Typography id="modal-modal-subtitle" variant="subtitle" component="div">
                You can share {name} group with your friends by entering their email.
            </Typography>
            <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoFocus
                value={ state.email }
                onChange={ handleChange }
            />
            <div className="list-create__actions">
                <Button
                type="submit"
                fullWidth
                color="success"
                variant="contained"
                sx={{ mt : 2, mb: 2 }}
                onClick={onListCreate}
                >
                Share
                </Button>
                <Button
                type="submit"
                fullWidth
                color="error"
                variant="contained"
                sx={{ mt: 2, mb: 2 }}
                onClick={handleModalClose}
                >
                Cancel
                </Button>
            </div>
        </Box>
    </Modal>
    )
}

export default GroupShare
