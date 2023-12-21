// routes/eventRoutes.js
const express = require('express');
const router = express.Router();

module.exports = function(eventController, isAuthenticated, addUserDetails) {
    router.use(addUserDetails);

    // Route to display all events and the add event form if the user is logged in
    router.get('/', isAuthenticated, (req, res) => eventController.displayEvents(req, res));
    
    // Route to display the form to add a new event (for logged-in users)
    router.get('/new', isAuthenticated, (req, res) => {
        // Assuming the logic to show the form is similar to displayEvents
        eventController.displayEvents(req, res);
    });

    // Route to add a new event (for logged-in users)
    router.post('/', isAuthenticated, (req, res) => eventController.addEvent(req, res));

    // Route to display the form to edit an event
    router.get('/edit/:id', isAuthenticated, (req, res) => eventController.displayEditForm(req, res));

    // Route to update an event (for the organizer or a manager)
    router.post('/update/:id', isAuthenticated, (req, res) => eventController.updateEvent(req, res));

    // Route to delete an event (for the organizer or a manager)
    router.post('/delete/:id', isAuthenticated, (req, res) => eventController.deleteEvent(req, res));

    return router;
};
