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


// Astex.AMath class
Astex.AMath = { } ;


//
// Astex.AMath class constants
//

//
// I can probably get rid of some of these variables !!!!!!!!!!
//

Astex.AMath.AMnestingDepth   = null ;
Astex.AMath.AMpreviousSymbol = null ;
Astex.AMath.AMcurrentSymbol  = null ;
Astex.AMath.LMpreviousSymbol = null ;
Astex.AMath.LMcurrentSymbol  = null ;

Astex.AMath.mathcolor                        = "black" ;	// change it to "" (to inherit) or another color
Astex.AMath.mathfontsize                     = "1em" ;	// change to e.g. 1.2em for larger math
Astex.AMath.mathfontfamily                   = "serif" ;	// change to "" to inherit (works in IE) 
								// or another family (e.g. "arial")
Astex.AMath.automathrecognize                = false ;	// writing "amath" on page makes this true
Astex.AMath.checkForMathML                   = true ;	// check if browser can display MathML
Astex.AMath.notifyIfNoMathML                 = true ;	// display note at top if no MathML capability
Astex.AMath.alertIfNoMathML                  = false ;	// show alert box if no MathML capability
Astex.AMath.translateOnLoad                  = false ;	// set to true to have document translated when it loads in browser
Astex.AMath.translateLaTeX                   = true ;	// false to preserve $..$, $$..$$
Astex.AMath.translateLaTeXformatting         = true ;	// false to preserve \emph,\begin{},\end{}
Astex.AMath.translateASCIIMath               = true ;	// false to preserve `..`
Astex.AMath.translateASCIIsvg                = true ;	// false to preserve agraph.., \begin{graph}..
Astex.AMath.avoidinnerHTML                   = false ;	// set true if assigning to innerHTML gives error
Astex.AMath.displaystyle                     = true ;	// puts limits above and below large operators
Astex.AMath.showasciiformulaonhover          = true ;	// helps students learn ASCIIMath
Astex.AMath.decimalsign                      = "." ;	// change to "," if you like, beware of `(1,2)`!
Astex.AMath.AMdelimiter1                     = "`" ;	// can use other characters
Astex.AMath.AMescape1                        = "\\\\`";	// can use other characters
Astex.AMath.AMdocumentId                     = "wikitext" ;	// PmWiki element containing math (default=body)
Astex.AMath.checkforprocessasciimathinmoodle = false ;	// true for systems like Moodle
Astex.AMath.dsvglocation                     = "" ;		// path to d.svg (blank if same as ASCIIMathML.js loc)

Astex.AMath.noMathML   = false ;
Astex.AMath.translated = false ;

// theorem and definition counters
Astex.AMath.theoremCounter    = 0 ;
Astex.AMath.definitionCounter = 0 ;
Astex.AMath.chapterCounter    = 0 ;
Astex.AMath.sectionCounter    = 0 ;
Astex.AMath.subSectionCounter = 0 ;

// variables for MathPlayer in IE and MathML in Firefox
Astex.AMath.MathPlayerAdded = false ;
Astex.AMath.MathPlayerEnabled = false ;
Astex.AMath.useMathPlayer = false ;
Astex.AMath.MathMLEnabled = false ;
Astex.AMath.MathMLFontsEnabled = false ;
Astex.AMath.NativeMathMLEnabled = false ;
Astex.AMath.useNativeMathML = false ;
Astex.AMath.MathMLTested = false ;

//
// a renderer class
//
Astex.AMath.MathMLRenderer = {} ;
Astex.AMath.MathMLRenderer.Canvas = 0 ;
Astex.AMath.MathMLRenderer.MathPlayer = 1 ;
Astex.AMath.MathMLRenderer.Native = 2 ;
Astex.AMath.MathMLRenderer.currentRenderer = Astex.AMath.MathMLRenderer.Canvas ;
// prototype: int Astex.AMath.MathMLRenderer.getCurrentRenderer ( ) ;
Astex.AMath.MathMLRenderer.getCurrentRenderer = function ( ) {
	return Astex.AMath.MathMLRenderer.currentRenderer ;
};
// prototype: void Astex.AMath.MathMLRenderer.setRenderer ( int r ) ;
Astex.AMath.MathMLRenderer.setRenderer = function ( r ) {
	if ( r == Astex.AMath.MathMLRenderer.MathPlayer && Astex.AMath.MathPlayerEnabled ) {
		Astex.AMath.MathMLRenderer.currentRenderer = r ;
		Astex.AMath.useNativeMathML = false ;
		Astex.AMath.useMathPlayer = true ;
	}
	else if ( r == Astex.AMath.MathMLRenderer.Native && Astex.AMath.NativeMathMLEnabled ) {
		Astex.AMath.MathMLRenderer.currentRenderer = r ;
		Astex.AMath.useNativeMathML = true ;
		Astex.AMath.useMathPlayer = false ;
	}
	else {
		Astex.AMath.MathMLRenderer.currentRenderer = Astex.AMath.MathMLRenderer.Canvas ;
		Astex.AMath.useNativeMathML = false ;
		Astex.AMath.useMathPlayer = false ;
	}
};

//
// IE initialization
//

// avoid adding MathPlayer info explicitly to each webpage
if ( Astex.Util.isIE ) {
	try {
		var ActiveX = new ActiveXObject ( "MathPlayer.Factory.1" ) ;
		document.write ( "<object id=\"mathplayer\"\ classid=\"clsid:32F66A20-7614-11D4-BD11-00104BD3F987\"></object>" ) ;
		document.write ( "<?import namespace=\"m\" implementation=\"#mathplayer\"?>" ) ;
	}
	catch ( e ) {
		/* empty body */
	}
}

//
// Astex.AMath class methods
//

// prototype void Astex.AMath.setRenderer ( String r )
Astex.AMath.setRenderer = function ( r ) {

	if ( r.match(/native/i) ) {
		Astex.AMath.MathMLRenderer.setRenderer ( Astex.AMath.MathMLRenderer.Native ) ;
	}
	else if ( r.match(/mathplayer/i) ) {
		Astex.AMath.MathMLRenderer.setRenderer ( Astex.AMath.MathMLRenderer.MathPlayer ) ;
	}
	else {	
		Astex.AMath.MathMLRenderer.setRenderer ( Astex.AMath.MathMLRenderer.Canvas ) ;
	}
};

// prototype String Astex.AMath.getCurrentRenderer ( ) 
Astex.AMath.getCurrentRenderer = function ( ) {
	var r = Astex.AMath.MathMLRenderer.getCurrentRenderer ( ) ;
	if ( r == Astex.AMath.MathMLRenderer.MathPlayer ) {
		return "MathPlayer" ;
	}
	else if ( r == Astex.AMath.MathMLRenderer.Native ) {
		return "Native" ;
	}
	else {
		return "Canvas" ;
	}
};

// prototype void Astex.AMath.testMathML ( )
Astex.AMath.testMathML = function ( ) {

	if ( Astex.AMath.MathMLTested ) { return ; }

	if ( Astex.Util.isIE ) {

		//document.write ( "<object id=\"mathplayer\"\ classid=\"clsid:32F66A20-7614-11D4-BD11-00104BD3F987\"></object>" ) ;
		//document.write ( "<?import namespace=\"m\" implementation=\"#mathplayer\"?>" ) ;

		if ( navigator.appName.slice(0,9) == "Microsoft" ) {
			try {
				var ActiveX = new ActiveXObject ( "MathPlayer.Factory.1" ) ;
			}
			catch ( e ) {
				/* empty body */
			}
		}

		Astex.AMath.MathMLEnabled = true ;
		//Astex.AMath.useMathPlayer = true ;
		Astex.AMath.MathPlayerEnabled = true ;
		Astex.AMath.MathPlayerAdded = true ;
		Astex.AMath.setRenderer ( "MathPlayer" ) ;	// do this after setting Astex.AMath.MathPlayerEnabled
	}
	// only want firefox ... apple safari and google chrome matched without the last match below
	else if ( navigator.appName.slice(0,8)=="Netscape" && navigator.appVersion.slice(0,1)>="5" && navigator.userAgent.match(/firefox/i) ) {

		Astex.AMath.MathMLEnabled = true ;

		Astex.AMath.testForMathMLFonts ( ) ;

		//Astex.AMath.useNativeMathML = ( Astex.AMath.MathMLEnabled && Astex.AMath.MathMLFontsEnabled ) ;
		//Astex.AMath.NativeMathMLEnabled = Astex.AMath.useNativeMathML ;
		Astex.AMath.NativeMathMLEnabled = ( Astex.AMath.MathMLEnabled && Astex.AMath.MathMLFontsEnabled ) ;
		//Astex.AMath.useNativeMathML = true ;
		Astex.AMath.setRenderer ( "Native" ) ;	// do this after setting Astex.AMath.NativeMathMLEnabled
	}

	Astex.AMath.MathMLTested = true ;
	//alert ( navigator.userAgent ) ;
};

// prototype void Astex.AMath.testForMathMLFonts ( )
// idea borrowed from MathJAX
Astex.AMath.testForMathMLFonts = function ( ) {

	if ( Astex.AMath.MathMLEnabled && Astex.Util.isIE ) { return ; }

	var fonts = [ "TeX" , "STIX" ] ;
	var comparisons = [ "sans-serif" , "monospace" , "script" , "Times" , "Courier" , "Arial" , "Helvetica" ] ;
	//var testStrings = [ "mmmmmml" , "\u222B_0^1f(x)dx" , "{} () []" ] ;
	var testStrings = [ "{} () []" ] ;		// test string used in MathJAX
	var dim , dim2 ;
	var results = new Array ( ) ;			// true if font is not matched

	for ( var f = 0 ; f < fonts.length ; f++ ) {
		for ( var j = 0 ; j < testStrings.length ; j++ ) {

			dim = Astex.Util.getFontWidthHeight ( fonts[f] , testStrings[j] ) ;

			for ( var i = 0 ; i < comparisons.length ; i++ ) {

				dim2 = Astex.Util.getFontWidthHeight ( comparisons[i] , testStrings[j] ) ;

				if ( dim.width != dim2.width && dim.height != dim2.height ) {
					results.push ( true ) ;
				}
			}
		}
	}

	// results array should be even length
	var stixResults = new Array ( ) ;
	var texResults = new Array ( ) ;
	for ( var r = 0 ; r < results.length ; r++ ) {
		if ( r < results.length/2 ) {
			texResults.push ( results[r] ) ;
		}
		else {
			stixResults.push ( results[r] ) ;
		}
	}
	//alert ( texResults.length + "      " + stixResults.length ) ;
	if ( texResults.length == fonts.length * testStrings.length ) {
		Astex.AMath.MathMLFontsEnabled = true ;
	}
	if ( stixResults.length == fonts.length * testStrings.length ) {
		Astex.AMath.MathMLFontsEnabled = true ;
	}

};

// prototype void Astex.AMath.init ( )
Astex.AMath.init = function ( ) {

	// sort the token names array
	Astex.Token.TokenNames.sort ( ) ;

	// translate ascii and latex input
	Astex.AMath.translate ( ) ;

};

// prototype void Astex.AMath.translate ( ??? spanclassAM , HTMLElement node )
// borrowed from AsciiMathML translate() function
// if node is not null, this node is processed instead of any other node!
Astex.AMath.translate = function ( spanclassAM , node ) {

	// reset theorem and definition counters each time translate is called
	// this will ensure proper numbering inside \begin{doc} ... \end{doc}
	Astex.AMath.theoremCounter    = 0 ;
	Astex.AMath.definitionCounter = 0 ;
	Astex.AMath.chapterCounter    = 0 ;
	Astex.AMath.sectionCounter    = 0 ;
	Astex.AMath.subSectionCounter = 0 ;

	if ( ! Astex.AMath.translated ) {						// run this only once
		//Astex.AMath.translated = true ;					// moved to end of if statement
		var body = document.getElementsByTagName( "body" )[0] ;
		var processN = document.getElementById ( Astex.AMath.AMdocumentId ) ;
		if ( node != null ) { processN = node } ;

		// add missing numeric tokens that appear with _ and ^ is node
		//Astex.AMath.addNumericTokensForSubSup ( processN != null ? processN : body , Astex.AMath.decimalsign == "," ) ;
		Astex.AMath.addNumericTokens ( processN != null ? processN : body , Astex.AMath.decimalsign == "," ) ;

		if ( Astex.AMath.translateLaTeX ) {

			// think I fixed problem !!!
			// after more testing, can delete this

			// having some problems when displaying LaTex inside $ $
			// Here, we change all $ to ` to force AsciiMath to run instead
			// Note, we need to have Astex.AMath.translateASCIIMath == true
			/*
			if ( processN ) {
				processN.innerHTML = processN.innerHTML.replace ( /\$/g , "`" ) ;
			}
			else {
				body.innerHTML = body.innerHTML.replace ( /\$/g , "`" ) ;
			}
			*/

			// get { } and make them invisible
			var lbrace = Astex.Token.getToken ( "{" ) ;
			lbrace.invisible = true ;
			var rbrace = Astex.Token.getToken ( "}" ) ;
			rbrace.invisible = true ;

			Astex.AMath.LMprocessNode ( ( processN != null ? processN : body ) ) ;
		}
		if ( Astex.AMath.translateASCIIMath ) {

			// get { } and make them visible
			var lbrace = Astex.Token.getToken ( "{" ) ;
			lbrace.invisible = false ;
			var rbrace = Astex.Token.getToken ( "}" ) ;
			rbrace.invisible = false ;

			Astex.AMath.AMprocessNode ( ( processN != null ? processN : body ) , false , spanclassAM ) ;
		}
		Astex.AMath.translated = true ;
	}
};

// prototype: void Astex.AMath.addNumericTokens ( Node node , Boolean european )
// cycle through node and add numeric tokens since only digits 0-9 are initially included
// adds -digits.,digits
Astex.AMath.addNumericTokens = function ( node , european ) {

	if ( ! node ) { node = document.body ; }
	if ( ! european || typeof european != "boolean" ) { european = false ; }

	var str = node.innerHTML ;

	// european decimal point is actually the comma
	//var re = ( european ) ? new RegExp ( /([\+-]?\d*,?\d*)*/ ) : re = new RegExp ( /([\+-]?\d*\.?\d*)*/ ) ;
	//var re = ( european ) ? new RegExp ( /([\+-]?\d*,?\d*)/g ) : re = new RegExp ( /([\+-]?\d*\.?\d*)/g ) ;
	var re = ( european ) ? new RegExp ( /(-?\d*,?\d*)/g ) : re = new RegExp ( /(-?\d*\.?\d*)/g ) ;

	var match = str.match ( re ) ;

	//alert ( match.join(" ") ) ;
	for ( var i = 0 ; i < match.length ; i++ ) {
		if ( match[i] != null && match[i] != "" ) {
			Astex.Token.addToken ({input:match[i], tag:"mn", output:match[i], description:match[i], tex:null, ttype:Astex.Token.CONST, category:Astex.Token.AUTO}) ;
		}
	}

	// !!! IMPORTANT !!!   ---   resort token names array
	Astex.Token.TokenNames.sort ( ) ;
};

