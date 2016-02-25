/**
 * Created by claim on 18.02.16.
 */


CM.Radio = function (config) {
    this.option = undefined;
    this.resetTemplate = function () {
        if (config.elements) {
            var i, count = 0, found;
            for (i = 0; i < config.elements.length; i += 1) {
                if (config.elements[i].value !== undefined && config.elements[i].value === true) {
                    count += 1;
                    found = i;
                }
                config.elements[i].value = false;
            }

            if (count > 1) {
                for (i = 0; i < config.elements.length; i += 1) {
                    config.elements[i].value = false;
                }
            } else if (count === 1) {
                this.option = found;
            }
        }
    };

    this.resetTemplate();
    CM.Multiple.call(this, config);

    this.clickListener = function (x, y) {
        setTimeout(function () {
            var i, changed;

            for (i = 0; i < this.elements.length; i += 1) {
                if (i !== this.option && this.elements[i].getValue() === true) {
                    changed = i;
                    break;
                }
            }

            if(changed === undefined && this.option !== undefined) {
                if(this.elements[this.option].getValue() === true) {
                    changed = this.option;
                }
            }

            if(changed !== this.option) {
                if (this.option !== undefined && changed !== undefined) {
                    this.elements[this.option].trigger(CM.EVENTS.click);
                    this.option = changed;
                } else if (changed !== undefined) {
                    this.option = changed;
                } else {
                    this.option = undefined;
                }
            }

        }.bind(this), 0);
    };

    this.on(CM.EVENTS.click, this.clickListener);
};

CM.Radio.prototype = Object.create(CM.Multiple.prototype);
CM.Radio.prototype.constructor = CM.Radio;