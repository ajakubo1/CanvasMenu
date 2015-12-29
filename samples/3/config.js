
var canvas = document.getElementById('canvas'),
    width = 800, // px
    height = 600; // px


var menuConfig = {
    canvas: canvas,
    width: width,
    height: height
};

var mainMenu = new CM.Menu(menuConfig);

var buttonWidth = 400, // px
    buttonHeight = 50; // px

var newGameButton = mainMenu.create('button', {
    x: 200,
    y: 280,
    width: buttonWidth,
    height: buttonHeight,
    text: "New Game",
    idle: {
        color: '#FFFF00',
        font: '#111111'
    },
    over: {
        color: '#660033'
    },
    down: {
        color: '#FF0033',
        font: '#111111'
    },
    up: {
        color: '#330033'
    },
    font: (buttonHeight * 2 / 5 ) + 'pt Courier' //I want it smaller
});
var optionsButton = mainMenu.create('button', {
    x: 200,
    y: 280 + buttonHeight + 10,
    width: buttonWidth,
    height: buttonHeight,
    text: "Options",
    idle: {
        color: '#FFFF00',
        font: '#111111'
    },
    over: {
        color: '#660033'
    },
    down: {
        color: '#FF0033',
        font: '#111111'
    },
    up: {
        color: '#330033'
    },
    font: (buttonHeight * 2 / 5 ) + 'pt Courier' //I want it smaller
});
var exitButton = mainMenu.create('button', {
    x: 200,
    y: 280 + 2 * (buttonHeight + 10),
    width: buttonWidth,
    height: buttonHeight,
    text: "Exit",
    idle: {
        color: '#FFFF00',
        font: '#111111'
    },
    over: {
        color: '#660033'
    },
    down: {
        color: '#FF0033',
        font: '#111111'
    },
    up: {
        color: '#330033'
    },
    font: (buttonHeight * 2 / 5 ) + 'pt Courier' //I want it smaller
});

newGameButton.on('click', function () {
    alert("Your code should go here, not mine :)");
});
optionsButton.on('click', function () {
    alert("Let's not make it more complicated then it should be :)...");
});
exitButton.on('click', function () {
    alert("Exit where? It's a freakin' web page!");
});

mainMenu.init();