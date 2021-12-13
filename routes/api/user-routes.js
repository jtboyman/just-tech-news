const router = require('express').Router();
const { User } = require('../../models');

// GET /api/users (will select all users from user table in database and send
//it back as json)
router.get('/', (req, res) => {
    //Access our User model and run .findAll() method
    User.findAll({ //same as SELECT * FROM users;
        attributes: {exclude: ['password']} //protect passwords
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// GET /api/users/1
router.get('/:id', (req, res) =>{
    User.findOne({
        attributes: {exclude: ['password']}, //protect passwords
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({message: 'No user found witht his id!'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST /api/users
router.post('/', (req, res) => {
    // expects {username: 'username', email: 'email@email.com', password: 'password1234'}
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// PUT /api/users/1 (uses req.body req.params)
router.put('/:id', (req, res) => {
    // expects {username: 'username', email: 'email@email.com', password: 'password1234'}

    //if req.body has exact key/value pairs to match the model, you can just
    //use req.body instead
    User.update(req.body, { //req.body is new data to use in update
        individualHooks: true, //needed according to docs
        where: {
            id: req.params.id //this is where we put new data
        }
    })
    .then(dbUserData => {
        if (!dbUserData[0]) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// DELETE /api/users/1
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({message: 'No user found with this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;