// routes/indexRoutes.js
const express = require('express');
const router = express.Router();

module.exports = function(indexController) {
    // Home page route
    router.get('/', (req, res) => indexController.homePage(req, res));

    // About page route
    router.get('/about', (req, res) => indexController.aboutPage(req, res));

    // Registration routes
    router.get('/register', (req, res) => indexController.registerPage(req, res));
    router.post('/register', (req, res) => indexController.register(req, res));

    // Login routes
    router.get('/login', (req, res) => indexController.loginPage(req, res));
    router.post('/login', (req, res) => indexController.login(req, res));

    // Logout route
    router.get('/logout', (req, res) => indexController.logout(req, res));

    // Dashboard route
    router.get('/dashboard', (req, res) => indexController.dashboard(req, res));

    // Event creation and update routes
    router.get('/events/new', (req, res) => indexController.renderAddEventForm(req, res));
    router.post('/events', (req, res) => indexController.addEvent(req, res));
    router.post('/events/update/:id', (req, res) => indexController.updateEvent(req, res));

    return router;
};
