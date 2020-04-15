/*!
 * lib/model.js
 * dds-familychat (https://github.com/dstegen/dds-familychat)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/dds-familychat/blob/master/LICENSE)
 */

'use strict';

// Required modules
const fs = require('fs');
const path = require('path');

function getModel () {
  let obj = {};
  if (fs.existsSync(path.join(path.resolve(), 'myfamily/myfamily.json'))) {
    try {
      obj = require(path.join(path.resolve(), 'myfamily/myfamily.json'));
      obj.activeMembers.forEach(member => {
        member.active = false;
      });
    } catch (e) {
      console.log('ERROR loading file: '+e);
    }
  } else {
    obj = {
      activeMembers: [
        { name: 'Emmanuel',
          photo: 'media/portrait-woman-1.jpg',
          password: '$2a$10$Z2Os7cux6s92Yk2Adex.4u/Dm1EdXL49w3FLU2QNrnnnT5po7GRk2',
          chat: 'Hello I\'m Emmanuel...\n',
          id: 0,
          active: false
        },
        { name: 'Philip',
          password: '$2a$10$Z2Os7cux6s92Yk2Adex.4u/Dm1EdXL49w3FLU2QNrnnnT5po7GRk2',
          photo: 'media/portrait-man-1.jpg',
          chat: 'Hello I\'m Philip...\n',
          id: 1,
          active: false
        },
        { name: 'Anna',
          password: '$2a$10$Z2Os7cux6s92Yk2Adex.4u/Dm1EdXL49w3FLU2QNrnnnT5po7GRk2',
          photo: 'media/portrait-woman-2.jpg',
          chat: 'Hello I\'m Anna...\n',
          id: 2,
          active: false
        },
        { name: 'Dave',
          password: '$2a$10$Z2Os7cux6s92Yk2Adex.4u/Dm1EdXL49w3FLU2QNrnnnT5po7GRk2',
          photo: 'media/portrait-man-2.jpg',
          chat: 'Hello I\'m Dave...\n',
          id: 3,
          active: false
        },
        { name: 'Lisa',
          password: '$2a$10$Z2Os7cux6s92Yk2Adex.4u/Dm1EdXL49w3FLU2QNrnnnT5po7GRk2',
          photo: 'media/portrait-woman-3.jpg',
          chat: 'Hello I\'m Lisa...\n',
          id: 4,
          active: false
        }
      ]
    }
  }
  return obj;
}

function updateModel (obj, fields) {
  if (fields != '' && fields.chat != '' && fields.id != '' && obj.activeMembers.filter( member => member.id == fields.id)[0] != undefined) {
    obj.activeMembers.filter( member => member.id == fields.id)[0].chat = decodeURIComponent(fields.chat).replace(/\+/g,' ');
    //console.log(obj);
  }
  return obj;
}

function saveUser (obj, userId, hashedPassword) {
  obj.activeMembers.filter( member => member.id == userId)[0].password = hashedPassword;
  try {
    fs.writeFileSync(path.join(__dirname, '../myfamily/myfamily.json'), JSON.stringify(obj));
  } catch (e) {
    console.log('ERROR saving myfamily.json: '+e);
  }
  return obj;
}

module.exports = { getModel, updateModel, saveUser }
