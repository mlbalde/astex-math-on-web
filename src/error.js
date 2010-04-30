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
// warning and error classes
//

// prototype: new Astex.Warning ( String message , String caller )
Astex.Warning = function ( message , caller ) {

	this.message = message ;
	this.caller  = caller ;

	alert ( "Warning: " + message + "\ncalled from " + caller ) ;

	return this ;
}; 

// prototype: new Astex.Error ( String message , String caller )
Astex.Error = function ( message , caller ) {

	this.message = message ;
	this.caller  = caller ;

	//alert ( "Error: " + message + "\ncalled from " + caller ) ;
	throw new Error ( "Error: " + message + " called from " + caller ) ;

	return this ;
}; 


/*--------------------------------------------------------------------------*/
