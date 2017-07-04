var CalendarEvent = require('./calendarEvent');

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
    this.datesModel = require('./datesModel');
    this.calendarRefresher = require('./calendarRefresher');
    this.idGenerator = require('./idGenerator');
    this.eventStorage = require('./eventStorage');
    this.calendarEvents = require('./calendarEvents');
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


