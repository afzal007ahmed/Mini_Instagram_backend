function reactionModel(sequelize, DataTypes) {
  const reaction = sequelize.define(
    "reaction",
    {
      post_id: {
        type: DataTypes.UUID,
        references: {
          model: "posts",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      user_id: {
        type: DataTypes.UUID,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      like: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      dislike: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "reaction",
    }
  );

  return reaction;
}

module.exports = { reactionModel };
