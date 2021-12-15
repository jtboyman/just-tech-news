const sequelize = require('../../config/connection'); //to use a special thing
const router = require('express').Router();
//we get user and post both bc we need info about User as well
//with the foreign key, user_id, can form a JOIN
const { Post, User, Vote } = require('../../models');

// get all users' posts
router.get('/', (req, res) => {
    console.log('======================');
    Post.findAll({
        attributes: [//choose what we want
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ], 
        order: [['created_at', 'DESC']], //order by newest created
        include: [ //JOINing
            {
                model: User, //referring to User model
                attributes: ['username'] //from the User model
            }
        ]
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//get a single post
router.get('/:id', (req, res) => {
    Post.findOne({
        where: { //set the value of id using req.params.id
            id: req.params.id
        },
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            //use sequelize.literal to get the total upvotes count
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//create a post
router.post('/', (req, res) => {
    //expects {title: 'Post Title', post_url: 'http url blah', user_id: 1(any integer)}
    Post.create({ //req.body is the request from the user and has these properties
        //req.body populates the post table
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//PUT /api/posts/upvote (has to go before other put route or else express will think "update" is a valid param for /:id)
router.put('/upvote', (req, res) => {
    //custom static method created in model/Post.js
    Post.upvote(req.body, {Vote})
    .then(updatedPostData => res.json(updatedPostData))
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });

    /* THIS LOGIC WAS REFACTORED AND EXISTS IN POST.JS AS A MODEL METHOD Post.upvote
    Vote.create({ //to create vote need both user id and post id
        user_id: req.body.user_id,
        post_id: req.body.post_id
    }).then(() => {
        //then find the post we voted on
        return Post.findOne({
            where: {
                id: req.body.post_id
            },
            attributes: [
                'id',
                'post_url',
                'title',
                'created_at',
                //use raw MySQL aggreagate function query to get a count of how many votes the post has and return it under the name 'vote_count'
                [
                    sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
                    'vote_count'
                ]
            ]
        })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    });*/

});

//update a post title
router.put('/:id', (req, res) => {
    Post.update(
        {
            title: req.body.title
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//delete a post
router.delete('/:id', (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({message: 'No post found with this id'});
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;