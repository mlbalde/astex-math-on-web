/**
 *
 * ASTEX
 * http://astex-math-on-web.googlecode.com
 * astex.math.on.web@gmail.com
 *
 * version 0.1 (beta) (30 April 2010)
 * 
 * Copyright (C) 2009-2010 Michael A. Ziegler
 *
 * License:
 *
 *   This file is part of ASTEX.
 *
 *   ASTEX is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU Lesser General Public License (LGPL) 
 *   as published by the Free Software Foundation, either version 3 of 
 *   the License, or (at your option) any later version.
 *
 *   ASTEX is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU Lesser General Public License (LGPL) for more details.
 *
 *   You should have received a copy of the GNU Lesser General Public License
 *   along with ASTEX.  If not, see <http://www.gnu.org/licenses/>.
 *
 **/




/*--------------------------------------------------------------------------*/

// prototype new Astex.Canvas ( Astex.Window aWindow , Float xmin , Float xmax , Float xscale , Float ymin , Float ymax , Float yscale , Color bgcolor )
Astex.Canvas = function ( aWindow , xmin , xmax , xscale , ymin , ymax , yscale , bgcolor ) {

	if ( ! aWindow || ! aWindow.insertWindow ) {
		new Astex.Error ( "Need an Astex.Window object as first argument." , "Astex.Canvas" ) ;
	}

	this.window = aWindow ;
	// get a jsGraphics canvas from Walter Zorn Graphics
	//this.canvas = new jsGraphics ( document.getElementById ( this.window.id ) ) ;
	this.canvas = new jsGraphics ( this.window.node ) ;
	//this.canvas = Astex.BaseCanvas.getCanvas ( this.window.node ) ;
	//this.xmin = ! xmin ? -10 : xmin ;
	//this.xmax = ! xmax ? 10 : xmax ;
	//this.xscale = ! xscale ? 1 : xscale ;
	this.xmin = xmin == null ? -10 : xmin ;
	this.xmax = xmax == null ? 10 : xmax ;
	this.xscale = xscale == null ? 1 : xscale ;
	this.xstep = (this.xmax-this.xmin)/this.window.width ;
	//this.ymin = ! ymin ? ( ymin == 0 ? 0 : -10 ) : ymin ;
	//this.ymin = ! ymin ? -10 : ymin ;
	//this.ymax = ! ymax ? 10 : ymax ;
	//this.yscale = ! yscale ? 1 : yscale ;
	this.ymin = ymin == null ? -10 : ymin ;
	this.ymax = ymax == null ? 10 : ymax ;
	this.yscale = yscale == null ? 1 : yscale ;
	this.ystep = (this.ymax-this.ymin)/this.window.height ;

	//this.bgcolor = ! bgcolor ? "white" : bgcolor ;
	//this.bgcolor = ! bgcolor ? Astex.Window.bgColor : bgcolor ;
	//Astex.Window.bgColor = this.bgcolor ;					// reset Astex.Window.bgColor

	//if ( bgcolor ) { Astex.Window.bgColor = bgcolor ; }
	//this.bgcolor = Astex.Window.bgColor ;
	this.bgcolor = bgcolor ;

	// make sure xmin <= xmax, ditto for y's
	if ( this.xmax < this.xmin ) {
		var swap = Astex.Util.swap ( this.xmin , this.xmax ) ;
		this.xmax = swap.one ;
		this.xmin = swap.two ;
	}
	if ( this.ymax < this.ymin ) {
		var swap = Astex.Util.swap ( this.ymin , this.ymax ) ;
		this.ymax = swap.one ;
		this.ymin = swap.two ;
	}

	// variable for polar plots
	// calculate max radius to use
	var x = Math.max ( Math.abs(this.xmin) , Math.abs(this.xmax) ) ;
	var y = Math.max ( Math.abs(this.ymin) , Math.abs(this.ymax) ) ;
	this.rmax = Math.max ( x , y ) ;
	//this.rmax = Math.sqrt ( Math.pow(x,2) + Math.pow(y,2) ) ;
	this.rmin = 0 ;
	// calculate radius scale to use
	this.rscale = Math.max ( Math.abs(this.xscale) , Math.abs(this.yscale) ) ;
	this.rstep = Math.max ( Math.abs(this.xstep) , Math.abs(this.ystep) ) ;
	// 
	//this.thetastep = Math.PI / 5 ;
	//this.thetastep = Math.PI / 8 ;
	//this.thetastep = Math.PI / 12 ;
	this.thetastep = 0.01 ;				// don't use Math.PI / number (causing problems w/ polar plots)
	this.thetascale = Math.PI / 6 ;
	this.thetamin = 0 ;
	this.thetamax = 2 * Math.PI ;

	// set up the event handlers for mouse clicks
	this.setUpEventHandlers ( ) ;

	//this.fillBackground ( ) ;

	Astex.Canvas.Canvases.push ( this ) ;

	return this ;
};

//
// Astex.Canvas class variables
//

Astex.Canvas.DisplayCoordinates = true ;
Astex.Canvas.Canvases = new Array ( ) ;
Astex.Canvas.SVGPathRecorder = new Array ( ) ;
Astex.Canvas.currentColor = "" ;				// never refer to this variable by name, instead use get/set methods
Astex.Canvas.defaultStroke = Astex.Font.Stroke.PLAIN ;
Astex.Canvas.currentStroke = Astex.Canvas.defaultStroke ;	// never refer to this variable by name, instead use get/set methods

//
// Astex.Canvas instance methods
//

// prototype String this.toObjectLiteralString ( )
Astex.Canvas.prototype.toObjectLiteralString = function ( ) {
	return "{ xmin: " + this.xmin + ", xmax: " + this.xmax + ", ymin: " + this.ymin + ", ymax: " + this.ymax + ", xscale: " + this.xscale + ", yscale: " + this.yscale + "}" ; 
};

// prototype String this.fillBackground ( )
Astex.Canvas.prototype.fillBackground = function ( ) {
	// fill canvas background
	// this should ensure that onclick handlers will work at every point on the canvas
	// otherwise, jsGraphics() wouldn't have actually drawn anything in the 'empty' space
	this.setColor ( this.bgcolor ) ;
	//this.setStroke ( 1 ) ;
	this.fillRect ( this.xmin , this.ymin , this.xmax-this.xmin , this.ymax-this.ymin ) ;
};

// prototype void this.setUpEventHandlers ( )
Astex.Canvas.prototype.setUpEventHandlers = function ( ) {

	// set-up mouse event handlers
	//alert ( "Id: " + this.window.id ) ;
	//var d = document.getElementById ( this.window.id ) ;
	var d = this.window.node ;
	if ( d.captureEvents ) { d.captureEvents(Event.CLICK) ; }
	if ( Astex.Util.isIE ) {
		//d.onmousedown = function ( event ) {
			//return Astex.Canvas.displayCoordOnCanvas ( event , d.getAttribute("id") ) ;
			//return Astex.Canvas.recordSVGPath ( event , d.getAttribute("id") ) ;
		//};
		//d.onmouseover = d.onmousedown ;
		//d.onmouseup = d.onmousedown ;
		//d.ondblclick = function ( event ) {
			//return Astex.Canvas.showSVGPathRecorder ( event , d.getAttribute("id") ) ;
			//return Astex.ControlPanel.toggle() ;
		//}
	}
	else {
		//d.setAttribute ( "onmousedown" , "Astex.Canvas.displayCoordOnCanvas(event, \"" +  this.window.id + "\" );" ) ;
		//d.setAttribute ( "onmouseover" , "Astex.Canvas.displayCoordOnCanvas(event, \"" +  this.window.id + "\" );" ) ;

		//d.setAttribute ( "onmousedown" , "Astex.Canvas.recordSVGPath(event, \"" +  this.window.id + "\" );" ) ;
		//d.setAttribute ( "onmouseover" , "Astex.Canvas.recordSVGPath(event, \"" +  this.window.id + "\" );" ) ;
		//d.setAttribute ( "onmouseup" , "Astex.Canvas.recordSVGPath(event, \"" +  this.window.id + "\" );" ) ;
		//d.setAttribute ( "ondblclick" , "Astex.Canvas.showSVGPathRecorder(event, \"" +  this.window.id + "\" );" ) ;
		//d.setAttribute ( "ondblclick" , "Astex.ControlPanel.toggle( );" ) ;
	}
};

// prototype Object this.toWindowCoordinates ( Object point )
// for now...argument point should have x and y attributes
// kept vague so we can use other "points", e.g., polar,parametric,etc in the future
// returns an object with x and y attributes
Astex.Canvas.prototype.toWindowCoordinates = function ( point ) {
	// point should have x and y attributes
	// u should range from 0 to window width as x ranges from xmin to xmax
	// v should range from 0 to window height as y ranges from ymax to ymin
	// jsGraphics expects integer values, so use parseInt() below
	var u = parseInt ( this.window.width * (point.x-this.xmin)/(this.xmax-this.xmin) ) ;
	var v = parseInt ( this.window.height * (this.ymax-point.y)/(this.ymax-this.ymin) ) ;
	return {x:u,y:v} ;
};

/*------- many of the same method names found in jsGraphics --- rewritten for drawing on an Astex.Canvas ---------*/

// prototype: void this.paint ( )
Astex.Canvas.prototype.paint = function ( ) {
	this.canvas.paint ( ) ;
};

// prototype: void this.clear ( )
Astex.Canvas.prototype.clear = function ( ) {
	this.canvas.clear ( ) ;
};

// prototype: void this.setPrintable ( Boolean bool )
Astex.Canvas.prototype.setPrintable = function ( bool ) {
	if ( typeof bool != "boolean" ) {
		new Astex.Error ( "Needs a boolean argument." , "Astex.Canvas.prototype.setPrintable" ) ;
	}
	this.canvas.setPrintable ( bool ) ;
};

// prototype void this.setStroke ( Int stroke )
// can also use the pre-defined constant Stroke.DOTTED
Astex.Canvas.prototype.setStroke = function ( stroke ) {
	if ( typeof stroke == "string" && stroke.match(/dotted/i) ) {
		stroke = Stroke.DOTTED ;
	}
	this.canvas.setStroke ( parseInt(stroke) ) ;
	Astex.Canvas.currentStroke = parseInt(stroke) ;
};

// prototype Int this.getStroke ( )
Astex.Canvas.prototype.getStroke = function ( ) {

	return Astex.Canvas.currentStroke ;
};

// prototype void this.setColor ( String color )
Astex.Canvas.prototype.setColor = function ( color ) {
	this.canvas.setColor ( color ) ;

	// update current color class variable
	Astex.Canvas.currentColor = color ;

	// update the Astex.AMath.mathcolor variable
	// this will ensure appropriate 'mathcolor' attribute is found
	// in Astex.MathML when processing <mstyle> nodes
	Astex.AMath.mathcolor = color ;
};

// prototype String this.getColor ( )
Astex.Canvas.prototype.getColor = function ( ) {

	return Astex.Canvas.currentColor ;
};

// prototype void this.setOpacity ( Float opacity )
Astex.Canvas.prototype.setOpacity = function ( opacity ) {
	if ( typeof opacity != "number" ) {
		opacity = 1 ;
	}
	this.canvas.setOpacity ( opacity ) ;
	//alert ( opacity ) ;
};

/*--------------------------------------------------------------------------

		DRAWING METHODS

--------------------------------------------------------------------------*/


// prototype void this._drawLine ( Float x1 , Float y1 , Float x2 , Float y2 )
Astex.Canvas.prototype._drawLine = function ( x1 , y1 , x2 , y2 ) {
	if ( typeof x1 != "number" ) {
		new Astex.Error ( "Argument 1 must be a number, not " + typeof x1 + "." , "Astex.Canvas.prototype._drawLine" ) ;
	}
	if ( typeof y1 != "number" ) {
		new Astex.Error ( "Argument 2 must be a number, not " + typeof y1 + "." , "Astex.Canvas.prototype._drawLine" ) ;
	}
	if ( typeof x2 != "number" ) {
		new Astex.Error ( "Argument 3 must be a number, not " + typeof x2 + "." , "Astex.Canvas.prototype._drawLine" ) ;
	}
	if ( typeof y2 != "number" ) {
		new Astex.Error ( "Argument 4 must be a number, not " + typeof y2 + "." , "Astex.Canvas.prototype._drawLine" ) ;
	}
	var point1 = this.toWindowCoordinates ( {x:x1,y:y1} ) ; 
	var point2 = this.toWindowCoordinates ( {x:x2,y:y2} ) ; 
	this.canvas.drawLine ( point1.x , point1.y , point2.x , point2.y ) ;
};

// prototype void this._drawPolyLine ( Float[] X , Float[] Y )
Astex.Canvas.prototype._drawPolyLine = function ( X , Y ) {
	var xPoints = new Array ( ) ;
	var yPoints = new Array ( ) ;

	if ( X.length != Y.length ) {
		new Astex.Error ( "Arrays are not same length." , "Astex.Canvas.prototype._drawPolyLine" ) ;
	}

	for ( var i = 0 ; i < X.length ; i++ ) {
		var point = this.toWindowCoordinates ( {x:X[i],y:Y[i]} ) ;
		xPoints.push ( point.x ) ;
		yPoints.push ( point.y ) ;
	}
	this.canvas.drawPolyLine ( xPoints , yPoints ) ;
};


