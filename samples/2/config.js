
var canvas = document.getElementById('canvas'),
    width = 800, // px
    height = 600; // px


var menuConfig = {
    canvas: canvas,
    width: width,
    height: height
};

var mainMenu = new CM.Menu(menuConfig),
    optionsMenu = new CM.Menu(menuConfig);

var buttonWidth = 400, // px
    buttonHeight = 50; // px

var newGameButton = mainMenu.create('button', {
    x: 200,
    y: 280,
    width: buttonWidth,
    height: buttonHeight,
    text: "New Game"
});
//That's what we'll be looping
var optionsButton = mainMenu.create('button', {
    x: 200,
    y: 280 + buttonHeight + 10,
    width: buttonWidth,
    height: buttonHeight,
    text: "Options"
});
var exitButton = mainMenu.create('button', {
    x: 200,
    y: 280 + 2 * (buttonHeight + 10),
    width: buttonWidth,
    height: buttonHeight,
    text: "Exit"
});

newGameButton.on('click', function () {
    alert("Your code should go here, not mine :)");
});
exitButton.on('click', function () {
    alert("Exit where? It's a freakin' web page!");
});
optionsButton.on('click', optionsMenu);

var infoButton = optionsMenu.create('button', {
    x: 200,
    y: 280,
    width: buttonWidth,
    height: buttonHeight,
    text: "Information"
});
var mainMenuButton = optionsMenu.create('button', {
    x: 200,
    y: 280 + 2 * (buttonHeight + 10),
    width: buttonWidth,
    height: buttonHeight,
    text: "<- Back"
});

infoButton.on('click', function () {
    alert("Right now I only serve simple buttons. So... Options are not as spectacular as I would want them to" +
        " be...\n" +
        "But! And it's a big but! I will be adding a couple of new button types, which should be good for:\n\n" +
        " - boolean configuration\n" +
        " - radio button/multiple choice button\n" +
        " - text field maybe?");
});
mainMenuButton.on('click', mainMenu);
mainMenu.init();