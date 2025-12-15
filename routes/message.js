const { messagesController } = require('../controllers/messages');

const messageRouter = require('express').Router() ;

messageRouter.post('/:id/add' , messagesController.add ) ;

module.exports= { messageRouter } ;