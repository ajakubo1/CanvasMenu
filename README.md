# CanvasMenu
HTML menu for games and applications

## Usage

Right now, you can create the menu by constructor:

```javascript

var canvas = document.getElementById('canvas');
var width = 800; // px
var height = 600; // px
var myMenu = new Menu(canvas, width, height);

```

You have to start with that.

After that you can define buttons:

```javascript

var x = 20; // px
var y = 20; // px
var buttonWidth = 200; // px
var buttonHeight = 50; // px
var buttonText = "Test text"

var button = new Button(x, y, buttonWidth, buttonHegith, buttonText);

//And adding the button to previously created menu:

myMenu.appendButton(button);

```

In order to activate the menu, you have to initialise it:

```javascript

myMenu.init();

```

I've create it this way, so you can connect a couple of different menus (options menu, main menu).

## Installation

To use library in your project, you have to include canvasmenu.js in your html file
```
<script src="js/canvasmenu.js"></script>
```