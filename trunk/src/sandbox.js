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
// Astex.Sandbox class
//

Astex.Sandbox = { }  ;

//
// Astex.Sandbox class variables 
//

Astex.Sandbox.SandboxExampleCounter = 0 ;

//
// Astex.Sandbox class methods
//

// prototype: void Astex.Sandbox.insertIntoSandboxTextArea ( int index , String content )
Astex.Sandbox.insertIntoSandboxTextArea = function ( index , content ) {

	var textArea = document.getElementById ( "AstexSandboxTextArea" + index ) ;
	textArea.value = content ;
};

// prototype: String Astex.Sandbox.addSandboxExample ( int index , String content , String desc )
Astex.Sandbox.addSandboxExample = function ( index , content , desc ) {

	var num = Astex.Sandbox.SandboxExampleCounter ;
	var str = "" ;
	str += "<a href=\"\" onclick=\"Astex.Sandbox.insertIntoSandboxTextArea("+index+",document.getElementById('AstexSandbox"+index+"Example"+num+"').value); return false;\">" + desc + "</a>" ;
	str += "<textarea style=\"display:none;\" id=\"AstexSandbox"+index+"Example"+num+"\">" ;
	str += content ;
	str += "</textarea>" ;

	Astex.Sandbox.SandboxExampleCounter++ ;

	return str ;
};

