var width = 800,
	height = 600,
	buttonWidth = 300,
	buttonHegith = 50;

var menu = new Menu(document.getElementById('canvas'), width, height, false);

var button1 = new Button(width / 2 - buttonWidth / 2, 300, buttonWidth, buttonHegith, "Button 1");
var button2 = new Button(width / 2 - buttonWidth / 2, 300 + buttonHegith + 20, buttonWidth, buttonHegith, "Button 2");
var button3 = new Button(width / 2 - buttonWidth / 2, 300 + 2 * (buttonHegith + 20), buttonWidth, buttonHegith, "Button 3");



menu.appendButton(button1);
menu.appendButton(button2);
menu.appendButton(button3);

menu.init();