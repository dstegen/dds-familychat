/*!
 * lib/controller.js
 * dds-familychat (https://github.com/dstegen/dds-familychat)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/dds-familychat/blob/master/LICENSE)
 */

'use strict';

// Required modules
const fs = require('fs');
const path = require('path');
const {cookie, uniSend, getFormObj, Auth, SendObj} = require('webapputils-ds');
const view = require('./view');
const viewLogin = require('./viewlogin');
const model = require('./model');

let obj = model.getModel();
const authenticate = new Auth(path.join(__dirname, '../sessionids.json'));
let passwdObj = getPasswdObj(obj);
let lastChatterId = '';


try {
  if (fs.existsSync(path.join(__dirname, '../sessionids.json'))) {
    fs.unlinkSync(path.join(__dirname, '../sessionids.json'));
  }
} catch (e) {
  console.log('ERROR removing sessionids.json: '+e);
}

function webView (request, response, wss, wsport) {
  if (authenticate.loggedIn(cookie(request).sessionid)) {
    uniSend(view(request, wss, wsport, obj, obj.activeMembers.filter( member => member.name == authenticate.getUserId(cookie(request).sessionid))[0].id, lastChatterId), response);
  } else {
    uniSend(viewLogin(), response);
  }
}

function chatView (request, response, wss) {
  getFormObj(request).then(
    data => {
      if (authenticate.loggedIn(cookie(request).sessionid)) {
        model.updateModel(obj, data.fields);
      }
      lastChatterId = data.fields.id;
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
      let sessionId = authenticate.login(passwdObj, data.fields.username, data.fields.password);
      if (sessionId != undefined) {
        obj.activeMembers.filter( member => member.name == data.fields.username)[0].active = true;
        obj.activeMembers.filter( member => member.name == data.fields.username)[0].sessionId = sessionId;
        wsFeddback(wss, 'update');
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
  try {
    obj.activeMembers.filter( member => member.sessionId === cookie(request).sessionid)[0].active = false;
  } catch (e) {
    console.log('ERROR setting members active state: '+e);
  }
  authenticate.logout(cookie(request).sessionid);
  wsFeddback(wss, 'update');
  uniSend(new SendObj(302, ['sessionid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;']), response);
}

function updateUser (request, response) {
  getFormObj(request).then(
    data => {
      if (authenticate.loggedIn(cookie(request).sessionid)) {
        obj = model.saveUser(obj, data.fields.id, authenticate.addPasswd({}, data.fields.id, data.fields.settings_passwd)[data.fields.id]);
        passwdObj = getPasswdObj(obj);
      }
      uniSend(new SendObj(302), response);
    }
  ).catch(
    error => {
      console.log('ERROR update user: '+error.message);
  });
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

function getPasswdObj (obj) {
  let passwdObjLocal = {};
  obj.activeMembers.forEach( member => {
    passwdObjLocal[member.name] = member.password;
  });
  return passwdObjLocal;
}

module.exports = { webView, login, logout, chatView, updateUser };
