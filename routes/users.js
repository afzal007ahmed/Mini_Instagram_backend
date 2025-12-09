const express = require('express') ;
const { usersController } = require('../controllers/users');

const userRouter = express.Router() ;

userRouter.get('/all/:id' , usersController.all ) ;
userRouter.put('/:id/follow' , usersController.follow);
userRouter.get('/:id/following' , usersController.getFollowing);
userRouter.get('/:id/followers' , usersController.totalFollowers ) ;
userRouter.get('/:id/posts' , usersController.getAllPosts);
userRouter.post('/change/profile' , usersController.changeProfile ) ;
userRouter.get('/' , usersController.getDetails ) ;

module.exports = { userRouter } ;