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

//
// Astex.User class
//

Astex.User = { } ;

// Astex.User class variables
Astex.User.bgColor = "white" ;
Astex.User.color = Astex.AMath.mathcolor ;

// if user defines this function, it will be called within Astex.init
// user should define Astex.User.setup = function ( ) { /*body goes here*/ };
// in a separate js file
Astex.User.setup = null ;
//Astex.User.setup = function ( ) { Astex.User.setColor(Astex.AMath.mathcolor); };
Astex.User.setup = function ( ) { Astex.User.setColor("black"); };
//Astex.User.setup = function ( ) { Astex.User.setColor("blue"); };
//Astex.User.setup = function ( ) { Astex.User.setBGColor("orange"); Astex.User.setColor("blue"); };
//Astex.User.setup = function ( ) { Astex.User.setBGColor("white"); Astex.User.setColor("black"); };

// prototype: Astex.User.addPlugin ( String name , Function func ) ;
// should be used outside of Astex.User.setup
Astex.User.addPlugin = function ( name , func ) {

	new Astex.Plugin ( name , func ) ;
};

// prototype: Astex.User.processNode ( HTMLElement node ) ;
Astex.User.processNode = function ( node ) {

	Astex.process ( node ) ;
};

// prototype: Astex.User.setColor ( String color ) ;
Astex.User.setColor = function ( color ) {

	// update the Astex.AMath.mathcolor variable
	// this will ensure appropriate 'mathcolor' attribute is found
	// in Astex.MathML when processing <mstyle> nodes
	Astex.AMath.mathcolor = color ;

	// update current canvas color
	Astex.Canvas.currentColor = color ;

	// update user color
	Astex.User.color = color ;
};

// prototype: void Astex.User.getColor ( ) ;
Astex.User.getColor = function ( ) {
	return Astex.User.color ;
};

// prototype: Astex.User.setBGColor ( String color ) ;
Astex.User.setBGColor = function ( color ) {

	// store in Astex.User.bgColor
	Astex.User.bgColor = color ;

	// update canvas/window bgColor
	Astex.Window.update ( ) ;
};

//
// need a function to add appropriate symbol/token combinations
// maybe also to sort them ???
//

/*--------------------------------------------------------------------------*/
