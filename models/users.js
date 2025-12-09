function usersModel(sequelize, DataTypes) {
  const user = sequelize.define("users", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url : {
      type : DataTypes.STRING ,
      allowNull : true   
    },
    gender : {
      type : DataTypes.STRING ,
      allowNull : false 
    },
    public_id : {
      type : DataTypes.STRING ,
      allowNull : true 
    }
  },
  {
    tableName : "users" 
  }

);

  return user;
}


module.exports = { usersModel } ;