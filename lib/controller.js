/*!
 * lib/controller.js
 * dds-familychat (https://github.com/dstegen/dds-familychat)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/dds-familychat/blob/master/LICENSE)
 */

'use strict';

// Required modules
const path = require('path');
const {cookie, uniSend, getFormObj, authenticate, SendObj} = require('webapputils-ds');
const view = require('./view');
const viewLogin = require('./viewlogin');
const model = require('./model');

let obj = model.getModel();
let sessionFilePath = path.join(__dirname, '../sessionids.json');
let passwdObj = {}
obj.activeMembers.forEach((member, i) => {
  passwdObj[member.name] = member.password;
  member.active = false;
});


function webView (request, response, wss, wsport) {
  if (authenticate.loggedIn(cookie(request).sessionid, sessionFilePath)) {
    uniSend(view(request, wss, wsport, obj, obj.activeMembers.filter( member => member.name == authenticate.getUserId(cookie(request).sessionid, sessionFilePath))[0].id), response);
  } else {
    uniSend(viewLogin(), response);
  }
}

function chatView (request, response, wss) {
  getFormObj(request).then(
    data => {
      if (authenticate.loggedIn(cookie(request).sessionid, sessionFilePath)) {
        model.updateModel(obj, data.fields);
      }
      wsFeddback(wss, 'update');
      uniSend(new SendObj(302), response);
    }
  ).catch(
    error => {
      console.log('ERROR chat: '+error.message);
  });
}

function login (request, response, wss) {
  getFormObj(request).then(
    data => {
      let sessionId = authenticate.login(passwdObj, data.fields.username, data.fields.password, sessionFilePath);
      if (sessionId != undefined) {
        obj.activeMembers.filter( member => member.name == data.fields.username)[0].active = true;
        wsFeddback(wss, 'update');
        uniSend(new SendObj(302, ['sessionid='+sessionId]), response);
      } else {
        uniSend(new SendObj(302), response);
      }
    }
  ).catch(
    error => {
      console.log('ERROR login: '+error.message);
  });
}

function logout (request, response, wss) {
  obj.activeMembers.filter( member => member.name == authenticate.getUserId(cookie(request).sessionid, sessionFilePath))[0].active = false;
  authenticate.logout(cookie(request).sessionid, sessionFilePath);
  wsFeddback(wss, 'update');
  uniSend(new SendObj(302, ['sessionid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;']), response);
}


// Additional functions

function wsFeddback (wss, txt) {
  if (txt == undefined || txt == '') txt ='test';
  wss.clients.forEach(client => {
    //console.log(client.readyState);
    setTimeout(function () {
      client.send(txt)
    }, 100);
  });
}

module.exports = { webView, login, logout, chatView };
