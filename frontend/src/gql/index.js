import {API_URL} from '../app-consts';
import {ApolloClient, InMemoryCache, createHttpLink, from} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from "@apollo/client/link/error";


export const GraphQLClient = () => {
  const getToken = () => `Bearer ${localStorage.getItem('token')}`;

  const httpLink = createHttpLink({
    uri: `${API_URL}`
  });
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) => {
        return console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
      });
  
    if (networkError){
      console.error(`[Network error]: ${networkError}`);
    } 
  });
  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = getToken();
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ,
      }
    }
  });

  return new ApolloClient({
    link: authLink.concat(errorLink).concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all'
      },
      query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all'
      },
      mutate: {
        errorPolicy: 'all'
      }
    }
  });
};
