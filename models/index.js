const { DataTypes } = require('sequelize') ;
const { sequelize } = require('../config/db.config');
const { usersModel } = require('./users');
const { postsModel } = require('./posts');
const { commentsModel } = require('./comments');
const { reactionModel } = require('./reaction');
const { followsModel } = require('./follows');

const users = usersModel( sequelize , DataTypes ) ;
const posts = postsModel( sequelize , DataTypes ) ;
const comments = commentsModel( sequelize , DataTypes ) ;
const reaction = reactionModel( sequelize , DataTypes ) ;
const follows = followsModel( sequelize , DataTypes ) ;


users.hasMany( posts , { foreignKey : 'user_id'}) ;
posts.belongsTo( users , { foreignKey : 'user_id'}) ;
comments.belongsTo( users , { foreignKey : 'user_id'}) ;
users.hasMany( comments , { foreignKey : 'user_id' }) ;
comments.belongsTo( posts , { foreignKey : 'post_id'}) ;
posts.hasMany( comments , { foreignKey : 'post_id' } ) ;
comments.hasMany( comments , { foreignKey : 'parent_id'} ) ;
comments.belongsTo( comments , { foreignKey : 'parent_id'}) ;
follows.belongsTo( users , { foreignKey : 'user_id' , as : "follower"}) ;
follows.belongsTo( users , { foreignKey : 'follow_id' , as : "following" }) ;
users.hasMany( follows , {foreignKey : 'user_id' , as : "FollowersList"}) ;
users.hasMany( follows , { foreignKey : 'follow_id' , as : "FollowingList"}) ;
reaction.belongsTo( posts , { foreignKey : 'post_id'}) ;
posts.hasOne( reaction , { foreignKey : 'post_id'}) ;
 

module.exports = {
    users , 
    posts ,
    comments ,
    reaction ,
    follows
}