import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';



function ListDelete(props) {

    //get 
    const {open, handleDeleteClose, name, onListDeleteClick} = props;
    
    return (
        <Dialog
            open={open}
            onClose={handleDeleteClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Are you sure you want to delete "{name}" item? 
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                You cannot undo this action.
            </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteClose}>Cancel</Button>
              <Button onClick={onListDeleteClick} autoFocus>
                  Delete
              </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ListDelete
