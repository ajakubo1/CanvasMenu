/**
 * Created by claim on 19.02.16.
 */


CM.Multiple = function (config) {
    CM.Element.call(this, config);

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

    this.redrawStateField = function (context, state) {

    };
};

CM.Multiple.prototype = Object.create(CM.Element.prototype);
CM.Multiple.prototype.constructor = CM.Multiple;