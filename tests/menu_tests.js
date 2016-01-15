/**
 * Created by claim on 07.01.16.
 */

var expect = chai.expect;

describe("Menu tests", function () {

    var menu,
        button,
        config,
        dom_canvas;

    beforeEach(function () {
        dom_canvas = document.createElement('canvas');
    });

    describe("Constructor tests", function () {
        it("Should allow user to pass 3 arguments (canvas, width, height)", function () {
            config = {
                canvas: dom_canvas,
                width: 400,
                height: 300
            };

            expect(function () {
                new CM.Menu(config);
            }).to.not.throw(TypeError);
        });

        it("Should allow user to pass 1 argument (canvas)", function () {
            config = {
                canvas: dom_canvas
            };

            expect(function () {
                new CM.Menu(config);
            }).to.not.throw(TypeError);
        });

        it("Should throw error when empty config is given", function () {
            config = {};
            expect(function () {
                new CM.Menu(config);
            }).to.throw(TypeError);
        });

        it("Should throw error when no argument is given", function () {
            expect(function () {
                new CM.Menu();
            }).to.throw(TypeError);
        });

        it("Should have default values set when colling the constructor with DOM canvas", function () {
            config = {
                canvas: dom_canvas
            };
            menu = new CM.Menu(config);

            expect(menu.width).to.equal(800);
            expect(menu.height).to.equal(600);
            expect(menu.canvas.width).to.equal(800);
            expect(menu.canvas.height).to.equal(600);
            expect(menu.canvas).to.equal(dom_canvas);
            expect(menu.scaleX).to.equal(1);
            expect(menu.scaleY).to.equal(1);
            expect(menu.animated).to.equal(false);
            expect(menu.running).to.equal(false);
            expect(menu.tickMax).to.equal(Number.MAX_VALUE);
            expect(menu.autorescale).to.equal(false);
        });

        it("Check width + height passing", function () {
            config = {
                canvas: dom_canvas,
                width: 400,
                height: 300
            };

            menu = new CM.Menu(config);

            expect(menu.width).to.equal(400);
            expect(menu.height).to.equal(300);
        });

        it("Check config properties passing", function () {
            config = {
                canvas: dom_canvas,
                width: 400,
                height: 300,
                animation: function () {},
                tickMax: 60,
                autorescale: true
            };

            menu = new CM.Menu(config);

            expect(menu.width).to.equal(400);
            expect(menu.height).to.equal(300);
            expect(menu.canvas.width).to.equal(400);
            expect(menu.canvas.height).to.equal(300);
            expect(menu.canvas).to.equal(dom_canvas);
            expect(menu.animated).to.equal(true);
            expect(menu.tickMax).to.equal(60);
        });

        it("Check if init & destroy runs correctly", function () {
            config = {
                canvas: dom_canvas
            };

            menu = new CM.Menu(config);
            menu.init();
            expect(menu.running).to.equal(true);
            expect(menu.isVisible()).to.equal(true);
            menu.destroy();
            expect(menu.running).to.equal(false);
            expect(menu.isVisible()).to.equal(false);
        });

    });

    describe("Mouse Events tests", function () {

        beforeEach(function () {
            config = {
                canvas: dom_canvas
            };

            menu = new CM.Menu(config);
            button = menu.create('button', {
                x: 50,
                y: 50,
                width: 50,
                height: 50,
                text: "Test"
            });

            menu.init();

        });

        it('Mouse is out, Mouse is over, Mouse is out', function () {
            var event = new MouseEvent('mousemove', {
                clientX: 10,
                clientY: 10
            });
            dom_canvas.dispatchEvent(event);
            expect(button.state).to.equal(CM.ELEMENT_STATES.idle);

            event = new MouseEvent('mousemove', {
                clientX: 60,
                clientY: 60
            });
            dom_canvas.dispatchEvent(event);
            expect(button.state).to.equal(CM.ELEMENT_STATES.over);

            event = new MouseEvent('mousemove', {
                clientX: 10,
                clientY: 10
            });
            dom_canvas.dispatchEvent(event);
            expect(button.state).to.equal(CM.ELEMENT_STATES.idle);
        });

        it('Mouse is out, Mouse is over, Mouse is down', function () {
            var event = new MouseEvent('mousemove', {
                clientX: 10,
                clientY: 10
            });
            dom_canvas.dispatchEvent(event);
            expect(button.state).to.equal(CM.ELEMENT_STATES.idle);

            event = new MouseEvent('mousemove', {
                clientX: 60,
                clientY: 60
            });
            dom_canvas.dispatchEvent(event);
            expect(button.state).to.equal(CM.ELEMENT_STATES.over);

            event = new MouseEvent('mousedown', {
                clientX: 60,
                clientY: 60
            });
            dom_canvas.dispatchEvent(event);
            expect(button.state).to.equal(CM.ELEMENT_STATES.down);
        });

        it('Mouse is out, Mouse is over, Mouse is clicked', function () {
            var event = new MouseEvent('mousemove', {
                clientX: 10,
                clientY: 10
            });
            dom_canvas.dispatchEvent(event);
            expect(button.state).to.equal(CM.ELEMENT_STATES.idle);

            event = new MouseEvent('mousemove', {
                clientX: 60,
                clientY: 60
            });
            dom_canvas.dispatchEvent(event);
            expect(button.state).to.equal(CM.ELEMENT_STATES.over);

            event = new MouseEvent('mousedown', {
                clientX: 60,
                clientY: 60
            });
            dom_canvas.dispatchEvent(event);
            expect(button.state).to.equal(CM.ELEMENT_STATES.down);

            event = new MouseEvent('mouseup', {
                clientX: 60,
                clientY: 60
            });
            dom_canvas.dispatchEvent(event);
            expect(button.state).to.equal(CM.ELEMENT_STATES.up);
        });

        it('Mouse is out, Mouse is over, Mouse is clicked, Mouse is over, Mouse is out', function () {
            var event = new MouseEvent('mousemove', {
                clientX: 10,
                clientY: 10
            });
            dom_canvas.dispatchEvent(event);
            expect(button.state).to.equal(CM.ELEMENT_STATES.idle);

            event = new MouseEvent('mousemove', {
                clientX: 60,
                clientY: 60
            });
            dom_canvas.dispatchEvent(event);
            expect(button.state).to.equal(CM.ELEMENT_STATES.over);

            event = new MouseEvent('mousedown', {
                clientX: 60,
                clientY: 60
            });
            dom_canvas.dispatchEvent(event);
            expect(button.state).to.equal(CM.ELEMENT_STATES.down);

            event = new MouseEvent('mouseup', {
                clientX: 60,
                clientY: 60
            });
            dom_canvas.dispatchEvent(event);
            expect(button.state).to.equal(CM.ELEMENT_STATES.up);

            event = new MouseEvent('mousemove', {
                clientX: 55,
                clientY: 55
            });
            dom_canvas.dispatchEvent(event);
            expect(button.state).to.equal(CM.ELEMENT_STATES.over);

            event = new MouseEvent('mousemove', {
                clientX: 10,
                clientY: 10
            });
            dom_canvas.dispatchEvent(event);
            expect(button.state).to.equal(CM.ELEMENT_STATES.idle);
        });

        it('Mouse is up', function () {
            var event = new MouseEvent('mouseup', {
                clientX: 60,
                clientY: 60
            });
            dom_canvas.dispatchEvent(event);
            expect(button.state).to.equal(CM.ELEMENT_STATES.idle);
        });

        it('Mouse is down', function () {

            var event = new MouseEvent('mousedown', {
                clientX: 60,
                clientY: 60
            });
            dom_canvas.dispatchEvent(event);
            expect(button.state).to.equal(CM.ELEMENT_STATES.idle);
        });

        afterEach(function () {
            menu.destroy();
        });

    });

    describe("Listener tests", function () {
        beforeEach(function () {
            config = {
                canvas: dom_canvas
            };

            menu = new CM.Menu(config);
            button = menu.create('button', {
                x: 50,
                y: 50,
                width: 50,
                height: 50,
                text: "Test"
            });

            menu.init();
        });

        it("Mouse entered button", function() {
            var entered = false;
            button.on('mouseenter', function () {
                entered = true;
            });

            var event = new MouseEvent('mousemove', {
                clientX: 60,
                clientY: 60
            });
            dom_canvas.dispatchEvent(event);

            expect(entered).to.equal(true);
        });

        it("Mouse left button", function() {
            var left = false;
            button.on('mouseleave', function () {
                left = true;
            });

            var event = new MouseEvent('mousemove', {
                clientX: 60,
                clientY: 60
            });
            dom_canvas.dispatchEvent(event);

            event = new MouseEvent('mousemove', {
                clientX: 10,
                clientY: 10
            });
            dom_canvas.dispatchEvent(event);

            expect(left).to.equal(true);
        });

        it("Mouse moved through button", function() {
            var moved = false;
            button.on('mouseenter', function () {
                moved = true;
            });

            var event = new MouseEvent('mousemove', {
                clientX: 60,
                clientY: 60
            });
            dom_canvas.dispatchEvent(event);

            event = new MouseEvent('mousemove', {
                clientX: 70,
                clientY: 70
            });
            dom_canvas.dispatchEvent(event);

            expect(moved).to.equal(true);
        });

        it("Mouse down on button", function() {
            var downed = false;
            button.on('mousedown', function () {
                downed = true;
            });

            var event = new MouseEvent('mousemove', {
                clientX: 60,
                clientY: 60
            });
            dom_canvas.dispatchEvent(event);

            event = new MouseEvent('mousedown', {
                clientX: 70,
                clientY: 70
            });
            dom_canvas.dispatchEvent(event);

            expect(downed).to.equal(true);
        });

        it("Mouse up on button", function() {
            var upped = false;
            button.on('mouseup', function () {
                upped = true;
            });

            var event = new MouseEvent('mousemove', {
                clientX: 60,
                clientY: 60
            });
            dom_canvas.dispatchEvent(event);

            event = new MouseEvent('mousedown', {
                clientX: 70,
                clientY: 70
            });
            dom_canvas.dispatchEvent(event);

            event = new MouseEvent('mouseup', {
                clientX: 70,
                clientY: 70
            });
            dom_canvas.dispatchEvent(event);

            expect(upped).to.equal(true);
        });

        it("Mouse clicked on button", function() {
            var clicked = false;
            button.on('click', function () {
                clicked = true;
            });

            var event = new MouseEvent('mousemove', {
                clientX: 60,
                clientY: 60
            });
            dom_canvas.dispatchEvent(event);

            event = new MouseEvent('mousedown', {
                clientX: 70,
                clientY: 70
            });
            dom_canvas.dispatchEvent(event);

            event = new MouseEvent('mouseup', {
                clientX: 70,
                clientY: 70
            });
            dom_canvas.dispatchEvent(event);

            expect(clicked).to.equal(true);
        });

        it("Mouse clicked on button fails", function() {
            var clicked = false;
            button.on('click', function () {
                clicked = true;
            });

            var event = new MouseEvent('mousemove', {
                clientX: 60,
                clientY: 60
            });
            dom_canvas.dispatchEvent(event);

            event = new MouseEvent('mousedown', {
                clientX: 70,
                clientY: 70
            });
            dom_canvas.dispatchEvent(event);

            var event = new MouseEvent('mousemove', {
                clientX: 10,
                clientY: 10
            });
            dom_canvas.dispatchEvent(event);

            var event = new MouseEvent('mousemove', {
                clientX: 60,
                clientY: 60
            });
            dom_canvas.dispatchEvent(event);

            event = new MouseEvent('mouseup', {
                clientX: 70,
                clientY: 70
            });
            dom_canvas.dispatchEvent(event);

            expect(clicked).to.equal(false);
        });

        afterEach(function () {
            menu.destroy();
        });
    });

    describe("Rescaling tests", function () {
        beforeEach(function () {
            config = {
                canvas: dom_canvas
            };

            menu = new CM.Menu(config);
            button = menu.create('button', {
                x: 50,
                y: 50,
                width: 50,
                height: 50,
                text: "Test"
            });

            menu.init();
        });

        it("Manual rescale of both x and y", function () {
            menu.updateScale(2, 2);

            var event = new MouseEvent('mousemove', {
                clientX: 99,
                clientY: 99
            });
            dom_canvas.dispatchEvent(event);

            expect(button.state).to.equal(CM.ELEMENT_STATES.idle);

            event = new MouseEvent('mousemove', {
                clientX: 101,
                clientY: 101
            });
            dom_canvas.dispatchEvent(event);

            expect(button.state).to.equal(CM.ELEMENT_STATES.over);

            event = new MouseEvent('mousemove', {
                clientX: 199,
                clientY: 199
            });
            dom_canvas.dispatchEvent(event);

            expect(button.state).to.equal(CM.ELEMENT_STATES.over);

            event = new MouseEvent('mousemove', {
                clientX: 201,
                clientY: 201
            });
            dom_canvas.dispatchEvent(event);

            expect(button.state).to.equal(CM.ELEMENT_STATES.idle);
        });

        it("Manual rescale of x", function () {
            menu.updateScaleX(2);

            var event = new MouseEvent('mousemove', {
                clientX: 99,
                clientY: 49
            });
            dom_canvas.dispatchEvent(event);

            expect(button.state).to.equal(CM.ELEMENT_STATES.idle);

            event = new MouseEvent('mousemove', {
                clientX: 101,
                clientY: 51
            });
            dom_canvas.dispatchEvent(event);

            expect(button.state).to.equal(CM.ELEMENT_STATES.over);

            event = new MouseEvent('mousemove', {
                clientX: 199,
                clientY: 99
            });
            dom_canvas.dispatchEvent(event);

            expect(button.state).to.equal(CM.ELEMENT_STATES.over);

            event = new MouseEvent('mousemove', {
                clientX: 201,
                clientY: 101
            });
            dom_canvas.dispatchEvent(event);

            expect(button.state).to.equal(CM.ELEMENT_STATES.idle);
        });

        it("Manual rescale of y", function () {
            menu.updateScaleY(2);

            var event = new MouseEvent('mousemove', {
                clientX: 49,
                clientY: 99
            });
            dom_canvas.dispatchEvent(event);

            expect(button.state).to.equal(CM.ELEMENT_STATES.idle);

            event = new MouseEvent('mousemove', {
                clientX: 51,
                clientY: 101
            });
            dom_canvas.dispatchEvent(event);

            expect(button.state).to.equal(CM.ELEMENT_STATES.over);

            event = new MouseEvent('mousemove', {
                clientX: 99,
                clientY: 199
            });
            dom_canvas.dispatchEvent(event);

            expect(button.state).to.equal(CM.ELEMENT_STATES.over);

            event = new MouseEvent('mousemove', {
                clientX: 101,
                clientY: 201
            });
            dom_canvas.dispatchEvent(event);

            expect(button.state).to.equal(CM.ELEMENT_STATES.idle);
        });

        afterEach(function () {
            menu.destroy();
        });
    });

    describe("Autorescale tests", function () {

        beforeEach(function () {
            document.getElementById('canvas').appendChild(dom_canvas)
            config = {
                canvas: dom_canvas,
                autorescale: true
            };
            dom_canvas.style.transformOrigin = "0 0";
            dom_canvas.style.transform = "scale(2, 2)";
            menu = new CM.Menu(config);
            button = menu.create('button', {
                x: 50,
                y: 50,
                width: 50,
                height: 50,
                text: "Test"
            });

            menu.init();


        });

        it("Auto rescale of both x and y", function () {

            var event = new Event('resize');
            window.dispatchEvent(event);

            event = new MouseEvent('mousemove', {
                clientX: 99,
                clientY: 99
            });
            dom_canvas.dispatchEvent(event);

            expect(button.state).to.equal(CM.ELEMENT_STATES.idle);

            event = new MouseEvent('mousemove', {
                clientX: 102,
                clientY: 102
            });
            dom_canvas.dispatchEvent(event);

            expect(button.state).to.equal(CM.ELEMENT_STATES.over);

            event = new MouseEvent('mousemove', {
                clientX: 199,
                clientY: 199
            });
            dom_canvas.dispatchEvent(event);

            expect(button.state).to.equal(CM.ELEMENT_STATES.over);

            event = new MouseEvent('mousemove', {
                clientX: 201,
                clientY: 201
            });
            dom_canvas.dispatchEvent(event);

            expect(button.state).to.equal(CM.ELEMENT_STATES.idle);
        });

        it("Auto rescale of x", function () {
            dom_canvas.style.transform = "scale(2, 1)";
            var event = new Event('resize');
            window.dispatchEvent(event);

            event = new MouseEvent('mousemove', {
                clientX: 99,
                clientY: 49
            });
            dom_canvas.dispatchEvent(event);

            expect(button.state).to.equal(CM.ELEMENT_STATES.idle);

            event = new MouseEvent('mousemove', {
                clientX: 101,
                clientY: 51
            });
            dom_canvas.dispatchEvent(event);

            expect(button.state).to.equal(CM.ELEMENT_STATES.over);

            event = new MouseEvent('mousemove', {
                clientX: 199,
                clientY: 99
            });
            dom_canvas.dispatchEvent(event);

            expect(button.state).to.equal(CM.ELEMENT_STATES.over);

            event = new MouseEvent('mousemove', {
                clientX: 201,
                clientY: 101
            });
            dom_canvas.dispatchEvent(event);

            expect(button.state).to.equal(CM.ELEMENT_STATES.idle);
        });

        it("Auto rescale of y", function () {
            dom_canvas.style.transform = "scale(1, 2)";

            var event = new Event('resize');
            window.dispatchEvent(event);

            event = new MouseEvent('mousemove', {
                clientX: 49,
                clientY: 99
            });
            dom_canvas.dispatchEvent(event);

            expect(button.state).to.equal(CM.ELEMENT_STATES.idle);

            event = new MouseEvent('mousemove', {
                clientX: 51,
                clientY: 101
            });
            dom_canvas.dispatchEvent(event);

            expect(button.state).to.equal(CM.ELEMENT_STATES.over);

            event = new MouseEvent('mousemove', {
                clientX: 99,
                clientY: 199
            });
            dom_canvas.dispatchEvent(event);

            expect(button.state).to.equal(CM.ELEMENT_STATES.over);

            event = new MouseEvent('mousemove', {
                clientX: 101,
                clientY: 201
            });
            dom_canvas.dispatchEvent(event);

            expect(button.state).to.equal(CM.ELEMENT_STATES.idle);
        });

        afterEach(function () {
            menu.destroy();
            document.getElementById('canvas').removeChild(dom_canvas);
        });
    });

    describe("Canvas printing test", function () {
        beforeEach(function () {
            config = {
                canvas: dom_canvas,
                animation: function (context) {
                    context.fillStyle = "#ffffff";
                    context.fillRect(0, 0, 800, 600);
                }
            };

            menu = new CM.Menu(config);
            button = menu.create('button', {
                x: 50,
                y: 50,
                width: 50,
                height: 50,
                text: "Test",
                idle: {
                    color: '#FFFF00'
                }
            });

            menu.init();
        });

        it('Should draw the canvas with designated color', function() {
            var point = menu.ctx.getImageData(10, 10, 1, 1).data;
            var hex = "#" + rgbToHex(point);
            expect(hex).to.equal('#ffffff');
        });

        it('Button should be drawn with color for button', function() {
            var point = menu.ctx.getImageData(60, 60, 1, 1).data;
            var hex = "#" + rgbToHex(point);
            expect(hex).to.equal('#ffff00');
        });

        afterEach(function () {
            menu.destroy();
        });
    });
});


// based on: http://stackoverflow.com/questions/6735470/get-pixel-color-from-canvas-on-mouseover
function rgbToHex(point) {
    var red = point[0], green = point[1], blue = point[2];
    return ((red << 16) | (green << 8) | blue).toString(16);
}