/**
 * Created by claim on 10.02.16.
 */

var expect = chai.expect;

describe("Element tests", function () {

    var menu,
        switchElement,
        config,
        dom_canvas;

    beforeEach(function () {
        dom_canvas = document.createElement('canvas');
        menu = new CM.Menu({
            canvas: dom_canvas
        });
    });

});