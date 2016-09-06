function IdsPool() {
    this.ids = [];
    this.persistanceUnit = require('./persistence');
    this.idGenerator = require('./idGenerator');
}
IdsPool.prototype.save = function () {
    this.persistanceUnit.save('ids', this.ids);
};
IdsPool.prototype.getNextId = function () {
    var id = this.idGenerator.generateID();
    this.ids.push(id);
    this.save();
    return id;
};
IdsPool.prototype.getNextIdAfter = function (id) {
    return this.ids[this.ids.indexOf(id) + 1];
};
IdsPool.prototype.removeId = function (id) {
    var index = -1;
    for (var i in this.ids) {
        if (this.ids.hasOwnProperty(i)) {
            if (this.ids[i] == id) {
                index = i;
                break;
            }
        }
    }
    if (index >= 0) {// the id exists
        this.ids.splice(index, 1); // remove the id
        this.save();
    } else {// nothing to do
    }
};
IdsPool.prototype.init = function () {
    var idsAsJSON = this.persistanceUnit.load('ids');
    if (!!idsAsJSON) {
        this.ids = JSON.parse(idsAsJSON);
    }
};
IdsPool.prototype.getIds = function () {
    return this.ids;
};
var pool = new IdsPool();
pool.init();
module.exports= pool;