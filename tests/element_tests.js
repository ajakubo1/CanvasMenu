/**
 * Created by claim on 16.01.16.
 */

var expect = chai.expect;

describe("Element tests", function () {
    var menu,
        element,
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
                width: 50,
                height: 50,
                text: "Test text"
            };
            element = menu.create('element', config);
        });

        it("Should have x coordinate as indicated in config.x", function () {
            expect(element.x).to.equal(config.x);
        });

        it("'getX()' function should return value from config.x", function () {
            expect(element.getX()).to.equal(config.x);
        });

        it("Should have y coordinate as indicated in config.y", function () {
            expect(element.y).to.equal(config.y);
        });

        it("'getY()' function should return value from config.y", function () {
            expect(element.getY()).to.equal(config.y);
        });

        it("Should have x limit coordinate as indicated in config.x + config.width", function () {
            expect(element.x_limit).to.equal(config.x + config.width);
        });
        it("Should have y limit coordinate as indicated in config.y + config.height", function () {
            expect(element.y_limit).to.equal(config.y + config.height);
        });

        it("Should have width as indicated in config.width", function () {
            expect(element.width).to.equal(config.width);
        });
        it("Should have canvas idle width as indicated in config.width", function () {
            expect(element.canvas.main.width).to.equal(config.width);
        });

        it("Should have height as indicated in config.height", function () {
            expect(element.height).to.equal(config.height);
        });
        it("Should have canvas idle height as indicated in config.height", function () {
            expect(element.canvas.main.height).to.equal(config.height);
        });

        it("Make sure that element state is idle", function () {
            expect(element.state).to.equal("main");
        });

        it("Make sure that element align is 'left'", function () {
            expect(element.align).to.equal("left");
        });

        it("Make sure that animation step is initiated", function () {
            expect(element.tick).to.equal(0);
        });

        it("Should have text value as indicated in config.text", function () {
            expect(element.text).to.equal(config.text);
        });

        it("Check if value has been initiated", function () {
            expect(element.value).to.equal(undefined);
        });

        it("Check if getValue() returns correct value", function () {
            expect(element.getValue()).to.equal(undefined);
            element.value = 5;
            expect(element.getValue()).to.equal(5);
        });

        it("Check if getFormattedValue() returns correct value", function () {
            element.name = "test";
            element.value = 5;

            var value = element.getFormattedValue();
            expect(value['test']).to.equal(5);
        });

        it("Check initiated events", function () {
            expect(element.events.click.length).to.equal(0);
            expect(element.events.mousedown.length).to.equal(0);
            expect(element.events.mouseup.length).to.equal(0);
            expect(element.events.mousemove.length).to.equal(0);
            expect(element.events.mouseenter.length).to.equal(0);
            expect(element.events.mouseleave.length).to.equal(0);
        });

        it("Check if default is defined", function () {
            expect(element.default).to.not.equal(undefined);
        });

        it("Check if element has empty", function () {
            expect(element.name).to.equal(undefined);
        });
    });

    describe("Check if events + triggering is working properly", function () {

        var constructor_click = false,
            constructor_mousedown = false,
            constructor_mouseup = false,
            constructor_mousemove = false,
            constructor_mouseenter = false,
            constructor_mouseleave = false;

        beforeEach(function() {
            config = {
                x: 50,
                y: 50,
                width: 50,
                height: 50,
                on: [
                    ["click", function () {
                        constructor_click = true;
                    }],
                    ["mousedown", function () {
                        constructor_mousedown = true;
                    }],
                    ["mouseup", function () {
                        constructor_mouseup = true;
                    }],
                    ["mousemove", function () {
                        constructor_mousemove = true;
                    }],
                    ["mouseenter", function () {
                        constructor_mouseenter = true;
                    }],
                    ["mouseleave", function () {
                        constructor_mouseleave = true;
                    }]
                ]
            };
            element = menu.create('element', config);
        });

        it("Triggering `click` event", function () {
            var passed = false;
            element.on('click', function () {
                passed = true;
            });

            element.trigger('click');

            expect(passed).to.equal(true);
        });

        it("Triggering `mousedown` event", function () {
            var passed = false;
            element.on('mousedown', function () {
                passed = true;
            });

            element.trigger('mousedown');

            expect(passed).to.equal(true);
        });
        it("Triggering `mouseup` event", function () {
            var passed = false;
            element.on('mouseup', function () {
                passed = true;
            });

            element.trigger('mouseup');

            expect(passed).to.equal(true);
        });

        it("Triggering `mousemove` event", function () {
            var passed = false;
            element.on('mousemove', function () {
                passed = true;
            });

            element.trigger('mousemove');

            expect(passed).to.equal(true);
        });

        it("Triggering `mouseenter` event", function () {
            var passed = false;
            element.on('mouseenter', function () {
                passed = true;
            });

            element.trigger('mouseenter');

            expect(passed).to.equal(true);
        });

        it("Triggering `mouseleave` event", function () {
            var passed = false;
            element.on('mouseleave', function () {
                passed = true;
            });

            element.trigger('mouseleave');

            expect(passed).to.equal(true);
        });

        it("Triggering `click` event from constructor", function () {
            element.trigger('click');

            expect(constructor_click).to.equal(true);
        });

        it("Triggering `mousedown` event from constructor", function () {
            element.trigger('mousedown');

            expect(constructor_mousedown).to.equal(true);
        });
        it("Triggering `mouseup` event from constructor", function () {
            element.trigger('mouseup');

            expect(constructor_mouseup).to.equal(true);
        });

        it("Triggering `mousemove` event from constructor", function () {
            element.trigger('mousemove');

            expect(constructor_mousemove).to.equal(true);
        });

        it("Triggering `mouseenter` event from constructor", function () {
            element.trigger('mouseenter');

            expect(constructor_mouseenter).to.equal(true);
        });

        it("Triggering `mouseleave` event from constructor", function () {
            element.trigger('mouseleave');

            expect(constructor_mouseleave).to.equal(true);
        });
    });

    describe("Check inRange()", function () {
        beforeEach(function() {
            config = {
                x: 50,
                y: 50,
                width: 50,
                height: 50
            };
            element = menu.create('element', config);
        });

        it("Is on the left", function () {
            expect(element.inRange(config.x - 5, config.y + config.height / 2)).to.equal(false);
        });
        it("Is on the right", function () {
            expect(element.inRange(config.x + config.width + 5, config.y + config.height / 2)).to.equal(false);
        });
        it("Is on the top", function () {
            expect(element.inRange(config.x + config.width / 2, config.y - 5)).to.equal(false);
        });
        it("Is on the top-left", function () {
            expect(element.inRange(config.x - 5, config.y - 5)).to.equal(false);
        });
        it("Is on the top-right", function () {
            expect(element.inRange(config.x + config.width + 5, config.y + config.height + 5)).to.equal(false);
        });
        it("Is on the bottom", function () {
            expect(element.inRange(config.x + config.width / 2, config.y + config.height + 5)).to.equal(false);
        });
        it("Is on the bottom-left", function () {
            expect(element.inRange(config.x - 5, config.y + config.height + 5)).to.equal(false);
        });
        it("Is on the bottom-right", function () {
            expect(element.inRange(config.x + config.width + 5, config.y + config.height + 5)).to.equal(false);
        });
        it("Is in range", function () {
            expect(element.inRange(config.x + config.width / 2, config.y + config.height / 2)).to.equal(true);
        });
    });
});