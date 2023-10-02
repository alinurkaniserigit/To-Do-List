import React, {useState, useContext} from 'react'
import { Card, CardActions, CardContent, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Avatar } from '@mui/material';
import ListDelete from './Delete';
import ListShare from './Share';
import { useHistory } from 'react-router-dom';
import {UserContext} from '../../../contexts'

import './list-card.scss';

function ListCard(props) {
    const {item, onListDelete, refetch} = props;
    const [openDelete, setOpenDelete] = useState(false);
    const [openShare, setOpenShare] = useState(false);
    const history = useHistory();

    const { user, setUser } = useContext(UserContext);
    //if the user is lead don't show share and remove elements in card
    const isUserLead = item.admins.map(item=>item.email).includes((user.user.email));
    
    /*
      Get onlistdelete element from props
      When we clicked the button enter listdelete file and delete given item with id
      close the listdelete file
    */
    const onListDeleteClick = () => {
        onListDelete(item.id);
        setOpenDelete(false);
    };
    
    //in the delete file if we select close button close the flashup screen
    const handleDeleteClose = () => {
      setOpenDelete(false);
    };

    //Same system with groupcard
    const stringToColor = (string) => {
        let hash = 0;
        let i;      
        for (i = 0; i < string.length; i += 1) {
          hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';
      
        for (i = 0; i < 3; i += 1) {
          const value = (hash >> (i * 8)) & 0xff;
          color += `00${value.toString(16)}`.substr(-2);
        }
        return color;
      }

    const stringAvatar = (name) => {
        const splittedName = name.split(' ');
        return name ? {
          sx: {
            bgcolor: stringToColor(name),
          },
          children: `${splittedName[0][0]}${splittedName.length > 1 ? splittedName[1][0] : ''}`,
        } : {};
      }

    /*
      Almost same with the groupcard
      Only difference is share and delete operations
      On share enters the share component
      On delete enters the delete component
      On view enters the list page with given id
      If user isn't admin he/she can't see the share and delete operations
    */
    return (
        <div style={{border: `1px solid ${item.users.length > 1 ? 'blue' : 'red'}`}}>
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                    
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {item.name}
                    </Typography>
                    <Typography variant="body2">
                    {item.description || ''}
                    <br />
                    </Typography>
                    <Typography variant="body2">
                    {item.group ? `Group: ${item.group}` : ''}
                    <br />
                    </Typography>
                    <div className="list-card__users">
                        {item?.users?.map((user, index)=> index < 4 && <Avatar key={index} {...stringAvatar(user.name)} />)}
                    </div>
                    
                </CardContent>
                <CardActions>
                    <div className="list-card__buttons">
                        { isUserLead &&
                          <Button size="small" onClick={()=> setOpenShare(true)}>Share</Button>
                        }
                          <Button size="small" onClick={()=> history.push(`/lists/${item.id}`)}>View</Button>
                        { isUserLead &&
                          <Button size="small" onClick={()=> setOpenDelete(true)}>Delete</Button>
                        }
                    </div>
                </CardActions>
            </Card>

            <ListDelete
              open={openDelete}
              handleDeleteClose={handleDeleteClose}
              onListDeleteClick={onListDeleteClick}
              name={item.name}
            />

            <ListShare
              modalOpen={openShare}
              setModalOpen={setOpenShare}
              listId={item.id}
              name={item.name}
              refetch={refetch}
            />
            
        </div>
    )
}

export default ListCard;
