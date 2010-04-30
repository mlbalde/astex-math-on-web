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
// Astex.DataDiv class
//

// prototype: new Astex.DataDiv ( String name , int type ) ;
Astex.DataDiv = function ( name , type ) {

	this.name = name ;
	this.type = type ;

	Astex.DataDiv.DataDivs.push ( this ) ;

	return this ;
};

//
// Astex.DataDiv class constants 
//

Astex.DataDiv.UNARY = 1 ;

//
// Astex.DataDiv class variables
//

Astex.DataDiv.DataDivs = new Array ( ) ;
Astex.DataDiv.DataDivContents = new Array ( ) ;		// in general, length of this array is larger than DataDivs[] array

//
// Astex.DataDiv class methods 
//

// prototype: Astex.DataDiv.addStandardDataDivs( );
Astex.DataDiv.addStandardDataDivs = function ( ) {

	// the order seems to be important

	// \begin{settings} ... \end{settings}
	new Astex.DataDiv ( "settings" ) ;

	// \begin{ccode} ... \end{ccode}
	new Astex.DataDiv ( "cCode" ) ;					// should come before "code"

	// \begin{code} ... \end{code}
	new Astex.DataDiv ( "code" ) ;					// should come before "doc"

	// \exLink{ ... }
	new Astex.DataDiv ( "exLink" , Astex.DataDiv.UNARY ) ;

	// \begin{code} ... \end{table}
	new Astex.DataDiv ( "table" ) ;

	// \begin{graph} ... \end{graph}
	new Astex.DataDiv ( "graph" ) ;

	// \begin{lmath} ... \end{lmath}
	new Astex.DataDiv ( "lMath" ) ;

	// \begin{amath} ... \end{amath}
	new Astex.DataDiv ( "aMath" ) ;

	// \begin{questiondb} ... \end{questiondb}
	new Astex.DataDiv ( "questionDB" ) ;

	// \begin{quiz} ... \end{quiz}
	new Astex.DataDiv ( "quiz" ) ;

	// \begin{siteheader} ... \end{siteheader}
	new Astex.DataDiv ( "siteHeader" ) ;

	// \sandbox{ ... }
	new Astex.DataDiv ( "sandbox" , Astex.DataDiv.UNARY ) ;

	// \tokens{ ... }
	new Astex.DataDiv ( "tokens" , Astex.DataDiv.UNARY ) ;

	// \poweredBy{ ... }
	new Astex.DataDiv ( "logo" , Astex.DataDiv.UNARY ) ;

	// \begin{doc} ... \end{doc}
	new Astex.DataDiv ( "doc" ) ;

};

/*--------------------------------------------------------------------------*/

//
// Astex.Plugin class
//

// prototype: new Astex.Plugin ( Function func ) ;
Astex.Plugin = function ( func ) {

	if ( ! func || typeof func != "function" ) {
		return new Astex.Warning ( "second argument must be a function" , "Astex.Plugin" ) ;
	}

	this.func = func ;

	// add to plugins array
	Astex.Plugin.Plugins.push ( this ) ;

	return this ;
};

//
// Astex.Plugin class variables
//

Astex.Plugin.Plugins = new Array ( ) ;

//
// Astex.Plugin class methods
//

// prototype: Astex.Plugin.getDataDivContentById ( String id );
Astex.Plugin.getDataDivContentById = function ( id ) {

	// Data Divs will have id attribute AstexDataDiv###
	// e.g. id="AstexDataDiv25"
	return Astex.DataDiv.DataDivContents [ parseInt ( id.replace(/AstexDataDiv/,"") ) ] ;

};

// prototype: Astex.Plugin.processPlugins( HTMLElement node );
Astex.Plugin.processPlugins = function ( node ) {

	var plugins = Astex.Plugin.Plugins ;
	for ( var i = 0 ; i < plugins.length ; i++ ) {

		// invoke plugin function
		plugins[i].func ( node ) ;
	}
};

//
// the following are useful for processing plugins 
//

