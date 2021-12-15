const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection'); //import connection to Sequelize

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//turn on routes
app.use(routes);

//turn on connection to db and server
//sync means take models and connect to associated db tables
//will create a table for you if it doesnt find one
sequelize.sync({ force: false }).then(() => { //true is basically DROP TABLE IF EXISTS
    app.listen(PORT, () => console.log('Now listening'));
});

//the router instance from routes/index.js collected and packaged all the routes