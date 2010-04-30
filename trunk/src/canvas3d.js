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




/*--------------------------------------------------------------------------

Astex.Vector, Astex.Scene3D, and Astex.Poly3D are a modification of 
Lutz Tautenhahn's svgvml software found at 

       http://www.lutanho.net/svgvml3d/

The original copyright in the file was:

      // SVG-VML-3D 1.3 by Lutz Tautenhahn 2002-2006
      // The Author grants you a non-exclusive, royalty free, license to use,
      // modify and redistribute this software.
      // This software is provided "as is", without a warranty of any kind.

--------------------------------------------------------------------------*/

//
// Astex.Vector class
//

// prototype: new Astex.Vector ( Float xx , Float yy , Float zz )
Astex.Vector = function ( xx , yy , zz ) {

	// instance variables
	this.x = xx ;
	this.y = yy ;
	this.z = zz ;

};

//
// Astex.Vector instance methods
//

// prototype: void this.Add ( Astex.Vector vv ) 
// add vectors
Astex.Vector.prototype.Add = function ( vv ) {

	// add vector argument to class instance 
	this.x += vv.x ;
	this.y += vv.y ;
	this.z += vv.z ;

};

// prototype: void this.Zoom ( Float ff ) 
// scale vector by a constant
Astex.Vector.prototype.Zoom = function ( ff ) {

	// multiply vector components by argument
	this.x *= ff ;
	this.y *= ff ;
	this.z *= ff ;

};

// prototype: void this.Normalize ( ) 
// normalize vector so length is one
Astex.Vector.prototype.Normalize = function ( ) {

	// compute square of vector length
	var ll = 0 ;
	ll += this.x * this.x ;
	ll += this.y * this.y ;
	ll += this.z * this.z ;

	// divide each component by vector's length
	if ( ll > 0.0 ) {

		ll = Astex.Math.sqrt ( ll ) ;
		this.x /= ll ;
		this.y /= ll ;
		this.z /= ll ;
	}
	else {
		this.x = 1.0 ;
	}

};


/*--------------------------------------------------------------------------*/

//
// Astex.Scene3D class
//

Astex.Scene3D = function ( aParentObj , azIndex , aWidth , aHeight ) {

	// instance variables
	this.Parent = aParentObj ;			// should be an Astex.Canvas instance
	//this.Document = aParentObj.document ;
	this.BoundingBox = null ;

	this.Poly = new Array ( ) ;
	this.PolyRank = new Array ( ) ;
	this.Shape = new Array ( ) ;

	this.zIndex = azIndex ;

	this.Center = new Astex.Vector ( 0.0 , 0.0 , 0.0 ) ;
	this.Zoom = new Astex.Vector ( 1.0 , 1.0 , 1.0 ) ;
	this.OrderWeight = new Astex.Vector ( 1.0 , 1.0 , 1.0 ) ;

	this.ZoomAll = 1.0 ;
	this.ShiftX = 0.0 ;
	this.ShiftY = 0.0 ;

	/*
	if ( useSVG ) {
		this.XM = aWidth / 2 ;
		this.YM = aHeight / 2 ;
	}
	else {
		//this.XM = parseInt ( aParentObj.style.width ) / 2 ;
		//this.YM = parseInt ( aParentObj.style.height ) / 2 ;

		// conditional added by michael (MAZ)
		if ( ! (aWidth == null || aHeight == null ) ) {
			this.XM = aWidth / 2 ;
			this.YM = aHeight / 2 ;
		}
		else {
			this.XM = parseInt ( aParentObj.style.width ) / 2 ;
			this.YM = parseInt ( aParentObj.style.height ) / 2 ;
		}
	}
	*/

	//
	// replacement for above
	//
	this.XM = aWidth / 2 ;
	this.YM = aHeight / 2 ;

	this.Dist = 1000.0 ;
	this.Viewer = new Astex.Vector ( 1000.0 , 0.0 , 0.0 ) ;

	this.Th = 0.0 ;
	this.Fi = 0.0 ;

	this.DiffuseLight = 0.5 ;
	this.Light = new Astex.Vector ( 1.0 , 0.0 , 0.0 ) ;
	this.ThLight = 0.0 ;
	this.FiLight =0.0 ;

	this.sin_Th = 0.0 ;
	this.cos_Th = 1.0 ;
	this.sin_Fi = 0.0 ;
	this.cos_Fi = 1.0 ;

	this.cos_Fi_sin_Th = 0.0 ;
	this.sin_Fi_sin_Th = 0.0 ;
	this.cos_Fi_cos_Th = 1.0 ;
	this.sin_Fi_cos_Th = 0.0 ;

	this.LightTh = 0.0 ;
	this.LightFi = 0.0 ;

  	this.Callback = new Array ( ) ;

	this.LHS = false ;			// left-handed coordinate system

	//
	// MAIN BLOCK
	//

	// call init method and return
	this.Init ( ) ;
	return ( this ) ;
};

//
// Astex.Scene3D instance methods
//

Astex.Scene3D.prototype.Init = function ( ) {

	/*
	if ( useSVG ) {

		this.BoxGroup = this.Parent.GetSVGDoc().createElementNS ( "http://www.w3.org/2000/svg" , "g" ) ;
		this.BoxGroup.setAttribute ( "x" , "0" ) ;
		this.BoxGroup.setAttribute ( "y" , "0" ) ;
		this.BoxGroup.setAttribute ( "width" , this.XM * 2 ) ;
		this.BoxGroup.setAttribute ( "height" , this.YM * 2 ) ;
		this.Parent.GetScene().appendChild ( this.BoxGroup ) ;

		this.PolyGroup = this.Parent.GetSVGDoc().createElementNS ( "http://www.w3.org/2000/svg" , "g" ) ;
		this.PolyGroup.setAttribute ( "x" , "0" ) ;
		this.PolyGroup.setAttribute ( "y" , "0" ) ;
		this.PolyGroup.setAttribute ( "width" , this.XM * 2 ) ;
		this.PolyGroup.setAttribute ( "height" , this.YM * 2 ) ;
		this.Parent.GetScene().appendChild ( this.PolyGroup ) ;  
	}
	else {

		this.BoxGroup = this.Document.createElement ( "v:group" ) ;

		with ( this.BoxGroup.style ) {
			position = "absolute" ;
			top = 0 ;
			left = 0 ;
			width = parseInt ( this.XM * 2 ) ;
			height = parseInt ( this.YM * 2 ) ;
		}

		this.BoxGroup.coordorigin = "0,0" ;
		this.BoxGroup.coordsize = parseInt ( this.XM * 2 ) + "," + parseInt ( this.YM * 2 ) ;
		this.Parent.insertBefore ( this.BoxGroup , null ) ;
		this.PolyGroup = this.Document.createElement ( "v:group" ) ;

    			with ( this.PolyGroup.style ) {
			position = "absolute" ;
			top = 0 ;
			left = 0 ;
			width = parseInt ( this.XM * 2 ) ;
			height = parseInt ( this.YM * 2 ) ;
    			}

		this.PolyGroup.coordorigin = "0,0" ;
		this.PolyGroup.coordsize = parseInt ( this.XM * 2 ) + "," + parseInt ( this.YM * 2 ) ;
		this.Parent.insertBefore ( this.PolyGroup , null ) ;
	}
	*/

};

Astex.Scene3D.prototype.ChangeViewer = function ( ddTh , ddFi ) {

	var pi_d_180 = 3.14159265 / 180 ;

	// change by michael (MAZ)
	/*
	if ( ( this.Th + ddTh >= -89.0 ) && ( this.Th + ddTh <= 89.0 ) ) {

		this.Th += ddTh ;

	}
	*/
	this.Th += ddTh ;			// this replaces the conditional above


	this.Fi += ddFi ;

	while ( this.Fi < 0.0 ) this.Fi += 360.0 ;
	while ( this.Fi>=360.0 ) this.Fi -= 360.0 ;

	this.sin_Th = Math.sin ( this.Th * pi_d_180 ) ;
	this.cos_Th = Math.cos ( this.Th * pi_d_180 ) ;
	this.sin_Fi = Math.sin ( this.Fi * pi_d_180 ) ;
	this.cos_Fi = Math.cos ( this.Fi * pi_d_180 ) ;

	this.cos_Fi_sin_Th = this.cos_Fi * this.sin_Th ;
	this.sin_Fi_sin_Th = this.sin_Fi * this.sin_Th ;
	this.cos_Fi_cos_Th = this.cos_Fi * this.cos_Th ;
	this.sin_Fi_cos_Th = this.sin_Fi * this.cos_Th ;

	this.Viewer.x = this.Center.x + this.cos_Fi_cos_Th * this.Dist ;
	this.Viewer.y = this.Center.y - this.sin_Fi_cos_Th * this.Dist ;
	this.Viewer.z = this.Center.z - this.sin_Th * this.Dist ;

};

Astex.Scene3D.prototype.ChangeLight = function ( ddTh , ddFi ) {

	var pi_d_180 = 3.14159265 / 180 ;

	if ( ( this.ThLight + ddTh >= -89.0 ) && ( this.ThLight + ddTh <= 89.0 ) ) {

		this.ThLight += ddTh ;

	}

	this.FiLight += ddFi ;

	if ( this.ThLight < -89.0 ) this.ThLight = -89.0 ;
	if ( this.ThLight > 89.0 ) this.ThLight = 89.0 ;

	while ( this.FiLight <0.0 ) this.FiLight += 360.0 ;
	while ( this.FiLight >= 360.0 ) this.FiLight -= 360.0 ;

	this.Light.x = Math.cos ( this.FiLight * pi_d_180 ) * Math.cos ( this.ThLight * pi_d_180 ) ;
	this.Light.y =- Math.sin ( this.FiLight * pi_d_180 ) * Math.cos ( this.ThLight * pi_d_180 ) ;
	this.Light.z =- Math.sin ( this.ThLight * pi_d_180 ) ;

};

Astex.Scene3D.prototype.AddPoly = function ( oo ) {

	var ii = this.Poly.length ;
	this.Poly[ii] = oo ;
	this.PolyRank[ii] = new Array ( ii , 0 ) ;

	/*
	if ( useSVG ) {
		this.Shape[ii] = this.Parent.GetSVGDoc().createElementNS ( "http://www.w3.org/2000/svg" , "path" ) ;
		this.Shape[ii].setAttribute ( "z-index" , this.zIndex + ii + 3 ) ;
		this.Parent.GetScene().appendChild ( this.Shape[ii] ) ;
	}
	else {
		this.Shape[ii] = this.Document.createElement ( "v:shape" ) ;
		with ( this.Shape[ii].style ) {
			position = "absolute" ;
			left = 0 ;
			top = 0 ;
			width = this.PolyGroup.style.width ;
			height = this.PolyGroup.style.height ;
			zIndex = this.zIndex + ii + 3 ; //reserve 0..2 for bounding box
		}
		this.PolyGroup.insertBefore ( this.Shape[ii] , null ) ;
	}
	*/

};

