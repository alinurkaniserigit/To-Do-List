import React, {useEffect, useState} from "react";
import { ListItem, ListItemText, ListItemSecondaryAction, IconButton, ListItemButton, ListItemIcon, Checkbox } from "@mui/material";
import {Delete} from "@mui/icons-material";
import { Draggable } from "react-beautiful-dnd";
import { useMutation } from '@apollo/client';
import { removeListItemMutation, changeListItemDoneMutation } from '../../../gql/mutations'
import ListItemDeleteDialog from './Delete';

//create list item component
const Item = ({ itemObject, index, isDragging, refetch }) => {
  const [openDelete, setOpenDelete] = useState(false); //if its false we won't see the item
  
  const [handleListItemDelete, { data:listItemDeleteData }] = useMutation(removeListItemMutation); //remove the item
  const [handleListItemDone, { data: listItemDoneData }] = useMutation(changeListItemDoneMutation); //change the isDone of item
  
  //give color related to the importancy of item
  const getColor = () =>{
    if(itemObject.importancy === 'HIGH') return 'orange';
    else if(itemObject.importancy === 'NORMAL') return 'lightblue';
    else if(itemObject.importancy === 'LOW') return 'lightgreen';
    return 'black';
  }
  //if we click a item make the value to reverse of it
  const handleToggle = () => {
    handleListItemDone({
      variables: {
        itemId: itemObject.id,
        value: !itemObject.isDone 
      }
    })
  };

  //fill the args on delete
  const onItemDelete = () => {
    handleListItemDelete({
      variables: {
        itemId: itemObject.id 
      }
    })
    setOpenDelete(false)
  }

  //at each change of listItemDeleteData, refect and setOpenDelete false
  useEffect(() => {
    if(listItemDeleteData){
        refetch()
        setOpenDelete(false)
    }
  }, [listItemDeleteData])

  //at each change on listItemDoneData refect
  useEffect(() => {
    if(listItemDoneData){
        refetch()
    }
  }, [listItemDoneData])

  /*
    Create draggable object
    Create a list item
    Make the whole listitem a button, create a checkbox and put text field
    Create an iconbutton and give it color related to importancy
    Create an iconbutton and give it trash can symbol, make it able to dalete elements
    While moving the buttons don't show them
  */
  return (
    <>
    <Draggable draggableId={itemObject.id} key={itemObject.id} index={index}>
      {(provided) => (
        <ListItem
          key={itemObject.id}
          role={undefined}
          dense
          ContainerComponent="li"
          ContainerProps={{ ref: provided.innerRef }}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <ListItemButton role={undefined} onClick={handleToggle} dense>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={!!itemObject.isDone}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': itemObject.id }} />
              </ListItemIcon>
              <ListItemText
                styles={{ fontFamily: "Quicksand" }}
                primary={`${itemObject.description}`}
              />
            </ListItemButton>
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="comments"
              question-uid={itemObject.id}
            >
            {!isDragging && <div style={{height: '20px',width: '20px', backgroundColor: getColor()}}/>}
            </IconButton>
            <IconButton
              edge="end"
              aria-label="comments"
              question-uid={itemObject.id}
              onClick={()=>setOpenDelete(true)}
            >
            {!isDragging && <Delete />}
            </IconButton>
            
          </ListItemSecondaryAction>
          
        </ListItem>
      )}
    </Draggable>
    <ListItemDeleteDialog
              open={openDelete}
              handleDeleteClose={()=>setOpenDelete(false)}
              onListDeleteClick={onItemDelete}
              name={itemObject.description}
    />
    </>
  );
};

export default Item;
