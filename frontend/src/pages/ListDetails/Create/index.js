import React, {useState, useEffect} from 'react'
import { Modal, TextField, Button, Typography, Box, Select, MenuItem, FormControl, InputLabel} from '@mui/material';
import { useMutation } from '@apollo/client';
import { createListItemMutation } from '../../../gql/mutations'
import { toast } from 'material-react-toastify';

import './list-create.scss';

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

function ListItemCreate(props) {
    const { modalOpen, setModalOpen, refetch, listId } = props;
    const [state, setState] = useState({
        listID: listId,
        description: '',
        importancy: '',
    });

    const [handleListItemCreate, { data, loading, error }] = useMutation(createListItemMutation);

    const onListItemCreate = () => {
        handleListItemCreate({
            variables: {
                ...state 
            }
        })
    };

    useEffect(() => {
        if(data){
            refetch()
            setModalOpen(false)
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
                Create List
            </Typography>
            <TextField
                margin="normal"
                required
                fullWidth
                id="description"
                label="Description"
                name="description"
                value={ state.description }
                onChange={ handleChange }
            />
            <FormControl variant="standard" sx={{  width: '98%', marginTop: 2, marginBottom: 2, marginLeft: '5px' }}>
                <InputLabel id="importancy-label">Type</InputLabel>
                <Select
                    labelId="importancy-label"
                    fullWidth
                    id="importancy"
                    label="Importancy"
                    name="importancy"
                    placeholder="Importancy"
                    value={state.importancy}
                    onChange={handleChange}
                >
                    <MenuItem value="LOW">Low</MenuItem>
                    <MenuItem value="NORMAL">Normal</MenuItem>
                    <MenuItem value="HIGH">High</MenuItem>
                </Select>
            </FormControl>
            
            <div className="list-create__actions">
                <Button
                type="submit"
                fullWidth
                color="success"
                variant="contained"
                sx={{ mt : 2, mb: 2 }}
                onClick={onListItemCreate}>
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

export default ListItemCreate
