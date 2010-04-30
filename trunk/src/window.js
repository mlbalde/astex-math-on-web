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

// prototype: new Astex.Window ( Int width , Int height )
// Window origin is upper left corner
Astex.Window = function ( width , height ) {

	if ( ! width || width <= 0 ) {
		width = 100 ;
	}
	if ( ! height || height <= 0 ) {
		height = 100 ;
	}

	this.width = width ;
	this.height = height ;
	this.id = "Astex-Window-" + Astex.Window.id ;
	this.iframeId = "Astex-IFrame-" + Astex.Window.id ;
	this.controlPanelId = "Astex-ControlPanel-" + Astex.Window.id ;

	this.header = null ;
	this.footer = null ;
	
	//this.node = document.createElement ( "span" ) ;
	this.node = document.createElement ( "div" ) ;
	if ( Astex.Util.isIE ) {
		//this.node.style = "position:absolute;display:inline;" ;
		this.node.setAttribute ( "style" , "position:absolute;display:inline;" ) ;
		this.node.id = this.id ;
		this.node.width = this.width ;
		this.node.height = this.height ;
	}
	else {
		this.node.setAttribute ( "style" , "position:absolute;display:inline;" ) ;
		this.node.setAttribute ( "id" , this.id ) ;
		this.node.setAttribute ( "width" , this.width ) ;
		this.node.setAttribute ( "height" , this.height ) ;
	}

	// create an iframe
	this.iframe = document.createElement ( "iframe" ) ;
	// set id and name attribute of iframe to same value
	this.iframe.setAttribute ( "id" , this.iframeId ) ;
	this.iframe.setAttribute ( "name" , this.iframeId ) ;
	this.iframe.setAttribute ( "scrolling" , "no" ) ;		// had to remove overflow attribute below to stop scrolling
	// set other iframe attributes depending on browser
	if ( Astex.Util.isIE ) {
		//this.iframe.style = "position:relative;display:inline;overflow:visible;border:0;" ;
		//this.iframe.setAttribute ( "style" , "position:relative;display:inline;overflow:visible;" ) ;
		this.iframe.setAttribute ( "style" , "position:relative;display:inline;z-index:auto;" ) ;
		this.iframe.width = 1.5*this.width ;
		this.iframe.height = 1.5*this.height ;
		this.iframe.border = "0" ;
		//this.iframe.marginwidth = "0" ;
		this.iframe.marginWidth = "0" ;					// ie expects camelCase for this attribute
		//this.iframe.marginheight = "0" ;
		this.iframe.marginHeight = "0" ;				// ie expects camelCase for this attribute
		//this.iframe.frameborder = "0" ;
		this.iframe.frameBorder = "0" ;					// ie expects camelCase for this attribute
		//this.iframe.style.vertical-align = "middle" ;
		this.iframe.style.verticalAlign = "middle" ;			// ie doesn't like verical-align, bu camelCase option works
	}
	else {
		//this.iframe.setAttribute ( "style" , "position:relative;display:inline;overflow:visible;border:0;vertical-align:middle;" ) ;
		//this.iframe.setAttribute ( "style" , "position:relative;display:inline;overflow:visible;border:0;vertical-align:baseline;" ) ;
		//this.iframe.setAttribute ( "style" , "position:relative;display:inline;border:0;vertical-align:baseline;" ) ;
		var style = "position:relative;display:inline;border:0;vertical-align:middle;z-index:auto;" ;
		//style += "margin-width:0;margin-height:0;" ;
		style += "margin:0 0 0 0;" ;
		//style += "margin-top:0px;" ;
		//style += "margin-bottom:0px;" ;
		//style += "margin-right:0px;" ;
		//style += "margin-left:0px;" ;
		this.iframe.setAttribute ( "style" , style ) ;
		//this.iframe.setAttribute ( "style" , "position:relative;display:inline;border:0;vertical-align:text-bottom;z-index:auto;" ) ;
		this.iframe.setAttribute ( "width" , 1.5*this.width ) ;
		this.iframe.setAttribute ( "height" , 1.5*this.height ) ;
	}

	// increment id class variable
	Astex.Window.id++ ;

	return this ;
};

// Astex.Window class variables
Astex.Window.id = 0 ;
Astex.Window.bgColor = "white" ;			// used to determine the color of the iframe's body below
							// this variable is reset in Astex.Canvas
Astex.Window.bgColor = null ;

