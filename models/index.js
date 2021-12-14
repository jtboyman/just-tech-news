const User = require('./User');
const Post = require('./Post');

//create associations
User.hasMany(Post, {
    foreignKey: 'user_id' //links the referenced id column from User to user_id in Post
});

Post.belongsTo(User, { //must make the reverse association too
    foreignKey: 'user_id' //links, and makes sure each post can have only one user associated
})

module.exports = {User, Post};

//holds all the models