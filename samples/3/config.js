
var canvas = document.getElementById('canvas'),
    width = 800, // px
    height = 600; // px


var menuConfig = {
    canvas: canvas,
    width: width,
    height: height
};

var mainMenu = new Menu(menuConfig);

var buttonWidth = 400, // px
    buttonHeight = 50; // px

var newGameButton = new Button({
    x: 200,
    y: 280,
    width: buttonWidth,
    height: buttonHeight,
    text: "New Game",
    redrawInactiveColor: '#FFFF00',
    redrawFocusedColor: '#660033',
    redrawDownColor: '#FF0033',
    redrawUpColor: '#330033',
    redrawInactiveFont: '#111111',
    redrawDownFont: '#111111',
    font: (buttonHeight * 2 / 5 ) + 'pt Courier' //I want it smaller
});
var optionsButton = new Button({
    x: 200,
    y: 280 + buttonHeight + 10,
    width: buttonWidth,
    height: buttonHeight,
    text: "Options",
    redrawInactiveColor: '#FFFF00',
    redrawFocusedColor: '#660033',
    redrawDownColor: '#FF0033',
    redrawUpColor: '#330033',
    redrawInactiveFont: '#111111',
    redrawDownFont: '#111111',
    font: (buttonHeight * 2 / 5 ) + 'pt Courier'
});
var exitButton = new Button({
    x: 200,
    y: 280 + 2 * (buttonHeight + 10),
    width: buttonWidth,
    height: buttonHeight,
    text: "Exit",
    redrawInactiveColor: '#FFFF00',
    redrawFocusedColor: '#660033',
    redrawDownColor: '#FF0033',
    redrawUpColor: '#330033',
    redrawInactiveFont: '#111111',
    redrawDownFont: '#111111',
    font: (buttonHeight * 2 / 5 ) + 'pt Courier'
});

newGameButton.clickHandler(function () {
    alert("Your code should go here, not mine :)");
});
optionsButton.clickHandler(function () {
    alert("Let's not make it more complicated then it should be :)...");
});
exitButton.clickHandler(function () {
    alert("Exit where? It's a freakin' web page!");
});


mainMenu.appendButton(newGameButton);
mainMenu.appendButton(optionsButton);
mainMenu.appendButton(exitButton);


mainMenu.init();