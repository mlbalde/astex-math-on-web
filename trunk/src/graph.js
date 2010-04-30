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
// Astex.Graph class
//

Astex.Graph = { } ;	

/*--------------------------------------------------------------------------*/

//
// Astex Class methods
//


// prototype: void Astex.Graph.processGraphs ( HTMLElement node )
Astex.Graph.processGraphs = function ( node ) {

	if ( ! node ) { node = document.body ; }

	// get all div's with class attribute 'AstexGraph'
	var graphs = Astex.Util.getElementsByClass ( node , "div" , "AstexGraph" ) ;

	var pi = Astex.Math.pi ;
	var e = Astex.Math.e ;

	//alert ( graphs.length ) ;

	// for each graph, we need to
	// create a window: width height
	// create a canvas: xmin xmax xscale/xscl ymin ymax yscale/yscl bgcolor
	// insert window into document (and replace current graph)

	while ( graphs.length > 0 ) {

		// update the canvas/window bgColor based upon the user's setup
		Astex.Window.update ( ) ;

		// set default values of variables
		var dim = 2 ;

		//var indvar = "x" ;

		var width = 100 ;
		var height = 100 ;
		var updatedWidth = 100 ;
		var updatedHeight = 100 ;

		var xmin = -10 ;
		var xmax = 10 ;
		var xscale = 1 ;
		var ymin = -10 ;
		var ymax = 10 ;
		var yscale = 1 ;
		var zmin = -10 ;
		var zmax = 10 ;
		var zscale = 1 ;

		var bgcolor = "" ;
		//var color = "black" ;
		var color = Astex.User.getColor ( ) ; 
		var stroke = 1 ;
		var opacity = 1 ;

		var showControls = false ;
		var viewer = [ -20 , -15 ] ;			// theta/phi angles for c3d
		var axesLabels3D = null ;

		// get current graph
		var graph = graphs[0] ;				// get first (0th) element

		// get script attribute of graph
		//var script = graph.getAttribute ( "script" ) ;
		//var script = graph.innerHTML ;
		/*
		var script ;
		if ( graph.getAttribute("script") ) {
			script = graph.getAttribute ( "script" ) ;
		}
		else {
			script = graph.innerHTML ;
		}
		*/

		// get data div contents
		var script = Astex.Plugin.getDataDivContentById ( graph.getAttribute("id") ) ;
		script = Astex.Plugin.unescapeScript ( script ) ;
		script = Astex.Plugin.removeComments ( script ) ;

		var originalScript = script ;

		script = Astex.Plugin.unescapeScript ( script ) ;
		script = Astex.Plugin.removeComments ( script ) ;

		//alert ( script ) ;
		script = script.replace ( /\|/g , "_pipe_" ) ;		// need this for drawing dots/points as vertical dash w/ |
									// see below

		//script = script.replace ( /'/g , "\'" ) ;
		//script = script.replace ( /"/g , "\"" ) ;
		//script = script.replace ( /'|"/g , "`" ) ;		// change all ' and " to ` (had originally written plot,mtext,footer with `)
		//script = script.replace ( /"/g , "`" ) ;		// change all ' and " to ` (had originally written plot,mtext,footer with `)
		//alert ( script ) ;
		//script = script.replace ( /\\/g , "\\" ) ;


		var userDim = ["dim","width","height","xmin","xmax","xscale","ymin","ymax","yscale","zmin","zmax","zscale","bgcolor"] ;
		var userCommands = ["stroke","color","grid","border","axeslabels","axes","tickmarks","ticklabels","plot","mtext","opacity"] ;

		script = script.replace ( /[\n|\r|\f|\v|\t]*/g , "" ) ;		// remove newlines, returns, and tabs

		//alert ( script ) ;
		//return ;
		script = script.replace ( /xscl/ig , "xscale" ) ;		// change all xscl to xscale
		script = script.replace ( /yscl/ig , "yscale" ) ;		// change all yscl to yscale
		script = script.replace ( /zscl/ig , "zscale" ) ;		// change all zscl to zscale

		// set user dimensions ( if any )
		for ( var i = 0 ; i < userDim.length ; i++ ) {
			var udim = userDim[i] ;
			index = script.indexOf ( udim ) ;
			if ( index != -1 ) {
				sColonIndex = script.indexOf ( ";" , index ) ;
				if ( sColonIndex == -1 ) {
					return new Astex.Warning ( "missing ; after declaration of " + udim , "Astex.Graph.processGraphs" ) ;
				}
				var tmp ;
				tmp  = script.slice ( index , sColonIndex ) ;
				// if there isn't an equal sign, it's not an assignment
				if ( tmp.match(/=/) ) {
					tmp  = tmp.replace ( new RegExp(udim+"\s*=\s*") , "" ) ;
					if ( udim.match(/dim|width|height/i) ) {
						eval ( udim + " = parseInt(" + tmp + ");" ) ;
					}
					else if ( udim.match(/xmin|xmax|xscale|ymin|ymax|yscale|zmin|zmax|zscale/i) ) {
						eval ( udim + " = parseFloat(" + tmp + ");" ) ;
					}
					else if ( udim.match(/bgcolor/i) ) {
						// if tmp contains 'bgcolor = ' , remove it
						// this happens when user enters bgcolor = string w/ spaces in it
						tmp = tmp.replace ( /\s*bgcolor\s*=\s*/ , "" ) ;
						bgcolor = tmp ;
						//alert ( bgcolor ) ;
					}
					// remove this portion of the script
					script = script.slice ( 0 , index ) + "" + script.slice ( sColonIndex + 1 ) ;
					//alert ( script ) ;
				}
			}
		}

		//alert ( script ) ;

		/*
		//alert ( width ) ;
		//alert ( xmin ) ;
		//alert ( script ) ;
		var str = "" ;
		str += "width = " + width + "\n" ;
		str += "height = " + height + "\n" ;
		str += "xmin = " + xmin + "\n" ;
		str += "xmax = " + xmax + "\n" ;
		str += "xscale = " + xscale + "\n" ;
		str += "ymin = " + ymin + "\n" ;
		str += "ymax = " + ymax + "\n" ;
		str += "yscale = " + yscale + "\n" ;
		str += "bgcolor = " + bgcolor + "\n" ;
		//alert ( str ) ;
		*/

		if ( width <= 0 || height <= 0 ) {
			return new Astex.Warning ( "width and height must be positive" , "Astex.Graph.processGraphs()" ) ;
		}
		if ( xmax <= xmin || ymax <= ymin || zmax <= zmin ) {
			return new Astex.Warning ( "xmax/ymax/zmax must be larger than xmin/ymin/zmin" , "Astex.Graph.processGraphs()" ) ;
		}
		if ( xscale <= 0 || yscale <= 0 || zscale <= 0 ) {
			return new Astex.Warning ( "xscale/xscl and yscale/yscl and zscale/zscl must be positive" , "Astex.Graph.processGraphs()" ) ;
		}


		// having problems with how this.xmin, xmax,etc are set in a canvas ... testing ! 0 is true
		// before we create a canvas, we fix this problem here !!!!!!
		//if ( xmin == 0 ) { xmin = -0.01 ; }
		//if ( ymin == 0 ) { ymin = -0.01 ; }
		//if ( zmin == 0 ) { zmin = -0.01 ; }

		//if ( xmax == 0 ) { xmax = 0.01 ; }
		//if ( ymax == 0 ) { ymax = 0.01 ; }
		//if ( zmax == 0 ) { zmax = 0.01 ; }

		// create a window and a canvas
		var w = new Astex.Window ( width , height ) ;
		var c = null ;
		var c3d = null ;
		if ( dim == 2 ) {

			c = new Astex.Canvas ( w , xmin , xmax , xscale , ymin , ymax , yscale , bgcolor ) ;

			// default settings
			c.setStroke ( stroke ) ;
			c.setOpacity ( opacity ) ;
			c.setColor ( "gray" ) ;
		}
		else if ( dim == 3 ) {

			c = new Astex.Canvas ( w , null , null , null , null , null , null , bgcolor ) ;
			c3d = new Astex.Canvas3D ( c , xmin , xmax , xscale , ymin , ymax , yscale , zmin , zmax , zscale ) ; 

			// default settings
			c3d.setStrokeWeight ( stroke ) ;
			c3d.setOpacity ( opacity ) ;
			c3d.setStrokeColor ( "gray" ) ;
			c3d.setSurfaceColor ( "red" , "blue" ) ;
			c3d.setPartitions ( 10 , 10 , 10 ) ;
		}
		else {
			return new Astex.Warning ( "dim must be 2 or 3" , "Astex.Graph.processGraphs()" ) ;
		}

		// fill in canvas with appropriate bgcolor
		if ( bgcolor != "" ) { c.fillBackground ( ) ; }
		
		// updated width and height
		updatedHeight = height ;
		updatedWidth = width ;

		// testing
		//c.drawGrid ( ) ;
		//c.setColor ( "black" ) ;
		//c.drawAxes ( ) ;
		//c.drawTickMarks ( true ) ;

		// separate user commands using ; as a delimiter
		// and process them one at a time
		var commands = script.split ( ";" ) ;
		for ( var i = 0 ; i < commands.length ; i++ ) {

			// get current command
			var command = commands[i] ;
			command = command.replace ( /^\s*/ , "" ) ;		// remove any leading whitespace

			// need a slope-field function ( in Canvas or here ??? )

			// need more stat plots - bar , pie , scatter , polyline/xyline , stem-and-leaf , box plot , mod box plot , sequences

			// need to check commands to make sure they had a ; at its end
			// should be done before this for loop

			// need to add a title/header, footer , left ( for left-margin) ... will need to expand iframe to
			// accomodate this

			// commands are stroke,color,grid,border,axeslabels,axes,tickmarks,ticklabels,plot,mtext

			// when adding new commands, make sure to add them to userCommands[] above since IE ignores \n

			if ( command.match(/^var\s*data.*\s*=/i) ) {		// user data variables
				eval ( command + ";" ) ;
				//alert ( command ) ;
				//alert ( typeof data1 + " " + data1 ) ;
			}
			else if ( command.match(/^(fill)?histogram\s*\(/i) && dim == 2 ) {
				// c.drawHistogram ( data[] , numClasses , Boolean fill , Boolean relFreq ) ;
				// (fill)histogram ( data[] , int , [rel] ) ;	// rel stands for relative freq histogram
				// e.g. fillhistogram ( data1 , 6 ) ;
				// e.g. fillhistogram ( data1 , 6 , rel ) ;
				var fill = false ;
				if ( command.match ( /fill/i ) ) { fill = true ; }

				// string cleanup
				command = command.replace ( /\s*(fill)?histogram\s*\(/i , "" ) ;	// remove "(fill)histogram (" at beginning
				command = command.replace ( /\s*\)\s*$/ , "" ) ;			// remove ")" at end

				command = command.split ( "," ) ;
				var list = new Astex.DataList ( Astex.DataList.Quantitative , eval(command[0]) ) ;
				var rel = ( command[2] && command[2].match(/rel/i) ) ? true : false ;
				c.drawHistogram ( list , parseInt(command[1]) , fill , rel ) ;
			}
			else if ( command.match(/^stroke\s*=/i) ) {
				var tmp = command.replace ( /^stroke\s*=\s*/i , "" ) ;
				if ( tmp.match(/dotted/i) ) {
					if ( dim == 2 ) {
						c.setStroke ( "dotted" ) ;
						stroke = c.getStroke ( ) ;
					}
					else if ( dim == 3 ) {
						c3d.setStrokeWeight ( "dotted" ) ;
					}
				}
				else {
					stroke = parseInt ( tmp ) ;
					if ( dim == 2 ) {
						c.setStroke ( stroke ) ;
					}
					else if ( dim == 3 ) {
						c3d.setStrokeWeight ( stroke ) ;
					}
				}
				//alert ( stroke ) ;
			}
			else if ( command.match(/^color\s*=/i) ) {
				var tmp = command.replace ( /^color\s*=\s*/i , "" ) ;
				color = tmp ;
				if ( dim == 2 ) {
					c.setColor ( color ) ;
				}
				else if ( dim == 3 ) {
					c3d.setStrokeColor ( color ) ;
				}
			}
			else if ( command.match(/^surfacecolor\s*\(/i) && dim == 3 ) {
				// e.g. surfacecolor ( red , blue ) ;
				var tmp = command.replace ( /^surfacecolor\s*\(\s*/i , "" ) ;
				tmp = tmp.replace ( /\s*\)\s*$/ , "" ) ;		// remove ")" at end
				tmp = tmp.replace ( /\s*/g , "" ) ;
				color = tmp.split(",") ;
				c3d.setSurfaceColor ( color[0] , color[1] ) ;
			}
			else if ( command.match(/^opacity\s*=/i) ) {
				var tmp = command.replace ( /^opacity\s*=\s*/i , "" ) ;
				opacity = parseFloat ( tmp ) ;
				if ( dim == 2 ) {
					c.setOpacity ( opacity ) ;
				}
				else if ( dim == 3 ) {
					c3d.setOpacity ( opacity ) ;
				}
			}
			else if ( command.match(/^(x|y|r|theta)(min|max)\s*=/i) && dim == 2 ) {			// reset xmin,xmax,ymin,ymax
				//alert ( command ) ;
				eval ( "c." + command ) ;
			}
			else if ( command.match(/^(x|y|z|r|theta|rho|phi)(min|max)\s*=/i) && dim == 3 ) {	// reset min/max for 3D coords
				//alert ( command ) ;
				//alert ( "c3d." + command ) ;
				eval ( "c3d." + command ) ;
			}
			else if ( command.match(/^grid\s*=/i) && dim == 2 ) {
				var tmp = command.replace ( /^grid\s*=\s*/i , "" ) ;
				if ( tmp.match(/rect|yes/) ) {
					c.drawGrid ( ) ;
				}
				else if ( tmp.match(/polar/i) ) {
					c.drawGrid ( "polar" ) ;
				}
				else if ( tmp.match(/no/i) ) {
					/* empty body */
				}
				else {
					return new Astex.Warning ( "unrecognized value passed for grid" , "Astex.Graph.processGraphs" ) ;
				}
			}
			else if ( command.match(/^border\s*=/i) && dim == 2 ) {
				var tmp = command.replace ( /^border\s*=\s*/i , "" ) ;
				if ( tmp.match(/yes|true/i) ) {
					c.drawBorder ( ) ;
				}
				else if ( tmp.match(/no|false/i) ) {
					/* empty body */
				}
				else {
					return new Astex.Warning ( "unrecognized value passed for border" , "Astex.Graph.processGraphs" ) ;
				}
			}
			else if ( command.match(/^axeslabels\s*=/i) ) {				// must come before 'axes'
				var tmp = command.replace ( /^axeslabels\s*=\s*/i , "" ) ;
				var labels = tmp.split(",") ;
				if ( dim == 2 ) {
					c.drawAxesLabels ( labels[0] , labels[1] ) ;
				}
				else if ( dim == 3 ) {
					axesLabels3D = labels ;
					//c3d.drawAxesLabels ( labels[0] , labels[1] , labels[2] ) ;
				}
			}
			else if ( command.match(/^axes\s*=/i) ) {
				var tmp = command.replace ( /^axes\s*=\s*/i , "" ) ;
				if ( tmp.match(/yes|true/i) ) {
					if ( dim == 2 ) {
						c.drawAxes ( ) ;
					}
					else {
						c3d.drawAxes ( ) ;
					}
				}
				else if ( tmp.match(/no|false/i) ) {
					/* empty body */
				}
				else {
					return new Astex.Warning ( "unrecognized value passed for axes" , "Astex.Graph.processGraphs" ) ;
				}
			}
			else if ( command.match(/^tickmarks\s*=/i) && dim == 2 ) {
				var tmp = command.replace ( /^tickmarks\s*=\s*/i , "" ) ;
				if ( tmp.match(/yes|true/i) ) {
					c.drawTickMarks ( false ) ;
				}
				else if ( tmp.match(/no|false/i) ) {
					/* empty body */
				}
				else {
					return new Astex.Warning ( "unrecognized value passed for tickmarks" , "Astex.Graph.processGraphs" ) ;
				}
			}
			else if ( command.match(/^ticklabels\s*=/i) && dim == 2 ) {
				var tmp = command.replace ( /^ticklabels\s*=\s*/i , "" ) ;
				if ( tmp.match(/yes|true/i) ) {
					c.drawTickMarks ( true ) ;
				}
				else if ( tmp.match(/no|false/i) ) {
					/* empty body */
				}
				else {
					return new Astex.Warning ( "unrecognized value passed for ticklabels" , "Astex.Graph.processGraphs" ) ;
				}
			}
			else if ( command.match(/^LHS\s*=/i) && dim == 3 ) {
				var tmp = command.replace ( /^LHS\s*=\s*/i , "" ) ;
				if ( tmp.match(/yes|true/i) ) {
					c3d.setCoordSys ( "LHS" ) ;
				}
				else if ( tmp.match(/no|false/i) ) {
					c3d.setCoordSys ( "RHS" ) ;
				}
				else {
					return new Astex.Warning ( "unrecognized value passed for LHS/lhs" , "Astex.Graph.processGraphs" ) ;
				}
			}
			else if ( command.match(/^controls\s*=/i) && dim == 3 ) {
				var tmp = command.replace ( /^controls\s*=\s*/i , "" ) ;
				if ( tmp.match(/yes|true/i) ) {
					showControls = true ;
				}
				else if ( tmp.match(/no|false/i) ) {
					showControls = false ;
				}
				else {
					return new Astex.Warning ( "unrecognized value passed for controls" , "Astex.Graph.processGraphs" ) ;
				}
			}
			else if ( command.match(/^dot\s*\(/i) && dim == 2 ) {
				// dot ( center[] , type , fill ) ;
				// e.g. dot ( [0,5] , +-|o , true|yes|false|no|null ) ;

				// string cleanup
				command = command.replace ( /\s*dot\s*\(/i , "" ) ;		// remove "dot (" at beginning
				command = command.replace ( /\s*\)\s*$/ , "" ) ;		// remove ")" at end

				// get center
				var brack1Ind = command.indexOf ( "[" ) ;
				var brack2Ind = command.indexOf ( "]" , brack1Ind + 1 ) ;
				if ( brack1Ind == -1 || brack2Ind == -1 ) {
					return new Astex.Warning ( "dot expects [number,number] as first argument" , "Astex.Graph.processGraphs" ) ;
				}
				var cent = command.slice ( brack1Ind + 1 , brack2Ind ) ;
				cent = cent.split ( "," ) ;					// cent is now 2D array
				var x = parseFloat ( cent[0] ) ;
				var y = parseFloat ( cent[1] ) ;

				// get type (default o)
				var type = "o" ;
				var commaInd = -1 ;
				command = command.slice ( brack2Ind + 1 ) ;				// chop off center [ , ]
				//alert ( command ) ;
				if ( command.match(/,/) ) {						// if there are more arguments
					command = command.replace ( /^\s*,\s*/ , "" ) ;			// remove leading ,
					commaInd = command.indexOf ( "," ) ;				// comma after type
					if ( commaInd != -1 ) {
						type = command.slice ( 0 , commaInd ) ;
					}
					else {
						type = command.slice ( 0 ) ;
						//alert ( type ) ;
					}
					type = type.replace ( /\s*/g , "" ) ;
					if ( type == "_pipe_" ) { type = "|" ; }
				}
				//alert ( type ) ;

				// get fill, if any (only for o -- filled-in/disc or a hole/circle)
				var fill = false ;
				if ( commaInd != -1 ) {
					command = command.slice ( commaInd ) ;				// chop off type 
					if ( command.match(/,/) ) {					// if there are more arguments
						command = command.replace ( /^\s*,\s*/ , "" ) ;		// remove leading ,
						command = command.replace ( /\s*\)\s*$/ , "" ) ;	// remove trailing )
						fill = command.replace ( /\s*/g , "" ) ;
						if ( fill == "no" ) { fill = false ; }
						else if ( fill == "false" ) { fill = false ; }
						else if ( fill == "yes" ) { fill = true ; }
						else if ( fill == "true" ) { fill = true ; }
					}
				}
				//alert ( fill ) ;
				fill = eval ( fill ) ;

				// call appropriate canvas function
				c.drawPoint ( [x,y] , type , fill ) ;
			}
			else if ( command.match(/^plot\s*\(/i) && dim == 2 ) {
				// e.g. plot ( `y=x^2` , 0 , 3 ) ;		// min,max values are optional
				// e.g. plot ( `y=x^2` , 0 , 3 , o-* ) ;	// open and close endpoints (on left and right, resp.)
				// e.g. plot ( `x=y^2` ) ;
				// e.g. plot ( `x=2cos(t)` , `y=sin(t)` , 0 , 2pi ) ;		// parametric plot
				var plot = Astex.Graph.parsePlot ( command ) ;
				//alert ( plot.indVar + "," + plot.f + "," + plot.min + "," + plot.max ) ;
				//if ( plot.endpoints ) { alert ( plot.endpoints ) ; }
				c.drawFunction ( plot.indVar , plot.f , plot.min , plot.max , plot.endpoints ) ;
			}
			else if ( command.match(/^fillplot\s*\(/i) && dim == 2 ) {
				// e.g. fillplot ( plot ( `y=sin(x)` , 0 , pi ) plot ( `y=0` , 0 , pi ) ) ;
				// e.g. fillplot ( plot ( `x=cos(t)` , `y=sin(t)` , 0 , pi ) plot ( `y=0` , -1 , 1 ) ) ;
				// e.g. fillplot ( plot ( `y=0` , -1 , 1 ) plot ( `x=cos(t)` , `y=sin(t)` , pi , 2pi ) ) ;

				// command string cleanup
				command = command.replace ( /^\s*fillplot\s*\(/ , "" ) ;	// remove "fillplot (" at beginning
				command = command.replace ( /\s*\)\s*$/ , "" ) ;		// remove ")" at end

				//alert ( command ) ;

				// get the 2 plot commands
				var plot1Index = command.indexOf ( "plot" ) ;
				var plot2Index = command.indexOf ( "plot" , plot1Index + 4 ) ;
				if ( plot1Index == -1 || plot2Index == -1 ) {
					return new Astex.Warning ( "fillplot requires 2 plot commands" , "Astex.Graph.processGraphs" ) ;
				}

				// parse the 2 plot commands
				var plot1 = Astex.Graph.parsePlot ( command.slice(0,plot2Index) ) ;
				var plot2 = Astex.Graph.parsePlot ( command.slice(plot2Index) ) ;

				//alert ( plot1.indVar + " " + plot1.f + " " + plot1.min + " " + plot1.max ) ;
				//alert ( plot2.indVar + " " + plot2.f + " " + plot2.min + " " + plot2.max ) ;

				// call appropriate canvas function
				c.fillBetweenFunctions ( [plot1.indVar,plot2.indVar] , [plot1.f,plot2.f] , [plot1.min,plot2.min] , [plot1.max,plot2.max] ) ;
			}
			/*
			*/
			else if ( command.match(/^text\s*\(/i) && dim == 2 ) {
				// e.g. text ( text-goes-here , [3,4] ) ;
				// get arguments to text
				var tmp = command.replace ( /^text\s*\(/i , "" ) ;
				tmp = tmp.replace ( /\)/ , "" ) ;
				//alert ( tmp ) ;
				// split tmp at ,
				var args = tmp.split ( "," ) ;
				// args[0] is string
				// args[1] is xanchor with a [
				// args[2] is yanchor with a ]
				//alert ( args[2] ) ;
				//var anchor = [ parseFloat(args[1].replace(/\[/,"")) , parseFloat(args[2].replace(/\]/,"")) ] ;
				var anchor = [xmin,ymin] ;
				if ( args[1] && args[2] ) {
					//alert ( "h" ) ;
					anchor = [ parseFloat(eval(args[1].replace(/\[/,""))) , parseFloat(eval(args[2].replace(/\]/,""))) ] ;
					//alert ( anchor ) ;
				}
				//alert ( anchor ) ;
				c.drawString ( args[0] , anchor[0] , anchor[1] ) ;
			}
			else if ( command.match(/^footer\s*\(/i) && dim == 2 ) {
				// e.g. footer ( `bb{y=x^2}` ) ;
				// get arguments to text
				//alert ( command ) ;
				var tmp = command.replace ( /^footer\s*\(/i , "" ) ;
				tmp = tmp.replace ( /\)\s*$/ , "" ) ;

				tmp = tmp.replace ( /\$/g , "`" ) ;
				var ind = tmp.indexOf ( "`" ) ;
				var ind2 = tmp.indexOf ( "`" , ind + 1 ) ;
				if ( ind == -1 || ind2 == -1 ) {
					return new Astex.Warning ( "footer expects its argument to be enclosed within ` ` or $ $" , "Astex.Graph.processGraphs" ) ;
				}
				//alert ( tmp ) ;
				var str = tmp.slice ( ind , ind2 + 1 ) ;	// includes ` `
				//str = str.replace ( /`/g , "" ) ;		// we need ` ` when we call Astex.MathML.writeMathML below

				tmp = tmp.slice ( ind2 + 2 ) ;			// everything after 1st arg
				// remove any leading whitespace and commas
				tmp = tmp.replace ( /^\s*,\s*/ , "" ) ;
				//alert ( tmp ) ;
				var args = tmp.split ( "," ) ;
				//alert( args ) ;
				// NOTE: args may be an empty array !!!!! user does not have to supply an anchor, xFactor, or yFactor
				// args[0] is xFactor
				// args[1] is yFactor
				var xFactor = parseFloat ( (!args[0]) ? 0.5 : args[0] ) ;
				var yFactor = parseFloat ( (!args[1]) ? 0.5 : args[1] ) ;
				//alert ( xFactor + "," + yFactor ) ;
				// calculate anchor
				//var anchor = [0,0] ;
				//var anchor = [ xmin + Astex.Symbol.maxWidth*xFactor , ymin - Astex.Symbol.maxAscent*yFactor ] ;
				//alert ( str ) ;
				//Astex.MathML.writeMathML ( str , c , [anchor[0],anchor[1]] , xFactor , yFactor , 0 , 0 ) ;
				var anchor = [ xmin , ymin - (Astex.Symbol.maxAscent+Astex.Symbol.maxDescent)*yFactor ] ;
				//anchor[1] -= Astex.Symbol.getSpaceWidth ( yFactor ) ;
				// TRICK!!! -- we draw the mathml far below the visible portion of the canvas
				// we're really just interested in the dimensions of the mathml
				var dim = Astex.MathML.writeMathML ( str , c , [anchor[0],anchor[1]-10*(ymax-ymin)] , xFactor , yFactor , 0 , 0 ) ;
				// re-calculate updated width and height
				//var wPoint1 = c.toWindowCoordinates ( {x:c.xmin,y:0-yFactor*(dim.ascent+dim.descent)} ) ;	// bottom-left
				var wPoint1 = c.toWindowCoordinates ( {x:c.xmin,y:0-(dim.ascent+dim.descent)} ) ;	// bottom-left
				var wPoint2 = c.toWindowCoordinates ( {x:Astex.Math.max(c.xmin+dim.width,c.xmax),y:0} ) ;	// upper-right
				updatedHeight += Astex.Math.abs ( wPoint2.y - wPoint1.y ) ;
				updatedWidth = ( wPoint2.x - wPoint1.x ) ;
				// save color
				var currentColor = color ;
				//c.setColor ( bgcolor ) ;
				/*
				var fWindow = new Astex.Window ( wPoint2.x - wPoint1.x , Astex.Math.abs ( wPoint2.y - wPoint1.y ) ) ;
				var fCanvas = new Astex.Canvas ( fWindow , 0 , 10 , 1 , 0 , 10 , 1 , Astex.User.bgColor ) ;
				Astex.MathML.writeMathML ( str , fCanvas , [0,0] , xFactor , yFactor , 0 , 0 ) ;
				c.window.footer = document.createElement ( "div" ) ;
				//fWindow.insertWindow ( c.window.iframe , c.window.footer ) ;
				//fWindow.insertWindow ( c.window.footer ) ;
				fWindow.insertWindow ( c.window.node ) ;
				// reset color
				c.setColor ( currentColor ) ;
				*/
				//c.drawRect ( c.xmin , -(dim.ascent+dim.descent) , wPoint2.x - wPoint1.x , Astex.Math.abs(wPoint2.y-wPoint1.y) ) ;
				// center the text below canvas 
				var dx = 0 ;
				dx = ( (xmax-xmin) - dim.width ) / 2 ;
				if ( dx >= 0 ) {
					// remove a little padding
					dx -= 2*Astex.Symbol.getSpaceWidth ( xFactor ) ;
				}
				// reset color
				c.setColor ( currentColor ) ;
				// write the mathml
				Astex.MathML.writeMathML ( str , c , [xmin+dx,anchor[1]] , xFactor , yFactor , 0 , 0 ) ;
				// adjust width of window
				//if ( d < 0 ) {
				//}
				/*
				*/

			}
			else if ( command.match(/^mtext\s*\(/i) && dim == 2 ) {
				// e.g. mtext ( `bb{y=x^2}` , [3,4] , 1 , 1 ) ;
				// get arguments to text
				//alert ( command ) ;
				var tmp = command.replace ( /^mtext\s*\(/i , "" ) ;
				tmp = tmp.replace ( /\)\s*$/ , "" ) ;

				tmp = tmp.replace ( /\$/g , "`" ) ;
				var ind = tmp.indexOf ( "`" ) ;
				var ind2 = tmp.indexOf ( "`" , ind + 1 ) ;
				if ( ind == -1 || ind2 == -1 ) {
					return new Astex.Warning ( "mtext expects its first argument to be enclosed within ` ` or $ $" , "Astex.Graph.processGraphs" ) ;
				}
				//alert ( tmp ) ;
				var str = tmp.slice ( ind , ind2 + 1 ) ;	// includes ` `
				//alert ( str ) ;
				// split tmp at ,
				tmp = tmp.slice ( ind2 + 2 ) ;			// everything after 1st arg
				// remove any leading whitespace and commas
				tmp = tmp.replace ( /^\s*,\s*/ , "" ) ;
				//alert ( tmp ) ;
				var args = tmp.split ( "," ) ;
				// NOTE: args may be an empty array !!!!! user does not have to supply an anchor, xFactor, or yFactor
				// args[0] is xanchor with a [
				// args[1] is yanchor with a ]
				// args[2] is xFactor
				// args[3] is yFactor
				// args[4] is rotation in angles 
				//var anchor = [ parseFloat(args[1].replace(/\[/,"")) , parseFloat(args[2].replace(/\]/,"")) ] ;
				// need eval so we can pass xmin, ymin, etc. as anchor
				var anchor = [xmin,ymin] ;
				if ( args[0] && args[1] ) {
					anchor = [ parseFloat(eval(args[0].replace(/\[/,""))) , parseFloat(eval(args[1].replace(/\]/,""))) ] ;
				}
				//var xFactor = parseFloat ( (!args[2]) ? 1 : args[2] ) ;
				//var yFactor = parseFloat ( (!args[3]) ? 1 : args[3] ) ;
				var xFactor = (!args[2]) ? 1 : parseFloat ( args[2] ) ;
				var yFactor = (!args[3]) ? 1 : parseFloat ( args[3] ) ;
				var rotate = (!args[4]) ? 0 : parseFloat ( args[4] ) ;
				//alert ( anchor ) ;
				//alert ( xFactor + " " + yFactor ) ;
				Astex.MathML.writeMathML ( str , c , [anchor[0],anchor[1]] , xFactor , yFactor , rotate , 0 ) ;

			}
			else if ( command.match(/^partition\s*\(/i) && dim == 3 ) {
				// partition ( int , int , int ) ;

				// string cleanup
				command = command.replace ( /\s*partition\s*\(/i , "" )	;	// remove "partition (" at beginning
				command = command.replace ( /\s*\)\s*$/ , "" ) ;		// remove ")" at end

				command = command.split ( "," ) ;				// command is now 3D array
				if ( command.length != 3 ) {
					return new Astex.Warning ( "partition requires 3 integer arguments" , "Astex.Graph.processGraphs()" ) ;
				}
				c3d.setPartitions ( parseInt(command[0]) , parseInt(command[1]) , parseInt(command[2]) ) ;
			}
			else if ( command.match(/^viewer\s*\(/i) && dim == 3 ) {
				// view ( float , float ) ;

				// string cleanup
				command = command.replace ( /\s*viewer\s*\(/i , "" ) ;		// remove "viewer (" at beginning
				command = command.replace ( /\s*\)\s*$/ , "" ) ;		// remove ")" at end

				command = command.split ( "," ) ;				// command is now 2D array
				if ( command.length != 2 ) {
					return new Astex.Warning ( "view requires 2 float arguments" , "Astex.Graph.processGraphs()" ) ;
				}
				viewer = [ parseFloat(command[0]) , parseFloat(command[1]) ] ;	
			}
			else if ( command.match(/^plot3d\s*\(/i) && dim == 3 ) {

				var plot = Astex.Graph.parsePlot3D ( command ) ;

				if ( plot.type.match(/rect/i) ) {
					c3d.drawRectSurface ( plot.depVar , plot.func , plot.domain.replace(/\s*/g,"") ) ;
				}
				else if ( plot.type.match(/cyl/i) ) {
					c3d.drawCylSurface ( plot.depVar , plot.func , plot.domain.replace(/\s*/g,"") ) ;
				}
				else if ( plot.type.match(/sph/i) ) {
					c3d.drawSphSurface ( plot.depVar , plot.func , plot.domain.replace(/\s*/g,"") ) ;
				}
				else if ( plot.type.match(/param/i) ) {
					c3d.drawParamSurface ( plot.zxy , plot.xst , plot.yst , eval(plot.smin) , eval(plot.smax) , eval(plot.tmin) , eval(plot.tmax) ) ;
				}
				else if ( plot.type.match(/vvf/i) ) {
					c3d.drawVectorValuedFunction ( plot.xt , plot.yt , plot.zt , eval(plot.tmin) , eval(plot.tmax) ) ;
				}

			}
		}

		// still needed for 3d graphs....
		// plot3D ( param , `z=zxy` , `x=xst` , `y=yst` , smin , smax , tmin , tmax ) ;
		// mtext
		// footer
		// line
		// box / bbox ???
		// vector
		// vector field
		// level curves ??? ( actually a 2D graph )

		// need way to reset rhomin, rhomax, phi(min|max), r, theta etc. for 3d plots (domain isn't working well)
		// viewer and light

		// for 2D graphs
		// line, circle , rectangle , ellipse ( fills also )
		// vector field ( in Astex.Canvas too) ( is this the correct name for 2D ??? )
		// statistical plots

		/*
		*/
		// reset iframe width and height
		var iframe = w.iframe ;
		var node = w.node ;
		if ( Astex.Util.isIE ) {
			iframe.width = updatedWidth + 20 ;
			iframe.height = ( updatedHeight == height ) ? updatedHeight + 15 : updatedHeight ;
			//node.width = updatedWidth + 20 ;
			//node.height = ( updatedHeight == height ) ? updatedHeight + 15 : updatedHeight ;
		}
		else {
			iframe.setAttribute ( "width" , updatedWidth + 20 ) ;
			iframe.setAttribute ( "height" , ( updatedHeight == height ) ? updatedHeight + 15 : updatedHeight ) ;
			//node.setAttribute ( "width" , updatedWidth + 20 ) ;
			//node.setAttribute ( "height" , ( updatedHeight == height ) ? updatedHeight + 15 : updatedHeight ) ;
		}


		if ( dim == 3 ) {
			c3d.autoCenter ( ) ;
			//c3d.changeViewer ( -20 , -15 ) ;
			c3d.changeViewer ( viewer[0] , viewer[1] ) ;
			c3d.changeLight ( -30 , 30 ) ;
			c3d.orderWeight ( null , null , 0.01 ) ;
			c3d.draw ( ) ;
			if ( axesLabels3D ) {
				c3d.drawAxesLabels ( axesLabels3D[0] , axesLabels3D[1] , axesLabels3D[2] ) ;
			}
		}

		// paint the canvas and insert the window
		if ( Astex.Util.isIE ) { c.canvas.fixIEOpacity ( true ) ; }	// !!!IMPORTANT (make sure jsGraphics() fixes opacity in IE)
		c.paint ( ) ;
		w.insertWindow ( graph.parentNode , graph ) ;		// this will remove the graph div/node from the document

		//if ( dim == 3 && showControls && !Astex.Util.isIE ) {
		if ( dim == 3 && showControls ) {

			var ind = c3d.canvasIndex ;
			var can = "Astex.Canvas3D.Canvases" ;

			// does this work in IE ???

			var formStr = "" ;
			/*
			formStr += "<input type='button' onclick='" + can + "[" + ind + "].canvas.clear();" + (bgcolor!="" ? can + "[" + ind + "].canvas.fillBackground();" : "") + can + "[" + ind + "].changeViewer(0,5);" + can + "[" + ind + "].draw();" + can + "[" + ind + "].canvas.paint(); return false;' value='&lt;=' title='move viewer position left' \>" ;
			formStr += "<input type='button' onclick='" + can + "[" + ind + "].canvas.clear();" + (bgcolor!="" ? can + "[" + ind + "].canvas.fillBackground();" : "") + can + "[" + ind + "].changeViewer(-10,0);" + can + "[" + ind + "].draw();" + can + "[" + ind + "].canvas.paint(); return false;' value='&#9794;' title='move viewer position up' \>" ;
			formStr += "<input type='button' onclick='" + can + "[" + ind + "].canvas.clear();" + (bgcolor!="" ? can + "[" + ind + "].canvas.fillBackground();" : "") + can + "[" + ind + "].changeViewer(10,0);" + can + "[" + ind + "].draw();" + can + "[" + ind + "].canvas.paint(); return false;' value='&#9792;' title='move viewer position down' \>" ;
			formStr += "<input type='button' onclick='" + can + "[" + ind + "].canvas.clear();" + (bgcolor!="" ? can + "[" + ind + "].canvas.fillBackground();" : "") + can + "[" + ind + "].changeViewer(0,-5);" + can + "[" + ind + "].draw();" + can + "[" + ind + "].canvas.paint(); return false;' value='=&gt;' title='move viewer position right' \>" ;
			*/

			//alert ( originalScript ) ;
			originalScript = originalScript.replace ( /(\n|\r|\f|\v)*/g , "" ) ;
			originalScript = originalScript.replace ( /(\t)*/g , "" ) ;

			if ( Astex.Util.isIE ) {

				// ie needs to call the replaceIFrame method of canvas 3d
				//formStr += "<input type='button' onclick='alert(\"" + originalScript + "\");' value='script' title='show script' \>" ;
				//formStr += "<input type='button' onclick='" + can + "[" + ind + "].clear();" + can + "[" + ind + "].replaceIFrame();" + "' value='clear' title='clear' \>" ;
				formStr += "<input type='button' onclick='" + can + "[" + ind + "].clear();" + (bgcolor!="" ? can + "[" + ind + "].fillBackground();" : "") + can + "[" + ind + "].changeViewer(0,5);" + can + "[" + ind + "].draw();" + (axesLabels3D!=null ? can + "[" + ind + "].drawAxesLabels(\"" + axesLabels3D[0] + "\",\"" + axesLabels3D[1] + "\",\"" + axesLabels3D[2] + "\");" : "") + can + "[" + ind + "].paint();" + can + "[" + ind + "].replaceIFrame();' value='&lt;=' title='move viewer position left' \>" ;
				//formStr += "<br />" ;
				formStr += "<input type='button' onclick='" + can + "[" + ind + "].clear();" + (bgcolor!="" ? can + "[" + ind + "].fillBackground();" : "") + can + "[" + ind + "].changeViewer(-10,0);" + can + "[" + ind + "].draw();" + (axesLabels3D!=null ? can + "[" + ind + "].drawAxesLabels(\"" + axesLabels3D[0] + "\",\"" + axesLabels3D[1] + "\",\"" + axesLabels3D[2] + "\");" : "") + can + "[" + ind + "].paint();" + can + "[" + ind + "].replaceIFrame();' value='^' title='move viewer position up' \>" ;
				//formStr += "<br />" ;
				formStr += "<input type='button' onclick='" + can + "[" + ind + "].clear();" + (bgcolor!="" ? can + "[" + ind + "].fillBackground();" : "") + can + "[" + ind + "].changeViewer(10,0);" + can + "[" + ind + "].draw();" + (axesLabels3D!=null ? can + "[" + ind + "].drawAxesLabels(\"" + axesLabels3D[0] + "\",\"" + axesLabels3D[1] + "\",\"" + axesLabels3D[2] + "\");" : "") + can + "[" + ind + "].paint();" + can + "[" + ind + "].replaceIFrame();' value='v' title='move viewer position down' \>" ;
				//formStr += "<br />" ;
				formStr += "<input type='button' onclick='" + can + "[" + ind + "].clear();" + (bgcolor!="" ? can + "[" + ind + "].fillBackground();" : "") + can + "[" + ind + "].changeViewer(0,-5);" + can + "[" + ind + "].draw();" + (axesLabels3D!=null ? can + "[" + ind + "].drawAxesLabels(\"" + axesLabels3D[0] + "\",\"" + axesLabels3D[1] + "\",\"" + axesLabels3D[2] + "\");" : "") + can + "[" + ind + "].paint();" + can + "[" + ind + "].replaceIFrame();' value='=&gt;' title='move viewer position right' \>" ;

			}
			else {
				//formStr += "<input type='button' onclick='alert(\"" + originalScript + "\");' value='script' title='show script' \>" ;
				//formStr += "<input type='button' onclick='" + can + "[" + ind + "].clear();' value='clear' title='clear' \>" ;
				formStr += "<input type='button' onclick='" + can + "[" + ind + "].clear();" + (bgcolor!="" ? can + "[" + ind + "].fillBackground();" : "") + can + "[" + ind + "].changeViewer(0,5);" + can + "[" + ind + "].draw();" + (axesLabels3D!=null ? can + "[" + ind + "].drawAxesLabels(\"" + axesLabels3D[0] + "\",\"" + axesLabels3D[1] + "\",\"" + axesLabels3D[2] + "\");" : "") + can + "[" + ind + "].paint();' value='&lt;=' title='move viewer position left' \>" ;
				formStr += "<br />" ;
				formStr += "<input type='button' onclick='" + can + "[" + ind + "].clear();" + (bgcolor!="" ? can + "[" + ind + "].fillBackground();" : "") + can + "[" + ind + "].changeViewer(-10,0);" + can + "[" + ind + "].draw();" + (axesLabels3D!=null ? can + "[" + ind + "].drawAxesLabels(\"" + axesLabels3D[0] + "\",\"" + axesLabels3D[1] + "\",\"" + axesLabels3D[2] + "\");" : "") + can + "[" + ind + "].paint();' value='^' title='move viewer position up' \>" ;
				formStr += "<br />" ;
				formStr += "<input type='button' onclick='" + can + "[" + ind + "].clear();" + (bgcolor!="" ? can + "[" + ind + "].fillBackground();" : "") + can + "[" + ind + "].changeViewer(10,0);" + can + "[" + ind + "].draw();" + (axesLabels3D!=null ? can + "[" + ind + "].drawAxesLabels(\"" + axesLabels3D[0] + "\",\"" + axesLabels3D[1] + "\",\"" + axesLabels3D[2] + "\");" : "") + can + "[" + ind + "].paint();' value='v' title='move viewer position down' \>" ;
				formStr += "<br />" ;
				formStr += "<input type='button' onclick='" + can + "[" + ind + "].clear();" + (bgcolor!="" ? can + "[" + ind + "].fillBackground();" : "") + can + "[" + ind + "].changeViewer(0,-5);" + can + "[" + ind + "].draw();" + (axesLabels3D!=null ? can + "[" + ind + "].drawAxesLabels(\"" + axesLabels3D[0] + "\",\"" + axesLabels3D[1] + "\",\"" + axesLabels3D[2] + "\");" : "") + can + "[" + ind + "].paint();' value='=&gt;' title='move viewer position right' \>" ;

			}

			var d = document.createElement ( "div" ) ;
			d.innerHTML = formStr ;
			//w.iframe.parentNode.insertBefore ( d , w.iframe ) ;
			//Astex.Util.insertAfterNode ( d , w.iframe ) ;
			/*
			*/
			if ( Astex.Util.isIE ) {
				w.iframe.parentNode.insertBefore ( d , w.iframe ) ;
				w.node.setAttribute ( "style" , "position:relative;display:inline;" ) ;
				d.setAttribute ( "style" , "position:relative;display:inline;" ) ;
			}
			else {
				Astex.Util.insertAfterNode ( d , w.iframe ) ;
				d.setAttribute ( "style" , "position:relative;display:inline-block;" ) ;
			}
			//d.setAttribute ( "style" , "position:relative;display:inline-block;" ) ;
			//alert ( d.style.display ) ;
		}

		// for testing purposes only
		//break ;

		// reset graphs variable
		graphs = Astex.Util.getElementsByClass ( document.body , "div" , "AstexGraph" ) ;

	}
};


// prototype: Object Astex.Graph.processFirstSetOfDelimiters ( String str ) ;
// process first set of math markup enclosed within ` ` or $ $
// returns an object containing the math markup and the 
// processed string with first set of delimiters changed to a set of " "
// the rest of the string is NOT processed
// all $ are returned as `
Astex.Graph.processFirstSetOfDelimiters = function ( str ) {

	if ( ! str ) {
		return new Astex.Warning ( "missing delimiters or string to process" , "Astex.Graph.processFirstSetOfDelimiters" ) ;
	}

	// first argument should be a string enclosed in ` ` or $ $ NOT ' ' or " "
	// here we change it to a set of " " (removing the ` ` or $ $)
	str = str.replace ( /\$/g , "`" ) ;		// change all $ to `
	var ind = str.indexOf ( "`" ) ;
	var ind2 = str.indexOf ( "`" , ind + 1 ) ;
	if ( ind == -1 || ind2 == -1 ) {
		return new Astex.Warning ( "plot expects its first argument to be enclosed within ` ` or $ $" , "Astex.Graph.processFirstSetOfDelimiters" ) ;
	}
	// save math markup
	var math = str.slice ( ind + 1 , ind2 ) ;
	// add quotes around first argument
	str = str.slice ( 0 , ind ) + "\"" + str.slice ( ind + 1 , ind2 ) + "\"" + str.slice ( ind2 + 1 ) ;
	return {math:math,str:str} ;
};



// prototype: Object Astex.Graph.parsePlot ( String command ) ;
// returns an object with attributes indVar , f|f[] , min , max , endpoints
// f is an array when plot is a parametric plot: [x(t),y(t)]
Astex.Graph.parsePlot = function ( command ) {

	// e.g. plot ( `y=x^2` , 0 , 3 ) ;	// min,max values are optional
	// e.g. plot ( `x=y^2` ) ;
	// e.g. plot ( `x=x(t)` , `y=y(t)` , t-min , t-max ) ;	// parametric
	var obj = Astex.Graph.processFirstSetOfDelimiters ( command ) ;
	command = obj.str ;
	var mathMarkup = obj.math ;

	// see if there is a 2nd set of ` `
	// if so, then we have a parametric plot --- indVar == t
	// if not, indVar == x|y|r|theta

	// NON-parametric plot
	if ( ! command.match(/`/) ) {

		// find out what independent variable is
		// look for y= , x=, etc.
		var depVar = command.match(/(x|y|r|theta)\s*=/)[1];
		var indVar ;
		if ( depVar == "x" ) { indVar = "y" ; }
		else if ( depVar == "y" ) { indVar = "x" ; }
		else if ( depVar == "r" ) { indVar = "theta" ; }
		else if ( depVar == "theta" ) { indVar = "r" ; }
		// remove "depVar =" from command 
		command = command.replace ( new RegExp( depVar + "\\s*=\\s*" ) , "" ) ;
		var ind = command.indexOf ( "\"" ) ;
		var ind2 = command.indexOf ( "\"" , ind + 1 ) ;
		var f = command.slice(ind,ind2).replace ( new RegExp( depVar + "\\s*=\\s*" ) , "" ) ;

		// find min and max and endpoints
		var qInd1 = command.indexOf ( "\"" ) ;	
		var qInd2 = command.indexOf ( "\"" , qInd1 + 1 ) ;
		//var tmp2 = command.slice ( qInd2 + 2 ) ;
		var tmp2 = command.slice ( qInd2 + 1 ) ;
		tmp2 = tmp2.replace ( /^\s*,\s*/ , "" ) ;	// remove leading comma
		tmp2 = tmp2.replace ( /\s*\)\s*$/ , "" ) ;	// remove trailing )
		tmp2 = tmp2.replace ( /\s*/g , "" ) ;		// remove all whitespace
		tmp2 = tmp2.split ( "," ) ;			// tmp2 is now array
		var min , max ;
		// if user didn't supply min,max
		//if ( ! tmp2[0] || ! tmp2[1] ) {		// trouble testing ! num when num==0
		if ( tmp2[0] == null || tmp2[1] == null ) {
			min = null ;
			max = null ;
		}
		else {
			min = parseFloat ( eval ( Astex.Math.ascii2JS(tmp2[0]) ) ) ;	// min
			max = parseFloat ( eval ( Astex.Math.ascii2JS(tmp2[1]) ) ) ;	// max	
		}

		var endpoints = null ;
		if ( tmp2[2] != null ) {
			endpoints = tmp2[2] ;
		}

		//c.drawFunction ( indVar , f.replace(/"/g,"") , min , max ) ;
		return { indVar:indVar , f:f.replace(/"/g,"") , min:min , max:max , endpoints:endpoints } ;
	}
	else {
		//alert ( "parametric" ) ;
		var depVar = ["x","y"] ;
		var indVar = "t" ;
		var f = [] ;			// f is an array [x(t),y(t)] defining 2D parametric plot

		// remove "x =" from command and get first function x=x(t)
		command = command.replace ( new RegExp( depVar[0] + "\\s*=\\s*" ) , "" ) ;
		var ind = command.indexOf ( "\"" ) ;
		var ind2 = command.indexOf ( "\"" , ind + 1 ) ;
		f[0] = command.slice(ind,ind2).replace ( new RegExp( depVar[0] + "\\s*=\\s*" ) , "" ) ;

		// get the 2nd set of ` `
		// remember the 1st set has already been processed
		var obj2 = Astex.Graph.processFirstSetOfDelimiters ( command ) ;
		command = obj2.str ;
		var mathMarkup2 = obj2.math ;

		// remove "y =" from command and get 2nd function y=y(t)
		command = command.replace ( new RegExp( depVar[1] + "\\s*=\\s*" ) , "" ) ;
		var ind = command.indexOf ( "\"" ) ;
		var ind2 = command.indexOf ( "\"" , ind + 1 ) ;
		var ind3 = command.indexOf ( "\"" , ind2 + 1 ) ;
		var ind4 = command.indexOf ( "\"" , ind3 + 1 ) ;
		//alert ( command.slice ( ind3 , ind4 + 1 ) ) ;
		f[1] = command.slice(ind3,ind4+1).replace ( new RegExp( depVar[1] + "\\s*=\\s*" ) , "" ) ;
		//alert ( f ) ;

		// find min and max and any endpoints
		//var qInd1 = command.indexOf ( "\"" , ind3 + 1 ) ;	
		//var qInd2 = command.indexOf ( "\"" , qInd1 + 1 ) ;
		var qInd1 = ind3 ;
		var qInd2 = ind4 ;
		//var tmp2 = command.slice ( qInd2 + 2 ) ;
		var tmp2 = command.slice ( qInd2 + 1 ) ;
		tmp2 = tmp2.replace ( /^\s*,\s*/ , "" ) ;	// remove leading comma
		tmp2 = tmp2.replace ( /\s*\)\s*$/ , "" ) ;	// remove trailing )
		tmp2 = tmp2.replace ( /\s*/g , "" ) ;		// remove all whitespace
		tmp2 = tmp2.split ( "," ) ;			// tmp2 is now array
		var min , max ;
		// if user didn't supply min,max
		//if ( ! tmp2[0] || ! tmp2[1] ) {
		if ( tmp2[0] == null || tmp2[1] == null ) {
			min = null ;
			max = null ;
		}
		else {
			min = parseFloat ( eval ( Astex.Math.ascii2JS(tmp2[0]) ) ) ;	// min
			max = parseFloat ( eval ( Astex.Math.ascii2JS(tmp2[1]) ) ) ;	// max	
			//min = parseFloat ( eval ( tmp2[0] ) ) ;	// min
			//max = parseFloat ( eval ( tmp2[1] ) ) ;	// max	
		}

		var endpoints = null ;
		if ( tmp2[2] != null ) {
			endpoints = tmp2[2] ;
		}

		//c.drawFunction ( indVar , f.replace(/"/g,"") , min , max ) ;
		return { indVar:indVar , f:[f[0].replace(/"/g,""),f[1].replace(/"/g,"")] , min:min , max:max , endpoints:endpoints } ;
	}

};

// prototype: Object Astex.Graph.parsePlot3D ( String command ) ;
// returns an object with attributes type , depVar , indVar , f|f[] , min , max , endpoints
Astex.Graph.parsePlot3D = function ( command ) {

	// e.g. plot3D ( rect , `z=x^2+y^2` [, `domain`] ) ;
	// e.g. plot3D ( cyl , `z=r` [, `domain`] ) ;
	// e.g. plot3D ( sph , `rho=1` [, `domain`] ) ;
	// e.g. plot3D ( param , `z=zxy` , `x=xst` , `y=yst` , smin , smax , tmin , tmax ) ;
	// e.g. plot3D ( vvf , `x=xt` , `y=yt` , `z=zt` , tmin , tmax ) ;

	var arr = command.split ( "," ) ;
	if ( ! arr[0].match(/rect|cyl|sph|param|vvf/i) ) {

		return new Astex.Warning ( "plot3D expects first argument to be rect, cyl, sph, param, or vvf" , "Astex.Graph.parsePlot3D" ) ;
	}

	var type = arr[0] ;		// rect|cyl|sph|param|vvf
	var depVar = "" ;
	var func = "" ;
	var domain = "" ;

	var obj = Astex.Graph.processFirstSetOfDelimiters ( command ) ;
	command = obj.str ;
	var mathMarkup = obj.math ;

	//alert ( mathMarkup ) ;

	// e.g. plot3D ( rect , `z=x^2+y^2` [, `domain`] ) ;
	// e.g. plot3D ( cyl , `z=r` [, `domain`] ) ;
	// e.g. plot3D ( sph , `rho=1` [, `domain`] ) ;
	if ( type.match(/rect|cyl|sph/i) ) {

		// get dependent variable from mathMarkup ( e.g. z=r )
		var tmp = mathMarkup.split ( "=" ) ;
		depVar = tmp[0] ;
		func = tmp[1] ;

		// get domain ( if applicable )
		if ( arr.length == 3 ) {

			obj = Astex.Graph.processFirstSetOfDelimiters ( command ) ;
			command = obj.str ;
			mathMarkup = obj.math ;
			domain = mathMarkup ;
		}

		return { type:type , depVar:depVar , func:func , domain:domain } ;
	}

	var zfunc = "" ;
	var xfunc = "" ;
	var yfunc = "" ;
	// e.g. plot3D ( param , `z=zxy` , `x=xst` , `y=yst` , smin , smax , tmin , tmax ) ;
	if ( type.match(/param/i) ) {

		// get z=f(x,y) 
		var tmp = mathMarkup.split ( "=" ) ;
		zfunc = tmp[1] ;

		// get x=x(s,t)
		obj = Astex.Graph.processFirstSetOfDelimiters ( command ) ;
		command = obj.str ;
		mathMarkup = obj.math ;

		tmp = mathMarkup.split ( "=" ) ;
		xfunc = tmp[1] ;

		// get y=y(s,t)
		obj = Astex.Graph.processFirstSetOfDelimiters ( command ) ;
		command = obj.str ;
		mathMarkup = obj.math ;

		tmp = mathMarkup.split ( "=" ) ;
		yfunc = tmp[1] ;

		return { type:type , zxy:zfunc , xst:xfunc , yst:yfunc , smin:parseFloat(arr[4]) , smax:parseFloat(arr[5]) , tmin:parseFloat(arr[6]) , tmax:parseFloat(arr[7]) } ;
	}

	var xfunc = "" ;
	var yfunc = "" ;
	var zfunc = "" ;
	// e.g. plot3D ( vvf , `x=xt` , `y=yt` , `z=zt` , tmin , tmax ) ;
	if ( type.match(/vvf/i) ) {

		// get x=x(t) 
		var tmp = mathMarkup.split ( "=" ) ;
		xfunc = tmp[1] ;

		// get y=y(t)
		obj = Astex.Graph.processFirstSetOfDelimiters ( command ) ;
		command = obj.str ;
		mathMarkup = obj.math ;

		tmp = mathMarkup.split ( "=" ) ;
		yfunc = tmp[1] ;

		// get z=z(t)
		obj = Astex.Graph.processFirstSetOfDelimiters ( command ) ;
		command = obj.str ;
		mathMarkup = obj.math ;

		tmp = mathMarkup.split ( "=" ) ;
		zfunc = tmp[1] ;

		return { type:type , xt:xfunc , yt:yfunc , zt:zfunc , tmin:parseFloat(arr[4]) , tmax:parseFloat(arr[5]) } ;
	}

};

/*--------------------------------------------------------------------------*/
