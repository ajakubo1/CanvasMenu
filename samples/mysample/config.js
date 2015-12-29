
//Initial variables
var width = 800,
	height = 600,
	buttonWidth = 300,
	buttonHeight = 50;

//Animation of menu
var squares = [];
var menuAnimation = function () {   //There is something wrong with this function... But it works, just don't change
                                    // anything :D
    var i;

    if (this.tickCount % 5 === 0 && squares.length !== 8 * 6) {
        squares.push(10);
    } else if (this.tickCount % 5 === 0) {
        for (i = 0; i < squares.length ; i += 1) {
            if(squares[i] === -101) {
                squares[i] = 10;
                break;
            }
        }
    }

    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (i = 0; i < squares.length ; i += 1) {
        if(squares[i] > -100) {
            this.ctx.fillStyle = 'rgb(' + (100 + squares[i]) + ', 0, 0)';
            this.ctx.fillRect(i % 8 * 100, Math.floor(i / 8) * 100, 100, 100);
            squares[i] -= 2;
        }
    }

    if (squares.length === 8 * 6 && squares[squares.length - 1] === 8) {
        for (i = 0; i < squares.length ; i += 1) {
            if(squares[i] === -100) {
                squares[i] = -101;
            }
        }
    }

    if (squares.length === 8 * 6 && squares[squares.length - 1] === -100) {
        for (i = squares.length - 1; i >= 0 ; i -= 1) {
            if(squares[i] === -100) {
                squares[i] = -101;
            } else {
                break;
            }
        }
    }
};

//Init menus
var mainMenu = new CM.Menu({
    canvas: document.getElementById('canvas'),
    width: width,
    height: height,
    animation: menuAnimation
});
var newGameMenu = new CM.Menu({
    canvas: document.getElementById('canvas'),
    width: width,
    height: height
});
var optionsMenu = new CM.Menu({
    canvas: document.getElementById('canvas'),
    width: width,
    height: height
});
var aboutMenu = new CM.Menu({
    canvas: document.getElementById('canvas'),
    width: width,
    height: height
});

//Button redraw function
var redrawInactive = function (ctx) {
    ctx.fillStyle = "rgb(" + (200 - this.tick * 2) + ", 0, 0)";
    ctx.fillRect(0, 0, this.width, this.height);
};

//Button creation + click binding
var newGameMainMenuButton = mainMenu.create('button', {
    x: width / 2 - buttonWidth / 2,
    y: 270,
    width: buttonWidth,
    height: buttonHeight,
    text: "New Game",
    idle: {
        fn: redrawInactive
    }
});
newGameMainMenuButton.on('click', newGameMenu);

var optionsMainMenuButton = mainMenu.create('button', {
    x: width / 2 - buttonWidth / 2,
    y: 270 + buttonHeight + 20,
    width: buttonWidth,
    height: buttonHeight,
    text: "Options",
    idle: {
        color: "grey"
    },
    over: {
        color: "pink"
    },
    down: {
        color: "cyan"
    },
    up: {
        color: "crimson"
    }
});
optionsMainMenuButton.on('click', optionsMenu);

var aboutMainMenuButton = mainMenu.create('button', {
    x: width / 2 - buttonWidth / 2,
    y: 270 + 2 * (buttonHeight + 20),
    width: buttonWidth,
    height: buttonHeight,
    text: "About"});
aboutMainMenuButton.on('click', aboutMenu);

var backOptionsButton = newGameMenu.create('button', {
    x: 10,
    y: height - 60,
    width: buttonHeight,
    height: buttonHeight,
    text: String.fromCharCode(parseInt("21DC", 16))
});
backOptionsButton.on('click', mainMenu);

var backNewGameButton = optionsMenu.create('button', {
    x: 10,
    y: height - 60,
    width: buttonHeight,
    height: buttonHeight,
    text: String.fromCharCode(parseInt("21DC", 16))
});
backNewGameButton.on('click', mainMenu);

var backAboutButton = aboutMenu.create('button', {
    x: 10,
    y: height - 60,
    width: buttonHeight,
    height: buttonHeight,
    text: String.fromCharCode(parseInt("21DC", 16))
});
backAboutButton.on('click', mainMenu);

//Init first menu
mainMenu.init();
