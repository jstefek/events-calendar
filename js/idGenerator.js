function IDGenerator() {}

IDGenerator.prototype.generateID = function () {
    return new Date().getTime();
};

var g = new IDGenerator();
module.exports = g;