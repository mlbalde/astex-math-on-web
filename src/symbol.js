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

// prototype: new Astex.Symbol ( String[] names , String drawCommands , Float width , Float ascending , Float descending )
Astex.Symbol = function ( names , drawCommands , width , ascending , descending ) {

	this.names = names ;
	this.drawCommands = drawCommands;
	//this.width = width ;
	this.width = width + 0.2 ;			// added 0.2 to width for purposes of drawing token strings
	this.ascending = ascending ;
	this.descending = descending ;

	return this ;
};

//
// Astex.Symbol class variables
//

Astex.Symbol.Symbols = new Array ( ) ;
Astex.Symbol.SymbolNames = new Array ( ) ;
Astex.Symbol.maxAscent = 0 ;
Astex.Symbol.maxDescent = 0 ;
Astex.Symbol.maxWidth = 0 ;
Astex.Symbol.spaceWidthBetweenSymbols = 0.5 ;	// space to put in between symbols when they are drawn on a canvas
Astex.Symbol.spaceWidth = 2 ;			// most symbols are designed to be "2 units" wide
Astex.Symbol.Digits = "0123456789" ;
Astex.Symbol.EnglishAlphabet = "aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ" ;
Astex.Symbol.GreekAlphabet = "alphaAlphabetaBetagammaGammadeltaDeltaepsilonEpsilon" + "zetaZetaetaEtathetaTheta" + "iotaIotakappaKappalambdaLambdamuMunuNuxiXi" + "omicronOmicronpiPirhoRhosigmasigmafSigmatauTauupsilonUpsilon" + "phiPhichiChipsiPsi" + "omegaOmega"  ;

//
// Astex.Symbol instance methods
//

// prototype Float this.getSymbolWidth ( Float xFactor )
Astex.Symbol.prototype.getWidth = function ( xFactor ) {
	if ( ! xFactor || typeof xFactor != "number" ) { xFactor = 1 ; }
	return this.width * xFactor ;
};

// prototype Float this.getAscent ( Float yFactor )
Astex.Symbol.prototype.getAscent = function ( yFactor ) {
	if ( ! yFactor || typeof yFactor != "number" ) { yFactor = 1 ; }
	return this.ascending * yFactor ;
};

// prototype Float this.getDescent ( Float yFactor )
Astex.Symbol.prototype.getDescent = function ( yFactor ) {
	if ( ! yFactor || typeof yFactor != "number" ) { yFactor = 1 ; }
	return this.descending * yFactor ;
};

//
// Astex.Symbol class methods
//

// prototype: void Astex.Symbol.addSymbol ( Object obj )
// the argument is an Object with appropriate attributes
// this allows a more human readable way to add symbols later
Astex.Symbol.addSymbol = function ( obj ) {
	var symbol = new Astex.Symbol ( obj.names , obj.drawCommands , obj.width , obj.ascending , obj.descending ) ;
	Astex.Symbol.Symbols.push ( symbol ) ;
	if ( symbol.ascending > Astex.Symbol.maxAscent ) {
		Astex.Symbol.maxAscent = symbol.ascending ;
	}
	if ( symbol.descending > Astex.Symbol.maxDescent ) {
		Astex.Symbol.maxDescent = symbol.descending ;
	}
	if ( symbol.width > Astex.Symbol.maxWidth ) {
		Astex.Symbol.maxWidth = symbol.width ;
	}
	for ( var i = 0 ; i < obj.names.length ; i++ ) {
		Astex.Symbol.SymbolNames.push ( obj.names[i] ) ;
	}	
};
// prototype: Astex.Symbol Astex.Symbol.getSymbol ( String name )
Astex.Symbol.getSymbol = function ( name ) {

	if ( name == null || name == "" ) {
		return Astex.Symbol.getSymbol ( "symbol-not-found" ) ;
	}

	var symbols = Astex.Symbol.Symbols ;
	for ( var i = 0 ; i < symbols.length ; i++ ) {
		var symbol = symbols[i] ;
		for ( var j = 0 ; j < symbol.names.length ; j++ ) {
			if ( name == symbol.names[j] ) {
				return symbol ;
			}
		}
	}
	//new Astex.Error ( "Symbol not found for name :" + name , "Astex.Symbol.getSymbol()" ) ;
	return Astex.Symbol.getSymbol ( "symbol-not-found" ) ;
};

// prototype: String Astex.Symbol.getMaximalSymbolName ( String str )
// return maximal initial substring of str that appears in names
// returns null if there is none 
// calls Astex.Util.getMaximalSubstringInArray() which assumes array argument is sorted
Astex.Symbol.getMaximalSymbolName = function ( str ) {
	return Astex.Util.getMaximalSubstringInArray ( str , Astex.Symbol.SymbolNames ) ;
};

// prototype Float Astex.Symbol.getSymbolStringWidth ( String str , Float xFactor )
Astex.Symbol.getSymbolStringWidth = function ( str , xFactor ) {
	if ( ! xFactor || typeof xFactor != "number" ) { xFactor = 1 ; }
	var width = 0 ;
	/*
	var i = 0 ;
	ch = str.charAt ( i ) ;
	while ( ch ) {
		var symbol = Astex.Symbol.getSymbol ( ch ) ;
		width += symbol.getWidth ( xFactor ) ;
		i++ ;
		ch = str.charAt ( i ) ;
	}
	*/
	while ( str.length > 0 ) {

		var name = Astex.Symbol.getMaximalSymbolName ( str ) ;
		if ( ! name ) { name = "" ; }
		var symbol = Astex.Symbol.getSymbol ( name ) ;
		width += symbol.getWidth ( xFactor ) + Astex.Symbol.getSpaceWidthBetweenSymbols ( xFactor ) ;
		//str = str.slice ( name.length ) ;
		if ( name == "" ) { str = str.slice(1) ; }
		else { str = str.slice ( name.length ) ; }
	}
	return width ;
};

// prototype Float Astex.Symbol.getSymbolStringAscent ( String str , Float yFactor )
Astex.Symbol.getSymbolStringAscent = function ( str , yFactor ) {
	if ( ! yFactor || typeof yFactor != "number" ) { yFactor = 1 ; }
	var ascent = 0 ;
	/*
	var i = 0 ;
	ch = str.charAt ( i ) ;
	while ( ch ) {
		var symbol = Astex.Symbol.getSymbol ( ch ) ;
		ascent += symbol.getAscent ( yFactor ) ;
		i++ ;
		ch = str.charAt ( i ) ;
	}
	*/
	while ( str.length > 0 ) {

		var name = Astex.Symbol.getMaximalSymbolName ( str ) ;
		if ( ! name ) { name = "" ; }
		var symbol = Astex.Symbol.getSymbol ( name ) ;
		var y = symbol.getAscent ( yFactor ) ;
		if ( y > ascent ) { ascent = y ; }	
		//str = str.slice ( name.length ) ;
		if ( name == "" ) { str = str.slice(1) ; }
		else { str = str.slice ( name.length ) ; }
	}
	return ascent ;
};

// prototype Float Astex.Symbol.getSymbolStringDescent ( String str , Float yFactor )
Astex.Symbol.getSymbolStringDescent = function ( str , yFactor ) {
	if ( ! yFactor || typeof yFactor != "number" ) { yFactor = 1 ; }
	var descent = 0 ;
	/*
	var i = 0 ;
	ch = str.charAt ( i ) ;
	while ( ch ) {
		var symbol = Astex.Symbol.getSymbol ( ch ) ;
		descent += symbol.getDescent ( yFactor ) ;
		i++ ;
		ch = str.charAt ( i ) ;
	}
	*/
	while ( str.length > 0 ) {

		var name = Astex.Symbol.getMaximalSymbolName ( str ) ;
		if ( ! name ) { name = "" ; }
		var symbol = Astex.Symbol.getSymbol ( name ) ;
		var y = symbol.getDescent ( yFactor ) ;
		if ( y > descent ) { descent = y ; }
		//str = str.slice ( name.length ) ;
		if ( name == "" ) { str = str.slice(1) ; }
		else { str = str.slice ( name.length ) ; }
	}
	return descent ;
};

// prototype Float Astex.Symbol.getSymbolCharsWidth ( String str , Float xFactor )
// process str one character (not one symbol) at a time
Astex.Symbol.getSymbolCharsWidth = function ( str , xFactor ) {
	if ( ! xFactor || typeof xFactor != "number" ) { xFactor = 1 ; }
	var width = 0 ;
	var i = 0 ;
	ch = str.charAt ( i ) ;
	while ( ch ) {
		// if whitespace, add to width
		if ( ch.match(/\s/) ) {
			width += Astex.Symbol.getSpaceWidth ( xFactor ) ;
		}
		else {
			var symbol = Astex.Symbol.getSymbol ( ch ) ;
			width += symbol.getWidth ( xFactor ) ;
			width += Astex.Symbol.getSpaceWidthBetweenSymbols ( xFactor ) ;
		}
		i++ ;
		ch = str.charAt ( i ) ;
	}
	return width ;
};

// prototype Float Astex.Symbol.getSymbolCharsAscent ( String str , Float yFactor )
// process str one character (not one symbol) at a time
Astex.Symbol.getSymbolCharsAscent = function ( str , yFactor ) {
	if ( ! yFactor || typeof yFactor != "number" ) { yFactor = 1 ; }
	var ascent = 0 ;
	var i = 0 ;
	ch = str.charAt ( i ) ;
	while ( ch ) {
		if ( ! ch.match(/\s/) ) {
			var symbol = Astex.Symbol.getSymbol ( ch ) ;
			ascent += symbol.getAscent ( yFactor ) ;
		}
		i++ ;
		ch = str.charAt ( i ) ;
	}
	return ascent ;
};

// prototype Float Astex.Symbol.getSymbolCharsDescent ( String str , Float yFactor )
// process str one character (not one symbol) at a time
Astex.Symbol.getSymbolCharsDescent = function ( str , yFactor ) {
	if ( ! yFactor || typeof yFactor != "number" ) { yFactor = 1 ; }
	var descent = 0 ;
	var i = 0 ;
	ch = str.charAt ( i ) ;
	while ( ch ) {
		if ( ! ch.match(/\s/) ) {
			var symbol = Astex.Symbol.getSymbol ( ch ) ;
			descent += symbol.getDescent ( yFactor ) ;
		}
		i++ ;
		ch = str.charAt ( i ) ;
	}
	return descent ;
};

// prototype Float Astex.Symbol.getSpaceWidthBetweenSymbols ( Float xFactor )
Astex.Symbol.getSpaceWidthBetweenSymbols = function ( xFactor ) {

	if ( ! xFactor || typeof xFactor != "number" ) { xFactor = 1 ; }
	return Astex.Symbol.spaceWidthBetweenSymbols * xFactor ;
};

// prototype Float Astex.Symbol.getSpaceWidth ( Float xFactor )
Astex.Symbol.getSpaceWidth = function ( xFactor ) {

	if ( ! xFactor || typeof xFactor != "number" ) { xFactor = 1 ; }
	return Astex.Symbol.spaceWidth * xFactor ;
};

/*--------------------------------------------------------------------------*/


