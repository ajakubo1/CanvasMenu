# CanvasMenu
HTML menu for games and applications


## Installation

To use library in your project, you have to include canvasmenu.js in your html file
```
<script src="js/canvasmenu.js"></script>
```

## Usage

*Code sample in samples/1 folder.*

*Demo for this example: http://trash.thedimgames.com/CanvasMenu/samples/1/*

Right now, you can create the menu by constructor:

```javascript

var canvas = document.getElementById('canvas'),
    width = 800, // px
    height = 600; // px


var myMenu = new Menu({
    canvas: document.getElementById('canvas'),
    width: width,
    height: height
});

```

You have to start with that.

After that you can define buttons:

```javascript

var x = 20, // px
    y = 20, // px
    buttonWidth = 200, // px
    buttonHeight = 50, // px
    buttonText = "Test text";

var button = new Button({
    x: x,
    y: y,
    width: buttonWidth,
    height: buttonHeight,
    text: buttonText
});
```

Let's define some click handlers:

```javascript
button.clickHandler(function () {
    alert("You've clicked me!");
});

```

And append button to the main menu:

```javascript
myMenu.appendButton(button);

```

In order to activate the menu, you have to initialise it:

```javascript

myMenu.init();

```

I've created it this way, so you can connect a couple of different menus (options menu, main menu).

## Advanced usage

*Demo for all samples currently present: http://trash.thedimgames.com/CanvasMenu/samples/)*