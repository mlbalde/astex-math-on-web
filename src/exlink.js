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
// Astex.ExLink class
//

Astex.ExLink = { } ;

//
// Astex.ExLink class methods
//

// prototype: void Astex.ExLink.processExLinks ( HTMLElement node )
Astex.ExLink.processExLinks = function ( node ) {

	if ( ! node ) { node = document.body ; }

	// get divs
	var links = Astex.Util.getElementsByClass ( node , "div" , "AstexExLink" ) ;
	for ( var i = 0 ; i < links.length ; i++ ) {

		// get data div contents
		var script = Astex.Plugin.getDataDivContentById ( links[i].getAttribute("id") ) ;

		script = script.split ( "|" ) ;

		script[0] = script[0].replace ( /^\s*/ , "" ) ;
		script[0] = script[0].replace ( /\s*$/ , "" ) ;

		if ( ! script[1] ) { script[1] = script[0] ; }

		var str = "" ;
		if ( ! script[0] ) {
			str += "<font style=\"color:red;\">(This links is broken!)</font>" ;
		}
		else {
			str += "<a href=\"" + script[0] + "\" title=\"" + script[0] + "\" target=\"_blank\">" + script[1] + "</a>" ;
		}

		// draw a box with an arrow (up and to right) to signal external links
		str += "\\begin{graph} width=19; height=19; color=blue;" ; 
		str += "plot(`y=0`,-10,0); plot(`y=-10`,-10,0);" ;
		str += "plot(`x=0`,-10,0); plot(`x=-10`,-10,0);" ;
		str += "plot(`y=x`,-5,10); plot(`x=10`,2,10); plot(`y=10`,2,10); \\end{graph}" ;

		links[i].style.display = "inline" ;
		links[i].innerHTML = str ;

		// create appropriate data div and process the graph created above
		Astex.Plugin.createDataDivs ( links[i] ) ;
		Astex.Graph.processGraphs ( links[i] ) ;		// why do I need to do this?

	}

};



/*--------------------------------------------------------------------------*/

