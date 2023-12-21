// routes/alumniRoutes.js
const express = require('express');
const router = express.Router();

module.exports = function (alumniController, isAlumniManager) {
    // Get all alumni
    router.get('/', isAlumniManager, (req, res) => alumniController.getAllAlumni(req, res));

    // Add a new alumnus
    router.post('/add', isAlumniManager, (req, res) => alumniController.addAlumnus(req, res));

    // Update an alumnus
    router.post('/update/:id', isAlumniManager, (req, res) => alumniController.updateAlumnus(req, res));

    // Delete an alumnus
    router.post('/delete/:id', isAlumniManager, (req, res) => alumniController.deleteAlumnus(req, res));

    return router;
};
