import React, {useState, useEffect} from 'react'
import { Modal, TextField, Button, Typography, Box, Select, MenuItem, FormControl, InputLabel} from '@mui/material';
import { useMutation } from '@apollo/client';
import { createGroupMutation } from '../../../gql/mutations'


import './group-create.scss';

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

//creates a GroupCreate component
function GroupCreate(props) {
    const { modalOpen, setModalOpen, refetch } = props; //variables
    //state
    const [state, setState] = useState({
        name: '',
    });

    const [handleGroupCreate, { data, loading, error }] = useMutation(createGroupMutation); //call create group mutation once

    //while doing each create operation set state
    const onListCreate = () => {
        handleGroupCreate({
            variables: {
                ...state 
            }
        })
    };

    /*
        refetch the groups
        close the modal
    */
    useEffect(() => {
        if(data){
            refetch()
            setModalOpen(false)
        }
    }, [data])

    //changes the state
    const handleChange = e => {
        setState({...state, [e.target.name]: e.target.value});
    };

    //close modal
    const handleModalClose = e => {
        setModalOpen(false);
    };

    /*
        Open a modal
        Create Group text as title
        Get input and update it while we are writing, also set the state
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
                Create Group
            </Typography>
            <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoFocus
                value={ state.name }
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
                Create
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

export default GroupCreate
