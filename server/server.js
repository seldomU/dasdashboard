'use strict';
const express = require('express')
var expressWs = require('express-ws');
const path = require('path');

function startServer(settings, state) {

  const app = express();

  // support websocket routes
  // this allows the server to stream command results back to the client
  expressWs(app);

  // don't allow remote clients
  app.use((req, res, next) => {
    if (req.ip === "127.0.0.1" || req.ip === "::ffff:127.0.0.1" || req.ip === "::1") {
      next();
      return;
    }
    // it's a remote request. respond nothing.
  })

  // static files
  app.use('/', express.static(path.join(__dirname, "..", 'client')));
  app.use('/pages', express.static(settings.contentPath) );
  app.use('/extensions', express.static( path.join(settings.contentPath, "_clientextensions") ) );
  app.use('/assets', express.static( path.join(settings.contentPath, "_assets") ))

  // parse json body contents before route handlers run
  app.use(express.json());

  // API routes
  // load them after initializing expressWs,
  // because that adds the .ws() method to the Router prototype
  const getAPI1 = require('./api1.js');
  app.use('/api', getAPI1(settings, state));

  let server = app.listen(settings.serverPort);
  console.log("dasdash serving folder " + settings.contentPath);
  console.log("Open dashboard at http://localhost:" + server.address().port);
  return server;
}

module.exports = startServer;