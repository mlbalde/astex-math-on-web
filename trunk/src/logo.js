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
// Astex.Logo class
//

Astex.Logo = { } ;

//
// Astex.Logo class methods
//

// prototype: String Astex.Logo.processLogos ( HTMLElement node ) ;
Astex.Logo.processLogos = function ( node ) {

	if ( ! node ) { node = document.body ; }

	// get divs
	var divs = Astex.Util.getElementsByClass ( node , "div" , "AstexLogo" ) ;
	for ( var i = 0 ; i < divs.length ; i++ ) {

		/*
		// get data div contents
		var script = Astex.Plugin.getDataDivContentById ( divs[i].getAttribute("id") ) ;
		script = Astex.Plugin.unescapeScript ( script ) ;
		script = Astex.Plugin.removeComments ( script ) ;
		*/

		var str = "" ;
		str += "\\begin{graph}" ;
		str += "width=150; height=60;" ;
		//str += "width=150; height=60; bgcolor=#FFF380;" ;
		//str += "width=150; height=60; bgcolor=#FFF3F3;" ;
		//str += "width=150; height=60; bgcolor=yellow;" ;
		str += "color=orange;" ;
		str += "plot(`x=10cos(t)`,`y=10sin(t)`,0,2pi);" ;
		str += "opacity=0.2;" ;
		str += "fillplot ( plot(`x=10cos(t)`,`y=10sin(t)`,0,2pi) plot(`y=0`,-10,10) );" ;
		str += "opacity=1;" ;
		str += "color=red;" ;
		str += "mtext(`sum_{n=1}^{oo}1/n`,[xmin,-5],0.75,1.75);" ;
		str += "color=gray;" ;
		str += "mtext(`int_{0}^{1}f(x)dx`,[-3,-2],0.5,1.5);" ;
		str += "color=blue;" ;
		str += "mtext(`e^{x+y}`,[7,4],0.5,1.75);" ;
		str += "text(<a title=\"astex.sourceforge.net\" target=\"_blank\" href=\"http://astex.sourceforge.net\">powered by ASTEX</a>,[-5,-5.5]);" ;
		str += "\\end{graph}" ;

		divs[i].style.diplay = "inline" ;
		divs[i].innerHTML = str ;

		// create appropriate data divs
		Astex.Plugin.createDataDivs ( divs[i] ) ;
		//Astex.Graph.processGraphs ( links[i] ) ;
	}

};

/*--------------------------------------------------------------------------*/

