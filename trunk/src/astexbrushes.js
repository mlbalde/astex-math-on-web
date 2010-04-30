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


/* Syntax Highligher Brushes for use with ASTEX */

SyntaxHighlighter.regexLib.astexAMathMarkup = /`[^`]*`/g ;
SyntaxHighlighter.regexLib.astexLMathMarkup = /\$[^\$]*\$/g ;

SyntaxHighlighter.astexPluginKeywords = "doc code amath lmath graph siteheader questiondb quiz docLink exLink " ;
SyntaxHighlighter.astexPluginInitKeywords = "begin end " ;

SyntaxHighlighter.astexPluginDocKeywords = "STYLE TITLE BEGIN PAGE LEVEL CONTENT " ;
SyntaxHighlighter.astexPluginQuestionDBKeywords = "NAME QUESTION TYPE ANSWER QUESTION FEEDBACK DIST DISTRACTOR " ;
SyntaxHighlighter.astexPluginQuizKeywords = "name use question questions from db " ;

SyntaxHighlighter.astexPluginGraphKeywords = "dim width height bgcolor xmin xmax xscale xscl ymin ymax yscale yscl zmin zmax zscale zscl " ;
SyntaxHighlighter.astexPluginGraphKeywords += "rmin rmax thetamin thetamax rhomin rhomax phimin phimax smin smax tmin tmax " ;
SyntaxHighlighter.astexPluginGraphKeywords += "color data stroke opacity grid border axeslabels axes tickmarks ticklabels LHS controls " ;

SyntaxHighlighter.astexPluginCCodeKeywords += "codespace codetab codenewline " ;

SyntaxHighlighter.astexPluginGraphPlot3DKeywords = "rect sph cyl param vvf polar " ;	// remove polar?

SyntaxHighlighter.astexPluginGraphFunctions = "plot fillplot histogram fillhistogram surfacecolor dot footer mtext plot3d partition viewer " ; 

// Astex.Doc
SyntaxHighlighter.brushes.Doc = function ( ) {
	
	var inits =  'begin end' ;
	
	this.regexList = [
		{ regex: SyntaxHighlighter.regexLib.multiLineCComments , css: 'comments' } ,
		{ regex: SyntaxHighlighter.regexLib.astexAMathMarkup , css: 'color2' } ,
		{ regex: SyntaxHighlighter.regexLib.astexLMathMarkup , css: 'color2' } ,
		{ regex: new RegExp(this.getKeywords(SyntaxHighlighter.astexPluginKeywords), 'gmi') , css: 'string bold' } ,
		{ regex: new RegExp(this.getKeywords(SyntaxHighlighter.astexPluginInitKeywords), 'gm') , css: 'color3' } ,
		{ regex: new RegExp(this.getKeywords(SyntaxHighlighter.astexPluginDocKeywords), 'gm') ,	css: 'keyword' } ,
		{ regex: new RegExp(this.getKeywords(SyntaxHighlighter.astexPluginQuestionDBKeywords), 'gm') ,	css: 'keyword' } ,
		{ regex: new RegExp(this.getKeywords(SyntaxHighlighter.astexPluginQuizKeywords), 'gm') ,	css: 'keyword' } ,
		{ regex: new RegExp(this.getKeywords(SyntaxHighlighter.astexPluginCCodeKeywords), 'gmi') , css: 'color1' } ,	// make different from above
		{ regex: new RegExp(this.getKeywords(SyntaxHighlighter.astexPluginGraphKeywords), 'gmi') , css: 'color1' } ,	// make different from above
		{ regex: new RegExp(this.getKeywords(SyntaxHighlighter.astexPluginGraphPlot3DKeywords), 'gm') , css: 'color3' } ,
		{ regex: new RegExp(this.getKeywords(SyntaxHighlighter.astexPluginGraphFunctions), 'gim') ,css: 'functions bold' }
	];
	
	//this.forHtmlScript(SyntaxHighlighter.regexLib.scriptScriptTags);
};

SyntaxHighlighter.brushes.Doc.prototype	= new SyntaxHighlighter.Highlighter ( ) ;
SyntaxHighlighter.brushes.Doc.aliases	= ['astex-doc'] ;

// Astex.Graph
// AMath
// LMath
// SiteHeader
// Code

// Astex.Graph
SyntaxHighlighter.brushes.Graph = function ( ) {

	this.regexList = [
		{ regex: SyntaxHighlighter.regexLib.multiLineCComments , css: 'comments' } ,
		{ regex: SyntaxHighlighter.regexLib.astexAMathMarkup , css: 'color2' } ,
		{ regex: SyntaxHighlighter.regexLib.astexLMathMarkup , css: 'color2' } ,
		{ regex: new RegExp(this.getKeywords(SyntaxHighlighter.astexPluginKeywords), 'gmi') , css: 'string bold' } ,
		{ regex: new RegExp(this.getKeywords(SyntaxHighlighter.astexPluginInitKeywords), 'gm') , css: 'color3' } ,
		{ regex: new RegExp(this.getKeywords(SyntaxHighlighter.astexPluginGraphKeywords), 'gmi') , css: 'keyword' } ,
		{ regex: new RegExp(this.getKeywords(SyntaxHighlighter.astexPluginGraphPlot3DKeywords), 'gm') , css: 'color3' } ,
		{ regex: new RegExp(this.getKeywords(SyntaxHighlighter.astexPluginGraphFunctions), 'gim') ,css: 'functions bold' }
	];
	
	//this.forHtmlScript(SyntaxHighlighter.regexLib.scriptScriptTags);
};

SyntaxHighlighter.brushes.Graph.prototype = new SyntaxHighlighter.Highlighter ( ) ;
SyntaxHighlighter.brushes.Graph.aliases	= ['astex-graph'] ;

