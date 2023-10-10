import React, {useState, useEffect} from 'react'
import { Modal, TextField, Button, Typography, Box, Select, MenuItem, FormControl, InputLabel} from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import { createListMutation } from '../../../gql/mutations'
import { GET_GROUPS_QUERY, GET_GROUPS_THAT_USER_IS_ADMIN_QUERY } from '../../../gql/queries'


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

//listcreate component
function ListCreate(props) {
    const {modalOpen, setModalOpen, refetch } = props;
    const [state, setState] = useState({
        name: '',
        description: '',
        type: '',
        group: ''
    });

    //call create list mutation
    const [handleListCreate, { data, loading, error }] = useMutation(createListMutation);
    //find the groups that user is admin because we will use it in a dropbox to select list group while creating it
    const {data: groupsData} = useQuery(GET_GROUPS_THAT_USER_IS_ADMIN_QUERY); 

    //while creating list if type is private make group null
    //then fill the args to use mutation
    const onListCreate = () => {
        const payload = {...state};
        if(payload.type === 'PRIVATE') delete payload.group
        handleListCreate({
            variables: {
                ...payload 
            }
        })
    };

    //at each successful change on data write success message, refetch and close modal
    useEffect(() => {
        if(data){
            refetch()
            setModalOpen(false)
        }
    }, [data])

    //on change while writing input set state and input box
    const handleChange = e => {
        setState({...state, [e.target.name]: e.target.value});
    };

    //close modal
    const handleModalClose = e => {
        setModalOpen(false);
    };

    /*
        Almost the same with create group
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
                Create List
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
                <InputLabel id="type-label">Type</InputLabel>
                <Select
                    labelId="type-label"
                    fullWidth
                    id="type"
                    label="Type"
                    name="type"
                    placeholder="Type"
                    value={state.type}
                    onChange={handleChange}
                >
                    <MenuItem value="GROUP">Group</MenuItem>
                    <MenuItem value="PRIVATE">Private</MenuItem>
                </Select>
            </FormControl>
            {
                state.type === 'GROUP' && <FormControl variant="standard" sx={{  width: '98%', marginTop: 2, marginBottom: 2, marginLeft: '5px'}}>
                <InputLabel id="group-label">Group</InputLabel>
                <Select
                    labelId="group-label"
                    fullWidth
                    id="group"
                    label="Group"
                    name="group"
                    value={state.group}
                    onChange={handleChange}
                >   
                    {
                        groupsData?.getGroupsThatUserIsAdmin?.map((group, index) => <MenuItem key={index} value={group.name}>{group.name}</MenuItem>)
                    }
                </Select>
            </FormControl>
            }
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

export default ListCreate