// prototype void this._drawPolygon ( Float[] X , Float[] Y )
Astex.Canvas.prototype._drawPolygon = function ( X , Y ) {
	var xPoints = new Array ( ) ;
	var yPoints = new Array ( ) ;

	if ( X.length != Y.length ) {
		new Astex.Error ( "Arrays are not same length." , "Astex.Canvas.prototype._drawPolygon" ) ;
	}

	for ( var i = 0 ; i < X.length ; i++ ) {
		var point = this.toWindowCoordinates ( {x:X[i],y:Y[i]} ) ;
		xPoints.push ( point.x ) ;
		yPoints.push ( point.y ) ;
	}
	this.canvas.drawPolygon ( xPoints , yPoints ) ;
};

// prototype void this._fillPolygon ( Float[] X , Float[] Y )
Astex.Canvas.prototype._fillPolygon = function ( X , Y ) {
	var xPoints = new Array ( ) ;
	var yPoints = new Array ( ) ;

	if ( X.length != Y.length ) {
		new Astex.Error ( "Arrays are not same length." , "Astex.Canvas.prototype._fillPolygon" ) ;
	}

	for ( var i = 0 ; i < X.length ; i++ ) {
		var point = this.toWindowCoordinates ( {x:X[i],y:Y[i]} ) ;
		xPoints.push ( point.x ) ;
		yPoints.push ( point.y ) ;
	}
	this.canvas.fillPolygon ( xPoints , yPoints ) ;
};

/*--------------------------------------------------------------------------

	THE WORK-HOUSE OF THE CANVAS DRAWING METHODS --- drawSVGPath 

	All other canvas drawing methods should use this rather
	than the above _draw[A-Z]* methods. Only drawSVGPath
	should call the aforementioned _draw[A-Z]* mehtods.

	The reason is that we can easily perform transformations
	on the SVGPath instances.

--------------------------------------------------------------------------*/

// prototype void this.drawSVGPath ( String path , Boolean fill )
// since we don't have most of the methods used in SVG Paths
// we do everything using the SVG Path moveTo command "M" 
// and then draw polylines or fill polygons depending on 
// whether the path is closed.
// if fill is true, polygons will be filled
Astex.Canvas.prototype.drawSVGPath = function ( path , fill ) {

	if ( ! fill ) {
		fill = false ;
	}
	if ( path == "" ) {
		//new Astex.Error ( "path is empty string" , "Astex.Canvas.prototype.drawSVGPath" ) ;
		// fail gracefully (for drawing a space!)
		return ;
	}
	if ( typeof fill != "boolean" ) {
		new Astex.Error ( "Needs a boolean or null value for 2nd argument." , "Astex.Canvas.prototype.drawSVGPath" ) ;
	}
	// clean up the SVG path string
	//path = path.toUpperCase ( ) ;

	// fix and simplify the svg path string
	var p = new Astex.SVGPath ( path ) ;
	p.simplify ( Astex.Math.min ( this.xstep , this.ystep ) ) ;
	path = p.path ;

	path = path.replace ( /^M/ , "" ) ;
	path = path.replace ( /[A-LN-Y]/g , "L" ) ;
	path = path.replace ( /\s+/g , "" ) ;
	// get individual paths
	var paths = path.split ( "M" ) ;
	for ( var i = 0 ; i < paths.length ; i++ ) {
		var X = new Array ( ) ;
		var Y = new Array ( ) ;
		var p = paths[i] ;
		var type = "polyline" ;
		if ( p.match ( /Z$/ ) ) {
			type = "polygon" ;
		}
		p = p.replace ( /Z$/ , "" ) ;
		//alert ( "p = " + p ) ;
		// split at L to get "x,y x,y ..." coordinates
		var points = p.split ( "L" ) ;
		for ( var j = 0 ; j < points.length ; j++ ) {
			var  point = points[j] ;
			var xy = point.split ( "," ) ;
			var x = parseFloat ( xy[0] ) ;
			var y = parseFloat ( xy[1] ) ;
			X.push ( x ) ;
			Y.push ( y ) ;
		}
		if ( type == "polyline" ) {
			this._drawPolyLine ( X , Y ) ;
		}
		else if ( type == "polygon" && fill == true ) {
			this._fillPolygon ( X , Y ) ;
		}
		else if ( type == "polygon" ) {
			this._drawPolygon ( X , Y ) ;
		}

	}
};

/*--------------------------------------------------------------------------

	DRAWING METHODS - SHOULD USE drawSVGPath to draw everything !!!

--------------------------------------------------------------------------*/

// prototype void this.drawLine ( Float x1 , Float y1 , Float x2 , Float y2 )
Astex.Canvas.prototype.drawLine = function ( x1 , y1 , x2 , y2 ) {
	this.drawPolyLine ( [x1,x2] , [y1,y2] ) ;
};

// prototype void this.drawPolyLine ( Float[] X , Float[] Y )
Astex.Canvas.prototype.drawPolyLine = function ( X , Y ) {
	if ( X.length != Y.length ) {
		return new Astex.Error ( "arrays must be same length" , "Astex.Canvas.prototype.drawPolyLine" ) ;
	}
	var path = new Astex.SVGPath ( ) ;
	path.moveTo ( X[0] , Y[0] ) ;
	for ( var i = 1 ; i < X.length ; i++ ) {
		path.lineTo ( X[i] , Y[i] ) ;
	}
	//alert ( path.getPath() ) ;
	this.drawSVGPath ( path.getPath() , false ) ;
};

// prototype void this.drawPolyline ( Float[] X , Float[] Y )
Astex.Canvas.prototype.drawPolyline = Astex.Canvas.prototype.drawPolyLine ;

// prototype void this.drawPolygon ( Float[] X , Float[] Y )
Astex.Canvas.prototype.drawPolygon = function ( X , Y ) {
	if ( X.length != Y.length ) {
		return new Astex.Error ( "arrays must be same length" , "Astex.Canvas.prototype.drawPolygon" ) ;
	}
	var path = new Astex.SVGPath ( ) ;
	path.moveTo ( X[0] , Y[0] ) ;
	for ( var i = 1 ; i < X.length ; i++ ) {
		path.lineTo ( X[i] , Y[i] ) ;
	}
	path.close ( ) ;
	this.drawSVGPath ( path.getPath() , false ) ;
};

// prototype void this.fillPolygon ( Float[] X , Float[] Y )
Astex.Canvas.prototype.fillPolygon = function ( X , Y ) {
	if ( X.length != Y.length ) {
		return new Astex.Error ( "arrays must be same length" , "Astex.Canvas.prototype.drawPolygon" ) ;
	}
	var path = new Astex.SVGPath ( ) ;
	path.moveTo ( X[0] , Y[0] ) ;
	for ( var i = 1 ; i < X.length ; i++ ) {
		path.lineTo ( X[i] , Y[i] ) ;
	}
	path.close ( ) ;
	this.drawSVGPath ( path.getPath() , true ) ;
};

// prototype void this.drawRect ( Float x , Float y , Float width , Float height )
Astex.Canvas.prototype.drawRect = function ( x , y , width , height ) {
	/*
	// x and y are lower left corner
	// the jsGraphics class uses top left corner , width, and height
	var point1 = this.toWindowCoordinates ( {x:x,y:y+height} ) ;	// top left
	var point2 = this.toWindowCoordinates ( {x:x+width,y:y} ) ; 	// opposite corner
	this.canvas.drawRect ( point1.x , point1.y , Math.abs(point2.x-point1.x) , Math.abs(point2.y-point1.y) ) ;
	*/
	if ( typeof x != "number" && typeof y != "number" && typeof width != "number" && typeof height != "number" ) {
		return new Astex.Error ( "args missing or NOT a number" , "Astex.Canvas.prototype.drawRect" ) ;
	}
	var path = new Astex.SVGPath ( ) ;
	path.moveTo ( x , y ) ;
	path.lineTo ( x + width , y ) ;
	path.lineTo ( x + width , y + height  ) ;
	path.lineTo ( x , y + height  ) ;
	path.close ( ) ;
	this.drawSVGPath ( path.getPath() , false ) ;
};

// prototype void this.fillRect ( Float x , Float y , Float width , Float height )
Astex.Canvas.prototype.fillRect = function ( x , y , width , height ) {
	/*
	// x and y are lower left corner
	// the jsGraphics class uses top left corner , width, and height
	var point1 = this.toWindowCoordinates ( {x:x,y:y+height} ) ;	// top left
	var point2 = this.toWindowCoordinates ( {x:x+width,y:y} ) ; 	// opposite corner
	this.canvas.fillRect ( point1.x , point1.y , Math.abs(point2.x-point1.x) , Math.abs(point2.y-point1.y) ) ;
	*/
	if ( typeof x != "number" && typeof y != "number" && typeof width != "number" && typeof height != "number" ) {
		return new Astex.Error ( "args missing or NOT a number" , "Astex.Canvas.prototype.drawRect" ) ;
	}
	var path = new Astex.SVGPath ( ) ;
	path.moveTo ( x , y ) ;
	path.lineTo ( x + width , y ) ;
	path.lineTo ( x + width , y + height  ) ;
	path.lineTo ( x , y + height  ) ;
	path.close ( ) ;
	this.drawSVGPath ( path.getPath() , true ) ;
};

// prototype void this.drawEllipse ( Float[] center , Float a , Float b )
Astex.Canvas.prototype.drawEllipse = function ( center , a , b ) {
	// std eqn of ellipse is (x-h)^2 / a^2 + (y-k)^2 / b^2 = 1
	// center (h,k)
	// if a > b major axis is horizontal
	// if a < b major axis is vertical
	// foci lie on major axis, c units from center w/ c^2=a^2-b^2
	// i.e., (h+-c,k) or (h,k+-c)
	var h = center[0] ;
	var k = center[1] ;
	/*
	// jsGraphics uses top left corner
	var point1 = this.toWindowCoordinates ( {x:h-a,y:k+b} ) ;
	// opposite corner 
	var point2 = this.toWindowCoordinates ( {x:h+a,y:k-b} ) ;
	this.canvas.drawEllipse ( point1.x , point1.y , Math.abs(point2.x-point1.x) , Math.abs(point2.y-point1.y) ) ;
	*/
	var path = new Astex.SVGPath ( ) ;
	path.moveTo ( h + a , k + 0 ) ;
	path.arcTo ( h + 0 , k + b ) ;
	path.arcTo ( h - a , k + 0 ) ;
	path.arcTo ( h + 0 , k + b ) ;
	path.close ( ) ;
	this.drawSVGPath ( path.getPath() , false ) ;
};

// prototype void this.fillEllipse ( Float[] center , Float a , Float b )
Astex.Canvas.prototype.fillEllipse = function ( center , a , b ) {
	// std eqn of ellipse is (x-h)^2 / a^2 + (y-k)^2 / b^2 = 1
	// center (h,k)
	// if a > b major axis is horizontal
	// if a < b major axis is vertical
	// foci lie on major axis, c units from center w/ c^2=a^2-b^2
	// i.e., (h+-c,k) or (h,k+-c)
	var h = center[0] ;
	var k = center[1] ;
	/*
	// jsGraphics uses top left corner
	var point1 = this.toWindowCoordinates ( {x:h-a,y:k+b} ) ;
	// opposite corner 
	var point2 = this.toWindowCoordinates ( {x:h+a,y:k-b} ) ;
	this.canvas.fillEllipse ( point1.x , point1.y , Math.abs(point2.x-point1.x) , Math.abs(point2.y-point1.y) ) ;
	*/
	var path = new Astex.SVGPath ( ) ;
	path.moveTo ( h , k ) ;
	path.moveTo ( h + a , k + 0 ) ;
	path.arcTo ( h + 0 , k + b ) ;
	path.arcTo ( h - a , k + 0 ) ;
	path.arcTo ( h + 0 , k + b ) ;
	path.close ( ) ;
	this.drawSVGPath ( path.getPath() , true ) ;
};

