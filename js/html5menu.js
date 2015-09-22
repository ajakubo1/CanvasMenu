
function Menu(canvas, isAnimated) {
	this.buttons = new Array(),
	this.canvas = canvas,
	this.isAnimated = isAnimated,
	this.ctx = canvas.getContext('2d');
	
	this.listener_mousedown = function (event) {
		console.info('listener_mousedown!', event);
	}
	
	this.listener_mousemove = function (event) {
		/*var i, x = 0, y = 0;
		console.info(this.buttons);
		for (i = 0; i < this.buttons.length; i += 1) {
			if (this.buttons[i].inRange(x, y)) {
				this.redrawMenu();
				break;
			}
		}*/
	}
	
	this.redrawMenu = function () {
		var i;
		this.ctx.clearRect(0, 0, canvas.width, canvas.height);
		for (i = 0; i < this.buttons.length; i += 1) {
			this.ctx.drawImage(this.buttons[i].getCanvas(), this.buttons[i].getX(), this.buttons[i].getY());
		}
	}
	
	this.listener_mouseup = function (event) {
		console.info('listener_mouseup!', event);
		console.info(this);
		this.redrawMenu();
	}
}

Menu.prototype.init = function () {
	console.info(this.buttons);
	this.canvas.addEventListener('mouseup', this.listener_mouseup);
	this.canvas.addEventListener('mousedown', this.listener_mousedown);
	this.canvas.addEventListener('mousemove', this.listener_mousemove);
	
	this.redrawMenu();
	console.info(this.buttons);
}

Menu.prototype.appendButton = function (button) {
	this.buttons.push(button);
}

var BUTTON_ENUM = {
	"inactive": 0,
	"focused": 1,
	"down": 2,
	"up": 3
}

function Button(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.x_limit = this.x + this.width;
	this.y_limit = this.y + this.height;
	this.status = BUTTON_ENUM.inactive;
	this.canvas = document.createElement('canvas');
	this.canvas.width = width;
	this.canvas.height = height;
	this.ctx = this.canvas.getContext('2d');
}

Button.prototype.inRange = function (x, y) {
	if (x >= this.x && x <= this.x_limit && y >= this.y && y <= this.y_limit) {
		return true;
	}
	return false;
}

Button.prototype.getCanvas = function () {
	this.ctx.clearRect(0, 0, this.width, this.height);
	this.ctx.fillStyle = "green";
	this.ctx.fillRect(0, 0, this.width, this.height);
	
	return this.canvas;
}

Button.prototype.getX = function () {
	return this.x;
}

Button.prototype.getY = function () {
	return this.y;
}