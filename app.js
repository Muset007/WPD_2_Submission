const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Initialize NeDB Datastores
const Datastore = require('nedb');
const dataDirectory = path.join(__dirname, 'data');

// Ensure the 'data' directory exists
if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory);
}

const eventsDb = new Datastore({ filename: path.join(dataDirectory, 'events.db'), autoload: true });
const usersDb = new Datastore({ filename: path.join(dataDirectory, 'users.db'), autoload: true });

// Import MVC components
const AlumniController = require('./controllers/alumniController');
const EventController = require('./controllers/eventController');
const IndexController = require('./controllers/indexController');

const alumniRoutes = require('./routes/alumniRoutes');
const eventRoutes = require('./routes/eventRoutes');
const indexRoutes = require('./routes/indexRoutes');

const app = express();

// Set the view engine to ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set up static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static('public'));

// Use body-parser to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Set up session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_default_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 }, // 1 hour
}));

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(403).send('You must be logged in to perform this action');
    }
}

// Middleware to add user details to the request
function addUserDetails(req, res, next) {
    if (req.session.user) {
        usersDb.findOne({ _id: req.session.user._id }, function(err, user) {
            if (err) {
                res.status(500).send('Database error');
                return;
            }
            req.userDetails = user; 
            next();
        });
    } else {
        next();
    }
}

// Middleware to check if the user is an alumni manager
function isAlumniManager(req, res, next) {
    if (req.session.user && req.session.user.role === 'manager') {
        next();
    } else {
        res.status(403).send('Access denied');
    }
}

// Initialize controllers
const alumniController = new AlumniController(usersDb);
const eventController = new EventController(eventsDb, usersDb);
const indexController = new IndexController(usersDb, eventsDb);

// Use routes with controllers
app.use('/', indexRoutes(indexController));
app.use('/alumni', alumniRoutes(alumniController, isAlumniManager));
app.use('/events', eventRoutes(eventController, isAuthenticated, addUserDetails));

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).send('Sorry, that page does not exist!');
});

// Error handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