// prototype void this.drawArc ( Float[] center , Float a , Float b , Float startAngle , Float endAngle , Boolean fill )
// start and end angles are in degrees NOT radians
Astex.Canvas.prototype.drawArc = function ( center , a , b , startAngle , endAngle , fill ) {
	// std eqn of ellipse is (x-h)^2 / a^2 + (y-k)^2 / b^2 = 1
	// center (h,k)
	// if a > b major axis is horizontal
	// if a < b major axis is vertical
	// foci lie on major axis, c units from center w/ c^2=a^2-b^2
	// i.e., (h+-c,k) or (h,k+-c)
	/*
	var h = center[0] ;
	var k = center[1] ;
	// jsGraphics uses top left corner
	var point1 = this.toWindowCoordinates ( {x:h-a,y:k+b} ) ;
	// opposite corner 
	var point2 = this.toWindowCoordinates ( {x:h+a,y:k-b} ) ;
	this.canvas.fillArc ( point1.x , point1.y , Math.abs(point2.x-point1.x) , Math.abs(point2.y-point1.y) , startAngle , endAngle ) ;
	*/

	if ( ! fill || typeof fill != "boolean" ) { fill = false ; }

	if ( ! endAngle > startAngle ) {
		return new Astex.Error ( "endAngle must be larger than startAngle" , "Astex.Canvas.drawArc" ) ;
	}
	//tan(theta) = y / x
	// x^2 / a^2 + y^2 / b^2 = 1
	// Solve for y: y^2 = b^2 * [ 1 - x^2 / a^2 ]
	// Substitute into tan(theta) = y / x
	// Solve this for x: x^2 = (ab)^2 / ( b^2 + a^2 * tan(theta) )

	var path = new Astex.SVGPath ( ) ;
	var x0 , y0 ;
	var x , y ;
	var h = center[0] ;
	var k = center[1] ;
	var m = Astex.Math ;

	// draw beginning of wedge
	//path.moveTo ( h , k ) ;

	// start angle in QI
	if ( startAngle >= 0 && startAngle < 90 ) {
		// x0 > 0 , y0 > 0 
		x0 = h + m.sqrt ( m.pow(a,2)*m.pow(b,2) / ( m.pow(b,2) + m.pow(a,2) * m.tan(startAngle*m.pi/180)) ) ;
		y0 = k + m.sqrt ( m.pow(b,2) * ( 1 - m.pow(x0/a,2) ) ) ;
		path.moveTo ( x0 , y0 ) ;
	}
	// start angle on positive y-axis
	else if ( startAngle >= 90 ) {
		x0 = h + 0 ;
		y0 = k + b ;
		path.moveTo ( x0 , y0 ) ;
	}
	// start angle quadrant II
	if ( startAngle > 90 && startAngle < 180 ) {
		// x0 < 0 , y0 > 0
		x0 = h - m.sqrt ( m.pow(a,2)*m.pow(b,2) / ( m.pow(b,2) + m.pow(a,2) * m.tan(startAngle*m.pi/180)) ) ;
		y0 = k + m.sqrt ( m.pow(b,2) * ( 1 - m.pow(x0/a,2) ) ) ;
		path.moveTo ( x0 , y0 ) ;
	}
	// start angle on negative x-axis
	else if ( startAngle >= 180 ) {
		x0 = h - a ;
		y0 = k + 0 ;
		path.moveTo ( x0 , y0 ) ;
	}
	// start angle quadrant III
	if ( startAngle > 180 && startAngle < 270 ) {
		// x0 < 0 , y0 < 0
		x0 = h - m.sqrt ( m.pow(a,2)*m.pow(b,2) / ( m.pow(b,2) + m.pow(a,2) * m.tan(startAngle*m.pi/180)) ) ;
		y0 = k - m.sqrt ( m.pow(b,2) * ( 1 - m.pow(x0/a,2) ) ) ;
		path.moveTo ( x0 , y0 ) ;
	}
	// start angle on negative y-axis
	else if ( startAngle >= 270 ) {
		x0 = h + 0 ;
		y0 = k - b ;
		path.moveTo ( x0 , y0 ) ;
	}
	// start angle quadrant IV
	if ( startAngle > 270 && startAngle < 360 ) {
		// x0 > 0 , y0 < 0
		x0 = h + m.sqrt ( m.pow(a,2)*m.pow(b,2) / ( m.pow(b,2) + m.pow(a,2) * m.tan(startAngle*m.pi/180)) ) ;
		y0 = k - m.sqrt ( m.pow(b,2) * ( 1 - m.pow(x0/a,2) ) ) ;
		path.moveTo ( x0 , y0 ) ;
	}
	// start angle on negative x-axis
	else if ( startAngle >= 360 ) {
		x0 = h + a ;
		y0 = k + 0 ;
		path.moveTo ( x0 , y0 ) ;
	}


	// end angle in Q1
	if ( endAngle > 0 && endAngle < 90 ) {
		// x > 0 , y > 0 
		x = h + m.sqrt ( m.pow(a,2)*m.pow(b,2) / ( m.pow(b,2) + m.pow(a,2) * m.tan(endAngle*m.pi/180)) ) ;
		y = k - m.sqrt ( m.pow(b,2) * ( 1 - m.pow(x/a,2) ) ) ;
		path.arcTo ( x , y ) ;
	}
	else if ( endAngle >= 90 ) {
		x = h + 0 ;
		y = k + b ;
		path.arcTo ( x , y ) ;
	}
	if ( endAngle > 90 && endAngle < 180 ) {
		// x < 0 , y > 0 
		x = h - m.sqrt ( m.pow(a,2)*m.pow(b,2) / ( m.pow(b,2) + m.pow(a,2) * m.tan(endAngle*m.pi/180)) ) ;
		y = k + m.sqrt ( m.pow(b,2) * ( 1 - m.pow(x/a,2) ) ) ;
		path.arcTo ( x , y ) ;
	}
	else if ( endAngle >= 180 ) {
		x = h - a ;
		y = k + 0 ;
		path.arcTo ( x , y ) ;
	}
	if ( endAngle > 180 && endAngle < 270 ) {
		// x < 0 , y < 0 
		x = h - m.sqrt ( m.pow(a,2)*m.pow(b,2) / ( m.pow(b,2) + m.pow(a,2) * m.tan(endAngle*m.pi/180)) ) ;
		y = k - m.sqrt ( m.pow(b,2) * ( 1 - m.pow(x/a,2) ) ) ;
		path.arcTo ( x , y ) ;
	}
	else if ( endAngle >= 270 ) {
		x = h + 0 ;
		y = k - b ;
		path.arcTo ( x , y ) ;
	}
	if ( endAngle > 270 && endAngle < 360 ) {
		// x > 0 , y < 0 
		x = h + m.sqrt ( m.pow(a,2)*m.pow(b,2) / ( m.pow(b,2) + m.pow(a,2) * m.tan(endAngle*m.pi/180)) ) ;
		y = k - m.sqrt ( m.pow(b,2) * ( 1 - m.pow(x/a,2) ) ) ;
		path.arcTo ( x , y ) ;
	}
	else if ( endAngle >= 360 ) {
		x = h + a ;
		y = k + 0 ;
		path.arcTo ( x , y ) ;
	}

	// close the wedge
	//path.lineTo ( x0 , y0 )

	//alert ( path.getPath() ) ;
	path.close ( ) ;
	this.drawSVGPath ( path.getPath() , false ) ;

};

// prototype void this.fillArc ( Float[] center , Float a , Float b , Float startAngle , Float endAngle )
// start and end angles are in degrees NOT radians
Astex.Canvas.prototype.fillArc = function ( center , a , b , startAngle , endAngle ) {
	this.drawArc ( center , a , b , startAngle , endAngle , true ) ;
};


/*------------------- String methods ------------------*/

// prototype void this.setFont ( String family , String size , Int style )
// possible styles: Font.PLAIN, Font.BOLD, Font.ITALIC, 
// Font.ITALIC_BOLD or Font.BOLD_ITALIC
// e.g. this.setFont ( "arial" , "15px" , Font.PLAIN ) ;
Astex.Canvas.prototype.setFont = function ( family , size , style ) {
	this.canvas.setFont ( family , size , style ) ;
};
// prototype void this.drawString ( String str , Float x , Float y )
// (x,y) bottom left corner
Astex.Canvas.prototype.drawString = function ( str , x , y ) {
	// jsGraphics uses top left corner
	// need to calculate height of string according to font size ???
	// may also need to use xscale ??? (xmin, xmax ???)
	//height = 1 ;
	//var point = this.toWindowCoordinates ( {x:x,y:y+height} ) ;
	var point = this.toWindowCoordinates ( {x:x,y:y} ) ;
	//alert ( point.x + " , " + point.y ) ;
	//if ( point.x == NaN || point.y == NaN ) { return ; }
	this.canvas.drawString ( str , point.x , point.y ) ;
};
// prototype void this.drawStringRect ( String str , Float x , Float y , Float width , String align )
// (x,y) top left corner !!!! (NOT bottom left)
// align can be "left" , "center" , "right" or "justify"
Astex.Canvas.prototype.drawStringRect = function ( str , x , y , width , align ) {
	// jsGraphics uses top left corner
	var point1 = this.toWindowCoordinates ( {x:x,y:y} ) ;
	var point2 = this.toWindowCoordinates ( {x:x+width,y:y} ) ;
	this.canvas.drawStringRect ( str , point1.x , point1.y , Math.abs(point2.x-point1.x) , align ) ;
};

/*------------------- Image methods ------------------*/

// prototype void this.drawImage ( String src , Float x , Float y , Float width , Float height , String handler )
// (x,y) top left corner !!!! (NOT bottom left)
// width and height should be width and height of original image
Astex.Canvas.prototype.drawImage = function ( src , x , y , width , height , handler ) {
	// jsGraphics uses top left corner
	var point = this.toWindowCoordinates ( {x:x,y:y} ) ;
	this.canvas.drawImage ( src , parseInt(point.x) , parseInt(point.y) , parseInt(width) , parseInt(height) , handler ) ;
};

/*------- methods not found in jsGraphics ---------*/

//
// other possible methods to implement
//
// drawArc ??? already implemented drawArcOfCircle
// drawFunction ( functions of y , r , theta ??? , t , etc. )
// drawRelation ?????
// drawParametric
// drawPolar
// drawParabola  (similar to drawEllipse or use drawFunction?)
// drawHyperbola (similar to drawEllipse or use drawFunction?)

// some statistical graphs ...
// drawStemAndLeaf
// drawDotPlot
// drawHistogram
// drawBarChart
// drawPieChart
// drawBoxPlot
// drawSeries
// drawTimeSeries
// drawTable
// drawFrequencyTable
// drawContingencyTable
// drawSegmentedBarChart


// prototype void this.drawPoint ( Float[] point , String type , Boolean fill )
// draw a point as a crosshairs, horizontal/vertical dash, circle/disc
// e.g. this.drawPoint ( [0,5] , "+-|o" , true|false ) ;
Astex.Canvas.prototype.drawPoint = function ( point , type , fill ) {

	if ( ! point ) { point = [0,0] ; }
	if ( ! type || (typeof type == "string" && ! type.match(/\+|-|o|\|/)) ) { type = "o" ; }
	if ( ! fill ) { fill = false ; }		// only used for circle/disc "o"

	var x = parseFloat ( point[0] ) ;
	var y = parseFloat ( point[1] ) ;

	// may need to adjust this
	//var radius = Astex.Math.min ( this.xscale , this.yscale ) / 2 ;
	var radius = Astex.Math.min ( 4*this.xstep , 4*this.ystep ) ;

	//alert ( type ) ;
	if ( type.match(/\+|-|\|/) ) {
		if ( type.match(/\+/) ) {
			this.drawLine ( x - radius , y , x + radius , y ) ;
			this.drawLine ( x , y - radius , x , y + radius ) ;
		}
		else if ( type.match(/-/) ) {
			this.drawLine ( x - radius , y , x + radius , y ) ;
		}
		else if ( type.match(/\|/) ) {
			this.drawLine ( x , y - radius , x , y + radius ) ;
		}
	}
	else {
		// disc/circle
		if ( fill == true ) {
			this.fillCircle ( [x,y] , radius ) ;
		}
		else if ( ! fill || fill == false || fill == "false" || fill == "no" ) {
			this.drawCircle ( [x,y] , radius ) ;
		}
	}
};

// prototype void this.drawArrowHead ( Float[] point1 , Float[] point2 )
Astex.Canvas.prototype.drawArrowHead = function ( point1 , point2 ) {

	// create unit vector in direction from point1 to point2
	var u = [ point2[0] - point1[0] , point2[1] - point1[1] ] ;
	var d = Astex.Math.sqrt ( Astex.Math.pow(u[0],2) + Astex.Math.pow(u[1],2) ) ;
	if ( d > 0.00000001 ) {
		u = [ u[0]/d , u[1]/d ] ;

		// create orthogonal unit vector
		var orthU = [ -u[1] , u[0] ] ;		// note that orthU is unit vector since u was

		// create arrays
		var X = [] ;
		var Y = [] ;

		// populate arrays
		X.push ( point2[0] - 1*u[0] - 0.5*orthU[0] ) ;
		Y.push ( point2[1] - 1*u[1] - 0.5*orthU[1] ) ;

		X.push ( point2[0] ) ;
		Y.push ( point2[1] ) ;

		X.push ( point2[0] - 1*u[0] + 0.5*orthU[0] ) ;
		Y.push ( point2[1] - 1*u[1] + 0.5*orthU[1] ) ;

		// fill polygon (triangle)
		this.fillPolygon ( X , Y ) ;
	}
};