// prototype (X)HTMLElement Astex.AMath.createElementXHTML ( String tag )
// borrowed from AsciiMathML createElementXHTML() function
Astex.AMath.createElementXHTML = function ( tag ) {

	if ( Astex.Util.isIE ) {
		return document.createElement ( tag ) ;
	}
	else {
		return document.createElementNS ( "http://www.w3.org/1999/xhtml" , tag ) ;
	}
};


// prototype (X)HTMLElement Astex.AMath.createMathMLNode ( String tag , (X)HTMLElement frag )
// borrowed from AsciiMathML createMmlNode() function
Astex.AMath.createMathMLNode = function ( tag , frag ) {

	var node ;
	if ( Astex.Util.isIE ) {
		if ( Astex.AMath.useMathPlayer ) {
			node = document.createElement ( "m:" + tag ) ;		// this works in AsciiMathML, but not here
		}
		else {
			node = document.createElement ( tag ) ;				// this works !!!
		}
	}
	/*
	*/
	else if ( tag == "math" && Astex.AMath.useFlashMathMLViewer ) {		// flash mathml viewer
			node = document.createElement ( "m:" + tag ) ;
			node.setAttribute ( "xmlns:m" , "http://www.w3.org/1998/Math/MathML" ) ;
	}
	else {
		node = document.createElementNS ( "http://www.w3.org/1998/Math/MathML" , tag ) ;
	}

	if ( frag ) {
		node.appendChild ( frag ) ;
		//node.insertBefore ( frag , null ) ;
	}
	return node ;
};


// prototype void Astex.AMath.removeBrackets ( (X)HTMLElement node )
Astex.AMath.removeBrackets = function ( node ) {

	var st ;
	if ( node.nodeName == "mrow" ) {
		st = node.firstChild.firstChild.nodeValue ;
		if ( st == "(" || st == "[" || st == "{" ) {
			node.removeChild ( node.firstChild ) ;
		}
	}
	if ( node.nodeName == "mrow" ) {
		st = node.lastChild.firstChild.nodeValue ;
		if ( st == ")" || st == "]" || st == "}" ) {
			node.removeChild ( node.lastChild ) ;
		}
	}
};

//
//
// the following methods come from Ascii MathML functions
//
//

/*Parsing ASCII math expressions with the following grammar
v ::= [A-Za-z] | greek letters | numbers | other constant symbols
u ::= sqrt | text | bb | other unary symbols for font commands
b ::= frac | root | stackrel         binary symbols
l ::= ( | [ | { | (: | {:            left brackets
r ::= ) | ] | } | :) | :}            right brackets
S ::= v | lEr | uS | bSS             Simple expression
I ::= S_S | S^S | S_S^S | S          Intermediate expression
E ::= IE | I/I                       Expression
Each terminal symbol is translated into a corresponding mathml node.*/

// prototype Array[] Astex.AMath.AMparseSexpr ( String str )
// borrowed from AsciiMathML function AMparseSexpr()
// parses str and returns [node,tailstr]
Astex.AMath.AMparseSexpr = function ( str ) {

	var symbol, node, result, i, st ;
	// var rightvert = false;
	var newFrag = document.createDocumentFragment ( ) ;

	str = Astex.Util.removeCharsAndBlanks ( str , 0 ) ;
	//str = str.replace ( /\s/g , "" ) ;
	//alert ( str ) ;
	//alert ( Astex.Token.getMaximalTokenName(str) ) ;		// why would this be null if str = alpha ???????

	//symbol = Astex.Token.getToken ( str ) ;		// either a token or a bracket or empty
	symbol = Astex.Token.getToken ( Astex.Token.getMaximalTokenName(str) ) ;
	//alert ( Astex.Token.getMaximalTokenName(str) ) ;
	//alert ( symbol.input ) ;

	if ( symbol == null || symbol.ttype == Astex.Token.RIGHTBRACKET && Astex.AMath.AMnestingDepth > 0 ) {
		return [ null , str ] ;
	}
	if ( symbol.ttype == Astex.Token.DEFINITION ) {
		str = symbol.output + Astex.Util.removeCharsAndBlanks ( str , symbol.input.length ) ; 
		//symbol = Astex.Token.getToken ( str ) ;
		symbol = Astex.Token.getToken ( Astex.Token.getMaximalTokenName(str) ) ;
	}

	switch ( symbol.ttype ) {
		case Astex.Token.UNDEROVER :
			str = Astex.Util.removeCharsAndBlanks ( str , symbol.input.length ) ;
			// fix \bigTOKENS
			if ( (Astex.AMath.useNativeMathML || Astex.AMath.useMathPlayer) && symbol.input.match(/^\\?big/) ) {
				var tmpStr = symbol.input.replace ( /^\\?big/ , "" ) ;
				symbol = Astex.Token.getToken ( tmpStr ) ;
			}
			return [ Astex.AMath.createMathMLNode ( symbol.tag , document.createTextNode(symbol.output) ) , str ] ;
		case Astex.Token.CONST :
			str = Astex.Util.removeCharsAndBlanks ( str , symbol.input.length ) ;
			//alert ( str ) ;
			// symbol is a constant
			//return [ Astex.AMath.createMathMLNode ( symbol.tag , document.createTextNode(symbol.output) ) , str ] ;
			//
			// if you edit this make sure to edit LMparseSexpr also
			//
			//if ( symbol.output.match ( /=/ ) ) {
			/*
			if ( symbol.input.match ( /=|eq|!=|neq/ ) ) {
				// put a space before and after =
				var mrow = Astex.AMath.createMathMLNode ( "mrow" ) ;
				var space1 = Astex.AMath.createMathMLNode ( "mspace" ) ;
				space1.setAttribute ( "width" , "2ex" ) ;
				mrow.appendChild ( space1 ) ;
				var node = Astex.AMath.createMathMLNode ( symbol.tag , document.createTextNode(symbol.output) ) ;
				mrow.appendChild ( node ) ;
				var space2 = Astex.AMath.createMathMLNode ( "mspace" ) ;
				space2.setAttribute ( "width" , "2ex" ) ;
				mrow.appendChild ( space2 ) ;
				return [ mrow , str ] ;
			}
			else {
				return [ Astex.AMath.createMathMLNode ( symbol.tag , document.createTextNode(symbol.output) ) , str ] ;
			}
			*/
			return [ Astex.AMath.createMathMLNode ( symbol.tag , document.createTextNode(symbol.output) ) , str ] ;
		case Astex.Token.LEFTBRACKET :				//read (expr+)
			Astex.AMath.AMnestingDepth++ ;
			//alert ( str ) ;
			str = Astex.Util.removeCharsAndBlanks ( str , symbol.input.length ) ;
			result = Astex.AMath.AMparseExpr ( str , true ) ;
			Astex.AMath.AMnestingDepth-- ;
			if ( typeof symbol.invisible == "boolean" && symbol.invisible ) {
				node = Astex.AMath.createMathMLNode ( "mrow" , result[0] ) ;
			}
			else {
				node = Astex.AMath.createMathMLNode ( "mo" , document.createTextNode(symbol.output) ) ;
				node = Astex.AMath.createMathMLNode ( "mrow" , node ) ;
				node.appendChild ( result[0] ) ;
			}
			return [ node , result[1] ] ;
		case Astex.Token.TEXT :
			if ( symbol != Astex.Token.AMquote ) {
				str = Astex.Util.removeCharsAndBlanks ( str , symbol.input.length ) ;
			}
			if ( str.charAt(0) == "{" ) { i = str.indexOf( "}" ) ; }
			else if ( str.charAt(0) == "(" ) { i = str.indexOf( ")" ) ; }
			else if ( str.charAt(0) == "[" ) { i = str.indexOf( "]" ) ; }
			else if ( symbol == Astex.Token.AMquote ) { i = str.slice(1).indexOf("\"")+1 ; }
			else { i = 0 ; }

			if ( i == -1 ) { i = str.length ; }
			st = str.slice ( 1 , i ) ;
			if ( st.charAt(0) == " " ) {
				node = Astex.AMath.createMathMLNode ( "mspace" ) ;
				node.setAttribute ( "width" , "1ex" ) ;
				newFrag.appendChild ( node ) ;
			}
			newFrag.appendChild ( Astex.AMath.createMathMLNode( symbol.tag , document.createTextNode(st) ) ) ;
			if ( st.charAt(st.length-1) == " " ) {
				node = Astex.AMath.createMathMLNode ( "mspace" ) ;
				node.setAttribute ( "width" , "1ex" ) ;
				newFrag.appendChild ( node ) ;
			}
			str = Astex.Util.removeCharsAndBlanks ( str , i + 1 ) ;
			return [ Astex.AMath.createMathMLNode( "mrow" , newFrag ) , str ] ;
		case Astex.Token.UNARY :
			str = Astex.Util.removeCharsAndBlanks ( str , symbol.input.length ) ;
			result = Astex.AMath.AMparseSexpr ( str ) ;
			if ( result[0] == null ) {
				return [ Astex.AMath.createMathMLNode( symbol.tag , document.createTextNode(symbol.output) ) , str ] ;
			}
			if ( typeof symbol.func == "boolean" && symbol.func ) { // functions hack
				st = str.charAt ( 0 ) ;
				if ( st=="^" || st=="_" || st=="/" || st=="|" || st=="," ) {
					return [Astex.AMath.createMathMLNode ( symbol.tag, document.createTextNode(symbol.output) ) , str ] ;
				}
				else {
					node = Astex.AMath.createMathMLNode ( "mrow" , Astex.AMath.createMathMLNode( symbol.tag , document.createTextNode(symbol.output) ) ) ;
					node.appendChild ( result[0] ) ;
					return [ node , result[1] ] ;
				}
			}
			Astex.AMath.removeBrackets ( result[0] ) ;
			if ( symbol.input == "sqrt" || symbol.input == "\\sqrt" || symbol.input == "hide" || symbol.input == "\\hide" ) {			// sqrt and hide commands
				return [ Astex.AMath.createMathMLNode ( symbol.tag , result[0] ) , result[1] ] ;
			}
			else if ( typeof symbol.acc == "boolean" && symbol.acc ) {		// accent
				//node = Astex.AMath.createMathMLNode ( symbol.tag , result[0] ) ;
				//node.appendChild ( Astex.AMath.createMathMLNode( "mo" , document.createTextNode(symbol.output) ) ) ;
				//var mo = Astex.AMath.createMathMLNode( "mo" , document.createTextNode(symbol.output) ) ;
				//mo.setAttribute ( "accent" , "true" ) ;		// added (should i make this the same as in LMathML?)
				//node.appendChild ( mo ) ;
				//node.appendChild ( Astex.AMath.createMathMLNode( "mi" , document.createTextNode(symbol.output) ) ) ;
				//return [ node , result[1] ] ;
				node = Astex.AMath.createMathMLNode ( symbol.tag , result[0] ) ;
				//if ( Astex.Util.isIE ) {
				if ( Astex.AMath.useMathPlayer ) {
					if ( symbol.input == "\\hat" || symbol.input == "hat" ) {
						symbol.output = "\u0302";
					}
					else if ( symbol.input == "\\widehat" || symbol.input == "widehat" ) {
						symbol.output = "\u005E";
					}
					else if ( symbol.input == "\\bar" || symbol.input == "bar" ) {
						symbol.output = "\u00AF";
					}
					else if ( symbol.input == "\\grave" || symbol.input == "grave" ) {
						symbol.output = "\u0300";
					}
					else if ( symbol.input == "\\tilde" || symbol.input == "tilde" ) {
						symbol.output = "\u0303";
					}
					else if ( symbol.input == "\\vec" || symbol.input == "vec" ) {
						symbol.output = "\u20D7";
					}
				}
				var node1 = Astex.AMath.createMathMLNode ( "mo" , document.createTextNode(symbol.output) ) ;
				if ( symbol.input == "\\vec" || symbol.input == "vec" || symbol.input == "\\check" || symbol.input == "check" ) {
					// don't allow to stretch
					// why doesn't "1" work?  \vec nearly disappears in firefox
					node1.setAttribute ( "maxsize" , "1.2" ) ;
				}
				/*
				if ( Astex.Util.isIE && (symbol.input == "\\bar" || symbol.input == "bar") ) {
					node1.setAttribute ( "maxsize" , "0.5" ) ;
				}
				*/
				if ( symbol.input == "\\underbrace" || symbol.input == "underbrace" || symbol.input == "\\underline" || symbol.input == "underline" ) {
					node1.setAttribute ( "accentunder" , "true" ) ;
				}
				else {
					node1.setAttribute ( "accent" , "true" ) ;
				}
				node.appendChild ( node1 ) ;
				if ( symbol.input == "\\overbrace" || symbol.input == "overbrace" || symbol.input == "\\underbrace" || symbol.input == "underbrace" ) {
					node.ttype = Astex.Token.UNDEROVER ;
				}
				return [ node , result[1] ] ;
			}
			else {						// font change command
				//if ( ! Astex.Util.isIE && typeof symbol.codes != "undefined" ) {
				if ( Astex.AMath.useNativeMathML && typeof symbol.codes != "undefined" ) {
					for ( i = 0 ; i < result[0].childNodes.length ; i++ ) {
						//if ( result[0].childNodes[i].nodeName == "mi" || result[0].nodeName == "mi" ) {
						if ( result[0].childNodes[i].nodeName.match(/mi|mo/) || result[0].nodeName.match(/mi|mo/) ) {
							//st = ( result[0].nodeName=="mi" ? result[0].firstChild.nodeValue : result[0].childNodes[i].firstChild.nodeValue ) ;
							st = ( result[0].nodeName.match(/mi|mo/) ? result[0].firstChild.nodeValue : result[0].childNodes[i].firstChild.nodeValue ) ;
							var newst = [] ;
							for ( var j=0 ; j < st.length ; j++) {
								if ( st.charCodeAt(j) > 64 && st.charCodeAt(j) < 91) {
									newst = newst + String.fromCharCode ( symbol.codes[st.charCodeAt(j)-65] ) ;
								}
								else {
									newst = newst + st.charAt ( j ) ;
								}
							}
							//if ( result[0].nodeName == "mi" ) {
							if ( result[0].nodeName.match(/mi|mo/) ) {
								result[0] = Astex.AMath.createMathMLNode("mo").appendChild( document.createTextNode(newst) ) ;
								//alert ( "mi" ) ;
							}
							else {
								result[0].replaceChild(Astex.AMath.createMathMLNode("mo").appendChild( document.createTextNode(newst) ) , result[0].childNodes[i] ) ;
								//alert ( "mo" ) ;
							}
						}
					}
				}
				//alert ( typeof result[1] ) ;
				node = Astex.AMath.createMathMLNode ( symbol.tag , result[0] ) ;
				node.setAttribute ( symbol.atname , symbol.atval ) ;
				return [ node , result[1] ] ;
			}
			/*
			else {						// font change command
				node = Astex.AMath.createMathMLNode ( symbol.tag , result[0] ) ;
				node.setAttribute ( symbol.atname , symbol.atval ) ;
				return [ node , result[1] ] ;
			}
			*/
		case Astex.Token.BINARY:
			if ( symbol.input == "color" || symbol.input == "\\color" ) {
				// read string and get color between { }
				str = Astex.Util.removeCharsAndBlanks ( str , symbol.input.length ) ;
				var ind1 = str.indexOf ( "{" ) ;	
				var ind2 = str.indexOf ( "}" , ind1 + 1 ) ;
				if ( ind1 == -1 || ind2 == - 1 ) {
					return new Astex.Warning ( "Incorrect color syntax: color{color-goes-here}" , "Astex.AMath.AMparseSexpr" ) ;
				}
				var color = str.slice ( ind1 + 1 , ind2 ) ;
				// remove {color} from string
				str = str.slice ( ind2 + 1 ) ;
				result = Astex.AMath.AMparseSexpr ( str ) ;
				Astex.AMath.removeBrackets ( result[0] ) ;
				var mstyle = Astex.AMath.createMathMLNode ( symbol.tag ) ;
				mstyle.setAttribute ( "mathcolor" , color ) ;
				mstyle.appendChild ( result[0] ) ;
				return [ mstyle , result[1] ] ;
			}
			str = Astex.Util.removeCharsAndBlanks ( str , symbol.input.length ) ; 
			result = Astex.AMath.AMparseSexpr ( str ) ;
			if ( result[0] == null ) {
				return [ Astex.AMath.createMathMLNode ( "mo" , document.createTextNode ( symbol.input ) ) , str ] ;
			}
			Astex.AMath.removeBrackets ( result[0] ) ;
			var result2 = Astex.AMath.AMparseSexpr ( result[1] ) ;
			if ( result2[0] == null ) {
				return [ Astex.AMath.createMathMLNode ( "mo" , document.createTextNode ( symbol.input ) ) , str ] ;
			}
			Astex.AMath.removeBrackets ( result2[0] ) ;
			if ( symbol.input == "root" || symbol.input == "\\root" || symbol.input == "stackrel" || symbol.input == "\\stackrel" ) { 
				newFrag.appendChild ( result2[0] ) ;
			}
			newFrag.appendChild ( result[0] ) ;
			if ( symbol.input == "frac" || symbol.input == "\\frac" ) {
				newFrag.appendChild ( result2[0] ) ;
			}
			return [ Astex.AMath.createMathMLNode ( symbol.tag , newFrag ) , result2[1] ] ;
		case Astex.Token.INFIX :
			str = Astex.Util.removeCharsAndBlanks ( str , symbol.input.length ) ; 
			return [ Astex.AMath.createMathMLNode ( "mo" , document.createTextNode ( symbol.output ) ) , str ] ;
		case Astex.Token.SPACE :
			str = Astex.Util.removeCharsAndBlanks ( str , symbol.input.length ) ; 
			node = Astex.AMath.createMathMLNode ( "mspace" ) ;
			node.setAttribute ( "width" , "1ex" ) ;
			newFrag.appendChild ( node ) ;
			newFrag.appendChild ( Astex.AMath.createMathMLNode ( symbol.tag , document.createTextNode(symbol.output) ) ) ;
			node = Astex.AMath.createMathMLNode ( "mspace" ) ;
			node.setAttribute ( "width" , "1ex" ) ;
			newFrag.appendChild ( node ) ;
			return [ Astex.AMath.createMathMLNode ( "mrow" , newFrag ) , str ] ;
		case Astex.Token.LEFTRIGHT :
			// if (rightvert) return [null,str]; else rightvert = true;
			Astex.AMath.AMnestingDepth++ ;
			str = Astex.Util.removeCharsAndBlanks ( str , symbol.input.length ) ; 
			result = Astex.AMath.AMparseExpr( str , false ) ;
			Astex.AMath.AMnestingDepth-- ;
			var st = "" ;
			if ( result[0].lastChild != null ) {
				st = result[0].lastChild.firstChild.nodeValue ;
			}
			if ( st == "|" ) {					// its an absolute value subterm
				node = Astex.AMath.createMathMLNode ( "mo" , document.createTextNode(symbol.output) ) ;
				node = Astex.AMath.createMathMLNode ( "mrow" , node ) ;
				node.appendChild ( result[0] ) ;
				return [ node , result[1] ] ;
			}
			else {				// the "|" is a \mid so use unicode 2223 (divides) for spacing
				//node = Astex.AMath.createMathMLNode ( "mo" , document.createTextNode("\u2223") ) ;		// what should this be???
				//
				// make sure \u2223 is associated with a | symbol !!!
				//
				// also make sure there are no other document.createTextNode("\uXXXX") calls !!!

				node = Astex.AMath.createMathMLNode ( "mo" , document.createTextNode(symbol.output) ) ;		// what should this be???
				node = Astex.AMath.createMathMLNode ( "mrow" , node ) ;
				return [ node , str ] ;
			}
		default :
			//alert("default");
			str = Astex.Util.removeCharsAndBlanks ( str , symbol.input.length ) ; 
			// it's a constant
			return [ Astex.AMath.createMathMLNode( symbol.tag , document.createTextNode(symbol.output) ) , str ] ;

	}	// end switch statement
};

