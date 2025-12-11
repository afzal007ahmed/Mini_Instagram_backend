const { getIO, getUserSocketIdMap } = require("../socket");
const { cloudinary } = require("../config/cloudinary.config");
const { posts, users, follows, comments } = require("../models/index");
const jwt = require("jsonwebtoken");

const postsController = {
  create: async (req, res) => {
    try {
      const io = getIO();
      const userSocketIdMap = getUserSocketIdMap();
      const { title, userId } = req.body;
      let message = "";
      if (title.length === 0) {
        message = "Please provide title of your post.";
      } else if (!userId) {
        message = "Please provide the user_id.";
      }
      if (message) {
        return res.status(400).send({
          data: null,
          error: message,
        });
      }
      let response;
      if (req.files?.image) {
        response = await cloudinary.uploader.upload(
          req.files.image.tempFilePath,
          { folder: "posts" }
        );
      }

      const obj = {
        title: title,
        user_id: userId,
      };

      if (req.body.description) {
        obj.description = req.body.description;
      }
      if (response) {
        obj.url = response.secure_url;
        obj.public_id = response.public_id;
      }

      await posts.create({ ...obj });
  
      const user = await users.findOne({
        where: {
          id : userId 
        }
      })
      const usersFollowing = await follows.findAll({
        where: {
          follow_id: userId,
          status: true,
        },
        include: [
          {
            model: users,
            as: "follower",
          },
        ],
      });

      console.log(usersFollowing);
      usersFollowing.forEach((item) => {
        console.log(userSocketIdMap, item.user_id, io);
        io.to(userSocketIdMap[item.user_id]).emit("create-post-response", {
          message: user.name + " has a new post.",
        });
      });

      res.send({
        success: true,
        error: null,
      });
    } catch (error) {
      res.status(500).send({
        data: null,
        error: error.message || "Something went wrong.",
      });
    }
  },
  getAll: async (req, res) => {
    try {
      const response = await posts.findAll({
        where: {
          id: req.params.id,
        },
      });
      res.send({
        data: response,
        error: null,
      });
    } catch (error) {
      res.status(500).send({
        data: null,
        error: error.message || "Something went wrong.",
      });
    }
  },
  feed: async (req, res) => {
    try {
      const user = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      const postResponse = await follows.findAll({
        where: {
          user_id: user.id,
          status: true,
        },
        include: [
          {
            model: users,
            attributes: ["name", "id", "url", "gender"],
            as: "following",
            include: [
              {
                model: posts,
              },
            ],
          },
        ],
      });

      res.send({
        data: postResponse,
        error: null,
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        error: error.message || "Something went wrong.",
      });
    }
  },
  addComment: async (req, res) => {
    try {
      const { comment } = req.body;
      const { id: userId } = jwt.verify(
        req.cookies.token,
        process.env.JWT_SECRET
      );
      await comments.create({
        user_id: userId,
        post_id: req.params.id,
        content: comment,
        parent_id: req.body.parentId ? req.body.parentId : null,
      });

      res.send({
        success: true,
        error: null,
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        error: error.message || "Something went wrong.",
      });
    }
  },
  getAllComments: async (req, res) => {
    try {
      const allComments = await posts.findAll({
        include: [
          {
            model: comments,
            include: [
              {
                model: users,
                attributes: ["id", "url", "name", "age", "gender"],
              },
            ],
          },
        ],
      });
      const allCommentsMap = allComments.reduce((first, second) => {
        const sorted = second.comments.sort(
          (a, b) => b.createdAt - a.createdAt
        );
        first[second.id] = [...sorted];
        return first;
      }, {});
      res.send({
        data: allCommentsMap,
        error: null,
      });
    } catch (error) {
      res.send({
        data: null,
        error: error.message || "Something went wrong.",
      });
    }
  },
  deleteComment: async (req, res) => {
    try {
      const user = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      await comments.destroy({
        where: {
          id: req.params.id,
          user_id: user.id,
        },
      });

      res.send({
        success: true,
        error: null,
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        error: null,
      });
    }
  },
};

module.exports = {
  postsController,
};
