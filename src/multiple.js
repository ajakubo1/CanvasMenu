/**
 * Created by claim on 19.02.16.
 */


CM.Multiple = function (config) {
    CM.Element.call(this, config);
    this.font = config.font || "20pt Arial";
    this.vertical = config.vertical || "top";
    this.elements = [];

    //Gets template for used switches + layout coordinates
    //  width, height, font, on - this is passed
    //  for individual checkboxes: names, values,
    //Just when menu is set, it adds all of the checkboxes to the menu (it's not responsible for the checkbox listeners)
    //Can redraw the inside of itself (so it should extend element also, but it doesn't have any states, just one
    //Add new listener - on statechange
    //Set listeners to enter and leave

    //layouts:
    //left
    //right
    //double inner
    //double outer
    //double left
    //double right

    this.init = function () {
        if (config.elements) {
            var initialY = 40 + this.y, i;
            for (i = 0; i < config.elements.length; i += 1) {
                this.elements.push(new CM.Switch({
                    "x": 10 + this.x,
                    "y": initialY - 5 + (5 + config.template.height) * i,
                    "width": config.template.width,
                    "height": config.template.height,
                    "text": config.elements[i].text,
                    "name": config.elements[i].name,
                    "value": config.elements[i].value,
                    "on": config.elements[i].on
                }));
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