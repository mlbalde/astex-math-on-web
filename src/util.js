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

// Astex.Util class
Astex.Util = { } ;

//
// Astex.Util class variables
//
Astex.Util.isIE = ( document.createElementNS == null && navigator.appName.match(/Microsoft\s*Internet\s*Explorer/i) ) ;

/*
// not needed anymore
Astex.Util.isFlashEnabled = false ;
if ( Astex.Util.isIE ) {

	// flash versions to check
	var v = [ ".7" , ".6" , ".3" , "" ] ;

	for ( var i = 0 ; i < v.length ; i++ ) {

		try {
			var flash = new ActiveXObject ( "ShockwaveFlash.ShockwaveFlash" + v[i] ) ;
			Astex.Util.isFlashEnabled = true ;
		}
		catch ( e ) {
			// empty body 
		}

		// break out of loop
		if ( Astex.Util.isFlashEnabled ) {
			break ;
		}
	}
}
else {
	// these don't work for ie when flash player is added dynamically and not present in original document
	Astex.Util.isFlashEnabled = ( navigator.mimeTypes && navigator.mimeTypes ["application/x-shockwave-flash"] ) ? true : false ;
}
// check to make sure flash is only used if it comes from a server (NOT just a local file)
Astex.Util.isFlashEnabled = Astex.Util.isFlashEnabled && window.location.href.match(/^https?/i) ;
*/

//
// Astex.Util class methods 
//

// prototype Object Astex.Util.displayIEOlderVersionMessage ( )
Astex.Util.displayIEOlderVersionMessage = function ( ) {
	// display warning message to IE7 and below about slow graph rendering
	if ( Astex.Util.isIE ) {
		var version = navigator.appVersion.match ( /MSIE\s*(\d*\.\d*)/ ) ;	// version is a string
		version = Number ( version[1] ) ;					// convert string to a primitive number
		if ( version < 8 ) {
			// version 7 released in 2006
			// version 6 released in 2001
			var d = new Date ( ) ;
			var year = d.getFullYear ( ) ;
			var msg = "\t\t! ASTEX Warning !\n\n" ;
			msg += "You are using an old version of Internet Explorer, specifically version " + version + ".\n" ;
			msg += "This web browser was originally released " + (version == 7 ? year-2006 : year-2001) + " years ago.\n" ;
			msg += "The version you have renders slowly, especially our 2D and 3D graphs.\n" ;
			msg += "We suggest you upgrade to the latest version for best performance,\n" ;
			msg += "or use the latest version of Mozilla Firefox, Apple Safari, Google Chrome, or Opera." ;
			alert ( msg ) ;
		}
	}
};

// prototype Object Astex.Util.forceIE8Comapatibilty ( )
Astex.Util.forceIE8Compatibility = function ( ) {
	if ( Astex.Util.isIE ) {
		var version = navigator.appVersion.match ( /MSIE\s*(\d*\.\d*)/ ) ;	// version is a string
		version = Number ( version[1] ) ;					// convert string to a primitive number
		if ( version == 8 ) {
			// force IE8 into IE7 compatibility mode
			// was having problem with some of the doc links in IE8 mode
			var meta = document.createElement ( "meta" ) ;
			meta.setAttribute ( "http-equiv" , "X-UA-Compatible" ) ;
			meta.setAttribute ( "content" , "IE=EmulateIE7" ) ;
			var head = document.getElementsByTagName ( "head" ) ;
			head[0].appendChild ( meta ) ;

			// just checking to make sure the above meta node was inserted
			//alert ( head[0].innerHTML ) ;
			//var m = document.getElementsByTagName ( "meta" ) ;
			//alert ( m.length ) ;
			/*
			if ( head[0].innerHTML.match(/EmulateIE7/i) ) {
				alert ( "ie7 compatible" ) ;
			}
			*/
		}
	}
};

