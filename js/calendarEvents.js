var CalendarEvent = require('./calendarEvent');

function CalendarEvents() {
    this.events = [];
    this.persistanceUnit = require('./persistence');
}
CalendarEvents.prototype.addEvent = function (e) {
    var id = e.getId();
    var numberOfEventsWithId = this.events.filter(function (val) {
        return val.id === id;
    }).length;
    var wasAdded = false;
    if (numberOfEventsWithId === 0) {
        this.events.push(e);
        wasAdded = true;
    }
    if (wasAdded) {
        this.save();
    }
    return wasAdded;
};
CalendarEvents.prototype.updateEventWithId = function (id, newProps) {
    var wasUpdated = false;
    this.events.forEach(function (val) {
        if (val.id === id) {
            val.color = newProps.color || val.color;
            val.name = newProps.name || val.name;
            wasUpdated = true;
        }
    });
    if (wasUpdated) {
        this.save();
    }
};
CalendarEvents.prototype.removeEvent = function (e) {
    var id = e.id || e;
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
CalendarEvents.prototype.getIDs = function () {
    return this.events.map(function (val) {
        return val.id;
    });
};
CalendarEvents.prototype.getEventWithId = function (id) {
    return this.events.filter(function (val) {
        return val.id === id;
    })[0];
};
CalendarEvents.prototype.getEvents = function () {
    return this.events.slice();// return duplicate
};
CalendarEvents.prototype.init = function () {
    var eventsAsJSON = this.persistanceUnit.load('events');
    if (!!eventsAsJSON) {
        var eventsO = JSON.parse(eventsAsJSON);
        for (var e in eventsO) {
            if (eventsO.hasOwnProperty(e)) {
                var event = eventsO[e];
                this.addEvent(new CalendarEvent(event.id, event.name, event.color));
            }
        }
    }
};
CalendarEvents.prototype.save = function () {
    this.persistanceUnit.save('events', this.events);
};
var ce = new CalendarEvents();
ce.init();
module.exports = ce;