// prototype void this.drawFunction ( String indVar , String f , Float min , Float max , String endpoints )
Astex.Canvas.prototype.drawFunction = function ( indVar , f , min , max , endpoints ) {

	// indVar should be x , y , r , theta , t
	if ( ! indVar || typeof indVar != "string" || !indVar.match(/x|y|r|theta|t/i) ) { indVar = "x" } ;
	indVar = indVar.toLowerCase ( ) ;
	indVar = indVar.replace ( /\s*/g , "" ) ;

	// endpoints can be    <-    ->    o-    -o    *-    -*
	// or any concatenation of the above like <-> , o-* , etc.
	if ( ! endpoints ) { endpoints == null ; }

	// f might be a string or a function
	// if it's a string, we translate the ascii markup to JS notation
	// e.g., x^2 --> Astex.Math.pow(x,2)
	//alert ( indVar ) ;
	//alert ( f ) ;
	if ( indVar == "t" ) {
		//alert ( "param" ) ;
		// parametric plot --- f is an array [x(t),y(t)]
		if ( f.length != 2 ) {
			return new Astex.Error ( "parametric plot requires array of 2 functions" , "Astex.Canvas.prototype.drawFunction" ) ;
		}
		if ( typeof f[0] == "string" ) {
		//if ( typeof f[0] != "function" ) {
			f[0] = Astex.Math.ascii2JS ( f[0] ) ;
		}
		if ( typeof f[1] == "string" ) {
		//if ( typeof f[1] != "function" ) {
			f[1] = Astex.Math.ascii2JS ( f[1] ) ;
		}
	}
	else if ( typeof f == "string" ) {
		f = Astex.Math.ascii2JS ( f ) ;
		//alert ( "'" + f + "'" ) ;
	}

	// if min/max are zero, testing !0 is true
	// having trouble with user's plot(s) (namely when min=0)

	var X = new Array ( ) ;
	var Y = new Array ( ) ;
	var step = 0 ;
	switch ( indVar ) {

		case "x" :
			if ( typeof min != "number" ) { min = this.xmin ; }
			if ( typeof max != "number" ) { max = this.xmax ; }
			min = parseFloat ( min ) ;
			max = parseFloat ( max ) ;
			step = this.xstep ;

			//max += step ;
			for ( var x = min ; x < max ; x += step ) {
				var y ;
				if ( typeof f == "string" ) {
					y = eval ( f ) ;
				}
				else {
					y = f ( x ) ;					// f is a function
				}
				if ( y >= this.ymin && y <= this.ymax ) {
					X.push ( x ) ;
					Y.push ( y ) ;
				}
			}

			break ;

		case "y" :
			if ( typeof min != "number" ) { min = this.ymin ; }
			if ( typeof max != "number" ) { max = this.ymax ; }
			min = parseFloat ( min ) ;
			max = parseFloat ( max ) ;
			step = this.ystep ;

			//max += step ;
			for ( var y = min ; y < max ; y += step ) {
				var x ;
				if ( typeof f == "string" ) {
					x = eval ( f ) ;
				}
				else {
					x = f ( y ) ;					// f is a function
				}
				if ( x >= this.xmin && x <= this.xmax ) {
					X.push ( x ) ;
					Y.push ( y ) ;
				}
			}

			break ;

		case "theta" :
			if ( typeof min != "number" ) { min = this.thetamin ; }
			if ( typeof max != "number" ) { max = this.thetamax ; }
			min = parseFloat ( min ) ;
			max = parseFloat ( max ) ;
			step = this.thetastep ;

			//alert ( min ) ;
			//alert ( max ) ;
			//alert ( step ) ;
			//alert ( f ) ;

			//max += step ;
			for ( var theta = min ; theta < max ; theta += step ) {
				var r ;
				if ( typeof f == "string" ) {
					r = eval ( f ) ;
				}
				else {
					r = f ( theta ) ;					// f is a function
				}
				if ( Math.abs(r) >= this.rmin && Math.abs(r) <= this.rmax ) {
					X.push ( r * Astex.Math.cos(theta) ) ;
					Y.push ( r * Astex.Math.sin(theta) ) ;
				}
			}

			break ;

		case "r" :
			if ( typeof min != "number" ) { min = this.rmin ; }
			if ( typeof max != "number" ) { max = this.rmax ; }
			min = parseFloat ( min ) ;
			max = parseFloat ( max ) ;
			step = this.rstep ;

			//max += step ;
			for ( var r = min ; r < max ; r += step ) {
				var theta ;
				if ( typeof f == "string" ) {
					theta = eval ( f ) ;
				}
				else {
					theta = f ( r ) ;					// f is a function
				}
				if ( theta >= this.thetamin && theta <= this.thetamax ) {
					X.push ( r * Astex.Math.cos(theta) ) ;
					Y.push ( r * Astex.Math.sin(theta) ) ;
				}
			}

			break ;

		case "t" :
			//alert ( "parametric" ) ;
			if ( typeof min != "number" ) { min = Astex.Math.min(this.xmin,this.ymin) ; }
			if ( typeof max != "number" ) { max = Astex.Math.max(this.xmax,this.ymax) ; }
			min = parseFloat ( min ) ;
			max = parseFloat ( max ) ;
			step = Astex.Math.min(this.xstep,this.ystep) ;

			//max += step ;
			for ( var t = min ; t < max ; t += step ) {
				var x , y ;
				if ( typeof f[0] == "string" ) {
				//if ( typeof f[0] != "function" ) {
					x = eval ( f[0] ) ;
				}
				else {
					x = f[0] ( t ) ;					// f[0] is a function
				}

				if ( typeof f[1] == "string" ) {
					y = eval ( f[1] ) ;
				}
				else {
					y = f[1] ( t ) ;					// f[1] is a function
				}

				if ( x >= this.xmin && x <= this.xmax && y >= this.ymin && y <= this.ymax ) {
					X.push ( x ) ;
					Y.push ( y ) ;
				}
			}

			break ;

		default :
			return new Astex.Warning ( "unrecognized ind. var." , "Astex.Canvas.drawFunction" ) ;
			break ;

	}

	// draw endpoints first, if any (holes/circles will modify arrays)
	if ( endpoints != null ) {

		if ( endpoints.indexOf("<-") != -1 ) { 
			this.drawArrowHead ( [X[1],Y[1]] , [X[0],Y[0]] ) ;
		}
		if ( endpoints.indexOf("->") != -1 ) { 
			this.drawArrowHead ( [X[X.length-2],Y[Y.length-2]] , [X[X.length-1],Y[Y.length-1]] ) ;
		}
		if ( endpoints.indexOf("o-") != -1 ) {
			this.drawPoint ( [X[0],Y[0]] , "o" , false );
			// remove point(s) from beginning of arrays so circle/hole doesn't have any part of graph in it
			X.shift ( ) ; Y.shift ( ) ;
		}
		if ( endpoints.indexOf("-o") != -1 ) {
			this.drawPoint ( [X[X.length-1],Y[Y.length-1]] , "o" , false );
			// remove point(s) from beginning of arrays so circle/hole doesn't have any part of graph in it
			X.pop( ) ; Y.pop( ) ;
		}
		if ( endpoints.indexOf("*-") != -1 ) {
			this.drawPoint ( [X[0],Y[0]] , "o" , true );
		}
		if ( endpoints.indexOf("-*") != -1 ) {
			this.drawPoint ( [X[X.length-1],Y[Y.length-1]] , "o" , true );
		}
	}

	// draw function
	this.drawPolyLine ( X , Y ) ;
};


