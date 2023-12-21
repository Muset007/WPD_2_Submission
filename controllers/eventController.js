// controllers/EventController.js
const EventModel = require('../models/eventModel');

class EventController {
    constructor(eventsDb, usersDb) {
        this.model = new EventModel(eventsDb);
        this.usersDb = usersDb;
    }

    displayEvents(req, res) {
        this.model.findAll((err, events) => {
            if (err) return res.status(500).send('Database error');
            const showAddEventForm = req.userDetails && req.userDetails.role === 'organizer';
            res.render('events', {
                events: events,
                showForm: showAddEventForm,
                eventToEdit: null,
                userType: req.userDetails ? req.userDetails.role : null,
                userId: req.userDetails ? req.userDetails._id : null
            });
        });
    }

    addEvent(req, res) {
        const newEvent = {
            title: req.body.title,
            description: req.body.description,
            date: new Date(req.body.date),
            time: req.body.time, // Added time field
            place: req.body.place, // Added place field
            category: req.body.category,
            organizer: req.session.user._id
        };
        this.model.add(newEvent, (err) => {
            if (err) return res.status(500).send('Error adding event');
            res.redirect('/events');
        });
    }    
        displayEditForm(req, res) {
            const eventId = req.params.id;
            const userId = req.userDetails ? req.userDetails._id : null;
        
            this.model.findOne(eventId, (err, event) => {
                if (err) return res.status(500).send('Database error');
                if (!event) return res.status(404).send('Event not found');
        
                if (
                    (event.organizer.toString() === userId.toString()) ||
                    (req.userDetails && req.userDetails.role === 'manager')
                ) {
                    res.render('events', {
                        events: [],
                        showForm: true,
                        eventToEdit: event,
                        userType: req.userDetails ? req.userDetails.role : null,
                        userId: req.userDetails ? req.userDetails._id : null
                    });
                } else {
                    // Redirect to dashboard with an error message
                    res.redirect('/dashboard?error=unauthorized');
                }
            });
        }       
    updateEvent(req, res) {
        const eventId = req.params.id;
        const isManager = req.userDetails && req.userDetails.role === 'manager';
        let query = isManager ? {} : { organizer: req.session.user._id };
        const updatedEvent = {
            title: req.body.title,
            description: req.body.description,
            date: new Date(req.body.date),
            category: req.body.category
        };
        this.model.update(eventId, updatedEvent, query, (err, numReplaced) => {
            if (err) return res.status(500).send('Error updating event');
            if (numReplaced === 0) return res.status(404).send('No such event found or you do not have permission to update it');
            res.redirect('/events');
        });
    }
    deleteEvent(req, res) {
        const eventId = req.params.id;
        const isManager = req.userDetails && req.userDetails.role === 'manager';
        let query = isManager ? {} : { organizer: req.session.user._id };
    
        this.model.delete(eventId, query, (err, numRemoved) => {
            if (err) {
                // Sending a server error message
                return res.status(500).send('Error deleting event');
            }
            if (numRemoved === 0) {
                // Sending a client error message when the event can't be found or the user lacks permission
                return res.status(404).send('No such event found or you do not have permission to delete it');
            }
    
            // Sending a success response
            res.status(200).send('Event successfully deleted');
        });
    }    
}

module.exports = EventController;
