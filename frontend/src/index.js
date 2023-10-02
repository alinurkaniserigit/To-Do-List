import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { GraphQLClient } from './gql';
import reportWebVitals from './reportWebVitals';
import { ToastContainer, toast } from 'material-react-toastify';

import 'material-react-toastify/dist/ReactToastify.css';
import './styles/index.scss';

const GqlClient = GraphQLClient();

const root = document.getElementById('root');
!localStorage.getItem('token') && localStorage.setItem('token', 'login')
ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={ GqlClient }>
      <BrowserRouter>
        <ToastContainer />
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