Astex.Scene3D.prototype.AutoCenter = function ( ) {

	var ii, jj, vv, xxmin, xxmax, yymin, yymax, zzmin, zzmax ;
	var ll = this.Poly.length ;
	this.Center.Zoom ( 0.0 ) ;

	for ( ii=0 ; ii < ll ; ii++ ) {
		this.Center.Add ( this.Poly[ii].Center ) ;
	}

	if ( ll > 0 ) this.Center.Zoom ( 1.0 / ll ) ;

	xxmin = this.Center.x ;
	xxmax = this.Center.x ;
	yymin = this.Center.y ;
	yymax = this.Center.y ;
	zzmin = this.Center.z ;
	zzmax = this.Center.z ;

	for ( ii = 0 ; ii < ll ; ii++ ) {

		for ( jj = 0 ; jj < this.Poly[ii].Point.length ; jj++ ) {

			vv = this.Poly[ii].Point[jj] ;

			if ( xxmin > vv.x ) xxmin = vv.x ;
			if ( xxmax < vv.x ) xxmax = vv.x ;
			if ( yymin > vv.y ) yymin = vv.y ;
			if ( yymax < vv.y ) yymax = vv.y ;
			if ( zzmin > vv.z ) zzmin = vv.z ;
			if ( zzmax < vv.z ) zzmax = vv.z ;
		}
	}


	xxmax -= xxmin ;
	yymax -= yymin ;
	zzmax -= zzmin ;

	vv = xxmax*xxmax + yymax*yymax + zzmax*zzmax ;

	if ( vv > 0.0 ) ll = Math.sqrt ( vv ) ;
	else ll = 19.0 ;

	if ( this.XM < this.YM ) this.ZoomAll = 1.6 * this.XM / ll ;
	else this.ZoomAll = 1.6 * this.YM / ll ;

	this.Dist = 2 * ll ;
	this.ChangeViewer ( 0 , 0 ) ;

};

Astex.Scene3D.prototype.ScreenPos = function ( vv ) {

	// conditional portion added by michael (MAZ)
	// I was having problem with graphing a 3D sphere using square roots
	// would get error that vv was undefined
	if ( ! vv ) vv = new Astex.Vector ( 0 , 0 , 0 ) ;

	nn = new Astex.Vector ( 0 , 0 , 0 ) ;

	nn.x = this.sin_Fi * ( vv.x - this.Center.x ) + this.cos_Fi * ( vv.y - this.Center.y ) ;
	nn.y = -this.cos_Fi_sin_Th * ( vv.x - this.Center.x ) + this.sin_Fi_sin_Th * ( vv.y - this.Center.y ) - this.cos_Th * ( vv.z - this.Center.z ) ;
	nn.z = this.cos_Fi_cos_Th * ( vv.x - this.Center.x ) - this.sin_Fi_cos_Th * ( vv.y - this.Center.y ) - this.sin_Th * ( vv.z - this.Center.z ) ;

	if ( this.Dist > 0.0 ) {
		nn.x *= this.Dist / ( this.Dist - nn.z ) ;
		nn.y *= this.Dist / ( this.Dist - nn.z ) ;
	}

	//real world to screen:
	nn.Zoom ( this.ZoomAll ) ;
	nn.x += this.XM + this.ShiftX ;
	nn.y += this.YM + this.ShiftY ;

	return (nn) ;

};

Astex.Scene3D.prototype.Sort = function ( ) {

	var ii, ll=this.Poly.length, xx, yy, zz;

	if ( this.Dist == 0.0 ) {

		for ( ii = 0 ; ii < ll ; ii++ ) {

			this.PolyRank[ii][0] = ii ;
			this.PolyRank[ii][1] = this.cos_Fi_cos_Th * this.Poly[ii].Center.x * this.OrderWeight.x
						-this.sin_Fi_cos_Th * this.Poly[ii].Center.y * this.OrderWeight.y
						-this.sin_Th * this.Poly[ii].Center.z * this.OrderWeight.z ;
		}
	}
	else {

		for ( ii = 0 ; ii < ll ; ii++ ) {

			this.PolyRank[ii][0] = ii ;
			xx = this.Poly[ii].Center.x * this.OrderWeight.x - this.Viewer.x ;
			yy = this.Poly[ii].Center.y * this.OrderWeight.y - this.Viewer.y ;
			zz = this.Poly[ii].Center.z * this.OrderWeight.z - this.Viewer.z ;
			this.PolyRank[ii][1] = -xx*xx - yy*yy - zz*zz ;
		}
	}

	this.PolyRank.sort ( Astex.Scene3D.RankSort ) ;


};

// utility function for sorting
Astex.Scene3D.RankSort = function ( ll , rr ) {
	if ( ll[1] > rr[1] ) return ( 1 ) ;
	return ( -1 ) ;
};


Astex.Scene3D.prototype.Draw = function ( ) {

	var ii ;
	var ll = this.Poly.length ;
	this.Light.Normalize ( ) ;

	for ( ii = 0 ; ii < ll ; ii++ ) {
		//this.Poly[ this.PolyRank[ii][0] ].Draw ( this.Shape[ii] ) ;
		this.Poly[ this.PolyRank[ii][0] ].Draw ( ) ;
	}

	if ( this.BoundingBox ) this.BoundingBox.Draw ( ) ;

};

Astex.Scene3D.prototype.Delete = function ( ) {

	var ii, nn, ss ;

	/*
	if ( useSVG ) ss = this.Parent.GetScene ( ) ;
	else ss = this.Parent ;

	nn = ss.childNodes.length ;

	for ( ii = 0 ; ii < nn ; ii++ ) {
		ss.removeChild ( ss.lastChild ) ;
	}
	*/
	this.Parent.clear ( ) ;				// clear the Astex.Canvas instance

	this.BoundingBox = null ;
	this.Poly.length = 0 ;
	this.PolyRank.length = 0 ;
	this.Shape.length = 0 ;
	this.Callback.length = 0 ;  

};

Astex.Scene3D.prototype.ZoomUpdate = function ( ) {

	var ii ;
	var ll = this.Poly.length ;

	for ( ii = 0 ; ii < ll ; ii++ ) {
		this.Poly[ii].ZoomUpdate ( ) ;
	}

};

Astex.Scene3D.prototype.GetColor = function ( cc0 , cc1 , nn , pp ) {

	var rr, gg, bb, hh = "0123456789abcdef" ;
	var zz, vv ;

	if ( this.Dist == 0.0 ) {
		zz = -this.cos_Fi_cos_Th * nn.x + this.sin_Fi_cos_Th * nn.y + this.sin_Th * nn.z ;
	}
	else {
		zz = ( pp.x - this.Viewer.x ) * nn.x + ( pp.y - this.Viewer.y ) * nn.y + ( pp.z - this.Viewer.z ) * nn.z ;
	}

	if ( this.DiffuseLight == 1.0 ) {
		if ( zz > 0 ) return ( cc0 ) ;
		else return ( cc1 ) ;
	}

	vv = nn.x * this.Light.x + nn.y * this.Light.y + nn.z * this.Light.z ;

	if ( zz > 0 ) {
		vv *= -1 ;
		rr = parseInt ( cc0.substr(1,2) , 16 ) ;
		gg = parseInt ( cc0.substr(3,2) , 16 ) ;
		bb = parseInt ( cc0.substr(5,2) , 16 ) ;
	}
	else {
		rr = parseInt ( cc1.substr(1,2) , 16 ) ;
		gg = parseInt ( cc1.substr(3,2) , 16 ) ;
		bb = parseInt ( cc1.substr(5,2) , 16 ) ;
	}

	if ( vv <= 0 ) {
		rr = Math.floor ( rr * this.DiffuseLight ) ; 
		gg = Math.floor ( gg * this.DiffuseLight ) ;
		bb = Math.floor ( bb * this.DiffuseLight ) ;
	}
	else {
		rr = Math.floor ( rr * ( vv * ( 1 - this.DiffuseLight ) + this.DiffuseLight ) ) ; 
		gg = Math.floor ( gg * ( vv * ( 1 - this.DiffuseLight ) + this.DiffuseLight ) ) ; 
		bb = Math.floor ( bb * ( vv * ( 1 - this.DiffuseLight ) + this.DiffuseLight ) ) ; 
	}

	var ss = "#" ;
	ss += hh.charAt ( Math.floor ( rr / 16 ) ) + hh.charAt ( rr % 16 ) ;
	ss += hh.charAt ( Math.floor ( gg / 16 ) ) + hh.charAt ( gg % 16 ) ;
	ss += hh.charAt ( Math.floor ( bb / 16 ) ) + hh.charAt ( bb % 16 ) ;

	return ( ss ) ;

};



/*--------------------------------------------------------------------------*/

//
// Astex.Poly3D class
//

Astex.Poly3D = function ( aParentScene , aFrontColor , aBackColor , aStrokeColor , aStrokeWeight , aOpacity ) {

	// instance variables
	this.Parent = aParentScene ;
	this.ClassName = "Astex.Poly3D" ;
	this.PhPoint = new Array ( ) ;
	this.Point = new Array ( ) ;
	this.Center = new Astex.Vector ( 0.0 , 0.0 , 0.0 ) ;
	this.Normal = new Astex.Vector ( 1.0 , 0.0 , 0.0 ) ;
	this.FrontColor = aFrontColor ;
	this.BackColor = aBackColor ;
	this.StrokeColor = aStrokeColor ;
	this.StrokeWeight = aStrokeWeight ;
	this.Visibility = "visible" ;
	this.Id = "" ;
	this.Callback = new Array ( ) ;
	this.Opacity = (! aOpacity) ? 1 : aOpacity ;

	//
	// MAIN BLOCK
	//

	// add poly to the parent ( which is a Astex.Scene3D object )
	this.Parent.AddPoly ( this ) ;  

};	// end Astex.Poly3D class

//
// Astex.Poly3D class variables
//
Astex.Poly3D.LHS = false ;

//
// Astex.Poly3D instance methods
//

Astex.Poly3D.prototype.AddPoint = function ( xx , yy , zz ) {

	// are these necessary ???
	//if ( !xx || typeof xx != "number" || !yy || typeof yy != "number" || !zz || typeof zz != "number" ) { return ; }
	//if ( xx == Infinity || yy == Infinity || zz == Infinity ) { return ; }
	//if ( isNaN(xx) || isNaN(yy) || isNaN(zz) ) { return ; }

	vv = this.Parent.Zoom ;

	if ( this.Parent.LHS ) {	// if scene is left-handed coordinate system
		var tmp = xx ;
		xx = yy ;
		yy = tmp ;
	}

	this.PhPoint[ this.PhPoint.length ] = new Astex.Vector ( xx , yy , zz ) ;
	this.Point[ this.Point.length ] = new Astex.Vector ( xx * vv.x , yy * vv.y , zz * vv.z ) ;
};

