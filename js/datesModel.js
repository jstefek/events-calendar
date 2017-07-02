var DateEvent = require('./dateEvent');

function DatesModel() {
    this.persistanceUnit = require('./persistence');
    this.dateEvents = require('./dateEvents');
    this.eventStorage = require('./eventStorage');
}
DatesModel.prototype.removeAllDatesWithEventId = function (id) {
    this.dateEvents.removeEventsWithId(id);
};
DatesModel.prototype.getEventIdForDate = function (date) {
    var e = this.dateEvents.getEventWithDate(date);
    return e && e.id ? e.id : '';
};
DatesModel.prototype.addOrUpdateDate = function (date) {
    var id = this.eventStorage.getValue();
    if (!!id) {
        this.dateEvents.addOrSwitchOrReplaceEvent(new DateEvent(id, date));
    }
};

var dm = new DatesModel();
module.exports = dm;
