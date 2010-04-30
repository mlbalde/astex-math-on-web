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




//
// Astex.Question class
//

// prototype: new Astex.Question ( String answer , String question , String support , String[] options , Int type ) ;
Astex.Question = function ( answer , question , support , options , type ) { 

	this.answer = answer ;		// "a", "b", "c", etc.
	this.question = question ;
	this.support = support ;
	this.options = options ;	// index -> options 
					// 0 -> "a" , 1 -> "b" , etc.
	this.type = type ;

	return this ;
};

//
// Astex.Question class variables
//

Astex.Question.MultipleChoice = 0 ;
Astex.Question.TrueFalse = 1 ;
Astex.Question.DataBases = new Array ( ) ;	// elements will be objects { name:... , questions:Astex.Question[] }

//
// Astex.Question instance methods
//

// prototype: String this.getOptionStringByLetter ( Char letter ) ;
Astex.Question.prototype.getOptionStringByLetter = function ( letter ) {

	// "a" -> 0, "b" -> 1, ... , "z" -> 25 , "A" -> 26 , "B" -> 27 , ... , "Z" -> 51
	if ( letter >= 'a' && letter <= 'z' ) {
	//if ( letter.match(/[a-z]/) ) {
		//return this.options[letter.charCodeAt(0) - "a".charCodeAt(0)] ;
		return this.options[letter.charCodeAt(0) - 97] ;
	}
	else if ( letter >= 'A' && letter <= 'Z' ) {
	//else if ( letter.match(/[A-Z]/) ) {
		//return this.options[letter.charCodeAt(0) - "A".charCodeAt(0) + 26] ;
		return this.options[letter.charCodeAt(0) - 65 + 26] ;
	}

};

