function CalendarRefresher(locator, methodName) {
    this.locator = locator || '#datepicker';
    this.methodName = methodName || 'refresh';
}

CalendarRefresher.prototype.refresh = function () {
    $(this.locator).datepicker(this.methodName);
};

var cr = new CalendarRefresher();
module.exports = cr;

