const { messagesController } = require('../controllers/messages');

const messageRouter = require('express').Router() ;

messageRouter.post('/:id/add' , messagesController.add ) ;
messageRouter.get('/:id/all' , messagesController.getAll ) ;

module.exports= { messageRouter } ;