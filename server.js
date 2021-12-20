const express = require('express');
const routes = require('./controllers/');
const sequelize = require('./config/connection'); //import connection to Sequelize
const path = require('path');

const exphbs = require('express-handlebars');
const hbs = exphbs.create({});

const app = express();
const PORT = process.env.PORT || 3001;

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public'))); //for the css in public directory
/*The express.static() method is a built-in Express.js middleware function that
 can take all of the contents of a folder and serve them as static assets.
 This is useful for front-end specific files like images, style sheets, and
 JavaScript files.*/



//turn on routes
app.use(routes);

//turn on connection to db and server
//sync means take models and connect to associated db tables
//will create a table for you if it doesnt find one
sequelize.sync({ force: false }).then(() => { //true is basically DROP TABLE IF EXISTS
    app.listen(PORT, () => console.log('Now listening'));
});

//the router instance from routes/index.js collected and packaged all the routes