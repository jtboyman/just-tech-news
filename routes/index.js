//collecting packaged group of api end points and prefixing them with path /api

const router = require('express').Router();

const apiRoutes = require('./api');

router.use('/api', apiRoutes);

router.use((req, res) => { //error for when request a nonexistent endpoint
    res.status(404).end();
});

module.exports = router;