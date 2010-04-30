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

// prototype: new Astex.Token ( String input , String tag , String rtag , String output , String description , String category , Int ttype , Boolean invisible , String atname , String atval , String ieval , Boolean func , Boolean acc , Array codes ) 
Astex.Token = function ( input , tag , rtag , output , description , category , ttype , invisible , atname , atval , ieval , func , acc , codes ) {

	this.input = input ;
	this.tag = tag ;
	this.rtag = rtag ;
	this.output = output ;
	this.description = description ;
	this.category = category ;
	this.ttype = ttype ;								// token type
	this.invisible = invisible ;
	this.atname = atname ;
	this.atval = atval ;
	this.ieval = ieval ;
	this.func = func ;								// function
	this.acc = acc ;								// accent
	this.codes = codes ;								// for font change commands

	return this ;
};

//
// Astex.Token class variables
//

Astex.Token.Tokens = new Array ( ) ;
Astex.Token.TokenNames = new Array ( ) ;	// really token inputs

// token types
Astex.Token.CONST        =  0 ;
Astex.Token.UNARY        =  1 ;
Astex.Token.BINARY       =  2 ;
Astex.Token.INFIX        =  3 ;
Astex.Token.LEFTBRACKET  =  4 ;
Astex.Token.RIGHTBRACKET =  5 ;
Astex.Token.SPACE        =  6 ;
Astex.Token.UNDEROVER    =  7 ;
Astex.Token.DEFINITION   =  8 ;
Astex.Token.LEFTRIGHT    =  9 ;
Astex.Token.TEXT         = 10 ;
Astex.Token.LONG         = 11 ;
Astex.Token.STRETCHY     = 12 ;
Astex.Token.BIG          = 13 ;
Astex.Token.MATRIX       = 14 ;

// categories
Astex.Token.WHITESPACE      = 15 ;
Astex.Token.DIGIT           = 16 ;
Astex.Token.ENGLISH         = 17 ;
Astex.Token.GREEK           = 18 ;
Astex.Token.QWERTY          = 19 ;
Astex.Token.GROUPINGBRACKET = 20 ;
Astex.Token.BINARYOPERATOR  = 21 ;
Astex.Token.BINARYRELATION  = 22 ;
Astex.Token.LOGICALOPERATOR = 23 ;
Astex.Token.MISC            = 24 ;
Astex.Token.STDFUNCTION     = 25 ;
Astex.Token.ARROW           = 26 ;
Astex.Token.AUTO            = 27 ;	// automatically created tokens (see Astex.AMath.addNumericTokens() )
Astex.Token.COMMANDWITHARGS = 28 ;
Astex.Token.TYPESTYLE       = 29 ;
Astex.Token.FONTCHANGE      = 30 ;
Astex.Token.ACCENT          = 31 ;	// diacritical marks



//
// Astex.Token instance methods
//
// none so far


//
// Astex.Token class methods
//

// prototype: void Astex.Token.addToken ( Object obj )
// the argument is an Object with appropriate attributes
// this allows a more human readable way to add tokens later
Astex.Token.addToken = function ( obj ) {

	var token = new Astex.Token ( obj.input , obj.tag , obj.rtag , obj.output , obj.description , obj.category , obj.ttype , obj.invisible , obj.atname , obj.atval , obj.ieval , obj.func , obj.acc , obj.codes ) ;

	Astex.Token.Tokens.push ( token ) ;
	Astex.Token.TokenNames.push ( obj.input ) ;

};

// prototype: Astex.Token Astex.Token.getToken ( String input )
Astex.Token.getToken = function ( input ) {

	if ( ! input || input == "" ) {
		return Astex.Token.getToken ( "token-not-found" ) ;
	}

	var tokens = Astex.Token.Tokens ;
	for ( var i = 0 ; i < tokens.length ; i++ ) {
		var token = tokens[i] ;
		if ( input == token.input ) {
			return token ;
		}
	}
	//new Astex.Error ( "Token not found for input :" + input , "Astex.Token.getToken()" ) ;
	return Astex.Token.getToken ( "token-not-found" ) ;
};

// prototype: Astex.Token Astex.Token.getTokenByOutputAndTag ( String output , String tag )
Astex.Token.getTokenByOutputAndTag = function ( output , tag ) {

	if ( !output || output == "" || !tag || tag == "" ) {
		return Astex.Token.getToken ( "token-not-found" ) ;
	}

	var tokens = Astex.Token.Tokens ;
	for ( var i = 0 ; i < tokens.length ; i++ ) {
		var token = tokens[i] ;
		if ( output == token.output && tag == token.tag ) {
			return token ;
		}
	}
	//new Astex.Error ( "Token not found for input :" + input , "Astex.Token.getToken()" ) ;
	return Astex.Token.getToken ( "token-not-found" ) ;
};

// prototype: String Astex.Token.getMaximalTokenName ( String str )
// return maximal initial substring of str that appears in names
// returns null if there is none
// calls Astex.Util.getMaximalSubstringInArray() which assumes the array argument is sorted
Astex.Token.getMaximalTokenName = function ( str ) {
	return Astex.Util.getMaximalSubstringInArray ( str , Astex.Token.TokenNames ) ;
};


/*--------------------------------------------------------------------------*/

// prototype: void Astex.Token.processTokens ( HTMLElement node )
// process Plugin-DataDivs
Astex.Token.processTokens = function ( node ) {

	if ( ! node ) { node = document.body ; }

	// get divs
	var tokens = Astex.Util.getElementsByClass ( node , "div" , "AstexTokens" ) ;
	for ( var i = 0 ; i < tokens.length ; i++ ) {

		// get data div contents
		var script = Astex.Plugin.getDataDivContentById ( tokens[i].getAttribute("id") ) ;
		script = Astex.Plugin.unescapeScript ( script ) ;
		script = Astex.Plugin.removeComments ( script ) ;

		script = script.replace ( /^\s*/ , "" ) ;
		script = script.replace ( /\s*$/ , "" ) ;
		//script = script.toUpperCase ( ) ;

		var cat = "" ;
		if ( script.match(/white\s*space/gi) ) { cat = Astex.Token.WHITESPACE ; }
		else if ( script.match(/digits?/gi) ) { cat = Astex.Token.DIGIT ; }
		else if ( script.match(/english/gi) ) { cat = Astex.Token.ENGLISH ; }
		else if ( script.match(/greek/gi) ) { cat = Astex.Token.GREEK ; }
		else if ( script.match(/qwerty/gi) ) { cat = Astex.Token.QWERTY ; }
		else if ( script.match(/grouping\s*brackets?/gi) ) { cat = Astex.Token.GROUPINGBRACKET ; }
		else if ( script.match(/binary\s*operators?/gi) ) { cat = Astex.Token.BINARYOPERATOR ; }
		else if ( script.match(/binary\s*relations?/gi) ) { cat = Astex.Token.BINARYRELATION ; }
		else if ( script.match(/logical\s*operators?/gi) ) { cat = Astex.Token.LOGICALOPERATOR ; }
		else if ( script.match(/misc/gi) ) { cat = Astex.Token.MISC ; }
		else if ( script.match(/std\s*functions?/gi) ) { cat = Astex.Token.STDFUNCTION ; }
		else if ( script.match(/arrows?/gi) ) { cat = Astex.Token.ARROW ; }
		else if ( script.match(/auto/gi) ) { cat = Astex.Token.AUTO ; }
		else if ( script.match(/commands?/gi) ) { cat = Astex.Token.COMMANDWITHARGS ; }		// takes args
		else if ( script.match(/type\s*style/gi) ) { cat = Astex.Token.TYPESTYLE ; }		// takes args 
		else if ( script.match(/font\s*change/gi) ) { cat = Astex.Token.FONTCHANGE ; }		// takes args
		else if ( script.match(/accent/gi) ) { cat = Astex.Token.ACCENT ; }			// takes args

		tokens[i].style.display = "block" ;
		var str = "<table class=\"Astex\" style=\"border:0;\">" ;

		var tks = Astex.Token.Tokens ;
		switch ( cat ) {

			case Astex.Token.DIGIT :
			case Astex.Token.ENGLISH :
			case Astex.Token.GREEK :
			case Astex.Token.QWERTY :
			case Astex.Token.BINARYOPERATOR :
			case Astex.Token.BINARYRELATION :
			case Astex.Token.LOGICALOPERATOR :
			case Astex.Token.MISC :
			case Astex.Token.ARROW :
			//case Astex.Token.AUTO :
				str += "<thead>" ;
				str += "<tr><th>\\`input\\`</th><th>output</th><th>\\$input\\$</th><th>output</th><tr>" ;
				str += "</thead>" ;
				str += "<tbody>" ;
				for ( var t = 0 ; t < tks.length ; t++ ) {
					if ( tks[t].category == cat ) {
						str += "<tr><td>" + tks[t].input + "</td><td>`" + tks[t].input + "`</td><td>" + tks[t].input + "</td><td>$" + tks[t].input + "$</td></tr>" ;
					}
				}
				break ;

			case Astex.Token.WHITESPACE :
				str += "<thead>" ;
				str += "<tr><th>\\`input\\` or \\$input\\$</th><th>description</th><tr>" ;
				str += "</thead>" ;
				str += "<tbody>" ;
				for ( var t = 0 ; t < tks.length ; t++ ) {
					if ( tks[t].category == cat ) {
						str += "<tr><td>" + tks[t].input + "</td><td>" + tks[t].description + "</td></tr>" ;
					}
				}

				break ;

			case Astex.Token.STDFUNCTION :
				// many tokens have a func=true attribute, which means they expect some argument
				// we add in an invisible argument with {::} into the output columns
				str += "<thead>" ;
				str += "<tr><th>\\`input\\`</th><th>output</th><th>\\$input\\$</th><th>output</th><tr>" ;
				str += "</thead>" ;
				str += "<tbody>" ;
				for ( var t = 0 ; t < tks.length ; t++ ) {
					if ( tks[t].category == cat ) {
						str += "<tr><td>" + tks[t].input + "</td><td>`" + tks[t].input + "{::}`</td><td>" + tks[t].input + "</td><td>$" + tks[t].input + "{::}$</td></tr>" ;
					}
				}
				break ;

			case Astex.Token.GROUPINGBRACKET :
				str += "<thead>" ;
				str += "<tr><th>\\`input\\`</th><th>output</th><th>\\$input\\$</th><th>output</th><tr>" ;
				str += "</thead>" ;
				str += "<tbody>" ;
				for ( var t = 0 ; t < tks.length ; t++ ) {
					if ( tks[t].category != cat ) { continue ; }
					if ( tks[t].input == "\\left" || tks[t].input == "\\right" ) {
						/* empty body */
					}
					else if ( tks[t].ttype == Astex.Token.LEFTBRACKET ) {
						str += "<tr><td>" + tks[t].input + "</td><td>`" + tks[t].input + " quad :}" + "`</td><td>" + tks[t].input + "</td><td>$" + tks[t].input + " quad :}" + "$</td></tr>" ;
					}
					else if ( tks[t].ttype == Astex.Token.RIGHTBRACKET ) {
						str += "<tr><td>" + tks[t].input + "</td><td>`" + "{: quad " + tks[t].input + "`</td><td>" + tks[t].input + "</td><td>$" + "{: quad " + tks[t].input + "$</td></tr>" ;
					}
					else if ( tks[t].ttype == Astex.Token.LEFTRIGHT ) {
						str += "<tr><td>" + tks[t].input + "</td><td>`" + tks[t].input + "`</td><td>" + tks[t].input + "</td><td>$" + tks[t].input + "$</td></tr>" ;
					}
				}

				break ;

			case Astex.Token.COMMANDWITHARGS :

				str += "<thead>" ;
				str += "<tr><th>description</th><th>\\`input\\`</th><th>output</th><th>\\$input\\$</th><th>output</th><tr>" ;
				str += "</thead>" ;
				str += "<tbody>" ;
				for ( var t = 0 ; t < tks.length ; t++ ) {
					if ( tks[t].category != cat ) { continue ; }
					if ( tks[t].ttype == Astex.Token.UNARY ) {
						if ( tks[t].input.match(/hide/) ) {
							str += "<tr><td>" + tks[t].description + "</td><td>y " + tks[t].input + "{x+1} z</td><td>`y " + tks[t].input + "{x+1} z`</td><td>y " + tks[t].input + "{x+1} z</td><td>$y " + tks[t].input + "{x+1} z$</td></tr>" ;
						}
						else {
							str += "<tr><td>" + tks[t].description + "</td><td>" + tks[t].input + "{x+1}</td><td>`" + tks[t].input + "{x+1}`</td><td>" + tks[t].input + "{x+1}</td><td>$" + tks[t].input + "{x+1}$</td></tr>" ;
						}
					}
					else if ( tks[t].ttype == Astex.Token.BINARY ) {
						if ( tks[t].input.match(/color/) ) {
							str += "<tr><td>" + tks[t].description + "</td><td>y " + tks[t].input + "{red}{(x+1)} z</td><td>`y " + tks[t].input + "{red}{(x+1)} z`</td><td>y " + tks[t].input + "{red}{(x+1)} z</td><td>$y " + tks[t].input + "{red}{(x+1)} z$</td></tr>" ;
						}
						else if ( tks[t].input.match(/root/) ) {
							str += "<tr><td>" + tks[t].description + "</td><td>" + tks[t].input + "{3}{x+1}</td><td>`" + tks[t].input + "{3}{x+1}`</td><td>" + tks[t].input + "{3}{x+1}</td><td>$" + tks[t].input + "{3}{x+1}$</td></tr>" ;
						}
						else {
							str += "<tr><td>" + tks[t].description + "</td><td>" + tks[t].input + "{3}{x}</td><td>`" + tks[t].input + "{3}{x}`</td><td>" + tks[t].input + "{3}{x}</td><td>$" + tks[t].input + "{3}{x}$</td></tr>" ;
						}
					}
					else if ( tks[t].ttype == Astex.Token.INFIX ) {
						if ( tks[t].input.match(/\/|atop|choose/) ) {
							str += "<tr><td>" + tks[t].description + "</td><td>5 " + tks[t].input + " 3</td><td>`5 " + tks[t].input + " 3`</td><td>5 " + tks[t].input + " 3</td><td>$5 " + tks[t].input + " 3$</td></tr>" ;
						}
						else if ( tks[t].input.match(/\^|_/) ) {
							str += "<tr><td>" + tks[t].description + "</td><td>5 " + tks[t].input + " 3</td><td>`5 " + tks[t].input + " 3`</td><td>5 " + tks[t].input + " 3</td><td>$5 " + tks[t].input + " 3$</td></tr>" ;
						}
					}
					else if ( tks[t].ttype == Astex.Token.TEXT ) {
							str += "<tr><td>" + tks[t].description + "</td><td>" + tks[t].input + "{beta}</td><td>`" + tks[t].input + "{beta}`</td><td>" + tks[t].input + "{beta}</td><td>$" + tks[t].input + "{beta}$</td></tr>" ;
					}
				}
				break ;

			case Astex.Token.TYPESTYLE :
			case Astex.Token.FONTCHANGE :

				str += "<thead>" ;
				str += "<tr><th>description</th><th>\\`input\\` or \\$input\\$</th><th>output</th><tr>" ;
				str += "</thead>" ;
				str += "<tbody>" ;
				for ( var t = 0 ; t < tks.length ; t++ ) {
					if ( tks[t].category == cat ) {
						str += "<tr><td>" + tks[t].description + "</td><td>" + tks[t].input + "{AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz}</td><td>`" + tks[t].input + "{AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz}`</td></tr>" ;
					}
				}
				break ;

			case Astex.Token.ACCENT :
				str += "<thead>" ;
				str += "<tr><th>\\`input\\`</th><th>output</th><th>\\$input\\$</th><th>output</th><tr>" ;
				str += "</thead>" ;
				str += "<tbody>" ;
				for ( var t = 0 ; t < tks.length ; t++ ) {
					if ( tks[t].category == cat ) {
						str += "<tr><td>" + tks[t].input + "{x}</td><td>`" + tks[t].input + "{x}`</td><td>" + tks[t].input + "{x}</td><td>$" + tks[t].input + "{x}$</td></tr>" ;
					}
				}
				break ;

			default :

		}

		str += "</tbody>" ;
		str += "</table>" ;

		tokens[i].innerHTML = str ;

		//Astex.process ( tokens[i] ) ;
	}
};

/*--------------------------------------------------------------------------*/

// add tokens to the Astex.Token.Tokens array
//
// Tokens needed......
//
// rectangular box to display when a token name is not found
// digits 0-9
// english alphabet (lower/upper-case)
// greek alphabet (lower/upper-case) (some greek letters are the same as some english letters)
// punctuation (all tokens on qwerty keyboard)
// math tokens ( AsciiMathML and Tex tokens )
//
//
//

// character lists for Mozilla/Netscape fonts
Astex.Token.AMcal = [0xEF35,0x212C,0xEF36,0xEF37,0x2130,0x2131,0xEF38,0x210B,0x2110,0xEF39,0xEF3A,0x2112,0x2133,0xEF3B,0xEF3C,0xEF3D,0xEF3E,0x211B,0xEF3F,0xEF40,0xEF41,0xEF42,0xEF43,0xEF44,0xEF45,0xEF46];

