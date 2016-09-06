// add "afterShow" event to date picker
$.datepicker._updateDatepicker_original = $.datepicker._updateDatepicker;
$.datepicker._updateDatepicker = function (inst) {
    $.datepicker._updateDatepicker_original(inst);
    var afterShow = this._get(inst, 'afterShow');
    if (afterShow)
        afterShow.apply((inst.input ? inst.input[0] : null)); // trigger custom callback
};