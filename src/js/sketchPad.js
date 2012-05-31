function SketchPad( canvasID, brushImage ) {
	this.renderFunction = (brushImage == null || brushImage == undefined) ? this.updateCanvasByLine : this.updateCanvasByBrush;
	this.brush = brushImage;
	this.touchSupported = ('ontouchstart' in window); 
	this.canvasID = canvasID;
	this.canvas = $("#"+canvasID);
	this.context = this.canvas.get(0).getContext("2d");	
	this.context.strokeStyle = "#000000";
  //  this.context.globalCompositeOperation = 'destination-out';
	this.context.lineWidth = 10;
	this.lastMousePoint = {x:0, y:0};
    
	if (this.touchSupported) {
		this.mouseDownEvent = "touchstart";
		this.mouseMoveEvent = "touchmove";
		this.mouseUpEvent = "touchend";
	}
	else {
		this.mouseDownEvent = "mousedown";
		this.mouseMoveEvent = "mousemove";
		this.mouseUpEvent = "mouseup";
	}
	
	this.canvas.bind( this.mouseDownEvent, this.onCanvasMouseDown() );
}

SketchPad.prototype.onCanvasMouseDown = function () {
	var self = this;
	return function(event) {
		self.mouseMoveHandler = self.onCanvasMouseMove()
		self.mouseUpHandler = self.onCanvasMouseUp()

		$(document).bind( self.mouseMoveEvent, self.mouseMoveHandler );
		$(document).bind( self.mouseUpEvent, self.mouseUpHandler );
		
		self.updateMousePosition( event );
		self.renderFunction( event );
	}
}

SketchPad.prototype.onCanvasMouseMove = function () {
	var self = this;
	return function(event) {

		self.renderFunction( event );
     	event.preventDefault();
    	return false;
	}
}
SketchPad.prototype.onCanvasMouseUp = function (event) {
	var self = this;
	return function(event) {

		$(document).unbind( self.mouseMoveEvent, self.mouseMoveHandler );
		$(document).unbind( self.mouseUpEvent, self.mouseUpHandler );
		
		self.mouseMoveHandler = null;
		self.mouseUpHandler = null;
	}
}

SketchPad.prototype.updateMousePosition = function (event) {
 	var target;
	if (this.touchSupported) {
		target = event.originalEvent.touches[0]
	}
	else {
		target = event;
	}

	var offset = this.canvas.offset();
	this.lastMousePoint.x = target.pageX - offset.left;
	this.lastMousePoint.y = target.pageY - offset.top;

}

SketchPad.prototype.updateCanvasByLine = function (event) {

	this.context.beginPath();
	this.context.moveTo( this.lastMousePoint.x, this.lastMousePoint.y );
	this.updateMousePosition( event );
	this.context.lineTo( this.lastMousePoint.x, this.lastMousePoint.y );
	this.context.stroke();
}

SketchPad.prototype.updateCanvasByBrush = function (event) {
	var start = { x:this.lastMousePoint.x, y: this.lastMousePoint.y };
	this.updateMousePosition( event );
	var end = { x:this.lastMousePoint.x, y: this.lastMousePoint.y };
	this.drawLine( start, end );
}

SketchPad.prototype.drawLine = function (start, end){
	var halfBrushW = this.brush.width/2;
	var halfBrushH = this.brush.height/2;
    var dx = end.x - start.x;
    var dy = end.y - start.y;
	var distance = parseInt( Math.sqrt(dx*dx + dy*dy) );
	if ( distance > 0 ){
		var x,y;
		var sin_a = ( end.y - start.y ) / distance;
		var cos_a = ( end.x - start.x ) / distance;
        
		for ( var z=0; z <= distance; z++ ){
			x = start.x + ( cos_a * z ) - halfBrushW;
			y = start.y + ( sin_a * z ) - halfBrushH;
			this.context.drawImage(this.brush, x, y);
		}
	}
}

SketchPad.prototype.toString = function () {

	var dataString = this.canvas.get(0).toDataURL("image/png");
	var index = dataString.indexOf( "," )+1;
	dataString = dataString.substring( index );
	
	return dataString;
}

SketchPad.prototype.toDataURL = function () {

	var dataString = this.canvas.get(0).toDataURL("image/png");
	return dataString;
}

SketchPad.prototype.clear = function () {

	var c = this.canvas[0];
	this.context.clearRect( 0, 0, c.width, c.height );
}
			