Astex.Poly3D.prototype.SetPoint = function ( ii , xx , yy , zz ) {

	vv = this.Parent.Zoom ;

	this.PhPoint[ii].x = xx ;
	this.PhPoint[ii].y = yy ;	// originally had comma instead of semi-colon
	this.PhPoint[ii].z = zz ;

	this.Point[ii].x = xx * vv.x ;
	this.Point[ii].y = yy * vv.y ;		// originally had comma instead of semi-colon
	this.Point[ii].z = zz * vv.z ;
};

Astex.Poly3D.prototype.Zoom = function ( ff ) {

	for ( var ii = 0 ; ii < this.PhPoint.length ; ii++ ) {
		this.PhPoint[ii].Zoom ( ff ) ;
	}

	for (var ii = 0 ; ii < this.Point.length ; ii++ ) {
		this.Point[ii].Zoom ( ff ) ;
	}

	this.Update ( ) ;
};

Astex.Poly3D.prototype.Shift = function ( xx , yy , zz ) {

	vv = this.Parent.Zoom ;

	for ( var ii = 0 ; ii < this.PhPoint.length ; ii++ ) {

		this.PhPoint[ii].x += xx ;
		this.PhPoint[ii].y += yy ;
		this.PhPoint[ii].z += zz ;
	}

	for (var ii=0 ; ii < this.Point.length ; ii++ ) {

		this.Point[ii].x += xx * vv.x ;
		this.Point[ii].y += yy * vv.y ;
		this.Point[ii].z += zz * vv.z ;
	}

	this.Center.x += xx * vv.x ;
	this.Center.y += yy * vv.y ;
	this.Center.z += zz * vv.z ;
};

Astex.Poly3D.prototype.Update = function ( ) {

	var ii ;
	var ll = this.Point.length ;

	// do i need this ???
	//if ( ll == 0 ) { return ; }

	this.Center.Zoom ( 0.0 ) ;

	for ( ii = 0 ; ii < ll ; ii++ ) {
		this.Center.Add ( this.Point[ii] ) ;
	}

	this.Center.Zoom ( 1.0 / ll ) ;

	if ( ll > 2 ) {

		var xx0 = this.Point[0].x - this.Center.x ;
		var yy0 = this.Point[0].y - this.Center.y ;
		var zz0 = this.Point[0].z - this.Center.z ;

		var xx1 = this.Point[1].x - this.Center.x ;
		var yy1 = this.Point[1].y - this.Center.y ;
		var zz1 = this.Point[1].z - this.Center.z ;

		this.Normal.x = yy0 * zz1 - zz0 * yy1 ;
		this.Normal.y = zz0 * xx1 - xx0 * zz1 ;
		this.Normal.z = xx0 * yy1 - yy0 * xx1 ;

		this.Normal.Normalize ( ) ;
	}
};

Astex.Poly3D.prototype.Draw = function ( aShape ) {

	var ii, ss, ll = this.Point.length ;

	// replacement
	var scene = this.Parent ;
	var canvas = scene.Parent ;
	var jscanvas = canvas.canvas ;

	canvas.setOpacity ( this.Opacity ) ;

	var X = new Array ( ) ;
	var Y = new Array ( ) ;
	for ( ii = 0 ; ii < ll ; ii++ ) {
		vv = this.Parent.ScreenPos ( this.Point[ii] ) ;
		X.push ( parseInt ( vv.x ) ) ;
		Y.push ( parseInt ( vv.y ) ) ;
	}
	//jscanvas.drawPolyLine ( X , Y ) ;
	//jscanvas.drawPolygon ( X , Y ) ;

	if ( ( ll >= 3 ) && ( this.FrontColor != "" ) ) {
		//var tmpColor = this.Parent.GetColor ( this.FrontColor , this.BackColor , this.Normal , this.Center ) ;
		var tmpColor ;
		if ( this.Parent.LHS ) {	// swap back and front colors if scene is left-handed coordinate system
			tmpColor = this.Parent.GetColor ( this.BackColor , this.FrontColor , this.Normal , this.Center ) ;
		}
		else {
			tmpColor = this.Parent.GetColor ( this.FrontColor , this.BackColor , this.Normal , this.Center ) ;
		}
		canvas.setColor ( tmpColor ) ;
		jscanvas.fillPolygon ( X , Y ) ;
	}
	// draw the wire frame
	if ( this.StrokeColor != "" ) {
		canvas.setStroke ( this.StrokeWeight ) ;
		canvas.setColor ( this.StrokeColor ) ;
		jscanvas.drawPolygon ( X , Y ) ;
	}

	/*
	var vv = this.Parent.ScreenPos ( this.Point[0] ) ;

	if ( useSVG ) {

		aShape.setAttribute ( "visibility" , this.Visibility ) ;
		ss = "M " + parseInt ( vv.x ) + " " + parseInt ( vv.y ) + " " ;

		for ( ii = 1 ; ii < ll ; ii++ ) {
			vv = this.Parent.ScreenPos ( this.Point[ii] ) ;
			ss += "L " + parseInt ( vv.x ) + " " + parseInt ( vv.y ) + " " ;
		}

		ss += "z" ;
		aShape.setAttribute ( "d" , ss ) ;

		if ( ( ll >= 3 ) && ( this.FrontColor != "" ) ) {
			var tmpColor = this.Parent.GetColor ( this.FrontColor , this.BackColor , this.Normal , this.Center ) ;
			aShape.setAttribute ( "fill" , tmpColor ) ;
		}
		else {
			aShape.setAttribute ( "fill" , "none" ) ;
		}

		if ( this.StrokeColor ) {
			aShape.setAttribute ( "stroke" , this.StrokeColor ) ;
		}
		else {
			var tmpColor = this.Parent.GetColor ( this.FrontColor , this.BackColor , this.Normal , this.Center ) ;
			aShape.setAttribute ( "stroke" , tmpColor ) ;
		}

		aShape.setAttribute ( "stroke-width" , parseInt ( this.StrokeWeight ) ) ; 
		aShape.id = this.Id ;

		for ( var jj in this.Parent.Callback ) {
			aShape.removeEventListener ( jj , this.Parent.Callback[jj] , false ) ;
			if ( this.Callback[jj] ) aShape.addEventListener ( jj , this.Callback[jj] , false ) ;
		}
	}
	else {

		if ( this.Visibility == "visible" ) {

			ss = "m " + parseInt ( vv.x ) + "," + parseInt ( vv.y ) + " l" ;

			for ( ii=1 ; ii < ll -1 ; ii++ ) {

				vv = this.Parent.ScreenPos ( this.Point[ii] ) ;
				ss += " " + parseInt ( vv.x ) + "," + parseInt ( vv.y ) + "," ;
			}

			vv = this.Parent.ScreenPos ( this.Point[ii] ) ;
			ss += " " + parseInt ( vv.x ) + "," + parseInt ( vv.y ) + " x e" ;
			aShape.path = ss ;

			if ( ( ll >= 3 ) && ( this.FrontColor != "" ) ) {
				aShape.fillcolor = this.Parent.GetColor ( this.FrontColor , this.BackColor , this.Normal , this.Center ) ;
				aShape.filled = true ;
			}
			else {
				aShape.filled = false ;
			}

			if ( this.StrokeColor ) {
				aShape.strokecolor = this.StrokeColor ;
			}
			else {
				aShape.strokecolor = this.Parent.GetColor ( this.FrontColor , this.BackColor , this.Normal , this.Center ) ;
			}

			aShape.strokeweight = parseInt ( this.StrokeWeight ) ;
		}
		else {
			aShape.path = "m 0,0 l x e" ;
			aShape.strokeweight = 0 ;
			aShape.filled = false ;
		}

		aShape.id = this.Id ;

		for ( var jj in this.Parent.Callback ) {

			if ( this.Callback[jj] ) aShape["on"+jj] = this.Callback[jj] ;
			else aShape["on"+jj] = "" ;
		}

	}
	*/


};

Astex.Poly3D.prototype.ZoomUpdate = function ( ) {

	var ii, ll = this.Point.length, vv = this.Parent.Zoom ;

	for ( ii = 0 ; ii < ll ; ii++ ) {

		this.Point[ii].x = this.PhPoint[ii].x * vv.x ;
		this.Point[ii].y = this.PhPoint[ii].y * vv.y ;		// originally was a comma instead of a semi-colon
		this.Point[ii].z = this.PhPoint[ii].z * vv.z ;
	}

	this.Update();
};

Astex.Poly3D.prototype.SetOpacity = function ( op ) {

	this.Opacity = op ;
};

/*--------------------------------------------------------------------------*/

//
// Astex.Canvas3D class
//

// prototype: new Astex.Canvas3D ( Astex.Canvas canvas )
Astex.Canvas3D = function ( canvas , xmin , xmax , xscale , ymin , ymax , yscale , zmin , zmax , zscale ) {

	this.scene3d = new Astex.Scene3D ( canvas , 1 , canvas.window.width , canvas.window.height ) ;

	this.canvas = canvas ;

	this.xmin = ! xmin ? -10 : xmin ;
	this.xmax = ! xmax ? 10 : xmax ;
	this.xscale = ! xscale ? 1 : xscale ;
	//this.xstep = (this.xmax-this.xmin)/this.window.width ;
	//this.xstep = (this.xmax-this.xmin)/Astex.Math.max(canvas.window.width,canvas.window.height) ;
	this.ymin = ! ymin ? -10 : ymin ;
	this.ymax = ! ymax ? 10 : ymax ;
	this.yscale = ! yscale ? 1 : yscale ;
	//this.ystep = (this.ymax-this.ymin)/this.window.height ;
	//this.ystep = (this.ymax-this.ymin)/Astex.Math.max(canvas.window.width,canvas.window.height) ;
	this.zmin = ! zmin ? -10 : zmin ;
	this.zmax = ! zmax ? 10 : zmax ;
	this.zscale = ! zscale ? 1 : zscale ;
	//this.zstep = (this.zmax-this.zmin)/this.window.height ;
	//this.zstep = (this.zmax-this.zmin)/Astex.Math.max(canvas.window.width,canvas.window.height) ;

	var m = Astex.Math ;

	this.rmin = 0 ;
	this.rmax = m.sqrt ( m.pow(m.min(m.abs(this.xmin),m.abs(this.xmax)),2) + m.pow(m.min(m.abs(this.ymin),m.abs(this.ymax)),2) ) ;

	this.thetamin = 0 ;
	this.thetamax = 2 * m.pi ;

	this.rhomin = 0 ;
	this.rhomax = m.sqrt ( m.pow(m.max(m.abs(this.xmin),m.abs(this.xmax)),2) + m.pow(m.max(m.abs(this.ymin),m.abs(this.ymax)),2) + m.pow(m.max(m.abs(this.zmin),m.abs(this.zmax)),2) ) ;

	this.phimin = 0 ;
	this.phimax = m.pi ;

	this.xpartition = 2 * parseInt ( 10 / this.xscale ) ;
	this.ypartition = 2 * parseInt ( 10 / this.yscale ) ;
	this.zpartition = 2 * parseInt ( 10 / this.zscale ) ;
	//this.xpartition = parseInt ( 5 / this.xscale ) ;
	//this.ypartition = parseInt ( 5 / this.yscale ) ;
	//this.zpartition = parseInt ( 5 / this.zscale ) ;

	this.rpartition = 10 ;
	this.thetapartition = 10 ;

	this.rhopartition = 10 ;
	this.phipartition = 10 ;

	this.spartition = 10 ;
	this.tpartition = 10 ;

	//this.frontColor = "#ff6666" ;
	//this.backColor = "#6666ff" ;
	this.frontColor = "" ;
	this.backColor = "" ;
	this.strokeColor = "#808080" ;
	this.strokeWeight = 1 ;

	this.opacity = 1 ;

	this.viewerzoomed = 0 ;
	this.picturezoomed = 0 ;

	this.canvasIndex = Astex.Canvas3D.Canvases.length ;
	Astex.Canvas3D.Canvases.push ( this ) ;
};

