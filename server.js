'use strict';

const express = require('express');
const { Server } = require('ws');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  //.use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });

const openedMsg = {
    "version": 2,
    "type": "opened",
    "seq": 1,
    "clientseq": 1,
    "id": "sessionid",
    "parameters": {
        "startPaused": false,
        "media": [
            {
                "type": "audio",
                "format": "PCMU",
                "channels": ["external", "internal"],
                "rate": 8000
            }
        ]
    }
}

const closedMsg = {
    "version": "2",
    "type": "closed",
    "seq": 1,
    "clientseq": 1,
    "id": "sessionid",
    "parameters": {}
  }

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('message', function message(data) {
    console.log('received: %s', data);
    let dataObj = JSON.parse(data);
    let id = dataObj.id;
    console.log(id);
    if (dataObj.type == 'open') {
        ws.send(JSON.stringify(openedMsg).replace("sessionid", id));
    } else if (dataObj.type == 'close') {
        ws.send(JSON.stringify(closedMsg));
    }
    
  });
  ws.on('close', () => console.log('Client disconnected'));
});

/*setInterval(() => {
  wss.clients.forEach((client) => {
    client.send(new Date().toTimeString());
  });
}, 1000);*/
