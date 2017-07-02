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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

function PersistanceUsingLocalStorage() {}
PersistanceUsingLocalStorage.prototype.load = function (key) {
//    console.log('PersistanceUsingLocalStorage load', key);
    return localStorage.getItem(key);
};
PersistanceUsingLocalStorage.prototype.save = function (key, value) {
//    console.log('PersistanceUsingLocalStorage save', key, value);
    localStorage.setItem(key, JSON.stringify(value));
};

var p = new PersistanceUsingLocalStorage();
module.exports = p;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var CalendarEvent = __webpack_require__(2);

function CalendarEvents() {
    this.events = [];
    this.persistanceUnit = __webpack_require__(0);
}
CalendarEvents.prototype.addEvent = function (e) {
    var id = e.getId();
    var numberOfEventsWithId = this.events.filter(function (val) {
        return val.id === id;
    }).length;
    var wasAdded = false;
    if (numberOfEventsWithId === 0) {
        this.events.push(e);
        wasAdded = true;
    }
    if (wasAdded) {
        this.save();
    }
    return wasAdded;
};
CalendarEvents.prototype.updateEventWithId = function (id, newProps) {
    var wasUpdated = false;
    this.events.forEach(function (val) {
        if (val.id === id) {
            val.color = newProps.color || val.color;
            val.name = newProps.name || val.name;
            wasUpdated = true;
        }
    });
    if (wasUpdated) {
        this.save();
    }
};
CalendarEvents.prototype.removeEvent = function (e) {
    var id = e.id || e;
    var wasDeleted = false;
    this.events = this.events.filter(function (val) {
        var found = val.id === id;
        if (found) {
            wasDeleted = true;
        }
        return !found;
    });
    if (wasDeleted) {
        this.save();
    }
    return wasDeleted;
};
CalendarEvents.prototype.getIDs = function () {
    return this.events.map(function (val) {
        return val.id;
    });
};
CalendarEvents.prototype.getEventWithId = function (id) {
    return this.events.filter(function (val) {
        return val.id === id;
    })[0];
};
CalendarEvents.prototype.getEvents = function () {
    return this.events.slice();// return duplicate
};
CalendarEvents.prototype.init = function () {
    var eventsAsJSON = this.persistanceUnit.load('events');
    if (!!eventsAsJSON) {
        var eventsO = JSON.parse(eventsAsJSON);
        for (var e in eventsO) {
            if (eventsO.hasOwnProperty(e)) {
                var event = eventsO[e];
                this.addEvent(new CalendarEvent(event.id, event.name, event.color));
            }
        }
    }
};
CalendarEvents.prototype.save = function () {
    this.persistanceUnit.save('events', this.events);
};
var ce = new CalendarEvents();
ce.init();
module.exports = ce;



/***/ }),
/* 2 */
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

module.exports = CalendarEvent;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var DateEvent = __webpack_require__(4);

function DatesModel() {
    this.persistanceUnit = __webpack_require__(0);
    this.dateEvents = __webpack_require__(8);
    this.eventStorage = __webpack_require__(5);
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


/***/ }),
/* 4 */
/***/ (function(module, exports) {

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

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var Storage = __webpack_require__(9);
var s = new Storage();
module.exports = s;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var calendarEvents = __webpack_require__(1);
var eventsModel = __webpack_require__(7);
var datesModel = __webpack_require__(3);

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
            if (!!eventId) {
                return [true, "event-color-" + eventId, eventsModel.getName(eventId)];
            }
            return [true, "ui-state-default", ""];
        },
        afterShow: function () {
            calendarEvents.getEvents().forEach(function (event) {
                $('.event-color-' + event.id).each(function () {
                    var t = $(this);
                    t.css('background', event.color);
                    t.find('> a').css('background', event.color);
                });
            });
            $('.ui-state-active').attr('class', '');
        }
    });

    var $addNewEventLink = $("a#addNewEventLink");
    $addNewEventLink.on("click", function () {
        eventsModel.addNewEvent();
    });
});


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var CalendarEvent = __webpack_require__(2);

function removePreviouslySelected() {
    var els = document.getElementsByClassName('radioSelected');
    for (var el in els) {
        if (!!els[el] && !!els[el].classList) {
            els[el].classList.remove('radioSelected');
        }
    }
}
function markSelected(el) {
    removePreviouslySelected();
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
    this.persistanceUnit = __webpack_require__(0);
    this.datesModel = __webpack_require__(3);
    this.calendarRefresher = __webpack_require__(10);
    this.idGenerator = __webpack_require__(11);
    this.eventStorage = __webpack_require__(5);
    this.calendarEvents = __webpack_require__(1);
}

