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

// Astex.Math class
// most constants and functions are borrowed from AsciiMathML/AsciiSVG
Astex.Math = { } ;

Astex.Math.zero = parseFloat ( 0 ) ;

//var pi = Math.PI, e = Math.E, ln = Math.log, sqrt = Math.sqrt;
Astex.Math.pi = Math.PI ;
Astex.Math.e = Math.E ;
Astex.Math.ln = Math.log ;		// check JS definition of log
Astex.Math.sqrt = Math.sqrt ;

//var log = function(x) { return ln(x)/ln(10) };
Astex.Math.log = function ( x ) { return Astex.Math.ln(x) / Astex.Math.ln(10) ; };

Astex.Math.exp = Math.exp ;
Astex.Math.pow = Math.pow ;

//var floor = Math.floor, ceil = Math.ceil, abs = Math.abs;
Astex.Math.floor = Math.floor ;
Astex.Math.ceil = Math.ceil ;
Astex.Math.abs = Math.abs;
Astex.Math.max = Math.max;
Astex.Math.min = Math.min;

//var sin = Math.sin, cos = Math.cos, tan = Math.tan;
Astex.Math.sin = Math.sin ;
Astex.Math.cos = Math.cos ;
Astex.Math.tan = Math.tan ;		// check this ... does JavaScript define this the same as in trig class ???
					// the same goes for other trig, inverse trig functions
//var sec = function(x) { return 1/Math.cos(x) };
Astex.Math.sec = function ( x ) { return 1 / Astex.Math.cos(x) ; };
//var csc = function(x) { return 1/Math.sin(x) };
Astex.Math.csc = function ( x ) { return 1 / Astex.Math.sin(x) ; };
//var cot = function(x) { return 1/Math.tan(x) };
Astex.Math.cot = function ( x ) { return 1 / Astex.Math.tan(x) ; };

//var arcsin = Math.asin, arccos = Math.acos, arctan = Math.atan;
Astex.Math.arcsin = Math.asin ;
Astex.Math.arccos = Math.acos ;
Astex.Math.arctan = Math.atan ;		// check definition ....
//var arcsec = function(x) { return arccos(1/x) };
Astex.Math.arcsec = function ( x ) { return 1 / Astex.Math.arccos(x) ; };
//var arccsc = function(x) { return arcsin(1/x) };
Astex.Math.arccsc = function ( x ) { return 1 / Astex.Math.arcsin(x) ; };
//var arccot = function(x) { return arctan(1/x) };
Astex.Math.arccot = function ( x ) { return 1 / Astex.Math.arctan(x) ; };

//var sinh = function(x) { return (Math.exp(x)-Math.exp(-x))/2 };
Astex.Math.sinh = function ( x ) { return ( Astex.Math.exp(x) - Astex.Math.exp(-x) ) / 2 ; };
//var cosh = function(x) { return (Math.exp(x)+Math.exp(-x))/2 };
Astex.Math.cosh = function ( x ) { return ( Astex.Math.exp(x) + Astex.Math.exp(-x) ) / 2 ; };
//var tanh = function(x) { return (Math.exp(x)-Math.exp(-x))/(Math.exp(x)+Math.exp(-x)) };
Astex.Math.tanh = function ( x ) { return Astex.Math.sinh(x) / Astex.Math.cosh(x) ; };
//var sech = function(x) { return 1/cosh(x) };
Astex.Math.sech = function ( x ) { return 1 / Astex.Math.cosh(x) ; };
//var csch = function(x) { return 1/sinh(x) };
Astex.Math.csch = function ( x ) { return 1 / Astex.Math.sinh(x) ; };
//var coth = function(x) { return 1/tanh(x) };
Astex.Math.coth = function ( x ) { return 1 / Astex.Math.tanh(x) ; };