// Astex.Window instance methods
// prototype void this.insertWindow ( HTMLElement node , HTMLElement nodeToReplace )
// inserts/appends window node (this.node) into/to specified node, possibly replacing nodeToReplace
Astex.Window.prototype.insertWindow = function ( node , nodeToReplace ) {

	var tmpNode = null ;

	if ( ! node ) { node = document.body ; }

	// get bgcolor of node (only needed in IE)
	// in other browsers, background is automatically inherited from parent
	var color = null ;
	if ( Astex.Util.isIE ) {
		color = (node.style.backgroundColor) ? node.style.backgroundColor : node.getAttribute("bgcolor") ;
		//this.node.style.backgroundColor = color ;
		//this.iframe.style.backgroundColor = color ;
	}


	// adding this.node didn't work as intended
	// the <div> or <span> was covering other text
	// so I came up with fix embedding this.node into an iframe
	if ( ! nodeToReplace ) {
		//node.insertBefore ( this.node , null ) ;
		//node.insertBefore ( this.iframe , null ) ;			// insert iframe
		node.appendChild ( this.iframe ) ;			// insert iframe
	}
	else {
		//node.replaceChild ( this.node , nodeToReplace ) ;
		tmpNode = node.replaceChild ( this.iframe , nodeToReplace ) ;		// insert iframe
	}

	//
	// maybe I should hide this node in the iframe so I can refer
	// to it if necessary
	//
	/*
	var tmp = document.createElement ( "div" ) ;
	tmp.appendChild ( tmpNode ) ;
	//alert ( "Called from Astex.Window.prototype.insertWindow()\n\n" + tmp.innerHTML ) ;
	alert ( "Called from Astex.Window.prototype.insertWindow()\n\n" + tmp.innerHTML.replace(/>/g,">\n").replace(/<\//g,"\n</") ) ;
	*/

	// get iframe document
	var doc = Astex.Util.getIFrameDoc ( this.iframe ) ;
	/*
	var doc = null ;
	if ( this.iframe.contentWindow ) {				// ie
		doc = this.iframe.contentWindow.document ;
	}
	else if ( this.iframe.contentDocument ) {			// firefox
		doc = this.iframe.contentDocument ;
	}
	else if ( this.iframe.document ) {				// other browsers
		doc = this.iframe.document ;
	}
	*/


	// open iframe doc
	doc.open ( ) ;

	// insert this.node into iframe doc
	if ( ! Astex.Util.isIE ) {
		//doc.write ( "<html><body bgcolor=\""+Astex.Window.bgColor+"\"></body></html>" ) ;
		//doc.write ( "<html><body></body></html>" ) ;
		doc.write ( "<html><head><style>a { text-decoration:none; }</style></head><body></body></html>" ) ;
		//this.node.setAttribute ( "style" , this.node.getAttribute("style") + ";background-color:" + Astex.Window.bgColor + ";" ) ;
		//this.node.setAttribute ( "style" , "position:absolute;display:inline;background-color:" + Astex.Window.bgColor + ";" ) ;
		//this.node.setAttribute ( "style" , "position:absolute;display:inline;bg-color:" + Astex.Window.bgColor + ";" ) ;
		//this.node.setAttribute ( "bgcolor" , Astex.Window.bgColor ) ;
		if ( this.header != null ) {
			doc.body.insertBefore ( this.header , null ) ;
		}
		doc.body.insertBefore ( this.node , null ) ;
		if ( this.footer != null ) {
			doc.body.insertBefore ( this.footer , null ) ;
		}
	}
	else {
		// ie doesn't like doc.body.insertBefore() as used above
		// fix: create a div, insert this.node into
		// write innerHTML of div into doc
		var div = document.createElement ( "div" ) ;
		//this.node.style.backgroundColor = Astex.Window.bgColor ;
		if ( this.header != null ) {
			div.body.insertBefore ( this.header , null ) ;
		}
		div.insertBefore ( this.node , null ) ;
		if ( this.footer != null ) {
			div.body.insertBefore ( this.footer , null ) ;
		}
		//doc.write ( "<html><body bgcolor=\""+Astex.Window.bgColor+"\">" + div.innerHTML + "</body></html>" ) ;
		//doc.write ( "<html><body>" + div.innerHTML + "</body></html>" ) ;
		doc.write ( "<html><head><style>a { text-decoration:none; }</style></head><body>" + div.innerHTML + "</body></html>" ) ;
		//doc.write ( "<html><body" + ( color ? "bgcolor=\""+color+"\"" : "" ) + ">" + div.innerHTML + "</body></html>" ) ;
	}

	// close iframe doc
	doc.close ( ) ;			// i read somewhere that this is a problem in IE, but I don't see it

};

// prototype String this.toObjectLiteralString ( )
Astex.Window.prototype.toObjectLiteralString = function ( ) {
	return "{ width:" + this.width + ", height: " + this.height + ", id: \"" + this.id + "\" , controlPanelId: \"" + this.controlPanelId + "\" }" ;
};

//
// Astex.Window class methods
//

// prototype: Astex.Window.update ( ) ;
Astex.Window.update = function ( ) {

	// update the Astex.Window.bgColor variable based upon the user's setup
	Astex.Window.bgColor = ( ! Astex.User.bgColor ) ? "white" : Astex.User.bgColor ;
};


/*--------------------------------------------------------------------------*/