EventsModel.prototype.addEventEditElements = function (eventId, color, name) {
    var ce = new CalendarEvent(eventId, name, color);
    this.calendarEvents.addEvent(ce);

    var newLi = document.createElement("li");
    newLi.setAttribute('data-index', eventId);

    if (!document.getElementById('colorsOptions')) {
        initColorOptions();
    }

    var nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.placeholder = 'insert event name';
    nameInput.value = name;

    nameInput.onchange = function () {
        ce.setName(nameInput.value);
        this.calendarEvents.updateEventWithId(ce.id, ce);
        this.calendarRefresher.refresh();
    }.bind(this);

    var colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = color;
    colorInput.setAttribute('list', 'colorsOptions');
    colorInput.setAttribute('tabindex', '-1');
    colorInput.addEventListener('input', function (event) {
        ce.setColor(event.target.value);
        this.calendarEvents.updateEventWithId(ce.id, ce);
        this.calendarRefresher.refresh();
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

    var div = document.createElement('div');

    // select added div
    markSelected(div);
    this.eventStorage.setValue(eventId);

    div.appendChild(nameInput);
    div.appendChild(colorInput);
    div.appendChild(deleteLink);

    newLi.appendChild(div);

    newLi.addEventListener('click', function (event) {
        markSelected(div);
        this.eventStorage.setValue(eventId);
    }.bind(this));

    document.querySelector("ul#eventsList").appendChild(newLi);
};

EventsModel.prototype.addNewEvent = function () {
    this.addEventEditElements(this.idGenerator.generateID(), this.defaultColor, this.defaultName);
};

EventsModel.prototype.removeEvent = function (id) {
    // delete from object
    if (this.calendarEvents.removeEvent(id)) {
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
    var event = this.calendarEvents.getEventWithId(id);
    return !!event && !!event.color ? event.color : this.defaultColor;
};
EventsModel.prototype.getName = function (id) {
    var event = this.calendarEvents.getEventWithId(id);
    return !!event && !!event.name ? event.name : this.defaultName;
};
EventsModel.prototype.init = function () {
    $(function () {
        var events = this.calendarEvents.getEvents();
        for (var e in events) {
            var event = events[e];
            this.addEventEditElements(event.getId(), event.getColor(), event.getName());
        }
    }.bind(this));
};
var m = new EventsModel();
m.init();
module.exports = m;




/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var DateEvent = __webpack_require__(4);

function DateEvents() {
    this.events = [];
    this.persistanceUnit = __webpack_require__(0);
}

DateEvents.prototype.addOrSwitchOrReplaceEvent = function (e, omitSave) {
    var date = e.date;
    var id = e.id;
    var someDeleted = false;
    var hadSameId = false;
    // switch / remove event
    this.events = this.events.filter(function (val) {
        var found = val.date === date;
        if (found) {
            someDeleted = true;
            hadSameId = val.id === id;
        }
        return !found;
    });
    if (!someDeleted || !hadSameId) {
        // add / replace
        this.events.push(e);
    }
    if (!omitSave) {
        this.save();
    }
};
DateEvents.prototype.removeEventsWithId = function (id) {
    var wasDeleted = false;
    this.events = this.events.filter(function (val) {
        var found = val.id === id;
        if (found) {
            wasDeleted = true;
        }
        return !found;
    });
    if (wasDeleted) {
        this.save();
    }
    return wasDeleted;
};
DateEvents.prototype.getEventWithDate = function (date) {
    return this.events.filter(function (val) {
        return val.date === date;
    })[0];
};
DateEvents.prototype.init = function () {
    var eventsAsJSON = this.persistanceUnit.load('dates');
    if (!!eventsAsJSON) {
        var eventsO = JSON.parse(eventsAsJSON);
        for (var e in eventsO) {
            if (eventsO.hasOwnProperty(e)) {
                var event = eventsO[e];
                this.addOrSwitchOrReplaceEvent(new DateEvent(event.id, event.date), true);
            }
        }
    }
};
DateEvents.prototype.save = function () {
    this.persistanceUnit.save('dates', this.events);
};
var de = new DateEvents();
de.init();
module.exports = de;



/***/ }),
/* 9 */
/***/ (function(module, exports) {

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



/***/ }),
/* 10 */
/***/ (function(module, exports) {

function CalendarRefresher() {}

CalendarRefresher.prototype.refresh = function () {
    $("#datepicker").datepicker("refresh");
};

var cr = new CalendarRefresher();
module.exports = cr;



/***/ }),
/* 11 */
/***/ (function(module, exports) {

function IDGenerator() {}
;
IDGenerator.prototype.generateID = function () {
    return new Date().getTime();
};
var g = new IDGenerator();
module.exports = g;

/***/ })
/******/ ]);