Astex.Token.AMfrk = [0xEF5D,0xEF5E,0x212D,0xEF5F,0xEF60,0xEF61,0xEF62,0x210C,0x2111,0xEF63,0xEF64,0xEF65,0xEF66,0xEF67,0xEF68,0xEF69,0xEF6A,0x211C,0xEF6B,0xEF6C,0xEF6D,0xEF6E,0xEF6F,0xEF70,0xEF71,0x2128];

Astex.Token.AMbbb = [0xEF8C,0xEF8D,0x2102,0xEF8E,0xEF8F,0xEF90,0xEF91,0x210D,0xEF92,0xEF93,0xEF94,0xEF95,0xEF96,0x2115,0xEF97,0x2119,0x211A,0x211D,0xEF98,0xEF99,0xEF9A,0xEF9B,0xEF9C,0xEF9D,0xEF9E,0x2124];

//Astex.Token.AMquote = {input:"\"",   tag:"mtext", output:"mbox", ttype:Astex.Token.TEXT};
//Astex.Token.addToken(Astex.Token.AMquote);

// token-not-found
Astex.Token.addToken({input:"token-not-found", tag:"mi", output:"\u25A1", description:"not-found", ttype:Astex.Token.CONST});

// spaces and tabs
Astex.Token.addToken({input:"space", tag:"mo", output:"\u00A0", description:"space", ttype:Astex.Token.CONST , category:Astex.Token.WHITESPACE});
Astex.Token.addToken({input:"\\space", tag:"mo", output:"\u00A0", description:"space", ttype:Astex.Token.CONST , category:Astex.Token.WHITESPACE});
Astex.Token.addToken({input:"quad", tag:"mo", output:"\u00A0\u00A0", description:"2 spaces", ttype:Astex.Token.CONST , category:Astex.Token.WHITESPACE});
Astex.Token.addToken({input:"\\quad", tag:"mo", output:"\u00A0\u00A0", description:"2 spaces", ttype:Astex.Token.CONST , category:Astex.Token.WHITESPACE});
Astex.Token.addToken({input:"qquad", tag:"mo", output:"\u00A0\u00A0\u00A0\u00A0", description:"4 spaces", ttype:Astex.Token.CONST , category:Astex.Token.WHITESPACE});
Astex.Token.addToken({input:"\\qquad", tag:"mo", output:"\u00A0\u00A0\u00A0\u00A0", description:"4 spaces", ttype:Astex.Token.CONST , category:Astex.Token.WHITESPACE});
//Astex.Token.addToken({input:"tab", tag:"mo", output:"\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0", description:"6 spaces", ttype:Astex.Token.CONST , category:Astex.Token.WHITESPACE});
//Astex.Token.addToken({input:"\\tab", tag:"mo", output:"\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0", description:"6 spaces", ttype:Astex.Token.CONST , category:Astex.Token.WHITESPACE});
//Astex.Token.addToken({input:"\\t", tag:"mo", output:"\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0", description:"6 spaces", ttype:Astex.Token.CONST , category:Astex.Token.WHITESPACE});

// digits
Astex.Token.addToken({input:"0", tag:"mn", output:"0", description:"0", ttype:Astex.Token.CONST , category:Astex.Token.DIGIT});
Astex.Token.addToken({input:"1", tag:"mn", output:"1", description:"1", ttype:Astex.Token.CONST , category:Astex.Token.DIGIT});
Astex.Token.addToken({input:"2", tag:"mn", output:"2", description:"2", ttype:Astex.Token.CONST , category:Astex.Token.DIGIT});
Astex.Token.addToken({input:"3", tag:"mn", output:"3", description:"3", ttype:Astex.Token.CONST , category:Astex.Token.DIGIT});
Astex.Token.addToken({input:"4", tag:"mn", output:"4", description:"4", ttype:Astex.Token.CONST , category:Astex.Token.DIGIT});
Astex.Token.addToken({input:"5", tag:"mn", output:"5", description:"5", ttype:Astex.Token.CONST , category:Astex.Token.DIGIT});
Astex.Token.addToken({input:"6", tag:"mn", output:"6", description:"6", ttype:Astex.Token.CONST , category:Astex.Token.DIGIT});
Astex.Token.addToken({input:"7", tag:"mn", output:"7", description:"7", ttype:Astex.Token.CONST , category:Astex.Token.DIGIT});
Astex.Token.addToken({input:"8", tag:"mn", output:"8", description:"8", ttype:Astex.Token.CONST , category:Astex.Token.DIGIT});
Astex.Token.addToken({input:"9", tag:"mn", output:"9", description:"9", ttype:Astex.Token.CONST , category:Astex.Token.DIGIT});

// lower-case English letters
Astex.Token.addToken({input:"a", tag:"mi", output:"a", description:"a", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"b", tag:"mi", output:"b", description:"b", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"c", tag:"mi", output:"c", description:"c", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"d", tag:"mi", output:"d", description:"d", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"e", tag:"mi", output:"e", description:"e", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"f", tag:"mi", output:"f", description:"f", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"g", tag:"mi", output:"g", description:"g", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"h", tag:"mi", output:"h", description:"h", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"i", tag:"mi", output:"i", description:"i", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"j", tag:"mi", output:"j", description:"j", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"k", tag:"mi", output:"k", description:"k", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"l", tag:"mi", output:"l", description:"l", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"m", tag:"mi", output:"m", description:"m", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"n", tag:"mi", output:"n", description:"n", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"o", tag:"mi", output:"o", description:"o", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"p", tag:"mi", output:"p", description:"p", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"q", tag:"mi", output:"q", description:"q", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"r", tag:"mi", output:"r", description:"r", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"s", tag:"mi", output:"s", description:"s", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"t", tag:"mi", output:"t", description:"t", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"u", tag:"mi", output:"u", description:"u", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"v", tag:"mi", output:"v", description:"v", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"w", tag:"mi", output:"w", description:"w", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"x", tag:"mi", output:"x", description:"x", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"y", tag:"mi", output:"y", description:"y", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"z", tag:"mi", output:"z", description:"z", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});

// upper-case English letters
Astex.Token.addToken({input:"A", tag:"mi", output:"A", description:"A", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"B", tag:"mi", output:"B", description:"B", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"C", tag:"mi", output:"C", description:"C", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"D", tag:"mi", output:"D", description:"D", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"E", tag:"mi", output:"E", description:"E", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"F", tag:"mi", output:"F", description:"F", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"G", tag:"mi", output:"G", description:"G", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"H", tag:"mi", output:"H", description:"H", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"I", tag:"mi", output:"I", description:"I", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"J", tag:"mi", output:"J", description:"J", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"K", tag:"mi", output:"K", description:"K", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"L", tag:"mi", output:"L", description:"L", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"M", tag:"mi", output:"M", description:"M", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"N", tag:"mi", output:"N", description:"N", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"O", tag:"mi", output:"O", description:"O", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"P", tag:"mi", output:"P", description:"P", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"Q", tag:"mi", output:"Q", description:"Q", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"R", tag:"mi", output:"R", description:"R", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"S", tag:"mi", output:"S", description:"S", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"T", tag:"mi", output:"T", description:"T", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"U", tag:"mi", output:"U", description:"U", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"V", tag:"mi", output:"V", description:"V", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"W", tag:"mi", output:"W", description:"W", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"X", tag:"mi", output:"X", description:"X", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"Y", tag:"mi", output:"Y", description:"Y", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});
Astex.Token.addToken({input:"Z", tag:"mi", output:"Z", description:"Z", ttype:Astex.Token.CONST , category:Astex.Token.ENGLISH});

// variable Greek letters
Astex.Token.addToken({input:"varepsilon", tag:"mi", output:"\u025B", description:"epsilon", ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"varsigma",   tag:"mi", output:"\u03C2", description:"sigmaf",  ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"vartheta",   tag:"mi", output:"\u03D1", description:"theta",   ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"varphi",     tag:"mi", output:"\u03D5", description:"phi",     ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"varpi",      tag:"mi", output:"\u03D5", description:"pi",      ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"varrho",     tag:"mi", output:"\u03F1", description:"rho",     ttype:Astex.Token.CONST , category:Astex.Token.GREEK});