// add symbols to the Astex.Symbol.Symbols array
// symbols were drawn in a 300x300 window using the standard canvas dimensions [-10,10]x[-10,10] x and y-scales=1
// the origin [0,0] is used as a bottom-left anchor of the symbol
// for instance, lower-case english letters are drawn so the bulk of the letter occupies [0,2]x[0,2] in 2D
//               upper-case english letters are drawn so the bulk of the letter occupies [0,2]x[0,4] in 2D
// the x-axis for the above canvas is used as the baseline for drawing symbols
// width, ascending, and descending are based upon above dimensions and scales on the canvas
//
//
// Symbols needed......
//
// rectangular box to display when a symbol name is not found
// digits 0-9
// english alphabet (lower/upper-case)
// greek alphabet (lower/upper-case) (some greek letters are the same as some english letters)
// punctuation (all symbols on qwerty keyboard)
// math symbols ( AsciiMathML and Tex symbols )
//
//
//

//
// miscellaneous picture symbols
//
Astex.Symbol.addSymbol ({
	names : ["symbol-not-found" , "token-not-found" , "not-found" , "square" , "\u25A1" , "\u25AB"] ,
	drawCommands : "svg ( M0,0  L0,2 L2,2 L2,0 Z ) ; " ,
	width : 2 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["diamond" , "\u22C4" , "\u25C7"] ,
	drawCommands : "svg ( M0,1 L1,0 L2,1 L1,2 L0,1 ) ; " ,
	width : 2 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["space" , "\u00A0" , "&nbsp;"] ,
	drawCommands : "svg ( ) ; " ,
	width : 2 ,
	ascending : 0 ,
	descending : 0
});
Astex.Symbol.addSymbol ({			// empty symbol
	names : [""] ,
	drawCommands : "svg ( ) ; " ,
	width : 0 ,
	ascending : 0 ,
	descending : 0
});

