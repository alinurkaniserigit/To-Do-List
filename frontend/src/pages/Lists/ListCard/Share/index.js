import React, {useState, useEffect} from 'react'
import { Modal, TextField, Button, Typography, Box, Select, MenuItem, FormControl, InputLabel} from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import { addUserToListMutation } from '../../../../gql/mutations'

import './list-share.scss';

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

function ListShare(props) {
    const { modalOpen, setModalOpen, listId, name, refetch } = props;
    const [state, setState] = useState({
        email: '',
        listId: listId
    });

    const [handleUserShare, { data, loading, error }] = useMutation(addUserToListMutation);

    const onListCreate = () => {
        handleUserShare({
            variables: {
                ...state 
            }
        })
    };

    useEffect(() => {
        if(data){
            refetch();
            setModalOpen(false);
        }
    }, [data])

    const handleChange = e => {
        setState({...state, [e.target.name]: e.target.value});
    };

    const handleModalClose = e => {
        setModalOpen(false);
    };

    return (
    <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <Typography id="modal-modal-title" variant="h4" component="h2">
                Share List
            </Typography>
            <Typography id="modal-modal-subtitle" variant="subtitle" component="div">
                You can share {name} list with your friends by entering their email.
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

export default ListShare
