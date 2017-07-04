var CalendarEvent = require('./calendarEvent');
var persistanceUnit = require('./persistence');

function save(events) {
    persistanceUnit.save('events', events);
}

function init(calendarEvents) {
    var eventsAsJSON = persistanceUnit.load('events');
    if (!!eventsAsJSON) {
        var eventsO = JSON.parse(eventsAsJSON);
        for (var e in eventsO) {
            if (eventsO.hasOwnProperty(e)) {
                var event = eventsO[e];
                calendarEvents.addEvent(new CalendarEvent(event.id, event.name, event.color));
            }
        }
    }
}

function CalendarEvents() {
    this.events = [];
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
        save(this.events);
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
        save(this.events);
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
        save(this.events);
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

var ce = new CalendarEvents();
init(ce);

module.exports = ce;

