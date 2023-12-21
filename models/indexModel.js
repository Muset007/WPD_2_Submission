// models/IndexModel.js
class IndexModel {
    constructor(usersDb, eventsDb) {
        this.usersDb = usersDb;
        this.eventsDb = eventsDb;
    }

    // User operations
    insertUser(user, callback) {
        this.usersDb.insert(user, callback);
    }

    findUser(query, callback) {
        this.usersDb.findOne(query, callback);
    }

    // Event operations
    findEvents(query, sort, callback) {
        this.eventsDb.find(query).sort(sort).exec(callback);
    }

    insertEvent(event, callback) {
        this.eventsDb.insert(event, callback);
    }

    updateEvent(query, updatedEvent, callback) {
        this.eventsDb.update(query, { $set: updatedEvent }, {}, callback);
    }
}

module.exports = IndexModel;