//
// Astex.Canvas3D class variables
//
Astex.Canvas3D.Canvases = new Array ( ) ;

//
// Astex.Canvas3D instance methods
//


// prototype: this.setCoordSys ( String cs )
Astex.Canvas3D.prototype.setCoordSys = function ( cs ) {

	if ( cs.match(/LHS/i) ) {
		this.scene3d.LHS = true ;
	}
	else if ( cs.match(/RHS/i) ) {
		this.scene3d.LHS = false ;
	}
	else {
		this.scene3d.LHS = false ;
	}
};

// prototype: this.setPartitions ( Int one , Int two , Int three )
Astex.Canvas3D.prototype.setPartitions = function ( one , two , three ) {

	if ( ! one || typeof one != "number" ) { one = 1 ; }
	if ( ! two || typeof two != "number" ) { two = 1 ; }
	if ( ! three || typeof three != "number" ) { three = 1 ; }

	// rect ( x , y , z )
	this.xpartition = parseInt ( one ) ;
	this.ypartition = parseInt ( two ) ;
	this.zpartition = parseInt ( three ) ;

	// cyl ( r , theta , z )
	this.rpartition = parseInt ( one ) ;
	this.thetapartition = parseInt ( two ) ;
	//this.zpartition = parseInt ( three ) ;

	// shp ( rho , theta , phi )
	this.rhopartition = parseInt ( one ) ;
	//this.thetapartition = parseInt ( two ) ;
	this.phipartition = parseInt ( three ) ;

	// parametric surfaces and vector-valued functions
	this.spartition = parseInt ( Astex.Math.max ( one , Astex.Math.max ( two , three ) ) ) ;
	this.tpartition = this.spartition ;
};

// prototype: this.setOpacity ( Float opacity )
Astex.Canvas3D.prototype.setOpacity = function ( opacity ) {
	//this.canvas.setOpacity ( opacity ) ;
	this.opacity = opacity ;
};

// prototype: this.setStrokeWeight ( Int weight )
Astex.Canvas3D.prototype.setStrokeWeight = function ( weight ) {
	if ( typeof weight != "number" ) { weight = 1 ; }
	this.strokeWeight = parseInt ( weight ) ;
};

// prototype: this.setStrokeColor ( String strokeColor )
Astex.Canvas3D.prototype.setStrokeColor = function ( strokeColor ) {
	//this.strokeColor = ( ! strokeColor ) ? "#808080" : strokeColor ;
	this.strokeColor = ( ! strokeColor ) ? "" : strokeColor ;
};

// prototype: this.setSurfaceColor ( String frontColor , String backColor )
Astex.Canvas3D.prototype.setSurfaceColor = function ( frontColor , backColor ) {
	//this.frontColor = ( ! frontColor ) ? "" : frontColor ;
	//this.backColor = ( ! backColor ) ? "" : backColor ;

	if ( ! frontColor ) { frontColor = "" ; }
	if ( ! backColor ) { backColor = "" ; }

	frontColor = Astex.Util.colorString2HexString ( frontColor ) ;
	backColor = Astex.Util.colorString2HexString ( backColor ) ;

	this.frontColor = frontColor ;
	this.backColor = backColor ;
};

// prototype: this.autoCenter ( )
Astex.Canvas3D.prototype.autoCenter = function ( ) { 
	this.scene3d.AutoCenter ( ) ;
};

// prototype: this.changeViewer ( Float theta , Float phi )
Astex.Canvas3D.prototype.changeViewer = function ( theta , phi ) { 
	this.scene3d.ChangeViewer ( theta , phi ) ;
};

// prototype: this.changeLight ( Float theta , Float phi )
Astex.Canvas3D.prototype.changeLight = function ( theta , phi ) { 
	this.scene3d.ChangeLight ( theta , phi ) ;
};

// prototype: this.orderWeight ( Float x , Float y , Float z )
Astex.Canvas3D.prototype.orderWeight = function ( x , y , z ) { 
	if ( x != null ) { this.scene3d.OrderWeight.x = x ; }
	if ( y != null ) { this.scene3d.OrderWeight.y = y ; }
	if ( z != null ) { this.scene3d.OrderWeight.z = z ; }
};

// prototype: this.draw ( )
Astex.Canvas3D.prototype.draw = function ( ) { 
	this.scene3d.Sort ( ) ;
	this.scene3d.Draw ( ) ;
};

// prototype: this.clear ( )
Astex.Canvas3D.prototype.clear = function ( ) { 
	this.canvas.clear ( ) ;
};

// prototype: this.paint ( )
Astex.Canvas3D.prototype.paint = function ( ) { 
	this.canvas.paint ( ) ;
};

// prototype: this.fillBackground ( )
Astex.Canvas3D.prototype.fillBackground = function ( ) { 
	this.canvas.fillBackground ( ) ;
};

// prototype: this.drawString ( String str , Float x , Float y , Float z )
Astex.Canvas3D.prototype.drawString = function ( str , x , y , z ) {

	//alert ( str + " " + x + " " + y + " " + z ) ;
	var pos = this.scene3d.ScreenPos ( new Astex.Vector ( x , y , z ) ) ;
	//alert ( pos.x + " " + pos.y ) ;
	var jscanvas = this.canvas.canvas ;
	//alert ( jscanvas ) ;
	jscanvas.drawString ( str , parseInt(pos.x) , parseInt(pos.y) ) ;
};

// prototype: this.replaceIFrame ( )
// this is used in buttons for 3d graphs to move and rotate
// this is really only needed by IE since original iframe was not affected when viewer position changed
// we needed to replace the original --- probably has to do with how iframe content was written to it
// in Astex.Window.prototype.insertWindow()
Astex.Canvas3D.prototype.replaceIFrame = function ( ) { 
	this.canvas.window.insertWindow ( this.canvas.window.iframe.parentNode , this.canvas.window.iframe ) ;
};

// prototype: Boolean this.boxContainsPoint ( Float x , Float y , Float z )
Astex.Canvas3D.prototype.boxContainsPoint = function ( x , y , z ) { 

	if ( x < this.xmin ) { return false ; }
	if ( x > this.xmax ) { return false ; }
	if ( y < this.ymin ) { return false ; }
	if ( y > this.ymax ) { return false ; }
	if ( z < this.zmin ) { return false ; }
	if ( z > this.zmax ) { return false ; }

	return true ;
};

// prototype: this.drawVectorValuedFunction ( String xt , String yt , String zt , Float tmin , Float tmax )
Astex.Canvas3D.prototype.drawVectorValuedFunction = function ( xt , yt , zt , tmin , tmax ) { 

	xt = Astex.Math.ascii2JS ( xt ) ;
	yt = Astex.Math.ascii2JS ( yt ) ;
	zt = Astex.Math.ascii2JS ( zt ) ;

	tpartition = this.tpartition ;

	var x0 , y0 , z0 , x , y , z ;
	var t = tmin ;
	var tstep = ( tmax - tmin ) / tpartition ;

	while ( t < tmax ) {

		// first point
		x0 = eval ( xt ) ;
		y0 = eval ( yt ) ;
		z0 = eval ( zt ) ;

		// increment tstep
		t += tstep ;

		// next point
		x = eval ( xt ) ;
		y = eval ( yt ) ;
		z = eval ( zt ) ;

		// draw line between first and next point
		this.drawLine ( new Astex.Vector ( x0 , y0 , z0 ) , new Astex.Vector ( x , y , z ) ) ;
	}
};

// prototype: this.drawLine ( Astex.Vector one , Astex.Vector two )
Astex.Canvas3D.prototype.drawLine = function ( one , two ) { 

	var poly = new Astex.Poly3D ( this.scene3d , this.frontColor , this.backColor , this.strokeColor , this.strokeWeight , this.opacity ) ;
	poly.AddPoint ( one.x , one.y , one.z ) ;
	poly.AddPoint ( two.x , two.y , two.z ) ;
	poly.Update ( ) ;
};

// prototype: this.drawAxes ( )
Astex.Canvas3D.prototype.drawAxes = function ( ) { 

	this.drawLine ( new Astex.Vector(this.xmin,0,0) , new Astex.Vector(this.xmax,0,0) ) ;
	this.drawLine ( new Astex.Vector(0,this.ymin,0) , new Astex.Vector(0,this.ymax,0) ) ;
	this.drawLine ( new Astex.Vector(0,0,this.zmin) , new Astex.Vector(0,0,this.zmax) ) ;
};

// prototype: this.drawAxesLabels ( String xLabel , String yLabel , String zLabel )
// this should be called after the 3d canvas has been drawn to ensure proper
// viewports have been set up
Astex.Canvas3D.prototype.drawAxesLabels = function ( xLabel , yLabel , zLabel ) { 

	if ( ! xLabel || xLabel == "" ) { xLabel = "x" ; }
	if ( ! yLabel || yLabel == "" ) { yLabel = "y" ; }
	if ( ! zLabel || zLabel == "" ) { zLabel = "z" ; }

	this.drawString ( xLabel , this.xmax , 0 , 0 ) ;
	this.drawString ( yLabel , 0 , this.ymax , 0 ) ;
	this.drawString ( zLabel , 0 , 0 , this.zmax ) ;
};

