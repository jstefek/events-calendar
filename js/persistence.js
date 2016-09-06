function PersistanceUsingLocalStorage() {}
PersistanceUsingLocalStorage.prototype.load = function (key) {
    console.log('PersistanceUsingLocalStorage load', key);
    return localStorage.getItem(key);
};
PersistanceUsingLocalStorage.prototype.save = function (key, value) {
    console.log('PersistanceUsingLocalStorage save', key, value);
    localStorage.setItem(key, JSON.stringify(value));
};

var p = new PersistanceUsingLocalStorage();
module.exports = p;