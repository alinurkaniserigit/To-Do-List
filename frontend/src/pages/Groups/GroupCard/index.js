import React, {useState,useContext} from 'react'
import { Card, CardActions, CardContent, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Avatar } from '@mui/material';
import GroupShare from './Share';
import { UserContext } from '../../../contexts';

import './group-card.scss';

function GroupCard(props) {
    const {item, refetch} = props; //getting item and refetch properties from props
    const [openShare, setOpenShare] = useState(false); //initializing openShare state for modal
    const { user, setUser } = useContext(UserContext);

    const isUserLead = (item.leadMail === user.user.email)
    
   
    //to give a color to circle (on each group card)
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

    //to create a circle and writing first two words' letters into that, 
    //uses stringToColor
    const stringAvatar = (name) => {
        const splittedName = name.split(' '); //split given name
        //create circle
        return name ? {
          sx: {
            bgcolor: stringToColor(name),
          },
          children: `${splittedName[0][0]}${splittedName.length > 1 ? splittedName[1][0] : ''}`,
        } : {};
      }

    //creates a card with minWidth 278
    //card contains item name on the top
    //under item name, it shows lead email of group
    //under that it shows the members by avatars by checking if item and users are null
    //if they are null it doesn't create anything, if its not creates avatars
    //at the end there is a button with on click event open modal, 
    //if we click it we are fetching screen to groupcard/share/index.js
    return (
        <div style={{border: `1px solid ${item.users.length > 1 ? 'blue' : 'red'}`}}>
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {item.name}
                    </Typography>
                    <div style={{lineHeight: '40px'}}>Lead: {item.leadMail}</div>
                    <div>
                      <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        Members of the group:
                      </Typography>
                      
                      <div className="group-card__users">
                        {item?.users?.map((user, index)=> {
                          return <div key={index}>
                            <Avatar {...stringAvatar(user.name)} />
                              <span>{user.name}</span>
                            </div>
                        })}
                      </div>
                    </div>
                    
                </CardContent>
                <CardActions>
                    { isUserLead &&
                      <div className="group-card__buttons">
                        <Button size="small" onClick={()=> setOpenShare(true)}>Share</Button> 
                      </div>
                    }
                </CardActions>
            </Card>

            <GroupShare
              modalOpen={openShare}
              setModalOpen={setOpenShare}
              groupId={item.id}
              name={item.name}
              refetch={refetch}
            />
            
        </div>
    )
}

export default GroupCard;
