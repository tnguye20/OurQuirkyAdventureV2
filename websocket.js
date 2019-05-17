const app = require('./app');
const http = require('http');
const ws = require('ws');

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/* WebSocket Listener */
const wss = new ws.Server({
  server: server
});

wss.on("connection", async (socket, req) => {
  socket.send(JSON.stringify({
    statusCode: 0,
    status: "Init"
  }))

  socket.on("message", (msg) => {
    try{
      const package = JSON.parse(msg);
      if(package !== null){
        switch(package.action){
          case "updateMemory": {
            wss.clients.forEach( client => {
              client.send(JSON.stringify({
                statusCode: 0,
                status: "Update Memory",
                action: "updateMemory",
                mask: package.mask,
                title: package.title,
                note: package.note
              }))
            });
            break;
          }
          case "deleteMemory": {
            wss.clients.forEach( client => {
              client.send(JSON.stringify({
                statusCode: 0,
                status: "Delete Memory",
                action: "deleteMemory",
                mask: package.mask,
              }))
            });
            break;
          }
        }
      }
    }catch(err){
      console.error(err);
      wss.clients.forEach( client => {
        if(client !== socket){
          client.send(JSON.stringify({
            statusCode: 1,
            status: "Something went wrong. Please call Thang Nguyen for help"
          }))
        }
      });
    }
  });
})

module.exports.server = server;
module.exports.port = port