// prototype: String Astex.Plugin.escapeScript ( String str )
Astex.Plugin.escapeScript = function ( str ) {

	str = str.replace ( /<\/?(br|p|pre)\s?\/?>/gi , "\n" ) ;
	str = str.replace ( /(\n|\r|\f|\v)/g , "&#10;" ) ;
	str = str.replace ( /\t/g , "&#09;" ) ;
	str = str.replace ( / /g , "&#32;" ) ;
	str = str.replace ( /'/g , "&#39;" ) ;
	str = str.replace ( /"/g , "&#34;" ) ;
	return str ;
};


// prototype: String Astex.Plugin.unescapeScript ( String str )
Astex.Plugin.unescapeScript = function ( str ) {

	str = str.replace ( /&#32;/g , " " ) ;
	str = str.replace ( /&#09;/g , "\t" ) ;
	str = str.replace ( /&#10;/g , "\n" ) ;
	//str = str.replace ( /&#09;/g , "\\t" ) ;
	//str = str.replace ( /&#10;/g , "\\n" ) ;
	str = str.replace ( /&#39;/g , "'" ) ;
	str = str.replace ( /&#34;/g , "\"" ) ;
	str = str.replace ( /&gt;/g , ">" ) ;			// need these for Sandbox 
	str = str.replace ( /&lt;/g , "<" ) ;
	str = str.replace ( /&amp;/g , "&" ) ;
	return str ;
};

// prototype: String Astex.Plugin.removeComments ( String str )
Astex.Plugin.removeComments = function ( str ) {

	//str = str.replace ( /#.*(\n|\r|\f|\v)*/g , "" ) ;
	//str = str.replace ( /\/\/.*(\n|\r|\f|\v)*/g , "" ) ;
	//str = str.replace ( /\/\*(.|\n|\r|\f|\v)*\*\//g , "" ) ;

	var ind = str.indexOf ( "/*" ) ;
	while ( ind != -1 ) {

		// find next occurence of * /
		var endInd = str.indexOf ( "*/" , ind+2 ) ;
		if ( endInd != -1 ) {
			str = str.slice(0,ind) + str.slice(endInd+2) ;
		}
		else {
			str = str.slice(0,ind) ;
		}
		ind = str.indexOf ( "/*" , ind ) ;
	}

	return str ;
};

// prototype: Astex.Plugin.addStandardPlugins( );
Astex.Plugin.addStandardPlugins = function ( ) {

	// the order seems to be important

	new Astex.Plugin ( Astex.Plugin.createDataDivs ) ;

	new Astex.Plugin ( Astex.Settings.processSettings ) ;

	new Astex.Plugin ( Astex.Token.processTokens ) ;		// do this before processing math markup

	new Astex.Plugin ( Astex.Table.processTables ) ;		// do this before processing math markup

	new Astex.Plugin ( Astex.Logo.processLogos ) ;		// do this before processing math markup

	// process math markup between ` ... ` and $ ... $ and simple latex formatting
	new Astex.Plugin ( Astex.AMath.processAsciiLatexMarkup ) ;

	// \begin{graph} ... \end{graph}
	new Astex.Plugin ( Astex.Graph.processGraphs ) ;

	// \begin{lmath} ... \end{lmath}
	//new Astex.Plugin ( Astex.AMath.processLMathPluginMarkup ) ;

	// \begin{amath} ... \end{amath}
	//new Astex.Plugin ( Astex.AMath.processAMathPluginMarkup ) ;

	// \begin{questiondb} ... \end{questiondb}
	new Astex.Plugin ( Astex.Question.processDataBases ) ;		// before quiz

	// \begin{quiz} ... \end{quiz}
	new Astex.Plugin ( Astex.Quiz.processQuizzes ) ;

	// \begin{siteheader} ... \end{siteheader}
	new Astex.Plugin ( Astex.SiteHeader.processSiteHeaders ) ;

	// \begin{doc} ... \end{doc}
	new Astex.Plugin ( Astex.Doc.processDocs ) ;

	// \begin{code} ... \end{code}
	new Astex.Plugin ( Astex.Code.processCode ) ;
	// \begin{ccode} ... \end{ccode}
	new Astex.Plugin ( Astex.Code.processCCode ) ;

	// \sandbox{ ... }
	new Astex.Plugin ( Astex.Sandbox.processSandboxes ) ;

	// \exLink{ ... }
	new Astex.Plugin ( Astex.ExLink.processExLinks ) ;

};

/*--------------------------------------------------------------------------*/

// prototype: void Astex.Plugin.doNothing ( HTMLElement node )
Astex.Plugin.doNothing = function ( node ) {
	/* empty body */
};

// prototype: void Astex.Plugin.createDataDivs ( HTMLElement node )
// processes \begin{name} ... \end{name} in node where name is name of a plugin
// and creates appropriate html <div> element
// e.g. \begin{graph} ... \end{graph}
// e.g. \sandbox{} - UNARY DATA DIV
Astex.Plugin.createDataDivs = function ( node ) {

	if ( ! node ) { node = document.body ; }

	var str = "" ;
	try {
		str = node.innerHTML ;
	}
	catch ( error ) {
		/* empty body */
	}

	// hide data in data divs
	for ( var i = 0 ; i < Astex.DataDiv.DataDivs.length ; i++ ) {

		var data = Astex.DataDiv.DataDivs[i].name ;
		var type = Astex.DataDiv.DataDivs[i].type ;

		var re ;
		if ( type != null && type == Astex.DataDiv.UNARY ) {
			re = new RegExp ( "\\\\?" + data + "{((.|\\n|\\r|\\f|\\v)*?)}" , "gi" ) ;
		}
		else {
			re = new RegExp ( "\\\\?begin{" + data + "}((.|\\n|\\r|\\f|\\v)*?)\\\\?end{" + data + "}" , "gi" ) ;
		}

		str = str.replace ( re , function ( s , t ) {

			// store data into DataDivContents array
			// by storing contents into an array, we remove it from the document flow, and 
			// hence we remove it from any parsing done in the html document
			Astex.DataDiv.DataDivContents.push ( Astex.Plugin.escapeScript ( t ) ) ;			// push onto appropriate array

			// every div should have unique id so we can use it to get data div contents from array
			// see Astex.Plugin.getDataDivContentById()
			return "<div id=\"AstexDataDiv" + (Astex.DataDiv.DataDivContents.length-1) + "\" class=\"Astex" + data.charAt(0).toUpperCase()+data.slice(1) + "\" style=\"position:relative;display:inline;border:0;vertical-align:middle;z-index:auto;\"></div>" ;
		} );
	}

	node.innerHTML = str ;
};

/*--------------------------------------------------------------------------*/

// make sure there is an Astex.Code class w/ appropriate class methods
// We will be offering 2 apps, one with syntax highlighting, one without
// This will make sure plugins work flawlessly in the app w/o syntax highlighting
// These declarations will be overridden in the code.js file in the app w/ syntax highlighting
// NOTE: this assumes this file is included before the code.js file !!!
Astex.Code = { } ;
Astex.Code.processCode = Astex.Plugin.doNothing ;
Astex.Code.processCCode = Astex.Plugin.doNothing ;

/*--------------------------------------------------------------------------*/