//
// Astex.Question class methods
//
Astex.Question.processDataBases = function ( node ) {

	if ( ! node ) { node = document.body ; }

	// get all div's with class attribute 'AstexQuestionDB'
	var dbs = Astex.Util.getElementsByClass ( node , "div" , "AstexQuestionDB" ) ;

	//alert ( "There are " + dbs.length + " question databases." ) ;

	for ( var i = 0 ; i < dbs.length ; i++ ) {

		var db = dbs[ i ] ;

		// get data div contents
		var script = Astex.Plugin.getDataDivContentById ( db.getAttribute("id") ) ;
		script = Astex.Plugin.unescapeScript ( script ) ;
		script = Astex.Plugin.removeComments ( script ) ;

		/*
		var script ;
		if ( db.getAttribute("script") ) {
			script = db.getAttribute ( "script" ) ;
		}
		else {
			script = db.innerHTML ;
		}
		script = Astex.Plugin.unescapeScript ( script ) ;
		script = Astex.Plugin.removeComments ( script ) ;
		*/

		var originalScript = script ;

		// get source 
		//var srcInd = script.indexOf ( "SOURCE:" ) ;

		// get name
		var nameInd = script.indexOf ( "NAME:" ) ;
		var bqInd = script.indexOf ( "BEGIN QUESTION:" , nameInd ) ;
		var name = script.slice ( nameInd + 5 , bqInd ) ;
		name = name.replace ( /^\s*/ , "" ) ;
		name = name.replace ( /\s*$/ , "" ) ;

		// chop off NAME:....
		script = script.slice ( bqInd ) ;

		var qArray = new Array ( ) ;

		// get questions
		var questions = script.split ( "BEGIN QUESTION:" ) ;
		//alert ( questions.length ) ;
		//alert ( questions ) ;
		for ( var q = 1 ; q < questions.length ; q++ ) {		// index 0 is empty

			var type , answer , question , feedback ;
			var distractors = new Array ( ) ;

			// order of data
			// TYPE:mc|tf
			// ANSWER:text
			// QUESTION:text
			// FEEDBACK:text
			// DIST(RACTOR):text (may occur multiple times,only used when type is tf/mc)

			// get type
			var typeInd = questions[q].indexOf ( "TYPE:" ) ;
			var ansInd = questions[q].indexOf ( "ANSWER:" , typeInd + 1 ) ;
			type = questions[q].slice ( typeInd + 5 , ansInd ) ;
			type = type.replace ( /\s*/g , "" ) ;
			//alert ( type ) ;

			// chop off TYPE:...
			questions[q] = questions[q].slice ( ansInd ) ;

			// get answer
			var ansInd = questions[q].indexOf ( "ANSWER:" ) ;
			var quesInd = questions[q].indexOf ( "QUESTION:" , ansInd + 1 ) ;
			answer = questions[q].slice ( ansInd + 7 , quesInd ) ;
			//alert ( answer ) ;

			// chop off ANSWER:...
			questions[q] = questions[q].slice ( quesInd ) ;

			// get question 
			var quesInd = questions[q].indexOf ( "QUESTION:" ) ;
			var feedInd = questions[q].indexOf ( "FEEDBACK:" , quesInd + 1 ) ;
			question = questions[q].slice ( quesInd + 9 , feedInd ) ;
			//alert ( question ) ;

			// chop off QUESTION:...
			questions[q] = questions[q].slice ( feedInd ) ;

			// get feedback 
			var feedInd = questions[q].indexOf ( "FEEDBACK:" ) ;
			var distInd = questions[q].indexOf ( "DISTRACTOR:" ) ;
			if ( distInd == -1 ) {						// tf
				feedback = questions[q].slice ( feedInd + 9 ) ;
				//feedback = feedback.replace ( /\s*$/ , "" ) ;
			}
			else {
				feedback = questions[q].slice ( feedInd + 9 , distInd ) ;

				// chop off FEEDBACK:...
				questions[q] = questions[q].slice ( distInd ) ;
			}
			//alert ( feedback ) ;

			// get distractors
			if ( distInd != -1 ) {

				var tmpdistractors = questions[q].split ( "DISTRACTOR:" ) ;

				for ( var dInd = 1 ; dInd < tmpdistractors.length ; dInd++ ) {		// index 0 is empty

					var dist = tmpdistractors[ dInd ] ;
					distractors.push ( dist ) ;	
					//alert ( dist ) ;
				}
			}

			// append Astex Question to qArray
			if ( distInd == -1 && type.match(/tf/i) ) {		// tf

				if ( answer.match(/false/i) ) {
					answer = false ;
				}
				else {
					answer = true ;
				}
				// for some reason, the true/false markup between ` ` are NOT being
				// updated in Astex.Quiz
				// adding amath endamath for autorecognize mode solves the problem
				// in FireFox ( but causes buttons not to work in IE )
				//qArray.push ( new Astex.TFQuestion ( answer , "amath endamath<b>True</b> or <b>False</b>. " + question , feedback ) ) ;
				//qArray.push ( new Astex.TFQuestion ( answer , "<b>True</b> or <b>False</b>. " + question , feedback ) ) ;
				//qArray.push ( new Astex.TFQuestion ( answer , "<b>True</b> or <b>False</b>. `{::}`" + question , feedback ) ) ;
				qArray.push ( new Astex.TFQuestion ( answer , "\\begin{bold}True/False\\end{bold}. `{::}` " + question , feedback ) ) ;
			}
			else {
				qArray.push ( new Astex.MCQuestion ( answer , question , feedback , distractors ) ) ;
			}

		}

		// append to Astex.Question.DataBases
		Astex.Question.DataBases.push ( { name:name , questions:qArray } ) ;
	}

};

/*--------------------------------------------------------------------------*/

//
// Astex.TFQuestion class
//

// prototype: new Astex.TFQuestion ( String/Boolean answer , String question , String explanation ) ;
Astex.TFQuestion = function ( answer , question , explanation ) {

	if ( typeof answer == "boolean" ) {
		if ( answer ) { answer = "a" ; }		// "a" -> True
		else { answer = "b" ; }				// "b" -> False
	}
	else if ( typeof answer == "string" ) {
		if ( answer.match(/true/i) ) { answer = "a" ; }
		else { answer = "b" ; }
	}
	else {
		answer = "a" ;
	}

	// return an Astex.Question object
	return new Astex.Question ( answer , question , explanation , ["True","False"] , Astex.Question.TrueFalse ) ;
};

