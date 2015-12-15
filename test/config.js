var width = 800,
	height = 600,
	buttonWidth = 300,
	buttonHeight = 50;




var squares = [];

var menuAnimation = function () {
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

var mainMenu = new Menu(document.getElementById('canvas'), width, height, menuAnimation);
var newGameMenu = new Menu(document.getElementById('canvas'), width, height);
var optionsMenu = new Menu(document.getElementById('canvas'), width, height);
var aboutMenu = new Menu(document.getElementById('canvas'), width, height);

var newGameMainMenuButton = new Button(width / 2 - buttonWidth / 2, 270, buttonWidth, buttonHeight, "New Game");
newGameMainMenuButton.clickHandler(newGameMenu);

var optionsMainMenuButton = new Button(width / 2 - buttonWidth / 2, 270 + buttonHeight + 20, buttonWidth, buttonHeight, "Options");
optionsMainMenuButton.clickHandler(optionsMenu);

var aboutMainMenuButton = new Button(width / 2 - buttonWidth / 2, 270 + 2 * (buttonHeight + 20), buttonWidth, buttonHeight, "About");
aboutMainMenuButton.clickHandler(aboutMenu);

mainMenu.appendButton(newGameMainMenuButton);
mainMenu.appendButton(optionsMainMenuButton);
mainMenu.appendButton(aboutMainMenuButton);

var backOptionsButton = new Button(10, height - 60, buttonHeight, buttonHeight, String.fromCharCode(parseInt("21DC", 16)));
backOptionsButton.clickHandler(mainMenu);
newGameMenu.appendButton(backOptionsButton);

var backNewGameButton = new Button(10, height - 60, buttonHeight, buttonHeight, String.fromCharCode(parseInt("21DC", 16)));
backNewGameButton.clickHandler(mainMenu);
optionsMenu.appendButton(backNewGameButton);

var backAboutButton = new Button(10, height - 60, buttonHeight, buttonHeight, String.fromCharCode(parseInt("21DC", 16)));
backAboutButton.clickHandler(mainMenu);
aboutMenu.appendButton(backAboutButton);

mainMenu.init();
