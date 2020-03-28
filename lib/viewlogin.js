/*!
 * lib/viewlogin.js
 dds-familychat (https://github.com/dstegen/dds-familychat)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/dds-familychat/blob/master/LICENSE)
 */

function viewLogin (obj) {
  return `
    <!DOCTYPE HTML>
    <html lang="de">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <!-- Bootstrap, jquery and CSS -->
        <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.min.css">
        <link rel="stylesheet" href="/node_modules/jquery-ui-dist/jquery-ui.min.css">
        <link rel="stylesheet" href="/public/styles.css">
        <title>familyChat</title>
      </head>
      <body>
        <div class="container">
          <h1>familyChat - Login</h1>
          <form id="login" action="/login" method="get">
            <input type="text" id="name" name="name" placeholder="Name" value="" required/>
            <input type="password" id="passwd" name="passwd" placeholder="Passwort" value="" required/>
            <input type="submit" value="Einloggen" />
          </from>
        </div>
      </body>
    </html>
  `;
}

module.exports = viewLogin;