/*--------------------------------------------------------------------------*/

//
// Astex.MCQuestion class
//

// prototype: new Astex.MCQuestion ( String answer , String question , String explanation , String[] distractors ) ;
Astex.MCQuestion = function ( answer , question , explanation , distractors ) {

	// create options array and push answer and distractors into it
	var options = new Array ( ) ;
	options.push ( answer ) ;
	for ( var i = 0 ; i < distractors.length ; i++ ) {
		options.push ( distractors[i] ) ;
	}

	// shuffle the options array passing it a random sort function
	options.sort ( Astex.Util.randomSort ) ;

	// find the index of the options array which holds answer
	var index = 0 ;
	for ( var i = 0 ; i < options.length ; i++ ) {
		if ( options[ i ] == answer ) {
			index = i ;
			break ;
		}
	}

	// create an array to hold the letter options
	//var letterOptions = new Array ( "a" , "b" , "c" , "d" , "e" ) ;
	var letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" ;
	var letterOptions = new Array ( ) ;
	for ( var i = 0 ; i < letters.length ; i++ ) {
		letterOptions.push ( letters.charAt(i) ) ;
	}

	// return an Astex.Question object
	return new Astex.Question ( letterOptions[index] , question , explanation , options , Astex.Question.MultipleChoice ) ;
};

/*--------------------------------------------------------------------------*/

//
// Astex.Quiz class
//

// prototype: new Astex.Quiz ( Int numQuestions ) ;
Astex.Quiz = function ( numQuestions ) {

	this.name = "" ;

	this.questions = new Array ( ) ; 
	this.numQuestions = numQuestions ;

	this.questionIndex = 0 ;
	this.numCorrect = 0 ;
	this.ok2Stop = false ;
	this.responses = new Array ( ) ;

	this.node = document.createElement ( "div" ) ;			// this will be inserted into document
	if ( ! Astex.Util.isIE ) {
		this.node.setAttribute ( "class" , "Astex-Quiz-Div" ) ;		// ie does not use css for this class !!!
	}
	else {
		this.node.innerHTML += "<div class='Astex-Quiz-Div'></div>" ;	// ie workaround
		//this.node = this.node.firstChild ;
		this.node = this.node.childNodes[0] ;
	}

	Astex.Quiz.Quizzes.push ( this ) ;
	this.quizIndex = Astex.Quiz.Quizzes.length - 1 ;

	return this ;
};

// Astex.Quiz class variables
//
//
Astex.Quiz.Quizzes = new Array ( ) ;

//
// Astex.Quiz instance methods
//

// prototype: this.addQuestion ( Astex.Question q ) ;
Astex.Quiz.prototype.addQuestion = function ( q ) {

	this.questions.push ( q ) ;
};

// prototype: this.init ( ) ;
Astex.Quiz.prototype.init = function ( ) {
	// shuffle questions
	this.shuffle ( ) ;
	// build first question
	this.buildQuestion ( ) ;
	// update math markup, graphs, etc.
	//this.update ( this.node ) ;
};

// prototype: this.reset ( ) ;
Astex.Quiz.prototype.reset = function ( ) {

	// reset appropriate variables
	this.questionIndex = 0 ;
	this.numCorrect = 0 ;
	this.ok2Stop = false ;
	this.responses = new Array ( ) ;

	this.node.innerHTML = "" ;
	this.init ( ) ;
	//var quiz = this.node.parentNode ;	// should be a <div class="AstexQuiz"> div
	//quiz.innerHTML = "" ;
	//Astex.Quiz.processQuiz ( quiz ) ;

};

