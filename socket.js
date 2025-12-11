const { Server } = require("socket.io");

let io ; 
let userSocketIdMap = {} ;
function socketIOSetup(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: true,
    },
  });
  return { io , userSocketIdMap } ;
}


function getIO() {
    return io ;
}

function getUserSocketIdMap() {
    return userSocketIdMap ;
}


module.exports = { socketIOSetup , getIO , getUserSocketIdMap  };
