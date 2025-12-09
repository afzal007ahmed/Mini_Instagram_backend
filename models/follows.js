function followsModel( sequelize , DataTypes ) {
    const follows = sequelize.define("follows", {
        user_id : {
            type : DataTypes.UUID ,
            references : {
                model : 'users' ,
                key : 'id' 
            }
        },
        follow_id : {
            type : DataTypes.UUID ,
            references : {
                model : 'users' ,
                key : 'id' 
            }
        },
        status : {
            type : DataTypes.BOOLEAN , 
            defaultValue : false 
        }
    },
   {
    tableName : 'Follows'
   }
)

return follows ; 
}


module.exports = { followsModel } 