//var arcsinh = function(x) { return ln(x+Math.sqrt(x*x+1)) };
Astex.Math.arcsinh = function ( x ) { return Astex.Math.ln( x + Astex.Math.sqrt(x*x+1) ) ; };
//var arccosh = function(x) { return ln(x+Math.sqrt(x*x-1)) };
Astex.Math.arccosh = function ( x ) { return Astex.Math.ln( x + Astex.Math.sqrt(x*x-1) ) ; };
//var arctanh = function(x) { return ln((1+x)/(1-x))/2 };
Astex.Math.arctanh = function ( x ) { return Astex.Math.ln((1+x)/(1-x)) / 2 ; };
//var arcsech = function(x) { return arccosh(1/x) };
Astex.Math.arcsech = function ( x ) { return  Astex.Math.arccosh(1/x) ; };
//var arccsch = function(x) { return arcsinh(1/x) };
Astex.Math.arccsch = function ( x ) { return  Astex.Math.arcsinh(1/x) ; };
//var arccoth = function(x) { return arctanh(1/x) };
Astex.Math.arccoth = function ( x ) { return  Astex.Math.arctanh(1/x) ; };

//var sign = function(x) { return (x==0?0:(x<0?-1:1)) };
Astex.Math.sign = function ( x ) { return ( x==0 ? 0 : ( x < 0 ? -1 : 1 ) ) ; };

Astex.Math.factorial = function ( x , n ) { // Factorial function
	if ( n == null ) { n = 1 ; }
	if ( Math.abs( x-Math.round(x*1000000)/1000000 ) < 1e-15 ) {
		x = Math.round ( x*1000000 ) / 1000000 ;
	}
	if ( x - Math.floor(x) != 0 ) { return NaN ; }
	for ( var i = x - n ; i > 0 ; i -= n ) { x *= i ; }
	return ( x < 0 ? NaN : ( x==0 ? 1 : x ) ) ;
};

Astex.Math.C = function ( x , k ) {  // Binomial coefficient function
	var res = 1 ;
	for ( var i = 0 ; i < k ; i++ ) { res *= (x-i)/(k-i) ; }
	return res ;
};

Astex.Math.chop = function ( x , n ) { // Truncate decimal number to n places after decimal point
	if ( n == null ) { n = 0 ; }
	return Math.floor ( x * Math.pow(10,n) ) / Math.pow(10,n) ;
};

Astex.Math.ran = function ( a , b , n ) { // Generate random number in [a,b] with n digits after .
	if ( n == null ) n = 0 ;
	return Astex.Math.chop ( ( b + Math.pow(10,-n) - a ) * Math.random() + a , n ) ;
};

Astex.Math.Normal = function ( x , mu , sigma ) { // Normal Distribution X ~ N ( mu , sigma^2 )

	return Math.exp ( -0.5 * Math.pow ( (x-mu)/sigma , 2 ) ) / ( sigma * Math.sqrt(2*Math.PI) ) ;
};