// prototype Object Astex.Util.addStyleSheet ( String style , int index )
// adapted from AsciiMathML setStylesheet() function (which was adapted from TW)
// if index is used, the specifically indexed stylesheet will be replaced by a new one
// if index is null, a new stylesheet will be created
// when calling be sure to escape { and } in style string as \{ and \}
// also, add a \n after ending \} in the style string
// e.g. Astex.Util.addStyleSheet(".Astex \{ color:red;border:0; \}\n") ;
Astex.Util.styleSheetCounter = 0 ; 
Astex.Util.addStyleSheet = function ( style , index ) {

	if ( ! style || style == "" ) { return ; }
	if ( index != null && typeof index != "number" ) { index = null ; }

	var id = "AstexCustomStyleSheet" + (index == null ? Astex.Util.styleSheetCounter : index) ;
	var n = document.getElementById ( id ) ;

	if ( Astex.Util.isIE && document.createStyleSheet ) {		// test for IE's non-standard createStyleSheet method
		if ( n ) {
			n.parentNode.removeChild ( n ) ;
		}
		// This failed without the &nbsp;
		document.getElementsByTagName("head")[0].insertAdjacentHTML ( "beforeEnd" , "&nbsp;<style id='" + id + "'>" + style + "</style>" ) ;
	}
	else {
		if ( n ) {
			n.replaceChild ( document.createTextNode(style) , n.firstChild ) ;
		}
		else {
			n = document.createElement ( "style" ) ;
			n.type = "text/css" ;
			n.id = id ;
			n.appendChild ( document.createTextNode(style) ) ;
			document.getElementsByTagName("head")[0].appendChild( n ) ;
		}
	}

	// increment style sheet counter (if necessary)
	if ( index == null ) { Astex.Util.styleSheetCounter++ ; }
};

// prototype Object Astex.Util.parseQueryString ( )
Astex.Util.parseQueryString = function ( ) {

	var obj = { } ;
	var q = location.search.substring ( 1 ) ;	// search query string

	//alert ( q ) ;

	var kv = q.split ( "," ) ;			// key-value pairs

	var split , key , value ;
	for ( var i = 0 ; i < kv.length ; i++ ) {

		if ( kv[i].indexOf("=") == -1 ) { continue ; }

		split = kv[i].split ( "=" ) ;
		key = split[0] ;
		value = split[1] ;

		//obj [ key ] = decodeURIComponent ( value ) ;
		obj [ decodeURIComponent ( key ) ] = decodeURIComponent ( value ) ;
	}
	return obj ;
};

// prototype IFrameDoc Astex.Util.getIFrameDoc ( HTMLElement iframe )
Astex.Util.getIFrameDoc = function ( iframe ) {

	var doc = null ;
	if ( iframe.contentWindow ) {				// ie
		doc = iframe.contentWindow.document ;
	}
	else if ( iframe.contentDocument ) {			// firefox
		doc = iframe.contentDocument ;
	}
	else if ( iframe.document ) {				// other browsers
		doc = iframe.document ;
	}

	return doc ;
};

// borrowed from AsciiMathML getElementsByClass function
// prototype: HTMLElement[] Astex.Util.getElementsByClass ( HTMLElement container , String tagName , String clsName ) {
// search through container for elements with tagName who have a class attribute of clsName
Astex.Util.getElementsByClass = function ( container , tagName , clsName ) {
	var list = new Array ( 0 ) ;
	var collection = container.getElementsByTagName ( tagName ) ;
	for ( var i = 0 ; i < collection.length ; i++ ) {
		if ( collection[i].className.slice(0,clsName.length) == clsName ) {
			list[list.length] = collection[i] ;
		}
	}
	return list ;
};

// prototype Event Astex.Util.fixEvent ( Event event )
Astex.Util.fixEvent = function ( event ) {

	if ( ! event ) {
		event = window.event ;		// IE work-around
	}

	if ( event.preventDefault ) {
		event.preventDefault() ;		// firefox
	}
	else {
		event.returnValue = false ;
	}

	return event ;
};


