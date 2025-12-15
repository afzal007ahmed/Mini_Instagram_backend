const { cloudinary } = require("../config/cloudinary.config");
const {
  users,
  follows,
  posts,
  comments,
  reaction,
  status,
} = require("../models/index");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");

const usersController = {
  all: async (req, res) => {
    try {
      const { id } = req.params;
      const response = await users.findAll({
        attributes: ["name", "gender", "id", "url"],
        where: {
          id: {
            [Op.ne]: id,
          },
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
  follow: async (req, res) => {
    try {
      const { id } = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      const exist = await follows.findOne({
        where: {
          user_id: id,
          follow_id: req.params.id,
        },
      });
      if (!exist) {
        await follows.create({
          user_id: id,
          follow_id: req.params.id,
          status: true,
        });
      } else {
        await follows.update(
          {
            status: !exist.status,
          },
          {
            where: {
              user_id: id,
              follow_id: req.params.id,
            },
          }
        );
        if (exist.status) {
          let postIds = await posts.findAll({
            where: {
              user_id: req.params.id,
            },
          });
          postIds = postIds.map((i) => i.id);
          await comments.destroy({
            where: {
              user_id: id,
              post_id: { [Op.in]: postIds },
            },
          });

          await reaction.destroy({
            where: {
              user_id: id,
              post_id: { [Op.in]: postIds },
            },
          });
        }
      }
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
  getFollowing: async (req, res) => {
    try {
      const response = await follows.findAll({
        where: {
          user_id: req.params.id,
          status: true,
        },
      });
      const followingMap = response.reduce((first, second) => {
        first[second.follow_id] = true;
        return first;
      }, {});

      res.send({
        data: followingMap,
        error: null,
      });
    } catch (error) {
      res.status(500).send({
        data: null,
        error: error.message || "Something went wrong.",
      });
    }
  },
  totalFollowers: async (req, res) => {
    try {
      const response = await follows.findAll({
        where: {
          follow_id: req.params.id,
          status: true,
        },
        include: [
          {
            model: users,
            as: "follower",
            attributes: ["name", "gender", "url", "id"],
          },
        ],
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
  getAllPosts: async (req, res) => {
    try {
      const response = await posts.findAll({
        where: {
          user_id: req.params.id,
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
  changeProfile: async (req, res) => {
    try {
      const { image } = req.files;
      const user = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      const obj = {};
      if (req.body?.public_id) {
        obj.public_id = req.body.public_id;
        obj.overwrite = true;
      } else {
        obj.folder = "Profile_Images";
      }
      const response = await cloudinary.uploader.upload(image.tempFilePath, {
        ...obj,
      });
      await users.update(
        { url: response.secure_url, public_id: response.public_id },
        {
          where: {
            id: user.id,
          },
        }
      );

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
  getDetails: async (req, res) => {
    try {
      const user = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      const response = await users.findOne({
        attributes: [
          "id",
          "name",
          "url",
          "public_id",
          "gender",
          "age",
          "email",
        ],
        where: {
          id: user.id,
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
  onlineStatus: async (req, res) => {
    try {
      const onlineStatus = await status.findAll();
      const statusMap = {} ;
      onlineStatus?.forEach(( item ) => {
        statusMap[ item.user_id ] = item.status ;
      })
      res.send({
        data : statusMap ,
        error : null 
      })
    } catch (error) {
      res.status(500).send({
        data : null ,
        error : error.message || "Something went wrong."
      })
    }
  },
};

module.exports = { usersController };
