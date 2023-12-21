// models/EventModel.js
class EventModel {
    constructor(db) {
        this.db = db;
    }

    findAll(callback) {
        this.db.find({}, callback);
    }

    findOne(eventId, callback) {
        this.db.findOne({ _id: eventId }, callback);
    }

    add(newEvent, callback) {
        this.db.insert(newEvent, callback);
    }

    update(eventId, updatedEvent, query, callback) {
        this.db.update({ _id: eventId, ...query }, { $set: updatedEvent }, {}, callback);
    }

    delete(eventId, query, callback) {
        this.db.remove({ _id: eventId, ...query }, {}, callback);
    }
}

module.exports = EventModel;
