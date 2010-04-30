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
// Astex.Page class
//

// prototype: new Astex.Page ( String title , Int level , String content ) ;
Astex.Page = function ( title , level , content ) {

	// messes with indendation in doc navigation bar
	//if ( level == null || typeof level != "number" ) { level = 0 ; }
	title = title.replace ( /^\s*/ , "" ) ;
	title = title.replace ( /\s*$/ , "" ) ;

	this.title = title ;
	this.level = parseInt ( level ) ;
	this.content = content ;

	return this ;
};	

/*--------------------------------------------------------------------------*/

//
// Astex.Doc class
//

// prototype: new Astex.Doc ( String title ) ;
Astex.Doc = function ( title ) {

	this.title = title ;
	this.pages = new Array ( ) ;

	Astex.Doc.Docs.push ( this ) ;
	this.index = Astex.Doc.Docs.length - 1 ;

	return this ;
};	

//
// Astex.Doc class variables
//
Astex.Doc.Docs = new Array ( ) ;

//
// Astex.Doc instance methods
//

// prototype: this.addPage ( Astex.Page page ) ;
Astex.Doc.prototype.addPage = function ( page ) {

	this.pages.push ( page ) ;
};

/*--------------------------------------------------------------------------*/

//
// Astex.Doc Class methods
//

// prototype: int Astex.Doc.getPageIndex ( int docIndex , String title )
Astex.Doc.getPageIndex = function ( docIndex , title ) {

	title = title.replace ( /^\s*/ , "" ) ;
	title = title.replace ( /\s*$/ , "" ) ;

	var doc = Astex.Doc.Docs[ docIndex ] ;
	var pages = doc.pages ;
	for ( var p = 0 ; p < pages.length ; p++ ) {
		if ( pages[p].title == title ) {
			return p ;
		}
	}
	return -1 ;
};

// prototype: void Astex.Doc.processDocLinks ( int docIndex , String content )
Astex.Doc.processDocLinks = function ( docIndex , content ) {

	//var doc = Astex.Doc.Docs[ docIndex ] ;
	//content = content.replace ( /\?begin{docLink}(.*)\?end{docLink}/ig , "<a href=\"\" onclick=\"Astex.Doc.loadMainContent(" + docIndex + "," + Astex.Doc.getPageIndex( docIndex , "$1" ) + "); return false;\">" + "$1" + "</a>" ) ;
	content = content.replace ( /\\?docLink{([^}]*)}/ig , function ( s , t ) {	// ie likes [^}] better than . --> otherwise consecutive doc links
		var doc = Astex.Doc.Docs[ docIndex ] ;					// are concatenated into one link, resulting in an incorrect page title
		var pageIndex = Astex.Doc.getPageIndex ( docIndex , t ) ;
		if ( pageIndex != -1 ) {
			//return "<a href=\"\" title=\""+(pageIndex+1)+". "+doc.pages[pageIndex].title+"\" onclick=\"Astex.Doc.loadMainContent(" + docIndex + "," + Astex.Doc.getPageIndex( docIndex , t ) + "); return false;\">" + t + "</a>" ;
			return "<a href=\"#AstexDocTopAnchor\" title=\""+(pageIndex+1)+". "+doc.pages[pageIndex].title+"\" onclick=\"Astex.Doc.loadMainContent(" + docIndex + "," + Astex.Doc.getPageIndex( docIndex , t ) + ");\">" + t + "</a>" ;
			//return "<a href=\"\" title=\""+(pageIndex+1)+". "+doc.pages[pageIndex].title+"\" onclick=\"Astex.Doc.loadMainContent(" + docIndex + "," + Astex.Doc.getPageIndex( docIndex , t ) + "); return false;\">" + t + "</a>" ;
		}
		else {
			return t + " (this link is broken...) " ;
		}
	} );
	return content ;
};

