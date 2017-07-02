function DateEvent(id, date) {
    this.id = id;
    this.date = date || '';
}

DateEvent.prototype.getDate = function () {
    return this.date;
};
DateEvent.prototype.setDate = function (d) {
    this.date = d;
};
DateEvent.prototype.getId = function () {
    return this.id;
};
DateEvent.prototype.setId = function (i) {
    this.id = i;
};

module.exports = DateEvent;