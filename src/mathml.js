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
// Astex.MathML class
//

Astex.MathML = { } ;	


//
// Astex.MathML class variables 
//

Astex.MathML.subSupFactorsSet = false ;
Astex.MathML.subSupXFactor = 1 ;
Astex.MathML.subSupYFactor = 1 ;
Astex.MathML.MFracDivisor = 1.5 ;

//
// Astex.MathML class methods
//

// prototype: void Astex.MathML.processMathML ( HTMLElement myNode )
Astex.MathML.processMathML = function ( myNode ) {

	if ( Astex.AMath.useMathPlayer || Astex.AMath.useNativeMathML ) { return ; }

	if ( ! myNode ) { myNode = document.body ; }

	if ( ! Astex.AMath.translated ) {
		setTimeout ( "Astex.processMathML();" , 10 * 1000 ) ;
		return ;
	}
	// astex default rendering

	// cycle through document and get <math> elements
	//var maths = document.getElementsByTagName ( "math" ) ;
	var maths = myNode.getElementsByTagName ( "math" ) ;

	//alert ( maths[0].innerHTML ) ;
	//alert ( maths[0].value ) ;
	//alert ( maths.length ) ;

	var math , title , w , c ;
	//for ( var i = 0 ; i < maths.length ; i++ ) {		// for loop not working properly
	while ( maths.length > 0 ) {				// while loop does work

		// update the canvas/window bgColor based upon the user's setup
		Astex.Window.update ( ) ;

		math = maths[0] ;				// get first (0th) element of array
		title = math.getAttribute ( "title" ) ;
		//w = new Astex.Window ( 300 , 300 ) ;
		//w = new Astex.Window ( 150 , 150 ) ;
		//w = new Astex.Window ( ) ;
		w = new Astex.Window ( 125 , 125 ) ;
		//c = new Astex.Canvas ( w , 0 , 2 , 1 , 0 , 4 , 1 ) ;
		//c = new Astex.Canvas ( w , 0 , 10 , 1 , 0 , 10 , 1 ) ;
		c = new Astex.Canvas ( w , -10 , 10 , 1 , -10 , 10 , 1 ) ;
		//c = new Astex.Canvas ( w , 0.01 , 10 , 1 , 0.01 , 10 , 1 ) ;
		//c = new Astex.Canvas ( w ) ;
		//c.setStroke ( 2 ) ;
		//c.setStroke ( 1 ) ;
		//c.setStroke ( Astex.Canvas.defaultStroke ) ;
		c.setStroke ( Astex.Font.Stroke.PLAIN ) ;
		//c.setColor ( "red" ) ;
		//c.fillRect ( c.xmin , c.ymin , c.xmax - c.xmin , c.ymax - c.ymin ) ;
		c.setColor ( "gray" ) ;
		//c.drawGrid ( ) ;
		//c.setColor ( "blue" ) ;
		//c.drawLine ( 0 , 0 , 10 , 10 ) ;
		//c.drawArc ( [0,0] , 5 , 10 , 30 , 60 ) ;			// NOT working properly
	
		Astex.MathML.subSupFactorsSet = false ;				// make sure sub/sup factors are reset for 
										// each math node
		Astex.MathML.fixMNTags ( math ) ;
		Astex.MathML.setMathMLTagDimensions ( math , 1 , 1 ) ;
		//Astex.MathML.setMathMLTagDimensions ( math , 0.75 , 0.75 ) ;
		//Astex.MathML.setMathMLTagDimensions ( math , 0.5 , 0.5 ) ;

		//
		// we should be able to update the dimensions of the iframe, window, canvas
		// (maybe not all of these)a
		//
		// may need to create new Window and Canvas and use these instead ?????

		// get dimensions of "math" node
		var width = parseFloat ( math.getAttribute ( "astex-width" ) ) ;
		var ascent = parseFloat ( math.getAttribute ( "astex-ascent" ) ) ;
		var descent = parseFloat ( math.getAttribute ( "astex-descent" ) ) ;

		//Astex.MathML.processMathMLTags ( math , c , [c.xmin,c.ymax - ascent] , 1 , 1 , 0 , 0 ) ;
		// added a little vertical padding in anchor
		Astex.MathML.processMathMLTags ( math , c , [c.xmin,c.ymax - ascent - c.yscale] , 1 , 1 , 0 , 0 ) ;
		//Astex.MathML.processMathMLTags ( math , c , [c.xmin,c.ymax - ascent - c.yscale] , 0.75 , 0.75 , 0 , 0 ) ;
		//Astex.MathML.processMathMLTags ( math , c , [c.xmin,c.ymax - ascent - c.yscale] , 0.5 , 0.5 , 0 , 0 ) ;

		// since I edited Astex.Window so each object has a node attribute,
		// we can draw on the canvas before inserting the window it corresponds to
		// into the document itself
		//c.paint ( ) ;
		//w.insertWindow ( math.parentNode ) ;
		//w.insertWindow ( math.parentNode , math ) ;		// not all <math> elements are being removed here ???
									// using original for loop
									// problem fixed using while loop

		var wPoint1 = c.toWindowCoordinates ( {x:c.xmin,y:c.ymin-descent} ) ;		// bottom-left
		var wPoint2 = c.toWindowCoordinates ( {x:c.xmin+width,y:c.ymin+ascent} ) ;	// upper-right
		//var iframe = document.getElementById ( w.iframeId ) ;
		var iframe = w.iframe ;
		var node = w.node ;
		if ( Astex.Util.isIE ) {
			iframe.width = (wPoint2.x - wPoint1.x) + 10 ;
			iframe.height = (wPoint1.y - wPoint2.y) + 15 ;
			node.width = (wPoint2.x - wPoint1.x) + 10 ;
			node.height = (wPoint1.y - wPoint2.y) + 15 ;
		}
		else {
			iframe.setAttribute ( "width" , (wPoint2.x - wPoint1.x) + 10 ) ;
			iframe.setAttribute ( "height" , (wPoint1.y - wPoint2.y) + 15 ) ;
			node.setAttribute ( "width" , (wPoint2.x - wPoint1.x) + 10 ) ;
			node.setAttribute ( "height" , (wPoint1.y - wPoint2.y) + 15 ) ;
		}

		c.paint ( ) ;
		w.insertWindow ( math.parentNode , math ) ;

		// reset maths variable
		//maths = document.getElementsByTagName ( "math" ) ;
		maths = myNode.getElementsByTagName ( "math" ) ;
	}

};


// prototype: void Astex.MathML.fixMNTags ( HTMLElement node )
// replace <mn> node with a negative number as <mo>-</mo><mn>abs value</mn> (inside an mrow)
// this will help the vertical alignment of the negative sign (-) when we draw it
Astex.MathML.fixMNTags = function ( node ) {

	if ( node.nodeType == Node.ELEMENT_NODE ) {

		switch ( node.tagName.toLowerCase() ) {

			case "mn" :
				// should have one text-node child (text-nodes have nodeValues)
				var kid = node.childNodes[0] ;
				if ( kid.nodeType == Node.TEXT_NODE && kid.nodeValue.match(/^-/) ) {
					var parentN = node.parentNode ;
					var mo = Astex.AMath.createMathMLNode ( "mo" , document.createTextNode("-") ) ; 
					var mn = Astex.AMath.createMathMLNode ( "mn" , document.createTextNode(kid.nodeValue.replace(/^-/,"")) ) ;
					var mrow = Astex.AMath.createMathMLNode ( "mrow" ) ;
					mrow.appendChild ( mo ) ;
					mrow.appendChild ( mn ) ;
					parentN.replaceChild ( mrow , node ) ;	
				}
				break ;

			default :
				var children = node.childNodes ;
				for ( var i = 0 ; i < children.length ; i++ ) {
					Astex.MathML.fixMNTags ( children[i] ) ;
				}
				break ;
		}
	}
};

