/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

function IdsPool() {
    this.ids = [];
    this.persistanceUnit = __webpack_require__(1);
    this.idGenerator = __webpack_require__(4);
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

/***/ }),
/* 1 */
/***/ (function(module, exports) {

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

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

//storage for dates
function DatesModel() {
    this.dates = {};
    this.persistanceUnit = __webpack_require__(1);
    this.idsPool = __webpack_require__(0);
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


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var idsPool = __webpack_require__(0);
var eventsModel = __webpack_require__(5);
var datesModel = __webpack_require__(2);

function getDate(d) {
    var month = d.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }

    var day = d.getDate();
    if (day < 10) {
        day = "0" + day;
    }
    return day + "." + month + "." + d.getFullYear();
}

$(function () {
    $("#datepicker").datepicker({
        inline: true,
        onSelect: function (date) {
            datesModel.addOrUpdateDate(date);
        },
        beforeShowDay: function (date) {
            var eventId = datesModel.getEventIdForDate(getDate(date));
//                        console.log('date ' + date + ', id ' + eventId);
            if (!!eventId) {
                return [true, "event-color-" + eventId, eventsModel.getName(eventId)];
            }
            return [true, "ui-state-default", ""];
        },
        afterShow: function () {
            var ids = idsPool.getIds();
            for (var i = 0; i < ids.length; i++) {
                var id = ids[i];
                $('.event-color-' + id).each(function () {
                    var t = $(this);
                    t.css('background', eventsModel.getColor(id));
                    t.find('> a').css('background', eventsModel.getColor(id));
                });
            }
            $('.ui-state-active').attr('class', '');
        }
    });

    var $addNewEventLink = $("a#addNewEventLink");
    $addNewEventLink.on("click", function () {
        eventsModel.addNewEvent();
    });
});


/***/ }),
/* 4 */
/***/ (function(module, exports) {

function IDGenerator() {}
;
IDGenerator.prototype.generateID = function () {
    return new Date().getTime();
};
var g = new IDGenerator();
module.exports = g;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var CalendarEvent = __webpack_require__(6);


function removeSelected() {
    var els = document.getElementsByClassName('radioSelected');
    for (var el in els) {
        if (!!els[el] && !!els[el].classList) {
            els[el].classList.remove('radioSelected');
        }
    }
}
function select(el) {
    removeSelected();
    el.setAttribute('class', 'radioSelected');
}

function initColorOptions() {
    var dl = document.createElement('datalist');
    dl.id = 'colorsOptions';
    var colorList = [
        "#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc", "#ea9999", "#f9cb9c", "#ffe599",
        "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6"];

    for (var c in colorList) {
        var option = document.createElement('option');
        option.value = colorList[c];
        dl.appendChild(option);
    }
    document.body.appendChild(dl);
}

function EventsModel() {
    this.defaultColor = '#00f';
    this.defaultName = '';
    this.events = {};
    this.persistanceUnit = __webpack_require__(1);
    this.datesModel = __webpack_require__(2);
    this.calendarRefresher = __webpack_require__(7);
    this.idsPool = __webpack_require__(0);
}

EventsModel.prototype.addEvent = function (id) {
    if (!this.events[id]) {
        this.events[id] = new CalendarEvent(id, this.defaultName, this.defaultColor);
        this.save();
    }
};
EventsModel.prototype.save = function () {
    this.persistanceUnit.save('events', this.events);
};
EventsModel.prototype.addEventEditElements = function (eventId, color, name) {
    var newLi = document.createElement("li");
    newLi.setAttribute('data-index', eventId);

    if (!document.getElementById('colorsOptions')) {
        initColorOptions();
    }

    var nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.placeholder = 'insert event name';
    nameInput.value = name;
    var ce = this.events[eventId];

    nameInput.onchange = function () {
        ce.setName(nameInput.value);
        this.calendarRefresher.refresh();
        this.save();
    }.bind(this);

    var colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = color;
    colorInput.setAttribute('list', 'colorsOptions');
    colorInput.addEventListener('input', function (e) {
        ce.setColor(event.target.value);
        this.calendarRefresher.refresh();
        this.save();
    }.bind(this));

    var deleteLink = document.createElement("a");
    deleteLink.className = "ui-icon ui-icon-circle-minus";
    deleteLink.href = "#";
    deleteLink.addEventListener('click', function () {
        if (confirm("Opravdu chces odstranit tuto udalost?")) {
            this.datesModel.removeAllDatesWithEventId(eventId);
            this.removeEvent(eventId);
            this.calendarRefresher.refresh();
        } else {
        }
    }.bind(this));

    var radioButton = document.createElement('input');
    radioButton.type = 'radio';
    radioButton.checked = 'true';
    radioButton.name = 'selected';
    radioButton.value = eventId;
    radioButton.addEventListener('click', function (event) {
        select(event.target.parentNode);
    });
    var div = document.createElement('div');
    select(div);

    div.appendChild(radioButton);
    div.appendChild(nameInput);
    div.appendChild(colorInput);
    div.appendChild(deleteLink);

    newLi.appendChild(div);

    document.querySelector("ul#eventsList").appendChild(newLi);
};

EventsModel.prototype.addNewEvent = function () {
    var id = this.idsPool.getNextId();
    this.addEvent(id);
    this.addEventEditElements(id, this.defaultColor, this.defaultName);
};

EventsModel.prototype.removeEvent = function (id) {
    // remove from pool
    this.idsPool.removeId(id);
    // delete from object
    if (!!this.events[id]) {
        delete this.events[id];
        this.save();
        // remove elements
        var element = document.querySelector("li[data-index='" + id + "']");
        var wasSelected = (element.children[0].getAttribute('class') || '').indexOf('radioSelected') !== -1;
        element.parentNode.removeChild(element);
        if (wasSelected) {
            selectFirstAvailableEventElement();
        }
    }

    function selectFirstAvailableEventElement() {
        var rbs = document.querySelectorAll('#eventsList  input[type=radio]');
        if (rbs.length > 0) {
            rbs[0].click();
        }
    }
};
EventsModel.prototype.getColor = function (id) {
    if (this.events[id]) {
        return this.events[id].getColor();
    }
};
EventsModel.prototype.getName = function (id) {
    if (this.events[id]) {
        return this.events[id].getName();
    }
};
EventsModel.prototype.init = function () {
    $(function () {
        var eventsAsJSON = this.persistanceUnit.load('events');
        if (!!eventsAsJSON) {
            var eventsO = JSON.parse(eventsAsJSON);
            for (var id in eventsO) {
                if (eventsO.hasOwnProperty(id)) {
                    var ev = eventsO[id];
                    this.events[id] = new CalendarEvent(id, ev.name, ev.color); // convert object to CalendarEvent
                    var correctEvent = this.events[id];
                    this.addEventEditElements(id, correctEvent.getColor(), correctEvent.getName());
                }
            }
        }
    }.bind(this));
};
var m = new EventsModel();
m.init();
module.exports = m;




/***/ }),
/* 6 */
/***/ (function(module, exports) {

function CalendarEvent(id, name, color) {
    this.id = id;
    this.color = color || '';
    this.name = name || '';
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

module.exports=CalendarEvent;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

function CalendarRefresher() {}

CalendarRefresher.prototype.refresh = function () {
    $("#datepicker").datepicker("refresh");
};

var cr = new CalendarRefresher();
module.exports = cr;



/***/ })
/******/ ]);