// prototype: this.drawBox ( )
Astex.Canvas3D.prototype.drawBox = function ( ) { 

	/*
	*/
	this.drawLine ( new Astex.Vector(this.xmin,this.ymin,this.zmin) , new Astex.Vector(this.xmin,this.ymin,this.zmax) ) ;
	this.drawLine ( new Astex.Vector(this.xmin,this.ymin,this.zmin) , new Astex.Vector(this.xmin,this.ymax,this.zmin) ) ;
	this.drawLine ( new Astex.Vector(this.xmin,this.ymin,this.zmin) , new Astex.Vector(this.xmax,this.ymin,this.zmin) ) ;

	this.drawLine ( new Astex.Vector(this.xmax,this.ymax,this.zmin) , new Astex.Vector(this.xmax,this.ymax,this.zmax) ) ;
	this.drawLine ( new Astex.Vector(this.xmax,this.ymax,this.zmin) , new Astex.Vector(this.xmax,this.ymin,this.zmin) ) ;
	this.drawLine ( new Astex.Vector(this.xmax,this.ymax,this.zmin) , new Astex.Vector(this.xmin,this.ymax,this.zmin) ) ;

	this.drawLine ( new Astex.Vector(this.xmin,this.ymax,this.zmax) , new Astex.Vector(this.xmin,this.ymax,this.zmin) ) ;
	this.drawLine ( new Astex.Vector(this.xmin,this.ymax,this.zmax) , new Astex.Vector(this.xmax,this.ymax,this.zmax) ) ;
	this.drawLine ( new Astex.Vector(this.xmin,this.ymax,this.zmax) , new Astex.Vector(this.xmin,this.ymin,this.zmax) ) ;

	this.drawLine ( new Astex.Vector(this.xmax,this.ymin,this.zmax) , new Astex.Vector(this.xmin,this.ymin,this.zmax) ) ;
	this.drawLine ( new Astex.Vector(this.xmax,this.ymin,this.zmax) , new Astex.Vector(this.xmax,this.ymax,this.zmax) ) ;
	this.drawLine ( new Astex.Vector(this.xmax,this.ymin,this.zmax) , new Astex.Vector(this.xmax,this.ymin,this.zmin) ) ;

	/*
	var fcolor = this.frontColor ;
	var bcolor = this.backColor ;
	this.setSurfaceColor ( "" , "" ) ;
	this.drawRectSurface ( "z" , "" + this.zmin ) ;
	this.drawRectSurface ( "z" , "" + this.zmax ) ;
	this.drawRectSurface ( "y" , "" + this.ymin ) ;
	this.drawRectSurface ( "y" , "" + this.ymax ) ;
	this.drawRectSurface ( "x" , "" + this.xmin ) ;
	this.drawRectSurface ( "x" , "" + this.xmax ) ;
	this.setSurfaceColor ( fcolor , bcolor ) ;
	*/
};

// prototype: this.drawRectSurface ( String depVar , String f , String domain )
Astex.Canvas3D.prototype.drawRectSurface = function ( depVar , f , domain ) { 

	f = Astex.Math.ascii2JS ( f ) ;

	if ( ! domain || domain == "" ) { domain = "true" ; }
	domain = Astex.Math.ascii2JS ( domain ) ;
	//alert ( domain ) ;
	//alert ( typeof domain ) ;

	var min = new Astex.Vector ( this.xmin , this.ymin , this.zmin ) ;
	var max = new Astex.Vector ( this.xmax , this.ymax , this.zmax ) ;

	var xmin, xmax, ymin, ymax, zmin, zmax, x0, x1, y0, y1, z, x, y;

	xmin = min.x ;
	ymin = min.y ;
	zmin = min.z ;

	xmax = max.x ;
	ymax = max.y ;
	zmax = max.z ;

	var n_x = this.xpartition ;
	var n_y = this.ypartition ;
	var n_z = this.zpartition ;


	if ( depVar == "z" ) {

		var zPoly = new Array ( ) ;
		x = xmin ;
		y = ymin ;
		//z = eval ( f ) ;
		//alert ( typeof eval(domain) ) ;
		//alert ( eval("x<10") ) ;
		zmin = eval ( f ) ;
		zmax = zmin ;
		for ( var i = 0 ; i < n_x ; i++ ) {
			zPoly[i] = new Array ( ) ;
			x0 = xmin + i * ( xmax - xmin ) / n_x ;
			x1 = xmin + ( i + 1 ) * ( xmax - xmin ) / n_x ;
			for ( var j = 0 ; j < n_y ; j++ ) {
				y0 = ymin + j * ( ymax - ymin ) / n_y ;
				y1 = ymin + ( j + 1 ) * ( ymax - ymin ) / n_y ;
				zPoly[i][j] = new Astex.Poly3D ( this.scene3d , this.frontColor , this.backColor , this.strokeColor , this.strokeWeight , this.opacity ) ;
				//z = f ( x0 , y1 ) ;
				x = x0 ;
				y = y1 ;
				z = eval ( f ) ;
				//if ( this.zmin > z ) { this.zmin = z ; }
				//if ( this.zmax < z ) { this.zmax = z ; }
				if ( eval ( domain ) && !isNaN(z) && z != Infinity ) {
				//if ( eval ( domain ) && this.boxContainsPoint(x0,y1,z) ) {
				//if ( z >= this.zmin && z <= this.zmax ) {
					zPoly[i][j].AddPoint ( x0 , y1 , z ) ;
				}
				//z = f ( x1 , y1 ) ;
				x = x1 ;
				y = y1 ;
				z = eval ( f ) ;
				//if ( this.zmin > z ) { this.zmin = z ; }
				//if ( this.zmax < z ) { this.zmax = z ; }
				//if ( eval ( domain ) ) {
				if ( eval ( domain ) && !isNaN(z) && z != Infinity ) {
				//if ( eval ( domain ) && this.boxContainsPoint(x1,y1,z) ) {
				//if ( z >= this.zmin && z <= this.zmax ) {
					zPoly[i][j].AddPoint ( x1 , y1 , z ) ;
				}
				//z = f ( x1 , y0 ) ;
				x = x1 ;
				y = y0 ;
				z = eval ( f ) ;
				//if ( this.zmin > z ) { this.zmin = z ; }
				//if ( this.zmax < z ) { this.zmax = z ; }
				//if ( eval ( domain ) ) {
				if ( eval ( domain ) && !isNaN(z) && z != Infinity ) {
				//if ( eval ( domain ) && this.boxContainsPoint(x1,y0,z) ) {
				//if ( z >= this.zmin && z <= this.zmax ) {
					zPoly[i][j].AddPoint ( x1 , y0 , z ) ;
				}
				//z = f ( x0 , y0 ) ;
				x = x0 ;
				y = y0 ;
				z = eval ( f ) ;
				//if ( this.zmin > z ) { this.zmin = z ; }
				//if ( this.zmax < z ) { this.zmax = z ; }
				//if ( eval ( domain ) ) {
				if ( eval ( domain ) && !isNaN(z) && z != Infinity ) {
				//if ( eval ( domain ) && this.boxContainsPoint(x0,y0,z) ) {
				//if ( z >= this.zmin && z <= this.zmax ) {
					zPoly[i][j].AddPoint ( x0 , y0 , z ) ;
				}
				zPoly[i][j].Update ( ) ;
			}
		}
	}
	else if ( depVar == "y" ) {

		var yPoly = new Array ( ) ;
		x = xmin ;
		z = zmin ;
		ymin = eval ( f ) ;
		ymax = ymin ;
		for ( var i = 0 ; i < n_x ; i++ ) {
			yPoly[i] = new Array ( ) ;
			x0 = xmin + i * ( xmax - xmin ) / n_x ;
			x1 = xmin + ( i + 1 ) * ( xmax - xmin ) / n_x ;
			for ( var j = 0 ; j < n_z ; j++ ) {
				z0 = zmin + j * ( zmax - zmin ) / n_z ;
				z1 = zmin + ( j + 1 ) * ( zmax - zmin ) / n_z ;
				yPoly[i][j] = new Astex.Poly3D ( this.scene3d , this.frontColor , this.backColor , this.strokeColor , this.strokeWeight , this.opacity ) ;
				//z = f ( x0 , y1 ) ;
				x = x0 ;
				z = z1 ;
				y = eval ( f ) ;
				//if ( ymin > y ) { ymin = y ; }
				//if ( ymax < y ) { ymax = y ; }
				if ( eval ( domain ) && !isNaN(y) && y != Infinity ) {
					yPoly[i][j].AddPoint ( x0 , y , z1 ) ;
				}
				//z = f ( x1 , y1 ) ;
				x = x1 ;
				z = z1 ;
				y = eval ( f ) ;
				//if ( ymin > y ) { ymin = y ; }
				//if ( ymax < y ) { ymax = y ; }
				if ( eval ( domain ) && !isNaN(y) && y != Infinity ) {
					yPoly[i][j].AddPoint ( x1 , y , z1 ) ; 
				}
				//z = f ( x1 , y0 ) ;
				x = x1 ;
				z = z0 ;
				y = eval ( f ) ;
				//if ( ymin > y ) { ymin = y ; }
				//if ( ymax < y ) { ymax = y ; }
				if ( eval ( domain ) && !isNaN(y) && y != Infinity ) {
					yPoly[i][j].AddPoint ( x1 , y , z0 ) ;
				}
				//z = f ( x0 , y0 ) ;
				x = x0 ;
				z = z0 ;
				y = eval ( f ) ;
				//if ( ymin > y ) { ymin = y ; }
				//if ( ymax < y ) { ymax = y ; }
				if ( eval ( domain ) && !isNaN(y) && y != Infinity ) {
					yPoly[i][j].AddPoint ( x0 , y , z0 ) ;
				}
				yPoly[i][j].Update ( ) ;
			}
		}
	}
	else if ( depVar == "x" ) {

		var xPoly = new Array ( ) ;
		y = ymin ;
		z = zmin ;
		xmin = eval ( f ) ;
		xmax = xmin ;
		for ( var i = 0 ; i < n_y ; i++ ) {
			xPoly[i] = new Array ( ) ;
			y0 = ymin + i * ( ymax - ymin ) / n_y ;
			y1 = ymin + ( i + 1 ) * ( ymax - ymin ) / n_y ;
			for ( var j = 0 ; j < n_z ; j++ ) {
				z0 = zmin + j * ( zmax - zmin ) / n_z ;
				z1 = zmin + ( j + 1 ) * ( zmax - zmin ) / n_z ;
				xPoly[i][j] = new Astex.Poly3D ( this.scene3d , this.frontColor , this.backColor , this.strokeColor , this.strokeWeight , this.opacity ) ;
				//z = f ( x0 , y1 ) ;
				y = y0 ;
				z = z1 ;
				x = eval ( f ) ;
				//if ( xmin > x ) { xmin = x ; }
				//if ( xmax < x ) { xmax = x ; }
				if ( eval ( domain ) && !isNaN(x) && x != Infinity ) {
					xPoly[i][j].AddPoint ( x , y0 , z1 ) ; 
				}
				//z = f ( x1 , y1 ) ;
				y = y1 ;
				z = z1 ;
				x = eval ( f ) ;
				//if ( xmin > x ) { xmin = x ; }
				//if ( xmax < x ) { xmax = x ; }
				if ( eval ( domain ) && !isNaN(x) && x != Infinity ) {
					xPoly[i][j].AddPoint ( x , y1 , z1 ) ; 
				}
				//z = f ( x1 , y0 ) ;
				y = y1 ;
				z = z0 ;
				x = eval ( f ) ;
				//if ( xmin > x ) { xmin = x ; }
				//if ( xmax < x ) { xmax = x ; }
				if ( eval ( domain ) && !isNaN(x) && x != Infinity ) {
					xPoly[i][j].AddPoint ( x , y1 , z0 ) ;
				}
				//z = f ( x0 , y0 ) ;
				y = y0 ;
				z = z0 ;
				x = eval ( f ) ;
				//if ( xmin > x ) { xmin = x ; }
				//if ( xmax < x ) { xmax = x ; }
				if ( eval ( domain ) && !isNaN(x) && x != Infinity ) {
					xPoly[i][j].AddPoint ( x , y0 , z0 ) ;
				}
				xPoly[i][j].Update ( ) ;
			}
		}
	}
};