// prototype: void Astex.MathML.processMathMLTags ( HTMLElement node , Astex.Canvas canvas , Float[] anchor , Float xFactor , Float yFactor , Float rotate , Float scewX )
Astex.MathML.processMathMLTags = function ( node , canvas , anchor , xFactor , yFactor , rotate , scewX ) {

	// remember, passing anchor array be refrence will change anchor
	// passing by value doesn't (use [anchor[0],anchor[1]] in this case)

	if ( ! anchor ) { anchor = [0,0] ; }
	if ( ! xFactor || typeof xFactor != "number" ) { xFactor = 1 ; }
	if ( ! yFactor || typeof yFactor != "number" ) { yFactor = 1 ; }
	if ( ! rotate || typeof rotate != "number" ) { rotate = 0 ; }
	if ( ! scewX || typeof scewX != "number" ) { scewX = 0 ; }

	if ( node.nodeType == Node.ELEMENT_NODE ) {

		switch ( node.tagName.toLowerCase() ) {

			case "math" :
				var nodeChildren = node.childNodes ;	// length should be 1
				if ( nodeChildren.length != 1 && nodeChildren[0].nodeType != Node.ELEMENT_NODE && nodeChildren[0].tagName.toLowerCase() != "mstyle" ) {
					// this mstyle child is created in Astex.AMath (asciimathml)
					// other mathml processors won't necessarily require this stipulation
					new Astex.Warning ( "math node expects 1 mstyle node as a child" , "Astex.MathML.processMathMLTags" ) ;
				}
				//Astex.MathML.processMathMLTags ( nodeChildren[0] , canvas , anchor , xFactor , yFactor , rotate , scewX ) ;
				Astex.MathML.processMathMLTags ( nodeChildren[0] , canvas , [anchor[0],anchor[1]] , xFactor , yFactor , rotate , scewX ) ;
				break ;

			case "mo" :
				var nodeChildren = node.childNodes ;	// length should be 1
				if ( nodeChildren.length != 1 && nodeChildren[0].nodeType != Node.TEXT_NODE ) {
					new Astex.Warning ( "mo expects 1 text node as a child" , "Astex.MathML.processMathMLTags" ) ;
				}

				// get token (we need to know its category below)
				var token = Astex.Token.getTokenByOutputAndTag ( nodeChildren[0].nodeValue , "mo" ) ;

				var dx = 0 ;				// var for adjusting x-coordinate of anchor
				var dy = 0 ;				// var for adjusting y-coordinate of anchor

				/*	
				if ( nodeChildren[0].nodeValue.match(/&nbsp;|\u00A0/) ) {
					alert ( "nbsp" ) ;
				}
				*/
				//vertically align +,-, etc.
				if ( token.category == Astex.Token.BINARYOPERATOR || token.category == Astex.Token.BINARYRELATION || token.category == Astex.Token.LOGICALOPERATOR ) {
					// move vertically
					var height = parseFloat ( node.getAttribute ( "astex-ascent" ) ) ;
					//height += parseFloat ( node.getAttribute ( "astex-descent" ) ) ;
					//height -= Astex.Symbol.getSpaceWidthBetweenSymbols ( yFactor ) ;
					var parentHeight = parseFloat ( node.parentNode.getAttribute ( "astex-ascent" ) ) ;
					//parentHeight += parseFloat ( node.parentNode.getAttribute ( "astex-descent" ) ) ;
					//parentHeight -= Astex.Symbol.getSpaceWidthBetweenSymbols ( yFactor ) ;
					//parentHeight -= Astex.Symbol.getSpaceWidthBetweenSymbols ( yFactor ) ;
					parentHeight -= Astex.Symbol.getSpaceWidth ( yFactor ) ;
					if ( height < parentHeight ) {
						//alert ( token.input ) ;
						// is this right ???
						dy = height * ( parentHeight / height ) ;
						//anchor[1] += dy / 2 ;				// don't change anchor - adjust dy instead
						dy = dy / 2 ;
					}
					//alert ( token.output + " " + node.parentNode.tagName ) ;
				}
				// stretch the symbol based on parent node
				else if ( ! node.parentNode.tagName.match(/mover|munder|munderover/i) && token.ttype != Astex.Token.UNDEROVER ) {
					// stretch vertically
					var ascent = parseFloat ( node.getAttribute ( "astex-ascent" ) ) ;
					ascent += parseFloat ( node.getAttribute ( "astex-descent" ) ) ;
					ascent -= 2 * Astex.Symbol.getSpaceWidthBetweenSymbols ( yFactor ) ;
					var parentAscent = parseFloat ( node.parentNode.getAttribute ( "astex-ascent" ) ) ;
					parentAscent += parseFloat ( node.parentNode.getAttribute ( "astex-descent" ) ) ;
					parentAscent += Astex.Symbol.getSpaceWidthBetweenSymbols ( yFactor ) ;
					//parentAscent += 2 * Astex.Symbol.getSpaceWidth ( yFactor ) ;
					if ( ascent < parentAscent ) {
						yFactor = ( parentAscent / ascent ) * yFactor ;
						// move vertically
						//ascent += 2 * Astex.Symbol.getSpaceWidthBetweenSymbols ( yFactor ) ;
						//parentAscent -= Astex.Symbol.getSpaceWidthBetweenSymbols ( yFactor ) ;
						//dy = ascent * ( parentAscent / ascent ) ;
						//dy = dy / 2 ;
					}
				}
				// overline (move anchor to left)
				else if ( node.getAttribute("accent") == "true" && nodeChildren[0].nodeValue.match(/_|\u00AF|\u203E/) ) {
					dx = -2 * Astex.Symbol.getSpaceWidthBetweenSymbols ( xFactor ) ;
					// stretch horizontally 
					var width = parseFloat ( node.getAttribute ( "astex-width" ) ) ;
					//width -= Astex.Symbol.getSpaceWidthBetweenSymbols ( xFactor ) ;
					var parentWidth = parseFloat ( node.parentNode.getAttribute ( "astex-width" ) ) ;
					//parentWidth += Astex.Symbol.getSpaceWidthBetweenSymbols ( xFactor ) ;
					//parentWidth += Astex.Symbol.getSpaceWidth ( xFactor ) ;
					if ( width < parentWidth ) {
						xFactor = ( parentWidth / width ) * xFactor ;
						//dx = width * xFactor ;
						// reset node attributes
						node.setAttribute ( "astex-width" , parseFloat ( node.getAttribute ( "astex-width" ) ) * ( parentWidth / width ) ) ;
					}
						
				}
				// overbrace
				else if ( node.getAttribute("accent") == "true" && nodeChildren[0].nodeValue.match(/\u23B4/) ) {
					dx = -3 * Astex.Symbol.getSpaceWidthBetweenSymbols ( xFactor ) ;
					// stretch horizontally 
					var width = parseFloat ( node.getAttribute ( "astex-width" ) ) ;
					width -= Astex.Symbol.getSpaceWidthBetweenSymbols ( xFactor ) ;
					var parentWidth = parseFloat ( node.parentNode.getAttribute ( "astex-width" ) ) ;
					//parentWidth += Astex.Symbol.getSpaceWidthBetweenSymbols ( xFactor ) ;
					//parentWidth += Astex.Symbol.getSpaceWidth ( xFactor ) ;
					if ( width < parentWidth ) {
						xFactor = ( parentWidth / width ) * xFactor ;
						//dx = width * xFactor ;
						// reset node attributes
						node.setAttribute ( "astex-width" , parseFloat ( node.getAttribute ( "astex-width" ) ) * ( parentWidth / width ) ) ;
					}
				}
				// underbrace
				else if ( node.getAttribute("accentunder") == "true" && nodeChildren[0].nodeValue.match(/\u23B5/) ) {
					dx = -3 * Astex.Symbol.getSpaceWidthBetweenSymbols ( xFactor ) ;
					// stretch horizontally 
					var width = parseFloat ( node.getAttribute ( "astex-width" ) ) ;
					width -= Astex.Symbol.getSpaceWidthBetweenSymbols ( xFactor ) ;
					var parentWidth = parseFloat ( node.parentNode.getAttribute ( "astex-width" ) ) ;
					//parentWidth += Astex.Symbol.getSpaceWidthBetweenSymbols ( xFactor ) ;
					//parentWidth += Astex.Symbol.getSpaceWidth ( xFactor ) ;
					if ( width < parentWidth ) {
						xFactor = ( parentWidth / width ) * xFactor ;
						//dx = width * xFactor ;
						// reset node attributes
						node.setAttribute ( "astex-width" , parseFloat ( node.getAttribute ( "astex-width" ) ) * ( parentWidth / width ) ) ;
					}
				}
				// squeeze vector or overleftarrow vertically and tilde
				else if ( node.getAttribute("accent") == "true" && nodeChildren[0].nodeValue.match(/\u2192|\u20D7|\u20D6|~|\u02DC/) ) {
					dx = -2 * Astex.Symbol.getSpaceWidthBetweenSymbols ( xFactor ) ;
					// stretch horizontally 
					var width = parseFloat ( node.getAttribute ( "astex-width" ) ) ;
					//width -= Astex.Symbol.getSpaceWidthBetweenSymbols ( xFactor ) ;
					var parentWidth = parseFloat ( node.parentNode.getAttribute ( "astex-width" ) ) ;
					//parentWidth += Astex.Symbol.getSpaceWidthBetweenSymbols ( xFactor ) ;
					//parentWidth += Astex.Symbol.getSpaceWidth ( xFactor ) ;
					if ( width < parentWidth ) {
						xFactor = ( parentWidth / width ) * xFactor ;
						//dx = width * xFactor ;
						// reset node attributes
						node.setAttribute ( "astex-width" , parseFloat ( node.getAttribute ( "astex-width" ) ) * ( parentWidth / width ) ) ;
					}
					// squeeze vertically
					//yFactor = Astex.MathML.subSupYFactor * yFactor ;
					yFactor = Astex.MathML.subSupYFactor ;
					//alert ( "vec" ) ;
				}
				// don't stretch dot, ddot, tdot accents
				else if ( node.parentNode.tagName.match(/mover/i) && nodeChildren[0].nodeValue.match(/\.{1,3}/) ) {
					xFactor /= 1.5 ;
					yFactor /= 1.5 ;
					var w = parseFloat ( node.parentNode.firstChild.getAttribute("astex-width") ) ;
					w -= 4*Astex.Symbol.getSpaceWidthBetweenSymbols ( xFactor ) ;
					if ( nodeChildren[0].nodeValue == "." ) {
						dx = w / 2 ;
					}
					else if ( nodeChildren[0].nodeValue == ".." ) {
						dx = w / 3 ;
					}
					else if ( nodeChildren[0].nodeValue == "..." ) {
						dx = w / 4 ;
					}
				}
				// stretch horizontally and vertically
				else {
					// stretch horizontally 
					var width = parseFloat ( node.getAttribute ( "astex-width" ) ) ;
					//width -= Astex.Symbol.getSpaceWidthBetweenSymbols ( xFactor ) ;
					var parentWidth = parseFloat ( node.parentNode.getAttribute ( "astex-width" ) ) ;
					//parentWidth += Astex.Symbol.getSpaceWidthBetweenSymbols ( xFactor ) ;
					//parentWidth += Astex.Symbol.getSpaceWidth ( xFactor ) ;
					if ( width < parentWidth ) {
						xFactor = ( parentWidth / width ) * xFactor ;
						//dx = width * xFactor ;
						// reset node attributes
						node.setAttribute ( "astex-width" , parseFloat ( node.getAttribute ( "astex-width" ) ) * ( parentWidth / width ) ) ;
					}

					// stretch vertically
					var ascent = parseFloat ( node.getAttribute ( "astex-ascent" ) ) ;
					ascent += parseFloat ( node.getAttribute ( "astex-descent" ) ) ;
					//ascent -= 2 * Astex.Symbol.getSpaceWidthBetweenSymbols ( yFactor ) ;
					var parentAscent = parseFloat ( node.parentNode.getAttribute ( "astex-ascent" ) ) ;
					parentAscent += parseFloat ( node.parentNode.getAttribute ( "astex-descent" ) ) ;
					//parentAscent += Astex.Symbol.getSpaceWidthBetweenSymbols ( yFactor ) ;
					//parentAscent -= 2*Astex.Symbol.getSpaceWidthBetweenSymbols ( yFactor ) ;
					//parentAscent += 2 * Astex.Symbol.getSpaceWidth ( yFactor ) ;
					parentAscent -= Astex.Symbol.getSpaceWidth ( yFactor ) ;
					if ( ascent < parentAscent ) {
						yFactor = ( parentAscent / ascent ) * yFactor ;
						// reset node attributes
						node.setAttribute ( "astex-ascent" , parseFloat ( node.getAttribute ( "astex-ascent" ) ) * ( parentAscent / ascent ) ) ;
						node.setAttribute ( "astex-descent" , parseFloat ( node.getAttribute ( "astex-descent" ) ) * ( parentAscent / ascent ) ) ;
					}
				}

				// vertically align any mtables and mfrac inside of {} [] () , etc.
				// matrices are surrounded by <mo></mo> tags containging LEFT/RIGHT BRACKETS
				// though not all mfracs are
				if ( token.category == Astex.Token.GROUPINGBRACKET ) {
					var parentsKids = node.parentNode.childNodes ;
					/*
					for ( i = 0 ; i < parentsKids.length ; i++ ) {
						var kid = parentsKids[i] ;
						if ( node == kid ) {
							// fix end (right) brackets
							// get previous child of parent and see if its an mtable/mfrac and adjust anchor
							if ( i-1 >= 0 && parentsKids[i-1].tagName.match(/mtable/i) ) {
								anchor = [ anchor[0] , anchor[1] - parseFloat(parentsKids[i-1].getAttribute("astex-descent")) ] ;
							}
							if ( i-1 >= 0 && parentsKids[i-1].tagName.match(/mfrac/i) ) {
								anchor = [ anchor[0] , anchor[1] - parseFloat(parentsKids[i-1].getAttribute("astex-descent")) + 0.5*Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor) ] ;
							}
							// fix beginning (left) brackets
							// get previous child of parent and see if its an mtable/mfrac and adjust anchor
							if ( i+1 < parentsKids.length && parentsKids[i+1].tagName.match(/mtable/i) ) {
								anchor = [ anchor[0] , anchor[1] - parseFloat(parentsKids[i+1].getAttribute("astex-descent")) ] ;
							}
							if ( i+1 < parentsKids.length && parentsKids[i+1].tagName.match(/mfrac/i) ) {
								anchor = [ anchor[0] , anchor[1] - parseFloat(parentsKids[i+1].getAttribute("astex-descent")) + 0.5*Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor) ] ;
							}
							break ;
						} 
					}
					*/

					// vertically align grouping bracket if there is a mfrac/mtable before/after it
					for ( i = 0 ; i < parentsKids.length ; i++ ) {
						var kid = parentsKids[i] ;
						var des = 0 ;
						if ( node == kid && token.ttype == Astex.Token.LEFTBRACKET ) {
							// search for all frac/table nodes after it (use max descent)
							for ( j = i+1 ; j < parentsKids.length ; j++ ) {
								if ( parentsKids[j].tagName.match(/mfrac|mtable/i) ) {
									var d = parseFloat ( parentsKids[j].getAttribute("astex-descent") ) ;
									if ( d > des ) { des = d ; }
								}
							}
							if ( des > 0 ) {
								anchor = [ anchor[0] , anchor[1] - des ] ;
							}
							break ;
						}
						else if ( node == kid && token.ttype == Astex.Token.RIGHTBRACKET ) {
							// search for all frac/table nodes before it (use max descent)
							for ( j = i-1 ; j >= 0 ; j-- ) {
								if ( parentsKids[j].tagName.match(/mfrac|mtable/i) ) {
									var d = parseFloat ( parentsKids[j].getAttribute("astex-descent") ) ;
									if ( d > des ) { des = d ; }
								}
							}
							if ( des > 0 ) {
								anchor = [ anchor[0] , anchor[1] - des ] ;
							}
							break ;
						}
						else if ( node == kid && token.ttype == Astex.Token.LEFTRIGHT ) {
							// search for all frac/table nodes before and after it (use max descent)
							for ( j = i+1 ; j < parentsKids.length ; j++ ) {
								if ( parentsKids[j].tagName.match(/mfrac|mtable/i) ) {
									var d = parseFloat ( parentsKids[j].getAttribute("astex-descent") ) ;
									if ( d > des ) { des = d ; }
								}
							}
							for ( j = i-1 ; j >= 0 ; j-- ) {
								if ( parentsKids[j].tagName.match(/mfrac|mtable/i) ) {
									var d = parseFloat ( parentsKids[j].getAttribute("astex-descent") ) ;
									if ( d > des ) { des = d ; }
								}
							}
							if ( des > 0 ) {
								anchor = [ anchor[0] , anchor[1] - des ] ;
							}
							break ;
						}
					}

				}

				// child node is a text node
				// symbol string will be drawn near end of function
				//Astex.MathML.processMathMLTags ( nodeChildren[0] , canvas , anchor , xFactor , yFactor , rotate , scewX ) ;
				Astex.MathML.processMathMLTags ( nodeChildren[0] , canvas , [anchor[0]+dx,anchor[1]+dy] , xFactor , yFactor , rotate , scewX ) ;
				break ;

			case "mi" :
			case "mn" :
			case "mtext" :
				var nodeChildren = node.childNodes ;	// length should be 1
				if ( nodeChildren.length != 1 && nodeChildren[0].nodeType != Node.TEXT_NODE ) {
					new Astex.Warning ( "mi/mn/mtext expect 1 text node as a child" , "Astex.MathML.processMathMLTags" ) ;
				}

				// child node is a text node
				// symbol string will be drawn near end of function
				//Astex.MathML.processMathMLTags ( nodeChildren[0] , canvas , anchor , xFactor , yFactor , rotate , scewX ) ;
				Astex.MathML.processMathMLTags ( nodeChildren[0] , canvas , [anchor[0],anchor[1]] , xFactor , yFactor , rotate , scewX ) ;
				break ;

			case "mspace" :
			case "mphantom" :
				var width = parseFloat ( node.getAttribute ( "astex-width" ) ) ;
				// move anchor to the right
				anchor = [ anchor[0] + width , anchor[1] ] ;
				break ;

			case "mstyle" :
				// save current color
				var currentColor = canvas.getColor ( ) ;
				// set color for processing child nodes
				var color = node.getAttribute ( "mathcolor" ) ;
				if ( color == null || color == 'undefined' ) { color = currentColor ; }
				canvas.setColor ( color ) ;

				// save current stroke
				var currentStroke = canvas.getStroke ( ) ;
				// set stroke for processing child nodes
				var stroke = currentStroke ;
				var weight = node.getAttribute ( "fontweight" ) ;
				if ( weight == null || weight == 'undefined' || weight == "" ) { stroke = currentStroke ; weight = "" ; }
				else if ( weight == "bold" ) { stroke = Astex.Font.Stroke.BOLD ; }

				// override stroke if fontweight of any mstyle parent is bold
				// cycle through parent mstyle nodes and see if any are bold
				// this is needed so italicizing and boldfacing can be nested w/in each other
				var parentN = node.parentNode ;
				while ( ! parentN.tagName.match(/math/i) ) {
					if ( parentN.tagName.match(/mstyle/i) ) {
						var w = parentN.getAttribute ( "fontweight" ) ;
						if ( ! w ) { w = "" ; }
						else if ( w == "bold" ) { stroke = Astex.Font.Stroke.BOLD ; break ; }
					}
					// get parent of parentN
					parentN = parentN.parentNode ;
				}

				canvas.setStroke ( parseInt(stroke) ) ;

				// italics
				var currentStyle = Astex.Font.Style.getStyle ( ) ;
				var style = node.getAttribute ( "fontstyle" ) ;
				if ( style == null || style == 'undefined' ) { style = Astex.Font.Style.PLAIN ; }
				else if ( style == "italic" ) { style = Astex.Font.Style.ITALIC ; scewX = 15 ; }
				else { style = Astex.Font.Style.PLAIN ; scewX = 0 ;}
				Astex.Font.Style.setStyle ( style ) ;
				//alert ( scewX ) ;

				// save current font type (default,calligraphy,etc.)
				var currentFontType = Astex.Font.Type.getType ( ) ;
				var newFontType = null ;
				if ( node.tagName.match(/mstyle/i) ) {
					newFontType = node.getAttribute ( "mathvariant" ) ;
					if ( newFontType && newFontType.match(/script/i) ) {
						Astex.Font.Type.setType ( Astex.Font.Type.CALLIGRAPHY ) ;
					}
					else if ( newFontType && newFontType.match(/double-struck/i) ) {
						Astex.Font.Type.setType ( Astex.Font.Type.BLACKBOARDBOLD ) ;
					}
					else {
						Astex.Font.Type.setType ( currentFontType ) ;
					}
				}

				var nodeChildren = node.childNodes ;	// variable length
				for ( var j = 0 ; j < nodeChildren.length ; j++ ) {
					// pass anchor by value, NOT by reference !!!
					//Astex.MathML.processMathMLTags ( nodeChildren[j] , canvas , anchor , xFactor , yFactor , rotate , scewX ) ;
					Astex.MathML.processMathMLTags ( nodeChildren[j] , canvas , [anchor[0],anchor[1]] , xFactor , yFactor , rotate , scewX ) ;
					// move anchor to the right
					anchor = [ anchor[0] + parseFloat(nodeChildren[j].getAttribute("astex-width")) , anchor[1] ] ;
				}

				// reset color
				canvas.setColor ( currentColor ) ;
				// reset stroke
				canvas.setStroke ( parseInt(currentStroke) ) ;
				// reset style and scewX
				Astex.Font.Style.setStyle ( currentStyle ) ;
				scewX = ( currentStyle == Astex.Font.Style.ITALIC ) ? scewX = 45 : 0 ;
				// reset font type
				Astex.Font.Type.setType ( currentFontType ) ;

				break ;

			case "mrow" :
				var nodeChildren = node.childNodes ;	// variable length
				for ( var j = 0 ; j < nodeChildren.length ; j++ ) {
					// pad anchor width
					// NOTE: we must pad width in case "mrow": in Astex.MathML.setMathMLTagDimensions
					// pass anchor by value, NOT by reference !!!
					//Astex.MathML.processMathMLTags ( nodeChildren[j] , canvas , anchor , xFactor , yFactor , rotate , scewX ) ;
					Astex.MathML.processMathMLTags ( nodeChildren[j] , canvas , [anchor[0],anchor[1]] , xFactor , yFactor , rotate , scewX ) ;
					// move anchor to the right
					anchor = [ anchor[0] + parseFloat(nodeChildren[j].getAttribute("astex-width")) , anchor[1] ] ;
				}

				break ;

			case "mtd" :
				var nodeChildren = node.childNodes ;	// variable length
				for ( var j = 0 ; j < nodeChildren.length ; j++ ) {
					var w = parseFloat ( nodeChildren[j].getAttribute ( "astex-width" ) ) ;
					//Astex.MathML.processMathMLTags ( nodeChildren[j] , canvas , anchor , xFactor , yFactor , rotate , scewX ) ;
					Astex.MathML.processMathMLTags ( nodeChildren[j] , canvas , [anchor[0],anchor[1]] , xFactor , yFactor , rotate , scewX ) ;
					anchor = [ anchor[0] + w , anchor[1] ] ;
				}

				break ;

			case "mtr" :

				// get column widths from mtable parent
				var str = node.parentNode.getAttribute ( "astex-col-widths" ) ;
				var colWidths = str.split(",") ;
				for ( var c = 0 ; c < colWidths.length ; c++ ) {
					colWidths[c] = parseFloat ( colWidths[c] ) ;
				}

				// get max column width from mtable parent
				//var maxWidth = parseFloat ( node.parentNode.getAttribute ( "astex-max-mtd-width" ) ) ;

				// get column alignment
				var colAlignment = node.parentNode.getAttribute ( "columnalign" ) ;
				if ( ! colAlignment ) { colAlignment = "" ; }
				colAlignment = colAlignment.replace ( /^\s*/ , "" ) ;
				colAlignment = colAlignment.replace ( /\s*$/ , "" ) ;
				var colAlignments = colAlignment.split ( " " ) ;	// left, right, center
				if ( colAlignments.length < colWidths.length ) {

					var diff = colWidths.length - colAlignments.length ;
					for ( var d = 0 ; d < diff ; d++ ) {
						colAlignments.push ( "left" ) ;		// left is default
					}
				}
				//alert ( colAlignments ) ;

				var nodeChildren = node.childNodes ;	// variable length
				for ( var j = 0 ; j < nodeChildren.length ; j++ ) {
					//var w = parseFloat ( node.getAttribute("astex-max-mtd-width") ) ;
					//var w = parseFloat ( node.parentNode.getAttribute("astex-max-mtd-width") ) ;
					// (j+1) is column number
					// process current column
					//Astex.MathML.processMathMLTags ( nodeChildren[j] , canvas , [anchor[0]+j*w,anchor[1]] , xFactor , yFactor , rotate , scewX ) ;
					//Astex.MathML.processMathMLTags ( nodeChildren[j] , canvas , [anchor[0]+j*w,anchor[1]] , xFactor , yFactor , rotate , scewX ) ;
					//Astex.MathML.processMathMLTags ( nodeChildren[j] , canvas , anchor , xFactor , yFactor , rotate , scewX ) ;
					//Astex.MathML.processMathMLTags ( nodeChildren[j] , canvas , [anchor[0]+((j!=0)?colWidths[j-1]:0),anchor[1]] , xFactor , yFactor , rotate , scewX ) ;
					// original
					//Astex.MathML.processMathMLTags ( nodeChildren[j] , canvas , [anchor[0],anchor[1]] , xFactor , yFactor , rotate , scewX ) ;
					//anchor = [ anchor[0] + colWidths[j] , anchor[1] ] ;
					//var dx = maxWidth - colWidths[j] ;
					var width = parseFloat ( nodeChildren[j].getAttribute("astex-width") ) ;	// get column width
					var dx = colWidths[j] - width ;						// maxcolwidth - currentcolwidth
					if ( dx > 0 ) {
						if ( colAlignments[j] == "center" ) {
							dx = dx / 2 ;
						}
						else if ( colAlignments[j] == "left" ) {
							dx = 0 ;
						}
					}
					Astex.MathML.processMathMLTags ( nodeChildren[j] , canvas , [anchor[0] + dx,anchor[1]] , xFactor , yFactor , rotate , scewX ) ;
					//anchor = [ anchor[0] + maxWidth , anchor[1] ] ;
					if ( j != nodeChildren.length - 1 ) {
						anchor = [ anchor[0] + colWidths[j] + Astex.Symbol.getSpaceWidth(xFactor) , anchor[1] ] ;
					}
					else {
						anchor = [ anchor[0] + colWidths[j] , anchor[1] ] ;
					}
				}

				break ;

			case "mtable" :
				var nodeChildren = node.childNodes ;	// variable length
				for ( var j = 0 ; j < nodeChildren.length ; j++ ) {
					var tableHeight = parseFloat ( node.getAttribute ( "astex-ascent" ) ) ;
					//tableHeight += parseFloat ( node.getAttribute ( "astex-descent" ) ) ;	// commented out for vertical-alignment
					var maxRowAscent = parseFloat ( node.getAttribute("astex-max-mtr-ascent") ) ;
					maxRowAscent += parseFloat ( node.getAttribute("astex-max-mtr-descent") ) ;
					// (j+1) is row number
					// process the current row of table
					//Astex.MathML.processMathMLTags ( nodeChildren[j] , canvas , [anchor[0],anchor[1]+tableHeight-(j+1)*maxRowAscent] , xFactor , yFactor , rotate , scewX ) ;
					//Astex.MathML.processMathMLTags ( nodeChildren[j] , canvas , [anchor[0],anchor[1]+tableHeight-(j+1)*maxRowAscent-Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor)] , xFactor , yFactor , rotate , scewX ) ;
					Astex.MathML.processMathMLTags ( nodeChildren[j] , canvas , [anchor[0],anchor[1]+tableHeight-(j+1)*maxRowAscent+Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor)] , xFactor , yFactor , rotate , scewX ) ;
				}

				break ;

			case "mfenced" :
				var nodeChildren = node.childNodes ;	// variable length
				var width = parseFloat ( node.getAttribute ( "astex-width" ) ) ;	// width includes ( )
				var ascent = parseFloat ( node.getAttribute ( "astex-ascent" ) ) ;
				//ascent += parseFloat ( node.getAttribute ( "astex-descent" ) ) ;
				var widthLP = Astex.Symbol.getSymbolStringWidth ( "(" , xFactor ) ;
				var widthRP = Astex.Symbol.getSymbolStringWidth ( ")" , xFactor ) ;
				var ascentLP = Astex.Symbol.getSymbolStringAscent ( "(" , yFactor ) ;
				var ascentRP = Astex.Symbol.getSymbolStringAscent ( ")" , yFactor ) ;
				// draw left (
				canvas.drawSymbolString ( "(" , [anchor[0],anchor[1]] , xFactor , (ascentLP<ascent)?(yFactor*(ascent/ascentLP)):yFactor , rotate , scewX ) ;
				anchor[0] += widthLP ;
				for ( var j = 0 ; j < nodeChildren.length ; j++ ) {
					Astex.MathML.processMathMLTags ( nodeChildren[j] , canvas , [anchor[0],anchor[1]] , xFactor , yFactor , rotate , scewX ) ;
					var w = parseFloat ( nodeChildren[j].getAttribute ( "astex-width" ) ) ;
					anchor[0] += w ;
				}
				// draw right ) 
				//canvas.drawSymbolString ( ")" , [anchor[0],anchor[1]] , xFactor , yFactor , rotate , scewX ) ;
				canvas.drawSymbolString ( ")" , [anchor[0],anchor[1]] , xFactor , (ascentRP<ascent)?(yFactor*(ascent/ascentRP)):yFactor , rotate , scewX ) ;

				break ;

			case "msup" :
			case "mover" :
				var nodeChildren = node.childNodes ;	// length should be 2
				if ( nodeChildren.length != 2 ) {
					new Astex.Warning ( "msup/mover expect 2 child nodes" , "Astex.MathML.processMathMLTags" ) ;
				}
				var child1 = nodeChildren[0] ;		// base
				var child2 = nodeChildren[1] ;		// superscript/overscript

				// process base
				//Astex.MathML.processMathMLTags ( child1 , canvas , anchor , xFactor , yFactor , rotate , scewX ) ;
				Astex.MathML.processMathMLTags ( child1 , canvas , [anchor[0],anchor[1]] , xFactor , yFactor , rotate , scewX ) ;
				// process superscript/overscript 
				var height1 = parseFloat ( child1.getAttribute("astex-ascent") ) ;
				var width1 = parseFloat ( child1.getAttribute("astex-width") ) ;
				var width2 = parseFloat ( child2.getAttribute("astex-width") ) ;
				if ( node.tagName.toLowerCase() == "msup" ) {
					//Astex.MathML.processMathMLTags ( child2 , canvas , [anchor[0]-Astex.Symbol.getSpaceWidthBetweenSymbols(xFactor),anchor[1]+height1] , Astex.MathML.subSupXFactor , Astex.MathML.subSupYFactor , rotate , scewX ) ;
					Astex.MathML.processMathMLTags ( child2 , canvas , [anchor[0]+width1-Astex.Symbol.getSpaceWidthBetweenSymbols(xFactor),anchor[1]+height1] , Astex.MathML.subSupXFactor , Astex.MathML.subSupYFactor , rotate , scewX ) ;
					//anchor = [anchor[0]-Astex.Symbol.getSpaceWidthBetweenSymbols(xFactor),anchor[1]+height1] ;
					//Astex.MathML.processMathMLTags ( child2 , canvas , anchor , Astex.MathML.subSupXFactor , Astex.MathML.subSupYFactor , rotate , scewX ) ;
				}
				else if ( node.tagName.toLowerCase() == "mover" ) {
					// the overscript should automatically be stretched to fit in case mo: above
					var dx = ( width2 - width1 ) / 2 ;

					//Astex.MathML.processMathMLTags ( child2 , canvas , [anchor[0],anchor[1]+height1+Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor)] , Astex.MathML.subSupXFactor , Astex.MathML.subSupYFactor , rotate , scewX ) ;
					//Astex.MathML.processMathMLTags ( child2 , canvas , [anchor[0]+dx,anchor[1]+height1+Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor)] , Astex.MathML.subSupXFactor , Astex.MathML.subSupYFactor , rotate , scewX ) ;
					//Astex.MathML.processMathMLTags ( child2 , canvas , [anchor[0],anchor[1]+height1+Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor)] , Astex.MathML.subSupXFactor , Astex.MathML.subSupYFactor , rotate , scewX ) ;
					Astex.MathML.processMathMLTags ( child2 , canvas , [anchor[0],anchor[1]+height1] , Astex.MathML.subSupXFactor , Astex.MathML.subSupYFactor , rotate , scewX ) ;
					/*
					var dx = ( width2 - width1 ) / 2 ;
					if ( dx > 0 ) {
						Astex.MathML.processMathMLTags ( child2 , canvas , [anchor[0]+width2+dx,anchor[1]+height1+Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor)] , Astex.MathML.subSupXFactor , Astex.MathML.subSupYFactor , rotate , scewX ) ;
					}
					else {
						Astex.MathML.processMathMLTags ( child2 , canvas , [anchor[0]+width1+dx,anchor[1]+height1+Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor)] , Astex.MathML.subSupXFactor , Astex.MathML.subSupYFactor , rotate , scewX ) ;
					}
					*/
				}
				break ;

			case "msub" :
			case "munder" :
				var nodeChildren = node.childNodes ;	// length should be 2
				if ( nodeChildren.length != 2 ) {
					new Astex.Warning ( "msub/munder expect 2 child nodes" , "Astex.MathML.processMathMLTags" ) ;
				}
				var child1 = nodeChildren[0] ;		// base 
				var child2 = nodeChildren[1] ;		// subscript/underscript 

				// process base
				//Astex.MathML.processMathMLTags ( child1 , canvas , anchor , xFactor , yFactor , rotate , scewX ) ;
				Astex.MathML.processMathMLTags ( child1 , canvas , [anchor[0],anchor[1]] , xFactor , yFactor , rotate , scewX ) ;
				// process subscript/underscript 
				var width1 = parseFloat ( child1.getAttribute("astex-width") ) ;
				var width2 = parseFloat ( child2.getAttribute("astex-width") ) ;
				var height1 = parseFloat ( child1.getAttribute("astex-ascent") ) ;
				var height2 = parseFloat ( child2.getAttribute("astex-ascent") ) ;
				if ( node.tagName.toLowerCase() == "msub" ) {
					//Astex.MathML.processMathMLTags ( child2 , canvas , [anchor[0]-Astex.Symbol.getSpaceWidthBetweenSymbols(xFactor),anchor[1]-height2+Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor)] , Astex.MathML.subSupXFactor , Astex.MathML.subSupYFactor , rotate , scewX ) ;
					//Astex.MathML.processMathMLTags ( child2 , canvas , [anchor[0]+width1-Astex.Symbol.getSpaceWidthBetweenSymbols(xFactor),anchor[1]-height2+Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor)] , Astex.MathML.subSupXFactor , Astex.MathML.subSupYFactor , rotate , scewX ) ;
					Astex.MathML.processMathMLTags ( child2 , canvas , [anchor[0]+width1,anchor[1]-height2+Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor)] , Astex.MathML.subSupXFactor , Astex.MathML.subSupYFactor , rotate , scewX ) ;
				}
				else if ( node.tagName.toLowerCase() == "munder" ) {
					// the underscript should automatically be stretched to fit in case mo: above
					//var dx = ( width2 - width1 ) / 2 ;
					// fix underline (since _ underscore descended too low to appear)
					// underline appears only in an munder tag
					// the value of the first (and only) child node should be a _
					if ( child2.childNodes[0].nodeValue == "_" || child2.childNodes[0].nodeValue == "\u0332" || child2.childNodes[0].nodeValue == "\u00AF" ) {
						var dx = Astex.Symbol.getSpaceWidthBetweenSymbols ( xFactor ) ;
						var dy = Astex.Symbol.getSpaceWidthBetweenSymbols ( yFactor ) ;
						//canvas.drawLine ( anchor[0] , anchor[1] - dy , anchor[0] + width1 - Astex.Symbol.getSpaceWidth , anchor[1] - dy ) ;
						//canvas._drawLine ( anchor[0] , anchor[1] - dy , anchor[0] + width1 - Astex.Symbol.getSpaceWidth(xFactor) , anchor[1] - dy ) ;
						canvas.drawLine ( anchor[0] - 2*dx , anchor[1] - dy , anchor[0] + width1 , anchor[1] - dy ) ;
						//canvas.drawPolyLine ( [anchor[0],anchor[0]+width1-Astex.Symbol.getSpaceWidth(xFactor)] , [anchor[1]-dy,anchor[1]-dy] ) ;
						//canvas.drawLine ( anchor[0] , anchor[1] - dy - height1 , anchor[0] + width1 - Astex.Symbol.getSpaceWidth(xFactor) , anchor[1] - dy - height1 ) ;
					}
					/*
					else if ( dx > 0 ) {
						Astex.MathML.processMathMLTags ( child2 , canvas , [anchor[0]-width1+dx,anchor[1]-height2-Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor)] , Astex.MathML.subSupXFactor , Astex.MathML.subSupYFactor , rotate , scewX ) ;
					}
					else {
						Astex.MathML.processMathMLTags ( child2 , canvas , [anchor[0]-width2+dx,anchor[1]-height2-Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor)] , Astex.MathML.subSupXFactor , Astex.MathML.subSupYFactor , rotate , scewX ) ;
					}
					*/
					else {
						var dx = Astex.Symbol.getSpaceWidthBetweenSymbols ( xFactor ) ;
						Astex.MathML.processMathMLTags ( child2 , canvas , [Astex.Math.max(anchor[0]-dx,canvas.xmin),anchor[1]-height2-Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor)] , Astex.MathML.subSupXFactor , Astex.MathML.subSupYFactor , rotate , scewX ) ;
					}
				}

				break ;

			case "msubsup" :
			case "munderover" :
				var nodeChildren = node.childNodes ;	// length should be 3
				if ( nodeChildren.length != 3 ) {
					new Astex.Warning ( "msubsup/munderover expects 3 child nodes" , "Astex.MathML.processMathMLTags" ) ;
				}
				var child1 = nodeChildren[0] ;		// base 
				var child2 = nodeChildren[1] ;		// subscript/underscript
				var child3 = nodeChildren[2] ;		// superscript/overscript

				var ascent1 = parseFloat ( child1.getAttribute("astex-ascent") ) ;
				ascent2 += parseFloat ( child1.getAttribute("astex-descent") ) ;
				var parentAscent = parseFloat ( node.getAttribute("astex-ascent") ) ;
				parentAscent += parseFloat ( node.getAttribute("astex-descent") ) ;
				//if ( ascent1 < parentAscent ) { yFactor *= ( parentAscent / ascent1 ) ; yFactor = 1 / yFactor ; }

				// process base
				//Astex.MathML.processMathMLTags ( child1 , canvas , anchor , xFactor , yFactor , rotate , scewX ) ;
				Astex.MathML.processMathMLTags ( child1 , canvas , [anchor[0],anchor[1]] , xFactor , yFactor , rotate , scewX ) ;

				var height1 = parseFloat ( child1.getAttribute("astex-ascent") ) ;
				//if ( ascent1 < parentAscent ) { height1 *= (parentAscent/ascent1) ; }
				var height2 = parseFloat ( child2.getAttribute("astex-ascent") ) ;
				var height3 = parseFloat ( child3.getAttribute("astex-ascent") ) ;
				height3 += parseFloat ( child3.getAttribute("astex-descent") ) ;
				var width1 = parseFloat ( child1.getAttribute("astex-width") ) ;
				var width2 = parseFloat ( child2.getAttribute("astex-width") ) ;
				var width3 = parseFloat ( child3.getAttribute("astex-width") ) ;

				/*
				//if ( child1.childNodes[0].nodeValue == "Sigma" ) { alert ( child1.tagName ) ; }
				if ( child1.childNodes[0].nodeValue.match(/Sigma|Pi/) ) {
					yFactor *= parentAscent / ascent1 ;
					height1 *= parentAscent / ascent1 ;
				}
				*/

				if ( node.tagName.toLowerCase() == "msubsup" ) {
					// process subscript
					//Astex.MathML.processMathMLTags ( child2 , canvas , [anchor[0]-Astex.Symbol.getSpaceWidthBetweenSymbols(xFactor),anchor[1]-height2+Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor)] , Astex.MathML.subSupXFactor , Astex.MathML.subSupYFactor , rotate , scewX ) ;
					Astex.MathML.processMathMLTags ( child2 , canvas , [anchor[0]+width1-Astex.Symbol.getSpaceWidthBetweenSymbols(xFactor),anchor[1]-height2+Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor)] , Astex.MathML.subSupXFactor , Astex.MathML.subSupYFactor , rotate , scewX ) ;
					// process superscript
					//Astex.MathML.processMathMLTags ( child3 , canvas , [anchor[0]-Astex.Symbol.getSpaceWidthBetweenSymbols(xFactor),anchor[1]+height1] , Astex.MathML.subSupXFactor , Astex.MathML.subSupYFactor , rotate , scewX ) ;
					Astex.MathML.processMathMLTags ( child3 , canvas , [anchor[0]+width1-Astex.Symbol.getSpaceWidthBetweenSymbols(xFactor),anchor[1]+height1] , Astex.MathML.subSupXFactor , Astex.MathML.subSupYFactor , rotate , scewX ) ;
				}
				else if ( node.tagName.toLowerCase() == "munderover" ) {
					// process underscript
					// the underscript should automatically be stretched to fit in case mo: above
					// the underscript should automatically be stretched to fit in case mo: above
					var dx = ( width2 - width1 ) / 2 ;
					/*
					if ( dx > 0 ) {
						Astex.MathML.processMathMLTags ( child2 , canvas , [anchor[0]-width2+dx,anchor[1]-height2-Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor)] , Astex.MathML.subSupXFactor , Astex.MathML.subSupYFactor , rotate , scewX ) ;
					}
					else {
						Astex.MathML.processMathMLTags ( child2 , canvas , [anchor[0]-width1+dx,anchor[1]-height2-Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor)] , Astex.MathML.subSupXFactor , Astex.MathML.subSupYFactor , rotate , scewX ) ;
					}
					*/
					//Astex.MathML.processMathMLTags ( child2 , canvas , [Astex.Math.max(anchor[0]-dx,canvas.xmin),anchor[1]-height2-Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor)] , Astex.MathML.subSupXFactor , Astex.MathML.subSupYFactor , rotate , scewX ) ;
					var x = Astex.Math.max(anchor[0]-dx,canvas.xmin) ;
					var y = anchor[1]-height2-Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor) ;
					Astex.MathML.processMathMLTags ( child2 , canvas , [x,y] , Astex.MathML.subSupXFactor , Astex.MathML.subSupYFactor , rotate , scewX ) ;
					//Astex.MathML.processMathMLTags ( child2 , canvas , [anchor[0]-width2,anchor[1]-height2-Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor)] , Astex.MathML.subSupXFactor , Astex.MathML.subSupYFactor , rotate , scewX ) ;
					// process overscript
					dx = ( width3 - width1 ) / 2 ;
					// the overscript should automatically be stretched to fit in case mo: above
					//Astex.MathML.processMathMLTags ( child3 , canvas , [anchor[0]-2*width3,anchor[1]+height1+Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor)] , Astex.MathML.subSupXFactor , Astex.MathML.subSupYFactor , rotate , scewX ) ;
					//Astex.MathML.processMathMLTags ( child3 , canvas , [anchor[0]+dx,anchor[1]+height1+Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor)] , Astex.MathML.subSupXFactor , Astex.MathML.subSupYFactor , rotate , scewX ) ;
					//
					// has anchor been affected by prevoious call ??? (added height2 to adjust y-coord)
					//
					//Astex.MathML.processMathMLTags ( child3 , canvas , [anchor[0]-dx,anchor[1]+height1+Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor)] , Astex.MathML.subSupXFactor , Astex.MathML.subSupYFactor , rotate , scewX ) ;
					//Astex.MathML.processMathMLTags ( child3 , canvas , [anchor[0]-dx,anchor[1]+height1+height2+Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor)] , Astex.MathML.subSupXFactor , Astex.MathML.subSupYFactor , rotate , scewX ) ;
					//Astex.MathML.processMathMLTags ( child3 , canvas , [anchor[0]-dx,anchor[1]+height1+height2-height3+2*Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor)] , Astex.MathML.subSupXFactor , Astex.MathML.subSupYFactor , rotate , scewX ) ;
					//var x = anchor[0]-dx ;
					var x = Astex.Math.max(anchor[0]-dx,canvas.xmin) ;
					//var y = anchor[1]+height1-height3+Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor) ;
					//var y = anchor[1]+height1-height3+2*Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor) ;
					//var y = anchor[1] + height1 - Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor) ;
					var y = anchor[1] + height1 ;
					//var y = anchor[1]+height1-height3 ;
					//var y = anchor[1]+height1 ;
					//var y = anchor[1]+height1-height3-Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor) ;
					//var y = anchor[1]+height1-height3-2*Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor) ;
					Astex.MathML.processMathMLTags ( child3 , canvas , [x,y] , Astex.MathML.subSupXFactor , Astex.MathML.subSupYFactor , rotate , scewX ) ;
				}

				break ;

			case "menclose" :

				var nodeChildren = node.childNodes ;	// length should be 1
				if ( nodeChildren.length != 1 && nodeChildren[0].nodeType != Node.ELEMENT_NODE ) {
					new Astex.Warning ( "menclose expects 1 element node as a child" , "Astex.MathML.processMathMLTags" ) ;
				}

				var notation = node.getAttribute ( "notation" ) ;
				if ( notation == "longdiv" ) {

					var width = parseFloat ( nodeChildren[0].getAttribute ( "astex-width" ) ) ;
					//width += Astex.Symbol.getSpaceWidthBetweenSymbols ( xFactor ) ;
					//width += 0.75 * Astex.Symbol.getSpaceWidth ( xFactor ) ;
					width += 2 * Astex.Symbol.getSpaceWidth ( xFactor ) ;
					var ascent = parseFloat ( nodeChildren[0].getAttribute ( "astex-ascent" ) ) ;
					var descent = parseFloat ( nodeChildren[0].getAttribute ( "astex-descent" ) ) ;

					// draw long division symbol 
					// padding for beginning of long div is Astex.Symbol.getSpaceWidth ( xFactor )
					// padding for top of long div is Astex.Symbol.getSpaceWidthBetweenSymbols ( yFactor )
					var svg = "" ;
					svg += "M" + anchor[0] + "," + anchor[1] + " " ;
					svg += "A" + (anchor[0] + 0.5*Astex.Symbol.getSpaceWidth(xFactor)) + "," + (anchor[1] + 0.5 * ascent) + " " ;
					svg += "A" + anchor[0] + "," + (anchor[1] + ascent) + " " ;
					svg += "L" + (anchor[0] + width) + "," + (anchor[1] + ascent) + " " ;
					//alert ( svg ) ;
					canvas.drawSVGPath ( svg , false ) ;

					// process child node
					Astex.MathML.processMathMLTags ( nodeChildren[0] , canvas , [anchor[0]+1*Astex.Symbol.getSpaceWidth(xFactor),anchor[1]] , xFactor , yFactor , rotate , scewX ) ;

				}

				break ;

			case "msqrt" :

				var nodeChildren = node.childNodes ;	// length should be 1
				if ( nodeChildren.length != 1 && nodeChildren[0].nodeType != Node.ELEMENT_NODE ) {
					new Astex.Warning ( "msqrt expects 1 element node as a child" , "Astex.MathML.processMathMLTags" ) ;
				}

				var width = parseFloat ( nodeChildren[0].getAttribute ( "astex-width" ) ) ;
				//width += Astex.Symbol.getSpaceWidthBetweenSymbols ( xFactor ) ;
				width += 0.75 * Astex.Symbol.getSpaceWidth ( xFactor ) ;
				var ascent = parseFloat ( nodeChildren[0].getAttribute ( "astex-ascent" ) ) ;
				var descent = parseFloat ( nodeChildren[0].getAttribute ( "astex-descent" ) ) ;

				// draw root symbol
				// padding for beginning of sqrt is Astex.Symbol.getSpaceWidth ( xFactor )
				// padding for top of sqrt is Astex.Symbol.getSpaceWidthBetweenSymbols ( yFactor )
				var X = [] ;
				var Y = [] ;
				//canvas.drawLine ( anchor[0] , anchor[1] + 0.5 * ascent , anchor[0] + 0.25 * Astex.Symbol.getSpaceWidth(xFactor) , anchor[1] + 0.5 * ascent ) ;
				X.push ( anchor[0] ) ;
				Y.push ( anchor[1] + 0.5 * ascent ) ;

				X.push ( anchor[0] + 0.25 * Astex.Symbol.getSpaceWidth(xFactor) ) ;
				Y.push ( anchor[1] + 0.5 * ascent ) ;

				X.push ( anchor[0] + 0.5 * Astex.Symbol.getSpaceWidth(xFactor) ) ;
				//Y.push ( anchor[1] ) ;
				Y.push ( anchor[1] - descent ) ;

				X.push ( anchor[0] + 1 * Astex.Symbol.getSpaceWidth(xFactor) ) ;
				//Y.push ( anchor[1] + 1 * ascent ) ;
				Y.push ( anchor[1] + 1 * ascent + 4*Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor) ) ;

				X.push ( anchor[0] + width ) ;
				//Y.push ( anchor[1] + 1 * ascent ) ;
				Y.push ( anchor[1] + 1 * ascent + 4*Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor) ) ;

				canvas.drawPolyLine ( X , Y ) ;

				// process child node
				Astex.MathML.processMathMLTags ( nodeChildren[0] , canvas , [anchor[0]+Astex.Symbol.getSpaceWidth(xFactor),anchor[1]] , xFactor , yFactor , rotate , scewX ) ;

				break ;

			case "mroot" :

				var nodeChildren = node.childNodes ;	// length should be 2
				if ( nodeChildren.length != 1 && nodeChildren[0].nodeType != Node.ELEMENT_NODE ) {
					new Astex.Warning ( "mroot expects 2 child nodes" , "Astex.MathML.processMathMLTags" ) ;
				}

				var child1 = nodeChildren[0] ;		// radicand
				var child2 = nodeChildren[1] ;		// index (power)

				var width1 = parseFloat ( child1.getAttribute ( "astex-width" ) ) ;
				var ascent1 = parseFloat ( child1.getAttribute ( "astex-ascent" ) ) ;
				var descent1 = parseFloat ( child1.getAttribute ( "astex-descent" ) ) ;

				var width2 = parseFloat ( child2.getAttribute ( "astex-width" ) ) ;
				var ascent2 = parseFloat ( child2.getAttribute ( "astex-ascent" ) ) ;
				var descent2 = parseFloat ( child2.getAttribute ( "astex-descent" ) ) ;

				// reassign width2
				width2 = Astex.Math.max ( width2 , Astex.Symbol.getSpaceWidth(xFactor) ) ;

				// draw root symbol
				var X = [] ;
				var Y = [] ;
				//canvas.drawLine ( anchor[0] , anchor[1] + 0.5 * ascent , anchor[0] + 0.25 * Astex.Symbol.getSpaceWidth(xFactor) , anchor[1] + 0.5 * ascent ) ;
				X.push ( anchor[0] ) ;
				Y.push ( anchor[1] + 0.5 * ascent1 ) ;

				X.push ( anchor[0] + 0.25 * width2 ) ;
				Y.push ( anchor[1] + 0.5 * ascent1 ) ;

				X.push ( anchor[0] + 0.5 * width2 ) ;
				//Y.push ( anchor[1] ) ;
				Y.push ( anchor[1] - descent1 ) ;

				X.push ( anchor[0] + 1 * width2 ) ;
				//Y.push ( anchor[1] + 1 * ascent1 ) ;
				Y.push ( anchor[1] + 1 * ascent1 + 4*Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor) ) ;

				X.push ( anchor[0] + width2 + width1 ) ;
				//Y.push ( anchor[1] + 1 * ascent1 ) ;
				Y.push ( anchor[1] + 1 * ascent1 + 4*Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor) ) ;

				canvas.drawPolyLine ( X , Y ) ;

				// process radicand
				//Astex.MathML.processMathMLTags ( child1 , canvas , [anchor[0]+Astex.Symbol.getSpaceWidth(xFactor),anchor[1]] , xFactor , yFactor , rotate , scewX ) ;
				Astex.MathML.processMathMLTags ( child1 , canvas , [anchor[0]+width2,anchor[1]] , xFactor , yFactor , rotate , scewX ) ;

				// process index 
				Astex.MathML.processMathMLTags ( child2 , canvas , [anchor[0],anchor[1]+0.75*ascent1] , Astex.MathML.subSupXFactor , Astex.MathML.subSupYFactor , rotate , scewX ) ;

				break ;

			case "mfrac" :
				var nodeChildren = node.childNodes ;	// length should be 2
				if ( nodeChildren.length != 2 ) {
					new Astex.Warning ( "mfrac expects 2 child nodes" , "Astex.MathML.processMathMLTags" ) ;
				}
				var child1 = nodeChildren[0] ;		// mi/mn/mo/mrow (numerator)
				var child2 = nodeChildren[1] ;		// mi/mn/mo/mrow (denominator)

				var numWidth = parseFloat ( child1.getAttribute ( "astex-width" ) ) ;
				var denWidth = parseFloat ( child2.getAttribute ( "astex-width" ) ) ;

				// remove padding of widths
				numWidth -= Astex.Symbol.getSpaceWidthBetweenSymbols ( xFactor ) ;
				denWidth -= Astex.Symbol.getSpaceWidthBetweenSymbols ( xFactor ) ;

				//alert ( numWidth + " , " + denWidth ) ;
				//var maxWidth = (numWidth >= denWidth) ? numWidth : denWidth ;
				//maxWidth += 0.5 * xFactor ;
				//var maxWidth = Astex.Math.max ( numWidth , denWidth ) + 2*Astex.Symbol.getSpaceWidthBetweenSymbols(xFactor) ;
				var maxWidth = Astex.Math.max ( numWidth , denWidth ) ;
				//maxWidth -= Astex.Symbol.getSpaceWidthBetweenSymbols ( xFactor ) ;
				var numDescent = parseFloat ( child1.getAttribute ( "astex-descent" ) ) ;
				var denHeight = parseFloat ( child2.getAttribute ( "astex-ascent" ) ) ;

				// get linethickness attribute of mfrac node
				var thick = node.getAttribute ( "linethickness" ) ;
				if ( ! thick || thick == "" ) { thick = "1em" ; }
				thick = thick.replace ( /[a-zA-Z]/g , "" ) ;
				thick = parseFloat ( thick ) ;

				if ( thick != 0 ) {
					// draw fraction bar
					// note that we draw the line 2 * Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor) 
					// units above the denominator's height
					// since we padded the ascent in Astex.MathML.setMathMLTagDimensions
					//canvas.drawLine ( anchor[0] , anchor[1] + denHeight + 2 * Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor) , anchor[0] + maxWidth , anchor[1] + denHeight + 2 * Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor) ) ;
					canvas.drawLine ( anchor[0] , anchor[1] + 5 * Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor) , anchor[0] + maxWidth , anchor[1] + 5 * Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor) ) ;
				}

				// center numerator
				var dx = 0 ;				// variable for centering numerator and denominator
				if ( numWidth < maxWidth ) {
					dx = ( maxWidth - numWidth ) / 2 ;
				}

				// draw numerator (above fraction bar)
				// note that we draw the numerator 4 * Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor) 
				// units above the denominator's height
				// which is actually 2 * Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor) 
				// units above the fraction bar
				// and we also pad by descent of numerator
				//Astex.MathML.processMathMLTags ( child1 , canvas , [anchor[0]+dx,anchor[1]+numDescent+denHeight+4*Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor)] , xFactor/Astex.MathML.MFracDivisor , yFactor/Astex.MathML.MFracDivisor , rotate , scewX ) ;
				Astex.MathML.processMathMLTags ( child1 , canvas , [anchor[0]+dx,anchor[1]+numDescent+7*Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor)] , xFactor/Astex.MathML.MFracDivisor , yFactor/Astex.MathML.MFracDivisor , rotate , scewX ) ;

				// center denominator
				dx = 0 ;
				if ( denWidth < maxWidth ) {
					dx = ( maxWidth - denWidth ) / 2 ;
				}
				// draw denominator (at anchor, w/ x-coordinated centered within fraction)
				//this.drawTokenString ( den , [anchor[0]+dx,anchor[1]] , xFactor/2 , yFactor/2 ) ;
				//Astex.MathML.processMathMLTags ( child2 , canvas , [anchor[0]+dx,anchor[1]] , xFactor/Astex.MathML.MFracDivisor , yFactor/Astex.MathML.MFracDivisor , rotate , scewX ) ;
				Astex.MathML.processMathMLTags ( child2 , canvas , [anchor[0]+dx,anchor[1]-denHeight+3*Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor)] , xFactor/Astex.MathML.MFracDivisor , yFactor/Astex.MathML.MFracDivisor , rotate , scewX ) ;

				break ;

			default :

				break ;
		}
	}
	else if ( node.nodeType == Node.TEXT_NODE ) {

		/*
		switch ( node.nodeValue ) {

			//case "+" :
			//case "-" :
			//case "=" :
			case "times-x" : case "\u00D7" :
			case "times-dot" : case "\u22C5" :

				// vertically align text
				var width = parseFloat ( node.parentNode.getAttribute ( "astex-width" ) ) ; 	// width of parent mi/mo/mn
				var ascent = parseFloat ( node.parentNode.getAttribute ( "astex-ascent" ) ) ; 	// ascent of parent mi/mo/mn
				var parentAscent = parseFloat ( node.parentNode.parentNode.getAttribute ( "astex-ascent" ) ) ; 	// ascent of grandparent mi/mo/mn
				var dy = 0 ;
				if ( ascent < parentAscent ) {
					dy = ( parentAscent - ascent ) / 2 ;
					anchor = [ anchor[0] , anchor[1] + dy ] ;
				}
				 break ;
		}
		*/

		/*	
		// fix dot, ddot, tdot dot operators by making dots smaller
		// parentNode should be mo
		// grandparent should be mover
		if ( node.parentNode.parentNode.tagName.match(/mover/i) ) {
			if ( node.nodeValue == "." || node.nodeValue == ".." || node.nodeValue == "..." ) {
				xFactor /= 2 ;
				yFactor /= 2 ;
			}
		}
		*/

		/*
		// vertically align text
		var width = parseFloat ( node.parentNode.getAttribute ( "astex-width" ) ) ; 	// width of parent mi/mo/mn
		var ascent = parseFloat ( node.parentNode.getAttribute ( "astex-ascent" ) ) ; 	// ascent of parent mi/mo/mn
		var parentAscent = parseFloat ( node.parentNode.parentNode.getAttribute ( "astex-ascent" ) ) ; 	// ascent of grandparent mi/mo/mn
		var dy = 0 ;
		if ( ascent < parentAscent ) {
			dy = ( parentAscent - ascent ) / 2 ;
			//anchor = [ anchor[0] , anchor[1] + dy ] ;
		}
		*/

		// will this help w/ centering accents ???
		anchor[0] += 0.25 * Astex.Symbol.getSpaceWidthBetweenSymbols ( xFactor ) ;
		// draw the text in the text node
		//canvas.drawSymbolString ( node.nodeValue , anchor , xFactor , yFactor , rotate , scewX ) ;
		if ( node.parentNode.tagName.match(/mtext/i) ) {
			canvas.drawSymbolChars ( node.nodeValue , [anchor[0],anchor[1]] , xFactor , yFactor , rotate , scewX ) ;
		}
		else {
			canvas.drawSymbolString ( node.nodeValue , [anchor[0],anchor[1]] , xFactor , yFactor , rotate , scewX ) ;
			//canvas.drawSymbolString ( node.nodeValue , [anchor[0],anchor[1]+dy] , xFactor , yFactor , rotate , scewX ) ;
		}
	}
	else {
		// fail gracefully
		//new Astex.Warning ( "Expected mathml tag, got nodeType " + node.nodeType , "Astex.processMathML" ) ;
	}
};