// prototype: void Astex.Doc.processDocs ( HTMLElement node )
Astex.Doc.processDocs = function ( node ) {

	if ( ! node ) { node = document.body ; }

	// get all div's with class attribute 'AstexDoc'
	var docs = Astex.Util.getElementsByClass ( node , "div" , "AstexDoc" ) ;

	for ( var i = 0 ; i < docs.length ; i++ ) {

		var doc = docs[ i ] ;

		/*
		// process script attribute
		var script = doc.getAttribute ( "script" ) ;
		script = Astex.Plugin.unescapeScript ( script ) ;
		script = Astex.Plugin.removeComments ( script ) ;
		*/

		// get data div contents
		var script = Astex.Plugin.getDataDivContentById ( doc.getAttribute("id") ) ;
		script = Astex.Plugin.unescapeScript ( script ) ;
		script = Astex.Plugin.removeComments ( script ) ;

		/*
		// get doc style 
		var styleInd = script.indexOf ( "STYLE:" ) ;
		var titleInd = script.indexOf ( "TITLE:" ) ;
		var style = script.slice ( styleInd , titleInd ) ;
		style = style.replace ( /STYLE:/ , "" ) ;
		style = style.replace ( /^\s* / , "" ) ;
		style = style.replace ( /\s*$/ , "" ) ;
		*/


		// get doc title
		var titleInd = script.indexOf ( "TITLE:" ) ;
		var pageInd = script.indexOf ( "BEGIN PAGE:" ) ;

		var title = script.slice ( titleInd , pageInd ) ;
		title = title.replace ( /TITLE:/ , "" ) ;
		title = title.replace ( /^\s*/ , "" ) ;
		title = title.replace ( /\s*$/ , "" ) ;

		// construct an Astex.Doc
		var aDoc = new Astex.Doc ( title ) ;

		// get pages
		script = script.slice ( pageInd ) ;
		script = script.replace ( /^BEGIN PAGE:\s*/ , "" ) ;
		var pages = script.split ( "BEGIN PAGE:" ) ;


		// create a title bar , left-hand navigation , and main content div
		var titleBar = "" ;
		titleBar += "<div class=\"AstexDoc-TitleBar-Div\">" ;
		titleBar += title ;
		// create a top anchor...note that an <a href='#AstexDocTopAnchor' ... onclick attribute cannot return false; for this to work
		//titleBar += "<a name=\"AstexDocTopAnchor\" id=\"AstexDocTopAnchor\" style=\"visibility:hidden;\">Top of Doc</a>" ;
		titleBar += "<a name=\"AstexDocTopAnchor\" style=\"visibility:hidden;\">Top of Doc</a>" ;
		titleBar += "</div>" ;

		for ( var j = 0 ; j < pages.length ; j++ ) {

			var page = pages[ j ] ;

			var pTitleInd = page.indexOf ( "TITLE:" ) ;
			var pLevelInd = page.indexOf ( "LEVEL:" ) ;
			var pContentInd = page.indexOf ( "CONTENT:" ) ;

			// get page title
			var pTitle = page.slice ( pTitleInd , pLevelInd ) ;
			pTitle = pTitle.replace ( /TITLE:/ , "" ) ;
			pTitle = pTitle.replace ( /^\s*/ , "" ) ;
			pTitle = pTitle.replace ( /\s*$/ , "" ) ;

			// get page level
			var pLevel = page.slice ( pLevelInd , pContentInd ) ;
			pLevel = pLevel.replace ( /LEVEL:/ , "" ) ;
			pLevel = pLevel.replace ( /^\s*/ , "" ) ;
			pLevel = pLevel.replace ( /\s*$/ , "" ) ;

			// get page content
			var pContent = page.slice ( pContentInd ) ;
			pContent = pContent.replace ( /CONTENT:/ , "" ) ;
			pContent = pContent.replace ( /^\s*/ , "" ) ;
			pContent = pContent.replace ( /\s*$/ , "" ) ;

			// add page to AstexDoc
			//aDoc.addPage ( new Astex.Page ( pTitle , pLevel , pContent ) ) ;
			aDoc.addPage ( new Astex.Page ( pTitle , pLevel , Astex.Plugin.escapeScript(pContent) ) ) ;
		}


		// add AstexDoc to web page
		var str = "" ;

		doc.style.display = "inline" ;

		// create sub header pane (id contains index)
		var subHeaderContent = "<div id=\"AstexDoc-SubHeaderContent"+i+"\" class=\"AstexDoc-SubHeaderContent-Div\">" ;
		subHeaderContent += Astex.Doc.getSearchBoxHTML ( i ) ;
		subHeaderContent += Astex.Doc.getSiteMapLinkHTML ( i ) ;
		subHeaderContent += "&nbsp;&nbsp;" ;
		subHeaderContent += "\\begin{settings} \\end{settings}" ;
		subHeaderContent += "<br />" ;
		subHeaderContent += "<br />" ;
		subHeaderContent += "</div>" ;

		// create main content pane (id contains index)
		var mainContent = "<div id=\"AstexDoc-MainContent"+i+"\" class=\"AstexDoc-MainContent-Div\">" ;
		mainContent += "</div>" ;

		var d = document.createElement ( "div" ) ;

		var str = "" ;
		/*
		if ( style != "" ) {
			str += "<div class=\"AstexDoc-Wrapper-Div\" style=\"" + style + "\">" ;
		}
		else {
			str += "<div class=\"AstexDoc-Wrapper-Div\">" ;
		}
		*/

		str += "<div class=\"AstexDoc-Wrapper-Div\">" ;

		str += "<div>" ;
		str += titleBar ;
		str += subHeaderContent ;
		str += "</div>" ;
		//str += "<div>" ;
		//str += navigationBar ;
		//str += "</div>" ;
		str += "<div>" ;
		str += mainContent ;
		str += "</div>" ;

		str += "</div>" ;
		/*
		*/

		/*
		str += "<table border=0 class='AstexDoc'>" ;

		str += "<tr>" ;
		str += "<td colspan=2>" ;
		str += titleBar ;
		str += "</td>" ;
		str += "</tr>" ;

		str += "<tr>" ;
		str += "<td valign='top'>" ;
		str += navigationBar ;
		str += "</td>" ;
		str += "<td valign='top'>" ;
		str += mainContent ;
		str += "</td>" ;
		str += "</tr>" ;

	
		str += "</table>" ;
		*/


		doc.innerHTML = str ;

		// load first page (index=0)
		//Astex.Doc.loadMainContent ( aDoc.index , 0 , true ) ;			// not necessary
		Astex.Doc.loadMainContent ( aDoc.index , 0 ) ;

		//Astex.process ( doc ) ;		// is this a problem in Astex.Quiz
							// don't need to call Astex.process ( ) ???

		// after html has been added to doc above, we can ...
		// process title bar
		// this way, the title is only processed once
		//var titles = Astex.Util.getElementsByClass ( document.body , "div" , "AstexDoc-TitleBar-Div" ) ;
		//Astex.process ( titles[aDoc.index] ) ;

		// process the sub header content (this processes the settings data div)
		Astex.process ( document.getElementById("AstexDoc-SubHeaderContent"+aDoc.index) ) ;

		// the below messes with navigation links
		/*
		// process nav bar
		var navs = Astex.Util.getElementsByClass ( document.body , "div" , "AstexDoc-NavigationBar-Div" ) ;
		Astex.process ( navs[aDoc.index] ) ;
		*/

		// only process the first doc
		break ;
	}

};

