
var canvas = document.getElementById('canvas'),
    width = 800, // px
    height = 600; // px


var MenuAnimation = function () {
    //I want to devide the menu into 50px squares, so I need to know how many squares would fit horizontally
    // and vertically:
    var menuWidth = width / 50,
        menuHeight = height / 50,
        menuSize = menuWidth * menuHeight;

    //Did you know that Int8Array is more efficient than regular array? :)
    squares = new Int8Array(menuSize);

    function render() {
        var i, j;

        if(this.tickCount % 9 === 0) {//Every 9 frames (9 * 16ms) add new square (horizontal and vertical)
            for(i = 0; i < menuHeight; i += 1) {
                if(squares[i * menuWidth] === 0) {
                    squares[i * menuWidth] = 251;
                    //squares[menuSize - i * menuWidth] = 150;
                    break;
                } else {
                    for (j = 1; j < menuWidth; j += 1) {
                        if(squares[i * menuWidth + j] === 0) {
                            squares[i * menuWidth + j] = 251;
                            //squares[menuSize - i * menuWidth + j] = 150;
                            break;
                        }
                    }
                }
            }
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); //You have to call clear rect on your own
        for(i = 0; i < menuSize; i += 1) {
            if(squares[i] !== 0) {
                this.ctx.fillStyle = 'rgb(' + squares[i] + ', 0, 0)';
                this.ctx.fillRect(i % menuWidth * 50, Math.floor(i / menuWidth) * 50, 50, 50);
                squares[i] -= 1;
            }
        }
    }

    return render;
};

var menuConfig = {
    canvas: canvas,
    width: width,
    height: height,
    animation: new MenuAnimation()
};

var mainMenu = new CM.Menu(menuConfig);

var buttonWidth = 400, // px
    buttonHeight = 50; // px


/**
 * It will be a module :)
 *
 * @returns {redraw}
 * @constructor
 */
var RedrawInactiveButton = function () {
    //I want to devide the button field into 5px squares, so I need to know how many squares would fit horizontally
    // and vertically:
    var width = buttonWidth / 5,
        height = buttonHeight / 5;

    /**
     * Function used for drawing little canvas squares
     *
     * (it will be better if we draw those 5x5 squares during initiation, not during rendering phase)
     *
     * @param color
     * @returns {Element}
     */
    function drawSmallRect(color) {
        var canvas = document.createElement('canvas');
        canvas.width = 5;
        canvas.height = 5;
        var context = canvas.getContext('2d');

        context.fillStyle = color;
        context.fillRect(0, 0, this.width, this.height);

        return canvas;
    }

    //Array to store yellowish-dark colors
    var darkRect = [
        drawSmallRect('#939900'),
        drawSmallRect('#939900'),
        drawSmallRect('#939900'),
        drawSmallRect('#939900'),
        drawSmallRect('#c4cc00'),
        drawSmallRect('#474d00'),
        drawSmallRect('#2f3300'),
        drawSmallRect('#181a00'),
        drawSmallRect('#181a00'),
        drawSmallRect('#181a00'),
        drawSmallRect('#768000'),
        drawSmallRect('#FFCC33'),
        drawSmallRect('#FFCC66'),
        drawSmallRect('#FFCC99'),
        drawSmallRect('#000000'),
        drawSmallRect('#000000'),
        drawSmallRect('#000000'),
        drawSmallRect('#000000')
    ];

    //Array to store yellowish-light colors
    var rect = [
        drawSmallRect('#FFFF00'),
        drawSmallRect('#FFFF33'),
        drawSmallRect('#FFFF66'),
        drawSmallRect('#FFFF99'),
        drawSmallRect('#FFFFCC'),
        drawSmallRect('#FFCC00'),
        drawSmallRect('#FFCC33'),
        drawSmallRect('#FFCC66'),
        drawSmallRect('#FFCC99'),
        drawSmallRect('#FFCCCC')

    ];

    //Array of all squares which would fit into the button
    var squares = Array(width * height);

    /**
     * Function which is re-picking square colors from rect and darkRect
     */
    function pickNew() {
        var i;
        for(i = 0; i < width * height; i += 1) {
            if (i < width * 2) { //Let's pick darker set of colors for border squares
                squares[i] = darkRect[Math.floor(Math.random() * darkRect.length)]
            } else if (i > width * (height - 2)) { //Let's pick darker set of colors for border squares
                squares[i] = darkRect[Math.floor(Math.random() * darkRect.length)]
            } else if (i % width < 2) { //Let's pick darker set of colors for border squares
                squares[i] = darkRect[Math.floor(Math.random() * darkRect.length)]
            } else if (i % width > width - 3) { //Let's pick darker set of colors for border squares
                squares[i] = darkRect[Math.floor(Math.random() * darkRect.length)]
            } else { //If it's not in the border, re-pick color from the lighter set of rectangles
                squares[i] = rect[Math.floor(Math.random() * rect.length)]
            }

        }
    }
    pickNew();

    /**
     * This function will be responsible directly for rendering the button
     * @param ctx
     */
    function redraw(ctx) {
        var i;
        if (this.tick % 10 === 0) { //Every 10 ticks (so... every 10 * 16ms = 160 ms)
            pickNew(); //Let's pick new squares to draw
        }

        for(i = 0; i < width * height; i += 1) { //We also need to redraw the squares which were already drawn
            //Unfortunately, you have to do that, because i call ctx.clearRect before I call on this function :/...
            // So...
            ctx.drawImage(squares[i], i % width * 5, Math.floor(i / width) * 5);
        }
    }

    //And lets return only the redraw function
    return redraw;
};