// prototype: this.shuffle ( ) ;
// shuffle the order of questions
Astex.Quiz.prototype.shuffle = function ( ) {

	for ( var i = 0 ; i < this.questions.length ; i++ ) {

		var j = Math.floor ( Math.random ( ) * this.questions.length ) ;
		var tmp = this.questions[ i ] ;
		this.questions[ i ] = this.questions[ j ] ;
		this.questions[ j ] = tmp ;
	}
};

// prototype: void this.gradeQuestion ( ) ;
Astex.Quiz.prototype.gradeQuestion = function ( ) {

	var str = "" ;

	// compare student responses with correct answers
	var i = this.questionIndex - 1 ;
	if ( this.responses[i] == this.questions[i].answer ) {
		this.numCorrect++ ;
		str += "<br />" ;
		str += "<div class='Astex-Quiz-Correct-Div'>Correct! </div>" ;
		str += "<br />" ;
		str += "<div class='Astex-Quiz-Question-Div'>Question: </div>" + this.questions[i].question + "<br />" ;
		str += "<br />" ;
		str += "<div class='Astex-Quiz-Correct-Answer-Div'>Correct Answer: </div> The answer is (" + this.questions[i].answer + ") " ;
		str += this.questions[i].getOptionStringByLetter(this.questions[i].answer) ;
		str += "<br />" ;
	}
	else {
		str += "<br />" ;
		str += "<div class='Astex-Quiz-Incorrect-Div'>Incorrect! </div>" ;
		str += "<br />" ;
		str += "<div class='Astex-Quiz-Question-Div'>Question. </div>" + this.questions[i].question + "<br />" ;
		str += "<br />" ;
		str += "<div class='Astex-Quiz-User-Answer-Div'>Your Answer: </div> Your answer is (" + this.responses[i] + ") " ;
		str += this.questions[i].getOptionStringByLetter(this.responses[i]) ;
		str += "<br />" ;
		str += "<br />" ;
		str += "<div class='Astex-Quiz-Correct-Answer-Div'>Correct Answer: </div> The correct answer is (" + this.questions[i].answer + ") " ;
		str += this.questions[i].getOptionStringByLetter(this.questions[i].answer) ;
		str += "<br />" ;
	}

	this.node.innerHTML = "" ;
	var d = document.createElement ( "div" ) ;
	d.innerHTML = "" ;
	d.innerHTML += "<div class='Astex-Quiz-Title-Div'>" + this.name + "&nbsp;&nbsp;&nbsp; Question: " + (this.questionIndex) + " of " + this.numQuestions + "</div>" ;
	d.innerHTML += str ;
	d.innerHTML += "<br />" ;
	d.innerHTML += "<div class='Astex-Quiz-Feedback-Div'>Feedback: </div> " + this.questions[i].support ;
	d.innerHTML += "<br />" ;
	d.innerHTML += "<br />" ;
	this.node.appendChild ( d ) ;

	// update math markup, graphs, etc.
	//this.update ( d ) ;
	this.update ( this.node ) ;

	// create a continue button to build next question
	this.node.appendChild ( this.makeButton("","","build") ) ;
};

