var CalendarEvent = require('./calendarEvent');

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
    this.persistanceUnit = require('./persistence');
    this.datesModel = require('./datesModel');
    this.calendarRefresher = require('./calendarRefresher');
    this.idGenerator = require('./idGenerator');
    this.eventStorage = require('./eventStorage');
    this.calendarEvents = require('./calendarEvents');
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


