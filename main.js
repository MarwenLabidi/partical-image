function Particle(x, y, c, s) {
	this.x = x;
	this.y = y;
	this.vx = 0;
	this.vy = 0;

	this.s = s;
	this.c = c;

	this.sx = x;
	this.sy = y;

	this.time = Date.now();
}
Particle.prototype = {
	constructor: Particle,
	update: function () {
		this.x += this.vx;
		this.y += this.vy;

		this.vx = (this.sx - this.x) / 10;
		this.vy = (this.sy - this.y) / 10;

	},
	render: function (context) {
		context.beginPath();
		context.fillStyle = this.c;
		context.fillRect(this.x, this.y, this.s, this.s);
		context.closePath();
	}
};

var canvas = document.getElementById('canvas'),
	context = canvas.getContext('2d'),
	image = new Image(),
	particle_size = 4,
	height, width, arr = [];

image.crossOrigin = "Anonymous";
image.src = "./MarwenLabidi.jpg";
image.onload = init;

function init() {
	height = canvas.height = image.height;
	width = canvas.width = image.width;

	context.drawImage(image, 0, 0);
	var idata = context.getImageData(0, 0, width, height),
		data = idata.data;
	context.clearRect(0, 0, width, height);

	for (var y = 0; y < height; y += particle_size) {
		for (var x = 0; x < width; x += particle_size) {
			var o = x * 4 + y * 4 * idata.width;
			if (data[o + 3] > 210) {
				var c = 'rgba(' + data[o] + ',' + data[o + 1] + ',' + data[o + 2] + ',' + data[o + 3] + ')',
					p = new Particle(x, y, c, particle_size);
				p.x = Math.random() * width;
				p.y = Math.random() * height;
				arr.push(p);
			}
		}
	}

	canvas.onmousemove = force;

	update();
	render();
}

function force(e) {
	var x = e.clientX,
		y = e.clientY;
	for (var i = 0, l = arr.length; i < l; i++) {
		var dx = x - arr[i].x,
			dy = y - arr[i].y,
			d = Math.sqrt(dx * dx + dy * dy);
		if (d < 64) {
			var r = Math.atan2(dy, dx);
			arr[i].vx = -(d) * Math.cos(r);
			arr[i].vy = -(d) * Math.sin(r);
		}
	}
}

function update() {
	for (var i = 0, l = arr.length; i < l; i++) {
		arr[i].update();
	}
	setTimeout(update, 1000 / 30);
}

function render() {
	context.clearRect(0, 0, width, height);
	for (var i = 0, l = arr.length; i < l; i++) {
		arr[i].render(context);
	}
	requestAnimationFrame(render);
}