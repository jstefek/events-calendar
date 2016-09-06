var CalendarEvent = require('./calendarEvent');


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
    this.persistanceUnit = require('./persistence');
    this.datesModel = require('./datesModel');
    this.calendarRefresher = require('./calendarRefresher');
    this.idsPool = require('./idsPool');
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


