
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

var button = myMenu.createButton({
    x: x,
    y: y,
    width: buttonWidth,
    height: buttonHeight,
    text: buttonText
});

button.on('click', function (event) {
    alert("You've clicked me!");
});

button.on('mousedown', function (event) {
    console.info("Down!");
});

button.on('mousemove', function (event) {
    console.info("Moving!");
});

button.on('mouseenter', function (event) {
    console.info("Enter!");
});

button.on('mouseleave', function (event) {
    console.info("Leave!");
});

myMenu.init();