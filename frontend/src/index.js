import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { GraphQLClient } from './gql';
import reportWebVitals from './reportWebVitals';
import './styles/index.scss';
import { UserContext } from './contexts';


const GqlClient = GraphQLClient();

const root = document.getElementById('root');
!localStorage.getItem('token') && localStorage.setItem('token', 'login')
ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={ GqlClient }>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>,
  root
  );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();