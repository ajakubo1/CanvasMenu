/**
 * Created by claim on 22.02.16.
 */

var expect = chai.expect;

describe("Multiple tests", function () {
    var menu,
        multiple,
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
                height: 300,
                text: "test",
                name: 'test',
                template: {
                    width: 220,
                    height: 40
                },
                elements: [
                    {
                        text: "Text one",
                        name: "text1",
                        value: true
                    }, {
                        text: "Text two",
                        name: "text2",
                        value: true
                    }, {
                        text: "Text three",
                        name: "text3",
                        value: true
                    }, {
                        text: "Text four",
                        name: "text4",
                        value: true
                    }
                ]
            };

            multiple = menu.create('multiple', config);
        });

        it('It Should create 4 elements', function () {
            expect(multiple.elements.length).to.equal(4);
        });

        it('Every element should have filled properties (width)', function () {
            expect(multiple.elements[0].width).to.equal(220);
            expect(multiple.elements[1].width).to.equal(220);
            expect(multiple.elements[2].width).to.equal(220);
            expect(multiple.elements[3].width).to.equal(220);
        });

        it('Every element should have filled properties (height)', function () {
            expect(multiple.elements[0].height).to.equal(40);
            expect(multiple.elements[1].height).to.equal(40);
            expect(multiple.elements[2].height).to.equal(40);
            expect(multiple.elements[3].height).to.equal(40);
        });

        it('Every element should have filled properties (x)', function () {
            expect(multiple.elements[0].x).to.equal(50 + 150 - 110);
            expect(multiple.elements[1].x).to.equal(50 + 150 - 110);
            expect(multiple.elements[2].x).to.equal(50 + 150 - 110);
            expect(multiple.elements[3].x).to.equal(50 + 150 - 110);
        });

        it('Every element should have filled properties (y)', function () {
            expect(multiple.elements[0].y).to.equal(50 + 100 - 5);
            expect(multiple.elements[1].y).to.equal(50 + 100 - 5 + 40 + 5);
            expect(multiple.elements[2].y).to.equal(50 + 100 - 5 + 2 * (40 + 5));
            expect(multiple.elements[3].y).to.equal(50 + 100 - 5 + 3 * (40 + 5));
        });

        it('Every element should have filled properties (value)', function () {
            expect(multiple.elements[0].value).to.equal(true);
            expect(multiple.elements[1].value).to.equal(true);
            expect(multiple.elements[2].value).to.equal(true);
            expect(multiple.elements[3].value).to.equal(true);
        });

        it('Every element should have filled properties (value)', function () {
            expect(multiple.elements[0].name).to.equal("text1");
            expect(multiple.elements[1].name).to.equal("text2");
            expect(multiple.elements[2].name).to.equal("text3");
            expect(multiple.elements[3].name).to.equal("text4");
        });

        it('Every element should have filled properties (value)', function () {
            expect(multiple.elements[0].text).to.equal("Text one");
            expect(multiple.elements[1].text).to.equal("Text two");
            expect(multiple.elements[2].text).to.equal("Text three");
            expect(multiple.elements[3].text).to.equal("Text four");
        });

        it('Should export data for 4 elements (object)', function () {
            var map = multiple.getFormattedValue();
            expect(map['test']['text1']).to.equal(true);
            expect(map['test']['text2']).to.equal(true);
            expect(map['test']['text3']).to.equal(true);
            expect(map['test']['text4']).to.equal(true);
        });

        it('Should export data for 4 elements (array)', function () {
            var map = multiple.getValue();
            expect(map['text1']).to.equal(true);
            expect(map['text2']).to.equal(true);
            expect(map['text3']).to.equal(true);
            expect(map['text4']).to.equal(true);
        });
    });

    describe('Layout tests', function () {
        beforeEach(function () {
            config = {
                x: 0,
                y: 0,
                width: 400,
                height: 300,
                text: "test",
                name: 'test',
                template: {
                    width: 200,
                    height: 50
                },
                elements: [
                    {
                        text: "",
                        name: "text1",
                        value: true
                    }, {
                        text: "",
                        name: "text2",
                        value: true
                    }, {
                        text: "",
                        name: "text3",
                        value: true
                    }, {
                        text: "",
                        name: "text4",
                        value: true
                    }
                ]
            };


        });

        it('Checking "left" layout', function () {
            config.layout = CM.LAYOUTS.left;
            multiple = menu.create('multiple', config);
            menu.init();
            var hex = "#" + TestHelper.rgbToHex(menu.ctx.getImageData(275, 120, 1, 1).data);
            expect(hex).to.equal('#ffffff');

            hex = "#" + TestHelper.rgbToHex(menu.ctx.getImageData(275, 120 + 55, 1, 1).data);
            expect(hex).to.equal('#ffffff');

            hex = "#" + TestHelper.rgbToHex(menu.ctx.getImageData(275, 120 + 2 * 55, 1, 1).data);
            expect(hex).to.equal('#ffffff');

            hex = "#" + TestHelper.rgbToHex(menu.ctx.getImageData(275, 120 + 3 * 55, 1, 1).data);
            expect(hex).to.equal('#ffffff');
        });

        it('Checking "right" layout', function () {
            config.layout = CM.LAYOUTS.right;
            multiple = menu.create('multiple', config);
            menu.init();
            var hex = "#" + TestHelper.rgbToHex(menu.ctx.getImageData(125, 120, 1, 1).data);
            expect(hex).to.equal('#ffffff');

            hex = "#" + TestHelper.rgbToHex(menu.ctx.getImageData(125, 120 + 55, 1, 1).data);
            expect(hex).to.equal('#ffffff');

            hex = "#" + TestHelper.rgbToHex(menu.ctx.getImageData(125, 120 + 2 * 55, 1, 1).data);
            expect(hex).to.equal('#ffffff');

            hex = "#" + TestHelper.rgbToHex(menu.ctx.getImageData(125, 120 + 3 * 55, 1, 1).data);
            expect(hex).to.equal('#ffffff');
        });

        it('Checking "double_right" layout', function () {
            config.layout = CM.LAYOUTS.double_right;
            multiple = menu.create('multiple', config);
            menu.init();
            var hex = "#" + TestHelper.rgbToHex(menu.ctx.getImageData(25, 120, 1, 1).data);
            expect(hex).to.equal('#ffffff');

            hex = "#" + TestHelper.rgbToHex(menu.ctx.getImageData(25, 120 + 55, 1, 1).data);
            expect(hex).to.equal('#ffffff');

            hex = "#" + TestHelper.rgbToHex(menu.ctx.getImageData(225, 120, 1, 1).data);
            expect(hex).to.equal('#ffffff');

            hex = "#" + TestHelper.rgbToHex(menu.ctx.getImageData(225, 120 + 55, 1, 1).data);
            expect(hex).to.equal('#ffffff');
        });

        it('Checking "double_left" layout', function () {
            config.layout = CM.LAYOUTS.double_left;
            multiple = menu.create('multiple', config);
            menu.init();
            var hex = "#" + TestHelper.rgbToHex(menu.ctx.getImageData(175, 120, 1, 1).data);
            expect(hex).to.equal('#ffffff');

            hex = "#" + TestHelper.rgbToHex(menu.ctx.getImageData(175, 120 + 55, 1, 1).data);
            expect(hex).to.equal('#ffffff');

            hex = "#" + TestHelper.rgbToHex(menu.ctx.getImageData(375, 120, 1, 1).data);
            expect(hex).to.equal('#ffffff');

            hex = "#" + TestHelper.rgbToHex(menu.ctx.getImageData(375, 120 + 55, 1, 1).data);
            expect(hex).to.equal('#ffffff');
        });

        it('Checking "double_outer" layout', function () {
            config.layout = CM.LAYOUTS.double_outer;
            multiple = menu.create('multiple', config);
            menu.init();
            var hex = "#" + TestHelper.rgbToHex(menu.ctx.getImageData(25, 120, 1, 1).data);
            expect(hex).to.equal('#ffffff');

            hex = "#" + TestHelper.rgbToHex(menu.ctx.getImageData(25, 120 + 55, 1, 1).data);
            expect(hex).to.equal('#ffffff');

            hex = "#" + TestHelper.rgbToHex(menu.ctx.getImageData(375, 120, 1, 1).data);
            expect(hex).to.equal('#ffffff');

            hex = "#" + TestHelper.rgbToHex(menu.ctx.getImageData(375, 120 + 55, 1, 1).data);
            expect(hex).to.equal('#ffffff');
        });

        it('Checking "double_outer" layout', function () {
            config.layout = CM.LAYOUTS.double_inner;
            multiple = menu.create('multiple', config);
            menu.init();
            var hex = "#" + TestHelper.rgbToHex(menu.ctx.getImageData(175, 120, 1, 1).data);
            expect(hex).to.equal('#ffffff');

            hex = "#" + TestHelper.rgbToHex(menu.ctx.getImageData(175, 120 + 55, 1, 1).data);
            expect(hex).to.equal('#ffffff');

            hex = "#" + TestHelper.rgbToHex(menu.ctx.getImageData(225, 120, 1, 1).data);
            expect(hex).to.equal('#ffffff');

            hex = "#" + TestHelper.rgbToHex(menu.ctx.getImageData(225, 120 + 55, 1, 1).data);
            expect(hex).to.equal('#ffffff');
        });
    });
});