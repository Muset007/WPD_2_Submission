const bcrypt = require('bcryptjs');
const EventsModel = require('../models/eventModel')
class IndexController {
    constructor(usersDb, eventsDb) {
        this.usersDb = usersDb;
        this.eventsDb = eventsDb;
    }

    homePage(req, res) {
        this.eventsDb.find({}).sort({ date: 1 }).exec((err, events) => {
            if (err) {
                res.status(500).send('Database error');
                return;
            }
            res.render('about', { events: events, user: req.session.user });
        });
    }

    aboutPage(req, res) {
        this.homePage(req, res);
    }

    registerPage(req, res) {
        res.render('register');
    }

    register(req, res) {
        const { name, username, email, password, role } = req.body;
        if (!name || !email.includes('@') || password.length < 6) {
            return res.status(400).send('Validation error');
        }

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                res.status(500).send('Error encrypting password');
                return;
            }
            // Include name when inserting the new user
            this.usersDb.insert({ name, username, email, password: hash, role }, (err, newUser) => {
                if (err) {
                    res.status(500).send('Error registering new user');
                    return;
                }
                // Redirect to login page, or send a success message
                res.redirect('/login'); // Or any other success operation
            });
        });
    }

    loginPage(req, res) {
        res.render('login');
    }

    login(req, res) {
        const { username, password } = req.body;
        this.usersDb.findOne({ username }, (err, user) => {
            if (err || !user) {
                // Render the login page with a 'User not found' error message
                res.render('login', { errorMessage: 'User not found' });
                return;
            }
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    req.session.user = user;
                    res.redirect('/dashboard');
                } else {
                    // Render the login page with a 'Password incorrect' error message
                    res.render('login', { errorMessage: 'Password incorrect' });
                }
            });
        });
    }    

    logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                res.status(500).send('Could not log out, please try again');
            } else {
                res.redirect('/');
            }
        });
    }
    dashboard(req, res) {
        if (!req.session.user) {
            res.redirect('/login');
        } else {
            // Fetch all events to display in the dashboard
            this.eventsDb.find({}).sort({ date: 1 }).exec((err, allEvents) => {
                if (err) {
                    res.status(500).send('Database error');
                    return;
                }
                // Fetch user-specific events to display in the dashboard
                this.eventsDb.find({ organizer: req.session.user._id }).sort({ date: 1 }).exec((err, userEvents) => {
                    if (err) {
                        res.status(500).send('Database error');
                        return;
                    }
                    // Determine the user's role
                    const userRole = req.session.user.role || 'Unknown';
    
                    // Render the dashboard with both all events and user-specific events, and user role
                    res.render('dashboard', {
                        user: req.session.user,
                        allEvents: allEvents,
                        userEvents: userEvents,
                        userRole: userRole
                    });
                });
            });
        }
    }    
    renderAddEventForm(req, res) {
        if (!req.session.user) {
            res.redirect('/login');
        } else {
            res.render('events', {
                user: req.session.user,
                showForm: true
            });
        }
    }

    addEvent(req, res) {
        if (!req.session.user) {
            res.redirect('/login');
        } else {
            const { title, description, date, time, place, category } = req.body; // Include time and place
            const newEvent = {
                title,
                description,
                date,
                time,   // Add time to the event object
                place,  // Add place to the event object
                category,
                organizer: req.session.user._id
            };
            this.eventsDb.insert(newEvent, (err, event) => {
                if (err) {
                    res.status(500).send('Error creating new event');
                    return;
                }
                res.redirect('/dashboard');
            });
        }
    }
    

    updateEvent(req, res) {
        if (!req.session.user) {
            res.status(403).send('You must be logged in to update an event');
            return;
        }
    
        const eventId = req.params.id;
        const { title, description, date, time, place, category } = req.body; // Include time and place
        const updatedEvent = {
            title,
            description,
            date: new Date(date),
            time,   // Add time to the updated event object
            place,  // Add place to the updated event object
            category
        };
    
        let query = { _id: eventId };
        if (req.session.user.role !== 'manager') {
            query.organizer = req.session.user._id;
        }
    
        this.eventsDb.update(query, { $set: updatedEvent }, {}, (err, numReplaced) => {
            if (err) {
                res.status(500).send('Error updating event');
                return;
            }
            if (numReplaced === 0) {
                res.status(404).send('No event found with that ID or you do not have permission to update it');
                return;
            }
            res.redirect('/dashboard');
        });
    }
    }
module.exports = IndexController;