// prototype: this.drawCylSurface ( String depVar , String f , String domain )
Astex.Canvas3D.prototype.drawCylSurface = function ( depVar , f , domain ) { 

	f = Astex.Math.ascii2JS ( f ) ;

	if ( ! domain || domain == "" ) { domain = "true" ; }
	domain = Astex.Math.ascii2JS ( domain ) ;
	//alert ( domain ) ;
	//alert ( typeof domain ) ;

	var min = new Astex.Vector ( this.xmin , this.ymin , this.zmin ) ;
	var max = new Astex.Vector ( this.xmax , this.ymax , this.zmax ) ;

	var xmin, xmax, ymin, ymax, zmin, zmax, x0, x1, y0, y1, z, x, y;

	var rmin, rmax, thetamin, thetamax, r0, r1, theta0, theta1, r, theta ;

	xmin = min.x ;
	ymin = min.y ;
	zmin = min.z ;

	xmax = max.x ;
	ymax = max.y ;
	zmax = max.z ;

	/*
	rmin = 0 ;
	rmax = Astex.Math.max ( xmax , xmin ) ;
	rmax = Astex.Math.max ( rmax , ymin ) ;
	rmax = Astex.Math.max ( rmax , ymax ) ;
	//rmax = Astex.Math.max ( rmax , zmin ) ;
	//rmax = Astex.Math.max ( rmax , zmax ) ;

	thetamin = 0 ;
	thetamax = 2 * Astex.Math.pi ;
	*/

	rmin = this.rmin ;
	rmax = this.rmax ;
	thetamin = this.thetamin ;
	thetamax = this.thetamax ;

	var n_x = this.xpartition ;
	var n_y = this.ypartition ;
	var n_z = this.zpartition ;

	var n_r = this.rpartition ;
	var n_theta = this.thetapartition ;

	if ( depVar == "z" ) {

		var zPoly = new Array ( ) ;
		r = rmin ;
		theta = thetamin ;
		//z = eval ( f ) ;
		//alert ( typeof eval(domain) ) ;
		//alert ( eval("x<10") ) ;
		zmin = eval ( f ) ;
		zmax = zmin ;
		for ( var i = 0 ; i < n_r ; i++ ) {
			zPoly[i] = new Array ( ) ;
			r0 = rmin + i * ( rmax - rmin ) / n_r ;
			r1 = rmin + ( i + 1 ) * ( rmax - rmin ) / n_r ;
			for ( var j = 0 ; j < n_theta ; j++ ) {
				theta0 = thetamin + j * ( thetamax - thetamin ) / n_y ;
				theta1 = thetamin + ( j + 1 ) * ( thetamax - thetamin ) / n_theta ;
				zPoly[i][j] = new Astex.Poly3D ( this.scene3d , this.frontColor , this.backColor , this.strokeColor , this.strokeWeight , this.opacity ) ;
				//z = f ( x0 , y1 ) ;
				r = r0 ;
				theta = theta1 ;
				z = eval ( f ) ;
				//if ( this.zmin > z ) { this.zmin = z ; }
				//if ( this.zmax < z ) { this.zmax = z ; }
				if ( eval ( domain ) && !isNaN(z) && z != Infinity ) {
				//if ( eval ( domain ) && this.boxContainsPoint(x0,y1,z) ) {
				//if ( z >= this.zmin && z <= this.zmax ) {
					x0 = r0 * Astex.Math.cos ( theta1 ) ;
					y1 = r0 * Astex.Math.sin ( theta1 ) ;
					zPoly[i][j].AddPoint ( x0 , y1 , z ) ;
				}
				//z = f ( x1 , y1 ) ;
				r = r1 ;
				theta = theta1 ;
				z = eval ( f ) ;
				//if ( this.zmin > z ) { this.zmin = z ; }
				//if ( this.zmax < z ) { this.zmax = z ; }
				//if ( eval ( domain ) ) {
				if ( eval ( domain ) && !isNaN(z) && z != Infinity ) {
				//if ( eval ( domain ) && this.boxContainsPoint(x1,y1,z) ) {
				//if ( z >= this.zmin && z <= this.zmax ) {
					x1 = r1 * Astex.Math.cos ( theta1 ) ;
					y1 = r1 * Astex.Math.sin ( theta1 ) ;
					zPoly[i][j].AddPoint ( x1 , y1 , z ) ;
				}
				//z = f ( x1 , y0 ) ;
				r = r1 ;
				theta = theta0 ;
				z = eval ( f ) ;
				//if ( this.zmin > z ) { this.zmin = z ; }
				//if ( this.zmax < z ) { this.zmax = z ; }
				//if ( eval ( domain ) ) {
				if ( eval ( domain ) && !isNaN(z) && z != Infinity ) {
				//if ( eval ( domain ) && this.boxContainsPoint(x1,y0,z) ) {
				//if ( z >= this.zmin && z <= this.zmax ) {
					x1 = r1 * Astex.Math.cos ( theta0 ) ;
					y0 = r1 * Astex.Math.sin ( theta0 ) ;
					zPoly[i][j].AddPoint ( x1 , y0 , z ) ;
				}
				//z = f ( x0 , y0 ) ;
				r = r0 ;
				theta = theta0 ;
				z = eval ( f ) ;
				//if ( this.zmin > z ) { this.zmin = z ; }
				//if ( this.zmax < z ) { this.zmax = z ; }
				//if ( eval ( domain ) ) {
				if ( eval ( domain ) && !isNaN(z) && z != Infinity ) {
				//if ( eval ( domain ) && this.boxContainsPoint(x0,y0,z) ) {
				//if ( z >= this.zmin && z <= this.zmax ) {
					x0 = r0 * Astex.Math.cos ( theta0 ) ;
					y0 = r0 * Astex.Math.sin ( theta0 ) ;
					zPoly[i][j].AddPoint ( x0 , y0 , z ) ;
				}
				zPoly[i][j].Update ( ) ;
			}
		}
	}
	else if ( depVar == "r" ) {

		var rPoly = new Array ( ) ;
		theta = thetamin ;
		z = zmin ;
		rmin = eval ( f ) ;
		rmax = rmin ;
		for ( var i = 0 ; i < n_theta ; i++ ) {
			rPoly[i] = new Array ( ) ;
			theta0 = xmin + i * ( thetamax - thetamin ) / n_theta ;
			theta1 = xmin + ( i + 1 ) * ( thetamax - thetamin ) / n_theta ;
			for ( var j = 0 ; j < n_z ; j++ ) {
				z0 = zmin + j * ( zmax - zmin ) / n_z ;
				z1 = zmin + ( j + 1 ) * ( zmax - zmin ) / n_z ;
				rPoly[i][j] = new Astex.Poly3D ( this.scene3d , this.frontColor , this.backColor , this.strokeColor , this.strokeWeight , this.opacity ) ;
				//z = f ( x0 , y1 ) ;
				theta = theta0 ;
				z = z1 ;
				r = eval ( f ) ;
				//if ( ymin > y ) { ymin = y ; }
				//if ( ymax < y ) { ymax = y ; }
				if ( eval ( domain ) && !isNaN(r) && r != Infinity ) {
					x0 = r * Astex.Math.cos ( theta0 ) ;
					y = r * Astex.Math.sin ( theta0 ) ;
					rPoly[i][j].AddPoint ( x0 , y , z1 ) ;
				}
				//z = f ( x1 , y1 ) ;
				theta = theta1 ;
				z = z1 ;
				r = eval ( f ) ;
				//if ( ymin > y ) { ymin = y ; }
				//if ( ymax < y ) { ymax = y ; }
				if ( eval ( domain ) && !isNaN(r) && r != Infinity ) {
					x1 = r * Astex.Math.cos ( theta1 ) ;
					y = r * Astex.Math.sin ( theta1 ) ;
					rPoly[i][j].AddPoint ( x1 , y , z1 ) ; 
				}
				//z = f ( x1 , y0 ) ;
				theta = theta1 ;
				z = z0 ;
				r = eval ( f ) ;
				//if ( ymin > y ) { ymin = y ; }
				//if ( ymax < y ) { ymax = y ; }
				if ( eval ( domain ) && !isNaN(r) && r != Infinity ) {
					x1 = r * Astex.Math.cos ( theta1 ) ;
					y = r * Astex.Math.sin ( theta1 ) ;
					rPoly[i][j].AddPoint ( x1 , y , z0 ) ;
				}
				//z = f ( x0 , y0 ) ;
				theta = theta0 ;
				z = z0 ;
				r = eval ( f ) ;
				//if ( ymin > y ) { ymin = y ; }
				//if ( ymax < y ) { ymax = y ; }
				if ( eval ( domain ) && !isNaN(r) && r != Infinity ) {
					x0 = r * Astex.Math.cos ( theta0 ) ;
					y = r * Astex.Math.sin ( theta0 ) ;
					rPoly[i][j].AddPoint ( x0 , y , z0 ) ;
				}
				rPoly[i][j].Update ( ) ;
			}
		}
	}
	else if ( depVar == "theta" ) {

		var thetaPoly = new Array ( ) ;
		r = rmin ;
		z = zmin ;
		thetamin = eval ( f ) ;
		thetamax = thetamin ;
		for ( var i = 0 ; i < n_r ; i++ ) {
			thetaPoly[i] = new Array ( ) ;
			r0 = rmin + i * ( rmax - rmin ) / n_r ;
			r1 = rmin + ( i + 1 ) * ( rmax - rmin ) / n_r ;
			for ( var j = 0 ; j < n_z ; j++ ) {
				z0 = zmin + j * ( zmax - zmin ) / n_z ;
				z1 = zmin + ( j + 1 ) * ( zmax - zmin ) / n_z ;
				thetaPoly[i][j] = new Astex.Poly3D ( this.scene3d , this.frontColor , this.backColor , this.strokeColor , this.strokeWeight , this.opacity ) ;
				//z = f ( x0 , y1 ) ;
				r = r0 ;
				z = z1 ;
				theta = eval ( f ) ;
				//if ( xmin > x ) { xmin = x ; }
				//if ( xmax < x ) { xmax = x ; }
				if ( eval ( domain ) && !isNaN(theta) && theta != Infinity ) {
					x = r0 * Astex.Math.cos ( theta ) ;
					y0 = r0 * Astex.Math.sin ( theta ) ;
					thetaPoly[i][j].AddPoint ( x , y0 , z1 ) ; 
				}
				//z = f ( x1 , y1 ) ;
				r = r1 ;
				z = z1 ;
				theta = eval ( f ) ;
				//if ( xmin > x ) { xmin = x ; }
				//if ( xmax < x ) { xmax = x ; }
				if ( eval ( domain ) && !isNaN(theta) && theta != Infinity ) {
					x = r1 * Astex.Math.cos ( theta ) ;
					y1 = r1 * Astex.Math.sin ( theta ) ;
					thetaPoly[i][j].AddPoint ( x , y1 , z1 ) ; 
				}
				//z = f ( x1 , y0 ) ;
				r = r1 ;
				z = z0 ;
				theta = eval ( f ) ;
				//if ( xmin > x ) { xmin = x ; }
				//if ( xmax < x ) { xmax = x ; }
				if ( eval ( domain ) && !isNaN(theta) && theta != Infinity ) {
					x = r1 * Astex.Math.cos ( theta ) ;
					y1 = r1 * Astex.Math.sin ( theta ) ;
					thetaPoly[i][j].AddPoint ( x , y1 , z0 ) ;
				}
				//z = f ( x0 , y0 ) ;
				r = r0 ;
				z = z0 ;
				theta = eval ( f ) ;
				//if ( xmin > x ) { xmin = x ; }
				//if ( xmax < x ) { xmax = x ; }
				if ( eval ( domain ) && !isNaN(theta) && theta != Infinity ) {
					x = r0 * Astex.Math.cos ( theta ) ;
					y0 = r0 * Astex.Math.sin ( theta ) ;
					thetaPoly[i][j].AddPoint ( x , y0 , z0 ) ;
				}
				thetaPoly[i][j].Update ( ) ;
			}
		}
	}
};


