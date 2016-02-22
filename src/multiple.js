/**
 * Created by claim on 19.02.16.
 */


CM.LAYOUTS = {
    "left": "left",
    "right": "right",
    "double_inner": "double_inner",
    "double_outer": "double_outer",
    "double_left": "double_left",
    "double_right": "double_right"
};

/**
 *
 * @param config
 * @param {string} config.name - name of the multiple selector
 * @constructor
 */
CM.Multiple = function (config) {
    CM.Element.call(this, config);
    this.font = config.font || "30pt Arial";
    this.vertical = config.vertical || "top";
    this.elements = [];
    this.offsetY = config.offsetY || 100;
    this.layout = config.layout || CM.LAYOUTS.left;

    //Gets template for used switches + layout coordinates
    //  width, height, font, on - this is passed
    //  for individual checkboxes: names, values,

    //Just when menu is set, it adds all of the checkboxes to the menu (it's not responsible for the checkbox listeners)
    //Can redraw the inside of itself (so it should extend element also, but it doesn't have any states, just one
    //Add new listener - on statechange
    //Set listeners to enter and leave

    this.loadElements = function (array, offset, align) {
        var i;

        for (i = 0; i < array.length; i += 1) {
            this.elements.push(new CM.Switch({
                "x": offset + this.x,
                "y": this.offsetY + this.y - 5 + (5 + config.template.height) * i,
                "width": config.template.width,
                "height": config.template.height,
                "text": array[i].text,
                "name": array[i].name,
                "value": array[i].value,
                "on": config.template.on,
                "align": align,
                "off": config.template.off
            }));
        }
    };

    this.init = function () {
        if (config.elements) {
            if (this.layout === CM.LAYOUTS.left || this.layout === CM.LAYOUTS.right) {
                this.loadElements(config.elements, this.width / 2 - config.template.width / 2, this.layout);
            } else {
                var offsetX, leftSide;
                offsetX = this.width / 4 - config.template.width / 2;
                leftSide = config.elements.splice(0, Math.round(config.elements.length / 2));
                if (this.layout === CM.LAYOUTS.double_inner || this.layout === CM.LAYOUTS.double_left) {
                    this.loadElements(leftSide, offsetX, "left");
                } else {
                    this.loadElements(leftSide, offsetX, "right");
                }

                if (this.layout === CM.LAYOUTS.double_outer || this.layout === CM.LAYOUTS.double_left) {
                    this.loadElements(config.elements, offsetX + this.width / 2, "left");
                } else {
                    this.loadElements(config.elements, offsetX + this.width / 2, "right");
                }
            }
        }
    };

    this.init();

    this.redrawStateField = function (context, state) {
        context.strokeWidth = 2;
        context.strokeStyle = "white";
        context.strokeRect(0, 0, this.width, this.height);
    };

    this.redrawState();
};

CM.Multiple.prototype = Object.create(CM.Element.prototype);
CM.Multiple.prototype.constructor = CM.Multiple;

CM.Multiple.prototype.setMenu = function (menu) {
    var i;
    this.menu = menu;
    for (i = 0; i < this.elements.length; i += 1) {
        console.info(i);
        this.menu.add(this.elements[i]);
    }
};

/**
 * Returns element value (if any is set)
 * @returns {undefined|*}
 */
CM.Multiple.prototype.getValue = function () {
    var i, toReturn = [];
    for (i = 0 ; i < this.elements.length; i += 1) {
        toReturn.push(this.elements[i].getFormattedValue());
    }
    return toReturn;
};

/**
 * Returns element value wrapped in object (keyed by element name). If no name is set, returns undefined
 * @returns {*}
 */
CM.Multiple.prototype.getFormattedValue = function () {
    var toReturn = {};
    if (this.name) {
        toReturn[this.name] = this.getValue();
    } else {
        return undefined;
    }
    return toReturn;
};