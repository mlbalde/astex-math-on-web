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
// Astex.Settings class
//

Astex.Settings = { } ;

//
// Astex.Settings class variables
//

Astex.Settings.SettingsDivAdded = false ;
Astex.Settings.ShowSettings = true ;			// variable for toggling settings

//
// Astex.Settings class methods
//

// prototype: void Astex.Settings.processSettings ( HTMLElement node )
Astex.Settings.processSettings = function ( node ) {

	// do this only once
	// add settings control panel to document.body
	if ( ! Astex.Settings.SettingsDivAdded ) {

		var str = "" ;
		str += "<div id=\"AstexSettingsControlPanel\">" ;
		str += "</div>" ;

		var div = document.createElement ( "div" ) ;
		div.innerHTML = str ;
		document.body.insertBefore ( div , document.body.firstChild ) ;

		var cp = document.getElementById ( "AstexSettingsControlPanel" ) ;
		cp.style.display = "none" ;

		Astex.Settings.SettingsDivAdded = true ;
	}

	var str = "" ;

	str += "<div style=\"display:inline;float:right;\">" ;
	str += "<a href=\"\" onclick=\"Astex.Settings.toggleSettings(); return false;\" style=\"text-decoration:none;\" title=\"Close\">X</a>" ;
	str += "</div>" ;

	str += "<br />" ;

	str += "<div>" ;
	str += "ASTEX v" + Astex.version ;
	str += "<br />" ;
	str += "For documentation and sources visit us online at " ;
	str += "<a href=\"http://astex.sourceforge.net\" target=\"_blank\">astex.sourceforge.net</a>." ;
	str += "</div>" ;

	str += "<br />" ;

	str += "<div>Astex MathML Display Options Available</div>" ;

	// firefox only
	if ( Astex.AMath.NativeMathMLEnabled ) {
		if ( Astex.AMath.useNativeMathML ) {
			str += "<input checked=\"checked\" type=\"radio\" name=\"renderer\" onclick=\"Astex.Settings.pickMathMLRenderer('NativeMathML'); Astex.Settings.toggleSettings(); return false;\">Native MathML Display" ;
		}
		else {
			str += "<input type=\"radio\" name=\"renderer\" onclick=\"Astex.Settings.pickMathMLRenderer('NativeMathML'); Astex.Settings.toggleSettings(); return false;\">Native MathML Display" ;
		}
		str += "<br />" ;
	}

	// ie only
	if ( Astex.AMath.MathPlayerEnabled ) {
		if ( Astex.AMath.useMathPlayer ) {
			str += "<input checked=\"checked\" type=\"radio\" name=\"renderer\" onclick=\"Astex.Settings.pickMathMLRenderer('MathPlayer'); Astex.Settings.toggleSettings(); return false;\">Math Player Plugin" ;
		}
		else {
			str += "<input type=\"radio\" name=\"renderer\" onclick=\"Astex.Settings.pickMathMLRenderer('MathPlayer'); Astex.Settings.toggleSettings(); return false;\">Math Player Plugin" ;
		}
		str += "<br />" ;
	}

	// canvas
	if ( ! ( Astex.AMath.useNativeMathML || Astex.AMath.useMathPlayer ) ) {
		str += "<input checked=\"checked\" type=\"radio\" name=\"renderer\" onclick=\"Astex.Settings.pickMathMLRenderer('Canvas'); Astex.Settings.toggleSettings(); return false;\">Astex Canvas MathML Viewer" ;
	}
	else {
		str += "<input type=\"radio\" name=\"renderer\" onclick=\"Astex.Settings.pickMathMLRenderer('Canvas'); Astex.Settings.toggleSettings(); return false;\">Astex Canvas MathML Viewer" ;
	}

	var cp = document.getElementById ( "AstexSettingsControlPanel" ) ;
	cp.innerHTML = str ;

	if ( ! node ) { node = document.body ; }
	var tmpStr = "" ;

	// get divs
	var settings = Astex.Util.getElementsByClass ( node , "div" , "AstexSettings" ) ;
	for ( var i = 0 ; i < settings.length ; i++ ) {
		tmpStr = "<a href=\"\" onclick=\"Astex.Settings.toggleSettings(); return false;\" title=\"open/close control panel\">Settings</a>" ;
		settings[i].innerHTML = tmpStr ;
	}
};

// prototype: void Astex.Settings.pickMathMLRenderer ( String type )
Astex.Settings.pickMathMLRenderer = function ( type ) {

	if ( type == "NativeMathML" ) {
		Astex.AMath.setRenderer ( "Native" ) ;
	}
	else if ( type == "MathPlayer" ) {
		Astex.AMath.setRenderer ( "MathPlayer" ) ;
	}
	else {
		Astex.AMath.setRenderer ( "Canvas" ) ;
	}
};

// prototype: void Astex.Settings.toggleSettings ( )
Astex.Settings.toggleSettings = function ( ) {

	var cp = document.getElementById ( "AstexSettingsControlPanel" ) ;

	if ( Astex.Settings.ShowSettings ) {

		//alert ( "Control" ) ;

		cp.style.display = "block" ;
		cp.style.position = "absolute" ;
		cp.style.left = "10px" ;
		cp.style.right = "10px" ;
		cp.style.width = "500px" ;
		cp.style.height = "250px" ;
		cp.style.left = "10px" ;
		cp.style.overflow = "auto" ;
		cp.style.backgroundColor = "yellow" ;
		cp.style.zIndex = 100 ;

		Astex.Settings.ShowSettings = false ;
		return ;
	}

	cp.style.display = "none" ;
	Astex.Settings.ShowSettings = true ;
};

/*--------------------------------------------------------------------------*/