// prototype: Astex.Doc.loadTOC ( Int docIndex ) ;
Astex.Doc.loadTOC = function ( docIndex ) {

	// get doc
	var aDoc = Astex.Doc.Docs[ docIndex ] ;

	var navigationBar = "" ;

	// add links for search and sitemap
	//navigationBar += Astex.Doc.getSearchBoxHTML ( docIndex ) ;
	//navigationBar += Astex.Doc.getSiteMapLinkHTML ( docIndex ) ;
	//navigationBar += "<br />" ;
	//navigationBar += "<br />" ;

	navigationBar += "<table border=0>" ;

	for ( var h = 0 ; h < aDoc.pages.length ; h++ ) {

		navigationBar += "<tr>" ;
		navigationBar += "<td align=\"right\">" ;
		navigationBar += "" + (h+1) + "." ;
		//navigationBar += "&nbsp;&nbsp;&nbsp;" ;
		navigationBar += "</td>" ;

		navigationBar += "<td>" ;
		navigationBar += "&nbsp;&nbsp;&nbsp;" ;

		// indentation
		for ( var lev = 0 ; lev < aDoc.pages[h].level ; lev++ ) {
			navigationBar += "&nbsp;&nbsp;&nbsp;" ;
		}

		//navigationBar += "<a href='' onclick=\"Astex.Doc.loadMainContent(" + aDoc.index + "," + h + "); return false;\">" + aDoc.pages[h].title + "</a>" ;
		navigationBar += "<a href='#AstexDocTopAnchor' onclick=\"Astex.Doc.loadMainContent(" + aDoc.index + "," + h + ");\">" + aDoc.pages[h].title + "</a>" ;
		//navigationBar += "<br />" ;
		navigationBar += "</td>" ;
		navigationBar += "</tr>" ;

	}
	navigationBar += "</table>" ;

	var div = document.getElementById ( "AstexDoc-MainContent" + docIndex ) ;
	div.innerHTML = navigationBar ;
};

