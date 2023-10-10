import React, {useContext, useEffect, useState} from 'react'
import ListCard from './GroupCard'
import { useLazyQuery } from '@apollo/client';
import { GET_GROUPS_QUERY } from '../../gql/queries';
import GroupCreate from './Create';
import { Button, Typography } from '@mui/material';
import './groups.scss';
import { UserContext } from '../../contexts';
//import { User } from '../../../../backend/helpers/role';

function Groups() {
    /*
    Call query with lazy query
    It puts a pointer to the database and calls query on demand
    */
    const [getGroups, {data, loading, error}] = useLazyQuery(GET_GROUPS_QUERY);
    const [groups, setGroups] = useState([]); //state
    const [modalOpen, setModalOpen] = React.useState(false); //modal
    const user = useContext(UserContext);
    console.log("user",user.user.email);
    //if any change get the groups
    useEffect(() => {
        getGroups({variables: {}});
    }, [])

    //if any change in the data set groups with current groups in database
    useEffect(() => {
        data && setGroups(data?.getGroups);
    }, [data])

    //Group cards page
    /*
        Groups text
        Create new group button, on the click it opens the modal
        Each group have a item we are mapping them with indexes and fetching by calling getGroups
        If we are getting the info from database, in the wait phase it writes Loading...
        If there is an error prints error message
        Calls the groupcreate component
    */
    return (
        <div>
            <div className="groups__header">
                <Typography variant="h4" gutterBottom component="div">
                    Groups
                </Typography>
                <Button color="secondary" variant="outlined" onClick={e=>setModalOpen(true)}>Create new Group</Button>
            </div>
            <div className="groups__items-wrapper">
                {groups.length>0?groups.map((item, index) => 
                    <ListCard 
                        key={index} 
                        item={item}
                        refetch={getGroups} />):
                        <Typography variant="h5" gutterBottom component="div">
                            No groups found
                        </Typography>}
            </div>
            {loading && <div>Loading...</div>}
            {error && <div>An error occured. Please try again later.</div>}
            <GroupCreate modalOpen={modalOpen} setModalOpen={setModalOpen} refetch={getGroups} />
        </div>
    )
}

export default Groups