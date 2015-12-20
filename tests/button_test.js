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

        it("Should have x limit coordinate as indicated in config.x + config.width", function () {
            expect(button.x_limit).to.equal(config.x + config.width);
        });
        it("Should have y limit coordinate as indicated in config.y + config.height", function () {
            expect(button.y_limit).to.equal(config.y + config.height);
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

        it("Make sure that button state is inactive", function () {
            expect(button.state).to.equal(BUTTON_ENUM.inactive);
        });

        it("Make sure that animation is at step 1", function () {
            expect(button.tick).to.equal(0);
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
    });

    describe("Swap states", function () {
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

        it("Check if animation frame gets resets after state change", function () {
            button.tick = 30;
            expect(button.tick).to.equal(30);
            button.setState(BUTTON_ENUM.inactive);
            expect(button.tick).to.equal(0);
        });

        it("Swap state to focused", function () {
            button.setState(BUTTON_ENUM.focused);
            expect(button.state).to.equal(BUTTON_ENUM.focused);
        });

        it("Swap state to focused, make sure that you get the right canvas", function () {
            button.setState(BUTTON_ENUM.focused);
            expect(button.getCanvas()).to.equal(button.canvas_focused);
        });

        it("Swap state to down", function () {
            button.setState(BUTTON_ENUM.down);
            expect(button.state).to.equal(BUTTON_ENUM.down);
        });

        it("Swap state to down, make sure that you get the right canvas", function () {
            button.setState(BUTTON_ENUM.down);
            expect(button.getCanvas()).to.equal(button.canvas_down);
        });

        it("Swap state to up", function () {
            button.setState(BUTTON_ENUM.up);
            expect(button.state).to.equal(BUTTON_ENUM.up);
        });

        it("Swap state to up, make sure that you get the right canvas", function () {
            button.setState(BUTTON_ENUM.up);
            expect(button.getCanvas()).to.equal(button.canvas_up);
        });

        it("Swap state to inactive", function () {
            button.setState(BUTTON_ENUM.up);
            expect(button.state).to.equal(BUTTON_ENUM.up);
            button.setState(BUTTON_ENUM.inactive);
            expect(button.state).to.equal(BUTTON_ENUM.inactive);
        });

        it("Swap state to inactive, make sure that you get the right canvas", function () {
            button.setState(BUTTON_ENUM.up);
            expect(button.state).to.equal(BUTTON_ENUM.up);
            button.setState(BUTTON_ENUM.inactive);
            expect(button.getCanvas()).to.equal(button.canvas_inactive);
        });
    });
});