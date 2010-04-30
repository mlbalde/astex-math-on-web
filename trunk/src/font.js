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

//
// Astex.Font class
//

Astex.Font = { } ;

// font styles
Astex.Font.Style = { } ;
Astex.Font.Style.PLAIN  = 0 ;
Astex.Font.Style.BOLD   = 1 ;
Astex.Font.Style.ITALIC = 2 ;
Astex.Font.Style.currentStyle = Astex.Font.Style.PLAIN ;
// prototype: Int Astex.Font.Style.getStyle ( )
Astex.Font.Style.getStyle  = function ( ) {
	return Astex.Font.Style.currentStyle ;
};
// prototype: void Astex.Font.Style.setStyle ( Int i )
Astex.Font.Style.setStyle  = function ( i ) {
	Astex.Font.Style.currentStyle = i ;
};


// font stroke
Astex.Font.Stroke = { } ;
Astex.Font.Stroke.PLAIN = 1 ;		// stroke width to use on a canvas
Astex.Font.Stroke.BOLD  = 2 ;		// stroke width to use on a canvas

// font types
Astex.Font.Type = { } ;
Astex.Font.Type.DEFAULT     = 0 ;
Astex.Font.Type.CALLIGRAPHY = 1 ;
Astex.Font.Type.BLACKBOARDBOLD = 2 ;
Astex.Font.Type.FRAKTUR = 3 ;
Astex.Font.Type.currentType = Astex.Font.Type.DEFAULT ;
// prototype: Int Astex.Font.Type.getType ( )
Astex.Font.Type.getType  = function ( ) {
	return Astex.Font.Type.currentType ;
};
// prototype: void Astex.Font.Type.setType ( Int i )
Astex.Font.Type.setType  = function ( i ) {
	Astex.Font.Type.currentType = i ;
};


/*--------------------------------------------------------------------------*/