// prototype: Object Astex.Util.insertAfterNode ( HTMLElement nodeToInsert , HTMLElement after )
// insert a node after a particular node (relative to after's parent)
Astex.Util.insertAfterNode = function ( nodeToInsert , after ) {

	// get index for after from list of after's parent node
	var kids = after.parentNode.childNodes ;
	var index = -1 ;
	for ( var i = 0 ; i < kids.length ; i++ ) {
		if ( kids[i] == after ) {
			index = i ;
			break ;
		}
	}
	if ( index != -1 && index+1 < kids.length ) {
		// insert before the next child
		after.parentNode.insertBefore ( nodeToInsert , kids[index+1] ) ;
	}
	else {
		after.parentNode.appendChild ( nodeToInsert ) ;
	}
};

// prototype: Object Astex.Util.findTopLeftCorner ( HTMLElement obj )
// returns on Object with attributes x and y
// representing top-left corner (in pixels) of obj on HTML page
// algorithm borrowed from AsciiMathML findPos() function
Astex.Util.findTopLeftCorner = function ( obj ) {
	var currentLeft = 0 ;
	var currentTop = 0 ;
	if ( obj.offsetParent ) {
		currentLeft = obj.offsetLeft ;
		currentTop = obj.offsetTop ;
		while ( obj = obj.offsetParent ) {
			currentLeft += obj.offsetLeft ;
			currentTop += obj.offsetTop ;
		}
	}
	return {x:currentLeft,y:currentTop} ;
};

// prototype: Object Astex.Util.getFontWidthHeight ( Font font , String testString )
// returns on Object with attributes width and height
// calculate the width and height of test string in specified font
Astex.Util.getFontWidthHeight = function ( font , testString ) {

	var d = document.createElement ( "div" ) ;
	d.style.position = "absolute" ;
	d.style.visibility = "hidden" ;
	d.style.top = d.style.left = 0 ;
	d.style.fontFamily = font ;
	d.style.fontWeight = "normal" ;
	d.style.fontStyle = "normal" ;
	d.style.fontSize = "24px" ;
	d.innerHTML = testString ;

	var body = document.getElementsByTagName("body")[0] ;
	body.appendChild ( d ) ;
	var w = d.offsetWidth ;
	var h = d.offsetHeight ;
	body.removeChild ( d ) ;

	return { width:w , height:h } ;
};

// prototype: Object Astex.Util.getMouseCoordByEventAndHtmlElementId  ( Event event , String id )
// returns on Object with attributes x and y
// algorithm mostly borrowed from AsciiMathML getX() and getY() functions
Astex.Util.getMouseCoordByEventAndHtmlElementId = function ( event , id ) {

	var root = document.getElementById ( id ) ;
	var pos = Astex.Util.findTopLeftCorner ( root.parentNode ) ;
	//alert ( "pos: (" + pos.x + "," + pos.y + ")" ) ;
	var windowX = event.clientX + ( Astex.Util.isIE ? 0 : window.pageXOffset ) - pos.x ;
	//alert ( "windowX: " + windowX ) ;
	var windowY = event.clientY + ( Astex.Util.isIE ? 0 : window.pageYOffset ) - pos.y ;
	//alert ( "windowY: " + windowY ) ;
	return { x:windowX , y:windowY } ;
};

// prototype: Boolean Astex.Util.nodeIsElement ( HTMLElement node , String element )
// e.g., var bool = Astex.Util.nodeIsElement ( node , "form" ) ;
Astex.Util.nodeIsElement = function ( node , element ) {
	return node.nodeName.match(new RegExp(element,"i")) ? true : false ;
};

// prototype: Object Astex.Util.swap ( first , second )
// takes two arguments
// returns on Object with attributes one and two
// indicating the new order of the original arguments
Astex.Util.swap = function ( first , second ) {
	var tmp = first ;
	first = second ;
	second = tmp ;
	return {one:first,two:second} ;
};