// prototype Array[] Astex.AMath.AMparseIexpr ( String str )
// borrowed from AsciiMathML function AMparseIexpr()
// parses str and returns [node,tailstr]
Astex.AMath.AMparseIexpr = function ( str ) {

	var symbol, sym1, sym2, node, result, underover;
	str = Astex.Util.removeCharsAndBlanks ( str , 0 ) ;
	//sym1 = Astex.Token.getToken ( str ) ;
	sym1 = Astex.Token.getToken ( Astex.Token.getMaximalTokenName(str) ) ;
	//alert ( str ) ;
	//alert ( sym1.input ) ;
	str = Astex.Util.removeCharsAndBlanks ( str , 0 ) ;
	//alert ( str ) ;
	result = Astex.AMath.AMparseSexpr ( str ) ;
	node = result[0] ;
	//alert ( node.tagName ) ;
	str = result[1] ;
	//alert ( node.nodeValue ) ;
	//alert ( str ) ;
	//symbol = Astex.Token.getToken ( str ) ;
	symbol = Astex.Token.getToken ( Astex.Token.getMaximalTokenName(str) ) ;
	if ( symbol.ttype == Astex.Token.INFIX && symbol.input != "/" ) {
		str = Astex.Util.removeCharsAndBlanks ( str , symbol.input.length ) ;
		// if (symbol.input == "/") result = AMparseIexpr(str); else ...
		result = Astex.AMath.AMparseSexpr ( str ) ;
		if ( result[0] == null ) {						// show box in place of missing argument
			result[0] = Astex.AMath.createMathMLNode( "mo" , document.createTextNode("\u25A1") ) ;
							// 
							// should i change this to the token-not -found token ????????????
							// 
		}
		else {
			Astex.AMath.removeBrackets ( result[0] ) ;
		}
		str = result[1] ;
		// if (symbol.input == "/") Astex.AMath.removeBrackets(node);
		if ( symbol.input == "_" ) {
			//sym2 = Astex.Token.getToken ( str ) ;
			sym2 = Astex.Token.getToken ( Astex.Token.getMaximalTokenName(str) ) ;
			underover = ( sym1.ttype == Astex.Token.UNDEROVER ) ;
			if ( sym2.input == "^" ) {
				str = Astex.Util.removeCharsAndBlanks ( str , sym2.input.length ) ;
				var res2 = Astex.AMath.AMparseSexpr ( str ) ;
				Astex.AMath.removeBrackets ( res2[0] ) ;
				str = res2[1] ;
				node = Astex.AMath.createMathMLNode ( ( underover ? "munderover" : "msubsup" ) , node ) ;
				node.appendChild ( result[0] ) ;
				node.appendChild ( res2[0] ) ;
				node = Astex.AMath.createMathMLNode ( "mrow" , node ) ;		// so sum does not stretch
			}
			else {
				node = Astex.AMath.createMathMLNode ( ( underover ? "munder" : "msub" ) , node ) ;
				node.appendChild ( result[0] ) ;
			}
		}
		/* added -- fix to make sum^{} use mover instead of msup */
		else if ( symbol.input == "^" && sym1.ttype == Astex.Token.UNDEROVER ) {
			node = Astex.AMath.createMathMLNode ( "mover" , node ) ;
			node.appendChild ( result[0] ) ;
		}
		else {
			//node = Astex.AMath.createMathMLNode ( symbol.tag , node ) ;
			//node.appendChild ( result[0] ) ;
			// added by MAZ
			node = Astex.AMath.createMathMLNode ( symbol.tag , node ) ;
			if ( symbol.input == "\\atop" || symbol.input == "atop" || symbol.input == "\\choose" || symbol.input == "choose" ) {
				node.setAttribute ( "linethickness" , "0ex" ) ;
			}
			node.appendChild ( result[0] ) ;
			if ( symbol.input == "\\choose" || symbol.input == "choose" ) {
				node = Astex.AMath.createMathMLNode ( "mfenced" , node ) ;
			}
		}
	}
	return [ node , str ] ;
};


// prototype Array[] Astex.AMath.AMparseExpr ( String str , ????? rightbracket )
// borrowed from AsciiMathML function AMparseExpr()
// parses str and returns [node,tailstr]
Astex.AMath.AMparseExpr = function ( str , rightbracket ) {

	//if ( ! rightbracket || typeof rightbracket != "boolean" ) { rightbracket = false ; }
	var symbol, node, result, i, nodeList = [], newFrag = document.createDocumentFragment() ;

	do {
		str = Astex.Util.removeCharsAndBlanks ( str , 0 ) ;
		//alert ( str ) ;
		result = Astex.AMath.AMparseIexpr ( str ) ;
		node = result[0] ;
		str = result[1] ;
		//alert ( str ) ;
		//symbol = Astex.Token.getToken ( str ) ;
		symbol = Astex.Token.getToken ( Astex.Token.getMaximalTokenName(str) ) ;
		//alert ( symbol.input + " " + symbol.tag + " " + symbol.ttype ) ;
		//alert ( symbol.input ) ;
		if ( symbol.ttype == Astex.Token.INFIX && symbol.input == "/" ) {
			//alert ( "111" ) ;
			str = Astex.Util.removeCharsAndBlanks ( str , symbol.input.length ) ;
			//alert ( str ) ;
			result = Astex.AMath.AMparseIexpr ( str ) ;
			if ( result[0] == null ) {					// show box in place of missing argument
				result[0] = Astex.AMath.createMathMLNode ( "mo" , document.createTextNode("\u25A1") ) ;
								// 
								// should i change this to the token-not -found token ????????????
								// 
			}
			else {
				Astex.AMath.removeBrackets ( result[0] ) ;
			}
			str = result[1] ;
			Astex.AMath.removeBrackets ( node ) ;
			node = Astex.AMath.createMathMLNode ( symbol.tag , node ) ;
			node.appendChild ( result[0] ) ;
			newFrag.appendChild ( node ) ;
			//symbol = Astex.Token.getToken ( str ) ;
			symbol = Astex.Token.getToken ( Astex.Token.getMaximalTokenName(str) ) ;
		}
		else if ( node != undefined ) {
			newFrag.appendChild ( node ) ;
		}

		//alert ( symbol.output2 ) ;
	//} while ((symbol.ttype != Astex.Token.RIGHTBRACKET && (symbol.ttype != Astex.Token.LEFTRIGHT || rightbracket) || Astex.AMath.AMnestingDepth == 0) && symbol!=null && symbol.output!="");							// end do-while loop
	} while ((symbol.ttype != Astex.Token.RIGHTBRACKET && (symbol.ttype != Astex.Token.LEFTRIGHT || rightbracket) || Astex.AMath.AMnestingDepth == 0) && !symbol.input.match(/not-found/i) );							// end do-while loop

	//alert ( "out of loop" ) ;

	if ( symbol.ttype == Astex.Token.RIGHTBRACKET || symbol.ttype == Astex.Token.LEFTRIGHT ) {
	// if (Astex.AMath.AMnestingDepth > 0) Astex.AMath.AMnestingDepth--;
		var len = newFrag.childNodes.length ;
		//alert ( len ) ;
		//alert ( newFrag.childNodes[len-1].nodeName + " " + newFrag.childNodes[len-2].nodeName + " " + newFrag.childNodes[len-2].firstChild.nodeValue ) ;
		//if (len>0 && newFrag.childNodes[len-1].nodeName == "mrow" && len>1 && newFrag.childNodes[len-2].nodeName == "mo" && newFrag.childNodes[len-2].firstChild.nodeValue == ",") { //matrix
		if (len>0 && newFrag.childNodes[len-1].nodeName == "mrow" && len>1 && newFrag.childNodes[len-2].nodeName.match(/mo|mi|mn/) && newFrag.childNodes[len-2].firstChild.nodeValue == ",") { //matrix
			var right = newFrag.childNodes[len-1].lastChild.firstChild.nodeValue;
			if (right==")" || right=="]") {
				var left = newFrag.childNodes[len-1].firstChild.firstChild.nodeValue;
				if (left=="(" && right==")" && symbol.output != "}" || left=="[" && right=="]") {
					var pos = []; // positions of commas
					var matrix = true;
					var m = newFrag.childNodes.length;
					for (i=0; matrix && i<m; i=i+2) {
						pos[i] = [];
						node = newFrag.childNodes[i];
						if (matrix) {
							//matrix = node.nodeName=="mrow" && (i==m-1 || node.nextSibling.nodeName=="mo" && node.nextSibling.firstChild.nodeValue==",")&& node.firstChild.firstChild.nodeValue==left && node.lastChild.firstChild.nodeValue==right;
							matrix = node.nodeName=="mrow" && (i==m-1 || node.nextSibling.nodeName.match(/mo|mi|mn/) && node.nextSibling.firstChild.nodeValue==",")&& node.firstChild.firstChild.nodeValue==left && node.lastChild.firstChild.nodeValue==right;
						}
						if (matrix) {
							for (var j=0; j<node.childNodes.length; j++) {
								if (node.childNodes[j].firstChild.nodeValue==",") {
									pos[i][pos[i].length]=j;
								}
							}
						}
						if (matrix && i>1) { matrix = pos[i].length == pos[i-2].length; }
					}	// end for loop
					if (matrix) {
						var row, frag, n, k, table = document.createDocumentFragment();
						for (i=0; i<m; i=i+2) {
							row = document.createDocumentFragment();
							frag = document.createDocumentFragment();
							node = newFrag.firstChild; // <mrow>(-,-,...,-,-)</mrow>
							n = node.childNodes.length;
							k = 0;
							node.removeChild(node.firstChild); //remove (
							for (j=1; j<n-1; j++) {
								if (typeof pos[i][k] != "undefined" && j==pos[i][k]){
									node.removeChild(node.firstChild); //remove ,
									//row.appendChild(Astex.AMath.createMathMLNode("mtd",frag));
									row.appendChild(Astex.AMath.createMathMLNode("mtd",Astex.AMath.createMathMLNode("mrow",frag)));
									k++;
								}
								else {
									frag.appendChild(node.firstChild);
								}
							}	// end inner-for-loop
							//row.appendChild(Astex.AMath.createMathMLNode("mtd",frag));
							row.appendChild(Astex.AMath.createMathMLNode("mtd",Astex.AMath.createMathMLNode("mrow",frag)));
							if (newFrag.childNodes.length>2) {
								newFrag.removeChild(newFrag.firstChild); //remove <mrow>)</mrow>
								newFrag.removeChild(newFrag.firstChild); //remove <mo>,</mo>
							}
							table.appendChild(Astex.AMath.createMathMLNode("mtr",row));
						}	// end for-loop
						node = Astex.AMath.createMathMLNode("mtable",table);
						if (typeof symbol.invisible == "boolean" && symbol.invisible) {
							node.setAttribute("columnalign","left") ;
						}
						newFrag.replaceChild(node,newFrag.firstChild);
					}
				}
			}
		}
		str = Astex.Util.removeCharsAndBlanks ( str , symbol.input.length ) ;
		if ( typeof symbol.invisible != "boolean" || ! symbol.invisible ) {
			node = Astex.AMath.createMathMLNode ( "mo" , document.createTextNode(symbol.output) ) ;
			newFrag.appendChild ( node ) ;
		}
	}	// end outermost if-statement

	return [ newFrag , str ] ;
};

