import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Security } from '@okta/okta-react';
//import './index.css';

import App from './App';
import * as serviceWorker from './serviceWorker';
//mport registerServiceWorker from './registerServiceWorker';

// added to use Okta Authentication
const oktaConfig = {
    issuer: `${process.env.REACT_APP_OKTA_ORG_URL}/oauth2/default`,
    redirect_uri: `${window.location.origin}/implicit/callback`,
    client_id: process.env.REACT_APP_OKTA_CLIENT_ID,
  };
  

ReactDOM.render(
    // For routes to work properly in React, you need to wrap your
    // whole application in a <Router>. Similarly, to allow access
    // to authenication anywhere in the app, you need to wrap the <App>
    // in a <Security> component provided by Okta. Okta need access
    // to the <Router>, so you wrap it around Security.
    <BrowserRouter>
        <Security {...oktaConfig}>
            <App />
        </Security>
    </BrowserRouter>, 
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
// code commented out: registerServiceWorker();

// To allow for hot module reloading, which will make it
// so that changes you make automatically update in the app
// without needing to refreach the whole page:
if (module.hot) module.hot.accept();