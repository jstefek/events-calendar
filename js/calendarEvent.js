function CalendarEvent(id, name, color) {
    this.id = id;
    this.name = name || '';
    this.color = color || '';
}
CalendarEvent.prototype.getColor = function () {
    return this.color;
};
CalendarEvent.prototype.setColor = function (c) {
    this.color = c;
};
CalendarEvent.prototype.getName = function () {
    return this.name;
};
CalendarEvent.prototype.setName = function (n) {
    this.name = n;
};
CalendarEvent.prototype.getId = function () {
    return this.id;
};
CalendarEvent.prototype.setId = function (i) {
    this.id = i;
};

module.exports = CalendarEvent;