// prototype (X)HTMLElement Astex.AMath.parseMath ( String str , Boolean latex )
// borrowed from the AsciiMathML parseMath() function
Astex.AMath.parseMath = function ( str , latex ) { 

	var frag, node ;
	Astex.AMath.AMnestingDepth = 0 ;
	frag = latex ? Astex.AMath.LMparseExpr(str.replace(/^\s+/g,""),false,false)[0] : Astex.AMath.AMparseExpr(str.replace(/^\s+/g,""),false)[0] ;
	node = Astex.AMath.createMathMLNode ( "mstyle" , frag ) ;
	node.setAttribute ( "mathcolor" , Astex.AMath.mathcolor ) ;
	node.setAttribute( "fontfamily" , Astex.AMath.mathfontfamily ) ;
	node.setAttribute( "mathsize" , Astex.AMath.mathfontsize ) ;
	if ( Astex.AMath.displaystyle ) { node.setAttribute ( "displaystyle" , "true" ) ; }
	node = Astex.AMath.createMathMLNode ( "math" , node ) ;
	if ( Astex.AMath.showasciiformulaonhover ) {					// fixed by djhsu so newline
		node.setAttribute ( "title" , str.replace ( /\s+/g , " " ) ) ;	// does not show in Gecko
	}
	return node ;
};

// prototype DocumentFragment Astex.AMath.stringArray2DocumentFragment ( String[] array , Boolean linebreaks , Boolean latex )
// borrowed from the AsciiMathML strarr2docFrag() function
Astex.AMath.stringArray2DocumentFragment = function ( arr , linebreaks , latex ) {

	var newFrag = document.createDocumentFragment ( ) ;
	var expr = false ;
	for ( var i = 0 ; i < arr.length ; i++ ) {
		if ( expr ) {
			newFrag.appendChild ( Astex.AMath.parseMath ( arr[i] , latex ) ) ;
		}
		else {
			var arri = ( linebreaks ? arr[i].split("\n\n") : [arr[i]] ) ;
			newFrag.appendChild ( Astex.AMath.createElementXHTML("span").appendChild ( document.createTextNode(arri[0]) ) ) ;
			for ( var j = 1 ; j < arri.length ; j++ ) {
				newFrag.appendChild ( Astex.AMath.createElementXHTML("p") ) ;
				newFrag.appendChild ( Astex.AMath.createElementXHTML("span").appendChild ( document.createTextNode(arri[j]) ) ) ;
			}
		}
		expr = ! expr ;
	}

	return newFrag ;
};

