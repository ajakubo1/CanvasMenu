var width = 800,
	height = 600,
	buttonWidth = 300,
	buttonHegith = 50;

var mainMenu = new Menu(document.getElementById('canvas'), width, height);
var optionsMenu = new Menu(document.getElementById('canvas'), width, height);

var button1 = new Button(width / 2 - buttonWidth / 2, 300, buttonWidth, buttonHegith, "Button 1");
button1.clickHandler(optionsMenu);

var button2 = new Button(width / 2 - buttonWidth / 2, 300 + buttonHegith + 20, buttonWidth, buttonHegith, "Button 2");
var button3 = new Button(width / 2 - buttonWidth / 2, 300 + 2 * (buttonHegith + 20), buttonWidth, buttonHegith, "Button 3");

var button4 = new Button(width / 2 - buttonWidth / 2, 300, buttonWidth, buttonHegith, "Button 4");
button4.clickHandler(mainMenu);

mainMenu.appendButton(button1);
mainMenu.appendButton(button2);
mainMenu.appendButton(button3);

optionsMenu.appendButton(button4);

mainMenu.init();