// prototype: void Astex.Sandbox.processSandboxes ( HTMLElement node )
Astex.Sandbox.processSandboxes = function ( node ) {

	if ( ! node ) { node = document.body ; }

	// get divs
	var boxes = Astex.Util.getElementsByClass ( node , "div" , "AstexSandbox" ) ;
	for ( var i = 0 ; i < boxes.length ; i++ ) {

		// get data div contents
		//var script = Astex.Plugin.getDataDivContentById ( boxes[i].getAttribute("id") ) ;

		var str = "" ;

		// add a content div
		str += "<div id=\"AstexSandboxContent" + i + "\"></div>" ;
		// add a textarea and button
		//str += "<a href=\"\" onclick=\"document.getElementById('AstexSandboxContent"+i+"').innerHTML = document.getElementById('AstexSandboxTextArea"+i+"').value; Astex.Plugin.processPlugins(document.getElementById('AstexSandboxContent"+i+"')); return false;\">Evaluate code</a>" ;
		str += "<a href=\"\" onclick=\"document.getElementById('AstexSandboxContent"+i+"').innerHTML = document.getElementById('AstexSandboxTextArea"+i+"').value; Astex.process(document.getElementById('AstexSandboxContent"+i+"')); return false;\">Evaluate code</a>" ;
		str += "&nbsp;&nbsp;&nbsp;&nbsp;" ;
		str += "<a href=\"\" onclick=\"document.getElementById('AstexSandboxTextArea"+i+"').value=''; document.getElementById('AstexSandboxContent"+i+"').innerHTML=''; return false;\">Clear</a>" ;
		str += "<br />" ;
		str += "<textarea id=\"AstexSandboxTextArea" + i + "\" rows=\"15\" cols=\"80\" wrap=\"wrap\">" ;
		str += "\\begin{graph}\n" ;
		str += "     width=250; height=250; dim=3; bgcolor=yellow;\n" ;
		str += "     xmin=-1; xmax=1; ymin=-1; ymax=1; zmin=-1; zmax=1;\n" ;
		str += "     color=black;\n" ;
		str += "     controls=yes;\n" ;
		str += "     axes=yes;\n" ;
		str += "     axeslabels=x,y,z;\n" ;
		str += "     surfacecolor( red , blue );\n" ;
		str += "     partition( 12 , 12 , 4 );\n" ;
		str += "     plot3D( cyl , `z=r^2` );\n" ;
		str += "\\end{graph}\n" ;
		str += "</textarea>" ;

		str += "<br />" ;

		// add examples for sandbox
		str += Astex.Sandbox.addSandboxExample ( i , "`y=1/x`" , "Simple Equation" ) ;
		str += "&nbsp;&nbsp;|&nbsp;&nbsp;" ;

		str += Astex.Sandbox.addSandboxExample ( i , "`y=x^2+3x+1`" , "Quadratic Equation" ) ;

		str += "<br />" ;

		var tmp = "" ;

		tmp = "" ;
		tmp += "\\begin{table}\n" ;
		tmp += "     \\header{lcr}{Col1 & Col2 & Col3}\n" ;
		tmp += "     \\begin{tabular}{lcr}\n" ;
		tmp += "          a11 & a12 & a13 \\\\ \n" ;
		tmp += "          a21 & a22 & a23 \\\\ \n" ;
		tmp += "          a31 & a32 & a33 \n" ;
		tmp += "     \\end{tabular}\n" ;
		tmp += "\\end{table}\n" ;
		str += Astex.Sandbox.addSandboxExample ( i , tmp , "Simple Table" ) ;
		str += "&nbsp;&nbsp;|&nbsp;&nbsp;" ;

		tmp = "" ;
		tmp += "\\begin{table}\n" ;
		tmp += "     \\caption{Table with Column Spanning Elements}\n" ;
		tmp += "     \\header{ccc}{Col1,2[span=1,2] & Col3}\n" ;
		tmp += "     \\begin{tabular}{ccc}\n" ;
		tmp += "          a11 & a12 & a13 \\\\ \n" ;
		tmp += "          a21,22,31,32[span=2,2] & a23 \\\\ \n" ;
		tmp += "          a33 \n" ;
		tmp += "     \\end{tabular}\n" ;
		tmp += "\\end{table}\n" ;
		str += Astex.Sandbox.addSandboxExample ( i , tmp , "Table with Row/Column Spans" ) ;
		str += "&nbsp;&nbsp;" ;

		str += "<br />" ;

		tmp = "" ;
		tmp += "\\begin{graph}\n" ;
		tmp += "     width=225; height=250; ymin=-2; ymax=2; bgcolor=yellow;\n" ;
		tmp += "     stroke=2;\n" ;
		tmp += "     color=orange;\n" ;
		tmp += "     fillplot( plot( `y=sin(x)` , 0 , pi ) plot( `y=0` , 0 , pi ) );\n" ;
		tmp += "     color = gray;\n" ;
		tmp += "     axes=yes;\n" ;
		tmp += "     color=red;\n" ;
		tmp += "     plot( `y=sin(x)` , -2pi , 2pi );\n" ;
		tmp += "     color=black;\n" ;
		tmp += "     mtext( `int_0^pi sin x dx` , [-3,1.2] , 0.5 , 0.1 );\n" ;
		tmp += "\\end{graph}\n" ;
		str += Astex.Sandbox.addSandboxExample ( i , tmp , "Fill Plot" ) ;
		str += "&nbsp;&nbsp;|&nbsp;&nbsp;" ;


		tmp = "" ;
		tmp += "\\begin{graph}\n" ;
		tmp += "     width=250; height=250; bgcolor=yellow;\n" ;
		tmp += "     stroke=2;\n" ;
		tmp += "     color=black;\n" ;
		tmp += "     axes=yes;\n" ;
		tmp += "     tickmarks=yes;\n" ;
		tmp += "     color=blue;\n" ;
		tmp += "     plot( `x=8cos(t)` , `y=4sin(t)` , 0 , 2pi );\n" ;
		tmp += "     color=red;\n";
		tmp += "     plot( `x=8cos(t)` , `y=4sin(t)` , 0 , pi/3 , *-> );\n";
		tmp += "\\end{graph}\n" ;
		str += Astex.Sandbox.addSandboxExample ( i , tmp , "Parametric Plot" ) ;
		str += "&nbsp;&nbsp;|&nbsp;&nbsp;" ;


		tmp = "" ;
		tmp += "\\begin{graph}\n" ;
		tmp += "     width=200; height=200;\n" ;
		tmp += "     stroke=2;\n" ;
		tmp += "     grid=polar;\n" ;
		tmp += "     color=black;\n" ;
		tmp += "     axes=yes;\n" ;
		tmp += "     color=blue;\n" ;
		tmp += "     tickmarks=yes;\n" ;
		tmp += "     color=red;\n" ;
		tmp += "     opacity=0.5;\n" ;
		tmp += "     fillplot( \n" ;
		tmp += "          plot ( `r=10sin(2theta)` , 0 , pi/4 ) \n" ;
		tmp += "          plot ( `y=x` , 0 , 10cos(pi/4) ) \n" ;
		tmp += "     );\n" ;
		tmp += "     opacity=1;\n" ;
		tmp += "     color=green;\n";
		tmp += "     plot( `r=10sin(2theta)` );\n";
		tmp += "     color=blue;\n";
		tmp += "     plot( `y=x` );\n";
		tmp += "\\end{graph}\n" ;
		str += Astex.Sandbox.addSandboxExample ( i , tmp , "Polar Plot" ) ;

		str += "<br />" ;

		tmp = "" ;
		tmp += "\\begin{graph}\n" ;
		tmp += "     width=250; height=250; dim=3; bgcolor=yellow;\n" ;
		tmp += "     xmin=-1; xmax=1; ymin=-1; ymax=1; zmin=-1; zmax=1;\n" ;
		tmp += "     color=black;\n" ;
		tmp += "     controls=yes;\n" ;
		tmp += "     axes=yes;\n" ;
		tmp += "     axeslabels=x,y,z;\n" ;
		tmp += "     surfacecolor( red , blue );\n" ;
		tmp += "     partition( 12 , 12 , 4 );\n" ;
		tmp += "     plot3D( cyl , `z=r^2` );\n" ;
		tmp += "\\end{graph}\n" ;
		str += Astex.Sandbox.addSandboxExample ( i , tmp , "Paraboloid" ) ;
		str += "&nbsp;&nbsp;|&nbsp;&nbsp;" ;

		tmp = "" ;
		tmp += "\\begin{graph}\n" ;
		tmp += "     width=250; height=250; dim=3; bgcolor=yellow;\n" ;
		tmp += "     xmin=-1; xmax=1; ymin=-1; ymax=1; zmin=-1; zmax=1;\n" ;
		tmp += "     color=black;\n" ;
		tmp += "     controls=yes;\n" ;
		tmp += "     axes=yes;\n" ;
		tmp += "     axeslabels=x,y,z;\n" ;
		tmp += "     surfacecolor( red , blue );\n" ;
		tmp += "     partition( 16 , 16 , 8 );\n" ;
		tmp += "     plot3D( sph , `rho=1` );\n" ;
		tmp += "\\end{graph}\n" ;
		str += Astex.Sandbox.addSandboxExample ( i , tmp , "Sphere" ) ;


		boxes[i].innerHTML = str ;

	}

};

/*--------------------------------------------------------------------------*/

