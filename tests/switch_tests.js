/**
 * Created by claim on 10.02.16.
 */

var expect = chai.expect;

describe("Switch tests", function () {

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

    describe("Constructor tests", function () {

        beforeEach(function () {
            config = {
                x: 50,
                y: 50,
                width: 300,
                height: 50,
                text: "Multiple",
                name: "multitest",
                offsetY: 80,
                layout: "double_inner",
                template: {
                    width: 225,
                    height: 40
                }
            };

            switchElement = menu.create('switch', config)
        });

        it("Should have canvas 'on' width as indicated in config.width", function () {
            expect(switchElement.canvas.on.width).to.equal(config.width);
        });
        it("Should have canvas 'off' width as indicated in config.width", function () {
            expect(switchElement.canvas.off.width).to.equal(config.width);
        });

        it("Should have canvas 'on' height as indicated in config.height", function () {
            expect(switchElement.canvas.on.height).to.equal(config.height);
        });
        it("Should have canvas 'off' height as indicated in config.height", function () {
            expect(switchElement.canvas.off.height).to.equal(config.height);
        });

        it("Make sure that switch align is 'center'", function () {
            expect(switchElement.align).to.equal("left");
        });

        it("Check if switch value has been initiated", function () {
            expect(switchElement.value).to.equal(false);
        });
    });

    describe("Change value tests", function () {
        beforeEach(function () {

            config = {
                x: 50,
                y: 50,
                width: 300,
                height: 50,
                text: "test",
                name: "test",
                value: true
            };

            switchElement = menu.create('switch', config);
            menu.init();
        });

        it("Check if switch value has been initiated and set to true", function () {
            expect(switchElement.value).to.equal(true);
        });

        it("Check if switch value has been initiated and set to true via getValue() function call", function () {
            expect(switchElement.getValue()).to.equal(true);
        });

        it("Check if exporting value works correctly", function () {
            expect(switchElement.getFormattedValue()['test']).to.equal(true);
        });

        it("Check the default color for 'on' state", function () {
            var point = menu.ctx.getImageData(325, 75, 1, 1).data;
            var hex = "#" + TestHelper.rgbToHex(point);
            expect(hex).to.equal('#ffffff');
        });

        it("Check if switch value changes when triggering a click event", function () {
            switchElement.trigger(CM.EVENTS.click);
            expect(switchElement.value).to.equal(false);
        });

        it("Check the default color for 'off' state", function () {
            switchElement.trigger(CM.EVENTS.click);
            var point = menu.ctx.getImageData(325, 75, 1, 1).data;
            var hex = "#" + TestHelper.rgbToHex(point);
            expect(hex).to.equal('#0');
        });
    });
});