// prototype: Astex.Doc.loadMainContent ( Int docIndex , Int pageIndex , Boolean bool ) ;
Astex.Doc.loadMainContent = function ( docIndex , pageIndex , bool ) {

	if ( ! bool ) { bool = false ; }

	var div = document.getElementById ( "AstexDoc-MainContent" + docIndex ) ;
	var str = Astex.Plugin.unescapeScript ( Astex.Doc.Docs[docIndex].pages[pageIndex].content ) ;
	str = str.replace ( /\\?newline/g , "<br />" ) ;
	//str = str.replace ( /(\\t|\\n)/g , "" ) ;
	// style below causes problems with navigation links
	//div.innerHTML = "<div class=\"AstexDoc-PageTitle-Div\">" + Astex.Doc.Docs[docIndex].pages[pageIndex].title + "</div>" + str ;

	var tmpStr = "" ;

	// add back and forward buttons (for slideshow effect)
	var maxPageIndex = Astex.Doc.Docs[docIndex].pages.length - 1 ;

	// add search box
	//tmpStr += Astex.Doc.getSearchBoxHTML ( docIndex ) ;
	//tmpStr += Astex.Doc.getSiteMapLinkHTML ( docIndex ) ;
	//tmpStr += "<br />" ;
	//tmpStr += "<br />" ;

	//tmpStr += "<div style=\"display:inline;float:right;\">" ;

	// add page controls at top of page
	tmpStr += Astex.Doc.getPageControlsHTML ( docIndex , pageIndex , maxPageIndex ) ;

	tmpStr += "<br />" ;
	tmpStr += "<br />" ;

	/*
	// add page title
	tmpStr += "<h3>" ;
	tmpStr += Astex.Doc.Docs[docIndex].pages[pageIndex].title ;
	tmpStr += "</h3>" ;
	*/

	// add breadcrumbs
	tmpStr += "<div>" ;
	//tmpStr += "<font size=3>" ;
	var page = Astex.Doc.Docs[docIndex].pages[pageIndex] ;
	var level = page.level ;
	//var levStr = "<a href='' onclick=\"Astex.Doc.loadMainContent(" + docIndex + "," + pageIndex + "); return false;\">" + page.title + "</a>" ;

	var levStr = "" ;
	// work backwards from pageIndex to add previous parent levels
	if ( true ) {
	//if ( level != 0 ) {		// if i add the title back above, use this
		levStr = "<b>" + page.title + "</b>" ;
		for ( var p = pageIndex - 1 ; p >= 0 ; p-- ) {
			if ( Astex.Doc.Docs[docIndex].pages[ p ].level < level ) {
				// prepend to levStr
				//levStr = "<a href='' onclick=\"Astex.Doc.loadMainContent(" + docIndex + "," + p + "); return false;\">" + Astex.Doc.Docs[docIndex].pages[p].title + "</a>" + "&nbsp;>&nbsp;" + levStr ;
				levStr = "<a href='#AstexDocTopAnchor' onclick=\"Astex.Doc.loadMainContent(" + docIndex + "," + p + ");\">" + Astex.Doc.Docs[docIndex].pages[p].title + "</a>" + "&nbsp;>&nbsp;" + levStr ;
				//levStr = Astex.Doc.Docs[docIndex].pages[p].title + ">" + levStr ;
				level-- ;
			}	
		}
	}
	tmpStr += levStr ;
	//tmpStr += "</font>" ;
	tmpStr += "</div>" ;
	tmpStr += "<br />" ;

	// add content string
	str = Astex.Doc.processDocLinks ( docIndex , str ) ;
	tmpStr += str ;

	// add page controls at bottom of page
	tmpStr += "<br />" ;
	tmpStr += "<br />" ;
	tmpStr += Astex.Doc.getPageControlsHTML ( docIndex , pageIndex , maxPageIndex ) ;

	// add logo 
	tmpStr += "<br /><br /><center>\\logo{}</center>" ;

	div.innerHTML = tmpStr ;

	// don't process when called above (loading first page)
	if ( ! bool ) {
		Astex.process ( div ) ;
	}
};


