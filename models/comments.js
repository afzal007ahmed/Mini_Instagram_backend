function commentsModel(sequelize, DataTypes) {
  const comments = sequelize.define("comments", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue : DataTypes.UUIDV4
    },
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: false,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    post_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "posts",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    content : {
        type : DataTypes.STRING ,
        allowNull: false 
    },
    parent_id : {
        type : DataTypes.UUID , 
        references : {
            model : 'comments' ,
            key : "id" 
        },
        onDelete : "CASCADE" ,
        onUpdate : "CASCADE" 
    }
  },
{
    tableName : "comments" 
}
);

return comments ;
}

module.exports = { commentsModel } ;