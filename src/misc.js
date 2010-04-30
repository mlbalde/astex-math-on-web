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

// make sure the browser implements a Node object
// this should be included in any JavaScript program
// which needs to iterate over HTML or XML nodes
if ( ! window.Node ) {
	var Node = { } ;
	// nodeType constants
	Node.ELEMENT_NODE                =  1 ;
	Node.ATTRIBUTE_NODE              =  2 ;
	Node.TEXT_NODE                   =  3 ;
	Node.CDATA_SECTION_NODE          =  4 ;
	Node.ENTITY_REFERENCE_NODE       =  5 ;
	Node.ENTITY_NODE                 =  6 ;
	Node.PROCESSING_INSTRUCTION_NODE =  7 ;
	Node.COMMENT_NODE                =  8 ;
	Node.DOCUMENT_NODE               =  9 ;
	Node.DOCUMENT_TYPE_NODE          = 10 ;
	Node.DOCUMENT_FRAGMENT_NODE      = 11 ;
	Node.NOTATION_NODE               = 12 ;
}

/*--------------------------------------------------------------------------*/
