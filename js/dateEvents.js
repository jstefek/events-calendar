var DateEvent = require('./dateEvent');

function DateEvents() {
    this.events = [];
    this.persistanceUnit = require('./persistence');
}

DateEvents.prototype.addOrSwitchOrReplaceEvent = function (e, omitSave) {
    var date = e.date;
    var id = e.id;
    var someDeleted = false;
    var hadSameId = false;
    // switch / remove event
    this.events = this.events.filter(function (val) {
        var found = val.date === date;
        if (found) {
            someDeleted = true;
            hadSameId = val.id === id;
        }
        return !found;
    });
    if (!someDeleted || !hadSameId) {
        // add / replace
        this.events.push(e);
    }
    if (!omitSave) {
        this.save();
    }
};
DateEvents.prototype.removeEventsWithId = function (id) {
    var wasDeleted = false;
    this.events = this.events.filter(function (val) {
        var found = val.id === id;
        if (found) {
            wasDeleted = true;
        }
        return !found;
    });
    if (wasDeleted) {
        this.save();
    }
    return wasDeleted;
};
DateEvents.prototype.getEventWithDate = function (date) {
    return this.events.filter(function (val) {
        return val.date === date;
    })[0];
};
DateEvents.prototype.init = function () {
    var eventsAsJSON = this.persistanceUnit.load('dates');
    if (!!eventsAsJSON) {
        var eventsO = JSON.parse(eventsAsJSON);
        for (var e in eventsO) {
            if (eventsO.hasOwnProperty(e)) {
                var event = eventsO[e];
                this.addOrSwitchOrReplaceEvent(new DateEvent(event.id, event.date), true);
            }
        }
    }
};
DateEvents.prototype.save = function () {
    this.persistanceUnit.save('dates', this.events);
};
var de = new DateEvents();
de.init();
module.exports = de;

