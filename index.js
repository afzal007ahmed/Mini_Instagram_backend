require("dotenv").config();
const { sequelize } = require("./config/db.config");
const { status } = require("./models/index");
const { app } = require("./app");
const http = require("http");
const httpServer = http.createServer(app);
const { socketIOSetup } = require("./socket");
const { io, userSocketIdMap } = socketIOSetup(httpServer);

io.on("connection", (socket) => {
  socket.on("register", async ({ userId }) => {
    try {
      socket.user_id = userId;
      userSocketIdMap[userId] = socket.id;
      const onlineStatus = await status.findOne({
        where: {
          user_id: userId,
        },
      });
      if (onlineStatus) {
        await status.update(
          {
            status: true,
          },
          {
            where: {
              user_id: userId,
            },
          }
        );
      } else {
        await status.create({
          user_id: userId,
          status: true,
        });
      }
      io.emit("register-response", {
        message: "Connection established.",
      });
    } catch (error) {
      socket.emit("register-response", {
        message: error.message || "Something went wrong.",
      });
    }
  });
  socket.on("disconnect", async () => {
    try {
      await status.update({
        status : false
      } , {
        where : {
          user_id : socket.user_id 
        }
      })
      delete userSocketIdMap[socket.user_id];
      io.emit("disconnect-response" , {});
    } catch (error) { 
      socket.emit("disconnect-response" , {
        message : error.message || "Something went wrong."
      }) 
    }
  });
});

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
