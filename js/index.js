var idsPool = require('./idsPool');
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
