import { gql } from '@apollo/client';

//Mutations
export const registerMutation=gql`
    mutation($name:String!,$email:String!,$password:String!){
        register(name:$name, email:$email, password:$password){
            name
            token
            email
        }
    }
`

export const updateUserInfoMutation=gql`
    mutation($name:String,$password:String){
        updateUserInfo(name:$name, password:$password){
            name
            password
        }
    }
`

export const createListMutation=gql`
    mutation($name:String!,$description:String!,$type:String,$group:String){
        createList(name:$name, description:$description,type:$type, group:$group){
            name
            description
            type
            group
        }
    }
`

export const createGroupMutation=gql`
    mutation($name:String!){
        createGroup(name:$name){
            name
        }
    }
`

export const removeUserMutation=gql`
mutation($token:String!){
    removeUser(token:$token){
        email
    }
}
`

export const addUserToBlockListMutation=gql`
mutation($token:String!){
    addUserToBlockList(token:$token){
        email
    }
}
`

export const removeListMutation=gql`
    mutation($listId:String!){
        removeList(listId:$listId){
            name
        }
    }
`

export const addUserToListMutation=gql`
    mutation($email:String!,$listId:String!){
        addUserToList(email:$email,listId:$listId){
            name
        }
    }
`

export const addUserToGroupMutation = gql`
    mutation($email:String!,$groupId:String!){
        addUserToGroup(email:$email,groupId:$groupId){
            name
        }
    }
`

export const createListItemMutation=gql`
    mutation($description:String!,$importancy:String,$listID:String!){
        addListItem(description:$description, importancy:$importancy, listID:$listID){
            description
            importancy
            listID
            isDone
        }
    }
`

export const removeListItemMutation = gql`
    mutation($itemId:String!){
        removeListItem(itemId:$itemId){
            description
        }
}
`

export const changeListItemDoneMutation = gql`
    mutation($itemId:String!, $value: Boolean!){
        changeListItemDone(itemId:$itemId, value: $value){
            description
        }
}
`

export const confirmationMutation = gql`
    mutation($token:String!){
        activateAccount(token:$token){
            name
            password
            email
        }
}
`
