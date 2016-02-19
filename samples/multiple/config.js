
var canvas = document.getElementById('canvas'),
    width = 800, // px
    height = 600; // px

var menuConfig = {
    canvas: canvas,
    width: width,
    height: height
};

var mainMenu = new CM.Menu(menuConfig);

var buttonWidth = 200, // px
    buttonHeight = 50; // px

var multiple = mainMenu.create('multiple', {
    x: 50,
    y: 50,
    width: 500,
    height: 500,
    text: "Multiple",
    name: "multitest",
    template: {
        width: 250,
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
        }, {
            text: "Text five",
            name: "text5",
            value: true
        }, {
            text: "Text six",
            name: "text6",
            value: true
        }
    ]
});



/*
var switchElement2 = mainMenu.create('switch', {
    x: 200,
    y: 300,
    width: buttonWidth,
    height: buttonHeight,
    text: "Human",
    name: "human",
    align: "left",
    value: true,
    on: {
        'inner': "green"
    },
    off: {

    }
});

var switchElement3 = mainMenu.create('switch', {
    x: 200,
    y: 350,
    width: buttonWidth,
    height: buttonHeight,
    text: "Human",
    name: "human",
    align: "left",
    value: true,
    on: {
        fn: function (context) {
            var width = this.tick % 160 / 6;
            context.strokeStyle = "white";
            context.strokeWidth = width;

            if (this.align === "left") {
                x = this.width - this.height * 4 / 5;
            } else {
                x = this.height / 5;
            }
            context.strokeRect(x, this.height / 5, this.height * 3 / 5, this.height * 3 / 5);
            context.fillStyle = "green";
            context.fillRect(x + width + 1, this.height / 5 + width + 1, this.height * 3 / 5 - 2 * width - 2, this.height * 3 / 5 -  2 *width - 2);
        }
    },
    off: {
        fn: function (context) {
            var width = this.tick % 20;
            context.strokeStyle = "white";
            context.strokeWidth = width;

            if (this.align === "left") {
                x = this.width - this.height * 4 / 5;
            } else {
                x = this.height / 5;
            }
            context.strokeRect(x, this.height / 5, this.height * 3 / 5, this.height * 3 / 5);

        }
    }
});*/


mainMenu.init();
