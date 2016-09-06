function CalendarRefresher() {}

CalendarRefresher.prototype.refresh = function () {
    $("#datepicker").datepicker("refresh");
};

var cr = new CalendarRefresher();
module.exports = cr;