// prototype: String Astex.Doc.getSearchBoxHTML ( Int docIndex ) ;
Astex.Doc.getSearchBoxHTML = function ( docIndex ) {

	var str = "" ;
	str += "<input size=20 id=\"AstexDocSearchBox" + docIndex + "\" />" ;
	str += "&nbsp;&nbsp;" ;
	//str += "<a href='' onclick=\"Astex.Doc.search(" + docIndex + "); return false;\">Search</a>" ;
	str += "<a href='#AstexDocTopAnchor' onclick=\"Astex.Doc.search(" + docIndex + ");\">Search</a>" ;
	str += "&nbsp;&nbsp;&nbsp;" ;

	return str ;
};

// prototype: String Astex.Doc.getSiteMapLinkHTML ( Int docIndex ) ;
Astex.Doc.getSiteMapLinkHTML = function ( docIndex ) {

	var str = "" ;
	str += "&nbsp;&nbsp;&nbsp;" ;
	//str += "<a href='' onclick=\"Astex.Doc.loadTOC(" + docIndex + "); return false;\">" + "Sitemap" + "</a>" ;
	str += "<a href='#AstexDocTopAnchor' onclick=\"Astex.Doc.loadTOC(" + docIndex + ");\">" + "Sitemap" + "</a>" ;
	str += "&nbsp;&nbsp;&nbsp;" ;

	return str ;
};

// prototype: String Astex.Doc.getPageControlsHTML ( Int docIndex , Int pageIndex , Int maxPageIndex ) ;
// first, previous, page #, next, last links
Astex.Doc.getPageControlsHTML = function ( docIndex , pageIndex , maxPageIndex ) {

	var tmpStr = "" ;
	var doc = Astex.Doc.Docs[docIndex] ;

	// left arrow
	if ( pageIndex > 0 ) {
		//tmpStr += "<a href='' onclick=\"Astex.Doc.loadMainContent(" + docIndex + "," + 0 + "); return false;\" title=\""+"1. "+doc.pages[0].title+"\">" + "&lt;&lt; First" + "</a>" ;
		tmpStr += "<a href='#AstexDocTopAnchor' onclick=\"Astex.Doc.loadMainContent(" + docIndex + "," + 0 + ");\" title=\""+"1. "+doc.pages[0].title+"\">" + "&lt;&lt; First" + "</a>" ;
		tmpStr += "&nbsp;&nbsp;&nbsp;" ;
		//tmpStr += "<a href='' onclick=\"Astex.Doc.loadMainContent(" + docIndex + "," + (pageIndex-1) + "); return false;\" title=\""+(pageIndex)+". "+doc.pages[pageIndex-1].title+"\">" + "&lt; Previous" + "</a>" ;
		tmpStr += "<a href='#AstexDocTopAnchor' onclick=\"Astex.Doc.loadMainContent(" + docIndex + "," + (pageIndex-1) + ");\" title=\""+(pageIndex)+". "+doc.pages[pageIndex-1].title+"\">" + "&lt; Previous" + "</a>" ;
	}
	else {
		tmpStr += "&lt;&lt; First" ;
		tmpStr += "&nbsp;&nbsp;&nbsp;" ;
		tmpStr += "&lt; Previous" ;
	}

	// space
	tmpStr += "&nbsp;&nbsp;&nbsp;" ;
	//tmpStr += "Page " + (pageIndex+1) + " of " + (maxPageIndex+1) ;
	tmpStr += "Page " ;
	tmpStr += "<select onchange=\"Astex.Doc.loadMainContent(" + docIndex + "," + "this.value-1" + "); return false;\">" ;
	for ( var i = 1 ; i <= (maxPageIndex+1) ; i++ ) {
		// need value attribute below for IE
		if ( i == (pageIndex+1) ) {
			tmpStr += "<option value=\"" + i + "\" selected=\"selected\">" + i + "</option>" ;
		}
		else {
			tmpStr += "<option value=\"" + i + "\">" + i + "</option>" ;
		}
	}
	tmpStr += "</select>" ;
	tmpStr += " of " + (maxPageIndex+1) ;
	tmpStr += "&nbsp;&nbsp;&nbsp;" ;

	// refresh current page
	tmpStr += "&nbsp;&nbsp;&nbsp;" ;
	//tmpStr += "<a href='' onclick=\"Astex.Doc.loadMainContent(" + docIndex + "," + pageIndex + "); return false;\" title=\""+(pageIndex+1)+". "+doc.pages[pageIndex].title+"\">" + "Refresh !" + "</a>" ;
	tmpStr += "<a href='#AstexDocTopAnchor' onclick=\"Astex.Doc.loadMainContent(" + docIndex + "," + pageIndex + ");\" title=\""+(pageIndex+1)+". "+doc.pages[pageIndex].title+"\">" + "Refresh !" + "</a>" ;
	tmpStr += "&nbsp;&nbsp;&nbsp;" ;

	// right arrow
	if ( pageIndex < maxPageIndex ) {
		//tmpStr += "<a href='' onclick=\"Astex.Doc.loadMainContent(" + docIndex + "," + (pageIndex+1) + "); return false;\" title=\""+(pageIndex+2)+". "+doc.pages[pageIndex+1].title+"\">" + "Next &gt;" + "</a>" ;
		tmpStr += "<a href='#AstexDocTopAnchor' onclick=\"Astex.Doc.loadMainContent(" + docIndex + "," + (pageIndex+1) + ");\" title=\""+(pageIndex+2)+". "+doc.pages[pageIndex+1].title+"\">" + "Next &gt;" + "</a>" ;
		tmpStr += "&nbsp;&nbsp;&nbsp;" ;
		//tmpStr += "<a href='' onclick=\"Astex.Doc.loadMainContent(" + docIndex + "," + maxPageIndex + "); return false;\" title=\""+(maxPageIndex+1)+". "+doc.pages[maxPageIndex].title+"\">" + "Last &gt;&gt;" + "</a>" ;
		tmpStr += "<a href='#AstexDocTopAnchor' onclick=\"Astex.Doc.loadMainContent(" + docIndex + "," + maxPageIndex + ");\" title=\""+(maxPageIndex+1)+". "+doc.pages[maxPageIndex].title+"\">" + "Last &gt;&gt;" + "</a>" ;
	}
	else {
		tmpStr += "Next &gt;" ;
		tmpStr += "&nbsp;&nbsp;&nbsp;" ;
		tmpStr += "Last &gt;&gt;" ;
	}

	return tmpStr ;
};

