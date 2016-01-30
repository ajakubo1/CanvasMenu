/**
 * Created by claim on 19.12.15.
 */
var expect = chai.expect;

describe("Button", function () {

    var menu,
        button,
        config,
        dom_canvas;

    beforeEach(function() {
        dom_canvas = document.createElement('canvas');
    });

    describe("Constructor tests", function () {

        beforeEach(function() {

            config = {
                x: 20,
                y: 30,
                width: 40,
                height: 50,
                text: "Test text"
            };
            menu = new CM.Menu({
                canvas: dom_canvas,
                width: 800,
                height: 600
            });
            button = menu.create('button', config);
        });

        it("Should have text value as indicated in config.text", function () {
            expect(button.text).to.equal(config.text);
        });

        it("Should have canvas idle width as indicated in config.width", function () {
            expect(button.canvas.idle.width).to.equal(config.width);
        });
        it("Should have canvas over width as indicated in config.width", function () {
            expect(button.canvas.over.width).to.equal(config.width);
        });
        it("Should have canvas down width as indicated in config.width", function () {
            expect(button.canvas.down.width).to.equal(config.width);
        });
        it("Should have canvas up width as indicated in config.width", function () {
            expect(button.canvas.up.width).to.equal(config.width);
        });

        it("Should have canvas idle height as indicated in config.height", function () {
            expect(button.canvas.idle.height).to.equal(config.height);
        });
        it("Should have canvas over height as indicated in config.height", function () {
            expect(button.canvas.over.height).to.equal(config.height);
        });
        it("Should have canvas down height as indicated in config.height", function () {
            expect(button.canvas.down.height).to.equal(config.height);
        });
        it("Should have canvas up height as indicated in config.height", function () {
            expect(button.canvas.up.height).to.equal(config.height);
        });

        it("Make sure that element state is idle", function () {
            expect(button.state).to.equal(CM.ELEMENT_STATES.idle);
        });
    });

    describe("Swap states", function () {
        beforeEach(function() {
            config = {
                x: 50,
                y: 50,
                width: 50,
                height: 50,
                text: "Test text"
            };
            menu = new CM.Menu({
                canvas: dom_canvas
            });
            button = menu.create('button', config);
        });

        it("Swap state to over", function () {
            button.enterListener();
            expect(button.state).to.equal(CM.ELEMENT_STATES.over);
        });

        it("Swap state to over, make sure that you get the right canvas", function () {
            button.enterListener();
            expect(button.getCanvas()).to.equal(button.canvas.over);
        });

        it("Swap state to down", function () {
            button.downListener();
            expect(button.state).to.equal(CM.ELEMENT_STATES.down);
        });

        it("Swap state to down, make sure that you get the right canvas", function () {
            button.downListener();
            expect(button.getCanvas()).to.equal(button.canvas.down);
        });

        it("Swap state to up", function () {
            button.upListener();
            expect(button.state).to.equal(CM.ELEMENT_STATES.up);
        });

        it("Swap state to up, make sure that you get the right canvas", function () {
            button.upListener();
            expect(button.getCanvas()).to.equal(button.canvas.up);
        });

        it("Swap state to idle", function () {
            button.upListener();
            expect(button.state).to.equal(CM.ELEMENT_STATES.up);
            button.leaveListener();
            expect(button.state).to.equal(CM.ELEMENT_STATES.idle);
        });

        it("Swap state to idle, make sure that you get the right canvas", function () {
            button.upListener();
            expect(button.state).to.equal(CM.ELEMENT_STATES.up);
            button.leaveListener();
            expect(button.getCanvas()).to.equal(button.canvas.idle);
        });
    });
    
    describe("Testing re-drawing functions", function () {

        beforeEach(function() {
            config = {
                x: 50,
                y: 50,
                width: 50,
                height: 50,
                text: "Test text",
                idle: {
                    color: "#333333"
                },
                over: {
                    color: "#222222"
                },
                down: {
                    color: "#111111"
                },
                up: {
                    color: "#444444"
                }
            };
            menu = new CM.Menu({
                canvas: dom_canvas
            });
            button = menu.create('button', config);

            menu.init();
        });

        it("Should have idle colors", function () {
            var point = menu.ctx.getImageData(51, 51, 1, 1).data;
            var hex = "#" + TestHelper.rgbToHex(point);
            expect(hex).to.equal('#333333');
        });

        it("Should have over colors", function () {
            TestHelper.triggerMouseEvent('mousemove', 51, 51, dom_canvas);
            var point = menu.ctx.getImageData(51, 51, 1, 1).data;
            var hex = "#" + TestHelper.rgbToHex(point);
            expect(hex).to.equal('#222222');
        });

        it("Should have down colors", function () {
            TestHelper.triggerMouseEvent('mousemove', 51, 51, dom_canvas);
            TestHelper.triggerMouseEvent('mousedown', 51, 51, dom_canvas);
            var point = menu.ctx.getImageData(51, 51, 1, 1).data;
            var hex = "#" + TestHelper.rgbToHex(point);
            expect(hex).to.equal('#111111');
        });

        it("Should have up colors", function () {
            TestHelper.triggerMouseEvent('mousemove', 51, 51, dom_canvas);
            TestHelper.triggerMouseEvent('mousedown', 51, 51, dom_canvas);
            TestHelper.triggerMouseEvent('mouseup', 51, 51, dom_canvas);
            var point = menu.ctx.getImageData(51, 51, 1, 1).data;
            var hex = "#" + TestHelper.rgbToHex(point);
            expect(hex).to.equal('#444444');
        });
    });
});