// prototype: this.drawSphSurface ( String depVar , String f , String domain )
Astex.Canvas3D.prototype.drawSphSurface = function ( depVar , f , domain ) { 

	f = Astex.Math.ascii2JS ( f ) ;

	if ( ! domain || domain == "" ) { domain = "true" ; }
	domain = Astex.Math.ascii2JS ( domain ) ;
	//alert ( domain ) ;
	//alert ( typeof domain ) ;

	var min = new Astex.Vector ( this.xmin , this.ymin , this.zmin ) ;
	var max = new Astex.Vector ( this.xmax , this.ymax , this.zmax ) ;

	var xmin, xmax, ymin, ymax, zmin, zmax, x0, x1, y0, y1, z, x, y;

	var rmin, rmax, thetamin, thetamax, r0, r1, theta0, theta1, r, theta ;
	var rhomin, rhomax, phimin, phimax, rho0, rho1, phi0, phi1, rho, phi ;

	xmin = min.x ;
	ymin = min.y ;
	zmin = min.z ;

	xmax = max.x ;
	ymax = max.y ;
	zmax = max.z ;

	/*
	rhomin = 0 ;
	rhomax = Astex.Math.max ( xmax , xmin ) ;
	rhomax = Astex.Math.max ( rhomax , ymin ) ;
	rhomax = Astex.Math.max ( rhomax , ymax ) ;
	rhomax = Astex.Math.max ( rhomax , zmin ) ;
	rhomax = Astex.Math.max ( rhomax , zmax ) ;

	thetamin = 0 ;
	thetamax = 2 * Astex.Math.pi ;

	phimin = 0 ;
	phimax = Astex.Math.pi ;
	*/

	rhomin = this.rhomin ;
	rhomax = this.rhomax ;
	thetamin = this.thetamin ;
	thetamax = this.thetamax ;
	phimin = this.phimin ;
	phimax = this.phimax ;


	var n_x = this.xpartition ;
	var n_y = this.ypartition ;
	var n_z = this.zpartition ;

	var n_r = this.rpartition ;
	var n_theta = this.thetapartition ;

	var n_rho = this.rhopartition ;
	//var n_theta = this.thetapartition ;
	var n_phi = this.phipartition ;

	if ( depVar == "rho" ) {

		var rhoPoly = new Array ( ) ;
		phi = phimin ;
		theta = thetamin ;
		//z = eval ( f ) ;
		//alert ( typeof eval(domain) ) ;
		//alert ( eval("x<10") ) ;
		rhomin = eval ( f ) ;
		rhomax = zmin ;
		for ( var i = 0 ; i < n_phi ; i++ ) {
			rhoPoly[i] = new Array ( ) ;
			phi0 = phimin + i * ( phimax - phimin ) / n_phi ;
			phi1 = phimin + ( i + 1 ) * ( phimax - phimin ) / n_phi ;
			for ( var j = 0 ; j < n_theta ; j++ ) {
				theta0 = thetamin + j * ( thetamax - thetamin ) / n_y ;
				theta1 = thetamin + ( j + 1 ) * ( thetamax - thetamin ) / n_theta ;
				rhoPoly[i][j] = new Astex.Poly3D ( this.scene3d , this.frontColor , this.backColor , this.strokeColor , this.strokeWeight , this.opacity ) ;
				//z = f ( x0 , y1 ) ;
				phi = phi0 ;
				theta = theta1 ;
				rho = eval ( f ) ;
				//if ( this.zmin > z ) { this.zmin = z ; }
				//if ( this.zmax < z ) { this.zmax = z ; }
				if ( eval ( domain ) && !isNaN(rho) && rho != Infinity ) {
				//if ( eval ( domain ) && this.boxContainsPoint(x0,y1,z) ) {
				//if ( z >= this.zmin && z <= this.zmax ) {
					x = rho * Astex.Math.sin ( phi ) * Astex.Math.cos ( theta ) ;
					y = rho * Astex.Math.sin ( phi ) * Astex.Math.sin ( theta ) ;
					z = rho * Astex.Math.cos ( phi ) ;
					rhoPoly[i][j].AddPoint ( x , y , z ) ;
				}
				//z = f ( x1 , y1 ) ;
				phi = phi1 ;
				theta = theta1 ;
				rho = eval ( f ) ;
				//if ( this.zmin > z ) { this.zmin = z ; }
				//if ( this.zmax < z ) { this.zmax = z ; }
				//if ( eval ( domain ) ) {
				if ( eval ( domain ) && !isNaN(rho) && rho != Infinity ) {
				//if ( eval ( domain ) && this.boxContainsPoint(x1,y1,z) ) {
				//if ( z >= this.zmin && z <= this.zmax ) {
					x = rho * Astex.Math.sin ( phi ) * Astex.Math.cos ( theta ) ;
					y = rho * Astex.Math.sin ( phi ) * Astex.Math.sin ( theta ) ;
					z = rho * Astex.Math.cos ( phi ) ;
					rhoPoly[i][j].AddPoint ( x , y , z ) ;
				}
				//z = f ( x1 , y0 ) ;
				phi = phi1 ;
				theta = theta0 ;
				rho = eval ( f ) ;
				//if ( this.zmin > z ) { this.zmin = z ; }
				//if ( this.zmax < z ) { this.zmax = z ; }
				//if ( eval ( domain ) ) {
				if ( eval ( domain ) && !isNaN(rho) && rho != Infinity ) {
				//if ( eval ( domain ) && this.boxContainsPoint(x1,y0,z) ) {
				//if ( z >= this.zmin && z <= this.zmax ) {
					x = rho * Astex.Math.sin ( phi ) * Astex.Math.cos ( theta ) ;
					y = rho * Astex.Math.sin ( phi ) * Astex.Math.sin ( theta ) ;
					z = rho * Astex.Math.cos ( phi ) ;
					rhoPoly[i][j].AddPoint ( x , y , z ) ;
				}
				//z = f ( x0 , y0 ) ;
				phi = phi0 ;
				theta = theta0 ;
				rho = eval ( f ) ;
				//if ( this.zmin > z ) { this.zmin = z ; }
				//if ( this.zmax < z ) { this.zmax = z ; }
				//if ( eval ( domain ) ) {
				if ( eval ( domain ) && !isNaN(rho) && rho != Infinity ) {
				//if ( eval ( domain ) && this.boxContainsPoint(x0,y0,z) ) {
				//if ( z >= this.zmin && z <= this.zmax ) {
					x = rho * Astex.Math.sin ( phi ) * Astex.Math.cos ( theta ) ;
					y = rho * Astex.Math.sin ( phi ) * Astex.Math.sin ( theta ) ;
					z = rho * Astex.Math.cos ( phi ) ;
					rhoPoly[i][j].AddPoint ( x , y , z ) ;
				}
				rhoPoly[i][j].Update ( ) ;
			}
		}
	}
	else if ( depVar == "phi" ) {

		var phiPoly = new Array ( ) ;
		theta = thetamin ;
		rho = rhomin ;
		phimin = eval ( f ) ;
		phimax = phimin ;
		for ( var i = 0 ; i < n_theta ; i++ ) {
			phiPoly[i] = new Array ( ) ;
			theta0 = xmin + i * ( thetamax - thetamin ) / n_theta ;
			theta1 = xmin + ( i + 1 ) * ( thetamax - thetamin ) / n_theta ;
			for ( var j = 0 ; j < n_rho ; j++ ) {
				rho0 = rhomin + j * ( rhomax - rhomin ) / n_rho ;
				rho1 = rhomin + ( j + 1 ) * ( rhomax - rhomin ) / n_rho ;
				phiPoly[i][j] = new Astex.Poly3D ( this.scene3d , this.frontColor , this.backColor , this.strokeColor , this.strokeWeight , this.opacity ) ;
				//z = f ( x0 , y1 ) ;
				theta = theta0 ;
				rho = rho1 ;
				phi = eval ( f ) ;
				//if ( ymin > y ) { ymin = y ; }
				//if ( ymax < y ) { ymax = y ; }
				if ( eval ( domain ) && !isNaN(phi) && phi != Infinity ) {
					x = rho * Astex.Math.sin ( phi ) * Astex.Math.cos ( theta ) ;
					y = rho * Astex.Math.sin ( phi ) * Astex.Math.sin ( theta ) ;
					z = rho * Astex.Math.cos ( phi ) ;
					phiPoly[i][j].AddPoint ( x , y , z ) ;
				}
				//z = f ( x1 , y1 ) ;
				theta = theta1 ;
				rho = rho1 ;
				phi = eval ( f ) ;
				//if ( ymin > y ) { ymin = y ; }
				//if ( ymax < y ) { ymax = y ; }
				if ( eval ( domain ) && !isNaN(phi) && phi != Infinity ) {
					x = rho * Astex.Math.sin ( phi ) * Astex.Math.cos ( theta ) ;
					y = rho * Astex.Math.sin ( phi ) * Astex.Math.sin ( theta ) ;
					z = rho * Astex.Math.cos ( phi ) ;
					phiPoly[i][j].AddPoint ( x , y , z ) ;
				}
				//z = f ( x1 , y0 ) ;
				theta = theta1 ;
				rho = rho0 ;
				phi = eval ( f ) ;
				//if ( ymin > y ) { ymin = y ; }
				//if ( ymax < y ) { ymax = y ; }
				if ( eval ( domain ) && !isNaN(phi) && phi != Infinity ) {
					x = rho * Astex.Math.sin ( phi ) * Astex.Math.cos ( theta ) ;
					y = rho * Astex.Math.sin ( phi ) * Astex.Math.sin ( theta ) ;
					z = rho * Astex.Math.cos ( phi ) ;
					phiPoly[i][j].AddPoint ( x , y , z ) ;
				}
				//z = f ( x0 , y0 ) ;
				theta = theta0 ;
				rho = rho0 ;
				phi = eval ( f ) ;
				//if ( ymin > y ) { ymin = y ; }
				//if ( ymax < y ) { ymax = y ; }
				if ( eval ( domain ) && !isNaN(phi) && phi != Infinity ) {
					x = rho * Astex.Math.sin ( phi ) * Astex.Math.cos ( theta ) ;
					y = rho * Astex.Math.sin ( phi ) * Astex.Math.sin ( theta ) ;
					z = rho * Astex.Math.cos ( phi ) ;
					phiPoly[i][j].AddPoint ( x , y , z ) ;
				}
				phiPoly[i][j].Update ( ) ;
			}
		}
	}
	else if ( depVar == "theta" ) {

		var thetaPoly = new Array ( ) ;
		rho = rhomin ;
		phi = phimin ;
		thetamin = eval ( f ) ;
		thetamax = thetamin ;
		for ( var i = 0 ; i < n_rho ; i++ ) {
			thetaPoly[i] = new Array ( ) ;
			rho0 = rhomin + i * ( rhomax - rhomin ) / n_rho ;
			rho1 = rhomin + ( i + 1 ) * ( rhomax - rhomin ) / n_rho ;
			for ( var j = 0 ; j < n_phi ; j++ ) {
				phi0 = phimin + j * ( phimax - phimin ) / n_phi ;
				phi1 = phimin + ( j + 1 ) * ( phimax - phimin ) / n_phi ;
				thetaPoly[i][j] = new Astex.Poly3D ( this.scene3d , this.frontColor , this.backColor , this.strokeColor , this.strokeWeight , this.opacity ) ;
				//z = f ( x0 , y1 ) ;
				rho = rho0 ;
				phi = phi1 ;
				theta = eval ( f ) ;
				//if ( xmin > x ) { xmin = x ; }
				//if ( xmax < x ) { xmax = x ; }
				if ( eval ( domain ) && !isNaN(theta) && theta != Infinity ) {
					x = rho * Astex.Math.sin ( phi ) * Astex.Math.cos ( theta ) ;
					y = rho * Astex.Math.sin ( phi ) * Astex.Math.sin ( theta ) ;
					z = rho * Astex.Math.cos ( phi ) ;
					thetaPoly[i][j].AddPoint ( x , y , z ) ;
				}
				//z = f ( x1 , y1 ) ;
				rho = rho1 ;
				phi = phi1 ;
				theta = eval ( f ) ;
				//if ( xmin > x ) { xmin = x ; }
				//if ( xmax < x ) { xmax = x ; }
				if ( eval ( domain ) && !isNaN(theta) && theta != Infinity ) {
					x = rho * Astex.Math.sin ( phi ) * Astex.Math.cos ( theta ) ;
					y = rho * Astex.Math.sin ( phi ) * Astex.Math.sin ( theta ) ;
					z = rho * Astex.Math.cos ( phi ) ;
					thetaPoly[i][j].AddPoint ( x , y , z ) ;
				}
				//z = f ( x1 , y0 ) ;
				rho = rho1 ;
				phi = phi0 ;
				theta = eval ( f ) ;
				//if ( xmin > x ) { xmin = x ; }
				//if ( xmax < x ) { xmax = x ; }
				if ( eval ( domain ) && !isNaN(theta) && theta != Infinity ) {
					x = rho * Astex.Math.sin ( phi ) * Astex.Math.cos ( theta ) ;
					y = rho * Astex.Math.sin ( phi ) * Astex.Math.sin ( theta ) ;
					z = rho * Astex.Math.cos ( phi ) ;
					thetaPoly[i][j].AddPoint ( x , y , z ) ;
				}
				//z = f ( x0 , y0 ) ;
				rho = rho0 ;
				phi = phi0 ;
				theta = eval ( f ) ;
				//if ( xmin > x ) { xmin = x ; }
				//if ( xmax < x ) { xmax = x ; }
				if ( eval ( domain ) && !isNaN(theta) && theta != Infinity ) {
					x = rho * Astex.Math.sin ( phi ) * Astex.Math.cos ( theta ) ;
					y = rho * Astex.Math.sin ( phi ) * Astex.Math.sin ( theta ) ;
					z = rho * Astex.Math.cos ( phi ) ;
					thetaPoly[i][j].AddPoint ( x , y , z ) ;
				}
				thetaPoly[i][j].Update ( ) ;
			}
		}
	}
};