// prototype void this.fillBetweenFunctions ( String[] indVar , String[] f , Float[] min , Float[] max )
Astex.Canvas.prototype.fillBetweenFunctions = function ( indVar , f , min , max ) {

	// indVar should be x , y , r , theta
	if ( ! indVar ) { indVar = [ "x" , "x" ] ; }

	// f is 2D array
	// if either ind. var. is t, one/both elements of f will be a 2D array also (parametric plot)

	indVar[0] = indVar[0].replace ( /\s*/g , "" ) ;
	indVar[1] = indVar[1].replace ( /\s*/g , "" ) ;

	if ( indVar[0] == "t" ) {
		// f[0] is a 2D array
		if ( f[0].length != 2 ) {
			return new Astex.Error ( "parametric plot requires array of 2 functions" , "Astex.Canvas.prototype.fillBetweenFunctions" ) ;
		}
		if ( typeof f[0][0] == "string" ) {
			f[0][0] = Astex.Math.ascii2JS ( f[0][0] ) ;
		}
		if ( typeof f[0][1] == "string" ) {
			f[0][1] = Astex.Math.ascii2JS ( f[0][1] ) ;
		}

	}
	else if ( typeof f[0] == "string" ) {
		f[0] = Astex.Math.ascii2JS ( f[0] ) ;
	}

	if ( indVar[1] == "t" ) {
		// f[1] is a 2D array
		if ( f[1].length != 2 ) {
			return new Astex.Error ( "parametric plot requires array of 2 functions" , "Astex.Canvas.prototype.fillBetweenFunctions" ) ;
		}
		if ( typeof f[1][0] == "string" ) {
			f[1][0] = Astex.Math.ascii2JS ( f[1][0] ) ;
		}
		if ( typeof f[1][1] == "string" ) {
			f[1][1] = Astex.Math.ascii2JS ( f[1][1] ) ;
		}

	}
	else if ( typeof f[1] == "string" ) {
		f[1] = Astex.Math.ascii2JS ( f[1] ) ;
	}


	//alert ( indVar ) ;
	//alert ( f ) ;
	//alert ( min ) ;
	//alert ( max ) ;
	//alert ( f[0] ) ;

	// if min/max are zero, testing !0 is true
	// having trouble with user's plot(s) (namely when min=0)

	var X = new Array ( ) ;
	var Y = new Array ( ) ;
	var step = 0 ;

	// process index 0 of arrays
	indVar[0] = indVar[0].replace ( /\s*/g , "" ) ;
	switch ( indVar[0] ) {

		case "x" :
			//alert ( "111" ) ;
			//alert ( typeof min[0] + " " + typeof max[0] ) ;
			if ( typeof min[0] != "number" ) { min[0] = this.xmin ; }
			if ( typeof max[0] != "number" ) { max[0] = this.xmax ; }
			min[0] = parseFloat ( min[0] ) ;
			max[0] = parseFloat ( max[0] ) ;
			step = this.xstep ;

			//max[0] += step ;
			for ( var x = min[0] ; x < max[0] ; x += step ) {
				var y ;
				if ( typeof f[0] == "string" ) {
					y = eval ( f[0] ) ;
					y = eval ( y ) ;			// not sure why i need to eval() twice ???
					//alert ( x + "," + y ) ;
				}
				else {
					y = f[0] ( x ) ;					// f is a function
				}
				if ( y >= this.ymin && y <= this.ymax ) {
					X.push ( x ) ;
					Y.push ( y ) ;
				}
			}

			break ;

		case "y" :
			if ( typeof min[0] != "number" ) { min[0] = this.xmin ; }
			if ( typeof max[0] != "number" ) { max[0] = this.xmax ; }
			min[0] = parseFloat ( min[0] ) ;
			max[0] = parseFloat ( max[0] ) ;
			step = this.ystep ;

			//max[0] += step ;
			for ( var y = min[0] ; y < max[0] ; y += step ) {
				var x ;
				if ( typeof f[0] == "string" ) {
					x = eval ( f[0] ) ;
					x = eval ( x ) ;
				}
				else {
					x = f[0] ( y ) ;					// f is a function
				}
				if ( x >= this.xmin && x <= this.xmax ) {
					X.push ( x ) ;
					Y.push ( y ) ;
				}
			}

			break ;

		case "theta" :
			if ( typeof min[0] != "number" ) { min[0] = this.xmin ; }
			if ( typeof max[0] != "number" ) { max[0] = this.xmax ; }
			min[0] = parseFloat ( min[0] ) ;
			max[0] = parseFloat ( max[0] ) ;
			step = this.thetastep ;

			//max[0] += step ;
			for ( var theta = min[0] ; theta < max[0] ; theta += step ) {
				var r ;
				if ( typeof f[0] == "string" ) {
					r = eval ( f[0] ) ;
					r = eval ( r ) ;
				}
				else {
					r = f[0] ( theta ) ;					// f is a function
				}
				if ( Math.abs(r) >= this.rmin && Math.abs(r) <= this.rmax ) {
					X.push ( r * Astex.Math.cos(theta) ) ;
					Y.push ( r * Astex.Math.sin(theta) ) ;
				}
			}

			break ;

		case "r" :
			if ( typeof min[0] != "number" ) { min[0] = this.xmin ; }
			if ( typeof max[0] != "number" ) { max[0] = this.xmax ; }
			min[0] = parseFloat ( min[0] ) ;
			max[0] = parseFloat ( max[0] ) ;
			step = this.rstep ;

			//max[0] += step ;
			for ( var r = min[0] ; r < max[0] ; r += step ) {
				var theta ;
				if ( typeof f[0] == "string" ) {
					theta = eval ( f[0] ) ;
					theta = eval ( theta ) ;
				}
				else {
					theta = f[0] ( r ) ;					// f is a function
				}
				if ( theta >= this.thetamin && theta <= this.thetamax ) {
					X.push ( r * Astex.Math.cos(theta) ) ;
					Y.push ( r * Astex.Math.sin(theta) ) ;
				}
			}

			break ;

		case "t" :
			//alert ( "parametric" ) ;
			if ( typeof min[0] != "number" ) { min[0] = Astex.Math.min(this.xmin,this.ymin) ; }
			if ( typeof max[0] != "number" ) { max[0] = Astex.Math.max(this.xmax,this.ymax) ; }
			min[0] = parseFloat ( min[0] ) ;
			max[0] = parseFloat ( max[0] ) ;
			step = Astex.Math.min(this.xstep,this.ystep) ;

			//max[0] += step ;
			for ( var t = min[0] ; t < max[0] ; t += step ) {
				var x , y ;
				if ( typeof f[0][0] == "string" ) {
					x = eval ( f[0][0] ) ;
				}
				else {
					x = f[0][0] ( t ) ;					// f[0][0] is a function
				}

				if ( typeof f[0][1] == "string" ) {
					y = eval ( f[0][1] ) ;
				}
				else {
					y = f[0][1] ( t ) ;					// f[0][1] is a function
				}

				if ( x >= this.xmin && x <= this.xmax && y >= this.ymin && y <= this.ymax ) {
					X.push ( x ) ;
					Y.push ( y ) ;
				}
			}

			break ;

		default :
			return new Astex.Warning ( "unrecognized 1st ind. var." , "Astex.Canvas.fillBetweenFunctions" ) ;
			break ;

	}

	// process index 1 of arrays
	// note that the for loops step downwards from max to min (except for parametric plots)
	indVar[1] = indVar[1].replace ( /\s*/g , "" ) ;
	switch ( indVar[1] ) {

		case "x" :
			//alert ( "111" ) ;
			if ( typeof min[1] != "number" ) { min[1] = this.xmin ; }
			if ( typeof max[1] != "number" ) { max[1] = this.xmax ; }
			min[1] = parseFloat ( min[1] ) ;
			max[1] = parseFloat ( max[1] ) ;
			step = this.xstep ;

			//min[1] -= step ;
			for ( var x = max[1] ; x > min[1] ; x -= step ) {
				var y ;
				if ( typeof f[1] == "string" ) {
					y = eval ( f[1] ) ;
					y = eval ( y ) ;
				}
				else {
					y = f[1] ( x ) ;					// f is a function
				}
				if ( y >= this.ymin && y <= this.ymax ) {
					X.push ( x ) ;
					Y.push ( y ) ;
				}
			}

			break ;

		case "y" :
			if ( typeof min[1] != "number" ) { min[1] = this.xmin ; }
			if ( typeof max[1] != "number" ) { max[1] = this.xmax ; }
			min[1] = parseFloat ( min[1] ) ;
			max[1] = parseFloat ( max[1] ) ;
			step = this.ystep ;

			//min[1] -= step ;
			for ( var y = max[1] ; y > min[1] ; y -= step ) {
				var x ;
				if ( typeof f[1] == "string" ) {
					x = eval ( f[1] ) ;
					x = eval ( x ) ;
				}
				else {
					x = f[1] ( y ) ;					// f is a function
				}
				if ( x >= this.xmin && x <= this.xmax ) {
					X.push ( x ) ;
					Y.push ( y ) ;
				}
			}

			break ;

		case "theta" :
			if ( typeof min[1] != "number" ) { min[1] = this.xmin ; }
			if ( typeof max[1] != "number" ) { max[1] = this.xmax ; }
			min[1] = parseFloat ( min[1] ) ;
			max[1] = parseFloat ( max[1] ) ;
			step = this.thetastep ;

			//min[1] -= step ;
			for ( var theta = max[1] ; theta > min[1] ; theta -= step ) {
				var r ;
				if ( typeof f[1] == "string" ) {
					r = eval ( f[0] ) ;
					r = eval ( r ) ;
				}
				else {
					r = f[1] ( theta ) ;					// f is a function
				}
				if ( Math.abs(r) >= this.rmin && Math.abs(r) <= this.rmax ) {
					X.push ( r * Astex.Math.cos(theta) ) ;
					Y.push ( r * Astex.Math.sin(theta) ) ;
				}
			}

			break ;

		case "r" :
			if ( typeof min[1] != "number" ) { min[1] = this.xmin ; }
			if ( typeof max[1] != "number" ) { max[1] = this.xmax ; }
			min[1] = parseFloat ( min[1] ) ;
			max[1] = parseFloat ( max[1] ) ;
			step = this.rstep ;

			//min[1] -= step ;
			for ( var r = max[1] ; r > min[1] ; r -= step ) {
				var theta ;
				if ( typeof f[1] == "string" ) {
					theta = eval ( f[1] ) ;
					theta = eval ( theta ) ;
				}
				else {
					theta = f[1] ( r ) ;					// f is a function
				}
				if ( theta >= this.thetamin && theta <= this.thetamax ) {
					X.push ( r * Astex.Math.cos(theta) ) ;
					Y.push ( r * Astex.Math.sin(theta) ) ;
				}
			}

			break ;

		case "t" :
			//alert ( "parametric" ) ;
			if ( typeof min[1] != "number" ) { min[1] = Astex.Math.min(this.xmin,this.ymin) ; }
			if ( typeof max[1] != "number" ) { max[1] = Astex.Math.max(this.xmax,this.ymax) ; }
			min[1] = parseFloat ( min[1] ) ;
			max[1] = parseFloat ( max[1] ) ;
			step = Astex.Math.min(this.xstep,this.ystep) ;

			//min[1] -= step ;
			// NOTE: unlike other 2nd ind. var. cases, we do NOT step down from max to min here
			for ( var t = min[1] ; t < max[1] ; t += step ) {
				var x , y ;
				if ( typeof f[1][0] == "string" ) {
					x = eval ( f[1][0] ) ;
				}
				else {
					x = f[1][0] ( t ) ;					// f[1][0] is a function
				}

				if ( typeof f[1][1] == "string" ) {
					y = eval ( f[1][1] ) ;
				}
				else {
					y = f[1][1] ( t ) ;					// f[1][1] is a function
				}

				if ( x >= this.xmin && x <= this.xmax && y >= this.ymin && y <= this.ymax ) {
					X.push ( x ) ;
					Y.push ( y ) ;
				}
			}

			break ;

		default :
			return new Astex.Warning ( "unrecognized 2nd ind. var." , "Astex.Canvas.fillBetweenFunctions" ) ;
			break ;

	}

	this.fillPolygon ( X , Y ) ;
};




// prototype void this.drawFunctionOfX ( String f , Float xmin , Float xmax , Float ymin , Float ymax )
Astex.Canvas.prototype.drawFunctionOfX = function ( f , xmin , xmax , ymin , ymax ) {

	// if xmin/xmax are zero, testing !0 is true

	// having trouble with user's plot(s) (namely when xmin=0)
	if ( typeof xmin != "number" ) { xmin = this.xmin ; }			// why can't i test !xmin when xmin == 0 ??????
	if ( typeof xmax != "number" ) { xmax = this.xmax ; }
	if ( typeof ymin != "number" ) { ymin = this.ymin ; }
	if ( typeof ymax != "number" ) { ymax = this.ymax ; }

	xmin = parseFloat ( xmin ) ;
	xmax = parseFloat ( xmax ) ;
	ymin = parseFloat ( ymin ) ;
	ymax = parseFloat ( ymax ) ;

	var X = new Array ( ) ;
	var Y = new Array ( ) ;
	//for ( var x = xmin ; x <= xmax ; x += this.xstep ) {
	for ( var x = xmin+this.xstep ; x <= xmax ; x += this.xstep ) {

		var y ;
		if ( typeof f == "string" ) {
			y = eval ( Astex.Math.ascii2JS ( f ) ) ;	// translate ascii to JS notation and eval
		}
		else {
			y = f ( x ) ;					// f is a function
		}
		if ( y >= ymin && y <= ymax ) {
			X.push ( x ) ;
			Y.push ( y ) ;
		}
	}
	this.drawPolyLine ( X , Y ) ;
};

// prototype void this.fillBetweenFunctionsOfX ( String topF , String bottomF , Float xmin , Float xmax , Float ymin , Float ymax )
// topF should always be above bottomF (this function does NOT check for this)
Astex.Canvas.prototype.fillBetweenFunctionsOfX = function ( topF , bottomF , xmin , xmax , ymin , ymax ) {

	// if xmin/xmax are zero, testing !0 is true

	// having trouble with user's plot(s) (namely when xmin=0)
	if ( typeof xmin != "number" ) { xmin = this.xmin ; }			// why can't i test !xmin when xmin == 0 ??????
	if ( typeof xmax != "number" ) { xmax = this.xmax ; }
	if ( typeof ymin != "number" ) { ymin = this.ymin ; }
	if ( typeof ymax != "number" ) { ymax = this.ymax ; }

	xmin = parseFloat ( xmin ) ;
	xmax = parseFloat ( xmax ) ;
	ymin = parseFloat ( ymin ) ;
	ymax = parseFloat ( ymax ) ;

	var X = new Array ( ) ;
	var Y = new Array ( ) ;
	//for ( var x = xmin ; x <= xmax ; x += this.xstep ) {
	for ( var x = xmin+this.xstep ; x <= xmax ; x += this.xstep ) {

		var y ;
		if ( typeof topF == "string" ) {
			y = eval ( Astex.Math.ascii2JS ( topF ) ) ;	// translate ascii to JS notation and eval
		}
		else {
			y = topF ( x ) ;					// topF is a function
		}
		if ( y >= ymin && y <= ymax ) {
			X.push ( x ) ;
			Y.push ( y ) ;
		}
	}

	// reverse direction on x-axis and draw bottomF
	for ( var x = xmax ; x >= xmin ; x -= this.xstep ) {

		var y ;
		if ( typeof bottomF == "string" ) {
			y = eval ( Astex.Math.ascii2JS ( bottomF ) ) ;	// translate ascii to JS notation and eval
		}
		else {
			y = bottomF ( x ) ;					// bottomF is a function
		}
		if ( y >= ymin && y <= ymax ) {
			X.push ( x ) ;
			Y.push ( y ) ;
		}
	}

	this.fillPolygon ( X , Y ) ;
};

// prototype void this.drawArcOfCircle ( Float[] center , Float radius , Float startAngle , Float endAngle )
Astex.Canvas.prototype.drawArcOfCircle = function ( center , radius , startAngle , endAngle ) {
	// std eqn of circle is (x-h)^2 + (y-k)^2 = r^2
	// center (h,k)
	// radius r 
	var h = center[0] ;
	var k = center[1] ;
	startAngle = startAngle * Math.PI / 180 ;
	endAngle = endAngle * Math.PI / 180 ;
	var X = new Array ( ) ;
	var Y = new Array ( ) ;
	for ( var theta = startAngle ; theta <= endAngle ; theta += this.thetastep ) {
		var x = radius * Math.cos ( theta ) + h ;
		var y = radius * Math.sin ( theta ) + k ;
		if ( y >= this.ymin && y <= this.ymax && x >= this.xmin && x <= this.xmax ) {
			X.push ( x ) ;
			Y.push ( y ) ;
		}
	}
	this.drawPolyLine ( X , Y ) ;
};

// prototype void this.drawCircle ( Float[] center , Float radius , Float startAngle , Float endAngle )
Astex.Canvas.prototype.drawCircle = function ( center , radius , startAngle , endAngle ) {
	if ( startAngle != null && endAngle != null ) {
		//this.drawArcOfCircle ( center , radius , startAngle , endAngle ) ;

		// maybe us drawFunction to graph this ???
	}
	else {
		//this.drawEllipse ( center , radius , radius ) ;
		var h = center[0] ;
		var k = center[1] ;
		var r = radius ;
		var path = new Astex.SVGPath ( ) ;
		path.moveTo ( h + r , k + 0 ) ; 
		path.arcTo ( h + 0 , k + r ) ; 
		path.arcTo ( h - r , k - 0 ) ; 
		path.arcTo ( h - 0 , k - r ) ;
		path.close ( ) ;
		this.drawSVGPath ( path.getPath() , false ) ;
	}
};

// prototype void this.fillCircle ( Float[] center , Float radius , Float startAngle , Float endAngle )
Astex.Canvas.prototype.fillCircle = function ( center , radius , startAngle , endAngle ) {
	if ( startAngle != null && endAngle != null ) {
		//this.fillArc ( center , radius , radius , startAngle , endAngle ) ;

		// maybe us drawFunction to graph this ???
	}
	else {
		//this.fillEllipse ( center , radius , radius ) ;
		var h = center[0] ;
		var k = center[1] ;
		var r = radius ;
		var path = new Astex.SVGPath ( ) ;
		var path = new Astex.SVGPath ( ) ;
		path.moveTo ( h + r , k + 0 ) ; 
		path.arcTo ( h + 0 , k + r ) ; 
		path.arcTo ( h - r , k - 0 ) ; 
		path.arcTo ( h - 0 , k - r ) ;
		path.close ( ) ;
		this.drawSVGPath ( path.getPath() , true ) ;
	}
};

// prototype void this.drawVerticalLine ( Array[] point )
// draws a vertical line through the point
Astex.Canvas.prototype.drawVerticalLine = function ( point ) {
	var x = point[0] ;
	this.drawLine ( x , this.ymin , x , this.ymax ) ;
};