// prototype: Astex.Doc.search ( Int docIndex ) ;
Astex.Doc.search = function ( docIndex ) {

	// get search box
	var search = document.getElementById ( "AstexDocSearchBox" + docIndex ) ;
	search = search.value ;
	//alert ( search ) ;
	//search = search.replace ( /\s*/g , "|" ) ;		// generic OR search
	var re = new RegExp ( search , "gi" ) ;

	// search through doc's pages
	var doc = Astex.Doc.Docs[ docIndex ] ;
	var pages = doc.pages ;

	var links = "" ;

	// add search box
	//links += Astex.Doc.getSearchBoxHTML ( docIndex ) ;
	//links += Astex.Doc.getSiteMapLinkHTML ( docIndex ) ;
	//links += "<br />" ;
	//links += "<br />" ;

	//links += "<h3>Search Results:</h3>" ;
	links += "Your search for <b>" + search + "</b> yielded the following results:" ;
	links += "<br />" ;
	links += "<br />" ;

	links += "<table border=0>" ;

	for ( var p = 0 ; p < pages.length ; p++ ) {

		var title = pages[p].title ;

		var cont = pages[p].content ;
		cont = Astex.Plugin.escapeScript ( cont ) ;
		cont = Astex.Plugin.removeComments ( cont ) ;

		if ( cont.match(re) || title.match(re) ) {

			links += "<tr>" ;
			links += "<td align=\"right\">" ;
			links += "" + (p+1) + "." ;
			links += "&nbsp;&nbsp;&nbsp;" ;
			links += "</td>" ;

			links += "<td>" ;

			// work backwards for parent breadcrumbs
			var level = pages[p].level ;
			var tmp = "" ;
			for ( var pnum = p - 1 ; pnum >= 0 ; pnum-- ) {

				if ( pages[pnum].level < level ) {
					// prepend parent bread crumb
					tmp = pages[pnum].title + "&nbsp;>&nbsp;" + tmp ;
					level-- ;
				}
			}
			links += tmp ;

			// create a link
			//links += "<a href='' onclick=\"Astex.Doc.loadMainContent(" + docIndex + "," + p + "); return false;\">" ;
			links += "<a href='#AstexDocTopAnchor' onclick=\"Astex.Doc.loadMainContent(" + docIndex + "," + p + ");\">" ;
			links += pages[p].title ;
			links += "</a>" ;
			links += "<br />" ;

			links += "</td>" ;
			links += "</tr>" ;

		}
	}

	links += "</table>" ;
 
	var div = document.getElementById ( "AstexDoc-MainContent" + docIndex ) ;
	div.innerHTML = links ;
};

/*--------------------------------------------------------------------------*/
