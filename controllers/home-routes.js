//this will contain all the user-facing routes (homepage, login page)
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

const router = require('express').Router();

router.get('/', (req, res) => {
    Post.findAll({
      attributes: [
        'id',
        'post_url',
        'title',
        'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
      ],
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
      .then(dbPostData => {
        // check out a single post
        console.log(dbPostData[0]);
        //this will loop over and map each sequelize obj into the nice version and make a new posts aray
        const posts = dbPostData.map(post => post.get({plain: true}));
        //render writes it into main.handlebars, this writes homepage using that post data
        res.render('homepage', {posts}); //put that array u made in
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

module.exports = router;