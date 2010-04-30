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
// Astex.DataList class
//

// prototype: new Astex.DataList ( Int type , Float[]/String[] list ) ;
// type is Astex.DataList.Quantitative or Astex.DataList.Qualitative
Astex.DataList = function ( type , list ) {

	this.type = type ;
	this.list = list ;
	this.sampleSize = list.length ;

	if ( this.type == Astex.DataList.Quantitative ) {

		/*
		for ( var i = 0 ; i < this.list.length ; i++ ) {
			//alert ( typeof this.list[i] ) ;
			this.list[i] = parseFloat ( this.list[i] ) ;
		}
		*/
		this.calcStat ( ) ;
	}

	return this ;
};

//
// Astex.DataList class variables
//

Astex.DataList.Quantitative = 0 ;
Astex.DataList.Qualitative = 1 ;

//
// Astex.DataList instance methods
//

// prototype: this.calcStat ( ) ;
Astex.DataList.prototype.calcStat = function ( ) {

	this.calcMin ( ) ;
	this.calcMax ( ) ;
	this.calcRange ( ) ;			// call after min and max are set
	this.calcMedian ( ) ;
	this.calcMean ( ) ;
	// this.calcMode ( ) ;			// need to implement this
};

// prototype: this.calcMin ( ) ;
Astex.DataList.prototype.calcMin = function ( ) {

	var min = this.list[0] ;
	for ( var i = 1 ; i < this.sampleSize ; i++ ) {
		if ( this.list[i] < min ) {
			min = this.list[i] ;
		}
	}
	this.min = min ;
};

// prototype: this.calcMax ( ) ;
Astex.DataList.prototype.calcMax = function ( ) {

	var max = this.list[0] ;
	for ( var i = 1 ; i < this.sampleSize ; i++ ) {
		if ( max < this.list[i] ) {
			max = this.list[i] ;
		}
	}
	this.max = max ;
};

// prototype: this.calcRange ( ) ;
Astex.DataList.prototype.calcRange = function ( ) {

	this.range = this.max - this.min ;
};

// prototype: this.calcMedian ( ) ;
Astex.DataList.prototype.calcMedian = function ( ) {

	var n = this.sampleSize ;
	var arr = this.list ;
	arr.sort ( ) ;
	var med ;

	if ( n % 2 == 0 ) {
		// e.g. n = 10  med is avg of 5 & 6 the elements (indices 4 & 5)
		med = ( arr[n/2-1] + arr[n/2] ) / 2 ;
	}
	else {
		// e.g. n = 11 med is 6th element (index 5)
		med = arr[ (n-1) / 2 ] ;
	}
	this.median = med ;
};

// prototype: this.calcMean ( ) ;
Astex.DataList.prototype.calcMean = function ( ) {

	var sum = 0 ;
	for ( var i = 0 ; i < this.sampleSize ; i++ ) {
		sum += this.list[i] ;
	}
	this.mean = sum / this.sampleSize ;
};


// prototype: Int this.freq ( Float lower , Float upper ) ;
// compute the frequency of numeric data values between upper 
// and lower limits
Astex.DataList.prototype.freq = function ( lower , upper ) {

	var freq = 0 ;
	for ( var i = 0 ; i < this.sampleSize ; i++ ) {
		var d = this.list[i] ;
		if ( d >= lower && d <= upper ) {
			freq++ ;
		}
	}

	return freq ;
};