/*

will need to implement rotate (maybe scew)
if rotate is 90 degrees or 270 degrees, will need to swap width and height attributes !!!

will also need a way to rotate fraction bars and square root symbols , underlines , etc. in processMathMLTags above

*/


// prototype: void Astex.MathML.setMathMLTagDimensions ( HTMLElement node , Float xFactor , Float yFactor )
Astex.MathML.setMathMLTagDimensions = function ( node , xFactor , yFactor ) {

	if ( ! xFactor || typeof xFactor != "number" ) { xFactor = 1 ; }
	if ( ! yFactor || typeof yFactor != "number" ) { yFactor = 1 ; }

	// do this only once per node
	if ( ! Astex.MathML.subSupFactorsSet ) {
		//alert ( "111" ) ;
		Astex.MathML.subSupXFactor = xFactor / 2 ;
		Astex.MathML.subSupYFactor = yFactor / 2 ;
		Astex.MathML.subSupFactorsSet = true ; 
	}
	//Astex.MathML.subSupXFactor = xFactor / 2 ;
	//Astex.MathML.subSupYFactor = yFactor / 2 ;

	if ( node.nodeType == Node.ELEMENT_NODE ) {

		// switch on the the tag name of the node
		switch ( node.tagName.toLowerCase() ) {

			case "math" :
				var nodeChildren = node.childNodes ;	// length should be 1
				if ( nodeChildren.length != 1 && nodeChildren[0].nodeType != Node.ELEMENT_NODE && nodeChildren[0].tagName.toLowerCase() != "mstyle" ) {
					new Astex.Warning ( "math node expects 1 mstyle node as a child" , "Astex.MathML.setMathMLTagDimensions" ) ;
				}

				// calculate dimensions of child node
				Astex.MathML.setMathMLTagDimensions ( nodeChildren[0] , xFactor , yFactor ) ;

				// get dimensions of "mstyle" node
				var width = parseFloat ( nodeChildren[0].getAttribute ( "astex-width" ) ) ;
				var ascent = parseFloat ( nodeChildren[0].getAttribute ( "astex-ascent" ) ) ;
				var descent = parseFloat ( nodeChildren[0].getAttribute ( "astex-descent" ) ) ;

				// pad node
				//width += Astex.Symbol.getSpaceWidthBetweenSymbols ( xFactor ) ;
				ascent += Astex.Symbol.getSpaceWidthBetweenSymbols ( yFactor ) ;
				//descent += Astex.Symbol.getSpaceWidthBetweenSymbols ( yFactor ) ;
				descent += Astex.Symbol.getSpaceWidth ( yFactor ) ;

				// set dimensions of math node
				node.setAttribute ( "astex-width" , width ) ;
				node.setAttribute ( "astex-ascent" , ascent ) ;
				node.setAttribute ( "astex-descent" , descent ) ;

				break ;

			case "mo" :
				var nodeChildren = node.childNodes ;	// length should be 1
				if ( nodeChildren.length != 1 && nodeChildren[0].nodeType != Node.TEXT_NODE ) {
					new Astex.Warning ( "mo expects 1 text node as a child" , "Astex.MathML.setMathMLTagDimensions" ) ;
				}

				// child node is a text node
				// calculate dimensions of child node
				Astex.MathML.setMathMLTagDimensions ( nodeChildren[0] , xFactor , yFactor ) ;

				break ;

			case "mi" :
			case "mn" :
			case "mtext" :
				var nodeChildren = node.childNodes ;	// length should be 1
				if ( nodeChildren.length != 1 && nodeChildren[0].nodeType != Node.TEXT_NODE ) {
					new Astex.Warning ( "mi/mn/mtext expect 1 text node as a child" , "Astex.MathML.setMathMLTagDimensions" ) ;
				}

				// child node is a text node
				// calculate dimensions of child node
				Astex.MathML.setMathMLTagDimensions ( nodeChildren[0] , xFactor , yFactor ) ;
				break ;

			case "mspace" :

				// get the spaceWidth created by Astex.AMath
				//
				// what is difference between 1ex and 1em ???
				//
				var spaceWidth = node.getAttribute ( "width" ) ;
				if ( spaceWidth.match ( /ex/ ) ) {
					// remove ex/em from spaceWidth
					spaceWidth = spaceWidth.replace ( /[a-zA-Z]*/g , "" ) ;
					spaceWidth = parseFloat ( spaceWidth ) ;
				}
				else if ( spaceWidth.match ( /em/ ) ) {
					// remove ex/em from spaceWidth
					spaceWidth = spaceWidth.replace ( /[a-zA-Z]*/g , "" ) ;
					spaceWidth = parseFloat ( spaceWidth ) ;
				}
				else {
					// remove any other units from spaceWidth
					spaceWidth = spaceWidth.replace ( /[a-zA-Z]*/g , "" ) ;
					spaceWidth = parseFloat ( spaceWidth ) ;
				}

				//node.setAttribute ( "astex-width" , Astex.Symbol.maxWidth * xFactor ) ;
				node.setAttribute ( "astex-width" , spaceWidth * xFactor ) ;
				node.setAttribute ( "astex-ascent" , 0 ) ;
				node.setAttribute ( "astex-descent" , 0 ) ;
				break ;

			case "mfenced" :
			case "mstyle" :
			case "mrow" :
			case "mphantom" :
			case "mtd" :

				// save current font type (default,calligraphy,etc.)
				var currentFontType = Astex.Font.Type.getType ( ) ;
				var newFontType = null ;
				if ( node.tagName.match(/mstyle/i) ) {
					newFontType = node.getAttribute ( "mathvariant" ) ;
					if ( newFontType && newFontType.match(/script/i) ) {
						Astex.Font.Type.setType ( Astex.Font.Type.CALLIGRAPHY ) ;
					}
					else if ( newFontType && newFontType.match(/double-struck/i) ) {
						Astex.Font.Type.setType ( Astex.Font.Type.BLACKBOARDBOLD ) ;
					}
					else {
						Astex.Font.Type.setType ( currentFontType ) ;
					}
				}

				var nodeChildren = node.childNodes ;	// variable length
				var width = 0 , ascent = 0 , descent = 0 ;
				for ( var j = 0 ; j < nodeChildren.length ; j++ ) {
					// set dimensions of child node
					Astex.MathML.setMathMLTagDimensions ( nodeChildren[j] , xFactor , yFactor ) ;
					// calculate dimensions of mrow/mstyle/mtr/mtable
					width += parseFloat ( nodeChildren[j].getAttribute ( "astex-width" ) ) ;
					// pad width
					//width += Astex.Symbol.getSpaceWidthBetweenSymbols(xFactor) ;
					var tmpAscent = parseFloat ( nodeChildren[j].getAttribute ( "astex-ascent" ) ) ;
					var tmpDescent = parseFloat ( nodeChildren[j].getAttribute ( "astex-descent" ) ) ;
					ascent = ( ascent < tmpAscent ) ? tmpAscent : ascent ;
					descent = ( descent < tmpDescent ) ? tmpDescent : descent ;
				}

				// set dimensions of of node 
				if ( node.tagName.match(/mfenced/i) ) {
					width += Astex.Symbol.getSymbolStringWidth ( "(" , xFactor ) ;
					width += Astex.Symbol.getSymbolStringWidth ( ")" , xFactor ) ;
					var tmpAscent = Astex.Symbol.getSymbolStringAscent ( "(" , yFactor ) ;
					ascent = ( ascent < tmpAscent ) ? tmpAscent : ascent ;
				}
				node.setAttribute ( "astex-width" , width ) ;
				node.setAttribute ( "astex-ascent" , ascent ) ;
				node.setAttribute ( "astex-descent" , descent ) ;

				// reset font type
				Astex.Font.Type.setType ( currentFontType ) ;

				break ;

			case "mtr" :
				var nodeChildren = node.childNodes ;	// variable length
				var width = 0 , ascent = 0 , descent = 0 ;
				for ( var j = 0 ; j < nodeChildren.length ; j++ ) {
					// set dimensions of child node
					Astex.MathML.setMathMLTagDimensions ( nodeChildren[j] , xFactor , yFactor ) ;
					var tmpWidth = parseFloat ( nodeChildren[j].getAttribute ( "astex-width" ) ) ;
					// pad width
					//tmpWidth += Astex.Symbol.getSpaceWidth(xFactor) ;
					//tmpWidth += Astex.Symbol.getSpaceWidthBetweenSymbols(xFactor) ;
					width += tmpWidth ;
					var tmpAscent = parseFloat ( nodeChildren[j].getAttribute ( "astex-ascent" ) ) ;
					// pad ascent 
					//tmpAscent += Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor) ;
					var tmpDescent = parseFloat ( nodeChildren[j].getAttribute ( "astex-descent" ) ) ;
					//width = ( width < tmpWidth ) ? tmpWidth : width ;
					ascent = ( ascent < tmpAscent ) ? tmpAscent : ascent ;
					descent = ( descent < tmpDescent ) ? tmpDescent : descent ;
				}
				// set dimensions of of node 
				node.setAttribute ( "astex-width" , width ) ;
				//node.setAttribute ( "astex-ascent" , ascent + Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor) ) ;
				//node.setAttribute ( "astex-descent" , descent + Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor) ) ;
				node.setAttribute ( "astex-ascent" , ascent ) ;
				node.setAttribute ( "astex-descent" , descent ) ;

				break ;

			case "mtable" :
				var nodeChildren = node.childNodes ;	// variable length
				var width = 0 , ascent = 0 , descent = 0 ;

				// cycle through mtrs and calculate width of mtable
				for ( var j = 0 ; j < nodeChildren.length ; j++ ) {
					// set dimensions of child node
					Astex.MathML.setMathMLTagDimensions ( nodeChildren[j] , xFactor , yFactor ) ;
					var tmpWidth = parseFloat ( nodeChildren[j].getAttribute ( "astex-width" ) ) ;
					var tmpAscent = parseFloat ( nodeChildren[j].getAttribute ( "astex-ascent" ) ) ;
					// pad ascent 
					tmpAscent += Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor) ;
					ascent += tmpAscent ;
					var tmpDescent = parseFloat ( nodeChildren[j].getAttribute ( "astex-descent" ) ) ;
					width = ( width < tmpWidth ) ? tmpWidth : width ;
					descent = ( descent < tmpDescent ) ? tmpDescent : descent ;
				}

				// set dimensions of of node 
				node.setAttribute ( "astex-width" , width ) ;
				//node.setAttribute ( "astex-ascent" , ascent ) ;
				//node.setAttribute ( "astex-descent" , descent ) ;
				node.setAttribute ( "astex-ascent" , ascent + Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor) ) ;
				node.setAttribute ( "astex-descent" , descent + Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor) ) ;
				//node.setAttribute ( "astex-ascent" , ascent + Astex.Symbol.getSpaceWidth(yFactor) ) ;
				//node.setAttribute ( "astex-descent" , descent + Astex.Symbol.getSpaceWidth(yFactor) ) ;

				// calculate the 'astex-max-mtd-width' and 'astex-max-mtr-width' attributes for table
				// maybe ascent and descent, too
				// make sure to assign mtd values to mtr nodes
				// make sure to assign appropriate mtr and mtd values to mtable node
				var numRows = 0 ;
				var numColumns = 0 ;
				var rows = node.childNodes ;		// mtr nodes
				numRows = rows.length ;
				var rowMaxWidth = 0 ;
				var rowMaxAscent = 0 ;
				var rowMaxDescent = 0 ;
				var rowsTDMaxWidth = 0 ;
				var rowsTDMaxAscent = 0 ;
				var rowsTDMaxDescent = 0 ;
				var lastColWidth = 0 ;			// will ensure we draw closing bracket of matrix
									// as close as possible to last column
				var widths = [] ; 
				// cycle through rows
				for ( var r = 0 ; r < rows.length ; r++ ) {
					widths[r] = [] ;
					var row = rows[r] ;
					var columns = row.childNodes ;		// mtd nodes
					numColumns = columns.length ;
					var colMaxWidth = 0 ;
					var colMaxAscent = 0 ;
					var colMaxDescent = 0 ;
					// cycle through columns of current row
					for ( var c = 0	; c < columns.length ; c++ ) {
						var column = columns[c] ;
						var w = parseFloat ( column.getAttribute("astex-width") ) ;
						var a = parseFloat ( column.getAttribute("astex-ascent") ) ;
						var d = parseFloat ( column.getAttribute("astex-descent") ) ;
						colMaxWidth = ( colMaxWidth < w ) ? w : colMaxWidth ;	
						colMaxAscent = ( colMaxAscent < a ) ? a : colMaxAscent ;	
						colMaxDescent = ( colMaxDescent < d ) ? d : colMaxDescent ;
						widths[r][c] = w ;
						// if last column of row
						if ( c == columns.length - 1 ) {
							lastColWidth = ( lastColWidth < w ) ? w : lastColWidth ;
						}
					}
					// set max width, ascent, and descent attributes of current row
					row.setAttribute ( "astex-max-mtd-width" , colMaxWidth ) ;
					row.setAttribute ( "astex-max-mtd-ascent" , colMaxAscent ) ;
					row.setAttribute ( "astex-max-mtd-descent" , colMaxDescent ) ;

					var rw = parseFloat ( row.getAttribute("astex-width") ) ;
					var ra = parseFloat ( row.getAttribute("astex-ascent") ) ;
					var rd = parseFloat ( row.getAttribute("astex-descent") ) ;
					rowMaxWidth = ( rowMaxWidth < rw ) ? rw : rowMaxWidth ;	
					rowMaxAscent = ( rowMaxAscent < ra ) ? ra : rowMaxAscent ;	
					rowMaxDescent = ( rowMaxDescent < rd ) ? rd : rowMaxDescent ;

					rowsTDMaxWidth = ( rowsTDMaxWidth < colMaxWidth ) ? colMaxWidth : rowsTDMaxWidth ;	
					rowsTDMaxAscent = ( rowsTDMaxAscent < colMaxAscent ) ? colMaxAscent : rowsTDMaxAscent ;	
					rowsTDMaxDescent = ( rowsTDMaxDescent < colMaxDescent ) ? colMaxDescent : rowsTDMaxDescent ;
					
				}

				// find max-width for each column
				var colWidths = [] ;
				for ( var c = 0 ; c < numColumns ; c++ ) {
					colWidths[c] = widths[0][c] ;
					for ( var r = 1 ; r < numRows ; r++ ) {
						colWidths[c] = ( colWidths[c] < widths[r][c] ) ? widths[r][c] : colWidths[c] ;
					}
				} 

				// set node (table) attributes
				node.setAttribute ( "astex-max-mtr-width" , rowMaxWidth ) ;
				node.setAttribute ( "astex-max-mtr-ascent" , rowMaxAscent ) ;
				node.setAttribute ( "astex-max-mtr-descent" , rowMaxDescent ) ;

				node.setAttribute ( "astex-max-mtd-width" , rowsTDMaxWidth ) ;
				node.setAttribute ( "astex-max-mtd-ascent" , rowsTDMaxAscent ) ;
				node.setAttribute ( "astex-max-mtd-descent" , rowsTDMaxDescent ) ;

				// reset table attributes
				//node.setAttribute ( "astex-width" , rowMaxWidth ) ;
				//node.setAttribute ( "astex-width" , rowsTDMaxWidth * numColumns ) ;
				//node.setAttribute ( "astex-width" , rowsTDMaxWidth * (numColumns-1) + lastColWidth ) ;

				var w = 0 ;
				for ( var c = 0 ; c < colWidths.length ; c++ ) {
					w += colWidths[c] ;
					if ( c != colWidths.length - 1 ) {
						w += Astex.Symbol.getSpaceWidth ( xFactor ) ;
					}
				}
				//w = rowsTDMaxWidth * numColumns ;
				node.setAttribute ( "astex-width" , w ) ;
				node.setAttribute ( "astex-col-widths" , colWidths.toString() ) ;

				//node.setAttribute ( "astex-ascent" , (rowMaxAscent+rowMaxDescent) * numRows ) ;
				//node.setAttribute ( "astex-descent" , 0 ) ;
				// vertically align table
				//node.setAttribute ( "astex-ascent" , 0.5 * (rowMaxAscent+rowMaxDescent) * numRows + Astex.Symbol.getSpaceWidth(yFactor) ) ;
				node.setAttribute ( "astex-ascent" , 0.5 * (rowMaxAscent+rowMaxDescent) * numRows ) ;
				node.setAttribute ( "astex-descent" , 0.5 * (rowMaxAscent+rowMaxDescent) * numRows ) ;

				break ;

			case "msup" :
			case "mover" :
				var nodeChildren = node.childNodes ;	// length should be 2
				if ( nodeChildren.length != 2 ) {
					new Astex.Warning ( "msup/mover expect 2 child nodes" , "Astex.MathML.setMathMLTagDimensions" ) ;
				}
				var child1 = nodeChildren[0] ;		// base
				var child2 = nodeChildren[1] ;		// superscript/overscript 
				//alert ( child1.tagName ) ;

				// calculate dimensions of msup/mover
				var width1 = 0 , ascent1 = 0 , descent1 = 0 ;		// base 
				var width2 = 0 , ascent2 = 0 , descent2 = 0 ;		// superscript/overscript

				Astex.MathML.setMathMLTagDimensions ( child1 , xFactor , yFactor ) ;	
				Astex.MathML.setMathMLTagDimensions ( child2 , Astex.MathML.subSupXFactor , Astex.MathML.subSupYFactor ) ;	

				width1 = parseFloat ( child1.getAttribute ( "astex-width" ) ) ;
				ascent1 = parseFloat ( child1.getAttribute ( "astex-ascent" ) ) ;
				descent1 = parseFloat ( child1.getAttribute ( "astex-descent" ) ) ;

				width2 = parseFloat ( child2.getAttribute ( "astex-width" ) ) ;
				ascent2 = parseFloat ( child2.getAttribute ( "astex-ascent" ) ) ;
				descent2 = parseFloat ( child2.getAttribute ( "astex-descent" ) ) ;

				// pad superscript
				//width2 += Astex.Symbol.getSpaceWidth ( xFactor ) ;

				// set dimensions of msup
				if ( node.tagName.toLowerCase() == "msup" ) {
					node.setAttribute ( "astex-width" , width1 + width2 + Astex.Symbol.getSpaceWidthBetweenSymbols(xFactor) ) ;
					node.setAttribute ( "astex-ascent" , ascent1 + ascent2 ) ;
					node.setAttribute ( "astex-descent" , descent1 ) ;
				}
				else if ( node.tagName.toLowerCase() == "mover" ) {
					node.setAttribute ( "astex-width" , Astex.Math.max(width1,width2) + 2*Astex.Symbol.getSpaceWidthBetweenSymbols(xFactor) ) ;
					node.setAttribute ( "astex-ascent" , ascent1 + ascent2 + descent2 + Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor) ) ;
					//node.setAttribute ( "astex-ascent" , ascent1 + ascent2 + descent2 ) ;
					node.setAttribute ( "astex-descent" , descent1 ) ;
				}
				break ;

			case "msub" :
			case "munder" :
				var nodeChildren = node.childNodes ;	// length should be 2
				if ( nodeChildren.length != 2 ) {
					new Astex.Warning ( "msub/munder expect 2 child nodes" , "Astex.MathML.setMathMLTagDimensions" ) ;
				}
				var child1 = nodeChildren[0] ;		// base 
				var child2 = nodeChildren[1] ;		// subscript/underscript 

				// calculate dimensions of msub/munder 
				var width1 = 0 , ascent1 = 0 , descent1 = 0 ;
				var width2 = 0 , ascent2 = 0 , descent2 = 0 ;

				Astex.MathML.setMathMLTagDimensions ( child1 , xFactor , yFactor ) ;	
				Astex.MathML.setMathMLTagDimensions ( child2 , Astex.MathML.subSupXFactor , Astex.MathML.subSupYFactor ) ;	

				width1 = parseFloat ( child1.getAttribute ( "astex-width" ) ) ;
				ascent1 = parseFloat ( child1.getAttribute ( "astex-ascent" ) ) ;
				descent1 = parseFloat ( child1.getAttribute ( "astex-descent" ) ) ;

				width2 = parseFloat ( child2.getAttribute ( "astex-width" ) ) ;
				ascent2 = parseFloat ( child2.getAttribute ( "astex-ascent" ) ) ;
				descent2 = parseFloat ( child2.getAttribute ( "astex-descent" ) ) ;

				// set dimensions of msub/munder
				if ( node.tagName.toLowerCase() == "msub" ) {
					node.setAttribute ( "astex-width" , width1 + width2 + Astex.Symbol.getSpaceWidthBetweenSymbols(xFactor) ) ;
					node.setAttribute ( "astex-ascent" , ascent1 ) ;
					//node.setAttribute ( "astex-descent" , descent1 + ascent2 + descent2 ) ;
					node.setAttribute ( "astex-descent" , Astex.Math.max(descent1,ascent2+descent2) ) ;
				}
				else if ( node.tagName.toLowerCase() == "munder" ) {
					node.setAttribute ( "astex-width" , Astex.Math.max(width1,width2) + Astex.Symbol.getSpaceWidthBetweenSymbols(xFactor) ) ;
					node.setAttribute ( "astex-ascent" , ascent1 + ascent2 + descent2 + Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor) ) ;
					//node.setAttribute ( "astex-descent" , descent1 + ascent2 + descent2 ) ;
					node.setAttribute ( "astex-descent" , Astex.Math.max(descent1,ascent2+descent2) ) ;
				}
				break ;

			case "msubsup" :
			case "munderover" :
				var nodeChildren = node.childNodes ;	// length should be 3
				if ( nodeChildren.length != 3 ) {
					new Astex.Warning ( "msubsup/munderover expect 3 child nodes" , "Astex.MathML.processMathMLTags" ) ;
				}
				var child1 = nodeChildren[0] ;		// base 
				var child2 = nodeChildren[1] ;		// subscript/underscript
				var child3 = nodeChildren[2] ;		// superscript/overscript

				// calculate dimensions of msubsup 
				var width1 = 0 , ascent1 = 0 , descent1 = 0 ;		// base 
				var width2 = 0 , ascent2 = 0 , descent2 = 0 ;		// subscript/underscript
				var width3 = 0 , ascent3 = 0 , descent3 = 0 ;		// superscript/overscript

				Astex.MathML.setMathMLTagDimensions ( child1 , xFactor , yFactor ) ;	
				Astex.MathML.setMathMLTagDimensions ( child2 , Astex.MathML.subSupXFactor , Astex.MathML.subSupYFactor ) ;	
				Astex.MathML.setMathMLTagDimensions ( child3 , Astex.MathML.subSupXFactor , Astex.MathML.subSupYFactor ) ;	

				width1 = parseFloat ( child1.getAttribute ( "astex-width" ) ) ;
				ascent1 = parseFloat ( child1.getAttribute ( "astex-ascent" ) ) ;
				descent1 = parseFloat ( child1.getAttribute ( "astex-descent" ) ) ;

				// subscript
				width2 = parseFloat ( child2.getAttribute ( "astex-width" ) ) ;
				ascent2 = parseFloat ( child2.getAttribute ( "astex-ascent" ) ) ;
				descent2 = parseFloat ( child2.getAttribute ( "astex-descent" ) ) ;

				// superscript
				width3 = parseFloat ( child3.getAttribute ( "astex-width" ) ) ;
				ascent3 = parseFloat ( child3.getAttribute ( "astex-ascent" ) ) ;
				descent3 = parseFloat ( child3.getAttribute ( "astex-descent" ) ) ;

				// set dimensions of msubsup
				if ( node.tagName.toLowerCase() == "msubsup" ) {
					node.setAttribute ( "astex-width" , width1 + Astex.Math.max(width2,width3) + Astex.Symbol.getSpaceWidthBetweenSymbols(xFactor) ) ;
					node.setAttribute ( "astex-ascent" , ascent1 + ascent3 ) ;
					//node.setAttribute ( "astex-descent" , descent1 + ascent2 + descent2 ) ;
					node.setAttribute ( "astex-descent" , Astex.Math.max(descent1,ascent2+descent2) ) ;
				}
				if ( node.tagName.toLowerCase() == "munderover" ) {
					node.setAttribute ( "astex-width" , Astex.Math.max(width1,Astex.Math.max(width2,width3)) + Astex.Symbol.getSpaceWidthBetweenSymbols(xFactor) ) ;
					node.setAttribute ( "astex-ascent" , ascent1 + ascent3 + descent3 + Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor) ) ;
					//node.setAttribute ( "astex-ascent" , ascent1 + ascent3 + descent3 ) ;
					//node.setAttribute ( "astex-descent" , descent1 + ascent2 + descent2 ) ;
					node.setAttribute ( "astex-descent" , Astex.Math.max(descent1,ascent2+descent2) ) ;
				}
				break ;

			case "menclose" :
				var nodeChildren = node.childNodes ;	// length should be 1
				if ( nodeChildren.length != 1 ) {
					new Astex.Warning ( "menclose expects 1 node as a child" , "Astex.MathML.setMathMLTagDimensions" ) ;
				}


				Astex.MathML.setMathMLTagDimensions ( nodeChildren[0] , xFactor/0.95 , yFactor/0.95 ) ;

				var width = parseFloat ( nodeChildren[0].getAttribute ( "astex-width" ) ) ;
				var ascent = parseFloat ( nodeChildren[0].getAttribute ( "astex-ascent" ) ) ;
				var descent = parseFloat ( nodeChildren[0].getAttribute ( "astex-descent" ) ) ;

				// only supported long division so far in "menclose"
				var notation = node.getAttribute ( "notation" ) ;
				if ( notation != "longdiv" ) {
					width = 0 ;
					ascent = 0 ;
					descent = 0 ;
				}

				// pad width for beginning of long division symbol
				width += Astex.Symbol.getSpaceWidth ( xFactor ) ;
				// pad ascent for top of root symbol
				ascent += Astex.Symbol.getSpaceWidthBetweenSymbols ( yFactor ) ;	

				// set dimensions of menclose
				node.setAttribute ( "astex-width" , width ) ;
				node.setAttribute ( "astex-ascent" , ascent ) ;
				node.setAttribute ( "astex-descent" , descent ) ;

				break ;

			case "msqrt" :
				var nodeChildren = node.childNodes ;	// length should be 1
				if ( nodeChildren.length != 1 ) {
					new Astex.Warning ( "msqrt expects 1 node as a child" , "Astex.MathML.setMathMLTagDimensions" ) ;
				}

				Astex.MathML.setMathMLTagDimensions ( nodeChildren[0] , xFactor/0.95 , yFactor/0.95 ) ;

				var width = parseFloat ( nodeChildren[0].getAttribute ( "astex-width" ) ) ;
				var ascent = parseFloat ( nodeChildren[0].getAttribute ( "astex-ascent" ) ) ;
				var descent = parseFloat ( nodeChildren[0].getAttribute ( "astex-descent" ) ) ;

				// pad width for beginning of root symbol
				width += Astex.Symbol.getSpaceWidth ( xFactor ) ;
				// pad width for end of root symbol
				//width += Astex.Symbol.getSpaceWidth ( xFactor ) ;
				//width += Astex.Symbol.getSpaceWidthBetweenSymbols ( xFactor ) ;

				// pad ascent for top of root symbol
				ascent += Astex.Symbol.getSpaceWidthBetweenSymbols ( yFactor ) ;	

				// set dimensions of msqrt
				node.setAttribute ( "astex-width" , width ) ;
				node.setAttribute ( "astex-ascent" , ascent ) ;
				node.setAttribute ( "astex-descent" , descent ) ;

				break ;

			case "mroot" :
				var nodeChildren = node.childNodes ;	// length should be 2
				if ( nodeChildren.length != 2 ) {
					new Astex.Warning ( "mroot expects 2 child nodes" , "Astex.MathML.setMathMLTagDimensions" ) ;
				}

				var child1 = nodeChildren[0] ;		// radicand
				var child2 = nodeChildren[1] ;		// index (power)

				Astex.MathML.setMathMLTagDimensions ( child1 , xFactor/0.95 , yFactor/0.95 ) ;
				Astex.MathML.setMathMLTagDimensions ( child2 , Astex.MathML.subSupXFactor , Astex.MathML.subSupYFactor ) ;

				var width1 = parseFloat ( child1.getAttribute ( "astex-width" ) ) ;
				var ascent1 = parseFloat ( child1.getAttribute ( "astex-ascent" ) ) ;
				var descent1 = parseFloat ( child1.getAttribute ( "astex-descent" ) ) ;

				// index (power)
				var width2 = parseFloat ( child2.getAttribute ( "astex-width" ) ) ;
				var ascent2 = parseFloat ( child2.getAttribute ( "astex-ascent" ) ) ;
				//var descent2 = parseFloat ( child2.getAttribute ( "astex-descent" ) ) ;

				// pad width for beginning of root symbol
				var padWidth = Astex.Math.max ( width2 , Astex.Symbol.getSpaceWidth(xFactor) ) ;

				// pad ascent for top of root symbol
				var padAscent = Astex.Math.max ( ascent2 , Astex.Symbol.getSpaceWidthBetweenSymbols ( yFactor ) ) ;	

				// set dimensions of mroot
				node.setAttribute ( "astex-width" , width1 + padWidth ) ;
				node.setAttribute ( "astex-ascent" , ascent1 + padAscent ) ;
				node.setAttribute ( "astex-descent" , descent1 ) ;

				break ;

			case "mfrac" :
				var nodeChildren = node.childNodes ;	// length should be 2
				if ( nodeChildren.length != 2 ) {
					new Astex.Warning ( "mfrac expects 2 child nodes" , "Astex.MathML.setMathMLTagDimensions" ) ;
				}
				var child1 = nodeChildren[0] ;		// mrow (numerator)
				var child2 = nodeChildren[1] ;		// mrow (denominator)

				// calculate dimensions of mfrac
				var width1 = 0 , ascent1 = 0 , descent1 = 0 ;		// numerator 
				var width2 = 0 , ascent2 = 0 , descent2 = 0 ;		// denominator 

				Astex.MathML.setMathMLTagDimensions ( child1 , xFactor/Astex.MathML.MFracDivisor , yFactor/Astex.MathML.MFracDivisor ) ;	
				Astex.MathML.setMathMLTagDimensions ( child2 , xFactor/Astex.MathML.MFracDivisor , yFactor/Astex.MathML.MFracDivisor ) ;	

				width1 = parseFloat ( child1.getAttribute ( "astex-width" ) ) ;
				ascent1 = parseFloat ( child1.getAttribute ( "astex-ascent" ) ) ;
				descent1 = parseFloat ( child1.getAttribute ( "astex-descent" ) ) ;

				width2 = parseFloat ( child2.getAttribute ( "astex-width" ) ) ;
				ascent2 = parseFloat ( child2.getAttribute ( "astex-ascent" ) ) ;
				descent2 = parseFloat ( child2.getAttribute ( "astex-descent" ) ) ;

				// pad ascent for fraction bar
				var ascentPad = 4 * Astex.Symbol.getSpaceWidthBetweenSymbols(yFactor) ;

				// calculate width of fraction
				var maxWidth = Astex.Math.max ( width1 , width2 ) + Astex.Symbol.getSpaceWidthBetweenSymbols(xFactor) ;
				//alert ( maxWidth ) ;
				// set dimensions of mfrac
				node.setAttribute ( "astex-width" , maxWidth ) ;
				//node.setAttribute ( "astex-ascent" , ascent1 + descent1 + ascent2 + ascentPad ) ;
				//node.setAttribute ( "astex-descent" , /*descent1 +*/ descent2 ) ;
				node.setAttribute ( "astex-ascent" , ascentPad + ascent1 + descent1 ) ;
				node.setAttribute ( "astex-descent" , /*descent1 +*/ ascent2 + descent2 ) ;
				break ;

			default :
				break ;
		}
	}
	else if ( node.nodeType == Node.TEXT_NODE ) {

		// fix calligraphy for capital english letters
		if ( Astex.Font.Type.currentType == Astex.Font.Type.CALLIGRAPHY ) {
			// we make sure only symbols corresponding to english capital letters are changed
			// but not capital greek letters or other symbols (e.g. arrows)
			var str = node.nodeValue ;
			var newStr = "" ;
			while ( str.length > 0 ) {
				var name = Astex.Symbol.getMaximalSymbolName ( str ) ;
				if ( name.match(/^[A-Z]$/) ) {					// if name is a capital english letter
					newStr += "cal" + name ;				// prepend "cal" to name of capital letter
												// e.g. "calA", "calB", etc.
				}
				else {
					newStr += name ;
				}
				str = str.slice ( name.length ) ;
			}
			node.nodeValue = newStr ;						// reassign node.nodeValue
		}
		// fix blackboardbold for capital english letters
		else if ( Astex.Font.Type.currentType == Astex.Font.Type.BLACKBOARDBOLD ) {
			// we make sure only symbols corresponding to english capital letters are changed
			// but not capital greek letters or other symbols (e.g. arrows)
			var str = node.nodeValue ;
			var newStr = "" ;
			while ( str.length > 0 ) {
				var name = Astex.Symbol.getMaximalSymbolName ( str ) ;
				if ( name.match(/^[A-Z]$/) ) {					// if name is a capital english letter
					newStr += "bbb" + name ;				// prepend "bbb" to name of capital letter
												// e.g. "bbbA", "bbbB", etc.
				}
				else {
					newStr += name ;
				}
				str = str.slice ( name.length ) ;
			}
			node.nodeValue = newStr ;						// reassign node.nodeValue
		}
		/*
		*/

		// calculate the dimensions of text node
		var width , ascent , descent ;
		if ( node.parentNode.tagName.match(/mtext/i) ) {
			width = Astex.Symbol.getSymbolCharsWidth ( node.nodeValue , xFactor ) ;
			ascent = Astex.Symbol.getSymbolCharsAscent ( node.nodeValue , yFactor ) ;
			descent = Astex.Symbol.getSymbolCharsDescent ( node.nodeValue , yFactor ) ;
		}
		else {
			width = Astex.Symbol.getSymbolStringWidth ( node.nodeValue , xFactor ) ;
			ascent = Astex.Symbol.getSymbolStringAscent ( node.nodeValue , yFactor ) ;
			descent = Astex.Symbol.getSymbolStringDescent ( node.nodeValue , yFactor ) ;
		}

		// add padding
		width += 0.5 * Astex.Symbol.getSpaceWidthBetweenSymbols ( xFactor ) ;
		//ascent +=  Astex.Symbol.getSpaceWidthBetweenSymbols ( yFactor ) ;
		//descent += Astex.Symbol.getSpaceWidthBetweenSymbols ( yFactor ) ;
		if ( node.parentNode.tagName.match(/mo/i)  ) {
			var token = Astex.Token.getTokenByOutputAndTag ( node.nodeValue , "mo" ) ;
			var bool = token.category != Astex.Token.BINARYOPERATOR && token.category != Astex.Token.BINARYRELATION && token.category != Astex.Token.LOGICALOPERATOR ;
			if ( bool ) {
				ascent +=  Astex.Symbol.getSpaceWidthBetweenSymbols ( yFactor ) ;
				descent += Astex.Symbol.getSpaceWidthBetweenSymbols ( yFactor ) ;
			}
		}
		else if ( ! node.parentNode.tagName.match(/mtext/i) ) {
			ascent +=  Astex.Symbol.getSpaceWidthBetweenSymbols ( yFactor ) ;
			descent += Astex.Symbol.getSpaceWidthBetweenSymbols ( yFactor ) ;
		}


		// set dimensions of mo/mi/mn/mtext parent node
		//alert ( "width = " + width + " , ascent = " + ascent + " , descent = " + descent ) ;
		node.parentNode.setAttribute ( "astex-width" , width ) ;
		node.parentNode.setAttribute ( "astex-ascent" , ascent ) ;
		node.parentNode.setAttribute ( "astex-descent" , descent ) ;

	}
	else {
		// fail gracefully
		//new Astex.Warning ( "Expected mathml tag, got nodeType " + node.nodeType , "Astex.processMathML" ) ;
	}
};