var RedrawFocusedButton = function () {
    var width = buttonWidth / 5,
        height = buttonHeight / 5;

    function drawSmallRect(color) {
        var canvas = document.createElement('canvas');
        canvas.width = 5;
        canvas.height = 5;
        var context = canvas.getContext('2d');

        context.fillStyle = color;
        context.fillRect(0, 0, this.width, this.height);

        return canvas;
    }

    var darkRect = [
        drawSmallRect('#000000'),
        drawSmallRect('#1a000d'),
        drawSmallRect('#33001a'),
        drawSmallRect('#1a000d'),
        drawSmallRect('#33001a'),
        drawSmallRect('#4d0026'),
        drawSmallRect('#800040')
    ];

    var rect = [
        drawSmallRect('#ff1a8c'),
        drawSmallRect('#ff0080'),
        drawSmallRect('#e60073'),
        drawSmallRect('#cc0066'),
        drawSmallRect('#b30059'),
        drawSmallRect('#99004d'),
        drawSmallRect('#800040'),
        drawSmallRect('#660033'),
        drawSmallRect('#4d0026')

    ];

    var squares = Array(width * height);


    function pickNew() {
        var i;
        for(i = width; i < width * (height - 1) + 1; i += 1) {
            if (i < width * 2) {
                squares[i] = darkRect[Math.floor(Math.random() * darkRect.length)];
                squares[i - width] = squares[i];
            } else if (i > width * (height - 2)) {
                squares[i] = darkRect[Math.floor(Math.random() * darkRect.length)];
                squares[i + width] = squares[i];
            } else if (i % width < 2) {
                squares[i] = rect[Math.floor(Math.random() * rect.length)]
            } else if (i % width > width - 2) {
                squares[i] = rect[Math.floor(Math.random() * rect.length)]
            } else {
                squares[i] = rect[Math.floor(Math.random() * rect.length)]
            }

        }
    }
    pickNew();

    function redraw(ctx) {
        var i;
        if (this.tick % 7 === 0) {
            pickNew();
        }

        for(i = 0; i < width * height; i += 1) {
            ctx.drawImage(squares[i], i % width * 5, Math.floor(i / width) * 5);
        }
    }

    return redraw;
};


var newGameButton = mainMenu.create('button', {
    x: 200,
    y: 280,
    width: buttonWidth,
    height: buttonHeight,
    text: "New Game",
    idle: {
        font: '#111111',
        fn: new RedrawInactiveButton()
    },
    over: {
        fn: new RedrawFocusedButton()
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
        font: '#111111',
        fn: new RedrawInactiveButton()
    },
    over: {
        fn: new RedrawFocusedButton()
    },
    down: {
        color: '#FF0033',
        font: '#111111'
    },
    up: {
        color: '#330033'
    },
    font: (buttonHeight * 2 / 5 ) + 'pt Courier'
});
var exitButton = mainMenu.create('button', {
    x: 200,
    y: 280 + 2 * (buttonHeight + 10),
    width: buttonWidth,
    height: buttonHeight,
    text: "Exit",
    idle: {
        font: '#111111',
        fn: new RedrawInactiveButton()
    },
    over: {
        fn: new RedrawFocusedButton()
    },
    down: {
        color: '#FF0033',
        font: '#111111'
    },
    up: {
        color: '#330033'
    },
    font: (buttonHeight * 2 / 5 ) + 'pt Courier'
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
