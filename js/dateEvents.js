var DateEvent = require('./dateEvent');
var persistanceUnit = require('./persistence');

function DateEvents() {
    this.events = [];
}

function save(events) {
    persistanceUnit.save('dates', events);
}

function init(dateEvents) {
    var eventsAsJSON = persistanceUnit.load('dates');
    if (!!eventsAsJSON) {
        var eventsO = JSON.parse(eventsAsJSON);
        for (var e in eventsO) {
            if (eventsO.hasOwnProperty(e)) {
                var event = eventsO[e];
                dateEvents.addOrSwitchOrReplaceEvent(new DateEvent(event.id, event.date), true);
            }
        }
    }
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
        save(this.events);
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
        save(this.events);
    }
    return wasDeleted;
};
DateEvents.prototype.getEventWithDate = function (date) {
    return this.events.filter(function (val) {
        return val.date === date;
    })[0];
};

var de = new DateEvents();
init(de);

module.exports = de;