Astex.Token.addToken({input:"\\varepsilon", tag:"mi", output:"\u025B", description:"epsilon", ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\varsigma",   tag:"mi", output:"\u03C2", description:"sigmaf",   ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\vartheta",   tag:"mi", output:"\u03D1", description:"theta",   ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\varphi",     tag:"mi", output:"\u03D5", description:"phi",     ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\varpi",      tag:"mi", output:"\u03D5", description:"pi",      ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\varrho",     tag:"mi", output:"\u03F1", description:"rho",     ttype:Astex.Token.CONST , category:Astex.Token.GREEK});

// abbreviated Greek letters
Astex.Token.addToken({input:"epsi",   tag:"mi", output:"\u03B5", description:"epsilon", ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\epsi", tag:"mi", output:"\u03B5", description:"epsilon", ttype:Astex.Token.CONST , category:Astex.Token.GREEK});

// lower-case Greek letters
Astex.Token.addToken({input:"alpha",   tag:"mi", output:"\u03B1", description:"alpha",   ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"beta",    tag:"mi", output:"\u03B2", description:"beta",    ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"gamma",   tag:"mi", output:"\u03B3", description:"gamma",   ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"delta",   tag:"mi", output:"\u03B4", description:"delta",   ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"epsilon", tag:"mi", output:"\u03B5", description:"epsilon", ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"zeta",    tag:"mi", output:"\u03B6", description:"zeta",    ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"eta",     tag:"mi", output:"\u03B7", description:"eta",     ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"theta",   tag:"mi", output:"\u03B8", description:"theta",   ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"iota",    tag:"mi", output:"\u03B9", description:"iota",    ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"kappa",   tag:"mi", output:"\u03BA", description:"kappa",   ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"lambda",  tag:"mi", output:"\u03BB", description:"lambda",  ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"mu",      tag:"mi", output:"\u03BC", description:"mu",      ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"nu",      tag:"mi", output:"\u03BD", description:"nu",      ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"xi",      tag:"mi", output:"\u03BE", description:"xi",      ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"omicron", tag:"mi", output:"\u03BF", description:"omicron", ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"pi",      tag:"mi", output:"\u03C0", description:"pi",      ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"rho",     tag:"mi", output:"\u03C1", description:"rho",     ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"sigmaf",  tag:"mi", output:"\u03C2", description:"sigmaf",  ttype:Astex.Token.CONST , category:Astex.Token.GREEK}); // sigma for end-of words
Astex.Token.addToken({input:"sigma",   tag:"mi", output:"\u03C3", description:"sigma",   ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"tau",     tag:"mi", output:"\u03C4", description:"tau",     ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"upsilon", tag:"mi", output:"\u03C5", description:"upsilon", ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"phi",     tag:"mi", output:"\u03C6", description:"phi",     ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"chi",     tag:"mi", output:"\u03C7", description:"chi",     ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"psi",     tag:"mi", output:"\u03C8", description:"psi",     ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"omega",   tag:"mi", output:"\u03C9", description:"omega",   ttype:Astex.Token.CONST , category:Astex.Token.GREEK});

Astex.Token.addToken({input:"\\alpha",   tag:"mi", output:"\u03B1", description:"alpha",   ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\beta",    tag:"mi", output:"\u03B2", description:"beta",    ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\gamma",   tag:"mi", output:"\u03B3", description:"gamma",   ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\delta",   tag:"mi", output:"\u03B4", description:"delta",   ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\epsilon", tag:"mi", output:"\u03B5", description:"epsilon", ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\zeta",    tag:"mi", output:"\u03B6", description:"zeta",    ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\eta",     tag:"mi", output:"\u03B7", description:"eta",     ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\theta",   tag:"mi", output:"\u03B8", description:"theta",   ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\iota",    tag:"mi", output:"\u03B9", description:"iota",    ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\kappa",   tag:"mi", output:"\u03BA", description:"kappa",   ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\lambda",  tag:"mi", output:"\u03BB", description:"lambda",  ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\mu",      tag:"mi", output:"\u03BC", description:"mu",      ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\nu",      tag:"mi", output:"\u03BD", description:"nu",      ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\xi",      tag:"mi", output:"\u03BE", description:"xi",      ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\omicron", tag:"mi", output:"\u03BF", description:"omicron", ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\pi",      tag:"mi", output:"\u03C0", description:"pi",      ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\rho",     tag:"mi", output:"\u03C1", description:"rho",     ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\sigmaf",  tag:"mi", output:"\u03C2", description:"sigmaf",  ttype:Astex.Token.CONST , category:Astex.Token.GREEK}); // sigma for end-of words
Astex.Token.addToken({input:"\\sigma",   tag:"mi", output:"\u03C3", description:"sigma",   ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\tau",     tag:"mi", output:"\u03C4", description:"tau",     ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\upsilon", tag:"mi", output:"\u03C5", description:"upsilon", ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\phi",     tag:"mi", output:"\u03C6", description:"phi",     ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\chi",     tag:"mi", output:"\u03C7", description:"chi",     ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\psi",     tag:"mi", output:"\u03C8", description:"psi",     ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\omega",   tag:"mi", output:"\u03C9", description:"omega",   ttype:Astex.Token.CONST , category:Astex.Token.GREEK});

// upper-case Greek letters (originally had "mo" tag)
Astex.Token.addToken({input:"Alpha",   tag:"mi", output:"\u0391", description:"Alpha",   ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"Beta",    tag:"mi", output:"\u0392", description:"Beta",    ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"Gamma",   tag:"mi", output:"\u0393", description:"Gamma",   ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"Delta",   tag:"mi", output:"\u0394", description:"Delta",   ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"Epsilon", tag:"mi", output:"\u0395", description:"Epsilon", ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"Zeta",    tag:"mi", output:"\u0396", description:"Zeta",    ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"Eta",     tag:"mi", output:"\u0397", description:"Eta",     ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"Theta",   tag:"mi", output:"\u0398", description:"Theta",   ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"Iota",    tag:"mi", output:"\u0399", description:"Iota",    ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"Kappa",   tag:"mi", output:"\u039A", description:"Kappa",   ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"Lambda",  tag:"mi", output:"\u039B", description:"Lambda",  ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"Mu",      tag:"mi", output:"\u039C", description:"Mu",      ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"Nu",      tag:"mi", output:"\u039D", description:"Nu",      ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"Xi",      tag:"mi", output:"\u039E", description:"Xi",      ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"Omicron", tag:"mi", output:"\u039F", description:"Omicron", ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"Pi",      tag:"mi", output:"\u03A0", description:"Pi",      ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"Rho",     tag:"mi", output:"\u03A1", description:"Rho",     ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
// There is no character displayed for "\u03A2"
Astex.Token.addToken({input:"Sigma",   tag:"mi", output:"\u03A3", description:"Sigma",   ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"Tau",     tag:"mi", output:"\u03A4", description:"Tau",     ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"Upsilon", tag:"mi", output:"\u03A5", description:"Upsilon", ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"Phi",     tag:"mi", output:"\u03A6", description:"Phi",     ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"Chi",     tag:"mi", output:"\u03A7", description:"Chi",     ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"Psi",     tag:"mi", output:"\u03A8", description:"Psi",     ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"Omega",   tag:"mi", output:"\u03A9", description:"Omega",   ttype:Astex.Token.CONST , category:Astex.Token.GREEK});

Astex.Token.addToken({input:"\\Alpha",   tag:"mi", output:"\u0391", description:"Alpha",   ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\Beta",    tag:"mi", output:"\u0392", description:"Beta",    ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\Gamma",   tag:"mi", output:"\u0393", description:"Gamma",   ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\Delta",   tag:"mi", output:"\u0394", description:"Delta",   ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\Epsilon", tag:"mi", output:"\u0395", description:"Epsilon", ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\Zeta",    tag:"mi", output:"\u0396", description:"Zeta",    ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\Eta",     tag:"mi", output:"\u0397", description:"Eta",     ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\Theta",   tag:"mi", output:"\u0398", description:"Theta",   ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\Iota",    tag:"mi", output:"\u0399", description:"Iota",    ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\Kappa",   tag:"mi", output:"\u039A", description:"Kappa",   ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\Lambda",  tag:"mi", output:"\u039B", description:"Lambda",  ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\Mu",      tag:"mi", output:"\u039C", description:"Mu",      ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\Nu",      tag:"mi", output:"\u039D", description:"Nu",      ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\Xi",      tag:"mi", output:"\u039E", description:"Xi",      ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\Omicron", tag:"mi", output:"\u039F", description:"Omicron", ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\Pi",      tag:"mi", output:"\u03A0", description:"Pi",      ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\Rho",     tag:"mi", output:"\u03A1", description:"Rho",     ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
// There is no character displayed for "\u03A2"
Astex.Token.addToken({input:"\\Sigma",   tag:"mi", output:"\u03A3", description:"Sigma",   ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\Tau",     tag:"mi", output:"\u03A4", description:"Tau",     ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\Upsilon", tag:"mi", output:"\u03A5", description:"Upsilon", ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\Phi",     tag:"mi", output:"\u03A6", description:"Phi",     ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\Chi",     tag:"mi", output:"\u03A7", description:"Chi",     ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\Psi",     tag:"mi", output:"\u03A8", description:"Psi",     ttype:Astex.Token.CONST , category:Astex.Token.GREEK});
Astex.Token.addToken({input:"\\Omega",   tag:"mi", output:"\u03A9", description:"Omega",   ttype:Astex.Token.CONST , category:Astex.Token.GREEK});

//
// need to add other QWERTY keyboard tokens (from symbols) ! @ # , etc.
//
// some of these may need to be commented out or have input renamed
// e.g. grouping brackets -- ( ) { } [ ] < > 
//      superscript, subscript, etc. --- ^ _ 
//      misc. --- ! @
Astex.Token.addToken({input:"~", tag:"mi", output:"~", description:"~", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
Astex.Token.addToken({input:"backquote", tag:"mi", output:"`", description:"`", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
Astex.Token.addToken({input:"\\backquote", tag:"mi", output:"`", description:"`", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
Astex.Token.addToken({input:"!", tag:"mi", output:"!", description:"!", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
Astex.Token.addToken({input:"at", tag:"mi", output:"@", description:"@", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
Astex.Token.addToken({input:"\\at", tag:"mi", output:"@", description:"@", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
Astex.Token.addToken({input:"#", tag:"mi", output:"#", description:"#", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
Astex.Token.addToken({input:"dollar", tag:"mi", output:"$", description:"$", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
Astex.Token.addToken({input:"\\dollar", tag:"mi", output:"$", description:"$", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
Astex.Token.addToken({input:"%", tag:"mi", output:"%", description:"%", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
Astex.Token.addToken({input:"carat", tag:"mi", output:"^", description:"^", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
Astex.Token.addToken({input:"\\carat", tag:"mi", output:"^", description:"^", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
Astex.Token.addToken({input:"&", tag:"mi", output:"&", description:"&", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
Astex.Token.addToken({input:"ast", tag:"mi", output:"\u002A", description:"*", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
Astex.Token.addToken({input:"\\ast", tag:"mi", output:"\u002A", description:"*", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
Astex.Token.addToken({input:"asterik", tag:"mi", output:"*", description:"*", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
Astex.Token.addToken({input:"\\asterik", tag:"mi", output:"*", description:"*", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
//Astex.Token.addToken({input:"lparen", tag:"mi", output:"(", description:"(", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
//Astex.Token.addToken({input:"rparen", tag:"mi", output:")", description:")", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
//Astex.Token.addToken({input:"-", tag:"mi", output:"-", description:"-", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
//Astex.Token.addToken({input:"_", tag:"mi", output:"_", description:"_", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
//Astex.Token.addToken({input:"+", tag:"mi", output:"+", description:"+", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
//Astex.Token.addToken({input:"=", tag:"mi", output:"=", description:"=", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
//Astex.Token.addToken({input:"lcurly", tag:"mi", output:"{", description:"{", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
//Astex.Token.addToken({input:"rcurly", tag:"mi", output:"}", description:"}", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
//Astex.Token.addToken({input:"lbracket", tag:"mi", output:"[", description:"[", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
//Astex.Token.addToken({input:"rbracket", tag:"mi", output:"]", description:"]", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
//Astex.Token.addToken({input:"pipe", tag:"mi", output:"|", description:"|", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
//Astex.Token.addToken({input:"\\", tag:"mi", output:"\\", description:"\\", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
//Astex.Token.addToken({input:"\\", tag:"mi", output:"\\", description:"\\", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
Astex.Token.addToken({input:"backslash", tag:"mi", output:"\\", description:"\\", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
Astex.Token.addToken({input:"\\backslash", tag:"mi", output:"\\", description:"\\", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
//Astex.Token.addToken({input:"\\ ",  tag:"mo", output:"\u00A0", description:"\\", tex:null, ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
Astex.Token.addToken({input:":", tag:"mi", output:":", description:":", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
Astex.Token.addToken({input:";", tag:"mi", output:";", description:";", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
Astex.Token.addToken({input:"\"", tag:"mi", output:"\"", description:"\"", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
//Astex.Token.addToken({input:"'", tag:"mi", output:"'", description:"'", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
Astex.Token.addToken({input:"'", tag:"mi", output:"\u2032", description:"'", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
//Astex.Token.addToken({input:"langle", tag:"mi", output:"<", description:"<", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
//Astex.Token.addToken({input:"rangle", tag:"mi", output:">", description:">", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
Astex.Token.addToken({input:",", tag:"mi", output:",", description:",", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
Astex.Token.addToken({input:"comma", tag:"mi", output:",", description:",", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
Astex.Token.addToken({input:"\\comma", tag:"mi", output:",", description:",", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
Astex.Token.addToken({input:".", tag:"mi", output:".", description:".", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
Astex.Token.addToken({input:"?", tag:"mi", output:"?", description:"?", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});
//Astex.Token.addToken({input:"/", tag:"mi", output:"/", description:"/", ttype:Astex.Token.CONST, category:Astex.Token.QWERTY});	// don't use so asciimath frac works

//grouping brackets
Astex.Token.addToken({input:"(", tag:"mo", output:"(", description:"(", ttype:Astex.Token.LEFTBRACKET, category:Astex.Token.GROUPINGBRACKET});
Astex.Token.addToken({input:")", tag:"mo", output:")", description:")", ttype:Astex.Token.RIGHTBRACKET, category:Astex.Token.GROUPINGBRACKET});
Astex.Token.addToken({input:"[", tag:"mo", output:"[", description:"[", ttype:Astex.Token.LEFTBRACKET, category:Astex.Token.GROUPINGBRACKET});
Astex.Token.addToken({input:"]", tag:"mo", output:"]", description:"]", ttype:Astex.Token.RIGHTBRACKET, category:Astex.Token.GROUPINGBRACKET});
//Astex.Token.addToken({input:"\\\\{", tag:"mo", output:"{", description:"{", ttype:Astex.Token.LEFTBRACKET, category:Astex.Token.GROUPINGBRACKET});		// need these ???
//Astex.Token.addToken({input:"\\}", tag:"mo", output:"}", description:"}", ttype:Astex.Token.RIGHTBRACKET, category:Astex.Token.GROUPINGBRACKET});		// need these ???
//Astex.Token.addToken({input:"{{", tag:"mo", output:"{", description:"{", ttype:Astex.Token.LEFTBRACKET, category:Astex.Token.GROUPINGBRACKET});		// need these ???
Astex.Token.addToken({input:"lbrace", tag:"mo", output:"{", description:"{", ttype:Astex.Token.LEFTBRACKET, category:Astex.Token.GROUPINGBRACKET});		// need these ???
Astex.Token.addToken({input:"\\lbrace", tag:"mo", output:"{", description:"{", ttype:Astex.Token.LEFTBRACKET, category:Astex.Token.GROUPINGBRACKET});		// need these ???
//Astex.Token.addToken({input:"}}", tag:"mo", output:"}", description:"}", ttype:Astex.Token.RIGHTBRACKET, category:Astex.Token.GROUPINGBRACKET});		// need these ???
Astex.Token.addToken({input:"rbrace", tag:"mo", output:"}", description:"}", ttype:Astex.Token.RIGHTBRACKET, category:Astex.Token.GROUPINGBRACKET});		// need these ???
Astex.Token.addToken({input:"\\rbrace", tag:"mo", output:"}", description:"}", ttype:Astex.Token.RIGHTBRACKET, category:Astex.Token.GROUPINGBRACKET});		// need these ???
Astex.Token.addToken({input:"|", tag:"mo", output:"|", description:"|", ttype:Astex.Token.LEFTRIGHT, category:Astex.Token.GROUPINGBRACKET});
//{input:"||", tag:"mo", output:"||", description:"||", tex:null, ttype:Astex.Token.LEFTRIGHT, category:Astex.Token.GROUPINGBRACKET});
Astex.Token.addToken({input:"(:", tag:"mo", output:"\u2329", description:"<", ttype:Astex.Token.LEFTBRACKET, category:Astex.Token.GROUPINGBRACKET});
Astex.Token.addToken({input:"langle", tag:"mo", output:"\u2329", description:"<", ttype:Astex.Token.LEFTBRACKET, category:Astex.Token.GROUPINGBRACKET});
Astex.Token.addToken({input:"\\langle", tag:"mo", output:"\u2329", description:"<", ttype:Astex.Token.LEFTBRACKET, category:Astex.Token.GROUPINGBRACKET});
Astex.Token.addToken({input:":)", tag:"mo", output:"\u232A", description:">", ttype:Astex.Token.RIGHTBRACKET, category:Astex.Token.GROUPINGBRACKET});
Astex.Token.addToken({input:"rangle", tag:"mo", output:"\u232A", description:">", ttype:Astex.Token.RIGHTBRACKET, category:Astex.Token.GROUPINGBRACKET});
Astex.Token.addToken({input:"\\rangle", tag:"mo", output:"\u232A", description:">", ttype:Astex.Token.RIGHTBRACKET, category:Astex.Token.GROUPINGBRACKET});
Astex.Token.addToken({input:"<<", tag:"mo", output:"\u2329", description:"<", ttype:Astex.Token.LEFTBRACKET, category:Astex.Token.GROUPINGBRACKET});	// are these ok?
Astex.Token.addToken({input:">>", tag:"mo", output:"\u232A", description:">", ttype:Astex.Token.RIGHTBRACKET, category:Astex.Token.GROUPINGBRACKET});	// ok??
Astex.Token.addToken({input:"{:", tag:"mo", output:"{:", description:"{:", ttype:Astex.Token.LEFTBRACKET, category:Astex.Token.GROUPINGBRACKET, invisible:true});
Astex.Token.addToken({input:":}", tag:"mo", output:":}", description:":}", ttype:Astex.Token.RIGHTBRACKET, category:Astex.Token.GROUPINGBRACKET, invisible:true});
//Astex.Token.addToken({input:"{",	   output:"{", description:"{", ttype:Astex.Token.LEFTBRACKET, category:Astex.Token.GROUPINGBRACKET,  invisible:true});
//Astex.Token.addToken({input:"}",	   output:"}", description:"}", ttype:Astex.Token.RIGHTBRACKET, category:Astex.Token.GROUPINGBRACKET, invisible:true});
Astex.Token.addToken({input:"{",	   output:"{", description:"{", ttype:Astex.Token.LEFTBRACKET, category:Astex.Token.GROUPINGBRACKET});// is set to invisible for lmath in AMath
Astex.Token.addToken({input:"}",	   output:"}", description:"}", ttype:Astex.Token.RIGHTBRACKET, category:Astex.Token.GROUPINGBRACKET});// is set to invisible for lmath in AMath

//binary operation tokens
Astex.Token.addToken({input:"+", tag:"mo", output:"+", description:"+", ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});
Astex.Token.addToken({input:"-", tag:"mo", output:"-", description:"-", ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});
Astex.Token.addToken({input:"=", tag:"mo", output:"=", description:"=", ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});
//Astex.Token.addToken({input:"-",        tag:"mo", output:"\u0096", description:"-", tex:null, ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});
Astex.Token.addToken({input:"*",        tag:"mo", output:"\u22C5", description:"times-dot", ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});
Astex.Token.addToken({input:"cdot",	   tag:"mo", output:"\u22C5", description:"times-dot",  ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});
Astex.Token.addToken({input:"\\cdot",	   tag:"mo", output:"\u22C5", description:"times-dot",  ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});

Astex.Token.addToken({input:"xx",       tag:"mo", output:"\u00D7", description:"times-x",   ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});
Astex.Token.addToken({input:"times",	   tag:"mo", output:"\u00D7", description:"times-x",    ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});
Astex.Token.addToken({input:"\\times",	   tag:"mo", output:"\u00D7", description:"times-x",    ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});

Astex.Token.addToken({input:"**",       tag:"mo", output:"\u22C6", description:"star",      ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});
Astex.Token.addToken({input:"star",	   tag:"mo", output:"\u22C6", description:"star",       ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});
Astex.Token.addToken({input:"\\star",	   tag:"mo", output:"\u22C6", description:"star",       ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});

Astex.Token.addToken({input:"-:",       tag:"mo", output:"\u00F7", description:"division",        ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});
Astex.Token.addToken({input:"div",       tag:"mo", output:"\u00F7", description:"division",         ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});
Astex.Token.addToken({input:"\\div",       tag:"mo", output:"\u00F7", description:"division",         ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});
Astex.Token.addToken({input:"divide",    tag:"mo", output:"\u00F7", description:"division",         ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});
Astex.Token.addToken({input:"\\divide",    tag:"mo", output:"\u00F7", description:"division",         ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});

Astex.Token.addToken({input:"@",        tag:"mo", output:"\u2218", description:"circle",    ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});	// composition of funcs
Astex.Token.addToken({input:"circ",	   tag:"mo", output:"\u2218", description:"circle",     ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});
Astex.Token.addToken({input:"\\circ",	   tag:"mo", output:"\u2218", description:"circle",     ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});
Astex.Token.addToken({input:"bigcirc",	tag:"mo", output:"\u25CB", description:"big-circle", ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});		// ???
Astex.Token.addToken({input:"\\bigcirc",	tag:"mo", output:"\u25CB", description:"big-circle", ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});		// ???

Astex.Token.addToken({input:"o+",       tag:"mo", output:"\u2295", description:"o+",        ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});
Astex.Token.addToken({input:"oplus",	   tag:"mo", output:"\u2295", description:"o+",         ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});
Astex.Token.addToken({input:"\\oplus",	   tag:"mo", output:"\u2295", description:"o+",         ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});

Astex.Token.addToken({input:"o-",	   tag:"mo", output:"\u2296", description:"o-",         ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});	// ???
Astex.Token.addToken({input:"ominus",	   tag:"mo", output:"\u2296", description:"o-",         ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});	// ???
Astex.Token.addToken({input:"\\ominus",	   tag:"mo", output:"\u2296", description:"o-",         ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});	// ???

Astex.Token.addToken({input:"ox",       tag:"mo", output:"\u2297", description:"ox",        ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});
Astex.Token.addToken({input:"otimes",	   tag:"mo", output:"\u2297", description:"ox",         ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});
Astex.Token.addToken({input:"\\otimes",	   tag:"mo", output:"\u2297", description:"ox",         ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});

Astex.Token.addToken({input:"o/",	   tag:"mo", output:"\u2298", description:"o/",         ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});
Astex.Token.addToken({input:"oslash",	   tag:"mo", output:"\u2298", description:"o/",         ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});	// ???
Astex.Token.addToken({input:"\\oslash",	   tag:"mo", output:"\u2298", description:"o/",         ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});	// ???

Astex.Token.addToken({input:"o.",       tag:"mo", output:"\u2299", description:"o.",        ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});
Astex.Token.addToken({input:"odot",	   tag:"mo", output:"\u2299", description:"o.",         ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});
Astex.Token.addToken({input:"\\odot",	   tag:"mo", output:"\u2299", description:"o.",         ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});

//Astex.Token.addToken({input:"//",       tag:"mo", output:"/",      description:"/",         ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});
//Astex.Token.addToken({input:"\\\\",     tag:"mo", output:"\\",     description:"\\",        ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});
//Astex.Token.addToken({input:"setminus", tag:"mo", output:"\\",     description:"\\",        ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});

Astex.Token.addToken({input:"bigoplus",	tag:"mo", output:"\u2A01", description:"big-o+", ttype:Astex.Token.UNDEROVER, category:Astex.Token.BINARYOPERATOR});	// ???
Astex.Token.addToken({input:"\\bigoplus",	tag:"mo", output:"\u2A01", description:"big-o+", ttype:Astex.Token.UNDEROVER, category:Astex.Token.BINARYOPERATOR});	// ???

Astex.Token.addToken({input:"bigotimes",	tag:"mo", output:"\u2A02", description:"big-ox", ttype:Astex.Token.UNDEROVER, category:Astex.Token.BINARYOPERATOR});	// ???
Astex.Token.addToken({input:"\\bigotimes",	tag:"mo", output:"\u2A02", description:"big-ox", ttype:Astex.Token.UNDEROVER, category:Astex.Token.BINARYOPERATOR});	// ???

Astex.Token.addToken({input:"bigodot",	tag:"mo", output:"\u2A00", description:"big-o.", ttype:Astex.Token.UNDEROVER, category:Astex.Token.BINARYOPERATOR});	// ???
Astex.Token.addToken({input:"\\bigodot",	tag:"mo", output:"\u2A00", description:"big-o.", ttype:Astex.Token.UNDEROVER, category:Astex.Token.BINARYOPERATOR});	// ???

Astex.Token.addToken({input:"uplus",	tag:"mo", output:"\u228E", description:"u+", ttype:Astex.Token.UNDEROVER, category:Astex.Token.BINARYOPERATOR});	// ???
Astex.Token.addToken({input:"\\uplus",	tag:"mo", output:"\u228E", description:"u+", ttype:Astex.Token.UNDEROVER, category:Astex.Token.BINARYOPERATOR});	// ???
Astex.Token.addToken({input:"biguplus",	tag:"mo", output:"\u2A04", description:"big-U+", ttype:Astex.Token.UNDEROVER, category:Astex.Token.BINARYOPERATOR});	// ???
Astex.Token.addToken({input:"\\biguplus",	tag:"mo", output:"\u2A04", description:"big-U+", ttype:Astex.Token.UNDEROVER, category:Astex.Token.BINARYOPERATOR});	// ???


Astex.Token.addToken({input:"nn",       tag:"mo", output:"\u2229", description:"cap",       ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});
Astex.Token.addToken({input:"cap",	   tag:"mo", output:"\u2229", description:"cap",        ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});
Astex.Token.addToken({input:"\\cap",	   tag:"mo", output:"\u2229", description:"cap",        ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});

Astex.Token.addToken({input:"uu",       tag:"mo", output:"\u222A", description:"cup",       ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});
Astex.Token.addToken({input:"cup",	   tag:"mo", output:"\u222A", description:"cup",        ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});
Astex.Token.addToken({input:"\\cup",	   tag:"mo", output:"\u222A", description:"cup",        ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});


Astex.Token.addToken({input:"nnn",      tag:"mo", output:"\u22C2", description:"big-cap",   ttype:Astex.Token.UNDEROVER, category:Astex.Token.BINARYOPERATOR});
Astex.Token.addToken({input:"bigcap",    tag:"mo", output:"\u22C2", description:"big-cap",    ttype:Astex.Token.UNDEROVER, category:Astex.Token.BINARYOPERATOR});
Astex.Token.addToken({input:"\\bigcap",    tag:"mo", output:"\u22C2", description:"big-cap",    ttype:Astex.Token.UNDEROVER, category:Astex.Token.BINARYOPERATOR});

Astex.Token.addToken({input:"uuu",      tag:"mo", output:"\u22C3", description:"big-cup",   ttype:Astex.Token.UNDEROVER, category:Astex.Token.BINARYOPERATOR});
Astex.Token.addToken({input:"bigcup",    tag:"mo", output:"\u22C3", description:"big-cup",    ttype:Astex.Token.UNDEROVER, category:Astex.Token.BINARYOPERATOR});
Astex.Token.addToken({input:"\\bigcup",    tag:"mo", output:"\u22C3", description:"big-cup",    ttype:Astex.Token.UNDEROVER, category:Astex.Token.BINARYOPERATOR});

Astex.Token.addToken({input:"sqcap",	   tag:"mo", output:"\u2293", description:"square-cap", ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});	// ???
Astex.Token.addToken({input:"\\sqcap",	   tag:"mo", output:"\u2293", description:"square-cap", ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});	// ???

Astex.Token.addToken({input:"sqcup",	   tag:"mo", output:"\u2294", description:"square-cup", ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});	// ???
Astex.Token.addToken({input:"\\sqcup",	   tag:"mo", output:"\u2294", description:"square-cup", ttype:Astex.Token.CONST, category:Astex.Token.BINARYOPERATOR});	// ???

Astex.Token.addToken({input:"bigsqcap",	tag:"mo", output:"\u2A05", description:"big-square-cap", ttype:Astex.Token.UNDEROVER, category:Astex.Token.BINARYOPERATOR});	// ???
Astex.Token.addToken({input:"\\bigsqcap",	tag:"mo", output:"\u2A05", description:"big-square-cap", ttype:Astex.Token.UNDEROVER, category:Astex.Token.BINARYOPERATOR});	// ???

Astex.Token.addToken({input:"bigsqcup",	tag:"mo", output:"\u2A06", description:"big-square-cup", ttype:Astex.Token.UNDEROVER, category:Astex.Token.BINARYOPERATOR});	// ???
Astex.Token.addToken({input:"\\bigsqcup",	tag:"mo", output:"\u2A06", description:"big-square-cup", ttype:Astex.Token.UNDEROVER, category:Astex.Token.BINARYOPERATOR});	// ???


//binary relation tokens
Astex.Token.addToken({input:"!=",  tag:"mo", output:"\u2260", description:"not equal to", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"ne",		tag:"mo", output:"\u2260", description:"not equal to", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"\\ne",		tag:"mo", output:"\u2260", description:"not equal to", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"neq",		tag:"mo", output:"\u2260", description:"not equal to", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"\\neq",		tag:"mo", output:"\u2260", description:"not equal to", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});

Astex.Token.addToken({input:":=",  tag:"mo", output:":=",     description:"definition", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});

Astex.Token.addToken({input:"lt",  tag:"mo", output:"<",      description:"<", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"\\lt",		tag:"mo", output:"<",	   description:"<", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});

Astex.Token.addToken({input:"gt",		tag:"mo", output:">",	   description:">", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"\\gt",		tag:"mo", output:">",	   description:">", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});

Astex.Token.addToken({input:"<=",  tag:"mo", output:"\u2264", description:"<=", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"le",  tag:"mo", output:"\u2264", description:"<=", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"lt=", tag:"mo", output:"\u2264", description:"<=", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"\\le",	 tag:"mo", output:"\u2264", description:"<=", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"leq", tag:"mo", output:"\u2264", description:"<=", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"\\leq", tag:"mo", output:"\u2264", description:"<=", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"leqslant",	tag:"mo", output:"\u2264", description:"<=", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"\\leqslant",	tag:"mo", output:"\u2264", description:"<=", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});

Astex.Token.addToken({input:">=",  tag:"mo", output:"\u2265", description:">=", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"ge",  tag:"mo", output:"\u2265", description:">=", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"gt=",  tag:"mo", output:"\u2265", description:">=", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"\\ge",		tag:"mo", output:"\u2265", description:">=", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"geq", tag:"mo", output:"\u2265", description:">=", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"\\geq",		tag:"mo", output:"\u2265", description:">=", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"geqslant",	tag:"mo", output:"\u2265", description:">=", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"\\geqslant",	tag:"mo", output:"\u2265", description:">=", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});


Astex.Token.addToken({input:"-<",  tag:"mo", output:"\u227A", description:"prec", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"-lt", tag:"mo", output:"\u227A", description:"prec", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"prec",	tag:"mo", output:"\u227A", description:"prec", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"\\prec",	tag:"mo", output:"\u227A", description:"prec", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});

Astex.Token.addToken({input:">-",  tag:"mo", output:"\u227B", description:"succ", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"succ",	tag:"mo", output:"\u227B", description:"succ", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"\\succ",	tag:"mo", output:"\u227B", description:"succ", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});

Astex.Token.addToken({input:"-<=", tag:"mo", output:"\u2AAF", description:"preceq", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"preceq",	tag:"mo", output:"\u227C", description:"preceq", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"\\preceq",	tag:"mo", output:"\u227C", description:"preceq", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});

Astex.Token.addToken({input:">-=", tag:"mo", output:"\u2AB0", description:"succeq", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"succeq",	tag:"mo", output:"\u227D", description:"succeq", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"\\succeq",	tag:"mo", output:"\u227D", description:"succeq", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});

Astex.Token.addToken({input:"in",  tag:"mo", output:"\u2208", description:"element-of", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"\\in",		tag:"mo", output:"\u2208", description:"element-of", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});

Astex.Token.addToken({input:"ni",	   tag:"mo", output:"\u220B", description:"not in", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});// ???
Astex.Token.addToken({input:"\\ni",	   tag:"mo", output:"\u220B", description:"not in", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});// ???

Astex.Token.addToken({input:"!in",     tag:"mo", output:"\u2209", description:"not in", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"notin", tag:"mo", output:"\u2209", description:"not in", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});	// ???
Astex.Token.addToken({input:"\\notin", tag:"mo", output:"\u2209", description:"not in", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});// ???

Astex.Token.addToken({input:"sub", tag:"mo", output:"\u2282", description:"subset", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"subset",	tag:"mo", output:"\u2282", description:"subset", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"\\subset",	tag:"mo", output:"\u2282", description:"subset", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});

// sup is used as a standard function
//Astex.Token.addToken({input:"sup", tag:"mo", output:"\u2283", description:"superset", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"supset",	tag:"mo", output:"\u2283", description:"supset", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"\\supset",	tag:"mo", output:"\u2283", description:"supset", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"superset",	tag:"mo", output:"\u2283", description:"supset", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"\\superset",	tag:"mo", output:"\u2283", description:"supset", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});

Astex.Token.addToken({input:"sube", tag:"mo", output:"\u2286", description:"subseteq", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"subseteq",	tag:"mo", output:"\u2286", description:"subseteq", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"\\subseteq",	tag:"mo", output:"\u2286", description:"subseteq", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});

Astex.Token.addToken({input:"supe", tag:"mo", output:"\u2287", description:"superseteq", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"supseteq",	tag:"mo", output:"\u2287", description:"supseteq", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"\\supseteq",	tag:"mo", output:"\u2287", description:"supseteq", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});

Astex.Token.addToken({input:"sqsubset",	tag:"mo", output:"\u228F", description:"square-subset", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});	// ???
Astex.Token.addToken({input:"\\sqsubset",	tag:"mo", output:"\u228F", description:"square-subset", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});	// ???

Astex.Token.addToken({input:"sqsupset",	tag:"mo", output:"\u2290", description:"square-superset", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});	// ???
Astex.Token.addToken({input:"\\sqsupset",	tag:"mo", output:"\u2290", description:"square-superset", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});	// ???

Astex.Token.addToken({input:"sqsubseteq",  tag:"mo", output:"\u2291", description:"", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});	// ???
Astex.Token.addToken({input:"\\sqsubseteq",  tag:"mo", output:"\u2291", description:"", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});	// ???

Astex.Token.addToken({input:"sqsupseteq",  tag:"mo", output:"\u2292", description:"", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});	// ???
Astex.Token.addToken({input:"\\sqsupseteq",  tag:"mo", output:"\u2292", description:"", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});	// ???

Astex.Token.addToken({input:"-=",  tag:"mo", output:"\u2261", description:"equiv", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"equiv",	tag:"mo", output:"\u2261", description:"equiv", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"\\equiv",	tag:"mo", output:"\u2261", description:"equiv", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});

Astex.Token.addToken({input:"~=",  tag:"mo", output:"\u2245", description:"congruent", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"cong",	tag:"mo", output:"\u2245", description:"congruent", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"\\cong",	tag:"mo", output:"\u2245", description:"congruent", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});

Astex.Token.addToken({input:"~~",  tag:"mo", output:"\u2248", description:"approx", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"approx",	tag:"mo", output:"\u2248", description:"approx", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"\\approx",	tag:"mo", output:"\u2248", description:"approx", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});

Astex.Token.addToken({input:".=",  tag:"mo", output:"\u2250", description:"approx-dot", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});	// added
Astex.Token.addToken({input:"doteq",	tag:"mo", output:"\u2250", description:"approx-dot", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});		// ???
Astex.Token.addToken({input:"\\doteq",	tag:"mo", output:"\u2250", description:"approx-dot", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});		// ???

Astex.Token.addToken({input:"prop", tag:"mo", output:"\u221D", description:"propto", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"propto",	tag:"mo", output:"\u221D", description:"prop-to", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});
Astex.Token.addToken({input:"\\propto",	tag:"mo", output:"\u221D", description:"prop-to", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});


//Astex.Token.addToken({input:"\\ll",		tag:"mo", output:"\u226A", description:"", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});	// ???
//Astex.Token.addToken({input:"\\gg",		tag:"mo", output:"\u226B", description:"", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});	// ???
//Astex.Token.addToken({input:"\\sim",		tag:"mo", output:"\u223C", description:"", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});	// ???
//Astex.Token.addToken({input:"\\simeq",	tag:"mo", output:"\u2243", description:"", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});		// ???
//Astex.Token.addToken({input:"\\Join",	tag:"mo", output:"\u22C8", description:"", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});		// ???
//Astex.Token.addToken({input:"\\bowtie",	tag:"mo", output:"\u22C8", description:"", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});		// ???
//Astex.Token.addToken({input:"\\owns",	tag:"mo", output:"\u220B", description:"", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});		// ???
//Astex.Token.addToken({input:"\\smile",	tag:"mo", output:"\u2323", description:"", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});		// ???
//Astex.Token.addToken({input:"\\frown",	tag:"mo", output:"\u2322", description:"", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});		// ???
//Astex.Token.addToken({input:"\\asymp",	tag:"mo", output:"\u224D", description:"", ttype:Astex.Token.CONST, category:Astex.Token.BINARYRELATION});		// ???







// misc

Astex.Token.addToken({input:"hbar",	tag:"mi", output:"\u210F", description:"-", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"\\hbar",	tag:"mi", output:"\u210F", description:"-", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"prime",	tag:"mi", output:"\u2032", description:"'", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"\\prime",	tag:"mi", output:"\u2032", description:"'", ttype:Astex.Token.CONST, category:Astex.Token.MISC});

Astex.Token.addToken({input:"sum",      tag:"mo", output:"\u2211", description:"N-ary Summation",     ttype:Astex.Token.UNDEROVER, category:Astex.Token.MISC});
Astex.Token.addToken({input:"\\sum",       tag:"mo", output:"\u2211", description:"N-ary Summation",      ttype:Astex.Token.UNDEROVER, category:Astex.Token.MISC});

Astex.Token.addToken({input:"prod",     tag:"mo", output:"\u220F", description:"N-ary Product",        ttype:Astex.Token.UNDEROVER, category:Astex.Token.MISC});
Astex.Token.addToken({input:"\\prod",      tag:"mo", output:"\u220F", description:"N-ary Product",         ttype:Astex.Token.UNDEROVER, category:Astex.Token.MISC});
Astex.Token.addToken({input:"coprod",	tag:"mo", output:"\u2210", description:"coproduct", ttype:Astex.Token.UNDEROVER, category:Astex.Token.MISC});		// ???
Astex.Token.addToken({input:"\\coprod",	tag:"mo", output:"\u2210", description:"coproduct", ttype:Astex.Token.UNDEROVER, category:Astex.Token.MISC});		// ???
Astex.Token.addToken({input:"laplace",  tag:"mo", output:"\u2112", description:"Laplace Transform", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"\\laplace",  tag:"mo", output:"\u2112", description:"Laplace Transform", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"fourier",  tag:"mo", output:"\u2131", description:"Fourier Transform", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"\\fourier",  tag:"mo", output:"\u2131", description:"Fourier Transform", ttype:Astex.Token.CONST, category:Astex.Token.MISC});

Astex.Token.addToken({input:"triangle",	tag:"mo", output:"\u25B3", ttype:Astex.Token.CONST, category:Astex.Token.MISC});				// ???
Astex.Token.addToken({input:"\\triangle",	tag:"mo", output:"\u25B3", ttype:Astex.Token.CONST, category:Astex.Token.MISC});				// ???

Astex.Token.addToken({input:"triangleleft",tag:"mo", output:"\u22B2", description:"triangle-left", ttype:Astex.Token.CONST, category:Astex.Token.MISC});		// ???
Astex.Token.addToken({input:"\\triangleleft",tag:"mo", output:"\u22B2", description:"triangle-left", ttype:Astex.Token.CONST, category:Astex.Token.MISC});		// ???
Astex.Token.addToken({input:"lhd",		tag:"mo", output:"\u22B2", description:"", ttype:Astex.Token.CONST, category:Astex.Token.MISC});		// ???
Astex.Token.addToken({input:"\\lhd",		tag:"mo", output:"\u22B2", description:"", ttype:Astex.Token.CONST, category:Astex.Token.MISC});		// ???

Astex.Token.addToken({input:"triangleright",tag:"mo",output:"\u22B3", description:"triangle-right", ttype:Astex.Token.CONST, category:Astex.Token.MISC});		// ???
Astex.Token.addToken({input:"\\triangleright",tag:"mo",output:"\u22B3", description:"triangle-right", ttype:Astex.Token.CONST, category:Astex.Token.MISC});		// ???
Astex.Token.addToken({input:"rhd",		tag:"mo", output:"\u22B3", description:"", ttype:Astex.Token.CONST, category:Astex.Token.MISC});		// ???
Astex.Token.addToken({input:"\\rhd",		tag:"mo", output:"\u22B3", description:"", ttype:Astex.Token.CONST, category:Astex.Token.MISC});		// ???

//Astex.Token.addToken({input:"\\unlhd",	tag:"mo", output:"\u22B4", description:"", ttype:Astex.Token.CONST, category:Astex.Token.MISC});			// ???
//Astex.Token.addToken({input:"\\unrhd",	tag:"mo", output:"\u22B5", description:"", ttype:Astex.Token.CONST, category:Astex.Token.MISC});			// ???


//Astex.Token.addToken({input:"\\bullet",	  tag:"mo", output:"\u2219", description:"bullet", ttype:Astex.Token.CONST, category:Astex.Token.MISC});		// ???
Astex.Token.addToken({input:"bullet",	tag:"mo", output:"\u2022", description:"bullet", ttype:Astex.Token.CONST, category:Astex.Token.MISC});			// ???
Astex.Token.addToken({input:"\\bullet",	tag:"mo", output:"\u2022", description:"bullet", ttype:Astex.Token.CONST, category:Astex.Token.MISC});			// ???



//Astex.Token.addToken({input:"\\amalg",	tag:"mo", output:"\u2210", description:"", ttype:Astex.Token.CONST, category:Astex.Token.MISC});			// ???

Astex.Token.addToken({input:"bigtriangleup",tag:"mo",output:"\u25B3", description:"Delta", ttype:Astex.Token.CONST, category:Astex.Token.MISC});		// ???
Astex.Token.addToken({input:"\\bigtriangleup",tag:"mo",output:"\u25B3", description:"Delta", ttype:Astex.Token.CONST, category:Astex.Token.MISC});		// ???

Astex.Token.addToken({input:"bigtriangledown",tag:"mo",output:"\u25BD", description:"gradient", ttype:Astex.Token.CONST, category:Astex.Token.MISC});		// ???
Astex.Token.addToken({input:"\\bigtriangledown",tag:"mo",output:"\u25BD", description:"gradient", ttype:Astex.Token.CONST, category:Astex.Token.MISC});		// ???

Astex.Token.addToken({input:"dag",		tag:"mo", output:"\u2020", description:"dagger", ttype:Astex.Token.CONST, category:Astex.Token.MISC});		// ???
Astex.Token.addToken({input:"\\dag",		tag:"mo", output:"\u2020", description:"dagger", ttype:Astex.Token.CONST, category:Astex.Token.MISC});		// ???
Astex.Token.addToken({input:"dagger",	tag:"mo", output:"\u2020", description:"dagger", ttype:Astex.Token.CONST, category:Astex.Token.MISC});			// ???
Astex.Token.addToken({input:"\\dagger",	tag:"mo", output:"\u2020", description:"dagger", ttype:Astex.Token.CONST, category:Astex.Token.MISC});			// ???

Astex.Token.addToken({input:"ddag",	tag:"mo", output:"\u2021", description:"double-dagger", ttype:Astex.Token.CONST, category:Astex.Token.MISC});			// ???
Astex.Token.addToken({input:"\\ddag",	tag:"mo", output:"\u2021", description:"double-dagger", ttype:Astex.Token.CONST, category:Astex.Token.MISC});			// ???
Astex.Token.addToken({input:"ddagger",	tag:"mo", output:"\u2021", description:"double-dagger", ttype:Astex.Token.CONST, category:Astex.Token.MISC});		// ???
Astex.Token.addToken({input:"\\ddagger",	tag:"mo", output:"\u2021", description:"double-dagger", ttype:Astex.Token.CONST, category:Astex.Token.MISC});		// ???






//logical tokens
Astex.Token.addToken({input:"and", tag:"mtext", output:"and", description:"and", ttype:Astex.Token.SPACE, category:Astex.Token.LOGICALOPERATOR});

Astex.Token.addToken({input:"^^",       tag:"mo", output:"\u2227", description:"wedge",     ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});
Astex.Token.addToken({input:"land",   tag:"mo", output:"\u2227", description:"wedge",      ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});
Astex.Token.addToken({input:"\\land",   tag:"mo", output:"\u2227", description:"wedge",      ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});
Astex.Token.addToken({input:"wedge",  tag:"mo", output:"\u2227", description:"wedge",      ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});
Astex.Token.addToken({input:"\\wedge",  tag:"mo", output:"\u2227", description:"wedge",      ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});

Astex.Token.addToken({input:"^^^",      tag:"mo", output:"\u22C0", description:"big-wedge", ttype:Astex.Token.UNDEROVER, category:Astex.Token.LOGICALOPERATOR});
Astex.Token.addToken({input:"bigwedge",  tag:"mo", output:"\u22C0", description:"big-wedge",  ttype:Astex.Token.UNDEROVER, category:Astex.Token.LOGICALOPERATOR});
Astex.Token.addToken({input:"\\bigwedge",  tag:"mo", output:"\u22C0", description:"big-wedge",  ttype:Astex.Token.UNDEROVER, category:Astex.Token.LOGICALOPERATOR});

Astex.Token.addToken({input:"or",  tag:"mtext", output:"or",  description:"or", ttype:Astex.Token.SPACE, category:Astex.Token.LOGICALOPERATOR});

Astex.Token.addToken({input:"vv",    tag:"mo", output:"\u2228", description:"vee",       ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});
Astex.Token.addToken({input:"lor", tag:"mo", output:"\u2228", description:"vee",        ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});
Astex.Token.addToken({input:"\\lor", tag:"mo", output:"\u2228", description:"vee",        ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});
Astex.Token.addToken({input:"vee", tag:"mo", output:"\u2228", description:"vee",        ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});
Astex.Token.addToken({input:"\\vee", tag:"mo", output:"\u2228", description:"vee",        ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});

Astex.Token.addToken({input:"vvv",      tag:"mo", output:"\u22C1", description:"big-vee",   ttype:Astex.Token.UNDEROVER, category:Astex.Token.LOGICALOPERATOR});
Astex.Token.addToken({input:"bigvee",    tag:"mo", output:"\u22C1", description:"big-vee",    ttype:Astex.Token.UNDEROVER, category:Astex.Token.LOGICALOPERATOR});
Astex.Token.addToken({input:"\\bigvee",    tag:"mo", output:"\u22C1", description:"big-vee",    ttype:Astex.Token.UNDEROVER, category:Astex.Token.LOGICALOPERATOR});


Astex.Token.addToken({input:"not", tag:"mo", output:"\u00AC", description:"negation", ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});
Astex.Token.addToken({input:"neg",	tag:"mo", output:"\u00AC", description:"negation", ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});
Astex.Token.addToken({input:"\\neg",	tag:"mo", output:"\u00AC", description:"negation", ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});
Astex.Token.addToken({input:"lnot",	tag:"mo", output:"\u00AC", description:"negation", ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});
Astex.Token.addToken({input:"\\lnot",	tag:"mo", output:"\u00AC", description:"negation", ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});

Astex.Token.addToken({input:"if",  tag:"mo", output:"if",     description:"=>", tex:null, ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});
Astex.Token.addToken({input:"\\if",  tag:"mo", output:"if",     description:"=>", tex:null, ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});

Astex.Token.addToken({input:"=>",  tag:"mo", output:"\u21D2", description:"=>", ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});
Astex.Token.addToken({input:"implies",  tag:"mo", output:"\u21D2", description:"=>", ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});
Astex.Token.addToken({input:"\\implies",  tag:"mo", output:"\u21D2", description:"=>", ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});

Astex.Token.addToken({input:"<=>", tag:"mo", output:"\u21D4", description:"<=>", ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});
Astex.Token.addToken({input:"iff", tag:"mo", output:"\u21D4", description:"<=>", ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});
Astex.Token.addToken({input:"\\iff", tag:"mo", output:"\u21D4", description:"<=>", ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});

Astex.Token.addToken({input:"AA",  tag:"mo", output:"\u2200", description:"for-all", ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});
Astex.Token.addToken({input:"forall",	tag:"mo", output:"\u2200", description:"for-all", ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});
Astex.Token.addToken({input:"\\forall",	tag:"mo", output:"\u2200", description:"for-all", ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});

Astex.Token.addToken({input:"EE",  tag:"mo", output:"\u2203", description:"there-exists", ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});
Astex.Token.addToken({input:"exists",	tag:"mo", output:"\u2203", description:"there-exists", ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});
Astex.Token.addToken({input:"\\exists",	tag:"mo", output:"\u2203", description:"there-exists", ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});

Astex.Token.addToken({input:"_|_", tag:"mo", output:"\u22A5", description:"_|_", ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});
Astex.Token.addToken({input:"bot",	tag:"mo", output:"\u22A5", description:"_|_", ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});
Astex.Token.addToken({input:"\\bot",	tag:"mo", output:"\u22A5", description:"_|_", ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});
Astex.Token.addToken({input:"perp",	tag:"mo", output:"\u22A5", description:"_|_", ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});	// ?
Astex.Token.addToken({input:"\\perp",	tag:"mo", output:"\u22A5", description:"_|_", ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});	// ?

Astex.Token.addToken({input:"TT",  tag:"mo", output:"\u22A4", description:"top", ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});
Astex.Token.addToken({input:"top",	tag:"mo", output:"\u22A4", description:"top", ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});
Astex.Token.addToken({input:"\\top",	tag:"mo", output:"\u22A4", description:"top", ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});

Astex.Token.addToken({input:"|--",  tag:"mo", output:"\u22A2", description:"|-", ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});
Astex.Token.addToken({input:"vdash",	tag:"mo", output:"\u22A2", description:"|-", ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});
Astex.Token.addToken({input:"\\vdash",	tag:"mo", output:"\u22A2", description:"|-", ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});

//Astex.Token.addToken({input:"\\dashv",	tag:"mo", output:"\u22A3", description:"", ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});		// ???

Astex.Token.addToken({input:"|==",  tag:"mo", output:"\u22A8", description:"|=", ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});
Astex.Token.addToken({input:"models",	tag:"mo", output:"\u22A8", description:"|=", ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});
Astex.Token.addToken({input:"\\models",	tag:"mo", output:"\u22A8", description:"|=", ttype:Astex.Token.CONST, category:Astex.Token.LOGICALOPERATOR});



//miscellaneous tokens
Astex.Token.addToken({input:"int",  tag:"mo", output:"\u222B", description:"integral", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"\\int",	tag:"mo", output:"\u222B", description:"integral", ttype:Astex.Token.CONST, category:Astex.Token.MISC});

Astex.Token.addToken({input:"dint",  tag:"mo", output:"\u222C", description:"double-integral", ttype:Astex.Token.UNDEROVER, category:Astex.Token.MISC});
Astex.Token.addToken({input:"\\dint",  tag:"mo", output:"\u222C", description:"double-integral", ttype:Astex.Token.UNDEROVER, category:Astex.Token.MISC});

Astex.Token.addToken({input:"tint",  tag:"mo", output:"\u222D", description:"triple-integral", ttype:Astex.Token.UNDEROVER, category:Astex.Token.MISC});
Astex.Token.addToken({input:"\\tint",  tag:"mo", output:"\u222D", description:"triple-integral", ttype:Astex.Token.UNDEROVER, category:Astex.Token.MISC});

//Astex.Token.addToken({input:"dx",   tag:"mi", output:"{:d x:}", description:"dx", tex:null, ttype:Astex.Token.DEFINITION, category:Astex.Token.MISC});
//Astex.Token.addToken({input:"dy",   tag:"mi", output:"{:d y:}", description:"dy", tex:null, ttype:Astex.Token.DEFINITION, category:Astex.Token.MISC});
//Astex.Token.addToken({input:"dz",   tag:"mi", output:"{:d z:}", description:"dz", tex:null, ttype:Astex.Token.DEFINITION, category:Astex.Token.MISC});
//Astex.Token.addToken({input:"dt",   tag:"mi", output:"{:d t:}", description:"dt", tex:null, ttype:Astex.Token.DEFINITION, category:Astex.Token.MISC});

Astex.Token.addToken({input:"oint", tag:"mo", output:"\u222E", description:"o-integral", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"\\oint",	tag:"mo", output:"\u222E", description:"o-integral", ttype:Astex.Token.CONST, category:Astex.Token.MISC});

Astex.Token.addToken({input:"del",  tag:"mo", output:"\u2202", description:"partial", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"\\del",  tag:"mo", output:"\u2202", description:"partial", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"partial",	tag:"mo", output:"\u2202", description:"partial", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"\\partial",	tag:"mo", output:"\u2202", description:"partial", ttype:Astex.Token.CONST, category:Astex.Token.MISC});

Astex.Token.addToken({input:"grad", tag:"mo", output:"\u2207", description:"gradient", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"\\grad", tag:"mo", output:"\u2207", description:"gradient", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"nabla",	tag:"mo", output:"\u2207", description:"gradient", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"\\nabla",	tag:"mo", output:"\u2207", description:"gradient", ttype:Astex.Token.CONST, category:Astex.Token.MISC});

Astex.Token.addToken({input:"+-",   tag:"mo", output:"\u00B1", description:"+-", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"pm",		tag:"mo", output:"\u00B1", description:"+-", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"\\pm",		tag:"mo", output:"\u00B1", description:"+-", ttype:Astex.Token.CONST, category:Astex.Token.MISC});

Astex.Token.addToken({input:"-+",   tag:"mo", output:"\u2213", description:"-+", ttype:Astex.Token.CONST, category:Astex.Token.MISC});		// added
Astex.Token.addToken({input:"mp",		tag:"mo", output:"\u2213", description:"-+", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"\\mp",		tag:"mo", output:"\u2213", description:"-+", ttype:Astex.Token.CONST, category:Astex.Token.MISC});

Astex.Token.addToken({input:"O/",   tag:"mo", output:"\u2205", description:"empty-set", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"emptyset",	tag:"mo", output:"\u2205", description:"empty-set", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"\\emptyset",	tag:"mo", output:"\u2205", description:"empty-set", ttype:Astex.Token.CONST, category:Astex.Token.MISC});

Astex.Token.addToken({input:"oo",   tag:"mo", output:"\u221E", description:"oo", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"infty",	tag:"mo", output:"\u221E", description:"oo", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"\\infty",	tag:"mo", output:"\u221E", description:"oo", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"infinity",	tag:"mo", output:"\u221E", description:"oo", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"\\infinity",	tag:"mo", output:"\u221E", description:"oo", ttype:Astex.Token.CONST, category:Astex.Token.MISC});

Astex.Token.addToken({input:"aleph", tag:"mo", output:"\u2135", description:"aleph", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"\\aleph",	tag:"mo", output:"\u2135", description:"aleph", ttype:Astex.Token.CONST, category:Astex.Token.MISC});

Astex.Token.addToken({input:":.",  tag:"mo", output:"\u2234",  description:":.", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"therefore",	tag:"mo", output:"\u2234", description:":.", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"\\therefore",	tag:"mo", output:"\u2234", description:":.", ttype:Astex.Token.CONST, category:Astex.Token.MISC});

Astex.Token.addToken({input:"/_",  tag:"mo", output:"\u2220",  description:"angle", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"angle",	tag:"mo", output:"\u2220", description:"angle", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"\\angle",	tag:"mo", output:"\u2220", description:"angle", ttype:Astex.Token.CONST, category:Astex.Token.MISC});

Astex.Token.addToken({input:"...",  tag:"mi", output:"...",    description:"ldots", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"ldots",	tag:"mi", output:"\u2026", description:"ldots", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"\\ldots",	tag:"mi", output:"\u2026", description:"ldots", ttype:Astex.Token.CONST, category:Astex.Token.MISC});

Astex.Token.addToken({input:"cdots", tag:"mi", output:"\u22EF", description:"cdots", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"\\cdots",	tag:"mi", output:"\u22EF", description:"cdots", ttype:Astex.Token.CONST, category:Astex.Token.MISC});

Astex.Token.addToken({input:"vdots", tag:"mi", output:"\u22EE", description:"vdots", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"\\vdots",	tag:"mi", output:"\u22EE", description:"vdots", ttype:Astex.Token.CONST, category:Astex.Token.MISC});

Astex.Token.addToken({input:"ddots", tag:"mi", output:"\u22F1", description:"ddots", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"\\ddots",	tag:"mi", output:"\u22F1", description:"ddots", ttype:Astex.Token.CONST, category:Astex.Token.MISC});

Astex.Token.addToken({input:"rddots", tag:"mi", output:"\u22F2", description:"ddots-right", ttype:Astex.Token.CONST, category:Astex.Token.MISC});	// added
Astex.Token.addToken({input:"\\rddots",	tag:"mi", output:"\u22F2", description:"ddots-right", ttype:Astex.Token.CONST, category:Astex.Token.MISC});

Astex.Token.addToken({input:"diamond", tag:"mo", output:"\u22C4", description:"diamond", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"\\diamond",	tag:"mo", output:"\u22C4", description:"diamond", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
//Astex.Token.addToken({input:"\\Diamond",	  tag:"mo", output:"\u25CA", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"Diamond",	tag:"mo", output:"\u25C7", description:"diamond", ttype:Astex.Token.CONST, category:Astex.Token.MISC});		// ???
Astex.Token.addToken({input:"\\Diamond",	tag:"mo", output:"\u25C7", description:"diamond", ttype:Astex.Token.CONST, category:Astex.Token.MISC});		// ???

Astex.Token.addToken({input:"square", tag:"mo", output:"\u25A1", description:"square", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"\\square",	tag:"mo", output:"\u25AB", description:"square", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"Box",	tag:"mo", output:"\u25A1", description:"square", ttype:Astex.Token.CONST, category:Astex.Token.MISC});		// ???
Astex.Token.addToken({input:"\\Box",	tag:"mo", output:"\u25A1", description:"square", ttype:Astex.Token.CONST, category:Astex.Token.MISC});		// ???

Astex.Token.addToken({input:"|__", tag:"mo", output:"\u230A",  description:"|_", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"lfloor", tag:"mo", output:"\u230A",  description:"|_", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"\\lfloor", tag:"mo", output:"\u230A",  description:"|_", ttype:Astex.Token.CONST, category:Astex.Token.MISC});

Astex.Token.addToken({input:"__|", tag:"mo", output:"\u230B",  description:"_|", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"rfloor", tag:"mo", output:"\u230B",  description:"_|", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"\\rfloor", tag:"mo", output:"\u230B",  description:"_|", ttype:Astex.Token.CONST, category:Astex.Token.MISC});

Astex.Token.addToken({input:"|~", tag:"mo", output:"\u2308",  description:"|~", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"lceiling", tag:"mo", output:"\u2308",  description:"|~", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"\\lceiling", tag:"mo", output:"\u2308",  description:"|~", ttype:Astex.Token.CONST, category:Astex.Token.MISC});

Astex.Token.addToken({input:"~|", tag:"mo", output:"\u2309",  description:"~|", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"rceiling", tag:"mo", output:"\u2309",  description:"~|", ttype:Astex.Token.CONST, category:Astex.Token.MISC});
Astex.Token.addToken({input:"\\rceiling", tag:"mo", output:"\u2309",  description:"~|", ttype:Astex.Token.CONST, category:Astex.Token.MISC});

Astex.Token.addToken({input:"CC",  tag:"mi", output:"\u2102", description:"complex", ttype:Astex.Token.CONST, category:Astex.Token.MISC});

Astex.Token.addToken({input:"NN",  tag:"mi", output:"\u2115", description:"naturals", ttype:Astex.Token.CONST, category:Astex.Token.MISC});

Astex.Token.addToken({input:"QQ",  tag:"mi", output:"\u211A", description:"rationals", ttype:Astex.Token.CONST, category:Astex.Token.MISC});

Astex.Token.addToken({input:"RR",  tag:"mi", output:"\u211D", description:"reals", ttype:Astex.Token.CONST, category:Astex.Token.MISC});

Astex.Token.addToken({input:"ZZ",  tag:"mi", output:"\u2124", description:"integers", ttype:Astex.Token.CONST, category:Astex.Token.MISC});


//Astex.Token.addToken({input:"f",   tag:"mi", output:"f",      description:"f", tex:null, ttype:Astex.Token.UNARY, category:Astex.Token.MISC, func:true});
//Astex.Token.addToken({input:"g",   tag:"mi", output:"g",      description:"g", tex:null, ttype:Astex.Token.UNARY, category:Astex.Token.MISC, func:true});


//standard functions (all were originally "mo" tags)
// should the "mi" tags be "mtext" instead ???
Astex.Token.addToken({input:"sin",  tag:"mi", output:"sin", description:"sin", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"\\sin",    tag:"mi", output:"sin",    description:"sin",    ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"cos",  tag:"mi", output:"cos", description:"cos", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"\\cos",  tag:"mi", output:"cos", description:"cos", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"tan",  tag:"mi", output:"tan", description:"tan", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"\\tan",  tag:"mi", output:"tan", description:"tan", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"cot",  tag:"mi", output:"cot", description:"cot", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"\\cot",  tag:"mi", output:"cot", description:"cot", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"sec",  tag:"mi", output:"sec", description:"sec", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"\\sec",  tag:"mi", output:"sec", description:"sec", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"csc",  tag:"mi", output:"csc", description:"csc", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"\\csc",  tag:"mi", output:"csc", description:"csc", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});

Astex.Token.addToken({input:"sinh", tag:"mi", output:"sinh", description:"sinh", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"\\sinh", tag:"mi", output:"sinh", description:"sinh", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"cosh", tag:"mi", output:"cosh", description:"cosh", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"\\cosh", tag:"mi", output:"cosh", description:"cosh", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"tanh", tag:"mi", output:"tanh", description:"tanh", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"\\tanh", tag:"mi", output:"tanh", description:"tanh", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"coth",  tag:"mi", output:"coth", description:"coth", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"\\coth",  tag:"mi", output:"coth", description:"coth", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"sech",  tag:"mi", output:"sech", description:"sech", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"\\sech",  tag:"mi", output:"sech", description:"sech", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"csch",  tag:"mi", output:"csch", description:"csch", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"\\csch",  tag:"mi", output:"csch", description:"csch", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});

Astex.Token.addToken({input:"arccos", tag:"mi", output:"arccos", description:"arccos", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"\\arccos", tag:"mi", output:"arccos", description:"arccos", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"arcsin", tag:"mi", output:"arcsin", description:"arcsin", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"\\arcsin", tag:"mi", output:"arcsin", description:"arcsin", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"arctan", tag:"mi", output:"arctan", description:"arctan", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"\\arctan", tag:"mi", output:"arctan", description:"arctan", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"arcsec", tag:"mi", output:"arcsec", description:"arcsec", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"\\arcsec", tag:"mi", output:"arcsec", description:"arcsec", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"arccsc", tag:"mi", output:"arccsc", description:"arccsc", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"\\arccsc", tag:"mi", output:"arccsc", description:"arccsc", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"arccot", tag:"mi", output:"arccot", description:"arccot", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"\\arccot", tag:"mi", output:"arccot", description:"arccot", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"arccosh", tag:"mi", output:"arccosh", description:"arccosh", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"\\arccosh", tag:"mi", output:"arccosh", description:"arccosh", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"arcsinh", tag:"mi", output:"arcsinh", description:"arcsinh", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"\\arcsinh", tag:"mi", output:"arcsinh", description:"arcsinh", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"arctanh", tag:"mi", output:"arctanh", description:"arctanh", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"\\arctanh", tag:"mi", output:"arctanh", description:"arctanh", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"arcsech", tag:"mi", output:"arcsech", description:"arcsech", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"\\arcsech", tag:"mi", output:"arcsech", description:"arcsech", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"arccsch", tag:"mi", output:"arccsch", description:"arccsch", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"\\arccsch", tag:"mi", output:"arccsch", description:"arccsch", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"arccoth", tag:"mi", output:"arccoth", description:"arccoth", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"\\arccoth", tag:"mi", output:"arccoth", description:"arccoth", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"log",  tag:"mi", output:"log", description:"log", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"\\log",  tag:"mi", output:"log", description:"log", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"ln",   tag:"mi", output:"ln",  description:"ln", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"\\ln",   tag:"mi", output:"ln",  description:"ln", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"det",  tag:"mi", output:"det", description:"det", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"\\det",  tag:"mi", output:"det", description:"det", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"dim",  tag:"mi", output:"dim", description:"dim", ttype:Astex.Token.CONST, category:Astex.Token.STDFUNCTION});
Astex.Token.addToken({input:"\\dim",  tag:"mi", output:"dim", description:"dim", ttype:Astex.Token.CONST, category:Astex.Token.STDFUNCTION});
Astex.Token.addToken({input:"mod",  tag:"mi", output:"mod", description:"mod", ttype:Astex.Token.CONST, category:Astex.Token.STDFUNCTION});
Astex.Token.addToken({input:"\\mod",  tag:"mi", output:"mod", description:"mod", ttype:Astex.Token.CONST, category:Astex.Token.STDFUNCTION});
Astex.Token.addToken({input:"gcd",  tag:"mi", output:"gcd", description:"gcd", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"\\gcd",  tag:"mi", output:"gcd", description:"gcd", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"lcm",  tag:"mi", output:"lcm", description:"lcm", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"\\lcm",  tag:"mi", output:"lcm", description:"lcm", ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"lub",  tag:"mi", output:"lub", description:"lub", ttype:Astex.Token.CONST, category:Astex.Token.STDFUNCTION});
Astex.Token.addToken({input:"\\lub",  tag:"mi", output:"lub", description:"lub", ttype:Astex.Token.CONST, category:Astex.Token.STDFUNCTION});
Astex.Token.addToken({input:"glb",  tag:"mi", output:"glb", description:"glb", ttype:Astex.Token.CONST, category:Astex.Token.STDFUNCTION});
Astex.Token.addToken({input:"\\glb",  tag:"mi", output:"glb", description:"glb", ttype:Astex.Token.CONST, category:Astex.Token.STDFUNCTION});
Astex.Token.addToken({input:"min",  tag:"mi", output:"min", description:"min", ttype:Astex.Token.UNDEROVER, category:Astex.Token.STDFUNCTION});
Astex.Token.addToken({input:"\\min",  tag:"mi", output:"min", description:"min", ttype:Astex.Token.UNDEROVER, category:Astex.Token.STDFUNCTION});
Astex.Token.addToken({input:"max",  tag:"mi", output:"max", description:"max", ttype:Astex.Token.UNDEROVER, category:Astex.Token.STDFUNCTION});
Astex.Token.addToken({input:"\\max",  tag:"mi", output:"max", description:"max", ttype:Astex.Token.UNDEROVER, category:Astex.Token.STDFUNCTION});

//standard functions
//Note UNDEROVER *must* have tag:"mo" to work properly 
// \\inf , \\lim , \\liminf , \\limsup , \\max , \\min , \\sup originally had "mo" tags 
Astex.Token.addToken({input:"arg",    tag:"mi", output:"arg",    description:"arg",    ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"\\arg",    tag:"mi", output:"arg",    description:"arg",    ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"deg",    tag:"mi", output:"deg",    description:"deg",    ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"\\deg",    tag:"mi", output:"deg",    description:"deg",    ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"exp",    tag:"mi", output:"exp",    description:"exp",    ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"\\exp",    tag:"mi", output:"exp",    description:"exp",    ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"hom",    tag:"mi", output:"hom",    description:"hom",    ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"\\hom",    tag:"mi", output:"hom",    description:"hom",    ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"inf",    tag:"mi", output:"inf",    description:"inf",    ttype:Astex.Token.UNDEROVER, category:Astex.Token.STDFUNCTION});
Astex.Token.addToken({input:"\\inf",    tag:"mi", output:"inf",    description:"inf",    ttype:Astex.Token.UNDEROVER, category:Astex.Token.STDFUNCTION});
Astex.Token.addToken({input:"ker",    tag:"mi", output:"ker",    description:"ker",    ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"\\ker",    tag:"mi", output:"ker",    description:"ker",    ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"lg",	    tag:"mi", output:"lg",     description:"lg",     ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"\\lg",	    tag:"mi", output:"lg",     description:"lg",     ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"lim",  tag:"mi", output:"lim", description:"lim", ttype:Astex.Token.UNDEROVER, category:Astex.Token.STDFUNCTION});
Astex.Token.addToken({input:"\\lim",    tag:"mi", output:"lim",    description:"lim",    ttype:Astex.Token.UNDEROVER, category:Astex.Token.STDFUNCTION});
Astex.Token.addToken({input:"Lim",  tag:"mi", output:"Lim", description:"Lim", ttype:Astex.Token.UNDEROVER, category:Astex.Token.STDFUNCTION});
Astex.Token.addToken({input:"\\Lim",  tag:"mi", output:"Lim", description:"Lim", ttype:Astex.Token.UNDEROVER, category:Astex.Token.STDFUNCTION});
Astex.Token.addToken({input:"liminf", tag:"mi", output:"liminf", description:"liminf", ttype:Astex.Token.UNDEROVER, category:Astex.Token.STDFUNCTION});
Astex.Token.addToken({input:"\\liminf", tag:"mi", output:"liminf", description:"liminf", ttype:Astex.Token.UNDEROVER, category:Astex.Token.STDFUNCTION});
Astex.Token.addToken({input:"limsup", tag:"mi", output:"limsup", description:"limsup", ttype:Astex.Token.UNDEROVER, category:Astex.Token.STDFUNCTION});
Astex.Token.addToken({input:"\\limsup", tag:"mi", output:"limsup", description:"limsup", ttype:Astex.Token.UNDEROVER, category:Astex.Token.STDFUNCTION});
Astex.Token.addToken({input:"\\max",    tag:"mi", output:"max",    description:"max",    ttype:Astex.Token.UNDEROVER, category:Astex.Token.STDFUNCTION});
Astex.Token.addToken({input:"\\min",    tag:"mi", output:"min",    description:"min",    ttype:Astex.Token.UNDEROVER, category:Astex.Token.STDFUNCTION});
Astex.Token.addToken({input:"Pr",	    tag:"mi", output:"Pr",     description:"Pr",     ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"\\Pr",	    tag:"mi", output:"Pr",     description:"Pr",     ttype:Astex.Token.UNARY, category:Astex.Token.STDFUNCTION, func:true});
Astex.Token.addToken({input:"sup",    tag:"mi", output:"sup",    description:"sup",    ttype:Astex.Token.UNDEROVER, category:Astex.Token.STDFUNCTION});
Astex.Token.addToken({input:"\\sup",    tag:"mi", output:"sup",    description:"sup",    ttype:Astex.Token.UNDEROVER, category:Astex.Token.STDFUNCTION});


//arrows
// some of the arrow output values may be incorrect for AsciiMathML
Astex.Token.addToken({input:"uarr", tag:"mo", output:"\u2191", description:"up-arrow", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
Astex.Token.addToken({input:"uparrow",	tag:"mo", output:"\u2191", description:"up-arrow", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
Astex.Token.addToken({input:"\\uparrow",	tag:"mo", output:"\u2191", description:"up-arrow", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});

Astex.Token.addToken({input:"darr", tag:"mo", output:"\u2193", description:"down-arrow", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
Astex.Token.addToken({input:"downarrow",	tag:"mo", output:"\u2193", description:"down-arrow", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
Astex.Token.addToken({input:"\\downarrow",	tag:"mo", output:"\u2193", description:"down-arrow", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});

Astex.Token.addToken({input:"->",   tag:"mo", output:"\u2192", description:"->", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
Astex.Token.addToken({input:"rarr", tag:"mo", output:"\u2192", description:"->", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
Astex.Token.addToken({input:"to",			tag:"mo", output:"\u2192", description:"->", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
Astex.Token.addToken({input:"rightarrow",		tag:"mo", output:"\u2192", description:"->", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
Astex.Token.addToken({input:"\\to",			tag:"mo", output:"\u2192", description:"->", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
Astex.Token.addToken({input:"\\rightarrow",		tag:"mo", output:"\u2192", description:"->", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});

Astex.Token.addToken({input:">->",   tag:"mo", output:"\u21A3", description:">->", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
Astex.Token.addToken({input:"rightarrowtail",   tag:"mo", output:"\u21A3", description:">->", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
Astex.Token.addToken({input:"\\rightarrowtail",   tag:"mo", output:"\u21A3", description:">->", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});

Astex.Token.addToken({input:"->>",   tag:"mo", output:"\u21A0", description:"->>", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
Astex.Token.addToken({input:"twoheadrightarrow",   tag:"mo", output:"\u21A0", description:"->>", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
Astex.Token.addToken({input:"\\twoheadrightarrow",   tag:"mo", output:"\u21A0", description:"->>", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});

//?
//Astex.Token.addToken({input:">->>",   tag:"mo", output:"\u2916", description:">->>", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
//Astex.Token.addToken({input:"twoheadrightarrowtail",   tag:"mo", output:"\u2916", description:">->>", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
//Astex.Token.addToken({input:"\\twoheadrightarrowtail",   tag:"mo", output:"\u2916", description:">->>", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});

Astex.Token.addToken({input:"|->",  tag:"mo", output:"\u21A6", description:"|->", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
Astex.Token.addToken({input:"mapsto",  tag:"mo", output:"\u21A6", description:"|->", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
Astex.Token.addToken({input:"\\mapsto",  tag:"mo", output:"\u21A6", description:"|->", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});

Astex.Token.addToken({input:"<-", tag:"mo", output:"\u2190", description:"<-", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
Astex.Token.addToken({input:"larr", tag:"mo", output:"\u2190", description:"<-", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
Astex.Token.addToken({input:"leftarrow",		tag:"mo", output:"\u2190", description:"<-", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
Astex.Token.addToken({input:"\\leftarrow",		tag:"mo", output:"\u2190", description:"<-", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
Astex.Token.addToken({input:"gets",		tag:"mo", output:"\u2190", description:"<-", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
Astex.Token.addToken({input:"\\gets",		tag:"mo", output:"\u2190", description:"<-", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});

//?
//Astex.Token.addToken({input:"<-<",   tag:"mo", output:"l\u21A3", description:"<-<", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
//Astex.Token.addToken({input:"leftarrowtail",   tag:"mo", output:"l\u21A3", description:"<-<", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
//Astex.Token.addToken({input:"\\leftarrowtail",   tag:"mo", output:"l\u21A3", description:"<-<", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});

//?
//Astex.Token.addToken({input:"<<-",   tag:"mo", output:"l\u21A0", description:"<<-", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
//Astex.Token.addToken({input:"twoheadleftarrow",   tag:"mo", output:"l\u21A0", description:"<<-", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
//Astex.Token.addToken({input:"\\twoheadleftarrow",   tag:"mo", output:"l\u21A0", description:"<<-", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});

//?
//Astex.Token.addToken({input:"<<-<",   tag:"mo", output:"l\u2916", description:"<<-<", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
//Astex.Token.addToken({input:"<<-<",   tag:"mo", output:"\u2B3B", description:"<<-<", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
//Astex.Token.addToken({input:"twoheadleftarrowtail",   tag:"mo", output:"\u2B3B", description:"<<-<", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
//Astex.Token.addToken({input:"\\twoheadleftarrowtail",   tag:"mo", output:"\u2B3B", description:"<<-<", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});

Astex.Token.addToken({input:"<->", tag:"mo", output:"\u2194", description:"<->", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
Astex.Token.addToken({input:"harr", tag:"mo", output:"\u2194", description:"<->", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
Astex.Token.addToken({input:"leftrightarrow",	tag:"mo", output:"\u2194", description:"<->", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
Astex.Token.addToken({input:"\\leftrightarrow",	tag:"mo", output:"\u2194", description:"<->", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});

//?
// => implies \implies if \if
Astex.Token.addToken({input:"rArr", tag:"mo", output:"\u21D2", description:"=>", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
Astex.Token.addToken({input:"Rightarrow",		tag:"mo", output:"\u21D2", description:"=>", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
Astex.Token.addToken({input:"\\Rightarrow",		tag:"mo", output:"\u21D2", description:"=>", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
//Astex.Token.addToken({input:"\\implies",		tag:"mo", output:"\u21D2", description:"=>", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});

//?
Astex.Token.addToken({input:"lArr", tag:"mo", output:"\u21D0", description:"<==", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
Astex.Token.addToken({input:"Leftarrow",		tag:"mo", output:"\u21D0", description:"<==", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
Astex.Token.addToken({input:"\\Leftarrow",		tag:"mo", output:"\u21D0", description:"<==", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});

//?
// <=> iff \iff 
//Astex.Token.addToken({input:"<=>", tag:"mo", output:"\u21D4", description:"<=>", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
Astex.Token.addToken({input:"hArr", tag:"mo", output:"\u21D4", description:"<=>", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
Astex.Token.addToken({input:"Leftrightarrow",	tag:"mo", output:"\u21D4", description:"<=>", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
Astex.Token.addToken({input:"\\Leftrightarrow",	tag:"mo", output:"\u21D4", description:"<=>", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
Astex.Token.addToken({input:"Longleftrightarrow",	tag:"mo", output:"\u21D4", description:"<=>", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});
Astex.Token.addToken({input:"\\Longleftrightarrow",	tag:"mo", output:"\u21D4", description:"<=>", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});

//Astex.Token.addToken({input:"\\updownarrow",	tag:"mo", output:"\u2195", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});			// ???
//Astex.Token.addToken({input:"\\iff", 		tag:"mo", output:"~\\Longleftrightarrow~", description:"<=>", ttype:Astex.Token.DEFINITION, category:Astex.Token.ARROW});
//Astex.Token.addToken({input:"\\Uparrow",		tag:"mo", output:"\u21D1", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});			// ???
//Astex.Token.addToken({input:"\\Downarrow",		tag:"mo", output:"\u21D3", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});			// ???
//Astex.Token.addToken({input:"\\Updownarrow",	tag:"mo", output:"\u21D5", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});			// ???
//Astex.Token.addToken({input:"\\mapsto",		tag:"mo", output:"\u21A6", description:"|->", ttype:Astex.Token.CONST, category:Astex.Token.ARROW});	// ???
//Astex.Token.addToken({input:"\\longleftarrow",	tag:"mo", output:"\u2190", ttype:Astex.Token.LONG, category:Astex.Token.ARROW});
//Astex.Token.addToken({input:"\\longrightarrow",	tag:"mo", output:"\u2192", ttype:Astex.Token.LONG, category:Astex.Token.ARROW});
//Astex.Token.addToken({input:"\\longleftrightarrow",	tag:"mo", output:"\u2194", ttype:Astex.Token.LONG, category:Astex.Token.ARROW});
//Astex.Token.addToken({input:"\\Longleftarrow",	tag:"mo", output:"\u21D0", ttype:Astex.Token.LONG, category:Astex.Token.ARROW});
//Astex.Token.addToken({input:"\\Longrightarrow",	tag:"mo", output:"\u21D2", ttype:Astex.Token.LONG, category:Astex.Token.ARROW});
//Astex.Token.addToken({input:"\\implies",		tag:"mo", output:"\u21D2", ttype:Astex.Token.LONG, category:Astex.Token.ARROW});
//Astex.Token.addToken({input:"\\Longleftrightarrow", tag:"mo", output:"\u21D4", ttype:Astex.Token.LONG, category:Astex.Token.ARROW});
//Astex.Token.addToken({input:"\\longmapsto",		tag:"mo", output:"\u21A6", ttype:Astex.Token.CONST, category:Astex.Token.ARROW}); // disaster if LONG




//commands with argument
Astex.Token.addToken({input:"color", tag:"mstyle", output:"color",    description:"change color", ttype:Astex.Token.BINARY, category:Astex.Token.COMMANDWITHARGS});
Astex.Token.addToken({input:"\\color", tag:"mstyle", output:"color",    description:"change color", ttype:Astex.Token.BINARY, category:Astex.Token.COMMANDWITHARGS});

Astex.Token.addToken({input:"hide", tag:"mphantom", output:"hide", description:"hides input", ttype:Astex.Token.UNARY, category:Astex.Token.COMMANDWITHARGS});
Astex.Token.addToken({input:"\\hide", tag:"mphantom", output:"hide", description:"hides input", ttype:Astex.Token.UNARY, category:Astex.Token.COMMANDWITHARGS});

Astex.Token.addToken({input:"sqrt", tag:"msqrt", output:"sqrt", description:"sqrt", ttype:Astex.Token.UNARY, category:Astex.Token.COMMANDWITHARGS});
Astex.Token.addToken({input:"\\sqrt",	tag:"msqrt", output:"sqrt",	description:"sqrt", ttype:Astex.Token.UNARY, category:Astex.Token.COMMANDWITHARGS});

Astex.Token.addToken({input:"root", tag:"mroot", output:"root", description:"root", ttype:Astex.Token.BINARY, category:Astex.Token.COMMANDWITHARGS});
Astex.Token.addToken({input:"\\root",	tag:"mroot", output:"root",	description:"root", ttype:Astex.Token.BINARY, category:Astex.Token.COMMANDWITHARGS});

Astex.Token.addToken({input:"longdiv", tag:"menclose", atname:"notation", atval:"longdiv", output:"longdiv", description:"longdiv", ttype:Astex.Token.UNARY, category:Astex.Token.COMMANDWITHARGS});
Astex.Token.addToken({input:"\\longdiv", tag:"menclose", atname:"notation", atval:"longdiv", output:"longdiv", description:"longdiv", ttype:Astex.Token.UNARY, category:Astex.Token.COMMANDWITHARGS});

Astex.Token.addToken({input:"/",    tag:"mfrac", output:"/",    description:"fraction", ttype:Astex.Token.INFIX, category:Astex.Token.COMMANDWITHARGS});
Astex.Token.addToken({input:"frac", tag:"mfrac", output:"/",    description:"fraction", ttype:Astex.Token.BINARY, category:Astex.Token.COMMANDWITHARGS});
Astex.Token.addToken({input:"\\frac",	tag:"mfrac", output:"/",	description:"fraction", ttype:Astex.Token.BINARY, category:Astex.Token.COMMANDWITHARGS});

Astex.Token.addToken({input:"stackrel", tag:"mover", output:"stackrel", description:"stackrel", ttype:Astex.Token.BINARY, category:Astex.Token.COMMANDWITHARGS});
Astex.Token.addToken({input:"\\stackrel",    tag:"mover", output:"stackrel", description:"stackrel", ttype:Astex.Token.BINARY, category:Astex.Token.COMMANDWITHARGS});

Astex.Token.addToken({input:"atop",	tag:"mfrac", output:"",		description:"", ttype:Astex.Token.INFIX, category:Astex.Token.COMMANDWITHARGS});
Astex.Token.addToken({input:"\\atop",	tag:"mfrac", output:"",		description:"", ttype:Astex.Token.INFIX, category:Astex.Token.COMMANDWITHARGS});

Astex.Token.addToken({input:"choose",      tag:"mfrac", output:"",	description:"", ttype:Astex.Token.INFIX, category:Astex.Token.COMMANDWITHARGS});
Astex.Token.addToken({input:"\\choose",      tag:"mfrac", output:"",	description:"", ttype:Astex.Token.INFIX, category:Astex.Token.COMMANDWITHARGS});

Astex.Token.addToken({input:"_",    tag:"msub", output:"_",    description:"subscript", ttype:Astex.Token.INFIX, category:Astex.Token.COMMANDWITHARGS});

Astex.Token.addToken({input:"^",    tag:"msup", output:"^",    description:"superscript", ttype:Astex.Token.INFIX, category:Astex.Token.COMMANDWITHARGS});


Astex.Token.addToken({input:"text", tag:"mtext", output:"text", description:"display text", ttype:Astex.Token.TEXT, category:Astex.Token.COMMANDWITHARGS});
Astex.Token.addToken({input:"mathrm",	tag:"mtext", output:"text",	description:"display text", ttype:Astex.Token.TEXT, category:Astex.Token.COMMANDWITHARGS});
Astex.Token.addToken({input:"\\mathrm",	tag:"mtext", output:"text",	description:"display text", ttype:Astex.Token.TEXT, category:Astex.Token.COMMANDWITHARGS});
Astex.Token.addToken({input:"mbox", tag:"mtext", output:"mbox", description:"display text", ttype:Astex.Token.TEXT, category:Astex.Token.COMMANDWITHARGS});
Astex.Token.addToken({input:"\\mbox",	tag:"mtext", output:"mbox",	description:"display text", ttype:Astex.Token.TEXT, category:Astex.Token.COMMANDWITHARGS});


//typestyles
Astex.Token.addToken({input:"italic", tag:"mstyle", atname:"fontstyle", atval:"italic", output:"italic", description:"Italic", ttype:Astex.Token.UNARY, category:Astex.Token.TYPESTYLE});
Astex.Token.addToken({input:"\\italic", tag:"mstyle", atname:"fontstyle", atval:"italic", output:"italic", description:"Italic", ttype:Astex.Token.UNARY, category:Astex.Token.TYPESTYLE});
Astex.Token.addToken({input:"bb", tag:"mstyle", atname:"fontweight", atval:"bold", output:"bb", description:"Bold Face", ttype:Astex.Token.UNARY, category:Astex.Token.TYPESTYLE});
Astex.Token.addToken({input:"mathbf", tag:"mstyle", atname:"fontweight", atval:"bold", output:"mathbf", description:"Bold Face", ttype:Astex.Token.UNARY, category:Astex.Token.TYPESTYLE});
Astex.Token.addToken({input:"textbf", tag:"mstyle", atname:"fontweight", atval:"bold", output:"mathbf", description:"Bold Face", ttype:Astex.Token.UNARY, category:Astex.Token.TYPESTYLE});
Astex.Token.addToken({input:"\\mathbf", tag:"mstyle", atname:"fontweight", atval:"bold", output:"mathbf", description:"Bold Face", ttype:Astex.Token.UNARY, category:Astex.Token.TYPESTYLE});
Astex.Token.addToken({input:"\\textbf", tag:"mstyle", atname:"fontweight", atval:"bold", output:"mathbf", description:"Bold Face", ttype:Astex.Token.UNARY, category:Astex.Token.TYPESTYLE});

// fonts
Astex.Token.addToken({input:"cc",  tag:"mstyle", atname:"mathvariant", atval:"script", output:"cc", description:"Calligraphy", ttype:Astex.Token.UNARY, category:Astex.Token.FONTCHANGE, codes:Astex.Token.AMcal});
Astex.Token.addToken({input:"mathcal", tag:"mstyle", atname:"mathvariant", atval:"script", output:"mathcal", description:"Calligraphy", ttype:Astex.Token.UNARY, category:Astex.Token.FONTCHANGE, codes:Astex.Token.AMcal});
Astex.Token.addToken({input:"\\mathcal",tag:"mstyle", atname:"mathvariant", atval:"script", output:"mathcal", description:"Calligraphy", ttype:Astex.Token.UNARY, category:Astex.Token.FONTCHANGE, codes:Astex.Token.AMcal});

Astex.Token.addToken({input:"bbb", tag:"mstyle", atname:"mathvariant", atval:"double-struck", output:"bbb", description:"BlackBoard Bold", tex:null, ttype:Astex.Token.UNARY, category:Astex.Token.FONTCHANGE, codes:Astex.Token.AMbbb});
Astex.Token.addToken({input:"mathbb", tag:"mstyle", atname:"mathvariant", atval:"double-struck", output:"mathbb", description:"BlackBoard Bold", tex:null, ttype:Astex.Token.UNARY, category:Astex.Token.FONTCHANGE, codes:Astex.Token.AMbbb});
Astex.Token.addToken({input:"\\mathbb", tag:"mstyle", atname:"mathvariant", atval:"double-struck", output:"mathbb", description:"BlackBoard Bold", tex:null, ttype:Astex.Token.UNARY, category:Astex.Token.FONTCHANGE, codes:Astex.Token.AMbbb});

Astex.Token.addToken({input:"tt",  tag:"mstyle", atname:"fontfamily", atval:"monospace", output:"tt", description:"True Type", tex:null, ttype:Astex.Token.UNARY, category:Astex.Token.FONTCHANGE});
Astex.Token.addToken({input:"mathtt", tag:"mstyle", atname:"fontfamily", atval:"monospace", output:"mathtt", description:"True Type", tex:null, ttype:Astex.Token.UNARY, category:Astex.Token.FONTCHANGE});
Astex.Token.addToken({input:"\\mathtt", tag:"mstyle", atname:"fontfamily", atval:"monospace", output:"mathtt", description:"True Type", tex:null, ttype:Astex.Token.UNARY, category:Astex.Token.FONTCHANGE});

//Astex.Token.addToken({input:"\\mathbf", tag:"mstyle", atname:"mathvariant", atval:"bold", ttype:Astex.Token.UNARY});
//Astex.Token.addToken({input:"\\textbf", tag:"mstyle", atname:"mathvariant", atval:"bold", ttype:Astex.Token.UNARY});

/*
Astex.Token.addToken({input:"sf", tag:"mstyle", atname:"fontfamily", atval:"sans-serif", output:"sf", description:"sf", tex:null, ttype:Astex.Token.UNARY});
Astex.Token.addToken({input:"mathsf", tag:"mstyle", atname:"fontfamily", atval:"sans-serif", output:"mathsf", description:"mathsf", tex:null, ttype:Astex.Token.UNARY});

Astex.Token.addToken({input:"bbb", tag:"mstyle", atname:"mathvariant", atval:"double-struck", output:"bbb", description:"bbb", tex:null, ttype:Astex.Token.UNARY, codes:Astex.Token.AMbbb});
Astex.Token.addToken({input:"mathbb", tag:"mstyle", atname:"mathvariant", atval:"double-struck", output:"mathbb", description:"mathbb", tex:null, ttype:Astex.Token.UNARY, codes:Astex.Token.AMbbb});


Astex.Token.addToken({input:"tt",  tag:"mstyle", atname:"fontfamily", atval:"monospace", output:"tt", description:"tt", tex:null, ttype:Astex.Token.UNARY});
Astex.Token.addToken({input:"mathtt", tag:"mstyle", atname:"fontfamily", atval:"monospace", output:"mathtt", description:"mathtt", tex:null, ttype:Astex.Token.UNARY});

Astex.Token.addToken({input:"fr",  tag:"mstyle", atname:"mathvariant", atval:"fraktur", output:"fr", description:"fr", tex:null, ttype:Astex.Token.UNARY, codes:Astex.Token.AMfrk});
Astex.Token.addToken({input:"mathfrak",  tag:"mstyle", atname:"mathvariant", atval:"fraktur", output:"mathfrak", description:"mathfrak", tex:null, ttype:Astex.Token.UNARY, codes:Astex.Token.AMfrk});

Astex.Token.addToken({input:"\\displaystyle",tag:"mstyle",atname:"displaystyle",atval:"true", ttype:Astex.Token.UNARY});
Astex.Token.addToken({input:"\\textstyle",tag:"mstyle",atname:"displaystyle",atval:"false", ttype:Astex.Token.UNARY});
Astex.Token.addToken({input:"\\scriptstyle",tag:"mstyle",atname:"scriptlevel",atval:"1", ttype:Astex.Token.UNARY});
Astex.Token.addToken({input:"\\scriptscriptstyle",tag:"mstyle",atname:"scriptlevel",atval:"2", ttype:Astex.Token.UNARY});
Astex.Token.addToken({input:"\\textrm", tag:"mstyle", output:"\\mathrm", ttype:Astex.Token.DEFINITION});
Astex.Token.addToken({input:"\\mathit", tag:"mstyle", atname:"mathvariant", atval:"italic", ttype:Astex.Token.UNARY});
Astex.Token.addToken({input:"\\textit", tag:"mstyle", atname:"mathvariant", atval:"italic", ttype:Astex.Token.UNARY});
Astex.Token.addToken({input:"\\mathtt", tag:"mstyle", atname:"mathvariant", atval:"monospace", ttype:Astex.Token.UNARY});
Astex.Token.addToken({input:"\\texttt", tag:"mstyle", atname:"mathvariant", atval:"monospace", ttype:Astex.Token.UNARY});
Astex.Token.addToken({input:"\\mathsf", tag:"mstyle", atname:"mathvariant", atval:"sans-serif", ttype:Astex.Token.UNARY});
Astex.Token.addToken({input:"\\mathbb", tag:"mstyle", atname:"mathvariant", atval:"double-struck", ttype:Astex.Token.UNARY, codes:Astex.Token.AMbbb});
Astex.Token.addToken({input:"\\mathfrak",tag:"mstyle",atname:"mathvariant", atval:"fraktur",ttype:Astex.Token.UNARY, codes:Astex.Token.AMfrk});
*/

//diacritical marks -- accents
//Astex.Token.addToken({input:"\\acute",	tag:"mover",  output:"\u00B4", ttype:Astex.Token.UNARY, acc:true});		// ???
//Astex.Token.addToken({input:"\\acute",	  tag:"mover",  output:"\u0317", ttype:Astex.Token.UNARY, acc:true});
//Astex.Token.addToken({input:"\\acute",	  tag:"mover",  output:"\u0301", ttype:Astex.Token.UNARY, acc:true});
//Astex.Token.addToken({input:"\\grave",	  tag:"mover",  output:"\u0300", ttype:Astex.Token.UNARY, acc:true});
//Astex.Token.addToken({input:"\\grave",	  tag:"mover",  output:"\u0316", ttype:Astex.Token.UNARY, acc:true});
//Astex.Token.addToken({input:"\\grave",	tag:"mover",  output:"\u0060", ttype:Astex.Token.UNARY, acc:true});		// ???
//Astex.Token.addToken({input:"\\breve",	tag:"mover",  output:"\u02D8", ttype:Astex.Token.UNARY, acc:true});		// ???
//Astex.Token.addToken({input:"\\check",	tag:"mover",  output:"\u02C7", ttype:Astex.Token.UNARY, acc:true});		// ???

Astex.Token.addToken({input:"dot", tag:"mover", output:".",      description:".", ttype:Astex.Token.UNARY, category:Astex.Token.ACCENT, acc:true});
Astex.Token.addToken({input:"\\dot",	tag:"mover",  output:".",      description:".", ttype:Astex.Token.UNARY, category:Astex.Token.ACCENT, acc:true});

Astex.Token.addToken({input:"ddot", tag:"mover", output:"..",    description:"..", ttype:Astex.Token.UNARY, category:Astex.Token.ACCENT, acc:true});
Astex.Token.addToken({input:"\\ddot",	tag:"mover",  output:"..",     description:"..", ttype:Astex.Token.UNARY, category:Astex.Token.ACCENT, acc:true});

Astex.Token.addToken({input:"tdot", tag:"mover", output:"...",    description:"...", ttype:Astex.Token.UNARY, category:Astex.Token.ACCENT, acc:true});
Astex.Token.addToken({input:"\\tdot", tag:"mover", output:"...",    description:"...", ttype:Astex.Token.UNARY, category:Astex.Token.ACCENT, acc:true});


//Astex.Token.addToken({input:"\\ddot",	  tag:"mover",  output:"\u00A8", ttype:Astex.Token.UNARY, category:Astex.Token.ACCENT, acc:true});

//Astex.Token.addToken({input:"\\mathring",	tag:"mover",  output:"\u00B0", ttype:Astex.Token.UNARY, category:Astex.Token.ACCENT, acc:true});

Astex.Token.addToken({input:"vec", tag:"mover", output:"\u2192", description:"->", ttype:Astex.Token.UNARY, category:Astex.Token.ACCENT, acc:true});
Astex.Token.addToken({input:"\\vec",	tag:"mover",  output:"\u20D7", description:"->", ttype:Astex.Token.UNARY, category:Astex.Token.ACCENT, acc:true});
Astex.Token.addToken({input:"overrightarrow",tag:"mover",output:"\u20D7", description:"->", ttype:Astex.Token.UNARY, category:Astex.Token.ACCENT, acc:true});
Astex.Token.addToken({input:"\\overrightarrow",tag:"mover",output:"\u20D7", description:"->", ttype:Astex.Token.UNARY, category:Astex.Token.ACCENT, acc:true});

Astex.Token.addToken({input:"overleftarrow",tag:"mover", output:"\u20D6", description:"<-", ttype:Astex.Token.UNARY, category:Astex.Token.ACCENT, acc:true});
Astex.Token.addToken({input:"\\overleftarrow",tag:"mover", output:"\u20D6", description:"<-", ttype:Astex.Token.UNARY, category:Astex.Token.ACCENT, acc:true});

Astex.Token.addToken({input:"hat", tag:"mover", output:"\u005E", description:"^", ttype:Astex.Token.UNARY, category:Astex.Token.ACCENT, acc:true});
Astex.Token.addToken({input:"\\hat",	tag:"mover",  output:"\u005E", description:"^", ttype:Astex.Token.UNARY, category:Astex.Token.ACCENT, acc:true});
Astex.Token.addToken({input:"widehat",	tag:"mover",  output:"\u0302", description:"^", ttype:Astex.Token.UNARY, category:Astex.Token.ACCENT, acc:true});
Astex.Token.addToken({input:"\\widehat",	tag:"mover",  output:"\u0302", description:"^", ttype:Astex.Token.UNARY, category:Astex.Token.ACCENT, acc:true});

Astex.Token.addToken({input:"tilde",	tag:"mover",  output:"~",      description:"~", ttype:Astex.Token.UNARY, category:Astex.Token.ACCENT, acc:true});
Astex.Token.addToken({input:"\\tilde",	tag:"mover",  output:"~",      description:"~", ttype:Astex.Token.UNARY, category:Astex.Token.ACCENT, acc:true});
//Astex.Token.addToken({input:"\\tilde",	  tag:"mover",  output:"\u0303", ttype:Astex.Token.UNARY, category:Astex.Token.ACCENT, acc:true});
Astex.Token.addToken({input:"widetilde",	tag:"mover",  output:"\u02DC", description:"~", ttype:Astex.Token.UNARY, category:Astex.Token.ACCENT, acc:true});
Astex.Token.addToken({input:"\\widetilde",	tag:"mover",  output:"\u02DC", description:"~", ttype:Astex.Token.UNARY, category:Astex.Token.ACCENT, acc:true});

Astex.Token.addToken({input:"bar", tag:"mover", output:"\u00AF", description:"_", ttype:Astex.Token.UNARY, category:Astex.Token.ACCENT, acc:true});
Astex.Token.addToken({input:"\\bar",	tag:"mover",  output:"\u203E", description:"_", ttype:Astex.Token.UNARY, category:Astex.Token.ACCENT, acc:true});
Astex.Token.addToken({input:"overline", tag:"mover", output:"\u00AF", description:"_", ttype:Astex.Token.UNARY, category:Astex.Token.ACCENT, acc:true});
Astex.Token.addToken({input:"\\overline", tag:"mover", output:"\u00AF", description:"_", ttype:Astex.Token.UNARY, category:Astex.Token.ACCENT, acc:true});

Astex.Token.addToken({input:"overbrace",	tag:"mover",  output:"\u23B4", description:"overbrace", ttype:Astex.Token.UNARY, category:Astex.Token.ACCENT, acc:true});
Astex.Token.addToken({input:"\\overbrace",	tag:"mover",  output:"\u23B4", description:"overbrace", ttype:Astex.Token.UNARY, category:Astex.Token.ACCENT, acc:true});
Astex.Token.addToken({input:"underbrace", tag:"munder", output:"\u23B5", ttype:Astex.Token.UNARY, category:Astex.Token.ACCENT, acc:true});
Astex.Token.addToken({input:"\\underbrace", tag:"munder", output:"\u23B5", ttype:Astex.Token.UNARY, category:Astex.Token.ACCENT, acc:true});

Astex.Token.addToken({input:"overline",	tag:"mover",  output:"\u00AF", ttype:Astex.Token.UNARY, category:Astex.Token.ACCENT, acc:true});
Astex.Token.addToken({input:"\\overline",	tag:"mover",  output:"\u00AF", ttype:Astex.Token.UNARY, category:Astex.Token.ACCENT, acc:true});


Astex.Token.addToken({input:"ul", tag:"munder", output:"\u0332", description:"_", ttype:Astex.Token.UNARY, category:Astex.Token.ACCENT, acc:true});
Astex.Token.addToken({input:"underline",	tag:"munder", output:"\u00AF", description:"_", ttype:Astex.Token.UNARY, category:Astex.Token.ACCENT, acc:true});
Astex.Token.addToken({input:"\\underline",	tag:"munder", output:"\u00AF", description:"_", ttype:Astex.Token.UNARY, category:Astex.Token.ACCENT, acc:true});
//Astex.Token.addToken({input:"underline",	tag:"munder", output:"\u0332", ttype:Astex.Token.UNARY, category:Astex.Token.ACCENT, acc:true});




//fractions
/*
Astex.Token.addToken({input:"\\frac12",	tag:"mo", output:"\u00BD", ttype:Astex.Token.CONST});
Astex.Token.addToken({input:"\\frac14",	tag:"mo", output:"\u00BC", ttype:Astex.Token.CONST});
Astex.Token.addToken({input:"\\frac34",	tag:"mo", output:"\u00BE", ttype:Astex.Token.CONST});
Astex.Token.addToken({input:"\\frac13",	tag:"mo", output:"\u2153", ttype:Astex.Token.CONST});
Astex.Token.addToken({input:"\\frac23",	tag:"mo", output:"\u2154", ttype:Astex.Token.CONST});
Astex.Token.addToken({input:"\\frac15",	tag:"mo", output:"\u2155", ttype:Astex.Token.CONST});
Astex.Token.addToken({input:"\\frac25",	tag:"mo", output:"\u2156", ttype:Astex.Token.CONST});
Astex.Token.addToken({input:"\\frac35",	tag:"mo", output:"\u2157", ttype:Astex.Token.CONST});
Astex.Token.addToken({input:"\\frac45",	tag:"mo", output:"\u2158", ttype:Astex.Token.CONST});
Astex.Token.addToken({input:"\\frac16",	tag:"mo", output:"\u2159", ttype:Astex.Token.CONST});
Astex.Token.addToken({input:"\\frac56",	tag:"mo", output:"\u215A", ttype:Astex.Token.CONST});
Astex.Token.addToken({input:"\\frac18",	tag:"mo", output:"\u215B", ttype:Astex.Token.CONST});
Astex.Token.addToken({input:"\\frac38",	tag:"mo", output:"\u215C", ttype:Astex.Token.CONST});
Astex.Token.addToken({input:"\\frac58",	tag:"mo", output:"\u215D", ttype:Astex.Token.CONST});
Astex.Token.addToken({input:"\\frac78",	tag:"mo", output:"\u215E", ttype:Astex.Token.CONST});
*/





//matrices
Astex.Token.addToken({input:"\\begin{eqnarray}",	output:"X",   description:"X",   ttype:Astex.Token.MATRIX, invisible:true});
Astex.Token.addToken({input:"\\begin{array}",	output:"X",   description:"X",   ttype:Astex.Token.MATRIX, invisible:true});
Astex.Token.addToken({input:"\\\\",			output:"}&{", description:"}&{", ttype:Astex.Token.DEFINITION});
Astex.Token.addToken({input:"\\end{eqnarray}",	output:"}}",  description:"}}",  ttype:Astex.Token.DEFINITION});
Astex.Token.addToken({input:"\\end{array}",		output:"}}",  description:"}}",  ttype:Astex.Token.DEFINITION});
Astex.Token.addToken({input:"\\left",   tag:"mo", output:"X", description:"X", ttype:Astex.Token.LEFTBRACKET, category:Astex.Token.GROUPINGBRACKET});
Astex.Token.addToken({input:"\\right",  tag:"mo", output:"X", description:"X", ttype:Astex.Token.RIGHTBRACKET, category:Astex.Token.GROUPINGBRACKET});

//grouping and literal brackets -- ieval is for IE
//Astex.Token.addToken({input:"\\big",    tag:"mo", output:"X", description:"X", atval:"1.2", ieval:"2.2", ttype:Astex.Token.BIG});
//Astex.Token.addToken({input:"\\Big",    tag:"mo", output:"X", description:"X", atval:"1.6", ieval:"2.6", ttype:Astex.Token.BIG});
//Astex.Token.addToken({input:"\\bigg",   tag:"mo", output:"X", description:"X", atval:"2.2", ieval:"3.2", ttype:Astex.Token.BIG});
//Astex.Token.addToken({input:"\\Bigg",   tag:"mo", output:"X", description:"X", atval:"2.9", ieval:"3.9", ttype:Astex.Token.BIG});

/*
//Astex.Token.addToken({input:"(",	   tag:"mo", output:"(",      atval:"1", ttype:Astex.Token.STRETCHY});
//Astex.Token.addToken({input:"[",	   tag:"mo", output:"[",      atval:"1", ttype:Astex.Token.STRETCHY});
Astex.Token.addToken({input:"\\lbrack", tag:"mo", output:"[",      atval:"1", ttype:Astex.Token.STRETCHY});
Astex.Token.addToken({input:"\\{",	   tag:"mo", output:"{",      atval:"1", ttype:Astex.Token.STRETCHY});
Astex.Token.addToken({input:"\\lbrace", tag:"mo", output:"{",      atval:"1", ttype:Astex.Token.STRETCHY});
Astex.Token.addToken({input:"\\langle", tag:"mo", output:"\u2329", atval:"1", ttype:Astex.Token.STRETCHY});
Astex.Token.addToken({input:"\\lfloor", tag:"mo", output:"\u230A", atval:"1", ttype:Astex.Token.STRETCHY});
Astex.Token.addToken({input:"\\lceil",  tag:"mo", output:"\u2308", atval:"1", ttype:Astex.Token.STRETCHY});

// rtag:"mi" causes space to be inserted before a following sin, cos, etc.
// (see function LMparseExpr() )
//Astex.Token.addToken({input:")",	  tag:"mo",output:")",	    rtag:"mi",atval:"1",ttype:Astex.Token.STRETCHY});
//Astex.Token.addToken({input:"]",	  tag:"mo",output:"]",	    rtag:"mi",atval:"1",ttype:Astex.Token.STRETCHY});
Astex.Token.addToken({input:"\\rbrack",tag:"mo",output:"]",	    rtag:"mi",atval:"1",ttype:Astex.Token.STRETCHY});
Astex.Token.addToken({input:"\\}",	  tag:"mo",output:"}",	    rtag:"mi",atval:"1",ttype:Astex.Token.STRETCHY});
Astex.Token.addToken({input:"\\rbrace",tag:"mo",output:"}",	    rtag:"mi",atval:"1",ttype:Astex.Token.STRETCHY});
Astex.Token.addToken({input:"\\rangle",tag:"mo",output:"\u232A", rtag:"mi",atval:"1",ttype:Astex.Token.STRETCHY});
Astex.Token.addToken({input:"\\rfloor",tag:"mo",output:"\u230B", rtag:"mi",atval:"1",ttype:Astex.Token.STRETCHY});
Astex.Token.addToken({input:"\\rceil", tag:"mo",output:"\u2309", rtag:"mi",atval:"1",ttype:Astex.Token.STRETCHY});

// "|", "\\|", "\\vert" and "\\Vert" modified later: lspace = rspace = 0em
Astex.Token.addToken({input:"|",		tag:"mo", output:"\u2223", atval:"1", ttype:Astex.Token.STRETCHY});
Astex.Token.addToken({input:"\\|",		tag:"mo", output:"\u2225", atval:"1", ttype:Astex.Token.STRETCHY});
Astex.Token.addToken({input:"\\vert",	tag:"mo", output:"\u2223", atval:"1", ttype:Astex.Token.STRETCHY});
Astex.Token.addToken({input:"\\Vert",	tag:"mo", output:"\u2225", atval:"1", ttype:Astex.Token.STRETCHY});
Astex.Token.addToken({input:"\\mid",	tag:"mo", output:"\u2223", atval:"1", ttype:Astex.Token.STRETCHY});
Astex.Token.addToken({input:"\\parallel",	tag:"mo", output:"\u2225", atval:"1", ttype:Astex.Token.STRETCHY});
Astex.Token.addToken({input:"/",		tag:"mo", output:"/",	atval:"1.01", ttype:Astex.Token.STRETCHY});
Astex.Token.addToken({input:"\\backslash",	tag:"mo", output:"\u2216", atval:"1", ttype:Astex.Token.STRETCHY});
Astex.Token.addToken({input:"\\setminus",	tag:"mo", output:"\\",	   ttype:Astex.Token.CONST});

//miscellaneous tokens
Astex.Token.addToken({input:"\\!",	  tag:"mspace", atname:"width", atval:"-0.167em", ttype:Astex.Token.SPACE});
Astex.Token.addToken({input:"\\,",	  tag:"mspace", atname:"width", atval:"0.167em", ttype:Astex.Token.SPACE});
Astex.Token.addToken({input:"\\>",	  tag:"mspace", atname:"width", atval:"0.222em", ttype:Astex.Token.SPACE});
Astex.Token.addToken({input:"\\:",	  tag:"mspace", atname:"width", atval:"0.222em", ttype:Astex.Token.SPACE});
Astex.Token.addToken({input:"\\;",	  tag:"mspace", atname:"width", atval:"0.278em", ttype:Astex.Token.SPACE});
Astex.Token.addToken({input:"~",	  tag:"mspace", atname:"width", atval:"0.333em", ttype:Astex.Token.SPACE});
Astex.Token.addToken({input:"\\quad",  tag:"mspace", atname:"width", atval:"1em", ttype:Astex.Token.SPACE});
Astex.Token.addToken({input:"\\qquad", tag:"mspace", atname:"width", atval:"2em", ttype:Astex.Token.SPACE});
//Astex.Token.addToken({input:"{}",		  tag:"mo", output:"\u200B", ttype:Astex.Token.CONST}); // zero-width
*/

//Astex.Token.addToken({input:"'",		tag:"mo", output:"\u02B9", description:"'", ttype:Astex.Token.CONST});
//Astex.Token.addToken({input:"''",		tag:"mo", output:"\u02BA", description:"''", ttype:Astex.Token.CONST});
//Astex.Token.addToken({input:"'''",		tag:"mo", output:"\u2034", description:"'''", ttype:Astex.Token.CONST});
//Astex.Token.addToken({input:"''''",		tag:"mo", output:"\u2057", description:"''''", ttype:Astex.Token.CONST});
//Astex.Token.addToken({input:"\\Re",		tag:"mo", output:"\u211C", description:"Re", ttype:Astex.Token.CONST});
//Astex.Token.addToken({input:"\\Im",		tag:"mo", output:"\u2111", description:"Im", ttype:Astex.Token.CONST});
//Astex.Token.addToken({input:"\\ell",	tag:"mo", output:"\u2113", ttype:Astex.Token.CONST});				// ???
//Astex.Token.addToken({input:"\\wp",		tag:"mo", output:"\u2118", ttype:Astex.Token.CONST});				// ???
//Astex.Token.addToken({input:"\\surd",	tag:"mo", output:"\\sqrt{}", description:"\\sqrt{}", ttype:Astex.Token.DEFINITION});
//Astex.Token.addToken({input:"\\\\ ",	  tag:"mo", output:"\u00A0", ttype:Astex.Token.CONST});
//Astex.Token.addToken({input:"\\wr",		tag:"mo", output:"\u2240", ttype:Astex.Token.CONST});				// ???




/*

do i need to edit some of these mathvariant ??? bold, italic , etc

or edit processMathMLTags ???

*/

/*--------------------------------------------------------------------------*/
