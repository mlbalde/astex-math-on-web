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
// Astex.SiteHeader class
//

Astex.SiteHeader = { }  ;

//
// Astex.SiteHeader class methods
//

// prototype: void Astex.SiteHeader.processSiteHeaders ( HTMLElement node )
Astex.SiteHeader.processSiteHeaders = function ( node ) {

	if ( ! node ) { node = document.body ; }

	// get divs
	var headers = Astex.Util.getElementsByClass ( node , "div" , "AstexSiteHeader" ) ;
	for ( var i = 0 ; i < headers.length ; i++ ) {

		// get data div contents
		var script = Astex.Plugin.getDataDivContentById ( headers[i].getAttribute("id") ) ;
		script = Astex.Plugin.unescapeScript ( script ) ;
		script = Astex.Plugin.removeComments ( script ) ;

		script = script.replace ( /\s*$/ , "" ) ;		// remove whitespace at end
		var divClass = headers[i].getAttribute ( "class" ) ;
		//headers[i].parentNode.replaceChild ( h3 , headers[i] ) ;
		var h3 = document.createElement ( "div" ) ;
		/*
		if ( ! Astex.Util.isIE ) {
			h3.setAttribute ( "class" , divClass ) ;
			h3.innerHTML = script.replace(/TITLE\s*:\s* /,"") ;
		}
		else {
			h3.innerHTML = "<h1 class='" + divClass + "'>" + script.replace(/TITLE\s*:\s* /,"") + "</h1>" ;
			//h3.innerHTML = "<div class='" + divClass + "'>" + script.replace(/TITLE\s*:\s* /,"") + "</div>" ;
			h3 = h3.firstChild ;
		}
		*/
		// ie likes using id for css better
		h3.setAttribute ( "id" , "AstexSiteHeader" + i ) ;
		h3.setAttribute ( "name" , "AstexSiteHeader" + i ) ;

		// get style and title
		var styleInd = script.indexOf ( "STYLE:" ) ;
		var titleInd = script.indexOf ( "TITLE:" ) ;
		var style = script.slice ( styleInd + 6 , titleInd ) ;
		var title = script.slice ( titleInd + 6 ) ;

		h3.innerHTML = title ;
		h3.setAttribute ( "style" , style ) ;

		document.body.insertBefore ( h3 , document.body.firstChild ) ;
		Astex.User.processNode ( document.body.firstChild ) ;

		headers[i].style.display = "none" ;
		//headers[i].style.visibility = "hidden" ;
	}

	/*
	// remove divs
	for ( var i = 0 ; i < headers.length ; i++ ) {
		document.body.removeChild ( headers[i] ) ;
	}
	*/

};

/*--------------------------------------------------------------------------*/

