function Storage(value) {
    this.value = value || '';
}
Storage.prototype.getValue = function () {
    return this.value;
};
Storage.prototype.setValue = function (value) {
    this.value = value;
};
module.exports = Storage;