// prototype: Object Astex.MathML.writeMathML ( String str , Astex.Canvas c , Float[] anchor , Float xFactor , Float yFactor , Float rotate , Float scewX )
// returns an object with attributes width, ascent, descent, representing the
// dimensions of the drawn MathML node
// this method is useful for drawing mathml on graphs! (see Astex.Graph for how this might be used)
Astex.MathML.writeMathML = function ( str , c , anchor , xFactor , yFactor , rotate , scewX ) {

	// dimensions width, ascent, descent
	var w = 0 , a = 0 , d = 0 ;

	//alert ( anchor ) ;
	//alert ( xFactor + " " + yFactor ) ;
	//anchor[0] = parseFloat ( anchor[0] ) ;
	//anchor[1] = parseFloat ( anchor[1] ) ;
	//xFactor = parseFloat ( xFactor ) ;
	//yFactor = parseFloat ( yFactor ) ;
	//rotate = parseFloat ( rotate ) ;
	//scewX = parseFloat ( scewX ) ;

	// get current MathML renderer
	var currentRenderer = Astex.AMath.getCurrentRenderer ( ) ;
	// set renderer to canvas
	Astex.AMath.setRenderer ( "Canvas" ) ;

	var div = document.createElement ( "div" ) ;
	div.innerHTML = str ;				// put string into div
	Astex.AMath.translated = false ;		// IMPORTANT! otherwise Astex.AMath.translate() won't run
	Astex.AMath.translate ( null , div ) ;	// translate into MathML node
	//alert ( div.childNodes.length ) ;

	// Astex default rendering

	// div has more than 1 child, don't know why ( maybe some empty text nodes ??? )
	// we'll only process the <math> child node
	for ( var j = 0 ; j < div.childNodes.length ; j++ ) {
		//alert ( j ) ;
		if ( div.childNodes[j].tagName == "math" ) {
			// !!! IMPORTANT !!! --- make sure we reset mathml sub/sup factors
			Astex.MathML.subSupFactorsSet = false ;
			// draw the MathML on the canvas
			Astex.MathML.setMathMLTagDimensions ( div.childNodes[j] , xFactor , yFactor ) ;
			Astex.MathML.processMathMLTags ( div.childNodes[j] , c , [anchor[0],anchor[1]] , xFactor , yFactor , rotate , scewX ) ;
			w = parseFloat ( div.childNodes[j].getAttribute ( "astex-width" ) ) ;
			a = parseFloat ( div.childNodes[j].getAttribute ( "astex-ascent" ) ) ;
			d = parseFloat ( div.childNodes[j].getAttribute ( "astex-descent" ) ) ;
			break ;
		}
	}

	// reset to user preferred player
	Astex.AMath.setRenderer ( currentRenderer ) ;

	return { width:w , ascent:a , descent:d , windowId:c.window.id } ;
};


/*--------------------------------------------------------------------------*/
