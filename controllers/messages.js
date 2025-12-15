const { getIO, getUserSocketIdMap } = require("../socket");

const { messages, users } = require("../models/index");
const jwt = require("jsonwebtoken");

 const messagesController = {
  add: async (req, res) => {
    try {
      const { id } = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      const io = getIO() ;
      const userSocketMap = getUserSocketIdMap() ;
      await messages.create({
        from_id: id,
        to_id: req.params.id,
        message: req.body.message,
      });
      const user = await users.findOne({
        where : {
            id : id
        }
      })

      io.to(userSocketMap[ req.params.id ]).emit("new-message" , { 
        message : req.body.message ,
        name : user.name ,
        id : id 
       })

       res.send({
         success : true ,
         error : false 
       })

    } catch (error) {
        res.status(500).send({
            success : false ,
            error : error.message || "Something went wrong."
        })
    }
  },
};

module.exports = { messagesController } ;