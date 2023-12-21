// controllers/AlumniController.js
const bcrypt = require('bcryptjs');
const AlumniModel = require('../models/alumniModel');

class AlumniController {
    constructor(db) {
        this.model = new AlumniModel(db);
    }

    getAllAlumni(req, res) {
        this.model.findAll((err, alumni) => {
            if (err) return res.status(500).send('Database error');
            res.render('alumni', { alumni: alumni });
        });
    }

    addAlumnus(req, res) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) return res.status(500).send('Error encrypting password');
            const newAlumnus = {
                role: 'alumni',
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
                password: hash,
            };

            this.model.add(newAlumnus, (err) => {
                if (err) return res.status(500).send('Error adding alumnus');
                res.redirect('/alumni');
            });
        });
    }

    updateAlumnus(req, res) {
        const alumnusId = req.params.id;
        let updatedAlumnus = {
            username: req.body.username,
            name: req.body.name,
            email: req.body.email,
        };

        if (req.body.password) {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) return res.status(500).send('Error hashing new password');
                updatedAlumnus.password = hash;
                this.model.update(alumnusId, updatedAlumnus, (err) => {
                    if (err) return res.status(500).send('Error updating alumnus information');
                    res.redirect('/alumni');
                });
            });
        } else {
            this.model.update(alumnusId, updatedAlumnus, (err) => {
                if (err) return res.status(500).send('Error updating alumnus information');
                res.redirect('/alumni');
            });
        }
    }

    deleteAlumnus(req, res) {
        const alumnusId = req.params.id;
        this.model.delete(alumnusId, (err) => {
            if (err) return res.status(500).send('Error deleting alumnus');
            res.redirect('/alumni');
        });
    }
}

module.exports = AlumniController;