// prototype: String Astex.Util.colorString2HexString ( String color )
// returns hex string for most popular english color strings
// otherwise returns color as passed
// if argument is null, returns empty string
Astex.Util.colorString2HexString = function ( color ) {

	if ( ! color ) { color = "" ; }
	color = color.toLowerCase ( ) ;

	switch ( color ) {

		case "white" :
			color = "#ffffff" ;
			break ;

		case "black" :
			color = "#000000" ;
			break ;

		case "red" :
			color.red = "#ff0000" ;
			break ;

		case "blue" :
			color = "#0000ff" ;
			break ;

		case "yellow" :
			color = "#ffff00" ;
			break ;

		case "orange" :
			color = "#ff8040" ;
			break ;

		case "green" :
			color = "#00ff00" ;
			break ;

		case "violet" :
		case "purple" :
			color = "#8d38c9" ;
			break ;

		case "gray" :
		case "grey" :
			color = "#736f63" ;
			break ;

		case "turquoise" :
			color = "#00ffff" ;
			break ;

		case "lightblue" :
			color = "#0000ff" ;
			break ;

		case "darkblue" :
			color = "#0000a0" ;
			break ;

		case "lightpurple" :
			color = "#ff0080" ;
			break ;

		case "darkpurple" :
			color = "#800080" ;
			break ;

		case "pastelgreen" :
			color = "#00ff00" ;
			break ;

		case "pink" :
			color = "#ff00ff" ;
			break ;

		case "lightgray" :
		case "lightgrey" :
			color = "#c0c0c0" ;
			break ;

		case "darkgray" :
		case "darkgrey" :
			color = "#808080" ;
			break ;

		case "brown" :
			color = "#804000" ;
			break ;

		case "burgundy" :
			color = "#800000" ;
			break ;

		case "forestgreen" :
			color = "#808000" ;
			break ;

		case "grassgreen" :
			color = "#408080" ;
			break ;

		default :
			break ;
	}

	return color ;
};

// prototype: Int Astex.Util.countCharInString ( Char ch , String str )
Astex.Util.countCharInString = function ( ch , str ) {
		var counter = 0 ;
		for ( var i = 0 ; i < str.length ; i++ ) {
			if ( str.charAt ( i ) == ch ) {
				counter++ ;
			}	
		}
		return counter;
};

// prototype:  Astex.Util.randomSort ( a , b )
Astex.Util.randomSort = function ( a , b ) {
	return ( Math.floor ( Math.random ( ) * 100 ) % 2 == 0 ) ? -1 : 1 ;	
};

// prototype: String Astex.Util.removeCharsAndBlanks ( String str , Int n , Boolean latex )
// remove n characters and any following blanks from a string
// does NOT modify original string argument !!!
// returns fragment of original string
// algorithms borrowed from AsciiMathML AMremoveCharsAndBlanks() and LMremoveCharsAndBlanks() functions
Astex.Util.removeCharsAndBlanks = function ( str , n , latex ) {
	var st ;
	if ( ! latex || typeof latex != "boolean" ) { latex = false ; }
	// if latex is true, we accept latex notation using preceding backslash(es)
	if ( latex ) {
		st = str.slice ( n ) ;
	}
	// the else-if and else clauses come from AMremoveCharsAndBlanks
	else if ( str.charAt(n)=="\\" && str.charAt(n+1)!="\\" && str.charAt(n+1)!=" " ) {
		st = str.slice ( n + 1 ) ;
	}
	else {
		st = str.slice ( n ) ;
	}
	for ( var i = 0 ; i < st.length && st.charCodeAt ( i ) <= 32 ; i = i + 1 ) { /*empty body*/ }

	return st.slice ( i ) ;
};

// prototype: Int Astex.Util.isDigit ( Char ch )
Astex.Util.isDigit = function ( ch ) {
	if ( ch >= '0' && ch <= '9' ) {
		return true ;
	}
	else {
		return false ;
	}
};

