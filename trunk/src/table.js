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
// Astex.Table class
//

Astex.Table = { } ;

//
// Astex.Table class methods
//

// prototype: String Astex.Table.processTables ( HTMLElement node ) ;
Astex.Table.processTables = function ( node ) {

	if ( ! node ) { node = document.body ; }

	// get divs
	var tables = Astex.Util.getElementsByClass ( node , "div" , "AstexTable" ) ;
	for ( var i = 0 ; i < tables.length ; i++ ) {

		// get data div contents
		var script = Astex.Plugin.getDataDivContentById ( tables[i].getAttribute("id") ) ;
		script = Astex.Plugin.unescapeScript ( script ) ;
		script = Astex.Plugin.removeComments ( script ) ;

		//script = script.replace ( /\/\/\/\//g , "end" ) ;
		//alert ( script ) ;
		/*
			table format

			\begin{table}
				\caption{Table Caption}			-- optional
				\column-separator{&}			-- optional (default is &)
				\row-separator{\\}			-- optional (default is \\)
				\header{lcr}{Col1 & Col2 & Col3}	-- optional
				\begin{tabular}{lcr}
					a11 & a12 & a13 \\
					a21 & a22 & a23 \\
					a31 & a32 & a33
				\end{tabular}
				\footer{lcr}{Foot1 & Foot2 & Foot3}	-- optional
			\end{table}

			can also add [span=#,#] to any header,tabular,footer element (order is rowspan,colspan)
		*/

		var str = "" ;
		str += "<table class=\"Astex\">" ;

		// get caption
		var caption = script.match ( /\\caption{(([^}]|\n|\r|\f|\v)*?)}/i , "" ) ;
		if ( caption != null && caption[1] != null && caption[1] != "" ) {
			str += "<caption>" + caption[1] + "</caption>" ;	
		}

		// column and row separators
		var csep = "&" ;
		var rsep = "\\\\" ;
		var colsep = script.match ( /\\column-?separator{(([^}]|\n|\r|\f|\v)*?)}/i , "" ) ;
		if ( colsep != null && colsep[1] != null && colsep[1] != "" ) {
			csep = colsep[1] ;	
		}
		//if ( csep == "&amp;" ) { csep = "&" ; }
		var rowsep = script.match ( /\\row-?separator{(([^}]|\n|\r|\f|\v)*?)}/i , "" ) ;
		if ( rowsep != null && rowsep[1] != null && rowsep[1] != "" ) {
			rsep = rowsep[1] ;	
		}
		//alert ( csep + rsep ) ;

		// header
		var halign = "" ;
		var hcontent = "" ;
		var head = script.match ( /\\header{(([^}]|\n|\r|\f|\v)*?)}{(([^}]|\n|\r|\f|\v)*?)}/i , "" ) ;
		if ( head != null && head[1] != null && head[1] != "" ) {
			halign = head[1] ;
			halign = halign.replace ( /[^lrc]/i , "" ) ;		// remove anything not an l,r,c
		}
		if ( head != null && head[3] != null && head[3] != "" ) {
			hcontent = head[3] ;
			str += "<thead><tr>" ;
			var cols = hcontent.split ( csep ) ;
			for ( var c = 0 ; c < cols.length ; c++ ) {
				if ( c < halign.length ) {
					var align = "" ;
					switch ( halign.charAt(c) ) {
						case "l" :
						case "L" :
							align = "left" ;
							break ;
						case "r" :
						case "R" :
							align = "right" ;
							break ;
						case "c" :
						case "C" :
							align = "center" ;
							break ;
						default :	
							align = "left" ;
							break ;
					}
					str += "<th style=\"text-align:" + align + ";\"" ; 
				}
				else {
					str += "<th" ;
				}
				// take care of row/column spans
				var tmp = cols[c].match ( /\[span\s*=\s*([0-9]*,[0-9]*)\]/i ) ; 
				if ( tmp != null && tmp[tmp.length-1] != "" ) {
					cols[c] = cols[c].replace ( /\[span\s*=\s*([0-9]*,[0-9]*)\]/i , "" ) ; 
					var spans = tmp[tmp.length-1].split ( "," ) ;
					str += " rowspan=\"" + spans[0] + "\" colspan=\"" + spans[1] + "\">" + cols[c] ;
				}
				else {
					str += ">" + cols[c] ;
				}
				str += "</th>" ; 
			}	
			str += "</tr></thead>" ;
		}
		//alert ( halign + hcontent ) ;

		// tabular
		var talign = "" ;
		var tcontent = "" ;
		var tabular = script.match ( /\\begin{tabular}{(([^}]|\n|\r|\f|\v)*?)}((.|\n|\r|\f|\v)*?)\\end{tabular}/i , "" ) ;
		//alert ( tabular ) ;
		if ( tabular != null && tabular[1] != null && tabular[1] != "" ) {
			talign = tabular[1] ;
			talign = talign.replace ( /[^lrc]/i , "" ) ;		// remove anything not an l,r,c
		}
		if ( tabular != null && tabular[3] != null && tabular[3] != "" ) {
			tcontent = tabular[3] ;
			//for ( var tmp = 3 ; tmp < tabular.length ; tmp++ ) { tcontent += tabular[tmp] ; }
			str += "<tbody>" ;
			var rows = tcontent.split ( rsep ) ;
			for ( var r = 0 ; r < rows.length ; r++ ) {
				var cols = rows[r].split ( csep ) ;
				str += "<tr>" ;
				for ( var c = 0 ; c < cols.length ; c++ ) {
					if ( c < talign.length ) {
						var align = "" ;
						switch ( talign.charAt(c) ) {
							case "l" :
							case "L" :
								align = "left" ;
								break ;
							case "r" :
							case "R" :
								align = "right" ;
								break ;
							case "c" :
							case "C" :
								align = "center" ;
								break ;
							default :	
								align = "left" ;
								break ;
						}
						str += "<td style=\"text-align:" + align + ";\"" ; 
					}
					else {
						str += "<td" ; 
					}
					// take care of row/column spans
					var tmp = cols[c].match ( /\[span\s*=\s*([0-9]*,[0-9]*)\]/i ) ; 
					if ( tmp != null && tmp[tmp.length-1] != "" ) {
						cols[c] = cols[c].replace ( /\[span\s*=\s*([0-9]*,[0-9]*)\]/i , "" ) ; 
						var spans = tmp[tmp.length-1].split ( "," ) ;
						str += " rowspan=\"" + spans[0] + "\" colspan=\"" + spans[1] + "\">" + cols[c] ;
					}
					else {
						str += ">" + cols[c] ;
					}
					str += "</td>" ;
				}
				str += "</tr>" ;
			}
			str += "</tbody>" ;
		}

		// footer
		var falign = "" ;
		var fcontent = "" ;
		var foot = script.match ( /\\footer{(([^}]|\n|\r|\f|\v)*?)}{(([^}]|\n|\r|\f|\v)*?)}/i , "" ) ;
		if ( foot != null && foot[1] != null && foot[1] != "" ) {
			falign = foot[1] ;
			falign = falign.replace ( /[^lrc]/i , "" ) ;		// remove anything not an l,r,c
		}
		if ( foot != null && foot[3] != null && foot[3] != "" ) {
			fcontent = foot[3] ;
			str += "<tfoot><tr>" ;
			var cols = fcontent.split ( csep ) ;
			for ( var c = 0 ; c < cols.length ; c++ ) {
				if ( c < falign.length ) {
					var align = "" ;
					switch ( falign.charAt(c) ) {
						case "l" :
						case "L" :
							align = "left" ;
							break ;
						case "r" :
						case "R" :
							align = "right" ;
							break ;
						case "c" :
						case "C" :
							align = "center" ;
							break ;
						default :	
							align = "left" ;
							break ;
					}
					str += "<td style=\"text-align:" + align + ";\"" ; 
				}
				else {
					str += "<td" ; 
				}
				// take care of row/column spans
				var tmp = cols[c].match ( /\[span\s*=\s*([0-9]*,[0-9]*)\]/i ) ; 
				if ( tmp != null && tmp[tmp.length-1] != "" ) {
					cols[c] = cols[c].replace ( /\[span\s*=\s*([0-9]*,[0-9]*)\]/i , "" ) ; 
					var spans = tmp[tmp.length-1].split ( "," ) ;
					str += " rowspan=\"" + spans[0] + "\" colspan=\"" + spans[1] + "\">" + cols[c] ;
				}
				else {
					str += ">" + cols[c] ;
				}
				str += "</td>" ;
			}	
			str += "</tr></tfoot>" ;
		}
		//alert ( halign + hcontent ) ;

		str += "</table>" ;

		str = str.replace ( /\n|\r|\f|\v/ , "" ) ;

		tables[i].style.diplay = "inline" ;
		tables[i].innerHTML = str ;
	}

};

/*--------------------------------------------------------------------------*/

