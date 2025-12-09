require("dotenv").config();
const { app } = require("./app");
const { sequelize } = require("./config/db.config");
require("./models/index");

async function serverFunction() {
  try {
    console.log(sequelize.models) ;
    await sequelize.sync();
    app.listen(process.env.PORT, () => {
      console.log("Server is listening.");
    });
  } catch (error) {
    console.log(error.message);
  }
}



serverFunction() ;