// prototype: String Astex.Math.ascii2JS ( String st )
// translate a math formula to js function notation
// returns a string which can be evaluated with eval()
// basic algorithm borrowed from AsciiMathML mathjs() function but greatly expanded
Astex.Math.ascii2JS = function ( st ) {

	// remove whitespace
	st = st.replace ( /\s/g , "" ) ;

	// a^b --> pow(a,b)
	// na --> n*a
	// (...)d --> (...)*d
	// n! --> factorial(n)
	// sin^-1 --> arcsin etc.
	//while ^ in string, find term on left and right
	//slice and concat new formula string

	// count the number of opening and closing ( ), { }, [ ]
	// and make sure they are the same for each type
	//
	// NOTE: This does NOT make sure that bracket types are
	// nested properly...need to write an algorithm for this still...
	//
	var numOpenP  = Astex.Util.countCharInString ( '(' , st ) ;	
	var numCloseP = Astex.Util.countCharInString ( ')' , st ) ;	
	var numOpenC  = Astex.Util.countCharInString ( '{' , st ) ;	
	var numCloseC = Astex.Util.countCharInString ( '}' , st ) ;	
	var numOpenB  = Astex.Util.countCharInString ( '[' , st ) ;	
	var numCloseB = Astex.Util.countCharInString ( ']' , st ) ;	

	if ( numOpenP < numCloseP ) {
		return new Astex.Error ( "Syntax Error: Missing ( in " + st , "Astex.Util.mathToJS" ) ; 
	}
	if ( numOpenP > numCloseP ) {
		return new Astex.Error ( "Syntax Error: Missing ) in " + st , "Astex.Util.mathToJS" ) ; 
	}
	if ( numOpenC < numCloseC ) {
		return new Astex.Error ( "Syntax Error: Missing { in " + st , "Astex.Util.mathToJS" ) ; 
	}
	if ( numOpenC > numCloseC ) {
		return new Astex.Error ( "Syntax Error: Missing } in " + st , "Astex.Util.mathToJS" ) ; 
	}
	if ( numOpenB < numCloseB ) {
		return new Astex.Error ( "Syntax Error: Missing [ in " + st , "Astex.Util.mathToJS" ) ; 
	}
	if ( numOpenB > numCloseB ) {
		return new Astex.Error ( "Syntax Error: Missing ] in " + st , "Astex.Util.mathToJS" ) ; 
	}

	// replace all { and [ by (
	// replace all } and ] by )
	// to make math expressions and function calls work with all 3 bracket types
	st = st.replace ( /\{/g , "(" ) ;
	st = st.replace ( /\[/g , "(" ) ;
	st = st.replace ( /\}/g , ")" ) ;
	st = st.replace ( /\]/g , ")" ) ;

	// take care of rudimentary mathematical functions
	//
	// translate inverse trig and inverse hyperbolic functions using ^-1 notation
	if ( st.indexOf("^-1") != -1 ) {
		st = st.replace ( /sin\^-1/g , "Astex.Math.arcsin" ) ;
		st = st.replace ( /cos\^-1/g , "Astex.Math.arccos" ) ;
		st = st.replace ( /tan\^-1/g , "Astex.Math.arctan" ) ;
		st = st.replace ( /sec\^-1/g , "Astex.Math.arcsec" ) ;
		st = st.replace ( /csc\^-1/g , "Astex.Math.arccsc" ) ;
		st = st.replace ( /cot\^-1/g , "Astex.Math.arccot" ) ;
		st = st.replace ( /sinh\^-1/g , "Astex.Math.arcsinh" ) ;
		st = st.replace ( /cosh\^-1/g , "Astex.Math.arccosh" ) ;
		st = st.replace ( /tanh\^-1/g , "Astex.Math.arctanh" ) ;
		st = st.replace ( /sech\^-1/g , "Astex.Math.arcsech" ) ;
		st = st.replace ( /csch\^-1/g , "Astex.Math.arccsch" ) ;
		st = st.replace ( /coth\^-1/g , "Astex.Math.arccoth" ) ;
	}
	// inverse hyperbolics
	st = st.replace ( /arcsinh/g , "Astex.Math.arcsinh" ) ;
	st = st.replace ( /arccosh/g , "Astex.Math.arccosh" ) ;
	st = st.replace ( /arctanh/g , "Astex.Math.arctanh" ) ;
	st = st.replace ( /arccsch/g , "Astex.Math.arccsch" ) ;
	st = st.replace ( /arcsech/g , "Astex.Math.arcsech" ) ;
	st = st.replace ( /arccoth/g , "Astex.Math.arccoth" ) ;
	// inverse trig
	st = st.replace ( /arcsin/g , "Astex.Math.arcsin" ) ;
	st = st.replace ( /arccos/g , "Astex.Math.arccos" ) ;
	st = st.replace ( /arctan/g , "Astex.Math.arctan" ) ;
	st = st.replace ( /arccsc/g , "Astex.Math.arccsc" ) ;
	st = st.replace ( /arcsec/g , "Astex.Math.arcsec" ) ;
	st = st.replace ( /arccot/g , "Astex.Math.arccot" ) ;
	// hyperbolics
	st = st.replace ( /sinh/g , "Astex.Math.sinh" ) ;
	st = st.replace ( /cosh/g , "Astex.Math.cosh" ) ;
	st = st.replace ( /tanh/g , "Astex.Math.tanh" ) ;
	st = st.replace ( /csch/g , "Astex.Math.csch" ) ;
	st = st.replace ( /sech/g , "Astex.Math.sech" ) ;
	st = st.replace ( /coth/g , "Astex.Math.coth" ) ;
	// trig
	st = st.replace ( /sin/g , "Astex.Math.sin" ) ;
	st = st.replace ( /cos/g , "Astex.Math.cos" ) ;
	st = st.replace ( /tan/g , "Astex.Math.tan" ) ;
	st = st.replace ( /csc/g , "Astex.Math.csc" ) ;
	st = st.replace ( /sec/g , "Astex.Math.sec" ) ;
	st = st.replace ( /cot/g , "Astex.Math.cot" ) ;
	// log , sqrt , etc.
	st = st.replace ( /ln/g , "Astex.Math.ln" ) ;
	st = st.replace ( /log/g , "Astex.Math.log" ) ;
	st = st.replace ( /exp/g , "Astex.Math.exp" ) ;
	st = st.replace ( /pow/g , "Astex.Math.pow" ) ;
	st = st.replace ( /sqrt/g , "Astex.Math.sqrt" ) ;
	st = st.replace ( /abs/g , "Astex.Math.abs" ) ;
	st = st.replace ( /floor/g , "Astex.Math.floor" ) ;
	st = st.replace ( /ceil/g , "Astex.Math.ceil" ) ;
	st = st.replace ( /sign/g , "Astex.Math.sign" ) ;
	st = st.replace ( /factorial/g , "Astex.Math.factorial" ) ;
	st = st.replace ( /C\(/g , "Astex.Math.C(" ) ;			// make sure C means binomial coefficient by checking for (
	st = st.replace ( /chop/g , "Astex.Math.chop" ) ;
	st = st.replace ( /ran/g , "Astex.Math.ran" ) ;

	// stat
	st = st.replace ( /Normal/g , "Astex.Math.Normal" ) ;


	// pi
	st = st.replace ( /^pi$/g , "(Math.PI)" ) ;
	st = st.replace ( /^pi([^a-zA-Z])/g , "(Math.PI)$1" ) ;
	st = st.replace ( /([^a-zA-Z])pi/g , "$1(Math.PI)" ) ;

	// take care of exponentials and products
	st = st.replace ( /^e$/g , "(Math.E)" ) ;
	st = st.replace ( /^e([^a-zA-Z])/g , "(Math.E)$1" ) ;
	st = st.replace ( /([^a-zA-Z])e/g , "$1(Math.E)" ) ;
	//st = st.replace ( /([^a-zA-Z])e([^a-zA-Z])/g , "$1(Math.E)$2" ) ;
	st = st.replace ( /([0-9])([\(a-zA-Z])/g , "$1*$2" ) ;
	st = st.replace ( /\)([\(0-9a-zA-Z])/g , "\)*$1" ) ;

	// variables for string positions
	var i = 0 , j = 0 , k = 0 ;

	// fix ++ , -- , +- , -+ , etc.
	while ( st.indexOf('++') != -1 || st.indexOf('--') != -1 || st.indexOf('+-') != -1 || st.indexOf('-+') != -1 ) {
		while ( ( i = st.indexOf ( '++' ) ) != -1 ) {
			// concatenate pieces of string together to create +
			// string positions 0 --> i - 1 come before ++
			// string positions i + 2 --> end of string comes after ++
			st = st.substring ( 0 , i ) + "+" + st.substring ( i + 2 ) ;
		}
		while ( ( i = st.indexOf ( '--' ) ) != -1 ) {
			// concatenate pieces of string together to create +
			// string positions 0 --> i - 1 come before --
			// string positions i + 2 --> end of string comes after --
			st = st.substring ( 0 , i ) + "+" + st.substring ( i + 2 ) ;
		}
		while ( ( i = st.indexOf ( '+-' ) ) != -1 ) {
			// concatenate pieces of string together to create -
			// string positions 0 --> i - 1 come before +-
			// string positions i + 2 --> end of string comes after +-
			st = st.substring ( 0 , i ) + "-" + st.substring ( i + 2 ) ;
		}
		while ( ( i = st.indexOf ( '-+' ) ) != -1 ) {
			// concatenate pieces of string together to create -
			// string positions 0 --> i - 1 come before -+
			// string positions i + 2 --> end of string comes after -+
			st = st.substring ( 0 , i ) + "-" + st.substring ( i + 2 ) ;
		}
	}

	// variables to keep track of nested parentheses ( ), curly braces { }, and square brackets [ ]
	//
	// NOT necessary anymore, only need to keep track of parentheses since all
	// { } and [ ] have been translated to ( )
	var nestedp = 0 , nestedc = 0 , nestedb = 0 ;
	var ch ;

	// a^b --> pow(a,b)
	// find exponents identified by ^
	while ( ( i = st.indexOf ( '^' ) ) != -1 ) {
		// find the base (the left argument)
		if ( i == 0 ) {
			return new Astex.Error ( "Syntax Error: ^ missing left argument in " + st , "Astex.Util.mathToJS" ) ; 
		}
		// get character immediately preceding ^
		j = i - 1 ;
		ch = st.charAt ( j ) ;
		// back-track from ^ and look for (decimal) number
		if ( Astex.Util.isDigit ( ch ) ) {
			// get previous character
			j-- ;
			if ( j >= 0 ) {
				ch = st.charAt ( j ) ;
			}
			// keep getting previous character as long as it's a digit
			while ( Astex.Util.isDigit ( ch ) ) {
				// get character
				if ( j >= 0 ) {
					// decrement j
					j-- ;
					ch = st.charAt ( j ) ;
				}
				else {
					break ;
				}
			}
			// take care of decimal point
			if (ch == '.') {
				// get character immediately preceding .
				j-- ;
				if (j >= 0 ) {
					ch = st.charAt ( j ) ;
				}
				// keep getting previous character as long as it's a digit
				while ( Astex.Util.isDigit ( ch ) ) {
					// get character
					if ( j >= 0 ) {
						// decrement j
						j-- ;
						ch = st.charAt ( j ) ;
					}
					else {
						break ;
					}
				}

			}
		}
		// if character before ^ isn't a digit
		// see if it's a closing bracket: ), }, or ]
		else if ( ch == ')' || ch == '}' || ch == ']' ) {
			// keep track of nested brackets 
			if ( ch == ')' ) nestedp = 1 ;
			if ( ch == '}' ) nestedc = 1 ;
			if ( ch == ']' ) nestedb = 1 ;
			// back-track looking for matching opening brackets and function name
			j-- ;
			while ( j >= 0 ) {
				ch = st.charAt ( j ) ;
				// decrement nested when character is opening (, {, [ 
				if ( ch == '(' ) nestedp-- ;
				if ( ch == '{' ) nestedc-- ;
				if ( ch == '[' ) nestedb-- ;
				// increment nested when character is closing ), }, ] 
				if ( ch == ')' ) nestedp++ ;
				if ( ch == '}' ) nestedc++ ;
				if ( ch == ']' ) nestedb++ ;

				j-- ;

				// when we aren't in brackets anymore
				if ( nestedp == 0 && nestedc == 0 && nestedb == 0 ) {
					break ;
				}
			}
			// back-track looking for function name before ( ... )
			if ( j >= 0 ) ch = st.charAt ( j ) ;
			while ( Astex.Util.isAlpha ( ch ) ) {
				// get character
				if ( j >= 0 ) {
					// decrement j
					j-- ;
					ch = st.charAt ( j ) ;
				}
				else {
					break ;
				}
			}

		}
		// if character before ^ isn't a digit or a closing bracket
		// see if it's a variable (a letter), such as e, pi, or some other user-defined var
		else if ( Astex.Util.isAlpha ( ch ) ) {
			// back-track looking for letter(s)
			j-- ;
			if ( j >= 0 ) ch = st.charAt ( j ) ;
			while ( Astex.Util.isAlpha ( ch ) ) {
				// get character
				if( j >= 0 ) {
					// decrement j
					j-- ;
					ch = st.charAt ( j ) ;
				}
				else {
					break ;
				}
			}

		}
		// return error message 
		else {
			return new Astex.Error ( "Error: ^ incorrect syntax in " + st + " at position " + j , "Astex.Util.mathToJS" ) ;
		}

		//find right argument
		if ( i == st.length - 1 ) {
			return new Astex.Error ( "Error: ^ missing right argument in " + st , "Astex.Util.mathToJS" ) ;
		}
		// get character immediately after ^
		k = i + 1 ;
		ch = st.charAt ( k ) ;

		// see if character immediately following ^ is + or -

		// look for consecutive + - signs (any mix will do)
		// move forward from ^ and look for + or - sign
		while ( ch == '-' || ch == '+' ) {
			// get next character until it's not a - or +
			// this will take care of e^--, e^+-, etc.
			k++ ;
			if ( k >= 0 && k < st.length ) {
				ch = st.charAt ( k ) ;
			}
		}

		// move forward from ^ or ^ - and look for (decimal) number
		if ( Astex.Util.isDigit ( ch ) ) {
			// move forward from and keep looking for digits 
			k++ ;
			if ( k >= 0 && k < st.length ) {
				ch = st.charAt ( k ) ;
			}
			while ( Astex.Util.isDigit ( ch ) ) {
				// get character
				if ( k >= 0 && k < st.length ) {
					// increment k
					k++ ;
					ch = st.charAt ( k ) ;
				}
				else {
					break ;
				}
			}
			// take care of decimal point
			if ( ch == '.' ) {
				// keep moving forward and look for digits
				k++ ;
				if ( k >= 0 && k < st.length ) {
					ch = st.charAt ( k ) ;
				}
				while ( Astex.Util.isDigit ( ch ) ) {
					// get character
					if (k >= 0 && k < st.length ) {
						// increment k
						k++ ;
						ch = st.charAt ( k ) ;
					}
					else {
						break ;
					}
				}

			}
		}
		// if character after ^ isn't a digit
		// see if it's an opening parentheses (, curly brace {, or bracket [
		else if ( ch == '(' || ch == '{' || ch == '[' ) {
			// keep track of nested parentheses 
			if ( ch == '(' ) nestedp = 1 ;
			if ( ch == '{' ) nestedc = 1 ;
			if ( ch == '[' ) nestedb = 1 ;
			// move forward looking for matching closing brackets
			k++ ;
			while ( k < st.length ) {
				ch = st.charAt ( k ) ;
				// increment nested when character is opening (, {, [ 
				if ( ch == '(' ) nestedp++ ;
				if ( ch == '{' ) nestedc++ ;
				if ( ch == '[' ) nestedb++ ;
				// decrement nested when character is closing ), }, ] 
				if ( ch == ')' ) nestedp-- ;
				if ( ch == '}' ) nestedc-- ;
				if ( ch == ']' ) nestedb-- ;

				k++ ;

				// when we aren't in parentheses anymore
				if ( nestedp == 0 && nestedc == 0 && nestedb ==0 ) {
					break ;
				}
			}
		}
		// if character after ^ isn't a digit or an opening parenthesis (
		// look for variables
		else if ( Astex.Util.isAlpha ( ch ) ) {
			k++ ;
			if ( k >= 0 && k < st.length ) {
				ch = st.charAt ( k ) ;
			}
			// move forward and keep finding letters
			while ( Astex.Util.isAlpha ( ch ) ) {
				// get character
				if ( k >= 0 && k < st.length ) {
					// increment k
					k++ ;
					ch = st.charAt ( k ) ;
				}
				else {
					break ;
				}
			}
		}
		// if character after ^ isn't a digit or an opening parenthesis (
		// or a variable
		else { 
			return new Astex.Error ( "Error: ^ incorrect syntax in " + st + " at position " + k , "Astex.Util.mathToJS" ) ;
		}

		// concatenate pieces of string together to create power function
		// string positions 0 --> j come before pow(base, exp)
		// string positions j + 1 --> i - 1 is base of power function
		// string position i is the caret ^
		// string positions i + 1 --> k - 1 is exponent of power function
		// string positions k  --> end of string comes after pow(base, exp) 
		st = st.substring ( 0 , j + 1 ) + "Astex.Math.pow(" + st.substring ( j + 1 , i ) + ", " + st.substring ( i + 1 , k ) + ")" + st.substring ( k ) ;
  	}


	// number! --> factorial(number)
	while ( ( i = st.indexOf ( "!" ) ) != -1 ) {
		//find left argument
		if ( i == 0 ) {
			return new Astex.Error ( "Error: ! missing argument in " + st , "Astex.Util.mathToJS" ) ;
		}
		j = i - 1 ;
		//ch = st.charAt(j) ;
		//if ( j >= 0 ) {
			ch = st.charAt ( j ) ;
		//}
		// look for (decimal) number
		if ( Astex.Util.isDigit ( ch ) ) {
			j-- ;
			// keep back-tracking and find digits
			if ( j >= 0 ) ch = st.charAt ( j ) ;
			while ( Astex.Util.isDigit ( ch ) ) {
				// get character
				if ( j >= 0 ) {
					// decrement j
					j-- ;
					ch = st.charAt ( j ) ;
				}
				else {
					break ;
				}
			}
			// take care of possible decimal point
			if ( ch == '.' ) {
				// keep back-tracking and find digits
				j-- ;
				if ( j >= 0 ) {
					ch = st.charAt ( j ) ;
				}
				while ( Astex.Util.isDigit ( ch ) ) {
					// get character
					if ( j >= 0 ) {
						// decrement j
						j-- ;
						ch = st.charAt ( j ) ;
					}
					else {
						break ;
					}
				}

			}
		}
		// if character immediately preceding ! is not a digit
		// see if it's a closing bracket, then
		// look for matching opening parentheses (, curly  brace {, bracket [
		else if ( ch == ')' || ch == '}' || ch == ']' ) {
			// keep track of nested parentheses
			if ( ch == ')' ) nestedp = 1 ;
			if ( ch == '}' ) nestedc = 1 ;
			if ( ch == ']' ) nestedb = 1 ;
			j-- ;
			// keep back-tracking
			while ( j >= 0 ) {
				ch = st.charAt ( j ) ;
				// decrement nested if we encounter opening (, {, [ 
				if ( ch == '(' ) nestedp-- ;
				if ( ch == '{' ) nestedc-- ;
				if ( ch == '[' ) nestedb-- ;
				// increment nested if we encounter closing ), }, ] 
				if ( ch == ')' ) nestedp++ ;
				if ( ch == '}' ) nestedc++ ;
				if ( ch == ']' ) nestedb++ ;

				j-- ;

				// if we're no longer in parentheses
				if ( nestedp == 0 && nestedc == 0 && nestedb == 0 ) {
					break ;
				}
			}
			// back-track and look for function names before ( ... )
			if ( j >= 0 ) {
				ch = st.charAt ( j ) ;
			}
			while ( Astex.Util.isAlpha ( ch ) ) {
				// get character
				if ( j >= 0 ) {
					// decrement j
					j-- ;
					ch = st.charAt ( j ) ;
				}
				else {
					break ;
				}
			}

		}
		// if character immediately preceding ! is not a digit
		// or an opening parentheses 
		// look for variables
		else if ( Astex.Util.isAlpha ( ch ) ) {
			j-- ;
			if ( j >= 0 ) {
				ch = st.charAt ( j ) ;
			}
			// keep back-tracking looking for letters
			while ( Astex.Util.isAlpha ( ch ) ) {
				// get character
				if ( j >= 0 ) {
					// decrement j
					j-- ;
					ch = st.charAt ( j ) ;
				}
				else {
					break ;
				}
			}
		}
		// return error message
		else { 
			return new Astex.Error ( "Error: ! incorrect syntax in " + st + " at position " + j , "Astex.Util.mathToJS" ) ; 
		}
		// concatenate substrings together to create factorial function
		// string position 0 -- > j come before factorial()
		// string position j + 1 -- > i is function argument
		// string position i + 1 -- > end of string comes after factorial(argument)
		st = st.substring ( 0 , j + 1 ) + "Astex.Math.factorial(" + st.substring ( j + 1 , i ) + ")" + st.substring ( i + 1 ) ;

	}


	// | x | --> abs(x)
	// count number of | they should be even
	var pipeCount = 0 ;
	for (var m = 0 ; m < st.length; m++ ) {
		// get char
		ch = st.charAt ( m ) ;
	       	if ( ch == '|' ) {
	 		pipeCount++ ;
		}
		// if pipeCount is odd, replace | with abs(
		// if pipeCount is even, replace | with )
	}
	if ( pipeCount % 2 != 0 ) {
		return new Astex.Error ( "Error: Missing | in " + st , "Astex.Util.mathToJS" ) ; 
	}
	while( ( i = st.indexOf ( "|" ) ) != -1 ) {
		// get character after |
		j = i + 1 ;
		ch = st.charAt ( j ) ;
		// keep moving forward until we find another |
		while ( ch != '|' ) {
			j++ ;
			if ( j >= 0 && j < st.length ) {
				ch = st.charAt ( j ) ;
			}
		}

		// concatenate substrings together to create absolute value function
		// string position 0 -- > i - 1 come before abs()
		// string position i is first |
		// string position i + 1 -- > j - 1 is function argument
		// string position j is second |
		// string position j + 1 -- > end of string comes after abs(argument)
		st = st.substring ( 0 , i ) + "Astex.Math.abs(" + st.substring ( i + 1 , j ) + ")" + st.substring ( j + 1 ) ;

	}


	//
	// maybe rewrite absoulte value above to also include greatest integer function (floor function?) ||x||
	//


	// return translated string
	return st;
};

/*--------------------------------------------------------------------------*/


