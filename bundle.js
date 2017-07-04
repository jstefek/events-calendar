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
/***/ (function(module, exports, __webpack_require__) {

var CalendarEvent = __webpack_require__(1);
var persistanceUnit = __webpack_require__(2);

function save(events) {
    persistanceUnit.save('events', events);
}

function init(calendarEvents) {
    var eventsAsJSON = persistanceUnit.load('events');
    if (!!eventsAsJSON) {
        var eventsO = JSON.parse(eventsAsJSON);
        for (var e in eventsO) {
            if (eventsO.hasOwnProperty(e)) {
                var event = eventsO[e];
                calendarEvents.addEvent(new CalendarEvent(event.id, event.name, event.color));
            }
        }
    }
}

function CalendarEvents() {
    this.events = [];
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
        save(this.events);
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
        save(this.events);
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
        save(this.events);
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

var ce = new CalendarEvents();
init(ce);

module.exports = ce;



/***/ }),
/* 1 */
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
/* 2 */
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var DateEvent = __webpack_require__(4);

function DatesModel() {
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
    if (!!id) {// some event is selected
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

// global storage for actually selected event 
var Storage = __webpack_require__(9);
var s = new Storage();
module.exports = s;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var calendarEvents = __webpack_require__(0);
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
    // initialize date picker
    $("#datepicker").datepicker({
        inline: true,
        onSelect: function (date) {
            datesModel.addOrUpdateDate(date);
        },
        beforeShowDay: function (date) {
            var eventId = datesModel.getEventIdForDate(getDate(date));
            if (!!eventId) {// has the date some event on it?
                // set an marker class on the date
                return [true, "event-color-" + eventId, eventsModel.getName(eventId)];
            }
            return [true, "ui-state-default", ""];
        },
        afterShow: function () {
            calendarEvents.getEvents().forEach(function (event) {// for all events
                $('.event-color-' + event.id).each(function () {// for all marked dates for this event
                    // mark the date with the right event color
                    var t = $(this);
                    t.css('background', event.color);
                    t.find('> a').css('background', event.color);
                });
            });
            $('.ui-state-active').attr('class', '');
        }
    });

    // add ability to create events
    var $addNewEventLink = $("a#addNewEventLink");
    $addNewEventLink.on("click", function () {
        eventsModel.addNewEvent();
    });
});


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var CalendarEvent = __webpack_require__(1);

function removePreviouslySelected() {
    var els = document.getElementsByClassName('radioSelected');
    for (var e in els) {
        if (!!els[e] && !!els[e].classList) {
            els[e].classList.remove('radioSelected');
        }
    }
}

function markSelected(el) {
    removePreviouslySelected();
    el.classList.add('radioSelected');
}

function init(eventsModel) {
    $(function () {
        var events = eventsModel.calendarEvents.getEvents();
        for (var e in events) {
            var event = events[e];
            eventsModel.addEventEditElements(event.getId(), event.getName(), event.getColor());
        }
    })
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

function createColorInput(ce, eventsModel) {
    var colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = ce.color;
    colorInput.setAttribute('list', 'colorsOptions');
    colorInput.setAttribute('tabindex', '-1');
    colorInput.addEventListener('input', function (event) {
        ce.setColor(event.target.value);
        this.calendarEvents.updateEventWithId(ce.id, ce);
        this.calendarRefresher.refresh();
    }.bind(eventsModel));
    return colorInput;
}

function createNameInput(ce, eventsModel) {
    var nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.placeholder = 'insert event name';
    nameInput.value = ce.name;

    nameInput.onchange = function () {
        ce.setName(nameInput.value);
        this.calendarEvents.updateEventWithId(ce.id, ce);
        this.calendarRefresher.refresh();
    }.bind(eventsModel);
    return nameInput;
}

function createDeleteLink(ce, eventsModel) {
    var deleteLink = document.createElement("a");
    deleteLink.className = "ui-icon ui-icon-circle-minus";
    deleteLink.href = "#";
    deleteLink.addEventListener('click', function () {
        if (confirm("Opravdu chces odstranit tuto udalost?")) {
            this.datesModel.removeAllDatesWithEventId(ce.id);
            this.removeEvent(ce.id);
            this.calendarRefresher.refresh();
        }
    }.bind(eventsModel));
    return deleteLink;
}

function appendEventEditElements(ce, eventsModel) {
    var nameInput = createNameInput(ce, eventsModel);
    var colorInput = createColorInput(ce, eventsModel);
    var deleteLink = createDeleteLink(ce, eventsModel);

    var div = document.createElement('div');
    markSelected(div);// select added div
    eventsModel.eventStorage.setValue(ce.id);

    div.appendChild(nameInput);
    div.appendChild(colorInput);
    div.appendChild(deleteLink);

    var li = document.createElement("li");
    li.setAttribute('data-index', ce.id);
    li.appendChild(div);
    li.addEventListener('click', function () {
        markSelected(div);
        this.eventStorage.setValue(ce.id);
    }.bind(eventsModel));

    document.querySelector("ul#eventsList").appendChild(li);
}

function EventsModel() {
    this.defaultColor = '#00f';
    this.defaultName = '';
    this.datesModel = __webpack_require__(3);
    this.calendarRefresher = __webpack_require__(10);
    this.idGenerator = __webpack_require__(11);
    this.eventStorage = __webpack_require__(5);
    this.calendarEvents = __webpack_require__(0);
}

EventsModel.prototype.addEventEditElements = function (eventId, name, color) {
    var ce = new CalendarEvent(eventId, name, color);
    this.calendarEvents.addEvent(ce);
    if (!document.getElementById('colorsOptions')) {
        initColorOptions();
    }
    appendEventEditElements(ce, this);
};

EventsModel.prototype.addNewEvent = function () {
    this.addEventEditElements(this.idGenerator.generateID(), this.defaultName, this.defaultColor);
};

EventsModel.prototype.removeEvent = function (id) {
    // delete from object
    if (this.calendarEvents.removeEvent(id)) {
        // remove elements
        var element = document.querySelector("li[data-index='" + id + "']");
        var wasSelected = (element.children[0].getAttribute('class') || '').indexOf('radioSelected') !== -1;
        element.parentNode.removeChild(element);
        if (wasSelected) {// if was selected, try to select first available event 
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

var m = new EventsModel();
init(m);

module.exports = m;




/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var DateEvent = __webpack_require__(4);
var persistanceUnit = __webpack_require__(2);

function DateEvents() {
    this.events = [];
}

function save(events) {
    persistanceUnit.save('dates', events);
}

function init(dateEvents) {
    var eventsAsJSON = persistanceUnit.load('dates');
    if (!!eventsAsJSON) {
        var eventsO = JSON.parse(eventsAsJSON);
        for (var e in eventsO) {
            if (eventsO.hasOwnProperty(e)) {
                var event = eventsO[e];
                dateEvents.addOrSwitchOrReplaceEvent(new DateEvent(event.id, event.date), true);
            }
        }
    }
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
        save(this.events);
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
        save(this.events);
    }
    return wasDeleted;
};
DateEvents.prototype.getEventWithDate = function (date) {
    return this.events.filter(function (val) {
        return val.date === date;
    })[0];
};

var de = new DateEvents();
init(de);

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

function CalendarRefresher(locator, methodName) {
    this.locator = locator || '#datepicker';
    this.methodName = methodName || 'refresh';
}

CalendarRefresher.prototype.refresh = function () {
    $(this.locator).datepicker(this.methodName);
};

var cr = new CalendarRefresher();
module.exports = cr;



/***/ }),
/* 11 */
/***/ (function(module, exports) {

function IDGenerator() {}

IDGenerator.prototype.generateID = function () {
    return new Date().getTime();
};

var g = new IDGenerator();
module.exports = g;

/***/ })
/******/ ]);