// prototype: Int Astex.Util.isAlpha ( Char ch )
Astex.Util.isAlpha = function ( ch ) {
	if ( ( ch >= 'a' && ch <= 'z' ) || ( ch >= 'A' && ch <= 'Z' ) ) {
		return true ;
	}
	else {
		return false ;
	}
};

// prototype: Int Astex.Util.compareNames ( String one , String two )
// borrowed from AsciiMathML compareNames() function
Astex.Util.compareNames = function ( one , two ) {
	if ( one > two ) {
		return 1 ;
	}
	else {
		 return -1 ;
	}
};

// prototype: Int Astex.Util.getPosition ( Array[] arr , String str , Int n )
// returns position >= n where str appears or would b inserted
// assumes arr is sorted
// borrowed from AsciiMathML position() function
Astex.Util.getPosition = function ( arr , str , n ) {
	if ( n == 0 ) {
		var h , m ;
		n = -1 ;
		h = arr.length ;
		while ( n + 1 < h ) {
			m = ( n + h ) >> 1 ;
			if ( arr[m] < str ) {
				n = m ;
			}
			else {
				h = m ;
			}
		}
		return h ;
	}
	else {
		for ( var i = n ; i < arr.length && arr[i] < str ; i++ ) {
			// empty body
		}
	}
	return i ;
};

// prototype: String Astex.Util.getMaximalSubstringInArray ( String str , String[] arr )
// return maximal initial substring of str that appears in arr 
// returns null if there is none 
// calls Astex.Util.getPosition() which assumes arr is sorted
// basic algorithm borrowed from AsciiMathML AMgetSymbol() function (have only implemented beginning portion of function)
Astex.Util.getMaximalSubstringInArray = function ( str , arr ) {
	var k = 0 ;	// new position
	var j = 0 ;	// old position
	var mk ;	// match position
	var st ;
	var tagst ;
	var match = "" ;
	var more = true ;
	for ( var i = 1 ; i <= str.length && more ; i++ ) {
		st = str.slice ( 0 , i ) ;	// initial substring of length i
		j = k ;
		k = Astex.Util.getPosition ( arr , st , j ) ;
		if ( k < arr.length && str.slice ( 0 , arr[k].length ) == arr[k] ) {
			match = arr[k] ;
			mk = k ;
			i = match.length ;
		}
		more = k < arr.length && str.slice ( 0 , arr[k].length ) >= arr[k] ;
	}
	if (match != "" ) {
		return arr[mk] ;
	}

	return null ;
};

/*
// prototype: Int Astex.Util.loadTextFile ( String url , Function callback )
// calls callback with argument being the text of document found at url
// returns -1 if browser doesn't support http request and 1 otherwise
Astex.Util.loadTextFile = function ( url , callback ) {

	var request = null ;

	if ( window.XMLHttpRequest ) {

		request = new XMLHttpRequest ( ) ;
	}
	else if ( window.ActiveXObject ) {					// ie

		request = new ActiveXObject ( "Microsoft.XMLHTTP" ) ;
		// if the above doesn't work, try the following
		if ( request == null ) {
			request = new ActiveXObject ( "Msxml2.XMLHTTP" ) ;
		}
	}

	// if browser doesn't support http request
	if ( request == null ) { return -1 ; }

	// ie won't fetch local text files during the development process
	// it expects files to be served from a web server
	//request.open ( "GET" , "http://www.google.com" , true ) ;		// this worked in local development environment
	if ( ! (Astex.Util.isIE && !url.match(/^http/)) ) {
 
		// ie needs us to call open first !!!
		// if we call open after we set the onreadystatechange method
		// the call to open will reset it and all request 
		// instance variables/methods to null
		request.open ( "GET" , url , true ) ;

		// setup the callback function
		request.onreadystatechange = function ( ) {

			//if ( request.readyState == 4 && request.status == 200 ) {
			if ( request.readyState == 4 ) {

				callback ( request.responseText ) ;
			}
		};

		request.send ( null ) ;
	}
	return 1 ;
};
*/

/*--------------------------------------------------------------------------*/
