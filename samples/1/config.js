
var canvas = document.getElementById('canvas'),
    width = 800, // px
    height = 600; // px


var myMenu = new CM.Menu({
    canvas: document.getElementById('canvas'),
    width: width,
    height: height
});

var x = 20, // px
    y = 20, // px
    buttonWidth = 200, // px
    buttonHeight = 50, // px
    buttonText = "Test text";

myMenu.create('button', {
    x: x,
    y: y,
    width: buttonWidth,
    height: buttonHeight,
    text: buttonText,
    on: [
        [
            "click", function (event) {
                alert("You've clicked me!");
            }
        ],
        [
            "mousedown", function (event) {
                console.info("Down!");
            }
        ],
        [
            "mousemove", function (event) {
                console.info("Moving!");
            }
        ],
        [
            "mouseenter", function (event) {
                console.info("Enter!");
            }
        ],
        [
            "mouseleave", function (event) {
                console.info("Leave!");
            }
        ],
    ]
});

myMenu.init();
