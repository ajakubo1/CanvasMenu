
var canvas = document.getElementById('canvas'),
    width = 800, // px
    height = 600; // px

var menuConfig = {
    canvas: canvas,
    width: width,
    height: height,
    animation: function () {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
};

var mainMenu = new CM.Menu(menuConfig);

var buttonWidth = 200, // px
    buttonHeight = 50; // px


var switchElement = mainMenu.create('switch', {
    x: 200,
    y: 250,
    width: buttonWidth,
    height: buttonHeight,
    text: "Human",
    name: "human",
    align: "right",
    on: {
        'inner': "green"
    },
    off: {

    }
});


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
});


mainMenu.init();