// prototype: this.drawParamSurface ( String zxy , String xst , String yst , Float smin , Float smax , Float tmin , Float tmax )
Astex.Canvas3D.prototype.drawParamSurface = function ( zxy , xst , yst , smin , smax , tmin , tmax ) { 

	zxy = Astex.Math.ascii2JS ( zxy ) ;
	xst = Astex.Math.ascii2JS ( xst ) ;
	yst = Astex.Math.ascii2JS ( yst ) ;

	var x, y, z, xmin = this.xmin, ymin = this.ymin, zmin = this.zmin, xmax=this.xmax, ymax=this.ymax, zmax=this.zmax ;
	var x0 , y0 , z0 , x1 , y1 , z1 ;
	var s , t , s0 , s1 , t0 , t1 ;

	var spartition = this.spartition ;
	var tpartition = this.tpartition ;

	var zPoly = new Array ( ) ;
	x = xmin ;
	y = ymin ;
	zmin = eval ( zxy ) ;
	zmax = zmin ;

	var domain = "true" ;

	for ( var i = 0 ; i < spartition ; i++ ) {
		zPoly[i] = new Array ( ) ;
		for ( var j = 0 ; j < tpartition ; j++ ) {
			s0 = smin + i * ( smax - smin ) / spartition ;
			s1 = smin + ( i + 1 ) * ( smax - smin ) / spartition ;
			t0 = tmin + j * ( tmax - tmin ) / tpartition ;
			t1 = tmin + ( j + 1 ) * ( tmax - tmin ) / tpartition ;
			zPoly[i][j] = new Astex.Poly3D ( this.scene3d , this.frontColor , this.backColor , this.strokeColor , this.strokeWeight , this.opacity ) ;
			//z = f ( x0 , y1 ) ;
			s = s0 ;
			t = t1 ;
			x = eval ( xst ) ;
			y = eval ( yst ) ;
			z = eval ( zxy ) ;
			//if ( this.zmin > z ) { this.zmin = z ; }
			//if ( this.zmax < z ) { this.zmax = z ; }
			if ( eval ( domain ) && !isNaN(z) && z != Infinity ) {
			//if ( eval ( domain ) && this.boxContainsPoint(x0,y1,z) ) {
			//if ( z >= this.zmin && z <= this.zmax ) {
				zPoly[i][j].AddPoint ( x , y , z ) ;
			}
			//z = f ( x1 , y1 ) ;
			s = s1 ;
			t = t1 ;
			x = eval ( xst ) ;
			y = eval ( yst ) ;
			z = eval ( zxy ) ;
			//if ( this.zmin > z ) { this.zmin = z ; }
			//if ( this.zmax < z ) { this.zmax = z ; }
			//if ( eval ( domain ) ) {
			if ( eval ( domain ) && !isNaN(z) && z != Infinity ) {
			//if ( eval ( domain ) && this.boxContainsPoint(x1,y1,z) ) {
			//if ( z >= this.zmin && z <= this.zmax ) {
				zPoly[i][j].AddPoint ( x , y , z ) ;
			}
			//z = f ( x1 , y0 ) ;
			s = s1 ;
			t = t0 ;
			x = eval ( xst ) ;
			y = eval ( yst ) ;
			z = eval ( zxy ) ;
			//if ( this.zmin > z ) { this.zmin = z ; }
			//if ( this.zmax < z ) { this.zmax = z ; }
			//if ( eval ( domain ) ) {
			if ( eval ( domain ) && !isNaN(z) && z != Infinity ) {
			//if ( eval ( domain ) && this.boxContainsPoint(x1,y0,z) ) {
			//if ( z >= this.zmin && z <= this.zmax ) {
				zPoly[i][j].AddPoint ( x , y , z ) ;
			}
			//z = f ( x0 , y0 ) ;
			s = s0 ;
			t = t0 ;
			x = eval ( xst ) ;
			y = eval ( yst ) ;
			z = eval ( zxy ) ;
			//if ( this.zmin > z ) { this.zmin = z ; }
			//if ( this.zmax < z ) { this.zmax = z ; }
			//if ( eval ( domain ) ) {
			if ( eval ( domain ) && !isNaN(z) && z != Infinity ) {
			//if ( eval ( domain ) && this.boxContainsPoint(x0,y0,z) ) {
			//if ( z >= this.zmin && z <= this.zmax ) {
				zPoly[i][j].AddPoint ( x , y , z ) ;
			}
			zPoly[i][j].Update ( ) ;
		}
	}
};

/*--------------------------------------------------------------------------*/
