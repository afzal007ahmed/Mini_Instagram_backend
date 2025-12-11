require("dotenv").config();
const { sequelize } = require("./config/db.config");
require("./models/index");
const {app} = require('./app');
const http = require('http') ;
const httpServer = http.createServer(app) ;
const { socketIOSetup } = require("./socket") ; 
const {io , userSocketIdMap} = socketIOSetup(httpServer);


io.on('connection' , ( socket ) => {
  socket.on('register' , ({ userId }) => {
    socket.user_id = userId ;
     userSocketIdMap[ userId ] = socket.id ;
     socket.emit('register-response' , {
      message : "Connection established."
     })
  }) ;
  socket.on('disconnect' , () => {
    delete userSocketIdMap[ socket.user_id ] ;
  })
})

async function serverFunction() {
  try {
    await sequelize.sync();
    httpServer.listen(process.env.PORT, () => {
      console.log("Server is listening.");
    });
  } catch (error) {
    console.log(error.message);
  }
}

serverFunction();
