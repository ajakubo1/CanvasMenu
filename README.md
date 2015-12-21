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

Ok, let's get stareted with more advanced things you can do with my library.

*Demo for all samples currently present: http://trash.thedimgames.com/CanvasMenu/samples/)*


### Creating two menus looped together

*Code sample in samples/2 folder.*

*Demo for this example: http://trash.thedimgames.com/CanvasMenu/samples/2/*

At first we need to define those menus and setup the whole environment:

```javascript
var canvas = document.getElementById('canvas'),
    width = 800, // px
    height = 600; // px


var menuConfig = {
    canvas: canvas,
    width: width,
    height: height
};

var mainMenu = new Menu(menuConfig),
    optionsMenu = new Menu(menuConfig);

var buttonWidth = 400, // px
    buttonHeight = 50; // px

```

Define buttons used in ``mainMenu``:

```javascript

var newGameButton = new Button({
    x: 200,
    y: 280,
    width: buttonWidth,
    height: buttonHeight,
    text: "New Game"
});
//That's what we'll be looping
var optionsButton = new Button({
    x: 200,
    y: 280 + buttonHeight + 10,
    width: buttonWidth,
    height: buttonHeight,
    text: "Options"
});
var exitButton = new Button({
    x: 200,
    y: 280 + 2 * (buttonHeight + 10),
    width: buttonWidth,
    height: buttonHeight,
    text: "Exit"
});

```

Define buttons used in ``optionsMenu``:

```javascript

var infoButton = new Button({
    x: 200,
    y: 280,
    width: buttonWidth,
    height: buttonHeight,
    text: "Information"
});
var mainMenuButton = new Button({
    x: 200,
    y: 280 + 2 * (buttonHeight + 10),
    width: buttonWidth,
    height: buttonHeight,
    text: "<- Back"
});

```

Now it's time to make the loop:

```javascript

optionsButton.clickHandler(optionsMenu);
mainMenuButton.clickHandler(mainMenu);

```

As you may have noticed, instead of defining a function, you can put a ``Menu`` object into the ``clickHandler``. 
Don't worry about it. My code will deal with it :).

At the end we have to add previously defined buttons into the menus and init the ``mainMenu`` object:

```javascript
mainMenu.appendButton(newGameButton);
mainMenu.appendButton(optionsButton);
mainMenu.appendButton(exitButton);

optionsMenu.appendButton(infoButton);
optionsMenu.appendButton(mainMenuButton);

mainMenu.init();
```

So basically, when you're in ``mainMenu``, by clicking ``optionsButton`` you activate the ``optionsMenu`` (All of the 
animations for ``mainMenu`` are then suspended). When you're in ``optionsMenu`` and click '<- Back' button, you 
activate the ``mainMenu``.

You can loop more menus like that!


### Customize buttons

*Code sample in samples/3 folder.*

*Demo for this example: http://trash.thedimgames.com/CanvasMenu/samples/3/*

I will be customizing buttons for the code defined in the last example (only for the ``mainMenu``).

First of all, I don't really like the default color sets. They are nasty as hell! To start changing them I need to 
explain a 
couple of things.

There are 4 states in which buttons can be:

* inactive - when the button is just visible. Mouse is not over the button and it has not been clicked
* focused - when button has mouse over it
* down - when button is pressed (mousedown event)
* up - when pressing the button ended (mouseup event).

By default, CanvasMenu sets default colors for those states as 'green', 'blue', 'red', 'orange'. To change that you 
need to re-write ``Button`` constructors. Additional parameters you're looking for during constructor call are:

```javascript

{
    redrawInactiveColor: 'green',
    redrawFocusedColor: 'blue',
    redrawDownColor: 'red',
    redrawUpColor: 'orange'
}

```

Next thing: by default font color for those buttons are set as white. But sometimes it is not looking very good (I 
don't know, maybe you like yellow-ish buttons?). In that case I've added a possibility to change font color for each 
of those states (FYI: default is 'white'):

```javascript

{
    redrawInactiveFont: 'white',
    redrawFocusedFont: 'white',
    redrawDownFont: 'white',
    redrawUpFont: 'white'
}

```

And last thing. By default, the font which is set in canvas context is counted as follows:

```javascript

(this.height * 3 / 5 ) + 'pt Arial'
```

This ensures that font is adjusted to button height and... Well... It sets 'Arial' as default font. If you want to 
change that, you can edit the following configuration variable:

```javascript

{
    font: (this.height * 3 / 5 ) + 'pt Arial'
}

```

Now if we know all of that, let's re-define buttons:

```javascript

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


```

And we're done! Buttons look much better now. Sort of. Ah, hell, you're a better artist then me, I just write the 
freakin' code :p. You do it!


### Button Animations


### Menu Animations