// prototype: this.makeButton ( String optionLetter , String optionText , String type )
// returns a div element containing a radio button and its corresponding text
Astex.Quiz.prototype.makeButton = function ( optionLetter , optionText , type ) {

	if ( ! type ) { type = "build" ; }		// build, grade, and reset buttons

	// create a div element
	var div = document.createElement ( "div" ) ;

	// create a radio button element using an input element and append to the div element
	if ( Astex.Util.isIE ) {
		var input = document.createElement ( "button" ) ;
	}
	else {
		var input = document.createElement ( "input" ) ;
	}

	div.appendChild ( input ) ;

	// set appropriate attributes for radio button element
	if ( type == "grade" ) {
		input.setAttribute ( "type" , "radio" ) ;
		input.setAttribute ( "name" , "answer" ) ;
		input.setAttribute ( "value" , optionLetter ) ;
	}
	else if ( type == "build" ) {
		input.setAttribute ( "type" , "submit" ) ;
		input.setAttribute ( "value" , "continue" ) ;
	}
	else if ( type == "reset" ) {
		input.setAttribute ( "type" , "submit" ) ;
		input.setAttribute ( "value" , "reset" ) ;
	}

	if ( Astex.Util.isIE ) {
		var quizInd = this.quizIndex ;
		var questInd = this.questionIndex ;
		if ( type == "grade" ) {
			// this won't work
			/*
			input.onclick = function ( event ) {
				Astex.Quiz.Quizzes[quizInd].responses[questInd] = this.value ;		// this refers to input button
				Astex.Quiz.Quizzes[quizInd].gradeQuestion() ;
			};
			*/
			// this does
			input.setAttribute ( "onclick" , "Astex.Quiz.Quizzes[" + this.quizIndex + "].responses[" + this.questionIndex + "] = this.value; Astex.Quiz.Quizzes[" + this.quizIndex + "].gradeQuestion();" ) ;
		}
		else if ( type == "build" ) {
			input.onclick = function ( event ) {
				Astex.Quiz.Quizzes[quizInd].buildQuestion() ;
			};
		}
		else if ( type == "reset" ) {
			input.onclick = function ( event ) {
				Astex.Quiz.Quizzes[quizInd].reset() ;
			};
		}
	}
	else {
		if ( type == "grade" ) {
			input.setAttribute ( "onclick" , "Astex.Quiz.Quizzes[" + this.quizIndex + "].responses[" + this.questionIndex + "] = this.value; Astex.Quiz.Quizzes[" + this.quizIndex + "].gradeQuestion();" ) ;
		}
		else if ( type == "build" ) {
			input.setAttribute ( "onclick" , "Astex.Quiz.Quizzes[" + this.quizIndex + "].buildQuestion();" ) ;
		}
		else if ( type == "reset" ) {
			input.setAttribute ( "onclick" , "Astex.Quiz.Quizzes[" + this.quizIndex + "].reset();" ) ;
		}
	}


	// add a,b,c,etc. after radio button for nonIE browsers
	if ( ! Astex.Util.isIE && type == "grade" ) {
		div.appendChild ( document.createTextNode ( optionLetter + ".) " ) ) ;
	}

	// append text to div element
	if ( type == "grade" ) {
		div.appendChild ( document.createTextNode ( optionText ) ) ;
	}

	// return the div element
	return div ;
};


