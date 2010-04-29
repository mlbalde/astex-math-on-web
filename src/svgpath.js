/**
 *
 * ASTEX
 * http://astex-math-on-web.googlecode.com
 * astex.math.on.web@gmail.com
 *
 * version 0.1 (beta) (29 April 2010)
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

// prototype: new Astex.SVGPath ( String str )
// ! ! !   This is a BARE-BONES IMPLEMENTATION of SVG Paths   ! ! !
// NOT all SVG commands are implemented (only M,L,A,Z)
// Only a few ABSOLUTE (not RELATIVE) commands are implemented.
// an SVG Path should have the following format: Mx,y L|Ax,y L|Ax,y ... [Z]
// Mx,y stands for moveTo (x,y) point 
// Lx,y stands for draw lineTo (x,y) point (from previous (x,y) pair)
// Ax,y stands for draw (elliptical) arcTo (x,y) point (from previous (x,y) pair)
// Z implies the path is closed (polygon instead of polyline)
// Z expects an M command immediately after
// if str parameter is omitted, path is initially empty string and 
// moveTo, lineTo, arcTo, close instance methods may be used to programmatically create svg path
// All arcs (A) are drawn by drawing a section/part of an ellipse in a counter-clockwise direction
Astex.SVGPath = function ( str ) {

	if ( ! str ) { str = "" ; }
	if ( str != "" ) { str = str.toUpperCase ( ) ; }
	this.path = str ;

	return this ;
};

//
// Astex.SVGPath class constants
//

// constants for types of transformations
Astex.SVGPath.ROTATE = "rotate" ;
Astex.SVGPath.SCALE = "scale" ;
Astex.SVGPath.TRANSLATE = "translate" ;
Astex.SVGPath.SCEWX = "scewx" ;			// useful for writing in italics (should this be scewy instead???)
// constants for rotation transformation
Astex.SVGPath.RADIANS = "radians" ;
Astex.SVGPath.DEGREES = "degrees" ;
// array for holding transformations
Astex.SVGPath.Transformations = new Array ( ) ;

//
// Astex.SVGPath instance methods
//

// prototype void this.moveTo ( Float x , Float y )
Astex.SVGPath.prototype.moveTo = function ( x , y ) {
	this.path += "M" + x + "," + y ;
};
// prototype void this.lineTo ( Float x , Float y )
Astex.SVGPath.prototype.lineTo = function ( x , y ) {
	this.path += "L" + x + "," + y ;
};
// prototype void this.arcTo ( Float x , Float y )
Astex.SVGPath.prototype.arcTo = function ( x , y ) {
	this.path += "A" + x + "," + y ;
};
// prototype void this.close ( )
Astex.SVGPath.prototype.close = function ( ) {
	this.path += "Z" ;
};
// prototype void this.getPath ( )
Astex.SVGPath.prototype.getPath = function ( ) {
	return this.path ;
};
// prototype Boolean this.isSimplified ( )
// scans the path attribute and checks any A commands 
Astex.SVGPath.prototype.isSimplified = function ( ) {

	var aIndex = this.path.indexOf ( "A" ) ;
	if ( aIndex == -1 ) { return true ; }
	return false ;
};
// prototype void this.simplify ( Float step )
// process the path attribute and change all 
// arcTo (A) to lineTo (L)
Astex.SVGPath.prototype.simplify = function ( step ) {

	this.path = this.path.toUpperCase ( ) ;
	this.processTransforms ( ) ;
	//alert ( this.path ) ;
	if ( this.isSimplified() ) { return ; }

	if ( this.path.match(/Z/) ) { this.fixClosedPaths ( ) ; }

	var str = this.path ;
	var aIndex = 0 ;
	var lastIndex = 0 ;
	while ( (aIndex=str.indexOf("A",lastIndex)) != -1 ) {

		//alert ( aIndex ) ;

		// look between lastIndex and aIndex for the last M or L command
		// this will get us the last M or L command before
		// this current A command
		var tmpStr = str.slice ( lastIndex , aIndex ) ;
		var mIndex = tmpStr.lastIndexOf ( "M" ) ; 
		var lIndex = tmpStr.lastIndexOf ( "L" ) ;
		if ( mIndex == -1 && lIndex == -1 ) {
			//return new Astex.Error ( "Expected M or L command in " + this.path , "Astex.SVGPath.prototype.simplify" ) ;
			//return new Astex.Error ( "Expected M or L command in " + tmpStr , "Astex.SVGPath.prototype.simplify" ) ;
			return new Astex.Error ( "Expected M or L command in " + str , "Astex.SVGPath.prototype.simplify" ) ;
		} 
		var mlIndex = Astex.Math.max ( mIndex , lIndex ) ;
		// get point after mlIndex
		var pointStr = tmpStr.slice ( mlIndex + 1 , aIndex ) ;
		var point = pointStr.split ( "," ) ;
		var x = point[0] ;	
		var y = point[1] ;

		// get point after aIndex
		var point2Str = str.charAt ( aIndex + 1 ) ;
		var i = aIndex + 2 ;
		var ch = str.charAt ( i ) ;
		while ( ! Astex.Util.isAlpha(ch) && ch != null && ch != "" ) {
			point2Str += "" + ch ;
			//alert ( point2Str ) ;
			//alert ( "point2Str = " + point2Str ) ;
			i++ ;
			ch = str.charAt ( i ) ;
		}
		//alert ( "point2Str = " + point2Str ) ;
		var point2 = point2Str.split ( "," ) ;
		var x2 = point2[0] ;
		var y2 = point2[1] ;

		// turn arc from (x,y) to (x2,y2) into a series of lineTo statements
		var tmp = this.arcToLines ( x , y , x2 , y2 , step ) ;
		//alert ( tmp ) ;

		var nextIndex = aIndex + point2Str.length ;	

		// update the string the loop needs to process 
		// 0 -> aIndex - 1 ... up to current A command
		// tmp .... processed lineTo series of commands
		// nextIndex -> end of string ... evrything after current A command
		if ( nextIndex > str.length ) {				// current A is last command
			//alert ( "A is last command." ) ;
			str = str.substring ( 0 , aIndex ) + tmp ;
			//lastIndex = str.length ;
		}
		else {
			//alert ( "A is NOT last command." ) ;
			//alert ( "str.substring(nextIndex) = " + str.substring(nextIndex) ) ;
			//alert ( "nextIndex = " + nextIndex ) ;
			//str = str.substring ( 0 , aIndex ) + tmp + str.substring ( nextIndex ) ;
			str = str.substring ( 0 , aIndex ) + tmp + str.substring ( nextIndex + 1 ) ;
			//str = str.slice ( 0 , aIndex ) + tmp + str.slice ( nextIndex ) ;
			//lastIndex = nextIndex + tmp.length - 1 ;
		}

		//alert ( str ) ;
		//alert ( tmp ) ;

		// update lastIndex
		//lastIndex = aIndex ;
		//lastIndex = aIndex + 1 ;			// having problems with lastIndex ??????
								// this occurs only when trying to draw really small symbols/tokens
		lastIndex = 0 ;
		//lastIndex = aIndex + tmp.length - 1 ;
		//lastIndex = aIndex + tmp.length ;
		//alert ( "str.length = " + str.length + "   lastIndex = " + lastIndex + "\n\nstr = " + str ) ;
		//lastIndex = aIndex + tmp.length + 1 ;
		//lastIndex = nextIndex + tmp.length - 1 ;
	}

	// set path
	//alert ( str ) ;
	this.path = str ;
};

// prototype String this.arcToLines ( Float x1 , Float y1 , Float x2 , Float y2 , Float step )
// arc from (x1,y1) to (x2,y2)
// arcs are only drawn in counter-clockwise direction !!!
Astex.SVGPath.prototype.arcToLines = function ( x1 , y1 , x2 , y2 , step ) {

	if ( ! step ) { step = 0.5 ; }
	//alert ( "step " + step ) ;
	if ( typeof step != "number" ) { return new Astex.Error ( "step is NOT a number." , "Astex.SVGPath.prototype.arcToLines" ) ; }

	step = parseFloat ( step ) ;
	x1 = parseFloat ( x1 ) ;
	y1 = parseFloat ( y1 ) ;
	x2 = parseFloat ( x2 ) ;
	y2 = parseFloat ( y2 ) ;

	var dx = x2 - x1 ;	// dx > 0 move to left
	var dy = y2 - y1 ;	// dy > 0 move up
	// if dx < 0 and dy > 0 ... concave down
	// if dx < 0 and dy < 0 ... concave down
	// if dx > 0 and dy < 0 ... concave up 
	// if dx > 0 and dy > 0 ... concave up

	var tmp = "" ;
	var stopLoop = false ;

	// origin (center of ellipse)
	var ox = x2 ;
	var oy = y1 ;

	// std eqn of ellipse (x/a)^2 + (y/b)^2 = 1
	// y^2 = b^2 - (b/a)^2 * x^2
	// y^2 = b^2 * ( 1 - (x/a)^2 )
	// center (0,0)
	// we'll draw one quadrant of ellipse depending on concavity
	// this will make it necessary to reset origin depeding on concavity
	var a = Astex.Math.abs ( dx ) ;
	var b = Astex.Math.abs ( dy ) ;
	// (x,y) point on ellipse w/ center (0,0)
	var x = a;
	var y = 0;
	//var xstep = Astex.Math.abs ( a / step ) ;
	var xstep = Astex.Math.abs ( step ) ;
	//alert ( "x="+ x +",y="+y+",xstep="+xstep ) ;

	// tests on concavity
	if ( dx < 0 && dy > 0 ) {		// concave down
		// (x2,y2) is up and to the left of (x1,y1)
		// we draw counterclockwise portion of std. ellipse in Q1 from (a,0) to (0,b)
		// since arc is from (x1,y1) to (x2,y2) we must reset origin of ellipse to (x2,y1)
		ox = x2 ;
		oy = y1 ;
		for ( x = a - xstep ; x >= 0 ; x -= xstep ) {
			y = b * Astex.Math.sqrt ( 1 - Astex.Math.pow(x/a,2) ) ;
			//tmp += "L" + x.toFixed(2) + "," + y.toFixed(2) ;
			//tmp += "L" + (x+ox).toFixed(2) + "," + (y+oy).toFixed(2) ;
			tmp += "L" + Astex.Math.chop(x+ox,4) + "," + Astex.Math.chop(y+oy,4) ;
		}	
	}
	else if ( dx < 0 && dy < 0 ) {	// concave down
		// (x2,y2) is down and to the left of (x1,y1)
		// we draw counterclockwise portion of std. ellipse in Q2 from (0,b) to (-a,0)
		// since arc is from (x1,y1) to (x2,y2) we must reset origin of ellipse to (x1,y2)
		ox = x1 ;
		oy = y2 ;
		for ( x = 0 - xstep ; x >= -a ; x -= xstep ) {
			y = b * Astex.Math.sqrt ( 1 - Astex.Math.pow(x/a,2) ) ;
			//tmp += "L" + x.toFixed(2) + "," + y.toFixed(2) ;
			//tmp += "L" + (x+ox).toFixed(2) + "," + (y+oy).toFixed(2) ;
			tmp += "L" + Astex.Math.chop(x+ox,4) + "," + Astex.Math.chop(y+oy,4) ;
		}	
	}
	else if ( dx > 0 && dy < 0 ) {	// concave up
		// (x2,y2) is down and to the right of (x1,y1)
		// we draw counterclockwise portion of std. ellipse in Q3 from (-a,0) to (0,-b)
		// since arc is from (x1,y1) to (x2,y2) we must reset origin of ellipse to (x2,y1)
		ox = x2 ;
		oy = y1 ;
		for ( x = -a + xstep ; x <= 0 ; x += xstep ) {
			y = -b * Astex.Math.sqrt ( 1 - Astex.Math.pow(x/a,2) ) ;
			//tmp += "L" + x.toFixed(2) + "," + y.toFixed(2) ;
			//tmp += "L" + (x+ox).toFixed(2) + "," + (y+oy).toFixed(2) ;
			tmp += "L" + Astex.Math.chop(x+ox,4) + "," + Astex.Math.chop(y+oy,4) ;
		}
	}
	else if ( dx > 0 && dy > 0 ) {	// concave up
		// (x2,y2) is up and to the right of (x1,y1)
		// we draw counterclockwise portion of std. ellipse in Q3 from (0,-b) to (a,0)
		// since arc is from (x1,y1) to (x2,y2) we must reset origin of ellipse to (x1,y2)
		ox = x1 ;
		oy = y2 ;
		for ( x = 0 + xstep ; x <= a ; x += xstep ) {
			y = -b * Astex.Math.sqrt ( 1 - Astex.Math.pow(x/a,2) ) ;
			//tmp += "L" + x.toFixed(2) + "," + y.toFixed(2) ;
			//tmp += "L" + (x+ox).toFixed(2) + "," + (y+oy).toFixed(2) ;
			tmp += "L" + Astex.Math.chop(x+ox,4) + "," + Astex.Math.chop(y+oy,4) ;
		}
	}
	else if ( dx == 0 || dy == 0 ) {
			//tmp += "L" + x1.toFixed(2) + "," + y1.toFixed(2) ;
			//tmp += "L" + x2.toFixed(2) + "," + y2.toFixed(2) ;
			tmp += "L" + Astex.Math.chop(x1,4) + "," + Astex.Math.chop(y1,4) ;
			tmp += "L" + Astex.Math.chop(x2,4) + "," + Astex.Math.chop(y2,4) ;
	}

	//alert ( tmp ) ;
	//var p = new Astex.SVGPath ( tmp ) ;
	//p.translate ( ox , oy ) ;

	// add a line to end point (x2,y2) to help when symbols are stretched
	tmp += "L" + Astex.Math.chop(x2,4) + "," + Astex.Math.chop(y2,4) ;

	//return tmp ;
	return tmp.replace ( /\s/g , "" ) ;
	//return p.path ;
};

// prototype void this.fixClosedPaths ( )
// takes any closed path (Z) and inserts appropriate L or A
// command at end (before Z) to go back to previous M point
// This will make sure closed paths drawn with A will be
// closed with a A instead of an L
Astex.SVGPath.prototype.fixClosedPaths = function ( ) {

	var pathStr = this.path.toUpperCase ( ) ;

	// clean up any Z commands
	// search for Z
	// back-track to see what the last command was (L or A)
	// back-track to find last M command
	// insert appropriate L or A command back to last M point
	var ch = "" ;
	var lastIndex = 0 ;
	var zIndex = 0 ;
	while ( (zIndex=pathStr.indexOf("Z",lastIndex)) != -1 ) {

		// search from lastIndex to zIndex for last command
		var tmpStr = pathStr.substring ( lastIndex , zIndex ) ;
		var lIndex = tmpStr.lastIndexOf ( "L" ) ;
		var aIndex = tmpStr.lastIndexOf ( "A" ) ;
		if ( lIndex == -1 && aIndex == -1 ) { return new Astex.Error ( "Expected L or A command." , "Astex.Canvas.prototype._drawSVGPath" ) ; }
		var lastCommand = (aIndex > lIndex) ? "A" : "L" ;
		var laIndex = Astex.Math.max ( lIndex , aIndex ) ;
		// get point after laIndex
		var pointStr = tmpStr.charAt ( laIndex + 1 ) ;
		var i = laIndex + 2 ;
		var ch = tmpStr.charAt ( i ) ;
		while ( ! Astex.Util.isAlpha(ch) && ch != null && ch != "" ) {
			pointStr += "" + ch ;
			//alert ( pointStr ) ;
			//alert ( "pointStr = " + pointStr ) ;
			i++ ;
			ch = tmpStr.charAt ( i ) ;
		}
		//alert ( "pointStr = " + pointStr ) ;
		var point = pointStr.split ( "," ) ;
		var x = parseFloat ( point[0] ) ;
		var y = parseFloat ( point[1] ) ;

		// find previous M
		var mIndex = tmpStr.lastIndexOf ( "M" ) ;
		if ( mIndex == -1 ) { return new Astex.Error ( "Expected M command." , "Astex.Canvas.prototype._drawSVGPath" ) ; }
		// get point after mIndex
		var point2Str = tmpStr.charAt ( mIndex + 1 ) ;
		var i = mIndex + 2 ;
		var ch = tmpStr.charAt ( i ) ;
		while ( ! Astex.Util.isAlpha(ch) && ch != null && ch != "" ) {
			point2Str += "" + ch ;
			//alert ( point2Str ) ;
			//alert ( "point2Str = " + point2Str ) ;
			i++ ;
			ch = tmpStr.charAt ( i ) ;
		}
		//alert ( "point2Str = " + point2Str ) ;
		var point2 = point2Str.split ( "," ) ;
		var x2 = parseFloat ( point2[0] ) ;
		var y2 = parseFloat ( point2[1] ) ;

		// if point after last command is same as after previous M
		// no need to add anything
		if ( x == x2 && y ==y2 ) { return ; }

		// insert appropriate L or A command before Z
		var tmp = "" + lastCommand + x2 + "," + y2 ;
		// 0 -> zIndex ..... everything before Z
		// tmp ............. new command
		// zIndex -> end of string .... Z and everything after
		pathStr = pathStr.substring ( 0 , zIndex ) + tmp + pathStr.substring ( zIndex ) ;	// is this coming out ok???
		//alert ( pathStr ) ;

		// update last index
		lastIndex = zIndex + 1 + tmp.length ;		// is this correct
		//lastIndex = zIndex + 1 ;		// is this correct
		//lastIndex = zIndex + tmp.length ;		// is this correct
	} 

	this.path = pathStr ;

};


// prototype void this.processTransform ( String op , Float num1 , Float num2 )
Astex.SVGPath.prototype.processTransform = function ( op , num1 , num2 ) {

	// op is operation to perform :
	// if op is rotatation then num1 is angle to rotate around origin
	// if op is scale then num1 is xFactor and num2 is yFactor
	// if op is translate then num1 is deltaX and num2 is deltaY

	var tmp = "" ;
	var str = this.path ;
	str = str.replace ( /\s/g , "" ) ;	// remove all whitespace from path string
	var i = 0 ;
	var ch = str.charAt ( i ) ;
	while ( ch != null && ch != "" ) {

		if ( Astex.Util.isAlpha (ch) ) {
			tmp += "" + ch ;
		}
		else if ( Astex.Util.isDigit (ch) || ch == '.' || ch == '-' ) {
			// get x-coordinate
			var x = "" + ch ;
			// keep reading until ,
			i++ ;
			ch = str.charAt ( i ) ;
			while ( Astex.Util.isDigit (ch) || ch =='.' ) {
				x += "" + ch ;
				i++ ;
				ch = str.charAt ( i ) ;
			}

			// comma ,
			if ( ch != "," ) { return new Astex.Error ( "expected , got " + ch , "Astex.SVGPath.prototype.processTransform" ) ; }

			// get y-coordinate
			var y = "" ;
			// keep reading until A-Za-z
			i++ ;
			ch = str.charAt ( i ) ;
			//while ( Astex.Util.isDigit(ch) || ch =='.' && ! Astex.Util.isAlpha(ch) ) {
			var test = Astex.Util.isDigit(ch) || ch == '.' || ch == '-' ;
			if ( ! test ) { return new Astex.Error ( "expected digit or . or - in y-coord, got " + ch , "Astex.SVGPath.prototype.processTransform" ) ; }
			while ( Astex.Util.isDigit(ch) || ch =='.' || ch == '-' ) {
				y += "" + ch ;
				i++ ;
				ch = str.charAt ( i ) ;
			}
			i-- ;		// go back 1 character (next one should be M or L or A when loop restarts)

			// transform the (x,y) coordinate
			if ( op == Astex.SVGPath.ROTATE ) {
				// num1 is angle of rotation about origin (positive direction is counterclockwise)
				//tmp += "" + (eval (Astex.Math.cos(num1).toFixed(1) + "*" + x + " - " + Astex.Math.sin(num1).toFixed(1) + "*" + y)).toFixed(2) ;
				tmp += "" + (eval (Astex.Math.chop(Astex.Math.cos(num1),2) + "*" + x + " - " + Astex.Math.chop(Astex.Math.sin(num1),2) + "*" + y)).toFixed(4) ;
				tmp += "," ;
				//tmp += "" + (eval (Astex.Math.sin(num1).toFixed(1) + "*" + x + " + " + Astex.Math.cos(num1).toFixed(1) + "*" + y)).toFixed(2) ;
				tmp += "" + (eval (Astex.Math.chop(Astex.Math.sin(num1),2) + "*" + x + " + " + Astex.Math.chop(Astex.Math.cos(num1),2) + "*" + y)).toFixed(4) ;
			}
			else if ( op == Astex.SVGPath.SCALE ) {
				// num1 is xFactor
				// num2 is yFactor
				//tmp += "" + (eval (num1 + "*" + x)).toFixed(2) ;
				tmp += "" + Astex.Math.chop(eval(num1 + "*" + x),4) ;
				tmp += "," ;
				//tmp += "" + (eval (num2 + "*" + y)).toFixed(2) ;
				tmp += "" + Astex.Math.chop(eval(num2 + "*" + y),4) ;
			}
			else if ( op == Astex.SVGPath.TRANSLATE ) {
				// num1 is deltaX
				// num2 is deltaY
				//tmp += "" + (eval (x + "+" + num1)).toFixed(2) ;
				tmp += "" + Astex.Math.chop(eval(x + "+" + num1),4) ;
				tmp += "," ;
				//tmp += "" + (eval (y + "+" + num2)).toFixed(2) ;
				tmp += "" + Astex.Math.chop(eval(y + "+" + num2),4) ;
			}
			else if ( op == Astex.SVGPath.SCEWX ) {
				// num1 is angle to scew by
				//tmp += "" + (eval (Astex.Math.cos(num1).toFixed(1) + "*" + x + " + " + Astex.Math.sin(num1).toFixed(1) + "*" + y)).toFixed(2) ;
				tmp += "" + (eval (Astex.Math.chop(Astex.Math.cos(num1),2) + "*" + x + " + " + Astex.Math.chop(Astex.Math.sin(num1),2) + "*" + y)).toFixed(4) ;
				tmp += "," ;
				//tmp += "" + (eval (y)).toFixed(2) ;
				tmp += "" + Astex.Math.chop(eval(y),4) ;
			}
		}

		i++ ;
		ch = str.charAt ( i ) ;
	}

	// re-assign value to path attribute
	this.path = tmp ;
	//alert ( this.path ) ;
};

// prototype void this.rotate ( Float theta , String angleMeasure , Float[] point )
// rotates svg path about point an angle of theta (counterclockise for theta > 0)
Astex.SVGPath.prototype.rotate = function ( theta , angleMeasure , point ) {
	if ( ! theta || typeof theta != "number" ) { theta = 0 ; }
	if ( theta == 0 ) { return ; }
	if ( ! angleMeasure || typeof angleMeasure != "string" ) { angleMeasure = Astex.SVGPath.RADIANS ; }
	if ( angleMeasure == Astex.SVGPath.DEGREES ) { theta = theta * Astex.Math.pi / 180 ; }
	if ( ! point ) { point = [0,0] ; }
	this.translate ( -point[0] , -point[1] ) ;
	this.processTransform ( Astex.SVGPath.ROTATE , theta ) ;
	this.translate ( point[0] , point[1] ) ;
};

// prototype void this.scale ( Float x , Float y )
// NOTE: scale does NOT preserve anchors, unless anchor is [0,0]
// Therefore, ALWAYS scale BEFORE TRANSLATING
Astex.SVGPath.prototype.scale = function ( x , y ) {
	if ( ! x || typeof x != "number" ) { x = 1 ; }
	if ( ! y || typeof y != "number" ) { y = 1 ; }
	if ( x == 1 && y == 1 ) { return ; }
	this.processTransform ( Astex.SVGPath.SCALE , x , y ) ;
};

// prototype void this.translate ( Float x , Float y )
Astex.SVGPath.prototype.translate = function ( x , y ) {
	if ( ! x || typeof x != "number" ) { x = 0 ; }
	if ( ! y || typeof y != "number" ) { y = 0 ; }
	if ( x == 0 && y == 0 ) { return ; }
	this.processTransform ( Astex.SVGPath.TRANSLATE , x , y ) ;
};
// prototype void this.scewx ( Float theta , String angleMeasure )
// should be useful in writing symbols in italics
// NOTE: scew does NOT preserve anchors, unless anchor is [0,0]
// Therefore, ALWAYS scew BEFORE TRANSLATING
Astex.SVGPath.prototype.scewx = function ( theta , angleMeasure ) {
	if ( ! theta || typeof theta != "number" ) { theta = 0 ; }
	if ( theta == 0 ) { return ; }
	if ( ! angleMeasure || typeof angleMeasure != "string" ) { angleMeasure = Astex.SVGPath.RADIANS ; }
	if ( angleMeasure == Astex.SVGPath.DEGREES ) { theta *= Astex.Math.pi / 180 ; }
	this.processTransform ( Astex.SVGPath.SCEWX , theta ) ;

	// do i need to scew about a point ???

};

// prototype void this.processTransforms ( )
// cycles through Astex.SVGPath.Transformations array and executes
// the specified transformations from beginning of array to end of array
Astex.SVGPath.prototype.processTransforms = function ( ) {
	var transforms = Astex.SVGPath.Transformations ;
	for ( var i = 0 ; i < transforms.length ; i++ ) {
		var t = transforms[i] ;
		// e.g. of transform objects
		// { op:Astex.SVGPath.ROTATE    , angle:Float , measure:Astex.SVGPath.RADIANS , point:[Float,Float] }
		// { op:Astex.SVGPath.ROTATE    , angle:Float , measure:Astex.SVGPath.DEGREES , point:[Float,Float] }
		// { op:Astex.SVGPath.SCALE     , fx:Float    , fy:Float }
		// { op:Astex.SVGPath.TRANSLATE , dx:Float    , dy:Float }
		// { op:Astex.SVGPath.SCEWX     , theta:Float , measure:Astex.SVGPath.RADIANS }
		// { op:Astex.SVGPath.SCEWX     , theta:Float , measure:Astex.SVGPath.DEGREES }
		switch ( t.op ) {
			case Astex.SVGPath.ROTATE :
				this.rotate ( t.angle , t.measure , t.point ) ;
				break ;
			case Astex.SVGPath.SCALE :
				this.scale ( t.fx , t.fy ) ;
				break ;
			case Astex.SVGPath.TRANSLATE :
				this.translate ( t.dx , t.dy ) ;
				break ;
			case Astex.SVGPath.SCEWX :
				this.scewx ( t.theta , t.measure ) ;
				break ;
			default :
				break ;
		}
	}
};

//
// Astex.SVGPath class methods
//

// prototype void Astex.SVGPath.addTransform ( Object obj )
// input is a generic object and will be different for each type of transform
// e.g.
// { op:Astex.SVGPath.ROTATE    , angle:Float , measure:Astex.SVGPath.RADIANS , point:[Float,Float] }
// { op:Astex.SVGPath.ROTATE    , angle:Float , measure:Astex.SVGPath.DEGREES , point:[Float,Float] }
// { op:Astex.SVGPath.SCALE     , fx:Float    , fy:Float }
// { op:Astex.SVGPath.TRANSLATE , dx:Float    , dy:Float }
// { op:Astex.SVGPath.SCEWX     , theta:Float , measure:Astex.SVGPath.RADIANS }
// { op:Astex.SVGPath.SCEWX     , theta:Float , measure:Astex.SVGPath.DEGREES }
Astex.SVGPath.addTransform = function ( obj ) {

	if ( ! obj || ! obj.op ) {
		return new Astex.Error ( "Expecting an object with attribute op." , "Astex.SVGPath.addTransform" ) ;
	}
	Astex.SVGPath.Transformations.push ( obj ) ;
};

// prototype void Astex.SVGPath.clearTransforms ( )
Astex.SVGPath.clearTransforms = function ( ) {
	Astex.SVGPath.Transformations = [] ;
};


/*--------------------------------------------------------------------------*/

