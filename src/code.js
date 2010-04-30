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
// Astex.Code class
//

Astex.Code = { } ;

//
// Astex.Code class methods 
//

// prototype: void Astex.Code.processCode ( HTMLElement node )
Astex.Code.processCode = function ( node ) {

	if ( ! node ) { node = document.body ; }

	// get divs
	var codes = Astex.Util.getElementsByClass ( node , "div" , "AstexCode" ) ;
	for ( var i = 0 ; i < codes.length ; i++ ) {

		// get data div contents
		var script = Astex.Plugin.getDataDivContentById ( codes[i].getAttribute("id") ) ;

		// ie need us to add tabs and newlines explicity in code
		// we make this part of the markup language for all browsers
		// use \cn for \n
		// use \ct for \t
		// use \csp for a space 
		// since many programming languages allow \n, \t, etc. inside of strings
		script = script.replace ( /\\cn/g , "\n" ) ;				// newline
		script = script.replace ( /\\ct/g , "&nbsp;&nbsp;&nbsp;&nbsp;" ) ;	// tab
		script = script.replace ( /\\csp/g , "&nbsp;" ) ;			// space

		script = script.replace ( /&#09;/g , "" ) ;			// override unescapeScript
		script = script.replace ( /&#10;/g , "" ) ;			// override unescapeScript
		script = Astex.Plugin.unescapeScript ( script ) ;

		script = script.replace ( /\s*$/ , "" ) ;		// remove whitespace at end

		var brushInd = script.indexOf ( "BRUSH:" ) ;	
		var codeInd = script.indexOf ( "CODE:" ) ;	

		// get brush
		var brush = script.slice ( brushInd + 6 , codeInd ) ;
		brush = brush.replace ( /^\s*/ , "" ) ;
		brush = brush.replace ( /\s*$/ , "" ) ;

		// get code
		var code = script.slice ( codeInd + 5 ) ;
		code = code.replace ( />/g , "&gt;" ) ;
		code = code.replace ( /</g , "&lt;" ) ;

		var str = "" ;
		str += "<pre class=\"brush:" + brush + ";\">" ;
		str += code ;
		str += "</pre>" ;

		codes[i].style.diplay = "block" ;
		codes[i].innerHTML = str ;
	}


	//SyntaxHighlighter.all ( ) ;		// this creats an onload event handler
	SyntaxHighlighter.highlight ( ) ;	// this is what we need to use

	// make <a class="item viewSource"> and <a class="item printSource"> have inner text
	var links = Astex.Util.getElementsByClass ( node , "a" , "item viewSource" ) ;
	for ( var i = 0 ; i < links.length ; i++ ) {
		links[i].innerHTML = "view" ;
	}
	var links = Astex.Util.getElementsByClass ( node , "a" , "item printSource" ) ;
	for ( var i = 0 ; i < links.length ; i++ ) {
		links[i].innerHTML = "print" ;
	}
};

// prototype: void Astex.Code.processCCode ( HTMLElement node )
// used to show code for \begin{code} ... \end{code}
Astex.Code.processCCode = function ( node ) {

	if ( ! node ) { node = document.body ; }

	// get divs
	var codes = Astex.Util.getElementsByClass ( node , "div" , "AstexCCode" ) ;
	for ( var i = 0 ; i < codes.length ; i++ ) {

		// get data div contents
		var script = Astex.Plugin.getDataDivContentById ( codes[i].getAttribute("id") ) ;
		script = Astex.Plugin.unescapeScript ( script ) ;
		script = script.replace ( /\s*$/ , "" ) ;		// remove whitespace at end

		var brushInd = script.indexOf ( "BRUSH:" ) ;	
		var codeInd = script.indexOf ( "CODE:" ) ;	

		// get brush
		var brush = script.slice ( brushInd + 6 , codeInd ) ;
		brush = brush.replace ( /^\s*/ , "" ) ;
		brush = brush.replace ( /\s*$/ , "" ) ;

		// get code
		var code = script.slice ( codeInd + 5 ) ;
		code = code.replace ( />/g , "&gt;" ) ;
		code = code.replace ( /</g , "&lt;" ) ;

		code = code.replace ( /\t+/g , "\t\t" ) ;

		var str = "" ;
		str += "<pre class=\"brush:astex-doc\">" ;
		str += "\\begin{code}" ;
		str += "\n" ;
		str += "\t BRUSH:" + brush + "\n" ;
		str += "\t CODE:" ;
		str += code ;
		str += "\n" ;
		str += "\\end{code}" ;
		str += "\n" ;
		str += "</pre>" ;

		codes[i].style.diplay = "block" ;
		codes[i].innerHTML = str ;
	}

	//SyntaxHighlighter.all ( ) ;		// this creats an onload event handler
	SyntaxHighlighter.highlight ( ) ;	// this is what we need to use

	// make <a class="item viewSource"> and <a class="item printSource"> have inner text
	var links = Astex.Util.getElementsByClass ( node , "a" , "item viewSource" ) ;
	for ( var i = 0 ; i < links.length ; i++ ) {
		links[i].innerHTML = "view" ;
	}
	var links = Astex.Util.getElementsByClass ( node , "a" , "item printSource" ) ;
	for ( var i = 0 ; i < links.length ; i++ ) {
		links[i].innerHTML = "print" ;
	}
};

/*--------------------------------------------------------------------------*/

