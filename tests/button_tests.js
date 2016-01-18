/**
 * Created by claim on 19.12.15.
 */
var expect = chai.expect;

describe("Button", function () {

    var menu,
        button,
        config;

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
                canvas: document.createElement('canvas'),
                width: 800,
                height: 600
            });
            button = menu.create('button', config);
        });

        it("Should have text value as indicated in config.text", function () {
            expect(button.text).to.equal(config.text);
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
            menu = new CM.Menu({
                canvas: document.createElement('canvas'),
                width: 800,
                height: 600
            });
            button = menu.create('button', config);
        });

        it("Swap state to over", function () {
            button.setState(CM.ELEMENT_STATES.over);
            expect(button.state).to.equal(CM.ELEMENT_STATES.over);
        });

        it("Swap state to over, make sure that you get the right canvas", function () {
            button.setState(CM.ELEMENT_STATES.over);
            expect(button.getCanvas()).to.equal(button.canvas.over);
        });

        it("Swap state to down", function () {
            button.setState(CM.ELEMENT_STATES.down);
            expect(button.state).to.equal(CM.ELEMENT_STATES.down);
        });

        it("Swap state to down, make sure that you get the right canvas", function () {
            button.setState(CM.ELEMENT_STATES.down);
            expect(button.getCanvas()).to.equal(button.canvas.down);
        });

        it("Swap state to up", function () {
            button.setState(CM.ELEMENT_STATES.up);
            expect(button.state).to.equal(CM.ELEMENT_STATES.up);
        });

        it("Swap state to up, make sure that you get the right canvas", function () {
            button.setState(CM.ELEMENT_STATES.up);
            expect(button.getCanvas()).to.equal(button.canvas.up);
        });

        it("Swap state to idle", function () {
            button.setState(CM.ELEMENT_STATES.up);
            expect(button.state).to.equal(CM.ELEMENT_STATES.up);
            button.setState(CM.ELEMENT_STATES.idle);
            expect(button.state).to.equal(CM.ELEMENT_STATES.idle);
        });

        it("Swap state to idle, make sure that you get the right canvas", function () {
            button.setState(CM.ELEMENT_STATES.up);
            expect(button.state).to.equal(CM.ELEMENT_STATES.up);
            button.setState(CM.ELEMENT_STATES.idle);
            expect(button.getCanvas()).to.equal(button.canvas.idle);
        });
    });
});