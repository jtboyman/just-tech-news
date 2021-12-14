const { Model, DataTypes } = require('sequelize'); //from sequelize package
const sequelize = require('../config/connection'); //MySQL connection

//create Post model
class Post extends Model {}

//create fields/columns for Post model
Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        post_url: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isURL: true //pretty cool validator for url
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: { //this is how we show who posted it
                model: 'user', //the other model we reference
                key: 'id' //the primary key from the other model
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'post'
    }
);

module.exports = Post;