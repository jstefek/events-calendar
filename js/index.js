var calendarEvents = require('./calendarEvents');
var eventsModel = require('./eventsModel');
var datesModel = require('./datesModel');

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
