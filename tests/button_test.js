/**
 * Created by claim on 19.12.15.
 */

var expect = chai.expect;

describe("Button", function () {

    var button,
        config;

    describe("Constructor check", function () {

        beforeEach(function() {
            config = {
                x: 20,
                y: 30,
                width: 40,
                height: 50,
                text: "Test text"
            };
            button = new Button(config);
        });

        it("Should have x coordinate as indicated in config.x", function () {
            expect(button.x).to.equal(config.x);
        });
        it("Should have y coordinate as indicated in config.y", function () {
            expect(button.y).to.equal(config.y);
        });

        it("Should have width as indicated in config.width", function () {
            expect(button.width).to.equal(config.width);
        });
        it("Should have canvas inactive width as indicated in config.width", function () {
            expect(button.canvas_inactive.width).to.equal(config.width);
        });
        it("Should have canvas focused width as indicated in config.width", function () {
            expect(button.canvas_focused.width).to.equal(config.width);
        });
        it("Should have canvas down width as indicated in config.width", function () {
            expect(button.canvas_down.width).to.equal(config.width);
        });
        it("Should have canvas up width as indicated in config.width", function () {
            expect(button.canvas_up.width).to.equal(config.width);
        });

        it("Should have height as indicated in config.height", function () {
            expect(button.height).to.equal(config.height);
        });
        it("Should have canvas inactive height as indicated in config.height", function () {
            expect(button.canvas_inactive.height).to.equal(config.height);
        });
        it("Should have canvas focused height as indicated in config.height", function () {
            expect(button.canvas_focused.height).to.equal(config.height);
        });
        it("Should have canvas down height as indicated in config.height", function () {
            expect(button.canvas_down.height).to.equal(config.height);
        });
        it("Should have canvas up height as indicated in config.height", function () {
            expect(button.canvas_up.height).to.equal(config.height);
        });

        it("Should have text value as indicated in config.text", function () {
            expect(button.text).to.equal(config.text);
        });
    });

    describe("Check inRange()", function () {
        beforeEach(function() {
            config = {
                x: 20,
                y: 30,
                width: 40,
                height: 50,
                text: "Test text"
            };
            button = new Button(config);
        });

        it("Is on the left", function () {
            expect(button.inRange(config.x - 5, config.y + config.height / 2)).to.equal(false);
        });
        it("Is on the right", function () {
            expect(button.inRange(config.x + config.width + 5, config.y + config.height / 2)).to.equal(false);
        });
        it("Is on the top", function () {
            expect(button.inRange(config.x + config.width / 2, config.y - 5)).to.equal(false);
        });
        it("Is on the top-left", function () {
            expect(button.inRange(config.x - 5, config.y - 5)).to.equal(false);
        });
        it("Is on the top-right", function () {
            expect(button.inRange(config.x + config.width + 5, config.y + config.height + 5)).to.equal(false);
        });
        it("Is on the bottom", function () {
            expect(button.inRange(config.x + config.width / 2, config.y + config.height + 5)).to.equal(false);
        });
        it("Is on the bottom-left", function () {
            expect(button.inRange(config.x - 5, config.y + config.height + 5)).to.equal(false);
        });
        it("Is on the bottom-right", function () {
            expect(button.inRange(config.x + config.width + 5, config.y + config.height + 5)).to.equal(false);
        });
        it("Is in range", function () {
            expect(button.inRange(config.x + config.width / 2, config.y + config.height / 2)).to.equal(true);
        });
    })


});