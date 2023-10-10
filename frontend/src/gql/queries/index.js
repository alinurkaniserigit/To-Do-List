import { gql } from '@apollo/client';

export const LOGIN_QUERY = gql`
query($email:String!,$password:String!){
    login(email:$email,password:$password){
        userID
        email
        token
        name
    }
}
`

export const GET_LISTS_QUERY=gql`
query{
    getLists{
        id
        name
        type
        description
        group
        listItems{
            description
        }
        users{
            name
            email
        } 
        admins{
            email
        }
    }
}
`

export const GET_LISTS_OF_GROUPS = gql`
query($groupName:String!){
    getListsOfGroup(groupName:$groupName){
        name
        email
    }
}
`

export const GET_GROUPS_QUERY = gql`
    query{
        getGroups{
            id
            name
            leadMail
            users{
                name
            }
        }
    }
`

export const GET_LIST_QUERY = gql`
    query($listId:String!){
        getList(listId:$listId){
            id
            name
            email
            type
            description
            group
            listItems{
                id
                description
                importancy
                isDone
            }
            users{
                name
            } 
            admins{
                email
            }
        }
    }
`

export const GET_GROUPS_THAT_USER_IS_ADMIN_QUERY = gql`
    query{
        getGroupsThatUserIsAdmin{
            id
            name
            leadMail
            users{
                name
                email
            }
        }
    }
`