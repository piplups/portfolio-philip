// The following loads the environment variables we used in the React app.
// This way we can recycle env variables and have them in one place.
require('dotenv').config({ path: '.env.local' });

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const epilogue = require('epilogue');
const OktaJwtVerifier = require('@okta/jwt-verifier');

const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
  issuer: `${process.env.REACT_APP_OKTA_ORG_URL}/oauth2/default`,
});

/**------------------------------------------------
 * ---------- Express Server Section --------------
 * ----------------------------------------------*/
// This sets up the HTTP server and adds some settings to allow
// for Cross-Origin Resource Sharing (CORS) and will automatically parse JSON
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(async (req, res, next) => {
  try {
    if (!req.headers.authorization) throw new Error('Authorization header is required');

    const accessToken = req.headers.authorization.trim().split(' ')[1];
    await oktaJwtVerifier.verifyAccessToken(accessToken);
    next();       // this notifies express to continue and process the request
  } catch (error) {
    next(error.message);
  }
});

/**------------------------------------------------
 * ---- Sequelize Database Model Section ----------
 * ----------------------------------------------*/
const database = new Sequelize({
  dialect: 'sqlite',
  storage: './test.sqlite',
});

const Post = database.define('posts', {
  title: Sequelize.STRING,
  body: Sequelize.TEXT,
});

/**------------------------------------------------
 * -------------- Epilogue Section ----------------
 * ----------------------------------------------*/
epilogue.initialize({ app, sequelize: database });

epilogue.resource({
  model: Post,
  endpoints: ['/posts', '/posts/:id'],
});

const port = process.env.SERVER_PORT || 3001;

database.sync().then(() => {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
});