const { reaction } = require("../models");
const jwt = require("jsonwebtoken");

const reactionController = {
  like: async (req, res) => {
    try {
      const { id } = jwt.verify(req.cookies.token , process.env.JWT_SECRET ) ;
      const reactionData = await reaction.findOne({
        where: {
          user_id: id,
          post_id: req.params.id,
        },
      });
      const obj = {};
      if (req.body.operation === "like") {
        obj.like = reactionData?.like ? !reactionData.like : true ;
        obj.dislike = false;
      } else if (req.body.operation === "dislike") {
        obj.like = false;
        obj.dislike = reactionData?.dislike ? !reactionData.dislike : true ;
      }

      if (reactionData?.user_id) {
        await reaction.update(obj, {
          where: {
            user_id: id,
            post_id: req.params.id,
          },
        });
      } else {
        await reaction.create({
          user_id: id,
          post_id: req.params.id,
          ...obj,
        });
      }

      res.send({
        success: true,
        error: null,
      });
    } catch (error) {
      res.send({
        success: false,
        error: error.message || "Something went wrong.",
      });
    }
  },
  getDetails: async (req, res) => {
    try {
      const user = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      const reactionData = await reaction.findAll({
        where: {
          user_id: user.id,
        },
      });
      const reactionMap = reactionData.reduce((first, second) => {
        first[second.post_id] = {
          like: second.like,
          dislike: second.dislike,
        };
        return first;
      }, {});
      res.send({
        data: reactionMap,
        error: null,
      });
    } catch (error) {
      res.status(500).send({
        data: null,
        error: error.message || "Something went wrong.",
      });
    }
  },
  likeDislikeCount: async (req, res) => {
    try {
      const reactionData = await reaction.findAll();
      const reactionMap = reactionData.reduce((first, second) => {
        if (!first[second.post_id]) {
          first[second.post_id] = {
            likes: 0,
            dislikes: 0,
          };
        }
        if (second.like) {
          first[second.post_id].likes++;
        } else if (second.dislike) {
          first[second.post_id].dislikes++;
        }
        return first;
      }, {});

      res.send({
        data: reactionMap,
        error: null,
      });
    } catch (error) {
      res.status(500).send({
        data: null,
        error: error.message || "Something went wrong.",
      });
    }
  },
};

module.exports = { reactionController };