// prototype: this.buildQuestion ( )
Astex.Quiz.prototype.buildQuestion = function ( ) {

	//alert ( "called" ) ;

	if ( this.questionIndex == this.numQuestions ) {
		this.node.innerHTML = "<div class='Astex-Quiz-Title-Div'>" + this.name + "&nbsp;&nbsp;&nbsp;" + "You scored " + this.numCorrect + "/" + this.numQuestions + "</div>" ;
		this.node.innerHTML += "<br />" ;
		this.node.innerHTML += "<br />" ;
		this.node.appendChild ( this.makeButton ( "" , "" , "reset" ) ) ;
		return ;
	}

	// create a div element
	var div = document.createElement ( "div" ) ;

	// IE does not like how we set class attribute dynamically below
	// innerHTML seems to work though
	/*
	// create an h2 element, append text to it, and append to div
	//var h2 = document.createElement ( "h2" ) ;
	var h2 = document.createElement ( "div" ) ;
	if ( Astex.Util.isIE ) {
		h2.class = "Astex-Quiz-Title-Div" ;
	}
	else {
		h2.setAttribute ( "class" , "Astex-Quiz-Title-Div" ) ;
	}
	h2.appendChild ( document.createTextNode ( "Question " + (this.questionIndex + 1) + " of " + this.numQuestions ) ) ;
	h2.innerHTML += "&nbsp;&nbsp;&nbsp;" ;
	h2.appendChild ( document.createTextNode ( "Score " + this.numCorrect + "/" + this.numQuestions ) ) ;
	div.appendChild ( h2 ) ;
	*/
	var h2 = "<div class='Astex-Quiz-Title-Div'>" + this.name ;
	h2 += "&nbsp;&nbsp;&nbsp;" ;
	h2 += "Question " + (this.questionIndex + 1) + " of " + this.numQuestions ;
	h2 += "&nbsp;&nbsp;&nbsp;" ;
	h2 += "Score " + this.numCorrect + "/" + this.numQuestions ;
	h2 += "</div>" ;
	div.innerHTML += h2 ;

	// create a form element and append to div
	//var form = document.createElement ( "form" ) ;
	var form = document.createElement ( "div" ) ;
	div.appendChild ( form ) ;

	form.appendChild ( document.createElement ( "br" ) ) ;
	form.appendChild ( document.createElement ( "br" ) ) ;

	/*
	// create a b element, append text to it, and append to form
	//var b = document.createElement ( "b" ) ;
	var b = document.createElement ( "div" ) ;
	//b.setAttribute ( "class" , "Astex-Quiz-Question-Div" ) ;
	if ( Astex.Util.isIE ) {
		b.class = "Astex-Quiz-Question-Div" ;
	}
	else {
		b.setAttribute ( "class" , "Astex-Quiz-Question-Div" ) ;
	}
	b.appendChild ( document.createTextNode ( this.questions[ this.questionIndex ].question ) ) ;
	form.appendChild ( b ) ;
	*/
	var b = "<div class='Astex-Quiz-Question-Div'>Question: </div> " ;
	b += "<div style=\"display:inline;\" class='Astex-Quiz-Question-Block-Div'>" ;
	b += this.questions[ this.questionIndex ].question ;
	b += "</div>" ;
	form.innerHTML += b ;

	// append some br elements to form for appearance sake
	form.appendChild ( document.createElement ( "br" ) ) ;
	form.appendChild ( document.createElement ( "br" ) ) ;

	var letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" ;
	// append buttons to form and a br element after each one
	for ( var i = 0 ; i < this.questions[this.questionIndex].options.length ; i++ ) {

		form.appendChild ( this.makeButton( letters.charAt(i) , this.questions[this.questionIndex].options[i] , "grade" ) ) ;
		form.appendChild ( document.createElement ( "br" ) ) ;
		form.appendChild ( document.createElement ( "br" ) ) ;
	}

	// Increment variables for the next question
	this.questionIndex++ ;

	// Allow early quitting
	if ( this.questionIndex >= 1 && ! this.ok2Stop ) { this.ok2Stop = true ; }

	// reset this.node and append div element to it
	this.node.innerHTML = "" ;
	this.node.appendChild ( div ) ;

	// update math markup, graphs, etc.
	this.update ( this.node ) ;

	/*
	if ( this.questions[ this.questionIndex - 1 ].type == Astex.Question.TrueFalse ) {
		var qDiv = Astex.Util.getElementsByClass ( this.node , "div" , "Astex-Quiz-Question-Block-Div" ) ;
		alert ( qDiv.length ) ;
		this.update ( qDiv[0] ) ;
	}
	*/
};

// prototype: this.update ( HTMLElement node ) ;
Astex.Quiz.prototype.update = function ( node ) {

	if ( ! node ) { node = this.node ; }

	Astex.process ( node ) ;
	//Astex.Plugin.processPlugins ( node ) ;
};


//
// Astex.Quiz class methods
//


Astex.Quiz.processQuizzes = function ( node ) {

	if ( ! node ) { node = document.body ; }

	// get all div's with class attribute 'AstexQuiz'
	var quizzes = Astex.Util.getElementsByClass ( node , "div" , "AstexQuiz" ) ;

	//while ( quizzes.length > 0 ) {
	for ( var qInd = 0 ; qInd < quizzes.length ; qInd++ ) {

		Astex.Quiz.processQuiz ( quizzes[qInd] ) ;
	}
};

