require("dotenv").config();
const { app } = require("./app");
const { sequelize } = require("./config/db.config");
require("./models/index");
const { Server } = require("socket.io");
const http = require("http");
const httpServer = http.createServer(app);
const io = new Server(httpServer , {
  cors : {
    origin : true 
  }
}) ; 

const userSocketIdMap = {} ;

io.on('connection' , ( socket ) => {
  socket.on('register' , ({ userId }) => {
    socket.user_id = userId ;
     userSocketIdMap[ userId ] = socket.id ;
     console.log( userSocketIdMap ) ;
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
