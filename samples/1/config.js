
var canvas = document.getElementById('canvas'),
    width = 800, // px
    height = 600; // px


var myMenu = new Menu({
    canvas: document.getElementById('canvas'),
    width: width,
    height: height
});

var x = 20, // px
    y = 20, // px
    buttonWidth = 200, // px
    buttonHeight = 50, // px
    buttonText = "Test text";

var button = new Button({
    x: x,
    y: y,
    width: buttonWidth,
    height: buttonHeight,
    text: buttonText
});

button.clickHandler(function () {
    alert("You've clicked me!");
});

//And adding the button to previously created menu:

myMenu.appendButton(button);

myMenu.init();