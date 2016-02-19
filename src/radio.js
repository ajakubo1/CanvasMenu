/**
 * Created by claim on 18.02.16.
 */


CM.Radio = function (config) {
    CM.Multiple.call(this, config);
};

CM.Radio.prototype = Object.create(CM.Multiple.prototype);
CM.Radio.prototype.constructor = CM.Radio;