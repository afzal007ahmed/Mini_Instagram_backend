const express = require("express");
const { postsController } = require("../controllers/posts");
const { reactionController } = require("../controllers/reactions");
const postsRouter = express.Router();

  postsRouter.post("/",postsController.create);
  postsRouter.get("/feed", postsController.feed);
  postsRouter.put("/:id/like", reactionController.like);
  postsRouter.get("/reaction/all", reactionController.getDetails);
  postsRouter.get("/reaction/count", reactionController.likeDislikeCount);
  postsRouter.post("/:id/comment", postsController.addComment);
  postsRouter.get("/comments", postsController.getAllComments);
  postsRouter.delete("/:id/comment", postsController.deleteComment);

module.exports = { postsRouter};
