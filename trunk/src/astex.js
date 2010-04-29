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
// create a namespace for ASCII-TEX (Astex)
//

Astex = { } ;	

//
// Astex class variables
//

Astex.version = "0.1 beta";
Astex.initOnLoad = true ;
Astex.initialized = false ;

/*--------------------------------------------------------------------------*/


// prototype: void Astex.processQueryString ( bool renderer )
// when arg renderer is true, whenever this is called the requested renderer will be forced
// on each page, even if the user toggles renderer settings
// Note that in Astex.process() we do NOT include any argument when we call this function 
// but we do include it in Astex.init().
// This will ensure the user can toggle renderer settings in a doc
Astex.processQueryString = function ( renderer ) {

	var q = Astex.Util.parseQueryString ( ) ;

	if ( typeof q.mathColor != "undefined" ) { Astex.User.setColor ( q.mathColor ) ; }
	if ( typeof q.AstexMathColor != "undefined" ) { Astex.User.setColor ( q.AstexMathColor ) ; }

	// force initial specific renderer
	if ( typeof renderer == "boolean" && renderer == true ) {
		if ( typeof q.mathMLRenderer != "undefined" ) { Astex.AMath.setRenderer ( q.mathMLRenderer ) ; }
		if ( typeof q.AstexMathMLRenderer != "undefined" ) { Astex.AMath.setRenderer ( q.AstexMathMLRenderer ) ; }
	}

};

// prototype: void Astex.init ( )
Astex.init = function ( ) {

	if ( Astex.initialized ) { return ; }

	//Astex.Util.displayIEOlderVersionMessage ( ) ;

	// do I need to edit Settings Control Panel for IE8 and MathPlayer???
	//Astex.Util.forceIE8Compatibility ( ) ;		// should I only do this inside of Astex.Doc (or is this needed on pages w/o a doc?)

	// test for TEX/STIX Fonts (for Firefox) and MathPlayer (for IE)
	Astex.AMath.testMathML ( ) ;

	// set default MathML Renderer to Astex's built-in Canvas Renderer
	Astex.AMath.setRenderer ( "Canvas" ) ;

	// add standard plugins before user set-up
	Astex.DataDiv.addStandardDataDivs ( ) ;
	Astex.Plugin.addStandardPlugins ( ) ;
	//Astex.Plugin.processDataDivs ( ) ;


	// !!!!!!! IMPORTANT !!!!!!!!
	// These should be the first function calls!
	// sort the symbol and token names array alphabetically (really ascii-betically???)
	// some of the Astex.Symbol , Astex.Token , and Astex.Canvas methods assume these arrays are already sorted
	// To save on JavaScript overhead, we do NOT check inside these methods if the arrays are already sorted,
	// we just assume they are.
	Astex.Symbol.SymbolNames.sort ( ) ;
	//Astex.Symbol.SymbolNames.sort ( Astex.Util.compareNames ) ;
	Astex.Token.TokenNames.sort ( ) ;

	// if the user has defined Astex.User.setup as a function, execute it
	if ( Astex.User.setup != null && typeof Astex.User.setup == "function" ) {

		Astex.User.setup ( ) ;

		// re-sort the symbol and token names in case user has added some
		Astex.Symbol.SymbolNames.sort ( ) ;
		Astex.Token.TokenNames.sort ( ) ;
	}

	Astex.processQueryString ( true ) ;

	// process plugins
	Astex.Plugin.processPlugins ( ) ;

	// update Astex.initialized class variable
	Astex.initialized = true ;

};

// prototype: Astex.process ( ) ;
// good for processing quizzes
Astex.process = function ( node ) {

	if ( ! node ) { node = document.body ; }

	Astex.initialized = false ;

	//Astex.AMath.translated = false ;
	//Astex.AMath.addNumericTokensForSubSup ( node ) ;

	/*
	*/
	Astex.Symbol.SymbolNames.sort ( ) ;
	Astex.Token.TokenNames.sort ( ) ;

	// if the user has defined Astex.User.setup as a function, execute it
	if ( Astex.User.setup != null && typeof Astex.User.setup == "function" ) {

		Astex.User.setup ( ) ;	// this will reset user's color for math text

		// re-sort the symbol and token names in case user has added some
		//Astex.Symbol.SymbolNames.sort ( ) ;
		//Astex.Token.TokenNames.sort ( ) ;
	}

	Astex.processQueryString ( ) ;

	//Astex.AMath.addNumericTokens ( node ) ;

	// process plugins
	Astex.Plugin.processPlugins ( node ) ;

	// update Astex.initialized class variable
	//Astex.initialized = true ;
};

/*--------------------------------------------------------------------------*/

// function for the setup of onload handler
// an Astex class method

// prototype: Astex.loader ( Function f )
// calls function f when document is loaded
// when passing name of function, do NOT include ( )
// e.g. use Astex.loader ( function-name ) NOT Astex.loader ( function-name() )
// adapted from AsciiMathML, which took it from 
// GO1.1 Generic onload by Brothercake @ http://www.brothercake.com/
Astex.loader = function ( f ) {

	// gecko, safari, konqueror and standard
	if ( typeof window.addEventListener != 'undefined' ) {
		window.addEventListener ( 'load' , f , false ) ;
	}
	// opera 7
	else if ( typeof document.addEventListener != 'undefined' ) {
		document.addEventListener ( 'load' , f , false);
	}
	// internet explorer (ie)
	else if ( typeof window.attachEvent != 'undefined' ) {
		window.attachEvent ( 'onload' , f ) ;
	}
	// remove this condition to degrade older browsers
	// mac/ie5 and anything else that gets this far
	else {
		if ( typeof window.onload == 'function' ) {
	
			// store any existing onload function(s) 
			var existing = onload ;
			//add new onload handler
			window.onload = function ( ) {
				// call existing onload function(s)
				existing ( ) ;
				// call our onload function
				f ( ) ;
			};
		}
		else {
			// setup onload function
			window.onload = f ;
		}
	}
};


/*--------------------------------------------------------------------------*/


// setup onload function for document to call Astex.init when the document loads
if ( Astex.initOnLoad ) {

	Astex.loader ( Astex.init ) ;
}

/*--------------------------------------------------------------------------*/

