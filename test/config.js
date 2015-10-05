var width = 800,
	height = 600,
	buttonWidth = 300,
	buttonHegith = 50;

var mainMenu = new Menu(document.getElementById('canvas'), width, height);
var newGameMenu = new Menu(document.getElementById('canvas'), width, height);
var optionsMenu = new Menu(document.getElementById('canvas'), width, height);
var aboutMenu = new Menu(document.getElementById('canvas'), width, height);

var newGameMainMenuButton = new Button(width / 2 - buttonWidth / 2, 300, buttonWidth, buttonHegith, "New Game");
newGameMainMenuButton.clickHandler(newGameMenu);

var optionsMainMenuButton = new Button(width / 2 - buttonWidth / 2, 300 + buttonHegith + 20, buttonWidth, buttonHegith, "Options");
optionsMainMenuButton.clickHandler(optionsMenu);

var aboutMainMenuButton = new Button(width / 2 - buttonWidth / 2, 300 + 2 * (buttonHegith + 20), buttonWidth, buttonHegith, "About");
aboutMainMenuButton.clickHandler(aboutMenu);

mainMenu.appendButton(newGameMainMenuButton);
mainMenu.appendButton(optionsMainMenuButton);
mainMenu.appendButton(aboutMainMenuButton);

var backOptionsButton = new Button(10, height - 60, buttonHegith, buttonHegith, String.fromCharCode(parseInt("21DC", 16)));
backOptionsButton.clickHandler(mainMenu);
newGameMenu.appendButton(backOptionsButton);

var backNewGameButton = new Button(10, height - 60, buttonHegith, buttonHegith, String.fromCharCode(parseInt("21DC", 16)));
backNewGameButton.clickHandler(mainMenu);
optionsMenu.appendButton(backNewGameButton);

var backAboutButton = new Button(10, height - 60, buttonHegith, buttonHegith, String.fromCharCode(parseInt("21DC", 16)));
backAboutButton.clickHandler(mainMenu);
aboutMenu.appendButton(backAboutButton);

mainMenu.init();