// prototype void this.drawHorizontalLine ( Array[] point )
// draws a horizontal line through the point
Astex.Canvas.prototype.drawHorizontalLine = function ( point ) {
	var y = point[1] ;
	this.drawLine ( this.xmin , y , this.xmax , y ) ;
};

// prototype void this.drawAxes ( )
Astex.Canvas.prototype.drawAxes = function ( ) {
	if ( this.ymin <= 0 && this.ymax >= 0 ) {
		this.drawHorizontalLine ( [0,0] ) ;	// x-axis
	}
	if ( this.xmin <= 0 && this.xmax >= 0 ) {
		this.drawVerticalLine ( [0,0] ) ;	// y-axis
	}
};

// prototype void this.drawGrid ( String type )
Astex.Canvas.prototype.drawGrid = function ( type ) {
	if ( ! type ) { type = "rect" ; }
	type = type.toLowerCase ( ) ;
	if ( type == "rect" || type == "rectangle" ) {
		for ( var x = 0 ; x >= this.xmin ; x -= this.xscale ) {
			this.drawVerticalLine ( [x,0] ) ;
		}
		for ( var x = this.xscale ; x <= this.xmax ; x += this.xscale ) {
			this.drawVerticalLine ( [x,0] ) ;
		}
		for ( var y = 0 ; y >= this.ymin ; y -= this.yscale ) {
			this.drawHorizontalLine ( [0,y] ) ;
		}
		for ( var y = this.yscale ; y <= this.ymax ; y += this.yscale ) {
			this.drawHorizontalLine ( [0,y] ) ;
		}
	}
	else if ( type == "polar" ) {
		for ( var r = this.rscale ; r <= this.rmax ; r += this.rscale ) {
			this.drawCircle ( [0,0] , r ) ;
		}
		// lines which should be on x-axis are not, probably due to decimal nature of thetascale
		for ( var theta = 0 ; theta < 2 * Astex.Math.pi ; theta += this.thetascale ) {
			// chop off theta after 2 decimal places
			//theta = Astex.Math.chop ( theta , 2 ) ;
			// chop off theta after 4 decimal places
			theta = Astex.Math.chop ( theta , 4 ) ;		// need more than 2 decimal places for proper placemnt of lines
			this.drawLine ( 0 , 0 , this.rmax * Astex.Math.cos(theta) , this.rmax * Astex.Math.sin(theta) ) ;
		}
	}
};

// prototype void this.drawBorder ( )
Astex.Canvas.prototype.drawBorder = function ( ) {
	// draw a rectangular border around grid
	this.drawRect ( this.xmin , this.ymin , (this.xmax-this.xmin) , (this.ymax-this.ymin) ) ;
};

// prototype void this.drawAxesLabels ( String xLabel , String yLabel )
Astex.Canvas.prototype.drawAxesLabels = function ( xLabel , yLabel ) {
	if ( xLabel == null ) {
		xLabel = "x" ;
	}
	if ( yLabel == null ) {
		yLabel = "y" ;
	}
	this.drawString ( xLabel , this.xmax + this.xstep , 0 ) ;
	this.drawString ( yLabel , 0 , this.ymax + this.ystep ) ;
};

// prototype void this.drawTickMarks ( Boolean label )
Astex.Canvas.prototype.drawTickMarks = function ( label ) {
	if ( ! label ) {
		label = false ;
	}
	if ( typeof label != "boolean" ) {
		new Astex.Error ( "Needs a boolean or null argument." , "Astex.Canvas.prototype.drawTickMarks" ) ;
	}
	for ( var x = 0 ; x >= this.xmin ; x -= this.xscale ) {
		//this.drawLine ( x , 0.3 * this.yscale , x , -0.3 * this.yscale ) ;
		this.drawPoint ( [x,0] , "|" ) ;
		if ( label && x != 0 ) {
			//this.drawString ( x  , x - 0.1 * this.xscale , -1.2 * this.yscale ) ;
			this.drawString ( x  , x - 0.5 * this.xscale , 0 - 0.25 * this.yscale ) ;
		}
	}
	for ( var x = this.xscale ; x <= this.xmax ; x += this.xscale ) {
		//this.drawLine ( x , 0.3 * this.yscale , x , -0.3 * this.yscale ) ;
		this.drawPoint ( [x,0] , "|" ) ;
		if ( label && x != 0 ) {
			//this.drawString ( x  , x - 0.2 * this.xscale , -1.2 * this.yscale ) ;
			this.drawString ( x  , x - 0.3 * this.xscale , 0 - 0.25 * this.yscale ) ;
		}
	}
	for ( var y = 0 ; y >= this.ymin ; y -= this.yscale ) {
		//this.drawLine ( 0.3 * this.xscale , y , -0.3 * this.xscale , y ) ;
		this.drawPoint ( [0,y] , "-" ) ;
		if ( label && y != 0 ) {
			//this.drawString ( y  , -0.5 * this.xscale , y - 0.5 * this.yscale ) ;
			this.drawString ( y  , -this.xscale , y + 0.25 * this.yscale ) ;
		}
	}
	for ( var y = this.yscale ; y <= this.ymax ; y += this.yscale ) {
		//this.drawLine ( 0.3 * this.xscale , y , -0.3 * this.xscale , y ) ;
		this.drawPoint ( [0,y] , "-" ) ;
		if ( label && y != 0 ) {
			//this.drawString ( y  , -0.5 * this.xscale , y - 0.5 * this.yscale ) ;
			this.drawString ( y  , -this.xscale , y + 0.25 * this.yscale ) ;
		}
	}
};

// prototype: this.drawHistogram ( Astex.DataList list , Int numClasses , Boolean fill , Boolean relFreq );
Astex.Canvas.prototype.drawHistogram = function ( list , numClasses , fill , relFreq ) {

	//alert ( numClasses ) ;
	//alert ( typeof numClasses ) ;

	if ( list.type != Astex.DataList.Quantitative ) { return ; }
	if ( ! relFreq ) { relFreq = false ; }
	if ( ! fill ) { fill = false ; }
	if ( numClasses < 2 ) { numClasses = 2 ; }

	//alert ( list.list.length ) ;

	//alert ( list.max ) ;
	//alert ( list.min ) ;
	var classWidth = Astex.Math.ceil ( ( list.max - list.min ) / numClasses ) ;	
	//alert ( classWidth ) ;
	//alert ( typeof classWidth ) ;
	if ( list.max - list.min < 1 ) {
		classWidth = ( list.max - list.min ) / numClasses ;
	}
	//alert ( classWidth ) ;

	//alert ( list.list ) ;

	var lowerLimits = new Array ( ) ;
	var upperLimits = new Array ( ) ;
	for ( var x = list.min ; x < list.max ; x += classWidth ) {
	//for ( var x = list.min , i = 0 ; i < numClasses ; x += classWidth , i++ ) {

		//alert ( typeof x ) ;
		lowerLimits.push ( x ) ;
		upperLimits.push ( x + classWidth - 1 ) ;
	}

	// calculate step
	var step = ( lowerLimits[1] - upperLimits[0] ) / 2 ;
	//alert ( step ) ;

	// draw rectangles of height freq ( lower limit , upper limit )
	// width goes from x = lower limit - step to x = upper limit + step
	for ( var i = 0 ; i < lowerLimits.length ; i++ ) {

		var lower = lowerLimits[i] ;
		var upper = upperLimits[i] ;
		var mid = lower + ( upper - lower ) / 2 ;
		var height ;
		if ( fill ) {
			if ( relFreq ) {
				height = list.freq ( lower - step , upper + step ) / list.sampleSize ;
			}
			else {
				height = list.freq ( lower - step , upper + step ) ;
			}
			this.fillRect ( lower - step , 0 , classWidth , height ) ;
		}
		else {
			if ( relFreq ) {
				height = list.freq ( lower - step , upper + step ) / list.sampleSize ;
			}
			else {
				height = list.freq ( lower - step , upper + step ) ;
			}
			this.drawRect ( lower - step , 0 , classWidth , height ) ;
		}

		//
		// maybe these should be separate methods ???
		//
		// should we also display statistics of list - sample size , min , max , range , median , mean (, mode) ???
		// std. dev.
		//

		// draw numeric height above bar
		if ( relFreq ) {
			this.drawString ( Astex.Math.chop(height,2) , mid - 4*step , height + 20 * this.ystep ) ;
		}
		else {
			this.drawString ( height , mid - 2*step , height + 20 * this.ystep ) ;
		}
		// draw lower limits on x-axis
		this.drawString ( lower - step , lower - 3*step , -10 * this.ystep ) ;
	}
	// draw last uppr limit
	var upper = upperLimits[upperLimits.length-1] ;
	this.drawString ( upper + step , upper - 3*step , -10 * this.ystep ) ;

	// tick labels y-axes
	// drawn from left of xmin NOT to left of y-axis !!!
	if ( relFreq ) {
		for ( var y = 0 ; y <= this.ymax ; y += this.yscale ) {
			this.drawString ( Astex.Math.chop(y+0.005,2)  , this.xmin + this.xstep , y + 7 * this.ystep ) ;
		}
		for ( var y = -this.yscale ; y >= this.ymin ; y -= this.yscale ) {
			this.drawString ( Astex.Math.chop(y+0.005,2)  , this.xmin + this.xstep , y + 7 * this.ystep ) ;
		}
	}
	else {
		for ( var y = 0 ; y <= this.ymax ; y += this.yscale ) {
			this.drawString ( y  , this.xmin + this.xstep , y + 7 * this.ystep ) ;
		}
		for ( var y = -this.yscale ; y >= this.ymin ; y -= this.yscale ) {
			this.drawString ( y  , this.xmin + this.xstep , y + 7 * this.ystep ) ;
		}
	}
	// tick labels x-axes
	for ( var x = 0 ; x <= this.xmax ; x += this.xscale ) {
		this.drawString ( x  , x - 5 * this.xstep , -30 * this.ystep ) ;
	}
	for ( var x = - this.xscale ; x >= this.xmin ; x -= this.xscale ) {
		this.drawString ( x  , x - 8 * this.xstep , -30 * this.ystep ) ;
	}
};

