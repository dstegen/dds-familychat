/*!
 * lib/router.js
 * dds-familychat (https://github.com/dstegen/dds-familychat)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/dds-familychat/blob/master/LICENSE)
 */

'use strict';

// Required modules
const path = require('path');
const { deliver } = require('webapputils-ds');
const {webView, login, logout, chatView } = require('./controller');

function router (request, response, wss, wsport) {
  let route = request.url.substr(1).split('?')[0];
  if (request.url.includes('media') || request.url.includes('myfamily') || request.url.includes('node_modules') || request.url.includes('public') || request.url.includes('favicon')) route = 'static';
  switch (route) {
    case 'static':
      deliver(request, response);
      break;
    case 'login':
      login(request, response, wss);
      break;
    case 'logout':
      logout(request, response, wss);
      break;
    case 'chat':
      chatView(request, response, wss);
      break;
    default:
      webView(request, response, wss, wsport);
  }
}

 module.exports = router;
