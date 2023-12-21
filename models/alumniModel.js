// models/AlumniModel.js
class AlumniModel {
    constructor(db) {
        this.db = db;
    }

    findAll(callback) {
        this.db.find({ role: 'alumni' }, callback);
    }

    add(newAlumnus, callback) {
        this.db.insert(newAlumnus, callback);
    }

    update(alumnusId, updatedAlumnus, callback) {
        this.db.update({ _id: alumnusId, role: 'alumni' }, { $set: updatedAlumnus }, {}, callback);
    }

    delete(alumnusId, callback) {
        this.db.remove({ _id: alumnusId, role: 'alumni' }, {}, callback);
    }
}

module.exports = AlumniModel;
