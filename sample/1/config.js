var canvas = document.getElementById('canvas');
var width = 800; // px
var height = 600; // px
var myMenu = new Menu(canvas, width, height);

var x = 20; // px
var y = 20; // px
var buttonWidth = 200; // px
var buttonHeight = 50; // px
var buttonText = "Test text";

var button = new Button({
    x: x,
    y: y,
    width: buttonWidth,
    height: buttonHeight,
    text: buttonText
});

//And adding the button to previously created menu:

myMenu.appendButton(button);

myMenu.init();