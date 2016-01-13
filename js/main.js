var baseURL = window.location.href.substring(0, window.location.href.length-10);
var canvas = document.getElementById("board");
var context = canvas.getContext("2d");
var colors = ["black", "red"];
var points = [];
var selectedPoints = [];
var mouseHeld = false;
var controlHeld = false;
var dragPoint = false;
var startPoint = {x: 0, y: 0, color: 0};

function uploadStore() {
	var data = "";
	for(var i=0; i<points.length; i++) data += points[i].x + " " + points[i].y + " " + points[i].color + "\n";
	$.post(baseURL+"upload.php", {"RAW_DATA": data});
}

function fetchStore() {
	$.get(baseURL+"fetch.php", function(data) {
		points = [];
		selectedPoints = [];
		mouseHeld = false;
		controlHeld = false;
		dragPoint = false;
		startPoint = {x: 0, y: 0, color: 0};
		var rawData = data.split("\n");
		for(var i=0; i<rawData.length; i++) {
			var pointArray = rawData[i].split(" ");
			var point = {x: parseFloat(pointArray[0]), y: parseFloat(pointArray[1]), color: parseInt(pointArray[2])};
			points.push(point);
		}
		clearAndDraw();
	});
}

function checkKeyPressed(event) {
	if(event.keyCode == 67 || event.keyCode == 82) {
		clearBoard();
	} else if(event.keyCode == 27 || event.keyCode == 69) {
		selectedPoints = [];
		clearAndDraw();
	} else if(event.keyCode == 17 || event.keyCode == 91 || event.keyCode == 224) {
		controlHeld = true;
	} else if(event.keyCode == 37) { //left
		for(var i=0; i<selectedPoints.length; i++) {
			points[points.indexOf(selectedPoints[i])].x -= 1;
			selectedPoints[i].x -= 1;
		}
		clearAndDraw();
		for(i=0; i<selectedPoints.length; i++) drawPoint(selectedPoints[i].x, selectedPoints[i].y, colors[1]);
	} else if(event.keyCode == 38) { //up
		for(var i=0; i<selectedPoints.length; i++) {
			points[points.indexOf(selectedPoints[i])].y -= 1;
			selectedPoints[i].y -= 1;
		}
		clearAndDraw();
		for(i=0; i<selectedPoints.length; i++) drawPoint(selectedPoints[i].x, selectedPoints[i].y, colors[1]);
	} else if(event.keyCode == 39) { //right
		for(var i=0; i<selectedPoints.length; i++) {
			points[points.indexOf(selectedPoints[i])].x += 1;
			selectedPoints[i].x += 1;
		}
		clearAndDraw();
		for(i=0; i<selectedPoints.length; i++) drawPoint(selectedPoints[i].x, selectedPoints[i].y, colors[1]);
	} else if(event.keyCode == 40) { //down
		for(var i=0; i<selectedPoints.length; i++) {
			points[points.indexOf(selectedPoints[i])].y += 1;
			selectedPoints[i].y += 1;
		}
		clearAndDraw();
		for(i=0; i<selectedPoints.length; i++) drawPoint(selectedPoints[i].x, selectedPoints[i].y, colors[1]);
	}
}

function inBetween(point, startPoint, endPoint) {
	startX = Math.min(startPoint.x, endPoint.x);
	startY = Math.min(startPoint.y, endPoint.y);
	endX = Math.max(startPoint.x, endPoint.x);
	endY = Math.max(startPoint.y, endPoint.y);
	return(startX <= point.x && point.x <= endX && startY <= point.y && point.y <= endY);
}

function distanceBetween(startPoint, endPoint) {
	return(Math.sqrt(Math.pow(startPoint.x-endPoint.x, 2) + Math.pow(startPoint.y-endPoint.y, 2)));
}

function drawPoint(x, y, color) {
	context.beginPath();
	context.fillStyle = color;
	context.arc(x, y, 20, 0, 2*Math.PI);
	context.fill();
}

function clearBoard() {
	points = [];
	selectedPoints = [];
	mouseHeld = false;
	controlHeld = false;
	dragPoint = false;
	startPoint = {x: 0, y: 0, color: 0};
	context.clearRect(0, 0, canvas.width, canvas.height);
}

function clearAndDraw() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	for(var i=0; i<points.length; i++) {
		drawPoint(points[i].x, points[i].y, colors[points[i].color]);
	}
}

function clearAndChange(endPoint) {
	context.clearRect(0, 0, canvas.width, canvas.height);
	for(var i=0; i<points.length; i++) {
		context.beginPath();
		if(inBetween(points[i], startPoint, endPoint)) context.fillStyle = colors[1];
		else context.fillStyle = colors[0];
		context.arc(points[i].x, points[i].y, 20, 0, 2*Math.PI);
		context.fill();
	}
	for(i=0; i<selectedPoints.length; i++) drawPoint(selectedPoints[i].x, selectedPoints[i].y, colors[1]);
}

function clearAndSelect(endPoint) {
	context.clearRect(0, 0, canvas.width, canvas.height);
	for(var i=0; i<points.length; i++) {
		context.beginPath();
		if(inBetween(points[i], startPoint, endPoint)) {
			context.fillStyle = colors[1];
			selectedPoints.push(points[i]);
		} else {
			context.fillStyle = colors[0];
		}
		context.arc(points[i].x, points[i].y, 20, 0, 2*Math.PI);
		context.fill();
	}
	for(i=0; i<selectedPoints.length; i++) drawPoint(selectedPoints[i].x, selectedPoints[i].y, colors[1]);
}

function getPosition(canvas, event) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top,
		color: 0,
	};
}

canvas.addEventListener(
	'mousedown',
	function(event) {
		startPoint = getPosition(canvas, event);
		closestPoint = startPoint;
		smallestDistance = 12;
		for(var i=0; i<points.length; i++) {
			distance = distanceBetween(points[i], startPoint);
			if(distance < smallestDistance) {
				smallestDistance = distance;
				closestPoint = points[i];
			}
		}
		if(smallestDistance < 12) {
			selectedPoints = [closestPoint];
			clearAndDraw();
			drawPoint(closestPoint.x, closestPoint.y, colors[1]);
			dragPoint = true;
		} else if(!controlHeld) {
			selectedPoints = [];
			clearAndDraw();
		}
		mouseHeld = true;
	},
	false
);

canvas.addEventListener(
	'mousemove',
	function(event) {
		if(mouseHeld) {
			var position = getPosition(canvas, event);
			if(dragPoint) {
				position.color = 1;
				points[points.indexOf(selectedPoints[0])] = position;
				selectedPoints[0] = position;
				clearAndDraw();
			} else if(position.x != startPoint.x || position.y != startPoint.y) {
				clearAndChange(position);
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
		mouseHeld = false;
		var position = getPosition(canvas, event);
		if(dragPoint) {
			clearAndDraw();
			drawPoint(position.x, position.y, colors[1]);
			points[points.indexOf(selectedPoints[0])] = position;
			selectedPoints[0] = position;
			dragPoint = false;
		} else if(position.x == startPoint.x && position.y == startPoint.y) {
			points.push(startPoint);
			selectedPoints = [startPoint];
			drawPoint(startPoint.x, startPoint.y, colors[1]);
		} else {
			clearAndSelect(position);
		}
	},
	false
);