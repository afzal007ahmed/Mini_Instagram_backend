const messagesModel = (sequelize, DataTypes) => {
  const messages = sequelize.define(
    "messages",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      from_id: {
        type: DataTypes.UUID,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      to_id: {
        type: DataTypes.UUID,
        references: {
          modle: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "messages",
    }
  );
  return messages;
};

module.exports = { messagesModel };