// prototype: String Astex.AMath.AMautomathrec ( String str )
// borrowed from AsciiMathML AMautomathrec() function
Astex.AMath.AMautomathrec = function ( str ) {

	// formula is a space (or start of str) followed by a maximal sequence 
	// of *two* or more tokens, possibly separated by runs of digits and/or space.
	// tokens are single letters (except a, A, I) and ASCIIMathML tokens
	var texcommand = "\\\\[a-zA-Z]+|\\\\\\s|" ;
	var ambigAMtoken = "\\b(?:oo|lim|ln|int|oint|del|grad|aleph|prod|prop|sinh|cosh|tanh|cos|sec|pi|tt|fr|sf|sube|supe|sub|sup|det|mod|gcd|lcm|min|max|vec|ddot|ul|chi|eta|nu|mu)(?![a-z])|";
	var englishAMtoken = "\\b(?:sum|ox|log|sin|tan|dim|hat|bar|dot)(?![a-z])|";
	var secondenglishAMtoken = "|\\bI\\b|\\bin\\b|\\btext\\b"; // took if and or not out
	//var simpleAMtoken = "NN|ZZ|QQ|RR|CC|TT|AA|EE|sqrt|dx|dy|dz|dt|xx|vv|uu|nn|bb|cc|csc|cot|alpha|beta|delta|Delta|epsilon|gamma|Gamma|kappa|lambda|Lambda|omega|phi|Phi|Pi|psi|Psi|rho|sigma|Sigma|tau|theta|Theta|xi|Xi|zeta"; // uuu nnn?
	var simpleAMtoken = "NN|ZZ|QQ|RR|CC|TT|AA|EE|sqrt|dx|dy|dz|dt|xx|vv|uu|nn|bb|cc|csc|cot|alpha|Alpha|beta|Beta|gamma|Gamma|delta|Delta|epsilon|Epsilon|zeta|Zeta|eta|Eta|theta|Theta|iota|Iota|kappa|Kappa|lambda|Lambda|mu|Mu|nu|Nu|xi|Xi|omicron|Omicron|pi|Pi|rho|Rho|sigmaf|sigma|Sigma|tau|Tau|upsilon|Upsilon|phi|Phi|chi|Chi|psi|Psi|omega|Omega"; // uuu nnn?
	//
	// finish adding all Greek letters ...... DONE !!!
	//
	// do I need to add any new(er) tokens ???
	//
	//
	var letter = "[a-zA-HJ-Z](?=(?:[^a-zA-Z]|$|"+ambigAMtoken+englishAMtoken+simpleAMtoken+"))|";
	var token = letter+texcommand+"\\d+|[-()[\\]{}+=*&^_%\\\@/<>,\\|!:;'~]|\\.(?!(?:\x20|$))|"+ambigAMtoken+englishAMtoken+simpleAMtoken;
	var re = new RegExp("(^|\\s)((("+token+")\\s?)(("+token+secondenglishAMtoken+")\\s?)+)([,.?]?(?=\\s|$))","g");
	str = str.replace(re," `$2`$7");
	var arr = str.split( Astex.AMath.AMdelimiter1 ) ;
	var re1 = new RegExp("(^|\\s)([b-zB-HJ-Z+*<>]|"+texcommand+ambigAMtoken+simpleAMtoken+")(\\s|\\n|$)","g");
	var re2 = new RegExp("(^|\\s)([a-z]|"+texcommand+ambigAMtoken+simpleAMtoken+")([,.])","g"); // removed |\d+ for now
	for ( i = 0 ; i < arr.length ; i++ ) {					// single nonenglish tokens
		if ( i % 2 == 0 ) {
			arr[i] = arr[i].replace ( re1 , " `$2`$3" ) ;
			arr[i] = arr[i].replace ( re2 , " `$2`$3" ) ;
			arr[i] = arr[i].replace ( /([{}[\]])/ , "`$1`" ) ;
		}
	}
	str = arr.join ( Astex.AMath.AMdelimiter1 ) ;
	str = str.replace ( /((^|\s)\([a-zA-Z]{2,}.*?)\)`/g , "$1`)" ) ;  //fix parentheses
	str = str.replace ( /`(\((a\s|in\s))(.*?[a-zA-Z]{2,}\))/g , "$1`$3" ) ;  //fix parentheses
	str = str.replace ( /\sin`/g , "` in" ) ;
	str = str.replace ( /`(\(\w\)[,.]?(\s|\n|$))/g , "$1`" ) ;
	str = str.replace ( /`([0-9.]+|e.g|i.e)`(\.?)/gi , "$1$2" ) ;
	str = str.replace ( /`([0-9.]+:)`/g , "$1" ) ;
	return str ;
};

// prototype: Int Astex.AMath.AMprocessNodeR ( Node n , Boolean linebreaks , Boolean latex )
// borrowed from AsciiMathML processNodeR() function
Astex.AMath.processNodeR = function ( n , linebreaks , latex ) {
	
	var mtch, str, arr, frg, i ;
	if ( n.childNodes.length == 0 ) {
		//if ( (n.nodeType!=8 || linebreaks) && n.parentNode.nodeName!="form" && n.parentNode.nodeName!="FORM" && n.parentNode.nodeName!="textarea" && n.parentNode.nodeName!="TEXTAREA" /*&& n.parentNode.nodeName!="pre" && n.parentNode.nodeName!="PRE"*/ ) {
		if ( (n.nodeType!=8 || linebreaks) && !Astex.Util.nodeIsElement(n.parentNode,"form") && !Astex.Util.nodeIsElement(n.parentNode,"textarea") /*&& !Astex.Util.nodeIsElement(n.parentNode,"pre")*/ ) {
			str = n.nodeValue ;
			if ( ! ( str == null ) ) {
				str = str.replace ( /\r\n\r\n/g , "\n\n" ) ;
				str = str.replace ( /\x20+/g , " " ) ;
				str = str.replace ( /\s*\r\n/g , " " ) ;
				if ( latex ) {
					// DELIMITERS:
					mtch = ( str.indexOf("\$") == -1 ? false : true ) ;
					str = str.replace ( /([^\\])\$/g , "$1 \$" ) ;
					str = str.replace ( /^\$/ , " \$" ) ;	// in case \$ at start of string
					arr = str.split ( " \$" ) ;
					for ( i = 0 ; i < arr.length ; i++ ) {
						arr[i] = arr[i].replace ( /\\\$/g , "\$" ) ;
					}
				}
				else {
					mtch = false ;
					//
					// do I need to replace "AMescape1" string below w/ Astex.AMath.AMescape1 ?????
					//
					str = str.replace ( new RegExp(Astex.AMath.AMescape1 , "g") , function(){mtch = true; return "AMescape1"} ) ;
					str = str.replace ( /\\?end{?a?math}?/i , function(){Astex.AMath.automathrecognize = false; mtch = true; return ""} ) ;
					str = str.replace ( /amath\b|\\begin{a?math}/i , function(){Astex.AMath.automathrecognize = true; mtch = true; return ""} ) ;
					arr = str.split ( Astex.AMath.AMdelimiter1 ) ;
					if ( Astex.AMath.automathrecognize ) {
						for ( i = 0 ; i < arr.length ; i++) {
							if ( i % 2 == 0 ) {
								arr[i] = Astex.AMath.AMautomathrec ( arr[i] ) ;
							}
						}
					}
					str = arr.join ( Astex.AMath.AMdelimiter1 ) ;
					arr = str.split ( Astex.AMath.AMdelimiter1 ) ;
					for ( i = 0 ; i < arr.length ; i++ ) { // this is a problem ************
						//
						// do I need to replace /AMescape1/ reg. exp. below w/ Astex.AMath.AMescape1 ?????
						//
						arr[i] = arr[i].replace ( /AMescape1/g , Astex.AMath.AMdelimiter1 ) ;
					}
				}
				if ( arr.length > 1 || mtch ) {
					if ( ! Astex.AMath.noMathML ) {
						frg = Astex.AMath.stringArray2DocumentFragment ( arr , n.nodeType==8 , latex ) ;
						var len = frg.childNodes.length ;
						n.parentNode.replaceChild ( frg , n ) ;
						return len - 1 ;
					}
					else {
						return 0;
					}
				}

			}
		}
		else {
			return 0;
		}
	}			// end outermost if-statement
	else if ( n.nodeName != "math" ) {
		for ( i = 0 ; i < n.childNodes.length ; i++ ) {
			i += Astex.AMath.processNodeR ( n.childNodes[i] , linebreaks , latex ) ;
		}
	}
	return 0 ;
};



// prototype: void Astex.AMath.AMprocessNode ( Node n , Boolean linebreaks , ?????? spanclassAM )
// borrowed from AsciiMathML AMprocessNode() function
Astex.AMath.AMprocessNode = function ( n , linebreaks , spanclassAM ) {

	var frag , st ;
	if ( spanclassAM != null ) {
		frag = document.getElementsByTagName ( "span" ) ;
		for ( var i = 0 ; i < frag.length ; i++ ) {
			if ( frag[i].className == "AM" ) {

				Astex.AMath.processNodeR ( frag[i] , linebreaks , false ) ;
			}
		}
	}
	else {
		try {
			st = n.innerHTML ;			// look for AMdelimiter on page
		}
		catch ( err ) {
			/* empty body */
		}
		//alert(st)
		if ( st==null || /amath\b|\\begin{a?math}/i.test(st) || st.indexOf(Astex.AMath.AMdelimiter1+" ")!=-1 || st.slice(-1)==Astex.AMath.AMdelimiter1 || st.indexOf(Astex.AMath.AMdelimiter1+"<")!=-1 || st.indexOf(Astex.AMath.AMdelimiter1+"\n")!=-1 ) {

			Astex.AMath.processNodeR ( n , linebreaks , false ) ;
		}
	}
/*  if (isIE) { //needed to match size and font of formula to surrounding text
    frag = document.getElementsByTagName('math');
    for (var i=0;i<frag.length;i++) frag[i].update() //What is this?
  }*/
};


//
//
// the following methods come from LATEX MathML functions
//
//


// prototype Array[] Astex.AMath.LMparseSexpr ( String str )
// borrowed from AsciiMathML function LMparseSexpr()
// parses str and returns [node,tailstr,(node)tag]
Astex.AMath.LMparseSexpr = function ( str ) {

	var symbol , node , result , result2 , i , st ;
	//var rightvert = false ;
	var newFrag = document.createDocumentFragment ( ) ;
	str = Astex.Util.removeCharsAndBlanks ( str , 0 , true ) ;
	//symbol = Astex.Token.getToken ( str ) ;				// either a token or a bracket or empty
	symbol = Astex.Token.getToken ( Astex.Token.getMaximalTokenName(str) ) ;
	if ( symbol == null || symbol.ttype == Astex.Token.RIGHTBRACKET ) {
		return [ null , str , null ] ;
	}
	if ( symbol.ttype == Astex.Token.DEFINITION ) {
		str = symbol.output + Astex.Util.removeCharsAndBlanks ( str , symbol.input.length , true ) ;
		//symbol = Astex.Token.getToken ( str ) ;
		symbol = Astex.Token.getToken ( Astex.Token.getMaximalTokenName(str) ) ;
		if ( symbol == null || symbol.ttype == Astex.Token.RIGHTBRACKET ) {
			return [ null , str , null ] ;
		}
	}
	str = Astex.Util.removeCharsAndBlanks ( str , symbol.input.length , true ) ;
	switch ( symbol.ttype ) {
		case Astex.Token.SPACE :
			// original algorithm
			//node = Astex.AMath.createMathMLNode ( symbol.tag ) ;
			//node.setAttribute ( symbol.atname , symbol.atval ) ;
			//return [ node , str , symbol.tag ] ;
			// new algorithm, borrowed from AMparseSexpr above
			str = Astex.Util.removeCharsAndBlanks ( str , symbol.input.length ) ; 
			node = Astex.AMath.createMathMLNode ( "mspace" ) ;
			node.setAttribute ( "width" , "1ex" ) ;
			newFrag.appendChild ( node ) ;
			newFrag.appendChild ( Astex.AMath.createMathMLNode ( symbol.tag , document.createTextNode(symbol.output) ) ) ;
			node = Astex.AMath.createMathMLNode ( "mspace" ) ;
			node.setAttribute ( "width" , "1ex" ) ;
			newFrag.appendChild ( node ) ;
			return [ Astex.AMath.createMathMLNode ( "mrow" , newFrag ) , str , "mrow" ] ;
		case Astex.Token.UNDEROVER :
			/*
			if ( Astex.Util.isIE ) {
				if (symbol.input.substr(0,4) == "\\big") {   // botch for missing symbols
					str = "\\"+symbol.input.substr(4)+str;	   // make \bigcup = \cup etc.
					symbol = LMgetSymbol(str);
					symbol.ttype = UNDEROVER;
					str = LMremoveCharsAndBlanks(str,symbol.input.length);
				}
			}
			*/
			// fix \bigTOKENS
			if ( (Astex.AMath.useNativeMathML || Astex.AMath.useMathPlayer) && symbol.input.match(/^\\?big/) ) {
				var tmpStr = symbol.input.replace ( /^\\?big/ , "" ) ;
				symbol = Astex.Token.getToken ( tmpStr ) ;
			}
			return [ Astex.AMath.createMathMLNode(symbol.tag, document.createTextNode(symbol.output)) , str , symbol.tag ] ;
		case Astex.Token.CONST :
			/*
			var output = symbol.output;
			if ( Astex.Util.isIE ) {
				if (symbol.input == "'") {
					output = "\u2032";
				}
				else if (symbol.input == "''") {
					output = "\u2033";
				}
				else if (symbol.input == "'''") {
					output = "\u2033\u2032";
				}
				else if (symbol.input == "''''") {
					output = "\u2033\u2033";
				}
				else if (symbol.input == "\\square") {
					output = "\u25A1";	// same as \Box
				}
				else if (symbol.input.substr(0,5) == "\\frac") {
					// botch for missing fractions
					var denom = symbol.input.substr(6,1);
					if (denom == "5" || denom == "6") {
	  					str = symbol.input.replace(/\\frac/,"\\frac ")+str;
	  					return [node,str,symbol.tag];
					}
				}
			}
			*/
			//node = Astex.AMath.createMathMLNode ( symbol.tag , document.createTextNode(output) ) ;
			//node = Astex.AMath.createMathMLNode ( symbol.tag , document.createTextNode(symbol.output) ) ;
			//return [ node , str , symbol.tag ] ;
			//
			// if you edit this make sure to edit AMparseSexpr also
			//
			//if ( symbol.output.match ( /=/ ) ) {
			/*
			if ( symbol.input.match ( /=|eq|!=|neq/ ) ) {
				// put a space before and after =
				var mrow = Astex.AMath.createMathMLNode ( "mrow" ) ;
				var space1 = Astex.AMath.createMathMLNode ( "mspace" ) ;
				space1.setAttribute ( "width" , "2ex" ) ;
				mrow.appendChild ( space1 ) ;
				var node = Astex.AMath.createMathMLNode ( symbol.tag , document.createTextNode(symbol.output) ) ;
				mrow.appendChild ( node ) ;
				var space2 = Astex.AMath.createMathMLNode ( "mspace" ) ;
				space2.setAttribute ( "width" , "2ex" ) ;
				mrow.appendChild ( space2 ) ;
				return [ mrow , str , "row" ] ;
			}
			else {
				node = Astex.AMath.createMathMLNode ( symbol.tag , document.createTextNode(symbol.output) ) ;
				return [ node , str , symbol.tag ] ;
			}
			*/
			node = Astex.AMath.createMathMLNode ( symbol.tag , document.createTextNode(symbol.output) ) ;
			return [ node , str , symbol.tag ] ;
		case Astex.Token.LONG :
			node = Astex.AMath.createMathMLNode ( symbol.tag , document.createTextNode(symbol.output) ) ;
			node.setAttribute ( "minsize" , "1.5" ) ;
			node.setAttribute ( "maxsize" , "1.5" ) ;
			node = Astex.AMath.createMathMLNode ( "mover" , node ) ;
			node.appendChild ( Astex.AMath.createMathMLNode("mspace") ) ;
			return [ node , str , symbol.tag ] ;
		case Astex.Token.STRETCHY :
			/*
			if ( Astex.Util.isIE && symbol.input == "\\backslash" ) {
				symbol.output = "\\";	// doesn't expand, but then nor does "\u2216"
			}
			*/
			node = Astex.AMath.createMathMLNode ( symbol.tag , document.createTextNode(symbol.output) ) ;
			if ( symbol.input == "|" || symbol.input == "\\vert" || symbol.input == "\\|" || symbol.input == "\\Vert" ) {
				node.setAttribute ( "lspace" , "0em" ) ;
				node.setAttribute ( "rspace" , "0em" ) ;
			}
			node.setAttribute ( "maxsize" , symbol.atval ) ;  // don't allow to stretch here
			if ( symbol.rtag != null ) {
				return [ node , str , symbol.rtag ] ;
			}
			else {
				return [ node , str , symbol.tag ] ;
			}
		case Astex.Token.BIG :
			var atval = symbol.atval ;
			if ( Astex.Util.isIE ) { atval = symbol.ieval ; }
			//symbol = Astex.Token.getToken ( str ) ;
			symbol = Astex.Token.getToken ( Astex.Token.getMaximalTokenName(str) ) ;
			if ( symbol == null ) { return [ null , str , null ] ; }
			str = Astex.Util.removeCharsAndBlanks ( str , symbol.input.length , true ) ;
			node = Astex.AMath.createMathMLNode ( symbol.tag , document.createTextNode(symbol.output) ) ;
			if ( Astex.Util.isIE ) {		// to get brackets to expand
				var space = Astex.AMath.createMathMLNode ( "mspace" ) ;
				space.setAttribute ( "height" , atval + "ex" ) ;
				node = Astex.AMath.createMathMLNode ( "mrow" , node ) ;
				node.appendChild(space);
			}
			else {							// ignored in IE
				node.setAttribute ( "minsize" , atval ) ;
				node.setAttribute ( "maxsize" , atval ) ;
			}
			return [ node , str , symbol.tag ] ;
		case Astex.Token.LEFTBRACKET :					// read (expr+)
			if ( symbol.input == "\\left" ) { // left what?
				//symbol = Astex.Token.getToken ( str ) ;
				symbol = Astex.Token.getToken ( Astex.Token.getMaximalTokenName(str) ) ;
				if ( symbol != null ) {
					if ( symbol.input == "." ) { symbol.invisible = true ; }
					str = Astex.Util.removeCharsAndBlanks ( str , symbol.input.length , true ) ;
				}
			}
			result = Astex.AMath.LMparseExpr ( str , true , false ) ;
			if ( symbol==null || (typeof symbol.invisible == "boolean" && symbol.invisible) ) {
				node = Astex.AMath.createMathMLNode ( "mrow" , result[0] ) ;
			}
			else {
				node = Astex.AMath.createMathMLNode ( "mo" , document.createTextNode(symbol.output) ) ;
				node = Astex.AMath.createMathMLNode ( "mrow" , node ) ;
				node.appendChild ( result[0] ) ;
			}
			return [ node , result[1] , result[2] ] ;
		case Astex.Token.MATRIX :					// read (expr+)
			if ( symbol.input == "\\begin{array}" ) {
				var mask = "" ;
				//symbol = Astex.Token.getToken ( str ) ;
				symbol = Astex.Token.getToken ( Astex.Token.getMaximalTokenName(str) ) ;
				str = Astex.Util.removeCharsAndBlanks ( str , 0 , true ) ;
				if ( symbol == null ) {
					mask = "l" ;
				}
				else {
					str = Astex.Util.removeCharsAndBlanks ( str , symbol.input.length , true ) ;
					if ( symbol.input != "{" ) {
						mask = "l" ;
					}
					else {
						do {
							//symbol = Astex.Token.getToken ( str ) ;
							symbol = Astex.Token.getToken ( Astex.Token.getMaximalTokenName(str) ) ;
							if ( symbol != null ) {
							//if ( symbol != null && !symbol.input.match(/not-found/i) ) {
								str = Astex.Util.removeCharsAndBlanks ( str , symbol.input.length , true ) ;
								if ( symbol.input != "}" && symbol.input != "" ) {
									mask = mask + symbol.input ;
									//alert ( mask ) ;
								}
							}
						//} while ( symbol != null && symbol.input != "" && symbol.input != "}" ) ;
						} while ( symbol!=null && !symbol.input.match(/not-found/i) && symbol.input != "" && symbol.input != "}" ) ;
					}
				}
				//alert ( str ) ;
				result = Astex.AMath.LMparseExpr ( "{" + str , true , true ) ;
				// if (result[0]==null) return [Astex.AMath.createMathMLNode("mo", document.createTextNode(symbol.input)),str];
				node = Astex.AMath.createMathMLNode ( "mtable" , result[0] ) ;
				mask = mask.replace ( /l/g , "left " ) ;
				mask = mask.replace ( /r/g , "right " ) ;
				mask = mask.replace ( /c/g , "center " ) ;
				node.setAttribute ( "columnalign" , mask) ;
				node.setAttribute ( "displaystyle" , "false" ) ;
				//if ( Astex.Util.isIE ) {
				if ( ! Astex.useNativeMathML ) {	// important so Astex Canvas displays surrounding brackets appropriately
					return [ node , result[1] , null ] ;
				}
				// trying to get a *little* bit of space around the array
				// (IE already includes it)	// MathPlayer includes it 
				var lspace = Astex.AMath.createMathMLNode ( "mspace" ) ;
				lspace.setAttribute ( "width" , "0.167em" ) ;
				var rspace = Astex.AMath.createMathMLNode ( "mspace" ) ;
				rspace.setAttribute ( "width" , "0.167em" ) ;
				var node1 = Astex.AMath.createMathMLNode ( "mrow" , lspace ) ;
				node1.appendChild ( node ) ;
				node1.appendChild ( rspace ) ;
				return [ node1 , result[1] , null ] ;
			}
			else {							// eqnarray
				result = Astex.AMath.LMparseExpr ( "{" + str , true , true ) ;
				node = Astex.AMath.createMathMLNode ( "mtable" , result[0] ) ;
				if ( Astex.Util.isIE ) {
					node.setAttribute ( "columnspacing" , "0.25em" ) ; // best in practice?
				}
				else {
					node.setAttribute ( "columnspacing" , "0.167em" ) ; // correct (but ignored?)
				}
				node.setAttribute ( "columnalign" , "right center left" ) ;
				node.setAttribute ( "displaystyle" , "true" ) ;
				node = Astex.AMath.createMathMLNode ( "mrow" , node ) ;
				return [ node , result[1] , null ] ;
			}
		case Astex.Token.TEXT :
			if ( str.charAt(0) == "{" ) { i = str.indexOf("}") ; }
			else { i = 0 ; }
			if ( i == -1 ) { i = str.length ; }
			st = str.slice ( 1 , i ) ;
			if ( st.charAt(0) == " " ) {
				node = Astex.AMath.createMathMLNode ( "mspace" ) ;
				node.setAttribute ( "width" , "0.33em" ) ;			// was 1ex
				newFrag.appendChild ( node ) ;
			}
			newFrag.appendChild ( Astex.AMath.createMathMLNode ( symbol.tag , document.createTextNode(st) ) ) ;
			if ( st.charAt(st.length-1) == " " ) {
				node = Astex.AMath.createMathMLNode ( "mspace" ) ;
				node.setAttribute ( "width" , "0.33em" ) ;			// was 1ex
				newFrag.appendChild ( node ) ;
			}
			str = Astex.Util.removeCharsAndBlanks ( str , i+1 , true ) ;
			return [ Astex.AMath.createMathMLNode ( "mrow" , newFrag ) , str , null ] ;
		case Astex.Token.UNARY :
			result = Astex.AMath.LMparseSexpr ( str ) ;
			if ( result[0] == null ) {
				return [ Astex.AMath.createMathMLNode ( symbol.tag , document.createTextNode(symbol.output) ) , str ] ;
			}
			if ( typeof symbol.func == "boolean" && symbol.func ) {			// functions hack
				st = str.charAt ( 0 ) ;
				// if (st=="^" || st=="_" || st=="/" || st=="|" || st==",") 
				if ( st == "^" || st == "_" || st == "," ) {
					return [ Astex.AMath.createMathMLNode(symbol.tag, document.createTextNode(symbol.output)) , str , symbol.tag ] ;
				}
				else {
					node = Astex.AMath.createMathMLNode("mrow", Astex.AMath.createMathMLNode(symbol.tag,document.createTextNode(symbol.output))) ;
					if ( Astex.Util.isIE ) {
						var space = Astex.AMath.createMathMLNode ( "mspace" ) ;
						space.setAttribute ( "width" , "0.167em" ) ;
						node.appendChild ( space ) ;
					}
					node.appendChild ( result[0] ) ;
					return [ node , result[1] , symbol.tag ] ;
				}
			}
			if ( symbol.input == "\\sqrt" || symbol.input == "sqrt" || symbol.input == "hide" || symbol.input == "\\hide" ) {			// sqrt
				if ( Astex.Util.isIE ) {						// set minsize, for \surd
					//var space = Astex.AMath.createMathMLNode ( "mspace" ) ;
					//space.setAttribute ( "height" , "1.2ex" ) ;
					//space.setAttribute ( "width" , "0em" ) ;			// probably no effect
					node = Astex.AMath.createMathMLNode ( symbol.tag , result[0] ) ;
					// node.setAttribute ( "minsize" , "1" ) ;			// ignored
					// node = Astex.AMath.createMathMLNode ( "mrow" , node ) ;		// hopefully unnecessary
					//node.appendChild ( space ) ;
					return [ node , result[1] , symbol.tag] ;
				}
				else {
					return [ Astex.AMath.createMathMLNode(symbol.tag,result[0]) , result[1] , symbol.tag ] ;
				}
			}
			else if ( typeof symbol.acc == "boolean" && symbol.acc ) {			// accent
				node = Astex.AMath.createMathMLNode ( symbol.tag , result[0] ) ;
				//if ( Astex.Util.isIE ) {
				if ( Astex.AMath.useMathPlayer ) {
					if ( symbol.input == "\\hat" || symbol.input == "hat" ) {
						symbol.output = "\u0302";
					}
					else if ( symbol.input == "\\widehat" || symbol.input == "widehat" ) {
						symbol.output = "\u005E";
					}
					else if ( symbol.input == "\\bar" || symbol.input == "bar" ) {
						symbol.output = "\u00AF";
					}
					else if ( symbol.input == "\\grave" || symbol.input == "grave" ) {
						symbol.output = "\u0300";
					}
					else if ( symbol.input == "\\tilde" || symbol.input == "tilde" ) {
						symbol.output = "\u0303";
					}
					else if ( symbol.input == "\\vec" || symbol.input == "vec" ) {
						symbol.output = "\u20D7";
					}
				}
				var node1 = Astex.AMath.createMathMLNode ( "mo" , document.createTextNode(symbol.output) ) ;
				if ( symbol.input == "\\vec" || symbol.input == "vec" || symbol.input == "\\check" || symbol.input == "check" ) {
					// don't allow to stretch
					// why doesn't "1" work?  \vec nearly disappears in firefox
					node1.setAttribute ( "maxsize" , "1.2" ) ;
				}
				/*
				if ( Astex.Util.isIE && (symbol.input == "\\bar" || symbol.input == "bar") ) {
					node1.setAttribute ( "maxsize" , "0.5" ) ;
				}
				*/
				if ( symbol.input == "\\underbrace" || symbol.input == "underbrace" || symbol.input == "\\underline" || symbol.input == "underline" ) {
					node1.setAttribute ( "accentunder" , "true" ) ;
				}
				else {
					node1.setAttribute ( "accent" , "true" ) ;
				}
				node.appendChild ( node1 ) ;
				if ( symbol.input == "\\overbrace" || symbol.input == "overbrace" || symbol.input == "\\underbrace" || symbol.input == "underbrace" ) {
					node.ttype = Astex.Token.UNDEROVER ;
				}
				return [ node , result[1] , symbol.tag ] ;
			}
			else {								// font change or displaystyle command
				//if ( ! Astex.Util.isIE && typeof symbol.codes != "undefined" ) {
				if ( Astex.AMath.useNativeMathML && typeof symbol.codes != "undefined" ) {

					// need to add { } and to for loops below ...

					for ( i = 0 ;  i < result[0].childNodes.length ; i++ ) {
						if ( result[0].childNodes[i].nodeName == "mi" || result[0].nodeName == "mi" ) {
							st = ( result[0].nodeName=="mi" ? result[0].firstChild.nodeValue : result[0].childNodes[i].firstChild.nodeValue ) ;
							var newst = [] ;
							for ( var j = 0 ; j < st.length ; j++) {
								if ( st.charCodeAt(j)>64 && st.charCodeAt(j)<91 ) {
									newst = newst + String.fromCharCode(symbol.codes[st.charCodeAt(j)-65]);
								}
								else {
									newst = newst + st.charAt(j);
								}
							}
							if ( result[0].nodeName == "mi" ) {
								result[0]=Astex.AMath.createMathMLNode("mo").appendChild(document.createTextNode(newst));
							}
							else {
								result[0].replaceChild(Astex.AMath.createMathMLNode("mo").appendChild(document.createTextNode(newst)),result[0].childNodes[i]);
							}
						}
					}
				}
				node = Astex.AMath.createMathMLNode ( symbol.tag , result[0] ) ;
				node.setAttribute ( symbol.atname , symbol.atval ) ;
				if ( symbol.input == "\\scriptstyle" || symbol.input == "scriptstyle" || symbol.input == "\\scriptscriptstyle" || symbol.input == "scriptscriptstyle" ) {
					node.setAttribute ( "displaystyle" , "false" ) ;
				}
				return [ node , result[1] , symbol.tag ] ;
			}
			/*
			else {						// font change command
				node = Astex.AMath.createMathMLNode ( symbol.tag , result[0] ) ;
				node.setAttribute ( symbol.atname , symbol.atval ) ;
				return [ node , result[1] , symbol.tag ] ;
			}
			*/
		case Astex.Token.BINARY :
			if ( symbol.input == "color" || symbol.input == "\\color" ) {
				// read string and get color between { }
				//str = Astex.Util.removeCharsAndBlanks ( str , symbol.input.length , true ) ;
				str = Astex.Util.removeCharsAndBlanks ( str , 0 , true ) ;				// !!! IMPORTANT
				var ind1 = str.indexOf ( "{" , 0 ) ;	
				var ind2 = str.indexOf ( "}" , ind1 + 1 ) ;
				if ( ind1 == -1 || ind2 == - 1 ) {
					return new Astex.Warning ( "Incorrect color syntax: color{color-goes-here}" , "Astex.AMath.LMparseSexpr" ) ;
				}
				var color = str.slice ( ind1 + 1 , ind2 ) ;
				//alert ( color ) ;
				// remove {color} from string
				str = str.slice ( ind2 + 1 ) ;
				result = Astex.AMath.LMparseSexpr ( str ) ;			// LM NOT AM
				var mstyle = Astex.AMath.createMathMLNode ( symbol.tag ) ;
				mstyle.setAttribute ( "mathcolor" , color ) ;
				mstyle.appendChild ( result[0] ) ;
				return [ mstyle , result[1] , symbol.tag ] ;
			}
			result = Astex.AMath.LMparseSexpr ( str ) ;
			if ( result[0] == null ) {
				return [createMathMLNode("mo", document.createTextNode(symbol.input)) , str , null ] ; 
			}
			//Astex.AMath.removeBrackets ( result[0] ) ;				// added by MAZ
			result2 = Astex.AMath.LMparseSexpr ( result[1] ) ;
			if ( result2[0] == null ) {
				return [ Astex.AMath.createMathMLNode("mo", document.createTextNode(symbol.input)) , str , null ] ;
			}
			//Astex.AMath.removeBrackets ( result2[0] ) ;				// added by MAZ
			if ( symbol.input=="\\root" || symbol.input == "root" || symbol.input=="\\stackrel" || symbol.input == "stackrel" ) {
				newFrag.appendChild ( result2[0] ) ;
			}
			newFrag.appendChild ( result[0] ) ;
			if ( symbol.input == "\\frac" || symbol.input == "frac" ) {
				newFrag.appendChild ( result2[0] ) ;
			}
			return [ Astex.AMath.createMathMLNode(symbol.tag,newFrag) , result2[1] , symbol.tag ] ;
		case Astex.Token.INFIX :
			str = Astex.Util.removeCharsAndBlanks ( str , symbol.input.length , true ) ;
			return [ Astex.AMath.createMathMLNode("mo",document.createTextNode(symbol.output)) , str , symbol.tag ] ;
		default :
			// it's a constant
			return [ Astex.AMath.createMathMLNode ( symbol.tag, document.createTextNode(symbol.output)) , str , symbol.tag ] ;
	}	// end switch statement
};


// prototype Array[] Astex.AMath.LMparseIexpr ( String str )
// borrowed from AsciiMathML function LMparseIexpr()
// parses str and returns [node,tailstr,(node)tag]
Astex.AMath.LMparseIexpr = function ( str ) {

	var symbol, sym1, sym2, node, result, tag, underover ;
	str = Astex.Util.removeCharsAndBlanks ( str , 0 , true ) ;
	//sym1 = Astex.Token.getToken ( str ) ;
	sym1 = Astex.Token.getToken ( Astex.Token.getMaximalTokenName(str) ) ;
	result = Astex.AMath.LMparseSexpr ( str ) ;
	node = result[0] ;
	str = result[1] ;
	tag = result[2] ;
	//symbol = Astex.Token.getToken ( str ) ;
	symbol = Astex.Token.getToken ( Astex.Token.getMaximalTokenName(str) ) ;
	if ( symbol.ttype == Astex.Token.INFIX ) {
		str = Astex.Util.removeCharsAndBlanks ( str , symbol.input.length , true ) ;
		result = Astex.AMath.LMparseSexpr ( str ) ;
		//
		// do i need this if statement ??????????
		// or should i draw a token-not-found element
		//
		if ( result[0] == null ) {				// show box in place of missing argument
			result[0] = Astex.AMath.createMathMLNode ( "mo" , document.createTextNode("\u25A1") ) ;
		}
		str = result[1] ;
		tag = result[2] ;
		if ( symbol.input == "_" || symbol.input == "^" ) {
			//sym2 = Astex.Token.getToken ( str ) ;
			sym2 = Astex.Token.getToken ( Astex.Token.getMaximalTokenName(str) ) ;
			tag = null ;					// no space between x^2 and a following sin, cos, etc.
			// This is for \underbrace and \overbrace
			underover = ( (sym1.ttype == Astex.Token.UNDEROVER) || (node.ttype == Astex.Token.UNDEROVER) ) ;
			// underover = (sym1.ttype == Astex.Token.UNDEROVER) ;
			if ( symbol.input == "_" && sym2.input == "^" ) {
				str = Astex.Util.removeCharsAndBlanks ( str , sym2.input.length , true ) ;
				var res2 = Astex.AMath.LMparseSexpr ( str ) ;
				str = res2[1] ;
				tag = res2[2] ;				// leave space between x_1^2 and a following sin etc.
				node = Astex.AMath.createMathMLNode ( ( underover ? "munderover" : "msubsup" ) , node ) ;
				node.appendChild ( result[0] ) ;
				node.appendChild ( res2[0] ) ;
			}
			else if ( symbol.input == "_" ) {
				node = Astex.AMath.createMathMLNode ( ( underover ? "munder" : "msub" ) , node ) ;
				node.appendChild ( result[0] ) ;
			}
			else {
				node = Astex.AMath.createMathMLNode ( ( underover ? "mover" : "msup" ) , node ) ;
				node.appendChild ( result[0] ) ;
			}
			node = Astex.AMath.createMathMLNode ( "mrow" , node ) ;			// so sum does not stretch
		}
		else {
			node = Astex.AMath.createMathMLNode ( symbol.tag , node ) ;
			if ( symbol.input == "\\atop" || symbol.input == "atop" || symbol.input == "\\choose" || symbol.input == "choose" ) {
				node.setAttribute ( "linethickness" , "0ex" ) ;
			}
			node.appendChild ( result[0] ) ;
			if ( symbol.input == "\\choose" || symbol.input == "choose" ) {
				node = Astex.AMath.createMathMLNode ( "mfenced" , node ) ;
			}
		}
	}
	return [ node , str , tag ] ;
};


// prototype Array[] Astex.AMath.LMparseExpr ( String str , ???? rightbracket , Boolean matrix )
// borrowed from AsciiMathML function LMparseExpr()
// parses str and returns [node,tailstr,(node)tag]
Astex.AMath.LMparseExpr = function ( str , rightbracket , matrix ) {

	//alert ( matrix ) ;
	//alert ( str + "\n" + rightbracket + matrix ) ;

	var symbol, node, result, i, tag, newFrag = document.createDocumentFragment() ;
	do {
		str = Astex.Util.removeCharsAndBlanks ( str , 0 , true ) ;
		//alert ( str ) ;
		result = Astex.AMath.LMparseIexpr ( str ) ;
		node = result[0] ;
		str = result[1] ;
		tag = result[2] ;
		//symbol = Astex.Token.getToken ( str ) ;
		symbol = Astex.Token.getToken ( Astex.Token.getMaximalTokenName(str) ) ;
		//alert ( symbol.input ) ;
		if ( node != undefined ) {
			if ( (tag == "mn" || tag == "mi") && symbol != null && typeof symbol.func == "boolean" && symbol.func ) {
				// Add space before \sin in 2\sin x or x\sin x
				var space = Astex.AMath.createMathMLNode ( "mspace" ) ;
				space.setAttribute ( "width" , "0.167em" ) ;
				node = Astex.AMath.createMathMLNode ( "mrow" , node ) ;
				// remove comment for use with AsciiMathML
				//node.appendChild(space);
			}
			newFrag.appendChild ( node ) ;
		}
	//} while ( (symbol.ttype != Astex.Token.RIGHTBRACKET) && symbol != null && symbol.output != "" ) ;	// end do-while loop
	} while ( (symbol.ttype != Astex.Token.RIGHTBRACKET) && !symbol.input.match(/not-found/i) && symbol.output!="" ) ;	// end do-while loop
	//alert ( "out of loop" ) ;
	//alert ( symbol.ttype ) ;
	//alert ( matrix ) ;

	tag = null ;
	//if ( symbol.ttype == Astex.Token.RIGHTBRACKET ) {
	if ( symbol.ttype == Astex.Token.RIGHTBRACKET || symbol.ttype == Astex.Token.DEFINITION ) {
	//if ( symbol.ttype == Astex.Token.LEFTBRACKET || symbol.ttype == Astex.Token.DEFINITION ) {
		//alert ( matrix ) ;
		if ( symbol.input == "\\right" ) {					// right what?
			str = Astex.Util.removeCharsAndBlanks ( str , symbol.input.length , true ) ;
			//symbol = Astex.Token.getToken ( str ) ;
			symbol = Astex.Token.getToken ( Astex.Token.getMaximalTokenName(str) ) ;
			if ( symbol != null && symbol.input == "." ) { symbol.invisible = true ; }
			//if ( symbol != null ) { tag = symbol.rtag ; }
		}
		if ( symbol != null ) {
			str = Astex.Util.removeCharsAndBlanks ( str , symbol.input.length , true ) ;		// ready to return
		}
		var len = newFrag.childNodes.length ;
		//if ( matrix && len>0 && newFrag.childNodes[len-1].nodeName == "mrow" && len>1 && newFrag.childNodes[len-2].nodeName == "mo" && newFrag.childNodes[len-2].firstChild.nodeValue == "&" ) {									//matrix
		if ( matrix && len>0 && newFrag.childNodes[len-1].nodeName.match(/mrow/i) && len>1 && newFrag.childNodes[len-2].nodeName.match(/mo|mi|mn/i) && newFrag.childNodes[len-2].firstChild.nodeValue == "&" ) {									//matrix
			var pos = [] ;							// positions of ampersands
			var m = newFrag.childNodes.length ;
			for ( i = 0 ; matrix && i < m ; i += 2 ) {
				pos[i] = [] ;
				node = newFrag.childNodes[i] ;
				for ( var j = 0 ; j < node.childNodes.length ; j++ ) {
					if ( node.childNodes[j].firstChild.nodeValue == "&" ) {
						pos[i][ pos[i].length ] = j ;
					}
				}
			}
			var row, frag, n, k, table = document.createDocumentFragment() ;
			for ( i = 0 ; i < m ; i+=2 ) {
				row = document.createDocumentFragment() ;
				frag = document.createDocumentFragment() ;
				node = newFrag.firstChild ;				// <mrow> -&-&...&-&- </mrow>
				n = node.childNodes.length ;
				k = 0 ;
				for ( j=0 ; j < n ; j++ ) {
					if ( typeof pos[i][k] != "undefined" && j==pos[i][k] ) {
						node.removeChild ( node.firstChild ) ;			//remove &
						row.appendChild ( Astex.AMath.createMathMLNode ( "mtd" , frag ) ) ;
						k++;
					}
					else {
						frag.appendChild ( node.firstChild ) ;
					}
				}
				row.appendChild ( Astex.AMath.createMathMLNode ( "mtd" , frag ) ) ;
				if ( newFrag.childNodes.length > 2 ) {
					newFrag.removeChild ( newFrag.firstChild ) ;		//remove <mrow> </mrow>
					newFrag.removeChild ( newFrag.firstChild ) ;		//remove <mo>&</mo>
				}
				table.appendChild ( Astex.AMath.createMathMLNode ( "mtr" , row ) ) ;
			}
			return [ table , str ] ;
		}
		if ( typeof symbol.invisible != "boolean" || ! symbol.invisible ) {
			node = Astex.AMath.createMathMLNode("mo",document.createTextNode ( symbol.output ) ) ;
			newFrag.appendChild ( node ) ;
		}
	}
	return [ newFrag , str , tag ] ;
};


// prototype: String Astex.AMath.simpleLaTeXformatting ( String st )
// borrowed from AsciiMathML function simpleLaTeXformatting()
Astex.AMath.simpleLaTeXformatting = function ( st ) {

	//st = st.replace ( /\$\$((.|\n)*?)\$\$/g , "<p align=\"center\">$\\displaystyle{$1}$</p>" ) ;
	st = st.replace ( /\$\$((.|\n|\r|\f|\v)*?)\$\$/g , "<p align=\"center\">$\\displaystyle{$1}$</p>" ) ;
	//st = st.replace ( /\\begin{(theorem|lemma|proposition|corollary)}((.|\n)*?)\\end{\1}/g , function ( r , s , t ) {
	//st = st.replace ( /\\?begin{(theorem|lemma|proposition|corollary)}((.|\n|\r|\f|\v)*?)\\?end{\1}/g , function ( r , s , t ) {
	st = st.replace ( /\\begin{(theorem|lemma|proposition|corollary)}((.|\n|\r|\f|\v)*?)\\end{\1}/g , function ( r , s , t ) {
				Astex.AMath.theoremCounter++ ;
				var tmp = "" ;
				//tmp += "<b>" + s.charAt(0).toUpperCase()+s.slice(1) + " " + Astex.AMath.theoremCounter + ".</b> " ;
				//tmp += "<i>" + t.replace( /^\s*<\/?\w+\/?>|\s*<\/?\w+\/?>$/g , "" ) + "</i> " ;
				tmp += "<div class='Astex-Theorem-Div'>" + s.charAt(0).toUpperCase()+s.slice(1) + " " + Astex.AMath.theoremCounter + ".</div> " ;
				tmp += "<div class='Astex-Theorem-Content-Div'>" + t.replace( /^\s*<\/?\w+\/?>|\s*<\/?\w+\/?>$/g , "" ) + "</div> " ;
				return tmp ;
			}
	) ;
	//st = st.replace ( /\\begin{(definition|example|remark|problem|exercise|conjecture|solution)}((.|\n)*?)\\end{\1}/g , function ( r , s , t ) {
	//st = st.replace ( /\\?begin{(definition|example|remark|problem|exercise|conjecture|solution)}((.|\n|\r|\f|\v)*?)\\?end{\1}/g , function ( r , s , t ) {
	st = st.replace ( /\\begin{(definition|example|remark|problem|exercise|conjecture|solution)}((.|\n|\r|\f|\v)*?)\\end{\1}/g , function ( r , s , t ) {
				Astex.AMath.definitionCounter++ ;
				var tmp = "" ;
				//tmp += "<b>" + s.charAt(0).toUpperCase()+s.slice(1) + " " + Astex.AMath.definitionCounter + ".</b> " ;
				//tmp += t.replace( /^\s*<\/?\w+\/?>|\s*<\/?\w+\/?>$/g , "" ) ;
				tmp += "<div class='Astex-Definition-Div'>" + s.charAt(0).toUpperCase()+s.slice(1) + " " + Astex.AMath.definitionCounter + ".</div> " ;
				tmp += "<div class='Astex-Definition-Content-Div'>" + t.replace( /^\s*<\/?\w+\/?>|\s*<\/?\w+\/?>$/g , "" ) + "</div> " ;
				return tmp ;
			}
	) ;
	//st = st.replace ( /\\begin{proof}((.|\n)*?)\\end{proof}/g , function ( s , t ) {
	//st = st.replace ( /\\?begin{proof}((.|\n|\r|\f|\v)*?)\\?end{proof}/g , function ( s , t ) {
	st = st.replace ( /\\begin{proof}((.|\n|\r|\f|\v)*?)\\end{proof}/g , function ( s , t ) {
				//
				// what should i draw at end of proof ???
				//
				//return "<i>Proof:</i> " + t.replace( /^\s*<\/?\w+\/?>|\s*<\/?\w+\/?>$/g , "" ) + " &#x25A1;"
				//return "<i>Proof:</i> " + t.replace( /^\s*<\/?\w+\/?>|\s*<\/?\w+\/?>$/g , "" ) + " <b>QED</b>"
				return "<div class='Astex-Proof-Div'>Proof:</div> " + "<div class='Astex-Proof-Content-Div'>" + t.replace( /^\s*<\/?\w+\/?>|\s*<\/?\w+\/?>$/g , "" ) + "</div>" + " <div class='Astex-Proof-QED-Div'>QED</div>"
			}
	) ;
	//st = st.replace ( /\\emph{(.*?)}/g , "<em>$1</em>" ) ;
	//st = st.replace ( /\\?emph{(.*?)}/g , "<em class='Astex'>$1</em>" ) ;
	st = st.replace ( /\\emph{(.*?)}/g , "<em class='Astex'>$1</em>" ) ;
	//st = st.replace ( /\\textbf{(.*?)}/g , "<b>$1</b>" ) ;
	//st = st.replace ( /\\?textbf{(.*?)}/g , "<b class='Astex'>$1</b>" ) ;
	//st = st.replace ( /\\cite{(.*?)}/g , "[$1]" ) ;
	//st = st.replace ( /\\?cite{(.*?)}/g , "[$1]" ) ;
	st = st.replace ( /\\cite{(.*?)}/g , "[$1]" ) ;
	//st = st.replace ( /\\chapter{(.*?)}/g , "<h2>$1</h2>" ) ;
	//st = st.replace ( /\\?chapter{(.*?)}/g , "<h2 class='Astex'>$1</h2>" ) ;
	st = st.replace ( /\\chapter{(.*?)}/g , "<h2 class='Astex'>$1</h2>" ) ;
	//st = st.replace ( /\\subsection{((.|\n)*?)}/g , "<h4>$1</h4>" ) ;
	//st = st.replace ( /\\?subsection{((.|\n|\r|\f|\v)*?)}/g , "<h4 class='Astex'>$1</h4>" ) ;			// subsection should come before section
	st = st.replace ( /\\subsection{((.|\n|\r|\f|\v)*?)}/g , "<h4 class='Astex'>$1</h4>" ) ;			// subsection should come before section
	//st = st.replace ( /\\section{(.*?)}(\s*<\/?(br|p)\s?\/?>)?/g , "<h3>$1</h3>" ) ;
	//st = st.replace ( /\\?section{(.*?)}(\s*<\/?(br|p)\s?\/?>)?/g , "<h3 class='Astex'>$1</h3>" ) ;
	st = st.replace ( /\\section{(.*?)}(\s*<\/?(br|p)\s?\/?>)?/g , "<h3 class='Astex'>$1</h3>" ) ;
	//st = st.replace ( /\\begin{itemize}(\s*<\/?(br|p)\s?\/?>)?/g , "<ul>" ) ;
	//st = st.replace ( /\\?begin{itemize}(\s*<\/?(br|p)\s?\/?>)?/g , "<ul class='Astex'>" ) ;
	//st = st.replace ( /\\?begin{itemize(\[(.*)\])?}(\s*<\/?(br|p)\s?\/?>)?/g , "<ul class='Astex' style='$2'>" ) ;
	//st = st.replace ( /\\?begin{itemize(\[([^\]]*)\])?}(\s*<\/?(br|p)\s?\/?>)?/g , "<ul class='Astex' style='$2'>" ) ;
	st = st.replace ( /\\begin{itemize(\[([^\]]*)\])?}(\s*<\/?(br|p)\s?\/?>)?/g , "<ul class='Astex' style='$2'>" ) ;
	//st = st.replace ( /\\item\s((.|\n)*?)(?=(\\item|\\end))/g , "<li>$1</li>" ) ;
	//st = st.replace ( /\\?item\s((.|\n|\r|\f|\v)*?)(?=(\\?item|\\?end))/g , "<li class='Astex'>$1</li>" ) ;
	st = st.replace ( /\\item\s((.|\n|\r|\f|\v)*?)(?=(\\item|\\end))/g , "<li class='Astex'>$1</li>" ) ;
	//st = st.replace ( /\\end{itemize}(\s*<\/?(br|p)\s?\/?>)?/g , "</ul>" ) ;
	//st = st.replace ( /\\?end{itemize}(\s*<\/?(br|p)\s?\/?>)?/g , "</ul>" ) ;
	st = st.replace ( /\\end{itemize}(\s*<\/?(br|p)\s?\/?>)?/g , "</ul>" ) ;
	//st = st.replace ( /\\begin{enumerate}(\s*<\/?(br|p)\s?\/?>)?/g , "<ol>" ) ;
	//st = st.replace ( /\\?begin{enumerate}(\s*<\/?(br|p)\s?\/?>)?/g , "<ol class='Astex'>" ) ;
	//st = st.replace ( /\\?begin{enumerate(\[(.*)\])?}(\s*<\/?(br|p)\s?\/?>)?/g , "<ol class='Astex' style='$2'>" ) ;
	//st = st.replace ( /\\?begin{enumerate(\[([^\]]*)\])?}(\s*<\/?(br|p)\s?\/?>)?/g , "<ol class='Astex' style='$2'>" ) ;
	st = st.replace ( /\\begin{enumerate(\[([^\]]*)\])?}(\s*<\/?(br|p)\s?\/?>)?/g , "<ol class='Astex' style='$2'>" ) ;
	//st = st.replace ( /\\end{enumerate}(\s*<\/?(br|p)\s?\/?>)?/g , "</ol>" ) ;
	//st = st.replace ( /\\?end{enumerate}(\s*<\/?(br|p)\s?\/?>)?/g , "</ol>" ) ;
	st = st.replace ( /\\end{enumerate}(\s*<\/?(br|p)\s?\/?>)?/g , "</ol>" ) ;
	//st = st.replace ( /\\item\[(.*?)]{(.*?)}/g , "<dt>$1</dt><dd>$2</dd>" ) ;
	//st = st.replace ( /\\?item\[(.*?)]{(.*?)}/g , "<dt class='Astex'>$1</dt><dd class='Astex'>$2</dd>" ) ;
	st = st.replace ( /\\item\[(.*?)]{(.*?)}/g , "<dt class='Astex'>$1</dt><dd class='Astex'>$2</dd>" ) ;
	//st = st.replace ( /\\begin{description}/g , "<dl>" ) ;
	//st = st.replace ( /\\?begin{description}/g , "<dl class='Astex'>" ) ;
	st = st.replace ( /\\begin{description}/g , "<dl class='Astex'>" ) ;
	//st = st.replace ( /\\end{description}/g , "</dl>" ) ;
	//st = st.replace ( /\\?end{description}/g , "</dl>" ) ;
	st = st.replace ( /\\end{description}/g , "</dl>" ) ;
	//st = st.replace ( /\\newline\b/g , "<br/>" ) ;
	//st = st.replace ( /\\?newline\b/g , "<br />" ) ;
	//st = st.replace ( /\\?newline\b/g , "<br class='Astex-Newline-Br' />" ) ;
	st = st.replace ( /\\newline\b/g , "<br class='Astex-Newline-Br' />" ) ;
	//st = st.replace ( /\\newpage\b/g , "<br style=\"page-break-after:always;\">" ) ;
	//st = st.replace ( /\\?newpage\b/g , "<br style=\"page-break-after:always;\" />" ) ;
	//st = st.replace ( /\\?newpage\b/g , "<br class='Astex-Newpage-Br' />" ) ;
	st = st.replace ( /\\newpage\b/g , "<br class='Astex-Newpage-Br' />" ) ;
	//st = st.replace ( /\\par\b/g , "<p>&nbsp;</p>" ) ;
	//st = st.replace ( /\\?par\b/g , "<p class='Astex-Paragraph-P'>&nbsp;</p>" ) ;
	st = st.replace ( /\\par\b/g , "<p class='Astex-Paragraph-P'>&nbsp;</p>" ) ;
	//st = st.replace ( /\\bigskip/g , "<p style=\"margin-bottom:0.5in\">&nbsp;</p>" ) ;
	//st = st.replace ( /\\?bigskip/g , "<p style=\"margin-bottom:0.5in\">&nbsp;</p>" ) ;
	//st = st.replace ( /\\?bigskip/g , "<p class='Astex-Big-Skip-P'>&nbsp;</p>" ) ;
	st = st.replace ( /\\bigskip/g , "<p class='Astex-Big-Skip-P'>&nbsp;</p>" ) ;
	//st = st.replace ( /\\medskip/g , "<p style=\"margin-bottom:0.3in\">&nbsp;</p>" ) ;
	//st = st.replace ( /\\?medskip/g , "<p style=\"margin-bottom:0.3in\">&nbsp;</p>" ) ;
	//st = st.replace ( /\\?medskip/g , "<p class='Astex-Med-Skip-P'>&nbsp;</p>" ) ;
	st = st.replace ( /\\medskip/g , "<p class='Astex-Med-Skip-P'>&nbsp;</p>" ) ;
	//st = st.replace ( /\\smallskip/g , "<p style=\"margin-bottom:0.15in\">&nbsp;</p>" ) ;
	//st = st.replace ( /\\?smallskip/g , "<p style=\"margin-bottom:0.15in\">&nbsp;</p>" ) ;
	//st = st.replace ( /\\?smallskip/g , "<p class='Astex-Small-Skip-P'>&nbsp;</p>" ) ;
	st = st.replace ( /\\smallskip/g , "<p class='Astex-Small-Skip-P'>&nbsp;</p>" ) ;
	//st = st.replace ( /\\begin{center}((.|\n)*?)\\end{center}/g , "<center>$1</center>" ) ;
	st = st.replace ( /\\?begin{center}((.|\n|\r|\f|\v)*?)\\?end{center}/g , "<center class='Astex'>$1</center>" ) ;

	st = st.replace ( /\\tab\b/g , "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" ) ;

	st = st.replace ( /\\begin{emph}((.|\n|\r|\f|\v)*?)\\end{emph}/g , "<em class='Astex'>$1</em>" ) ;
	st = st.replace ( /\\begin{bold}((.|\n|\r|\f|\v)*?)\\end{bold}/g , "<b class='Astex'>$1</b>" ) ;
	st = st.replace ( /\\begin{italics?}((.|\n|\r|\f|\v)*?)\\end{italics?}/g , "<i class='Astex'>$1</i>" ) ;
	st = st.replace ( /\\begin{underline}((.|\n|\r|\f|\v)*?)\\end{underline}/g , "<u class='Astex'>$1</u>" ) ;
	st = st.replace ( /\\begin{pre}((.|\n|\r|\f|\v)*?)\\end{pre}/g , "<pre class='Astex'>$1</pre>" ) ;
	st = st.replace ( /\\begin{monospace}((.|\n|\r|\f|\v)*?)\\end{monospace}/g , "<tt class='Astex'>$1</tt>" ) ;

	// tables
	// the class attribute is attached only to table element
	// the css file will test if caption, tr, td, etc. are children of this type of table
	// note that user can specify an override css string inside [ ] in many of the begin{} statements
	//if ( ! Astex.Util.isIE ) {

	// ie would not accept \[(.*)\] so we changed it to \[([^\]])*\] (zero or more non])

	/*
	st = st.replace ( /\\?begin{table(\[([^\]]*)\])?}/g , "<table class='Astex' style='$2'>" ) ;
	st = st.replace ( /\\?end{table}/g , "</table>" ) ;

	st = st.replace ( /\\?begin{caption(\[([^\]]*)\])?}/g , "<caption style='$2'>" ) ;
	st = st.replace ( /\\?end{caption}/g , "</caption>" ) ;

	st = st.replace ( /\\?begin{tbody(\[([^\]]*)\])?}/g , "<tbody style='$2'>" ) ;
	st = st.replace ( /\\?end{tbody}/g , "</tbody>" ) ;

	st = st.replace ( /\\?begin{thead(\[([^\]]*)\])?}/g , "<thead style='$2'>" ) ;
	st = st.replace ( /\\?end{thead}/g , "</thead>" ) ;

	st = st.replace ( /\\?begin{tfoot(\[([^\]]*)\])?}/g , "<tfoot style='$2'>" ) ;
	st = st.replace ( /\\?end{tfoot}/g , "</tfoot>" ) ;

	st = st.replace ( /\\?begin{colgroup(\[([^\]]*)\])?}/g , "<colgroup style='$2'>" ) ;
	st = st.replace ( /\\?end{colgroup}/g , "</colgroup>" ) ;

	st = st.replace ( /\\?begin{col(\[([^\]]*)\])?}\\?end{col}/g , "<col style='$2' />" ) ;

	st = st.replace ( /\\?begin{row(\[([^\]]*)\])?}/g , "<tr style='$2'>" ) ;
	st = st.replace ( /\\?end{row}/g , "</tr>" ) ;

	st = st.replace ( /\\?begin{header(\[([^\]]*)\])?}/g , "<th style='$2'>" ) ;
	st = st.replace ( /\\?end{header}/g , "</th>" ) ;

	st = st.replace ( /\\?begin{column(\[([^\]]*)\])?}/g , "<td style='$2'>" ) ;
	st = st.replace ( /\\?end{column}/g , "</td>" ) ;

	st = st.replace ( /\\?begin{footer(\[([^\]]*)\])?}/g , "<td style='$2'>" ) ;
	st = st.replace ( /\\?end{footer}/g , "</td>" ) ;
	*/

	return st ;
};

// prototype: String Astex.AMath.ASCIIandgraphformatting ( String st )
// borrowed from AsciiMathML function ASCIIandgraphformatting()
Astex.AMath.ASCIIandgraphformatting = function ( st ) {

	st = st.replace ( /<sup>(.*?)<\/sup>(\s|(\S))/gi , "^{$1} $3" ) ;
	// st = st.replace ( /<\/?font.*?>/gi , "" ) ;				// do this only in amath...endamath
	st = st.replace ( /(Proof:)/g , "<i>$1</i>" ) ;
	//st = st.replace ( /QED/g , "&nbsp; &nbsp; &#x25A1;" ) ;			// ???????????
	st = st.replace ( /(\\?end{?a?math}?)/ig , "<span></span>$1" ) ;
	//st = st.replace ( /(\bamath\b|\\begin{a?math})/ig , "<span></span>$1" ) ;
	st = st.replace ( /(\bamath\b|\\?begin{a?math})/ig , "<span></span>$1" ) ;
	st = st.replace ( /([>\n])(Theorem|Lemma|Proposition|Corollary|Definition|Example|Remark|Problem|Exercise|Conjecture|Solution)(:|\W\W?(\w|\s|-|\.)*?\W?:)/g , "$1<b>$2$3</b>" ) ;

 	st = st.replace ( /insertASCIIMathCalculator/g , "<div class=\"ASCIIMathCalculator\"></div>" ) ;
	// alert(Astex.AMath.dsvglocation)
	return st ;
};

// prototype: void Astex.AMath.LMprocessNode ( Node n )
// borrowed from AsciiMathML function LMprocessNode()
Astex.AMath.LMprocessNode = function ( n ) {

	var frag , st ;
	try {
		st = n.innerHTML ;
	}
	catch ( err ) {
	}
	var am = /amath\b|graph/i.test(st) ;
	//if ( (st==null || st.indexOf("\$ ")!=-1 || st.indexOf("\$<")!=-1 || st.indexOf("\\begin")!=-1 || am || st.slice(-1)=="$" || st.indexOf("\$\n")!=-1)&& !/edit-content|HTMLArea|wikiedit|wpTextbox1/.test(st) ) {
	if ( (st==null || st.indexOf("\$ ")!=-1 || st.indexOf("\$<")!=-1 || st.indexOf("\\begin")!=-1 || st.indexOf("begin")!=-1 || am || st.slice(-1)=="$" || st.indexOf("\$\n")!=-1)&& !/edit-content|HTMLArea|wikiedit|wpTextbox1/.test(st) ) {
		if ( ! Astex.AMath.avoidinnerHTML && Astex.AMath.translateLaTeXformatting ) {
			st = Astex.AMath.simpleLaTeXformatting ( st ) ;
		}
		if ( st != null && am && ! Astex.AMath.avoidinnerHTML ) {
			st = Astex.AMath.ASCIIandgraphformatting ( st ) ;
		}
		st = st.replace ( /%7E/g , "~" ) ;					// else PmWiki has url issues
		// alert ( st )
		if ( ! Astex.AMath.avoidinnerHTML ) { n.innerHTML = st ; }

		Astex.AMath.processNodeR ( n , false , true ) ;

	}
	/*
	if (Astex.Util.isIE) {								//needed to match size and font of formula to surrounding text
		frag = document.getElementsByTagName ( 'math' ) ;
		for ( var i = 0 ; i < frag.length ; i++ ) { frag[i].update() ; }	// is this really needed?
	}
	*/
};


/*--------------------------------------------------------------------------*/

//
// methods for processing Plugin-DataDivs
//

// prototype: void Astex.AMath.processAsciiLatexMarkup ( HTMLElement node )
Astex.AMath.processAsciiLatexMarkup = function ( node ) {

	if ( ! node ) { node = document.body ; }

	Astex.AMath.translated = false ;
	//Astex.AMath.addNumericTokensForSubSup ( node ) ;
	Astex.AMath.addNumericTokens ( node ) ;

	// translate the Ascii Math markup into MathML
	Astex.AMath.translate ( null , node ) ;

	// process all MathML nodes
	Astex.MathML.processMathML ( node ) ;
};

// prototype: void Astex.AMath.processMathPluginMarkup ( HTMLElement node , String delimiter )
Astex.AMath.processMathPluginMarkup = function ( node , delimiter ) {

	if ( ! node ) { node = document.body ; }
	if ( ! delimiter ) { delimiter = "`" ; }	// delimiter is ` or $

	var classStr = "" ;
	if ( delimiter == "`" ) {
		classStr = "AstexAMath" ;
	}
	else if ( delimiter == "$" ) {
		classStr = "AstexLMath" ;
	}

	// get divs
	var maths = Astex.Util.getElementsByClass ( node , "div" , classStr ) ;
	for ( var i = 0 ; i < maths.length ; i++ ) {

		/*
		var script = maths[i].getAttribute ( "script" ) ;
		script = Astex.Plugin.unescapeScript ( script ) ;
		script = Astex.Plugin.removeComments ( script ) ;
		*/

		// get data div contents
		var script = Astex.Plugin.getDataDivContentById ( maths[i].getAttribute("id") ) ;
		script = Astex.Plugin.unescapeScript ( script ) ;
		script = Astex.Plugin.removeComments ( script ) ;

		script = script.replace ( /\s*$/ , "" ) ;		// remove whitespace at end
		script = script.replace ( /^\s*/ , "" ) ;		// remove whitespace at beginning 

		maths[i].style.display = "inline" ;

		maths[i].innerHTML = delimiter + script + delimiter ;	// make it `script` or $script$
		//maths[i].setAttribute ( "alt" , "`" + script + "`" ) ;

		Astex.AMath.translated = false ;
		//Astex.AMath.addNumericTokensForSubSup ( maths[i] ) ;
		Astex.AMath.addNumericTokens ( maths[i] ) ;

		Astex.Symbol.SymbolNames.sort ( ) ;
		Astex.Token.TokenNames.sort ( ) ;

		// if the user has defined Astex.User.setup as a function, execute it
		if ( Astex.User.setup != null && typeof Astex.User.setup == "function" ) {

			Astex.User.setup ( ) ;

			// re-sort the symbol and token names in case user has added some
			Astex.Symbol.SymbolNames.sort ( ) ;
			Astex.Token.TokenNames.sort ( ) ;
		}

		// translate the Ascii Math markup into MathML
		Astex.AMath.translate ( null , maths[i] ) ;

		// process all MathML nodes
		Astex.MathML.processMathML ( maths[i] ) ;
	}

};

// prototype: void Astex.AMath.processAMathPluginMarkup ( HTMLElement node )
// used to process ascii mathml markup
// uses the ` ... ` parser
Astex.AMath.processAMathPluginMarkup = function ( node ) {
	Astex.AMath.processMathPluginMarkup ( node , "`" ) ;
};

// prototype: void Astex.AMath.processLMathPluginMarkup ( HTMLElement node )
// used to process latex mathml markup
// uses the $ ... $ parser
Astex.AMath.processLMathPluginMarkup = function ( node ) {
	Astex.AMath.processMathPluginMarkup ( node , "$" ) ;
};

/*--------------------------------------------------------------------------*/