// prototype void this.drawSymbol ( String name , Array[] anchor , Float xFactor , Float yFactor , rotate , scewX )
// the symbol's drawCommand attribute is a string of zero or more fill and at least one svg commands
// the svg command will be translated into the current canvas' drawSVGPath method with the
// appropriate fill attribute
Astex.Canvas.prototype.drawSymbol = function ( name , anchor , xFactor , yFactor , rotate , scewX ) {

	if ( ! anchor ) anchor = [0,0] ;
	if ( ! xFactor || typeof xFactor != "number" ) xFactor = 1 ;	
	if ( ! yFactor || typeof yFactor != "number" ) yFactor = 1 ;
	if ( ! rotate || typeof rotate != "number" ) rotate = 0 ;
	if ( ! scewX || typeof scewX != "number" ) scewX = 0 ;

	// set-up the transforms to perform on the svg path
	Astex.SVGPath.clearTransforms ( ) ;
	Astex.SVGPath.addTransform ( {op:Astex.SVGPath.SCEWX,theta:scewX,measure:Astex.SVGPath.DEGREES} ) ;	// scew before translating
	Astex.SVGPath.addTransform ( {op:Astex.SVGPath.SCALE,fx:xFactor,fy:yFactor} ) ;				// scale before translating
	Astex.SVGPath.addTransform ( {op:Astex.SVGPath.TRANSLATE,dx:anchor[0],dy:anchor[1]} ) ;
	Astex.SVGPath.addTransform ( {op:Astex.SVGPath.ROTATE,angle:rotate,measure:Astex.SVGPath.DEGREES,point:[anchor[0],anchor[1]]} ) ;

	var symbol = Astex.Symbol.getSymbol ( name ) ;
	var commands = symbol.drawCommands ;
	commands = commands.replace ( /\s/g , "" ) ;		// remove whitespace
	if ( ! commands.match(/svg/) ) {
		return new Astex.Error ( "Expecting an svg command." , "Astex.Canvas.prototype.drawSymbol" ) ;
	}
	var fill = false ;

	var str = "" + commands ;
	var svgIndex = 0 ;
	var lastIndex = 0 ;
	while ( (svgIndex=str.indexOf("svg("),lastIndex) != -1 ) {

		// i shouldn't need this, but i do
		if ( ! str.match(/svg\(/) ) { break ; }

		// create a string representing the canvas' drawSVGPath method call
		var tmp = "this.drawSVGPath(\"" ;

		// get index of first ); after svgIndex
		var endIndex = str.indexOf ( ");" , svgIndex ) ;
		if ( endIndex == -1 ) {
			return new Astex.Error ( "Missing closing );" , "Astex.Canvas.prototype.drawSymbol" ) ;
		}
		// 'svg(' is 4 characters
		tmp += str.substring ( svgIndex + 4 , endIndex ) ;

		tmp += "\", fill );" ;

		// replace the svg(); command with the drawSVGPath() call
		// ');' is 2 characters
		str = str.substring ( 0 , svgIndex ) + tmp + str.substring ( endIndex + 2 ) ;
		lastIndex = svgIndex + tmp.length ;
		//lastIndex = svgIndex + 1 ;
	}
	//commands = str ;
	//eval ( commands ) ;
	eval ( str ) ;
	Astex.SVGPath.clearTransforms ( ) ;		// IMPORTANT. Otherwise underline doesn't work in Astex.MathML

};

// prototype void this.drawSymbolString ( String str , Float[] anchor , Float xFactor , Float yFactor , rotate , scewX )
Astex.Canvas.prototype.drawSymbolString = function ( str , anchor , xFactor , yFactor , rotate , scewX ) {

	if ( ! str || str == "" ) {
		return new Astex.Warning ( "str is null or empty" , "Astex.Canvas.prototype.drawSymbolString()" ) ;
		//return ;		// fail gracefully
	}

	if ( ! anchor ) anchor = [0,0] ;
	if ( ! xFactor || typeof xFactor != "number" ) xFactor = 1 ;	
	if ( ! yFactor || typeof yFactor != "number" ) yFactor = 1 ;	
	if ( ! rotate || typeof rotate != "number" ) rotate = 0 ;
	if ( ! scewX || typeof scewX != "number" ) scewX = 0 ;

	while ( str.length > 0 ) {
		var name = Astex.Symbol.getMaximalSymbolName ( str ) ;
		if ( ! name ) { name = "" ; }
		this.drawSymbol ( name , anchor , xFactor , yFactor , rotate , scewX ) ;
		var symbol = Astex.Symbol.getSymbol ( name ) ;
		//str = str.slice ( name.length ) ;
		if ( name == "" ) { str = str.slice(1) ; }
		else { str = str.slice(name.length) ; }
		/*
		if ( str.length > 0 ) {
			// put a little padding after symbol
			anchor[0] += symbol.getWidth ( xFactor ) + Astex.Symbol.getSpaceWidthBetweenSymbols ( xFactor ) ;
		}
		else {
			anchor[0] += symbol.getWidth ( xFactor ) ;
		}
		*/
		anchor[0] += symbol.getWidth ( xFactor ) + Astex.Symbol.getSpaceWidthBetweenSymbols ( xFactor ) ;
	}
};

// prototype void this.drawSymbolChars ( String str , Float[] anchor , Float xFactor , Float yFactor , rotate , scewX )
// process str one character (NOT one symbol) at a time and draws it
// this will be useful for drawing non-mathematical text (e.g. draw "in" instead of math "in" symbol when user input is 'in')
Astex.Canvas.prototype.drawSymbolChars = function ( str , anchor , xFactor , yFactor , rotate , scewX ) {

	if ( ! str || str == "" ) {
		return new Astex.Warning ( "str is null or empty" , "Astex.Canvas.prototype.drawSymbolChars()" ) ;
		//return ;		// fail gracefully
	}

	if ( ! anchor ) anchor = [0,0] ;
	if ( ! xFactor || typeof xFactor != "number" ) xFactor = 1 ;	
	if ( ! yFactor || typeof yFactor != "number" ) yFactor = 1 ;	
	if ( ! rotate || typeof rotate != "number" ) rotate = 0 ;
	if ( ! scewX || typeof scewX != "number" ) scewX = 0 ;

	for ( var i = 0 ; i < str.length ; i++ ) {
		var ch = str.charAt(i) ;
		// if ch is whitespace, move anchor to the right
		if ( ch.match(/\s/) ) {
			anchor = [ anchor[0] + Astex.Symbol.getSpaceWidth(xFactor) , anchor[1] ] ;
		}
		else {
			this.drawSymbol ( ch , anchor , xFactor , yFactor , rotate , scewX ) ;
			var symbol = Astex.Symbol.getSymbol ( name ) ;
			anchor[0] += symbol.getWidth ( xFactor ) + Astex.Symbol.getSpaceWidthBetweenSymbols ( xFactor ) ;
		}
	}
};

// prototype void this.drawAllSymbols ( Float[] anchor , Float xFactor , Float yFactor )
Astex.Canvas.prototype.drawAllSymbols = function ( anchor , xFactor , yFactor ) {

	//if ( ! anchor ) anchor = [0,0] ;
	//if ( ! xFactor || typeof xFactor != "number" ) xFactor = 1 ;
	//if ( ! yFactor || typeof yFactor != "number" ) yFactor = 1 ;
	if ( ! anchor ) anchor = [-10,7] ;
	if ( ! xFactor || typeof xFactor != "number" ) xFactor = 1 ;
	if ( ! yFactor || typeof yFactor != "number" ) yFactor = 1 ;

	/*
	var symbols = Astex.Symbol.Symbols ;
	var str = "" ;
	for ( var i = 0 ; i < symbols.length ; i++ ) {
		var symbol = symbols [ i ] ;
		var names = symbol.names ;
		for ( var j = 0 ; j < names.length ; j++ ) {
			str += names[j] ;	
		}
	}
	this.drawSymbolString ( str , anchor , xFactor , yFactor ) ;
	*/

	/*
	var symbols = Astex.Symbol.Symbols ;
	var tmp = anchor [ 0 ] ;
	for ( var i = 0 ; i < symbols.length ; i++ ) {
		var symbol = symbols [ i ] ;
		var names = symbol.names ;
		for ( var j = 0 ; j < names.length ; j++ ) {
			this.drawString ( names[j] , anchor[0] + 5 , anchor[1] ) ;
			this.drawSymbolString ( names[j] , anchor , xFactor , yFactor ) ;
			anchor[0] = tmp ;
			//anchor[1] -= ( symbol.ascending + symbol.descending + 0.5) * yFactor ;
			anchor[1] -= ( 6 + 0.5) * yFactor ;
		}
	}
	*/


	var names = Astex.Symbol.SymbolNames ;
	var tmp = anchor [ 0 ] ;
	for ( var i = 0 ; i < names.length ; i++ ) {
		this.drawString ( names[i] , anchor[0] + 5 , anchor[1] ) ;
		this.drawSymbolString ( names[i] , anchor , xFactor , yFactor ) ;
		anchor[0] = tmp ;
		//anchor[1] -= ( symbol.ascending + symbol.descending + 0.5) * yFactor ;
		anchor[1] -= ( 6 + 0.5) * yFactor ;
	}
};


/*
// prototype void this.drawToken ( String input , Array[] anchor , Float xFactor , Float yFactor )
// draws token on canvas and sets the dimensions of the token
Astex.Canvas.prototype.drawToken = function ( input , anchor , xFactor , yFactor ) {

	if ( ! anchor ) anchor = [0,0] ;
	if ( ! xFactor || typeof xFactor != "number" ) xFactor = 1 ;
	if ( ! yFactor || typeof yFactor != "number" ) yFactor = 1 ;

	var token = Astex.Token.getToken ( input ) ;

	var commands = token.drawCommands ;
	//var commands = token.drawCommands ? token.drawCommands : "" ;
	//alert ( token.output2 ) ;
	//var commands = token.output2 ? "text(" + token.output2 + ");" : "text();" ;
	commands = commands.replace ( /\s/g , "" ) ;		// remove whitespace

	// text -> drawSymbolString
	// the below command does NOT work as thought, a 2-unit 'space' appears between tokens
	//commands = commands.replace ( /text\((.*)\);/g , "this.drawSymbolString(\"$1\",anchor,xFactor,yFactor);" ) ;
	// this works !!!
	commands = commands.replace ( /text\((.*)\);/g , "this.drawSymbolString(\"$1\",["+anchor[0]+","+anchor[1]+"],"+xFactor+","+yFactor+");" ) ;
	//alert ( commands ) ;
	eval ( commands ) ;		// this draws the token on the canvas

	// calculate the dimensions of the token
	// this will be needed when drawing token strings
	if ( token.dimensionsCalculated ) { return ; }
	if ( ! token.drawCommands ) { return ; }
	if ( ! token.drawCommands.match ( /text\((.*)\);/g ) ) { return ; }
	var tmpStr = token.drawCommands.replace ( /text\((.*)\);/g , "$1" ) ;
	if ( token.width == 0 ) {
		token.width = Astex.Symbol.getSymbolStringWidth ( tmpStr , 1 ) ;
	}
	if ( token.ascending == 0 ) {
		token.ascending = Astex.Symbol.getSymbolStringAscent ( tmpStr , 1 ) ;
	}
	if ( token.descending == 0 ) {
		token.descending = Astex.Symbol.getSymbolStringDescent ( tmpStr , 1 ) ;
	}
	token.dimensionsCalculated = true ;

	// update max dimensions for Astex.Token class
	if ( token.width > Astex.Token.maxWidth ) {
		Astex.Token.maxWidth = token.width ;
	}
	if ( token.ascending > Astex.Token.maxAscent ) {
		Astex.Token.maxAscent = token.ascending ;
	}
	if ( token.descending > Astex.Token.maxDescent ) {
		Astex.Token.maxDescent = token.descending ;
	}

};

// prototype void this.drawTokenString ( String str , Float[] anchor , Float xFactor , Float yFactor )
Astex.Canvas.prototype.drawTokenString = function ( str , anchor , xFactor , yFactor ) {

	if ( ! anchor ) anchor = [0,0] ;
	if ( ! xFactor || typeof xFactor != "number" ) xFactor = 1 ;
	if ( ! yFactor || typeof yFactor != "number" ) yFactor = 1 ;

	while ( str.length > 0 ) {

		var name = Astex.Token.getMaximalTokenName ( str ) ;
		if ( name == null ) { return ; }
		this.drawToken ( name , anchor , xFactor , yFactor ) ;		// this will also set token dimensions
		var token = Astex.Token.getToken ( name ) ;
		//anchor[0] += token.getWidth(xFactor) + 5*this.xstep * xFactor ;
		anchor[0] += token.getWidth(xFactor) ;
		//anchor[0] += token.getWidth(xFactor) + 1*this.xstep * xFactor ;
		if ( ! name ) { name = "" ; }
		str = str.slice ( name.length ) ;
	}
};

// prototype void this.drawFraction ( String num , String den , Float[] anchor , Float xFactor , Float yFactor )
Astex.Canvas.prototype.drawFraction = function ( num , den , anchor , xFactor , yFactor ) {
	if ( ! anchor ) anchor = [0,0] ;
	if ( ! xFactor || typeof xFactor != "number" ) xFactor = 1 ;
	if ( ! yFactor || typeof yFactor != "number" ) yFactor = 1 ;

	var dx = 0 ;			// used to center numerators and denominators

	// widths and heights are based upon 1/2 of the appropriate xFactor/yFactor
	var numWidth = Astex.Token.getTokenStringWidth ( num , xFactor/2 ) ;
	var denWidth = Astex.Token.getTokenStringWidth ( den , xFactor/2 ) ;
	var maxWidth = numWidth >= denWidth ? numWidth : denWidth ;
	maxWidth += 0.5 * xFactor ;
	var denHeight = Astex.Token.getTokenStringAscent ( den , yFactor/2 ) ;

	// draw fraction bar
	// note that we draw the line 2 * yFactor * this.ystep units above the denominator's height
	this.drawLine ( anchor[0] , anchor[1] + denHeight + 2 * this.ystep * yFactor , anchor[0] + maxWidth , anchor[1] + denHeight + 2 * this.ystep * yFactor ) ; 
	// center numerator
	dx = 0 ;
	if ( numWidth < maxWidth ) {
		dx = ( maxWidth - numWidth ) / 2 ;
	}
	// draw numerator (above fraction bar)
	// note that we draw the token string 4 * yFactor * this.ystep units above the denominator's height
	// which as actually 2*yFactor*this.ystep units above the fraction bar
	this.drawTokenString ( num , [anchor[0]+dx,anchor[1]+(denHeight+4*this.ystep*yFactor)] , xFactor/2 , yFactor/2 ) ;

	// center denominator
	dx = 0 ;
	if ( denWidth < maxWidth ) {
		dx = ( maxWidth - denWidth ) / 2 ;
	}
	// draw denominator (at anchor, w/ x-coordinated centered within fraction)
	this.drawTokenString ( den , [anchor[0]+dx,anchor[1]] , xFactor/2 , yFactor/2 ) ;
};
// prototype void this.drawSup ( String base , String exp , Boolean over , Float[] anchor , Float xFactor , Float yFactor )
Astex.Canvas.prototype.drawSup = function ( base , exp , over , anchor , xFactor , yFactor ) {
	// note, some superscripts will be above/over the symbol ( as in summations and limits )
	// most will be up and to the right
	if ( ! anchor ) anchor = [0,0] ;
	if ( ! over || typeof over != "boolean" ) over = false ;
	if ( ! xFactor || typeof xFactor != "number" ) xFactor = 1 ;
	if ( ! yFactor || typeof yFactor != "number" ) yFactor = 1 ;

	// draw base
	// if i pass anchor instead of [anchor[0],anchor[1]] to drawTokenString, anchor is modified !!! 
	//this.drawTokenString ( base , anchor , xFactor , yFactor ) ;
	this.drawTokenString ( base , [anchor[0],anchor[1]] , xFactor , yFactor ) ;

	var bWidth = Astex.Token.getTokenStringWidth ( base , xFactor ) ;
	var bHeight = Astex.Token.getTokenStringAscent ( base , yFactor ) ;

	//alert ( "bHeight = " + bHeight ) ;

	var eWidth = Astex.Token.getTokenStringWidth ( exp , xFactor/4 ) ;
	//var eHeight = Astex.Token.getTokenStringAscent ( exp , yFactor/4 ) ;

	// draw exponent
	if ( over ) {
		// center the exponent over the base (exponent may be wider than base)
		var dx = ( bWidth - eWidth ) / 2 ;
		// if eWidth > bWidth , then dx < 0 
		// if eWidth < bWidth , then dx > 0 
		// if eWidth == bWidth , then dx = 0 
		this.drawTokenString ( exp , [anchor[0]+dx,anchor[1]+bHeight+2*this.ystep*yFactor] , xFactor/4 , yFactor/4 ) ;
	}
	else {
		this.drawTokenString ( exp , [anchor[0]+bWidth,anchor[1]+bHeight] , xFactor/4 , yFactor/4 ) ;
	}
};

// prototype void this.drawSub ( String base , String sub , Boolean under , Float[] anchor , Float xFactor , Float yFactor )
Astex.Canvas.prototype.drawSub = function ( base , sub , under , anchor , xFactor , yFactor ) {
	// note, some subscripts will be below/under the symbol ( as in summation , limits , etc. )
	// most will be down and to the right
	if ( ! anchor ) anchor = [0,0] ;
	if ( ! under || typeof under != "boolean" ) under = false ;
	if ( ! xFactor || typeof xFactor != "number" ) xFactor = 1 ;
	if ( ! yFactor || typeof yFactor != "number" ) yFactor = 1 ;

	// draw base
	// if i pass anchor instead of [anchor[0],anchor[1]] to drawTokenString, anchor is modified !!! 
	//this.drawTokenString ( base , anchor , xFactor , yFactor ) ;
	this.drawTokenString ( base , [anchor[0],anchor[1]] , xFactor , yFactor ) ;

	var bWidth = Astex.Token.getTokenStringWidth ( base , xFactor ) ;

	var sWidth = Astex.Token.getTokenStringWidth ( sub , xFactor/4 ) ;
	var sHeight = Astex.Token.getTokenStringAscent ( sub , yFactor/4 ) ;

	// draw subscript
	if ( under ) {
		// center the subscript under the base (subscript may be wider than base)
		var dx = ( bWidth - sWidth ) / 2 ;
		// if sWidth > bWidth , then dx < 0 
		// if sWidth < bWidth , then dx > 0 
		// if sWidth == bWidth , then dx = 0 
		this.drawTokenString ( sub , [anchor[0]+dx,anchor[1]-sHeight-2*this.ystep*yFactor] , xFactor/4 , yFactor/4 ) ;
	}
	else {
		this.drawTokenString ( sub , [anchor[0]+bWidth,anchor[1]-sHeight] , xFactor/4 , yFactor/4 ) ;
	}
};


// prototype void this.drawSupSub ( String base , String exp , String sub , Boolean over , Boolean under , Float[] anchor , Float xFactor , Float yFactor )
Astex.Canvas.prototype.drawSupSub = function ( base , exp , sub , over , under , anchor , xFactor , yFactor ) {

	if ( ! anchor ) anchor = [0,0] ;
	if ( ! over || typeof over != "boolean" ) over = false ;
	if ( ! under || typeof under != "boolean" ) under = false ;
	if ( ! xFactor || typeof xFactor != "number" ) xFactor = 1 ;
	if ( ! yFactor || typeof yFactor != "number" ) yFactor = 1 ;

	// draw base
	// if i pass anchor instead of [anchor[0],anchor[1]] to drawTokenString, anchor is modified !!! 
	//this.drawTokenString ( base , anchor , xFactor , yFactor ) ;
	this.drawTokenString ( base , [anchor[0],anchor[1]] , xFactor , yFactor ) ;

	var bWidth = Astex.Token.getTokenStringWidth ( base , xFactor ) ;
	var bHeight = Astex.Token.getTokenStringAscent ( base , yFactor ) ;

	var eWidth = Astex.Token.getTokenStringWidth ( exp , xFactor/4 ) ;
	var eHeight = Astex.Token.getTokenStringAscent ( exp , yFactor/4 ) ;

	var sWidth = Astex.Token.getTokenStringWidth ( sub , xFactor/4 ) ;
	var sHeight = Astex.Token.getTokenStringAscent ( sub , yFactor/4 ) ;

	// draw exponent
	if ( over ) {
		// center the exponent over the base (exponent may be wider than base)
		var dx = ( bWidth - eWidth ) / 2 ;
		// if eWidth > bWidth , then dx < 0 
		// if eWidth < bWidth , then dx > 0 
		// if eWidth == bWidth , then dx = 0 
		this.drawTokenString ( exp , [anchor[0]+dx,anchor[1]+bHeight+2*this.ystep*yFactor] , xFactor/4 , yFactor/4 ) ;
	}
	else {
		this.drawTokenString ( exp , [anchor[0]+bWidth,anchor[1]+bHeight] , xFactor/4 , yFactor/4 ) ;
	}

	// draw subscript
	if ( under ) {
		// center the subscript under the base (subscript may be wider than base)
		var dx = ( bWidth - sWidth ) / 2 ;
		// if sWidth > bWidth , then dx < 0 
		// if sWidth < bWidth , then dx > 0 
		// if sWidth == bWidth , then dx = 0 
		this.drawTokenString ( sub , [anchor[0]+dx,anchor[1]-sHeight-2*this.ystep*yFactor] , xFactor/4 , yFactor/4 ) ;
	}
	else {
		this.drawTokenString ( sub , [anchor[0]+bWidth,anchor[1]-sHeight] , xFactor/4 , yFactor/4 ) ;
	}
};

*/


//
// Astex.Canvas class methods
//

// prototype Astex.Canvas Astex.Canvas.getCanvasByWindowId ( String id )
Astex.Canvas.getCanvasByWindowId = function ( id ) {

	var canvases = Astex.Canvas.Canvases ;
	for ( var i = 0 ; i < canvases.length ; i++ ) {
		var canvas = canvases[i] ;
		if ( canvas.window.id == id ) {
			return canvas ;
		}
	}
	return new Astex.Error ( "No canvas found for window id " + id + "." , "Astex.Canvas.getCanvasByWindowId" ) ;
};

//
// prototype Object Astex.Canvas.getMouseCoordOnCanvas ( Event event , String windowId )
// returns an Object with attributes x and y
// representing the mouse x and y-coordinates on canvas
// this function will be used on mouse-click handlers assigned to each canvas
Astex.Canvas.getMouseCoordOnCanvas = function ( event , windowId ) {

	// fix event
	event = Astex.Util.fixEvent ( event ) ;

	// get canvas and window
	var canvas = Astex.Canvas.getCanvasByWindowId ( windowId ) ;
	var w = canvas.window ;

	// get pixel coordinates
	var point = Astex.Util.getMouseCoordByEventAndHtmlElementId ( event , windowId ) ;
	var windowX = point.x ;
	var windowY = point.y ;

	// translate into canvas (x,y) coordinates	
	var x = (canvas.xmax-canvas.xmin) * (windowX-0)/w.width + canvas.xmin ;
	var y = (canvas.ymax-canvas.ymin) * (0-windowY)/w.height - canvas.ymin ;
	//alert ( "(" + x + "," + y + ")" ) ;
	return {x:x,y:y} ;
};

// prototype void Astex.Canvas.displayCoordOnCanvas ( Event event , String windowId )
Astex.Canvas.displayCoordOnCanvas = function ( event , windowId ) {

	// see if we should display the coordinates
	if ( ! Astex.Canvas.DisplayCoordinates ) { return ; }

	// fix event
	event = Astex.Util.fixEvent ( event ) ;
	//alert ( event.type ) ;

	// get canvas and window
	var canvas = Astex.Canvas.getCanvasByWindowId ( windowId ) ;
	var w = canvas.window ;

	// get mouse coordinates as canvas (x,y) pair
	var point = Astex.Canvas.getMouseCoordOnCanvas ( event , windowId ) ;

	//var input = "text(x="+point.x.toFixed(2)+",y="+point.y.toFixed(2)+");" ;
	var input = "(x="+point.x.toFixed(2)+",y="+point.y.toFixed(2)+")" ;
	//alert ( input ) ;
	//var inWidth = Astex.Symbol.getSymbolStringWidth ( input , 0.25 ) ;
	//var inHeight = Astex.Symbol.getSymbolStringAscent ( input , 0.25 ) ;
	//inHeight += Astex.Symbol.getSymbolStringDescent ( input , 0.25 ) ;

	// save current color
	var color = canvas.canvas.color ;
	// set color to bgcolor
	canvas.setColor ( canvas.bgcolor ) ;
	// fill a rectangle just below the canvas with the bgcolor
	//canvas.fillRect ( canvas.xmin , canvas.ymin-1.1 , canvas.xmax-canvas.xmin , 1 ) ;
	var xFactor = 0.5 ;
	var yFactor = 0.5 ;
	canvas.fillRect ( canvas.xmin , canvas.ymin-1-(Astex.Symbol.maxAscent+Astex.Symbol.maxDescent)*yFactor , canvas.xmax-canvas.xmin , Astex.Symbol.maxAscent*yFactor + 1 ) ;
	// reset color
	canvas.setColor ( color ) ;
	// draw string
	//canvas.drawTokenString ( input , [canvas.xmin , canvas.ymin-Astex.Symbol.maxAscent*yFactor] , xFactor , yFactor ) ;
	canvas.drawSymbolString ( input , [canvas.xmin , canvas.ymin-1-Astex.Symbol.maxAscent*yFactor] , xFactor , yFactor ) ;
	//canvas.drawString ( "(x="+point.x.toFixed(2)+",y="+point.y.toFixed(2)+")" , canvas.xmin , canvas.ymin-1.1 ) ;
	// paint the canvas
	canvas.paint ( ) ;
};

// prototype void Astex.Canvas.recordSVGPath ( Event event , String windowId )
Astex.Canvas.recordSVGPath = function ( event , windowId ) {

	// fix event
	event = Astex.Util.fixEvent ( event ) ;

	// get canvas and window
	var canvas = Astex.Canvas.getCanvasByWindowId ( windowId ) ;
	var w = canvas.window ;

	// get mouse coordinates as canvas (x,y) pair
	var point = Astex.Canvas.getMouseCoordOnCanvas ( event , windowId ) ;
	var x = point.x.toFixed(2) ;
	var y = point.y.toFixed(2) ;

	var index = Astex.Canvas.SVGPathRecorder.length ;
	//alert ( "index: " + index ) ;
	Astex.Canvas.SVGPathRecorder[index] = "" ;

	//if ( event.type == "mousedown" && event.shifKey ) {
	if ( event.type == "mousedown" ) {
		Astex.Canvas.SVGPathRecorder[index] += "M" + x + "," + y + " " ;
	}
	if ( event.type == "mouseover" && event.shiftKey ) {
	//if ( event.type == "mouseover" && event.type == "mousedown" && event.shiftKey ) {
		Astex.Canvas.SVGPathRecorder[index] += "L" + x + "," + y + " " ;
	}
	//if ( event.type == "mouseup" && event.shiftKey ) {
	if ( event.type == "mouseup" ) {
		Astex.Canvas.SVGPathRecorder[index] += "L" + x + "," + y + " " ;
		//Astex.Canvas.SVGPathRecorder[index] += " " ;
		//Astex.Canvas.SVGPathRecorder[index] += "M" + x + "," + y + " " ;


		// draw the path
		var tmp = "" ;
		for ( var i = 0 ; i < Astex.Canvas.SVGPathRecorder.length ; i++ ) {
			tmp += Astex.Canvas.SVGPathRecorder[i] ;
		}
		//alert ( tmp ) ;
		canvas.drawSVGPath ( tmp ) ;
		// paint the canvas
		canvas.paint ( ) ;
		// reset
		//Astex.Canvas.SVGPathRecorder[index] = "" ;
	}
};

// prototype void Astex.Canvas.showSVGPathRecorder ( Event event , String windowId )
Astex.Canvas.showSVGPathRecorder = function ( event , windowId ) {

	//alert ( Astex.Canvas.SVGPathRecorder.length ) ;

	// fix event
	event = Astex.Util.fixEvent ( event ) ;

	// get canvas and window
	//var canvas = Astex.Canvas.getCanvasByWindowId ( windowId ) ;
	//var w = canvas.window ;

	//alert ( Astex.Canvas.SVGPathRecorder.toString() ) ;
	var tmp = "" ;
	for ( var i = 0 ; i < Astex.Canvas.SVGPathRecorder.length ; i++ ) {
		tmp += Astex.Canvas.SVGPathRecorder[i] ;
	}
	alert ( tmp ) ;
};

/*--------------------------------------------------------------------------*/