//
// digits 0 - 9
//
Astex.Symbol.addSymbol ({
	names : ["0"] ,
	drawCommands : "svg ( M1,0 A2,2 A1,4 A0,2 Z M1.5,3.7 L0.5,0.4) ;" ,
	//drawCommands : "svg ( M1.5,0 A3,2 A1.5,4 A0,2 Z M1.5,3.7 L0.5,0.4) ;" ,
	width : 2 ,
	//width : 3 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["1"] ,
	drawCommands : "svg ( M1,4 L1,0 M1,4 L0.2,3.2 M0,0 L2,0 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["2"] ,
	drawCommands : "svg( M2,0 L0,0 L2,3 A1,4 A0,3 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["3"] ,
	drawCommands : "svg( M2,3 A1,4 A0,3 M1,2 A2,3 M2,1 A1,2 M2,1 M0,1 A1,0 A2,1 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["4"] ,
	drawCommands : "svg ( M0,4 L0,2 L2,2 M2,4 L2,0 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["5"] ,
	drawCommands : "svg ( M2,4 L0,4 L0,2 L1,2 M0,0 L1,0 A2,1 A1,2 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["6"] ,
	drawCommands : "svg ( M1,0 A2,1 A1,2 A0,1 Z M0.2,1.6 L1,4 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["7"] ,
	drawCommands : "svg ( M0,4  L2,4 L0.9,0 M0.9,2 L1.9,2 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["8"] ,
	drawCommands : "svg ( M2,1 A1,2 A0,1 A1,0 Z M2,3 A1,4 A0,3 A1,2 Z ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["9"] ,
	drawCommands : "svg ( M2,3 A1,4 A0,3 A1,2 Z M2,2.8 L2,0 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});

//
// lower and upper-case English and Greek letters
//
Astex.Symbol.addSymbol ({
	names : ["a"] ,
	drawCommands : "svg ( M2,0.5 A1,1.2 A0,0.5 A1,0 Z M2,0 L2,1.5 A1,2 A0,1.5 ) ;" ,
	width : 2 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["b"] ,
	drawCommands : "svg ( M2,1 A1,2 A0,1 A1,0 Z M0,4 L0,0 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["c"] ,
	drawCommands : "svg ( M2,1.5 A1,2 A0,1 A1,0 A2,0.5 ) ;" ,
	width : 2 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["d"] ,
	drawCommands : "svg ( M2,1 A1,2 A0,1 A1,0 Z M2,4 L2,0 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["e"] ,
	drawCommands : "svg ( M0.1,1.2 L2,1.2 A1,2 A0,1 A1,0 A2,0.5 ) ;" ,
	width : 2 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["f"] ,
	//drawCommands : "svg ( M2,3 A1.5,4 A1,3 L1,0 M0,2 L2,2 ) ;" ,
	drawCommands : "svg ( M2.5,3 A1.5,4 A1,3 L1,0 M0,2 L2,2 ) ;" ,
	//width : 2 ,
	width : 2.5 ,
	//ascending : 3.5 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["g"] ,
	drawCommands : "svg ( M2,1 A1,2 A0,1 A1,0 Z M0,-1 A1,-2 A2,-1 L2,2 ) ;" ,
	width : 2 ,
	ascending : 2 ,
	descending : 2
});
Astex.Symbol.addSymbol ({
	names : ["h"] ,
	drawCommands : "svg( M0,4 L0,0 M2,0 L2,1.5 A1,2 A0,1.5 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["i"] ,
	drawCommands : "svg ( M0.25,2 L0.25,0.1 A0.35,0 L0.5,0 L M0.25,3 L0.25,2.7 ) ;" ,
	width : 0.5 ,
	ascending : 3 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["j"] ,
	drawCommands : "svg ( M0,-1 A1,-2 A2,-1 L2,2 M2,3 L2,2.7 ) ;" ,
	width : 2 ,
	ascending : 3 ,
	descending : 2
});
Astex.Symbol.addSymbol ({
	names : ["k" , "kappa" , "\u03BA"] ,
	drawCommands : "svg ( M0,0 L0,4 M2,3 L0,1.5 L2,0 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["l"] ,
	drawCommands : "svg ( M0.25,4 L0.25,0 ) ;" ,
	width : 0.5 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["m"] ,
	drawCommands : "svg ( M2,0 L2,1 A1.5,2 A1,0 A0.5,2 A0,1 M0,2 L0,0 ) ;" ,
	width : 2 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["n"] ,
	drawCommands : "svg ( M2,0 L2,1 A1,2 A0,1 M0,2 L0,0 ) ;" ,
	width : 2 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["o" , "omicron" , "\u03BF"] ,
	drawCommands : "svg ( M2,1 A1,2 A0,1 A1,0 Z ) ;" ,
	width : 2 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["p"] ,
	drawCommands : "svg ( M2,1 A1,2 A0,1 A1,0 Z M0,2 L0,-2 ) ;" ,
	width : 2 ,
	ascending : 2 ,
	descending : 2
});
Astex.Symbol.addSymbol ({
	names : ["q"] ,
	drawCommands : "svg ( M2,1 A1,2 A0,1 A1,0 Z M2,2 L2,-2 L3,-1 ) ;" ,
	width : 3 ,
	ascending : 2 ,
	descending : 2
});
Astex.Symbol.addSymbol ({
	names : ["r"] ,
	drawCommands : "svg ( M2,1.5 A1,2 A0,1 M0,2 L0,0 ) ;" ,
	width : 2 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["s"] ,
	drawCommands : "svg ( M2,1.5 A1,2 A0,1.5 A1,1 M0,0.5 A1,0 A2,0.5 A1,1 ) ;" ,
	width : 1.7 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["t"] ,
	drawCommands : "svg ( M1,3 L1,0.5 A1.5,0 L2,0 M0,2 L2,2) ;" ,
	width : 2 ,
	ascending : 3 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["u" , "upsilon" , "\u03C5"] ,
	drawCommands : "svg ( M0,2 L0,1 A1,0 A2,1 M2,2 L2,0 ) ;" ,
	width : 2 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["v" , "nu" , "\u03BD"] ,
	drawCommands : "svg ( M0,2 L1,0 L2,2 ) ;" ,
	width : 2 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["w"] ,
	drawCommands : "svg ( M0,2 L0.5,0 L1,1 L1.5,0 L2,2 ) ;" ,
	width : 2 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["x"] ,
	drawCommands : "svg ( M0,2 L2,0 M0,0 L2,2 ) ;" ,
	width : 2 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["y"] ,
	drawCommands : "svg ( M0,2 L1,0 M0,-2 L2,2 ) ;" ,
	width : 2 ,
	ascending : 2 ,
	descending : 2
});
Astex.Symbol.addSymbol ({
	names : ["z"] ,
	drawCommands : "svg ( M0,2 L2,2 L0,0 L2,0 M0.5,1 L1.5,1 ) ;" ,
	width : 2 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["A" , "Alpha" , "\u0391"] ,
	drawCommands : "svg ( M0,0 L1,4 L2,0 M0.5,2 L1.5,2 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["B" , "Beta" , "\u0392"] ,
	drawCommands : "svg ( M0,2 L0.5,2 A2,3 A1,4 L0,4 L0,0 L1,0 A2,1 A0.5,2 L0,2 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["C"] ,
	drawCommands : "svg ( M2,3 A1,4 A0,2 A1,0 A2,1 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["D"] ,
	drawCommands : "svg ( M0,4 L0,0 L0.5,0 A2,2 A0.5,4 L0,4 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["E" , "Epsilon" , "\u0395"] ,
	drawCommands : "svg ( M2,4 L0,4 L0,0 L2,0 M0,2 L2,2 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["F"] ,
	drawCommands : "svg ( M2,4 L0,4 L0,0 M0,2 L1.5,2 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["G"] ,
	drawCommands : "svg ( M2,3 A1,4 A0,2 A1,0 A2,1 M2,0 L2,2 L1,2 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["H" , "Eta" , "\u0397"] ,
	drawCommands : "svg ( M0,4 L0,0 M2,4 L2,0 M0,2 L2,2 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["I" , "Iota" , "\u0399"] ,
	drawCommands : "svg ( M1,4 L1,0 M0,4 L2,4 M0,0 L2,0 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["J"] ,
	drawCommands : "svg ( M0,1 A1,0 A2,1 L2,4 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["K" , "Kappa" , "\u039A"] ,
	drawCommands : "svg ( M0,4 L0,0 M2,4 L0,1.5 L2,0 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["L"] ,
	drawCommands : "svg ( M0,4 L0,0 L2,0 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["M" , "Mu" , "\u039C"] ,
	drawCommands : "svg ( M0,0 L0,4 L1,1.5 L2,4 L2,0 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["N" , "Nu" , "\u039D"] ,
	drawCommands : "svg ( M0,0 L0,4 L2,0 L2,4 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["O" , "Omicron" , "\u039F"] ,
	drawCommands : "svg ( M0,2 A1,0 A2,2 A1,4 Z ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["P" , "Rho" , "\u03A1"] ,
	drawCommands : "svg ( M0,2 L1,2 A2,3 A1,4 L0,4 L0,0 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["Q"] ,
	drawCommands : "svg ( M0,2 A1,0 A2,2 A1,4 Z M1.3,1 L2,0 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["R"] ,
	drawCommands : "svg ( M0,2 L1,2 A2,3 A1,4 L0,4 L0,0 M0,2 L2,0) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["S"] ,
	drawCommands : "svg ( M2,3 A1,4 A0,3 A1,2 M0,1 A1,0 A2,1 A1,2 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["T" , "Tau" , "\u03A4"] ,
	drawCommands : "svg ( M1,4 L1,0 M0,4 L2,4 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["U"] ,
	drawCommands : "svg ( M0,4 L0,1 A1,0 A2,1 L2,4 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["V"] ,
	drawCommands : "svg ( M0,4 L1,0 L2,4 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["W"] ,
	drawCommands : "svg ( M0,4 L0.5,0 L1,1.6 L1.5,0 L2,4 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["X" , "Chi" , "\u03A7"] ,
	drawCommands : "svg ( M0,4 L2,0 M0,0 L2,4 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["Y" , "Upsilon" , "\u03A5"] ,
	drawCommands : "svg ( M0,4 L1,2 L2,4 M1,2 L1,0 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["Z" , "Zeta" , "\u0396"] ,
	drawCommands : "svg ( M0,4 L2,4 L0,0 L2,0 M0.5,2 L1.5,2 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["alpha" , "\u03B1"] ,
	drawCommands : "svg ( M2,0 L1.6,1 A0.8,2 A0,1 A0.8,0 A1.6,1 L2,2 ) ;" ,
	width : 2 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["beta" , "\u03B2"] ,
	drawCommands : "svg ( M0,2 L0.5,2 A1.6,3 A1,4 L0,4 L0,0 L1,0 A2,1 A0.5,2 L0,2 M0,0 L0,-1 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 1
});
Astex.Symbol.addSymbol ({
	names : ["gamma" , "\u03B3"] ,
	//drawCommands : "svg ( M2,2 L0.8,0 A0.4,-1 A1,-2 A1.6,-1 A1.2,0 L0,2 ) ;" ,
	drawCommands : "svg ( M2,2 L1,0 A0.6,-1 A1,-2 A1.4,-1 A1,0 L0,2 ) ;" ,
	width : 2 ,
	ascending : 2 ,
	descending : 2
});
Astex.Symbol.addSymbol ({
	names : ["delta" , "\u03B4"] ,
	drawCommands : "svg ( M0,1 A1,0 A2,1 A1,2 Z M2,4 A1,3.5 A1.4,2.6 L1.8,1.6 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["epsilon" , "\u03B5" , "\u025B"] ,
	drawCommands : "svg ( M2,2.5 A1,3 A0,2 A1,1.5 A0,1 A1,0 A2,0.5 ) ;" ,
	width : 2 ,
	ascending : 3 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["zeta" , "\u03B6"] ,
	drawCommands : "svg ( M0.5,4 A1,3.5 A2,4 A0,2.5 L0,1 A1.5,0 M1,-1 A2,-0.5 A1.5,0 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 1
});
Astex.Symbol.addSymbol ({
	names : ["eta" , "\u03B7"] ,
	drawCommands : "svg ( M2,-1 A2.5,-1.5 M2,-1 L2,1 A1,2 A0,1 M0,2 L0,0 ) ;" ,
	width : 2.5 ,
	ascending : 2 ,
	descending : 1.5
});
Astex.Symbol.addSymbol ({
	names : ["theta" , "\u03B8" , "\u03D1"] ,
	drawCommands : "svg ( M0,2 A1,0 A2,2 A1,4 Z M0,2 L2,2 ) ;" ,
	width : 2 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["iota" , "\u03B9"] ,
	drawCommands : "svg ( M0.25,2 L0.25,0.1 A0.35,0 L0.5,0 ) ;" ,
	width : 0.5 ,
	ascending : 2 ,
	descending : 0
});
// kappa ( same as english lower-case k )
Astex.Symbol.addSymbol ({
	names : ["lambda" , "\u03BB"] ,
	drawCommands : "svg ( M1.3,2 L0,0 M0.5,4 L2,0 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["mu" , "\u03BC"] ,
	drawCommands : "svg ( M0,2 L0,-1 M0,1 A1,0 A2,1 M2,2 L2,0 ) ;" ,
	width : 2 ,
	ascending : 2 ,
	descending : 1
});
// nu ( same as english lower-case v )
Astex.Symbol.addSymbol ({
	names : ["xi" , "\u03BE"] ,
	drawCommands : "svg ( M0.5,4 A1,3.5 A2,4 A0,2.5 A1,2 A0,1 A1.5,0 M1,-1 A2,-0.5 A1.5,0 ) ;" ,
	width : 2 ,
	ascending : 2 ,
	descending : 1
});
// omicron ( same as english lower-case o )
Astex.Symbol.addSymbol ({
	names : ["pi" , "\u03C0" , "\u03D5"] ,
	drawCommands : "svg ( M0,2 L2,2 M0.5,2 L0.5,0 M1.5,2 L1.5,0 ) ;" ,
	width : 2 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["rho" , "\u03C1" , "\u03F1"] ,
	drawCommands : "svg ( M0,1 A1,0 A2,1 A1,2 Z M0,1 L0.5,-2 ) ;" ,
	width : 2 ,
	ascending : 2 ,
	descending : -2
});
Astex.Symbol.addSymbol ({
	names : ["sigma" , "\u03C3"] ,
	drawCommands : "svg ( M0,1 A1,0 A2,1 A1,2 Z M1,2 A0.5,1.75 A1,1.5 L3,2 ) ;" ,
	width : 3 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["sigmaf" , "\u03C2"] ,
	drawCommands : "svg ( M2,1.5 A1,2 A0,1 A1.5,0 M1,-1 A2,-0.5 A1.5,0 ) ;" ,
	width : 2 ,
	ascending : 2 ,
	descending : 1
});
Astex.Symbol.addSymbol ({
	names : ["tau" , "\u03C4"] ,
	drawCommands : "svg ( M1,2 L1,0.5 A1.5,0 L2,0 M0,2 L2,2 ) ;" ,
	width : 2 ,
	ascending : 2 ,
	descending : 0
});
// upsilon ( same as english lower-case u )
Astex.Symbol.addSymbol ({
	names : ["phi" , "\u03C6" , "\u03D5"] ,
	drawCommands : "svg ( M0,1 A1,0 A2,1 A1,2 Z M1,-0.5 L1,2.5 A0.5,3 M1,-0.5 A1.5,-1 ) ;" ,
	width : 2 ,
	ascending : 3 ,
	descending : 1
});
Astex.Symbol.addSymbol ({
	names : ["chi" , "\u03C7"] ,
	drawCommands : "svg ( M1.5,0 L0.5,4 A0,3.5 M1.5,0 A2,0.5 M0,0 L2,4 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["psi" , "\u03C8"] ,
	drawCommands : "svg ( M0,3 A1,1 A2,3 M1,4 L1,0 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["omega" , "\u03C9"] ,
	drawCommands : "svg ( M0.5,2 A0,1.25 A0.5,0 A1,1.5 A1.5,0 A2,1.25 A1.5,2 ) ;" ,
	width : 2 ,
	ascending : 2 ,
	descending : 0
});
// Alpha ( same as english upper-case A )
// Beta ( same as english upper-case B )
Astex.Symbol.addSymbol ({
	names : ["Gamma" , "\u0393"] ,
	drawCommands : "svg ( M2,3 L2,4 L0,4 L0,0 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["Delta" , "\u0394" , "\u25B3"] ,		// also triangle and partial
	drawCommands : "svg ( M0,0 L1,4 L2,0 Z ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
// Epsilon ( same as english upper-case E )
// Zeta ( same as english upper-case Z )
// Eta ( same as english upper-case H )
Astex.Symbol.addSymbol ({
	names : ["Theta" , "\u0398"] ,
	drawCommands : "svg ( M0,2 A1,0 A2,2 A1,4 Z M0.5,2 L1.5,2 M0.5,2.5 L0.5,1.5 M1.5,2.5 L1.5,1.5 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
// Iota ( same as english upper-case I )
// Kappa ( same as english upper-case I )
Astex.Symbol.addSymbol ({
	names : ["Lambda" , "\u039B"] ,
	drawCommands : "svg ( M0,0 L0.5,0 M0.25,0 L1,4 L1.75,0 M1.5,0 L2,0 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
// Mu ( same as english upper-case M )
// Nu ( same as english upper-case N )
Astex.Symbol.addSymbol ({
	names : ["Xi" , "\u039E"] ,
	drawCommands : "svg ( M2,3 L2,4 L0,4 L0,3 M0,1 L0,0 L2,0 L2,1 M0.5,2 L1.5,2 M0.5,2.5 L0.5,1.5 M1.5,2.5 L1.5,1.5 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
// Omicron ( same as english upper-case O )
Astex.Symbol.addSymbol ({
	names : ["Pi" , "\u03A0" , "\u220F"] ,
	//drawCommands : "svg ( M0,4 L2,4 M0.5,4 L0.5,0 M1.5,4 L1.5,0 ) ;" ,
	drawCommands : "svg ( M0,4 L4,4 M1,4 L1,0 M3,4 L3,0 ) ;" ,
	width : 4 ,
	ascending : 4 ,
	descending : 0
});
// Rho ( same as english upper-case P )
Astex.Symbol.addSymbol ({
	names : ["Sigma" , "\u03A3" , "\u2211"] ,
	drawCommands : "svg ( M2,3 L2,4 L0,4 L1.3,2 L1.3,2 L0,0 L2,0 L2,1 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
// Tau ( same as english upper-case T )
// Upsilon ( same as english upper-case Y )
Astex.Symbol.addSymbol ({
	names : ["Phi" , "\u03A6"] ,
	drawCommands : "svg ( M0,2 A1,1 A2,2 A1,3 Z M0.5,4 L1.5,4 M1,4 L1,0 M0.5,0 L1.5,0 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
// Chi ( same as english upper-case X )
Astex.Symbol.addSymbol ({
	names : ["Psi" , "\u03A8"] ,
	drawCommands : "svg ( M0,3 A1,1 A2,3 M1,4 L1,0 M0.5,4 L1.5,4 M0.5,0 L1.5,0 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["Omega" , "\u03A9"] ,
	drawCommands : "svg ( M3,0 L2,0 A3,2 A1.5,4 A0,2 A1,0 L0,0 ) ;" ,
	width : 3 ,
	ascending : 4 ,
	descending : 0
});

//
// miscellaneous QWERTY keyboard characters
//
Astex.Symbol.addSymbol ({
	//names : ["~" , "tilde"] ,
	names : ["~" , "\u02DC"] ,
	drawCommands : "svg ( M1,1.5 A0.5,2 A0,1 M1,1.5 A1.5,1 A2,2 ) ;" ,
	width : 1.75 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["`"] ,
	drawCommands : "svg ( M0,4 L0.5,3.5 ) ;" ,
	width : 0.5 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["!"] ,
	drawCommands : "svg ( M0.5,4 L0.5,1.25 M0.5,0.7 L0.5,0.2 ) ;" ,
	width : 1 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["@"] ,
	drawCommands : "svg ( M1.5,1.4 L1.5,0.5 A1,1.5 A0.5,1 A1,0.5 A2,1 A1,2 A0,1 A1,0 A2,0.5 ) ;" ,
	width : 2 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["#"] ,
	drawCommands : "svg ( M0,1.5 L2,1.5 M0,3 L2,3 M0.5,4 L0.5,0.5 M1.5,4 L1.5,0.5 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["$"] ,
	drawCommands : "svg ( M2,3 A1,4 A0,3 A1,2 M0,1 A1,0 A2,1 A1,2 M1,5 L1,-1 ) ;" ,
	width : 2 ,
	ascending : 5 ,
	descending : 1
});
Astex.Symbol.addSymbol ({
	names : ["%"] ,
	drawCommands : "svg ( M2,4 L0,0 M0,3 A0.5,2.5 A1,3 A0.5,3.5 Z M1,1 A1.5,0.5 A2,1 A1.5,1.5 Z ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["^" , "\u005E" , "\u0302"] ,
	//drawCommands : "svg ( M0,3 L0.5,4 L1,3 ) ;" ,
	//drawCommands : "svg ( M0,0 L0.5,1 L1,0 ) ;" ,
	//drawCommands : "svg ( M0,0 L1,1 L2,0 ) ;" ,
	drawCommands : "svg ( M0,0 L0.5,2 L1,0 ) ;" ,
	width : 1 ,
	//width : 2 ,
	//ascending : 4 ,
	//ascending : 1 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["&"] ,
	drawCommands : "svg ( M1,2.5 A1.5,3.5 A1,4 A0.5,3.5 A0.8,2.5 L2,0 M1,2.5 A0,1 A1,0 A2,1.5 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["*" , "\u002A"] ,
	drawCommands : "svg ( M1,3 L1,1 M0.2,2.8 L1.8,1.2 M1.8,2.8 L0.2,1.2 M0,2 L2,2 ) ;" ,
	width : 2 ,
	ascending : 3 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["_" , "\u00AF" , "\u203E" , "\u0332"] ,			// also used as an overscore/bar and underline
	drawCommands : "svg ( M0,0 L2,0 ) ;" ,
	width : 2 ,
	ascending : 0.1 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["|"] ,
	drawCommands : "svg ( M0.5,4 L0.5,0 ) ;" ,
	width : 1 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["\\"] ,
	drawCommands : "svg ( M0,4 L2,0 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["/"] ,
	drawCommands : "svg ( M0,0 L2,4 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["?"] ,
	drawCommands : "svg ( M1,1.2 L1,2 A2,2.5 A1,4 A0,3 M1,0.8 L1,0.4 ) ;" ,
	width : 2 ,
	ascending : 4 , 
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["'" , "\u2032"] ,			// also for \\prime
	drawCommands : "svg ( M0.5,4 L0.5,3 ) ;" ,
	width : 1 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["\""] ,
	drawCommands : "svg ( M0.3,4 L0.3,3 M0.7,4 L0.7,3 ) ;" ,
	width : 1 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["."] ,
	//drawCommands : "svg ( M0.5,0.2 L0.5,0 ) ;" ,
	//drawCommands : "fill = true ; svg ( M0.25,0 A0.5,0.25 A0.25,0.5 A0,0.25 Z ) ;" ,
	drawCommands : "fill = true ; svg ( M0.5,0 A1,0.5 A0.5,1 A0,0.5 Z ) ;" ,
	width : 1 ,
	ascending : 1 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : [","] ,
	//drawCommands : "svg ( M0.5,-0.5 A0.8,0 A0.5,0.5 ) ;" ,
	drawCommands : "fill = true ; svg ( M0.5,0 A1,0.5 A0.5,1 A0,0.5 Z ) ; fill = false; svg ( M0.5,-1 A1,0.5 ) ;" ,
	width : 1 ,
	ascending : 1 ,
	//descending : 0.5
	descending : 1
});
Astex.Symbol.addSymbol ({
	names : [";"] ,
	//drawCommands : "svg ( M0.5,2 L0.5,1.5 M0.5,-0.5 A0.8,0 A0.5,0.5 ) ;" ,
	drawCommands : "fill = true ; svg ( M0.5,2 A1,2.5 A0.5,3 A0,2.5 Z ) ; svg ( M0.5,0 A1,0.5 A0.5,1 A0,0.5 Z ) ; fill = false; svg ( M0.5,-1 A1,0.5 ) ;" ,
	width : 1 ,
	//ascending : 2 ,
	ascending : 3 ,
	//descending : 0.5
	descending : 1
});
Astex.Symbol.addSymbol ({
	names : [":"] ,
	//drawCommands : "svg ( M0.5,2 L0.5,1.5 M0.5,1 L0.5,0.5 ) ;" ,
	drawCommands : "fill = true ; svg ( M0.5,2 A1,2.5 A0.5,3 A0,2.5 Z ) ; svg ( M0.5,0 A1,0.5 A0.5,1 A0,0.5 Z ) ;" ,
	width : 1 ,
	//ascending : 2 ,
	ascending : 3 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["["] ,
	//drawCommands : "svg ( M1,4 L0,4 L0,0 L1,0 ) ;" ,
	drawCommands : "svg ( M1,2 L0,2 L0,0 L1,0 ) ;" ,
	width : 1 ,
	//ascending : 4 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["]"] ,
	//drawCommands : "svg ( M0,4 L1,4 L1,0 L0,0 ) ;" ,
	drawCommands : "svg ( M0,2 L1,2 L1,0 L0,0 ) ;" ,
	width : 1 ,
	//ascending : 4 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["<" , "\u2329"] ,
	//drawCommands : "svg ( M2,4 L0,2 L2,0 ) ;" ,
	drawCommands : "svg ( M2,2 L0,1 L2,0 ) ;" ,
	width : 2 ,
	//ascending : 4 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : [">" , "\u232A"] ,
	//drawCommands : "svg ( M0,4 L2,2 L0,0 ) ;" ,
	drawCommands : "svg ( M0,2 L2,1 L0,0 ) ;" ,
	width : 2 ,
	//ascending : 4 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["("] ,
	//drawCommands : "svg ( M1,4 A0,2 A1,0 ) ;" ,
	drawCommands : "svg ( M1,2 A0,1 A1,0 ) ;" ,
	width : 1 ,
	//ascending : 4 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : [")"] ,
	//drawCommands : "svg ( M0,0 A1,2 A0,4 ) ;" ,
	drawCommands : "svg ( M0,0 A1,1 A0,2 ) ;" ,
	width : 1 ,
	//ascending : 4 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["{"] ,
	//drawCommands : "svg ( M1.5,4 A0.5,2.5 M0.5,1.5 A0,2 A0.5,2.5 M0.5,1.5 A1.5,0 ) ;" ,
	//drawCommands : "svg ( M1.5,2 A0.5,1.25 M0.5,0.75 A0,1 A0.5,1.25 M0.5,0.75 A1.5,0 ) ;" ,
	//drawCommands : "svg ( M2,2 A1,1.25 M1,0.75 A0,1 A1,1.25 M1,0.75 A2,0 ) ;" ,
	drawCommands : "svg ( M2,2 A1,1.5 M1,0.5 A0,1 A1,1.5 M1,0.5 A2,0 ) ;" ,
	//width : 1.5 ,
	width : 2 ,
	//ascending : 4 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["}"] ,
	//drawCommands : "svg ( M1,2.5 A0,4 M1,2.5 A1.5,2 A1,1.5 M0,0 A1,1.5 ) ;" ,
	//drawCommands : "svg ( M1,1.25 A0,2 M1,1.25 A1.5,1 A1,0.75 M0,0 A1,0.75 ) ;" ,
	drawCommands : "svg ( M1,1.5 A0,2 M1,1.5 A2,1 A1,0.5 M0,0 A1,0.5 ) ;" ,
	//width : 1.5 ,
	width : 2 ,
	//ascending : 4 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["overbrace" , "\u23B4"] ,
	//drawCommands : "svg ( M2,2 A1,1.5 M1,0.5 A0,1 A1,1.5 M1,0.5 A2,0 ) ;" ,
	drawCommands : "svg ( M2,0 A1.5,1 M0.5,1 A1,2 A1.5,1 M0.5,1 A0,0 ) ;" ,
	width : 2 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["underbrace" , "\u23B5"] ,
	//drawCommands : "svg ( M2,2 A1,1.5 M1,0.5 A0,1 A1,1.5 M1,0.5 A2,0 ) ;" ,
	drawCommands : "svg ( M1.5,1 A2,2 M1.5,1 A1,0 A0.5,1 M0,2 A0.5,1 ) ;" ,
	width : 2 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["-"] ,
	//drawCommands : "svg ( M0,2 L2,2 ) ;" ,
	drawCommands : "svg ( M0,1 L2,1 ) ;" ,
	width : 2 ,
	ascending : 2 ,		// really 1
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["+"] ,
	//drawCommands : "svg ( M0,2 L2,2 M1,3 L1,1 ) ;" ,
	drawCommands : "svg ( M0,1 L2,1 M1,2 L1,0 ) ;" ,
	width : 2 ,
	//ascending : 3 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["="] ,
	//drawCommands : "svg ( M0,1.5 L2,1.5 M0,2.5 L2,2.5 ) ;" ,
	//drawCommands : "svg ( M0,1 L2,1 M0,2 L2,2 ) ;" ,
	drawCommands : "svg ( M0,0 L2,0 M0,1 L2,1 ) ;" ,
	//drawCommands : "svg ( M0,2 L2,2 M0,3 L2,3 ) ;" ,
	//drawCommands : "svg ( M0,0.5 L2,0.5 M0,1.5 L2,1.5 ) ;" ,
	width : 2 ,
	ascending : 1 ,
	descending : 0
});

//
// math operation symbols
//
// \ (see QWERTY keyboard characters)
// + (see QWERTY keyboard characters)
// - (see QWERTY keyboard characters)
Astex.Symbol.addSymbol ({
	names : ["times-x" , "\u00D7"] ,
	//drawCommands : "svg ( M0,1 L1.5,2.5 M0,2.5 L1.5,1 ) ;" ,
	drawCommands : "svg ( M0,0 L1.5,1.5 M0,1.5 L1.5,0 ) ;" ,
	width : 1.5 ,
	ascending : 1.5 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["times-dot" , "\u22C5"] ,
	//drawCommands : "fill = true ; svg ( M0,2 A0.5,1.5 A1,2 A0.5,2.5 Z ) ;" ,
	//drawCommands : "fill = true ; svg ( M0,2 L0.5,1.5 L1,2 L0.5,2.5 Z ) ;" ,
	drawCommands : "fill = true ; svg ( M0.5,0 A1,0.5 A0.5,1 A0,0.5 Z ) ;" ,
	width : 1 ,
	ascending : 1 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["star" , "\u22C6"] ,
	//drawCommands : "fill = true ; svg ( M1,3.25 L0.5,1.25 L1.75,2.5 L0.25,2.5 L1.5,1.25 Z ) ;" ,	// leaves inner pentagon unfilled
	drawCommands : "fill = true ; svg ( M1,3.25 L0.5,1.25 L1.75,2.5 L0.25,2.5 L1.5,1.25 Z M0.8,2.5 L0.7,2 L1,1.7 L1.3,2 L1.2,2.5 Z ) ;" ,
	width : 2 ,
	ascending : 3 ,
	descending : 0
});
// / division slash (see QWERTY keyboard characters)
Astex.Symbol.addSymbol ({
	//names : ["-:" , "dividedby"] ,
	names : ["-:" , "\u00F7"] ,
	drawCommands : "fill = true ; svg ( M1.5,2.5 A1,3 A0.5,2.5 A1,2 Z M0,1.5 L2,1.5 M1.5,0.5 A1,1 A0.5,0.5 A1,0 Z ) ;" ,
	//drawCommands : "svg ( M1,4 L1,3.5 M0,2.5 L2,2.5 M1,1.5 L1,1 ) ;" ,
	//drawCommands : "fill = true ; svg ( M1.2,2 L1.2,3 L0.8,3 L0.8,2 Z M0,1.5 L2,1.5 M1.2,0 L1.2,1 L0.8,1 L0.8,0 Z ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["circle" , "\u2218"] ,		// composition of functions
	drawCommands : "svg ( M1.5,1.5 A1,2 A0.5,1.5 A1,1 Z ) ;" ,
	width : 2 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["o+" , "\u2295"] ,		// o-plus
	drawCommands : "svg ( M2,2 A1,3 A0,2 A1,1 Z M0,2 L2,2 M1,3 L1,1 ) ;" ,
	width : 2 ,
	ascending : 3 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["big-o+" , "\u2A01"] ,		// big o-plus
	drawCommands : "svg ( M3,2 A1.5,3.5 A0,2 A1.5,0.5 Z M0.5,2 L2.5,2 M1.5,3 L1.5,1 ) ;" ,
	width : 3 ,
	ascending : 3.5 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["o-" , "\u2296"] ,	// o-minus
	drawCommands : "svg ( M2,2 A1,3 A0,2 A1,1 Z M0,2 L2,2 ) ;" ,
	width : 2 ,
	ascending : 3 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["ox" , "\u2297"] ,	// o-times
	drawCommands : "svg ( M2,2 A1,3 A0,2 A1,1 Z M1.7,2.7 L0.3,1.4 M0.3,2.7 L1.7,1.4 ) ;" ,
	width : 2 ,
	ascending : 3 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["big-ox" , "\u2A02"] ,	// big o-times
	drawCommands : "svg ( M3,2 A1.5,3.5 A0,2 A1.5,0.5 Z M0.6,3.1 L2.5,1 M2.5,3.1 L0.6,1 ) ;" ,
	width : 3 ,
	ascending : 3.5 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["o/" , "\u2298"] ,	// o-slash
	drawCommands : "svg ( M2,2 A1,3 A0,2 A1,1 Z M1.7,2.7 L0.3,1.4 ) ;" ,
	width : 2 ,
	ascending : 3 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["o." , "\u2299"] ,		// o-dot
	drawCommands : "svg ( M2,2 A1,3 A0,2 A1,1 Z ) ; fill = true ; svg ( M1.5,2 A1,2.5 A0.5,2 A1,1.5 Z ) ; " ,
	//drawCommands : " fill = true ; svg ( M1.5,2 A1,2.5 A0.5,2 A1,1.5 Z ) ; fill = false ; svg ( M2,2 A1,3 A0,2 A1,1 Z ) ; " ,
	//drawCommands : "svg ( M2,2 A1,3 A0,2 A1,1 Z M1,2.2 L1,1.8 ) ; " ,
	width : 2 ,
	ascending : 3 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["big-o." , "\u2A00"] ,	// big o-dot
	drawCommands : "svg ( M3,2 A1.5,3.5 A0,2 A1.5,0.5 Z ) ; fill = true ; svg ( M2,2 A 1.5,2.5 A1,2 A1.5,1.5 Z ) ; " ,
	width : 3 ,
	ascending : 3.5 ,
	descending : 0
});
// sum (see Sigma)
// product (see Pi)
Astex.Symbol.addSymbol ({
	names : ["wedge" , "\u2227"] ,
	drawCommands : "svg ( M0,0 L1,4 L2,0 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["big-wedge" , "\u22C0"] ,
	drawCommands : "svg ( M0,0 L1.5,4 L3,0 ) ;" ,
	width : 3 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["vee" , "\u2228"] ,
	drawCommands : "svg ( M0,4 L1,0 L2,4 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["big-vee" , "\u22C1"] ,
	drawCommands : "svg ( M0,4 L1.5,0 L3,4 ) ;" ,
	width : 3 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["cup" , "\u222A"] ,
	drawCommands : "svg ( M0,4 L0,1 A1,0 A2,1 L2,4 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["big-cup" , "\u22C3"] ,
	drawCommands : "svg ( M0,4 L0,1 A1.5,0 A3,1 L3,4 ) ;" ,
	width : 3 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["square-cup" , "\u2294"] ,
	drawCommands : "svg ( M0,4 L0,0 L2,0 L2,4 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["big-square-cup" , "\u2A06"] ,
	drawCommands : "svg ( M0,4 L0,0 L3,0 L3,4 ) ;" ,
	width : 3 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["cap" , "\u2229"] ,
	drawCommands : "svg ( M2,0 L2,3 A1,4 A0,3 L0,0 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["big-cap" , "\u22C2"] ,
	drawCommands : "svg ( M3,0 L3,3 A1.5,4 A0,3 L0,0 ) ;" ,
	width : 3 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["square-cap" , "\u2293"] ,
	drawCommands : "svg ( M2,0 L2,4 L0,4 L0,0 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["big-square-cap" , "\u2A05"] ,
	drawCommands : "svg ( M3,0 L3,4 L0,4 L0,0 ) ;" ,
	width : 3 ,
	ascending : 4 ,
	descending : 0
});


//
// math relation symbols
//
Astex.Symbol.addSymbol ({
	names : ["!=" , "\u2260"] ,
	//drawCommands : "svg ( M0,1.5 L2,1.5 M0,2.5 L2,2.5 M1.5,3.5 L0.5,0.25 ) ;" ,
	drawCommands : "svg ( M0,0.5 L2,0.5 M0,1.5 L2,1.5 M1.5,2.5 L0.5,0 ) ;" ,
	width : 2 ,
	//ascending : 3.5 ,
	ascending : 2.5 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : [":="] ,
	//drawCommands : "svg ( M0,1.25 L0,1.75 M0,2.75 L0,3.25 M0.5,1.5 L2.5,1.5 M0.5,3 L2.5,3 ) ;" ,
	//drawCommands : "svg ( M0.25,1.25 A0.5,1.5 A0.25,1.75 A0,1.5 Z M0.5,1.5 L2.5,1.5 M0.5,3 L2.5,3 ) ;" ,
	//drawCommands : "fill = true ; svg ( M0.5,1 A1,1.5 A0.5,2 A0,1.5 Z M0.5,2.5 A1,3 A0.5,3.5 A0,3 Z ) ; fill = false; svg ( M1.5,1.5 L3.5,1.5 M1.5,3 L3.5,3 ) ;" ,
	drawCommands : "fill = true ; svg ( M0.5,0 A1,0.5 A0.5,1 A0,0.5 Z M0.5,1.5 A1,2 A0.5,2.5 A0,2 Z ) ; fill = false; svg ( M1.5,0.5 L3.5,0.5 M1.5,2 L3.5,2 ) ;" ,
	width : 3.5 ,
	//ascending : 3.25 ,
	ascending : 2.5 ,
	descending : 0
});
// < (see QWERTY keyboard characters)
// > (see QWERTY keyboard characters)
Astex.Symbol.addSymbol ({
	names : ["<=" , "\u2264"] ,
	//drawCommands : "svg ( M2,4 L0,2.5 L2,1 M0,0.5 L2,0.5 ) ;" ,
	drawCommands : "svg ( M2,2.5 L0,1.5 L2,0.5 M0,0 L2,0 ) ;" ,
	width : 2 ,
	//ascending : 4 ,
	ascending : 2.5 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : [">=" , "\u2265"] ,
	//drawCommands : "svg ( M0,4 L2,2.5 L0,1 M0,0.5 L2,0.5 ) ;" ,
	drawCommands : "svg ( M0,2.5 L2,1.5 L0,0.5 M0,0 L2,0 ) ;" ,
	width : 2 ,
	//ascending : 4 ,
	ascending : 2.5 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["prec" , "\u227A"] ,
	//drawCommands : "svg ( M2,0 A0,2 A2,4 ) ;" ,
	drawCommands : "svg ( M2,0 A0,1 A2,2 ) ;" ,
	width : 2 ,
	//ascending : 4 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["succ" , "\u227B"] ,
	//drawCommands : "svg ( M0,4 A2,2 A0,0 ) ;" ,
	drawCommands : "svg ( M0,2 A2,1 A0,0 ) ;" ,
	width : 2 ,
	//ascending : 4 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["preceq" , "\u2AAF" , "\u227C"] ,
	//drawCommands : "svg ( M2,1 A0,2.5 A2,4 M0,0.5 L2,0.5 ) ;" ,
	drawCommands : "svg ( M2,0.5 A0,1.5 A2,2.5 M0,0 L2,0 ) ;" ,
	width : 2 ,
	//ascending : 4 ,
	ascending : 2.5 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["succeq" , "\u2AB0" , "\u227D"] ,
	//drawCommands : "svg ( M0,4 A2,2.5 A0,1 M0,0.5 L2,0.5 ) ;" ,
	drawCommands : "svg ( M0,2.5 A2,1.5 A0,0.5 M0,0 L2,0 ) ;" ,
	width : 2 ,
	//ascending : 4 ,
	ascending : 2.5 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["element-of" , "\u2208"] ,	// don't use "in" since this conflicts with tokens such as sin, sinh, min, etc.
	drawCommands : "svg ( M2,4 A0,2.5 A2,1 M0,2.5 L2,2.5 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["contains-element" , "\u220B"] ,
	drawCommands : "svg ( M0,1 A2,2.5 A0,4 M0,2.5 L2,2.5 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["!in" , "\u2209"] ,
	drawCommands : "svg ( M2,4 A0,2.5 A2,1 M0,2.5 L2,2.5 M1.5,4.5 L0.5,0.5 ) ;" ,
	width : 2 ,
	ascending : 4.5 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["subset" , "\u2282"] ,
	//drawCommands : "svg ( M3,4 L1,4 A0,2.5 A1,1 L3,1 ) ;" ,
	//drawCommands : "svg ( M3,3 L1,3 A0,1.5 A1,0 L3,0 ) ;" ,
	drawCommands : "svg ( M3,2 L1,2 A0,1 A1,0 L3,0 ) ;" ,
	width : 3 ,
	//ascending : 3 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["superset" , "\u2283"] ,
	//drawCommands : "svg ( M0,1 L2,1 A3,2.5 A2,4 L0,4 ) ;" ,
	//drawCommands : "svg ( M0,0 L2,0 A3,1.5 A2,3 L0,3 ) ;" ,
	drawCommands : "svg ( M0,0 L2,0 A3,1 A2,2 L0,2 ) ;" ,
	width : 3 ,
	//ascending : 3 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["subseteq" , "\u2286"] ,
	//drawCommands : "svg ( M3,4 L1,4 A0,2.5 A1,1 L3,1 M0,0.5 L3,0.5 ) ;" ,
	drawCommands : "svg ( M3,2.5 L1,2.5 A0,1.5 A1,0.5 L3,0.5 M0,0 L3,0 ) ;" ,
	width : 3 ,
	//ascending : 4 ,
	ascending : 2.5 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["superseteq" , "\u2287"] ,
	//drawCommands : "svg ( M0,1 L2,1 A3,2.5 A2,4 L0,4 M0,0.5 L3,0.5 ) ;" ,
	drawCommands : "svg ( M0,0.5 L2,0.5 A3,1.5 A2,2.5 L0,2.5 M0,0 L3,0 ) ;" ,
	width : 3 ,
	//ascending : 4 ,
	ascending : 2.5 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["square-subset" , "\u228F"] ,
	//drawCommands : "svg ( M3,4 L0,4 L0,1 L3,1 ) ;" ,
	drawCommands : "svg ( M3,2 L0,2 L0,0 L3,0 ) ;" ,
	width : 3 ,
	//ascending : 4 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["square-subset-eq" , "\u2291"] ,
	//drawCommands : "svg ( M3,4 L0,4 L0,1 L3,1 M0,0 L3,0 ) ;" ,
	drawCommands : "svg ( M3,2.5 L0,2.5 L0,0.5 L3,0.5 M0,0 L3,0 ) ;" ,
	width : 3 ,
	//ascending : 4 ,
	ascending : 2.5 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["square-superset" , "\u2290"] ,
	//drawCommands : "svg ( M0,4 L3,4 L3,1 L0,1 ) ;" ,
	drawCommands : "svg ( M0,2 L3,2 L3,0 L0,0 ) ;" ,
	width : 3 ,
	//ascending : 4 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["square-superset-eq" , "\u2292"] ,
	//drawCommands : "svg ( M0,4 L3,4 L3,1 L0,1 M0,0 L3,0 ) ;" ,
	drawCommands : "svg ( M0,2.5 L3,2.5 L3,0.5 L0,0.5 M0,0 L3,0 ) ;" ,
	width : 3 ,
	//ascending : 4 ,
	ascending : 2.5 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["equiv" , "\u2261"] ,
	//drawCommands : "svg ( M0,3 L2,3 M0,2 L2,2 M0,1 L2,1 ) ;" ,
	drawCommands : "svg ( M0,2 L2,2 M0,1 L2,1 M0,0 L2,0 ) ;" ,
	width : 2 ,
	//ascending : 3 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["congruent" , "\u2245"] ,
	//drawCommands : "svg ( M1,3 A0.5,3.5 A0,2.5 M1,3 A1.5,2.5 A2,3.5 M0,2 L2,2 M0,1 L2,1 ) ;" ,
	drawCommands : "svg ( M1,2 A0.5,2.5 A0,1.5 M1,2 A1.5,1.5 A2,2.5 M0,1 L2,1 M0,0 L2,0 ) ;" ,
	width : 2 ,
	//ascending : 3 ,
	ascending : 2.5 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["approx" , "\u2248"] ,
	//drawCommands : "svg ( M1,3 A0.5,3.5 A0,2.5 M1,3 A1.5,2.5 A2,3.5 M1,1.5 A0.5,2 A0,1 M1,1.5 A1.5,1 A2,2 ) ;" ,
	drawCommands : "svg ( M1,2 A0.5,2.5 A0,1.5 M1,2 A1.5,1.5 A2,2.5 M1,0.5 A0.5,1 A0,0 M1,0.5 A1.5,0 A2,1 ) ;" ,
	width : 2 ,
	//ascending : 3 ,
	ascending : 2.5 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["approx-dot" , "\u2250"] ,
	//drawCommands : "svg ( M1,4 L1,3 M0,2 L2,2 M0,1 L2,1 ) ;" ,
	//drawCommands : "fill = true ; svg ( M1,3 A1.5,3.5 A1,4 A0.5,3.5 Z ) ; fill = false ; svg ( M0,2 L2,2 M0,1 L2,1 ) ;" ,
	drawCommands : "fill = true ; svg ( M1,2 A1.5,2.5 A1,3 A0.5,2.5 Z ) ; fill = false ; svg ( M0,1 L2,1 M0,0 L2,0 ) ;" ,
	width : 2 ,
	//ascending : 4 ,
	ascending : 3 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["prop-to" , "\u221D"] ,
	drawCommands : "svg ( M1.5,1 A3,0 M1.5,1 A0.75,2 A0,1 A0.75,0 A1.5,1 M3,2 A1.5,1 ) ;" ,
	width : 3 ,
	ascending : 2 ,
	descending : 0
});



//
// math logical symbols
//
// negation
Astex.Symbol.addSymbol ({
	names : ["negation" , "\u00AC"] ,
	drawCommands : "svg ( M2,1 L2,2 L0,2 ) ;" ,
	width : 2 ,
	ascending : 2 ,
	descending : 0
});
// implies ( see arrows => )
// iff ( see arrows <=> )
Astex.Symbol.addSymbol ({
	names : ["for-all" , "\u2200"] ,
	drawCommands : "svg ( M0,4 L1,0 L2,4 M0.5,2 L1.5,2 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["there-exists" , "\u2203" ] ,
	drawCommands : "svg ( M0,4 L2,4 L2,0 L0,0 M2,2 L0,2 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["_|_" , "\u22A5"] ,	// perpendicular symbol
	drawCommands : "svg ( M0,0 L2,0 M1,0 L1,3 ) ;" ,
	width : 2 ,
	ascending : 3 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["top" , "\u22A4"] ,	// looks like a T (upside down _|_)
	drawCommands : "svg ( M0,3 L2,3 M1,0 L1,3 ) ;" ,
	width : 2 ,
	ascending : 3 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["|-" , "\u22A2"] ,
	drawCommands : "svg ( M0,0 L0,3 M0,1.5 L2,1.5 ) ;" ,
	width : 2 ,
	ascending : 3 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["|=" , "\u22A8"] ,
	drawCommands : "svg ( M0,0 L0,3 M0,1 L2,1 M0,2 L2,2 ) ;" ,
	width : 2 ,
	ascending : 3 ,
	descending : 0
});

//
// miscellaneous math symbols
//
Astex.Symbol.addSymbol ({
	names : ["hbar" , "\u210F"] ,
	//drawCommands : "svg( M0,4 L0,0 M2,0 L2,1.5 A1,2 A0,1.5 M0,3 L2,3 ) ;" ,
	drawCommands : "svg( M0.5,4 L0.5,0 M2,0 L2,1.5 A1,2 A0.5,1.5 M0,3 L2,3 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["coproduct" , "\u2210"] ,
	//drawCommands : "svg ( M0,0 L2,0 M0.5,4 L0.5,0 M1.5,4 L1.5,0 ) ;" ,
	drawCommands : "svg ( M0,0 L4,0 M1,4 L1,0 M3,4 L3,0 ) ;" ,
	width : 4 ,
	ascending : 4 ,
	descending : 0
});
// Rho ( same as english upper-case P )
Astex.Symbol.addSymbol ({
	names : ["integral" , "\u222B"] ,
	//drawCommands : "svg ( M2,3.5 A1.5,4 A1,3 L1,1 M0,0.5 A0.5,0 A1,1 ) ;" ,
	//drawCommands : "svg ( M2,3.5 A1.5,4 A1,3 L1,0.6 M0,0.5 A0.5,0 A1,1 ) ;" ,	// bottom arc isn't shown fully extended, so we drop a line
	drawCommands : "svg ( M2,3.5 A1.5,4 A1,3 L1,0 M0,0 A0.5,-0.5 A1,0 ) ;" ,
	width : 2 ,
	//ascending : 4 ,
	ascending : 4.5 ,			// added a little padding
	//descending : 0
	descending : 0.5
});
Astex.Symbol.addSymbol ({
	names : ["double-integral" , "\u222C"] ,
	//drawCommands : "svg ( M2,3.5 A1.5,4 A1,3 L1,0 M0,0 A0.5,-0.5 A1,0" + " M4,3.5 A3.5,4 A3,3 L3,0 M2,0 A2.5,-0.5 A3,0 ) ;" ,
	drawCommands : "svg ( M2,3.5 A1.5,4 A1,3 L1,0 M0,0 A0.5,-0.5 A1,0" + " M3.5,3.5 A3,4 A2.5,3 L2.5,0 M1.5,0 A2,-0.5 A2.5,0 ) ;" ,
	width : 4 ,				// width is actually 3.5 !!!
	ascending : 4.5 ,			// added a little padding
	descending : 0.5
});
Astex.Symbol.addSymbol ({
	names : ["triple-integral" , "\u222D"] ,	// check utf-8 hex # (change token, too)
	//drawCommands : "svg ( M2,3.5 A1.5,4 A1,3 L1,0 M0,0 A0.5,-0.5 A1,0" + " M4,3.5 A3.5,4 A3,3 L3,0 M2,0 A2.5,-0.5 A3,0" + " M6,3.5 A5.5,4 A5,3 L5,0 M4,0 A4.5,-0.5 A5,0 ) ;" ,
	drawCommands : "svg ( M2,3.5 A1.5,4 A1,3 L1,0 M0,0 A0.5,-0.5 A1,0" + " M3.5,3.5 A3,4 A2.5,3 L2.5,0 M1.5,0 A2,-0.5 A2.5,0" + " M5,3.5 A4.5,4 A4,3 L4,0 M3,0 A3.5,-0.5 A4,0 ) ;" ,
	width : 6 ,				// width is actually 5 !!!
	ascending : 4.5 ,			// added a little padding
	descending : 0.5
});
Astex.Symbol.addSymbol ({
	names : ["o-integral" , "\u222E"] ,		// check utf-8 hex # (change token, too)
	drawCommands : "svg ( M2,3.5 A1.5,4 A1,3 L1,0.6 M0,0.5 A0.5,0 A1,1 M1.5,2 A1,2.5 A0.5,2 A1,1.5 Z ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["partial" , "\u2202"] ,	// del
	drawCommands : "svg ( M0,1 A1,0 A2,1 A1,2 Z M2,1 A1,4 A0,3.5 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["gradient" , "\u2207" , "\u25BD"] ,	// nabla
	drawCommands : "svg ( M0,4 L2,4 L1,0 Z ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["+-" , "\u00B1"] ,
	drawCommands : "svg ( M0,2 L2,2 M1,3 L1,1 M0,0.5 L2,0.5 ) ;" ,
	width : 2 ,
	ascending : 3 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["-+" , "\u2213"] ,
	drawCommands : "svg ( M0,1.5 L2,1.5 M1,2.5 L1,0.5 M0,3 L2,3 ) ;" ,
	width : 2 ,
	ascending : 3 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["empty-set" , "\u2205"] ,
	drawCommands : "svg ( M1.5,2 A1,4 A0.5,2 A1,0 Z M2,4.5 L0,0 ) ;" ,
	width : 2 ,
	ascending : 4.5 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["oo" , "\u221E"] ,	// infinity
	drawCommands : "svg ( M2,1 A1,2 A0,1 A1,0 Z M4,1 A3,2 A2,1 A3,0 Z ) ;" ,
	width : 3 ,
	ascending : 2 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["aleph" , "\u2135"] ,
	drawCommands : "svg ( M0,0 A0.5,1 A0,3 M0,4 A0.5,2.5 L1,2 M2,0 A1.5,1.5 L1,2 M2,4 A1.5,3 A2,1 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["angle" , "\u2220"] ,
	drawCommands : "svg ( M2,4 L0,0 L2,0 M1.2,0 A0.6,1 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : [":." , "\u2234"] ,	// therefore
	//drawCommands : "svg ( M0,1 L0,1.5 M2,1 L2,1.5 M1,3 L1,2.5 ) ;" ,
	drawCommands : "fill = true ; svg ( M0.5,0 A1,0.5 A0.5,1 A0,0.5 Z M2.5,0 A3,0.5 A2.5,1 A2,0.5 Z M1.5,2 A2,2.5 A1.5,3 A1,2.5 Z ) ;" ,
	width : 2.5 ,
	ascending : 3 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["ldots" , "..." , "\u2026"] ,
	//drawCommands : "svg ( M0,0 L0,1 M1,0 L1,1 M2,0 L2,1 ) ;" ,
	drawCommands : "fill = true ; svg ( M0.5,0 A1,0.5 A0.5,1 A0,0.5 Z M2,0 A2.5,0.5 A2,1 A1.5,0.5 Z M3.5,0 A4,0.5 A3.5,1 A3,0.5 Z ) ;" ,
	width : 3.5 ,
	ascending : 1 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["cdots" , "\u22EF"] ,
	//drawCommands : "svg ( M0,1.5 L0,2.5 M1,1.5 L1,2.5 M2,1.5 L2,2.5 ) ;" ,
	drawCommands : "fill = true ; svg ( M0.5,1.5 A1,2 A0.5,2.5 A0,2 Z M2,1.5 A2.5,2 A2,2.5 A1.5,2 Z M3.5,1.5 A4,2 A3.5,2.5 A3,2 Z ) ;" ,
	width : 3.5 ,
	ascending : 2.5 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["vdots" , "\u22EE"] ,
	//drawCommands : "svg ( M1,4 L1,3.5 M1,3 L1,2.5 M1,2 L1,1.5 ) ;" ,
	drawCommands : "fill = true ; svg ( M0.5,0 A1,0.5 A0.5,1 A0,0.5 Z M0.5,1.5 A1,2 A0.5,2.5 A0,2 Z M0.5,3 A1,3.5 A0.5,4 A0,3.5 Z ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["ddots" , "\u22F1"] ,
	//drawCommands : "svg ( M0,4 L0,3.5 M1,3 L1,2.5 M2,2 L2,1.5 ) ;" ,
	drawCommands : "fill = true ; svg ( M0.5,3 A1,3.5 A0.5,4 A0,3.5 Z M2,1.5 A2.5,2 A2,2.5 A1.5,2 Z M3.5,0 A4,0.5 A3.5,1 A3,0.5 Z ) ;" ,
	width : 3.5 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["ddots-right" , "\u22F2"] ,		// check utf-8 hex # (change token, too)
	//drawCommands : "svg ( M2,4 L2,3.5 M1,3 L1,2.5 M0,2 L0,1.5 ) ;" ,
	drawCommands : "fill = true ; svg ( M0.5,0 A1,0.5 A0.5,1 A0,0.5 Z M2,1.5 A2.5,2 A2,2.5 A1.5,2 Z M3.5,3 A4,3.5 A3.5,4 A3,3.5 Z ) ;" ,
	width : 3.5 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["|_" , "\u230A"] ,	// left-floor
	drawCommands : "svg ( M0,4 L0,0 L1,0 ) ;" ,
	width : 1 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["_|" , "\u230B"] ,	// right-floor
	drawCommands : "svg ( M1,4 L1,0 L0,0 ) ;" ,
	width : 1 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["|~" , "\u2308"] ,	// left-ceiling
	drawCommands : "svg ( M0,0 L0,4 L1,4 ) ;" ,
	width : 1 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["~|" , "\u2309"] ,	// right-ceiling
	drawCommands : "svg ( M1,0 L1,4 L0,4 ) ;" ,
	width : 1 ,
	ascending : 4 ,
	descending : 0
});




// miscellaneous symbols
/*
Astex.Symbol.addSymbol ({
	names : ["overscore"] ,				// bar
	drawCommands : "svg ( M0,4 L2,4 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
*/
Astex.Symbol.addSymbol ({
	names : ["triangle-left" , "\u22B2"] ,
	drawCommands : "svg ( M2,0 L0,4 L0,0 Z ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["triangle-right" , "\u22B3"] ,
	drawCommands : "svg ( M2,0 L2,4 L0,0 Z ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["bullet" , "\u2022"] ,
	drawCommands : "fill = true ; svg ( M1,2 A0.5,2.5 A0,2 A0.5,1.5 Z ) ;" ,
	width : 1 ,
	ascending : 2.5 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["dagger" , "\u2020"] ,
	drawCommands : "svg ( M1,4 L1,0 M0,3 L2,3 ) ;" ,
	width : 1 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["double-dagger" , "\u2021"] ,
	drawCommands : "svg ( M1,4 L1,0 M0,3 L2,3 M0,2.5 L2,2.5 ) ;" ,
	width : 1 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["big-circle" , "\u25CB"] ,
	drawCommands : "svg ( M4,2 A2,4 A0,2 A2,0 Z ) ;" ,
	width : 4 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["U+" , "uplus" , "\u228E"] ,		// u-plus
	drawCommands : "svg ( M0,4 L0,1 A1,0 A2,1 L2,4 M1,3 L1,1 M0.5,2 L1.5,2 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["big-U+" , "\u2A04"] ,	// big u-plus
	drawCommands : "svg ( M0,4 L0,1 A1.5,0 A3,1 L3,4 M1.5,3 L1.5,1 M0.5,2 L2.5,2 ) ;" ,
	width : 3 ,
	ascending : 4 ,
	descending : 0
});





//
// math arrow symbols
//
Astex.Symbol.addSymbol ({
	names : ["up-arrow" , "\u2191"] ,
	drawCommands : "svg ( M1,0 L1,4 M0,3 L1,4 L2,3 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["down-arrow" , "\u2193"] ,
	drawCommands : "svg ( M1,0 L1,4 M0,1 L1,0 L2,1 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["->" , "\u2192" , "\u20D7"] ,
	drawCommands : "svg ( M0,1.5 L3,1.5 M2,3 L3,1.5 L2,0 ) ;" ,
	width : 3 ,
	ascending : 3 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["<-" , "\u2190" , "\u20D6"] ,
	drawCommands : "svg ( M1,0 L0,1.5 L1,3 M0,1.5 L3,1.5 ) ;" ,
	width : 3 ,
	ascending : 3 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : [">->" , "\u21A3"] ,
	drawCommands : "svg ( M0,2 L1,1.5 L0,1 M1,1.5 L4,1.5 M3,3 L4,1.5 L3,0 ) ;" ,
	width : 4 ,
	ascending : 3 ,
	descending : 0
});
/*
Astex.Symbol.addSymbol ({
	names : ["<-<" , "l\u21A3"] ,				// check utf-8 (change token)
	drawCommands : "svg ( M1,0 L0,1.5 L1,3 M0,1.5 L3,1.5 M4,2 L3,1.5 L4,1 ) ;" ,
	width : 4 ,
	ascending : 3 ,
	descending : 0
});
*/
Astex.Symbol.addSymbol ({
	names : ["->>" , "\u21A0"] ,
	drawCommands : "svg ( M0,1.5 L3,1.5 M2,3 L3,1.5 L2,0 M1.5,3 L2.5,1.5 L1.5,0 ) ;" ,
	width : 3 ,
	ascending : 3 ,
	descending : 0
});
/*
Astex.Symbol.addSymbol ({
	names : ["<<-" , "l\u21A0"] ,				// utf-8
	drawCommands : "svg ( M1,0 L0,1.5 L1,3 M1.5,0 L0.5,1.5 L1.5,3 M0,1.5 L3,1.5 ) ;" ,
	width : 3 ,
	ascending : 3 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : [">->>" , "\u2916"] ,
	drawCommands : "svg ( M0,2 L1,1.5 L0,1 M1,1.5 L4,1.5 M3,3 L4,1.5 L3,0 M2.5,3 L3.5,1.5 L2.5,0 ) ;" ,
	width : 4 ,
	ascending : 3 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["<<-<" , "l\u2916"] ,
	drawCommands : "svg ( M1,0 L0,1.5 L1,3 M1.5,0 L0.5,1.5 L1.5,3 M0,1.5 L3,1.5 M4,2 L3,1.5 L4,1 ) ;" ,
	width : 4 ,
	ascending : 3 ,
	descending : 0
});
*/
Astex.Symbol.addSymbol ({
	names : ["<->" , "\u2194"] ,
	drawCommands : "svg ( M1,0 L0,1.5 L1,3 M0,1.5 L4,1.5 M3,3 L4,1.5 L3,0 ) ;" ,
	width : 4 ,
	ascending : 3 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["=>" , "\u21D2"] ,
	drawCommands : "svg ( M0,1 L2,1 M0,2 L2,2 M2,3 L3,1.5 L2,0 ) ;" ,
	width : 3 ,
	ascending : 3 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["<==" , "\u21D0"] ,	// <= (couldn't use <= since that's already less than or equal to)
	drawCommands : "svg ( M1,3 L0,1.5 L1,0 M1,1 L3,1 M1,2 L3,2 ) ;" ,
	width : 3 ,
	ascending : 3 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["<=>" , "\u21D4"] ,
	drawCommands : "svg ( M1,3 L0,1.5 L1,0 M1,1 L3,1 M1,2 L3,2 M3,3 L4,1.5 L3,0 ) ;" ,
	width : 4 ,
	ascending : 3 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["|->" , "\u21A6"] ,
	drawCommands : "svg ( M0,3 L0,0 M0,1.5 L3,1.5 M2,3 L3,1.5 L2,0 ) ;" ,
	width : 3 ,
	ascending : 3 ,
	descending : 0
});
/*
Astex.Symbol.addSymbol ({
	names : ["<-|" , "\u21A7"] ,			// utf-8 ( token )
	drawCommands : "svg ( M1,0 L0,1.5 L1,3 M0,1.5 L3,1.5 M3,0 L3,3 ) ;" ,
	width : 3 ,
	ascending : 3 ,
	descending : 0
});
*/

//
// symbols for sets of numbers, e.g. Complex, Natural, Rationals, etc.
//
// blackboard bold capital english letters
Astex.Symbol.addSymbol ({
	names : ["bbbA" , "\uEF8C"] ,
	drawCommands : "svg ( M0,0 L1,4 L2,0 M0.5,2 L1.5,2 M0.5,0 L1,3.5 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["bbbB" , "\uEF8D"] ,
	drawCommands : "svg ( M0,2 L0.5,2 A2,3 A1,4 L0,4 L0,0 L1,0 A2,1 A0.5,2 L0,2 M0.5,0 L0.5,4 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["complex" , "bbbC" , "\u2102"] ,	// C with a line
	drawCommands : "svg ( M2,3 A1,4 A0,2 A1,0 A2,1 M0.5,3.7 L0.5,0.2 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["bbbD" , "\uEF8E"] ,
	drawCommands : "svg ( M0,4 L0,0 L0.5,0 A2,2 A0.5,4 L0,4 M0.5,0 L0.5,4 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["bbbE" , "\uEF8F"] ,
	drawCommands : "svg ( M2,4 L0,4 L0,0 L2,0 M0,2 L2,2 M0.5,0 L0.5,4 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["bbbF" , "\uEF90"] ,
	drawCommands : "svg ( M2,4 L0,4 L0,0 M0,2 L1.5,2 M0.5,0 L0.5,4 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["bbbG" , "\uEF91"] ,
	drawCommands : "svg ( M2,3 A1,4 A0,2 A1,0 A2,1 M2,0 L2,2 L1,2 M0.5,3.7 L0.5,0.2 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["bbbH" , "\u210D"] ,
	drawCommands : "svg ( M0,4 L0,0 M2,4 L2,0 M0,2 L2,2 M0.5,0 L0.5,4 M1.5,0 L1.5,4 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["bbbI" , "\uEF92"] ,
	drawCommands : "svg ( M0.75,4 L0.75,0 M1.25,4 L1.25,0 M0,4 L2,4 M0,0 L2,0 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["bbbJ" , "\uEF93"] ,
	drawCommands : "svg ( M0,1 A1,0 A2,1 L2,4 M1.5,4 L1.5,0.2 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["bbbK" , "\uEF94"] ,
	drawCommands : "svg ( M0,4 L0,0 M2,4 L0,1.5 L2,0 M0.5,0 L0.5,4 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["bbbL" , "\uEF95"] ,
	drawCommands : "svg ( M0,4 L0,0 L2,0 M0.5,0 L0.5,4 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["bbbM" , "\uEF96"] ,
	drawCommands : "svg ( M0,0 L0,4 L1,1.5 L2,4 L2,0 M0.5,0 L0.5,3 M1.5,0 L1.5,3 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["naturals" , "bbbN" , "\u2115"] ,	// modified N with a line
	drawCommands : "svg ( M0,0 L0,4 L0.5,4 M0.5,0 L0.5,4 L2,0 L2,4 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["bbbO" , "\uEF97"] ,
	drawCommands : "svg ( M0,2 A1,0 A2,2 A1,4 Z M0.5,3.7 L0.5,0.2 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["bbbP" , "\u2119"] ,
	drawCommands : "svg ( M0,2 L1,2 A2,3 A1,4 L0,4 L0,0 M0.5,0 L0.5,4 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["rationals" , "bbbQ" , "\u211A"] ,	// Q with a line
	drawCommands : "svg ( M0,2 A1,0 A2,2 A1,4 Z M1.3,1 L2,0 M0.5,3.7 L0.5,0.4 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["reals" , "bbbR" , "\u211D"] ,	// modified R with a line
	drawCommands : "svg ( M0.5,2 L1,2 A2,3 A1,4 L0,4 L0,0 M0.5,2 L2,0 M0.5,4 L0.5,0 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["bbbS" , "\uEF98"] ,
	drawCommands : "svg ( M2,3 A1,4 A0,3 A1,2 M0,1 A1,0 A2,1 A1,2 M2,2 A0.5,3.5 M0,2 A1,0.5 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["bbbT" , "\uEF99"] ,
	drawCommands : "svg ( M0.75,4 L0.75,0 M1.25,4 M1.25,0 M0,4 L2,4 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["bbbU" , "\uEF9A"] ,
	drawCommands : "svg ( M0,4 L0,1 A1,0 A2,1 L2,4 M0.5,4 L0.5,0.2 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["bbbV" , "\uEF9B"] ,
	drawCommands : "svg ( M0,4 L1,0 L2,4 M0.5,4 L1,0.5 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["bbbW" , "\uEF9C"] ,
	drawCommands : "svg ( M0,4 L0.5,0 L1,1.6 L1.5,0 L2,4 M0,3.5 L0.5,0 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["bbbX" , "\uEF9D"] ,
	drawCommands : "svg ( M0,4 L2,0 M0,0 L2,4 M0,3.5 L1.5,0 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["bbbY" , "\uEF9E"] ,
	drawCommands : "svg ( M0,4 L1,2 L2,4 M1,2 L1,0 M0,3 L0.5,2 L0.5,0 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["integers" , "bbbZ" , "\u2124"] ,		// modified Z with a line
	drawCommands : "svg ( M0,4 L2,4 L0.5,0 M1.5,4 L0,0 L2,0 M0.5,2 L1.5,2 ) ;" ,
	width : 2 ,
	ascending : 4 ,
	descending : 0
});



// calligraphic capital english letters

Astex.Symbol.addSymbol ({
	names : ["calA" , "\uEF35"] ,
	drawCommands : "svg ( M0.75,0.5 A0.5,1 A0,0.5 A0.5,0 A1,0.5 L2.5,4 A4,0 M1.2,2 L3,2 ) ;" ,
	width : 4 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["calB" , "\u212C"] ,
	drawCommands : "svg ( M0,0 A1,3 A0.5,4 A0,3.5 A0.5,3 A0.75,3.5 A0.5,3.5 M0.5,0.5 A2,0 A3,1 A1,2 A3,3 A0.8,4 ) ;" ,
	width : 3 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["calC" , "\uEF36"] ,
	drawCommands : "svg ( M2.5,3 A2.75,3.25 A2.5,3.5 A2,3 A2.5,2.5 A3,3.5 A2,4 A0,2 A1.5,0 A3,1 ) ;" ,
	width : 3 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["calD" , "\uEF37"] ,
	drawCommands : "svg ( M0,0 A1,3 A0.5,4 A0,3.5 A0.5,3 A0.75,3.5 A0.5,3.5 M0,0 A2,0.2 A3,2 A0.8,4 ) ;" ,
	width : 3 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["calE" , "\u2130"] ,
	drawCommands : "svg ( M2.5,3 A2.75,3.25 A2.5,3.5 A2,3 A2.5,2.5 A3,3.5 A2,4 A0.5,2.5 A1.5,2.25 A0,1.5 A1.5,0 A3,1 ) ;" ,
	width : 3 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["calF" , "\u2131"] ,
	drawCommands : "svg ( M3,4 L1,4 A0.5,3.5 A1,3 A1.25,3.5 A1,3.5 M0,1 A1,0 A2,4 M1,2 L2.5,2 L2.5,1.5 ) ;" ,
	width : 3 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["calG" , "\uEF38"] ,
	drawCommands : "svg ( M2.5,3 A2.75,3.25 A2.5,3.5 A2,3 A2.5,2.5 A3,3.5 A2,4 A0,2 A1.5,0 A3,1 M3,0 L3,1.5 L1.5,1.5 ) ;" ,
	width : 3 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["calH" , "\u210B"] ,
	drawCommands : "svg ( M0,0 A1,3 A0.5,4 A0,3.5 A0.5,3 A0.75,3.5 A0.5,3.5 M3,4 A2,2 A3,0 M1,2 L2,2 ) ;" ,
	width : 3 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["calI" , "\u2110"] ,
	drawCommands : "svg ( M4,4 L1,4 A0.5,3.5 A1,3 A1.25,3.5 A1,3.5 M1.5,0 A2.5,4 M0,0 L3,0 A4,0.5 A3.5,1 A3,0.5 A3.25,0.5 A3.5,0.35 A3.25,0.5 ) ;" ,
	width : 4 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["calJ" , "\uEF39"] ,
	drawCommands : "svg ( M3,4 L1,4 A0.5,3.5 A1,3 A1.25,3.5 A1,3.5 M0,1 A1,0 A2,4 ) ;" ,
	width : 3 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["calK" , "\uEF3A"] ,
	drawCommands : "svg ( M0,0 A1,3 A0.5,4 A0,3.5 A0.5,3 A0.75,3.5 A0.5,3.5 M3,0 A1,1.5 A3,4 ) ;" ,
	width : 3 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["calL" , "\u2112"] ,
	drawCommands : "svg ( M0,4 A2.5,3 A3,3.5 A2.75,4 A1.35,0 M1,0.5 A0.5,1 A0,0.5 A0.5,0 A1,0.5 M1,0.25 A2,0 L3,0 M0.5,0 A1.3,1 ) ;" ,
	width : 3 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["calM" , "\u2133"] ,
	drawCommands : "svg ( M0,0 A1,3 A0.5,4 A0,3.5 A0.5,3 A0.75,3.5 A0.5,3.5 M4,0 A3,4 A2.25,1 A1,4 A0.75,3.8 ) ;" ,
	width : 4 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["calN" , "\uEF3B"] ,
	drawCommands : "svg ( M0,0 A1,3 A0.5,4 A0,3.5 A0.5,3 A0.75,3.5 A0.5,3.5 M3,0 A2,4 A1,3 ) ;" ,
	width : 3 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["calO" , "\uEF3C"] ,
	drawCommands : "svg ( M3.5,4 A2,3 A2.5,2.5 A3,3.5 A2,4 A0,2 A1.5,0 A3,1 A3.5,2 A2.5,3.75 ) ;" ,
	width : 3.5 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["calP" , "\uEF3D"] ,
	drawCommands : "svg ( M0,0 A1,3 A0.5,4 A0,3.5 A0.5,3 A0.75,3.5 A0.5,3.5 M1,1.5 A3,3 A0.8,4 ) ;" ,
	width : 3 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["calQ" , "\uEF3E"] ,
	drawCommands : "svg ( M3.5,4 A2,3 A2.5,2.5 A3,3.5 A2,4 A0,2 A1.5,0 A3,1 A3.5,2 A2.5,3.75 M3.5,0 L2,1.5 ) ;" ,
	width : 3.5 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["calR" , "\u211B"] ,
	drawCommands : "svg ( M0,0 A1,3 A0.5,4 A0,3.5 A0.5,3 A0.75,3.5 A0.5,3.5 M1,2 A3,3 A0.8,4 M1,2 A3,0 ) ;" ,
	width : 3 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["calS" , "\uEF3F"] ,
	drawCommands : "svg ( M3,3.5 A2,4 A1,3 A2,2 M1,0.5 A2,0 A3,1 A2,2 M1,0.5 A0.5,1 A0,0.5 A0.5,0 A0.75,0.5 A0.5,0.5 M3,3.5 A3.5,3 A4,3.5 A3.5,4 A3.25,3.5 A3.5,3.25 A3.75,3.75 ) ;" ,
	width : 4 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["calT" , "\uEF40"] ,
	drawCommands : "svg ( M4,4 L1,4 A0.5,3.5 A1,3 A1.25,3.5 A1,3.5 M1.5,0 A2.5,4 ) ;" ,
	width : 4 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["calU" , "\uEF41"] ,
	drawCommands : "svg ( M1,3.5 A0.5,4 A0,3.5 A0.5,3 A0.75,3.5 A0.5,3.75 A0.35,3.5 M1,3.5 A2,0 A3,4 A3.5,0 ) ;" ,
	width : 3.5 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["calV" , "\uEF42"] ,
	drawCommands : "svg ( M1,3.5 A0.5,4 A0,3.5 A0.5,3 A0.75,3.5 A0.5,3.75 A0.35,3.5 M1,3.5 A2,0 M4,4 A2,0 ) ;" ,
	width : 4 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["calW" , "\uEF43"] ,
	drawCommands : "svg ( M1,3.5 A0.5,4 A0,3.5 A0.5,3 A0.75,3.5 A0.5,3.75 A0.35,3.5 M1,3.5 A1.5,0 M2.25,2 A1.5,0 M2.25,2 A3,0 M4,4 A3,0 ) ;" ,
	width : 4 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["calX" , "\uEF44"] ,
	drawCommands : "svg ( M3,0 L1,3.5 A0.5,4 A0,3.5 A0.5,3 A0.75,3.5 A0.5,3.75 A0.35,3.5 M3,4 L0,0 ) ;" ,
	width : 3 ,
	ascending : 4 ,
	descending : 0
});
Astex.Symbol.addSymbol ({
	names : ["calY" , "\uEF45"] ,
	drawCommands : "svg ( M1,3.5 A0.5,4 A0,3.5 A0.5,3 A0.75,3.5 A0.5,3.75 A0.35,3.5 M1,3.5 A2,0 A3,4 M1,-1 A1.75,-2 A2.5,-1 A3,4 ) ;" ,
	width : 3 ,
	ascending : 4 ,
	descending : 2
});
Astex.Symbol.addSymbol ({
	names : ["calZ" , "\uEF46"] ,
	drawCommands : "svg ( M2.5,0 L0,0 L3,4 L0.5,4 A0,3.5 A0.5,3 A0.75,3.5 A0.5,3.75 A0.35,3.5 M2.5,0 A3,0.5 A2.5,1 A2,0.5 A2.5,0.25 A2.75,0.5 M0.5,2 L2.5,2 ) ;" ,
	width : 3.5 ,
	ascending : 4 ,
	descending : 0
});


/*--------------------------------------------------------------------------*/
