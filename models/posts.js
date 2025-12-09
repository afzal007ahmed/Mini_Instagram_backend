function postsModel(sequelize, DataTypes) {
  const posts = sequelize.define(
    "posts",
    {
      id: {
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.UUID,
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      description: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      user_id: {
        type : DataTypes.UUID , 
        references: {
          model: "users",
          key: "id",
        },
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      url: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      public_id : {
        type : DataTypes.STRING ,
        allowNull : true   
      }
    },
    {
      tableName: "posts",
    }
  );

  return posts;
}

module.exports = { postsModel } ;