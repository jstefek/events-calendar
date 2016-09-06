//storage for dates
function DatesModel() {
    this.dates = {};
    this.persistanceUnit = require('./persistence');
    this.idsPool = require('./idsPool');
}
DatesModel.prototype.removeAllDatesWithEventId = function (eventId) {
    var someDeleted = false;
    for (var d in this.dates) {
        if (!this.dates.hasOwnProperty(d)) {
            continue;
        }
        if (this.dates[d] == eventId) {
            delete this.dates[d];
            someDeleted = true;
        }
    }
    if (someDeleted) {
        this.save();
    }
};
DatesModel.prototype.getEventIdForDate = function (date) {
    return this.dates[date];
};
DatesModel.prototype.init = function () {
    var datesAsJSON = this.persistanceUnit.load('dates');
    if (!!datesAsJSON) {
        this.dates = JSON.parse(datesAsJSON);
    }
};
DatesModel.prototype.save = function () {
    this.persistanceUnit.save('dates', this.dates);
};
DatesModel.prototype.addOrUpdateDate = function (d) {
    var eventId = this.dates[d];
    var modified = false;
    
    if (eventId > 0) {// date is already saved
        var nextAvailableId = this.idsPool.getNextIdAfter(eventId);
        if (!!nextAvailableId) {
            this.dates[d] = nextAvailableId;
            modified = true;
        } else {// delete date, there is no more event indexes
            delete this.dates[d];
            modified = true;
        }
    } else {// try to add a new date
        var firstID = this.idsPool.getIds()[0];
        if (!!firstID) {// add only when there are some events
            this.dates[d] = firstID;
            modified = true;
        } else {// no events are specified, nothing to do
        }
    }
    if (modified) {
        this.save();
    }
};

var dm = new DatesModel();
dm.init();
module.exports = dm;
