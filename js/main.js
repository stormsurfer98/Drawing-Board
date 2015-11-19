var canvas = document.getElementById("board");
var context = canvas.getContext("2d");
var colors = ["black", "red", "blue"];
var mouseHold = false;
var startPoint = {x: 0, y: 0, color: 0};
var points = [];

function inBetween(point, startPoint, endPoint) {
	startX = Math.min(startPoint.x, endPoint.x);
	startY = Math.min(startPoint.y, endPoint.y);
	endX = Math.max(startPoint.x, endPoint.x);
	endY = Math.max(startPoint.y, endPoint.y);
	return(startX <= point.x && point.x <= endX && startY <= point.y && point.y <= endY);
}

function clearBoard() {
	if(event.keyCode == 82) {
		points = [];
		context.clearRect(0, 0, canvas.width, canvas.height);
	}
}

function clearAndReplace(endPoint) {
	context.clearRect(0, 0, canvas.width, canvas.height);
	for(var i=0; i<points.length; i++) {
		context.beginPath();
		if(inBetween(points[i], startPoint, endPoint)) context.fillStyle = colors[(points[i].color+1)%3];
		else context.fillStyle = colors[points[i].color%3];
		context.arc(points[i].x, points[i].y, 20, 0, 2*Math.PI);
		context.fill();
	}
}

function clearAndChange(endPoint) {
	context.clearRect(0, 0, canvas.width, canvas.height);
	for(var i=0; i<points.length; i++) {
		if(inBetween(points[i], startPoint, endPoint)) points[i].color += 1;
		context.beginPath();
		context.fillStyle = colors[points[i].color%3];
		context.arc(points[i].x, points[i].y, 20, 0, 2*Math.PI);
		context.fill();
	}
}

function getPosition(canvas, event) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top,
		color: 0
	};
}

canvas.addEventListener(
	'mousedown',
	function(event) {
		startPoint = getPosition(canvas, event);
		mouseHold = true;
	},
	false
);

canvas.addEventListener(
	'mousemove',
	function(event) {
		if(mouseHold) {
			var position = getPosition(canvas, event);
			if(position.x != startPoint.x || position.y != startPoint.y) {
				clearAndReplace(position);
				context.beginPath();
				context.rect(startPoint.x, startPoint.y, position.x-startPoint.x, position.y-startPoint.y);
				context.stroke();
			}
		}
	},
	false
);

canvas.addEventListener(
	'mouseup',
	function(event) {
		mouseHold = false;
		var position = getPosition(canvas, event);
		if(position.x == startPoint.x && position.y == startPoint.y) {
			context.beginPath();
			context.fillStyle = "black";
			context.arc(position.x, position.y, 20, 0, 2*Math.PI);
			context.fill();
			points.push(position);
		} else {
			clearAndChange(position);
		}
	},
	false
);