// prototype: Astex.Quiz.processQuiz ( HTMLElement quiz )
Astex.Quiz.processQuiz = function ( quiz ) {

		var numQuizQuestions = 0 ;
		var qArray = new Array ( ) ;

		/*
		// get script attribute of quiz 
		var script ;
		if ( quiz.getAttribute("script") ) {
			script = quiz.getAttribute ( "script" ) ;
		}
		else {
			script = quiz.innerHTML ;
		}
		//var originalScript = script ;
		script = Astex.Plugin.unescapeScript ( script ) ;
		script = Astex.Plugin.removeComments ( script ) ;
		//alert ( script ) ;
		*/

		// get data div contents
		var script = Astex.Plugin.getDataDivContentById ( quiz.getAttribute("id") ) ;
		script = Astex.Plugin.unescapeScript ( script ) ;
		script = Astex.Plugin.removeComments ( script ) ;

		// if there is a width , height value(s) (as in graph.js)
		// override width and height in style sheet!!!

		var commands = script.split ( ";" ) ;
		var commandStr = [ "name" , "width" , "height" , "use" ] ;
		var name , width = null , height = null ;

		for ( var c = 0 ; c < commands.length ; c++ ) {

			var command = commands[ c ] ;

			if ( command.match(/\s*name\s*=/i) ) {
				command = command.replace ( /\s*name\s*=\s*/i , "" ) ;
				name = command.replace ( /\s*$/g , "" ) ;
				//alert ( name ) ;
			}
			if ( command.match(/\s*width\s*=/i) ) {
				command = command.replace ( /\s*width\s*=\s*/i , "" ) ;
				width = command.replace ( /\s*$/g , "" ) ;
				width = parseInt ( width ) ;
				//alert ( width ) ;
			}
			if ( command.match(/\s*height\s*=/i) ) {
				command = command.replace ( /\s*height\s*=\s*/i , "" ) ;
				height = command.replace ( /\s*$/g , "" ) ;
				height = parseInt ( height ) ;
				//alert ( height ) ;
			}
			if ( command.match(/\s*use\s*/i) ) {
				// use 2 questions from This db
				// use 1 questions from That db
				var data = command.match ( /\s*use\s*([0-9]*)\s*questions?\s*from\s*(.*)\s*db\s*/i ) ;
				//alert ( data[1] ) ;
				var numQ = parseInt ( data[1] ) ;
				//alert ( data[2] ) ;
				var dbName = data[2].replace ( /\s*$/ , "" ) ;
				dbName = dbName.replace ( /^\s*/ , "" ) ;


				// update number quiz questions
				numQuizQuestions += numQ ;

				// get appropriate db from Astex.Question.DataBases
				// shuffle/sort it and get numQ questions
				// add these to the quiz question array
				for ( var i = 0 ; i < Astex.Question.DataBases.length ; i++ ) {

					var db = Astex.Question.DataBases[ i ] ;
					if ( db.name == dbName ) {

						// shuffle questions
						db.questions.sort ( Astex.Util.randomSort ) ;

						// push questions onto qArray
						for ( var j = 0 ; j < numQ ; j++ ) {

							qArray.push ( db.questions[j] ) ;							
						}
						break ;
					}
				}
			}
		}

		// create aquiz and add questions to it
		var aquiz = new Astex.Quiz ( numQuizQuestions ) ;
		aquiz.name = name ;
		for ( var i = 0 ; i < qArray.length ; i++ ) {

			aquiz.addQuestion ( qArray[ i ] ) ;
		}

		// we initialize aquiz after it's appended to quiz 
		// this ensures that update() is called to process math and graph markup
		quiz.appendChild ( aquiz.node ) ;

		// override default width and height set in css file
		if ( width ) { aquiz.node.style.width = width ; }
		if ( height ) { aquiz.node.style.height = height ; }

		aquiz.init ( ) ;
};

/*--------------------------------------------------------------------------*/

