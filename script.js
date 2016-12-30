
var data = {};
data.answer = '';
data.round = 0;
data.score = 0;
var userAnswer = [];
var letter_container_elem = document.getElementById('letter-container');
var correct_message_elem = document.getElementById('correct-message');
var incorrect_message_elem = document.getElementById('incorrect-message');
var get_next_question_btn = document.getElementById('get-next-question');
var question_elem = document.getElementById('question');
var id_elem = document.getElementById('id');
var category_elem = document.getElementById('category');
var score_elem = document.getElementById('score');
var progress_elem = document.getElementById('progress');

// AJAX util
function req() {
	resetState();

// fetch data from server - thnx for help to fellow kottan @wack17s
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://jservice.io/api/random', false);
xhr.send();

if(xhr.status != 200) {
	console.log(xhr.status + ': ' + xhr.statusText)
} else {
	const res = JSON.parse(xhr.responseText);
	var nextAnswer = res[0].answer.toUpperCase().trim();
	if(!validateAnswer(nextAnswer)) {
		req();
	} else {
		data.answer = res[0].answer.toUpperCase().trim();
		data.round += 1;
		data.question = res[0].question;
		data.id = res[0].id;
		data.category = res[0].category.title;
		data.shuffledAnswer = shuffle(data.answer);
		showNewQuestion(data);
	}
};
};
req();

function resetState() {
	clearContainer(letter_container_elem);
	clearContainer(answer_container_elem);
	incorrect_message_elem.classList.add('hidden');
	correct_message_elem.classList.add('hidden');
	get_next_question_btn.classList.add('hidden');
	userAnswer = [];
};


function showNewQuestion(data) {
	question_elem.innerHTML = data.question;
	id_elem.innerHTML = 'QUESTION ' + data.id;
	console.log(data.answer);
	category_elem.innerHTML =  'Category: ' + data.category;
	document.getElementById('progress').innerHTML = "Total questions: " + data.round;
	document.getElementById('score').innerHTML = "Correct answers: " + data.score;

	for(var i = 0; i < data.shuffledAnswer.length; i++) {
		var boxElement = document.createElement('div');
		boxElement.className += 'letter-box';
		boxElement.setAttribute('ondrop', "drop(event)");
		boxElement.setAttribute('ondragover', "allowDrop(event)");
		answer_container_elem.appendChild(boxElement);
	}

	for(var i = 0; i < data.shuffledAnswer.length; i++) {
		var boxElement = document.createElement('div');
		boxElement.className += 'letter-box';
		boxElement.setAttribute('ondrop', "drop(event)");
		boxElement.setAttribute('ondragover', "allowDrop(event)");

		var element = document.createElement('div');
		element.className += 'letter';
		element.setAttribute('draggable', true);
		element.setAttribute('id', i);
		element.setAttribute('ondragstart', "drag(event)")
		element.innerHTML = data.shuffledAnswer[i];
		boxElement.appendChild(element);
		letter_container_elem.appendChild(boxElement);
	};
}

// credit: Andy Earnshaw http://stackoverflow.com/a/3943985/7024059
function shuffle (str) {
	var a = str.split(""),
	n = a.length;

	for(var i = n - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var tmp = a[i];
		a[i] = a[j];
		a[j] = tmp;
	}
	return a.join("");
};

//check if the answer is suitable, otherwise skip the question
function validateAnswer(answer) {
	var regExBlank = /\s/;
	var regExNonLetters = /[^a-z]/;
	if(answer.search(regExBlank) !== -1 || answer.length > 10 || answer.length < 2) {
		return false;
	} else {
		return true
	}
};

function clearContainer(elem)  {
	while(elem.firstChild) {
		elem.removeChild(elem.firstChild)
	}
};

// drag-n-drop
function allowDrop(ev) {
	ev.preventDefault();
}

function drag(ev) {
	ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
	ev.preventDefault();
	if(ev.target.getAttribute('class')!=="letter-box") {
		return;
	}
	var data = ev.dataTransfer.getData("text");
	ev.target.appendChild(document.getElementById(data));
	if(checkContainer(letter_container_elem, ev.target)) {
		// if letter is dragged from answer container back to letter container
		userAnswer.splice(userAnswer.indexOf(data), 1)
	} else {
		// if letter is dragged to answer container
		if(checkDoubling(userAnswer, document.getElementById(data))) {
			removeDouble(userAnswer, document.getElementById(data))
		}
		userAnswer.push({'letter': document.getElementById(data).innerHTML,
			'id': document.getElementById(data).getAttribute('id') });
		if(!checkRemainingLetters()) {
			checkUserAnswer();
		}
	}
};

function checkDoubling(arr, item) {
	var result = false;
	for (var i = 0; i < arr.length; i++) {
		var attr = item.getAttribute('id');
		if(arr[i].id === attr) {
			result = true;
			return result;
		} 
	};
	return result;
};

function removeDouble(arr, item) {
	var id = item.getAttribute('id');
	for(var i = 0; i < arr.length; i++) {
		if(arr[i].id === id) {
			arr.splice(i, 1);
			return;
		}
	}
}

function checkUserAnswer() {
	var proposedAnswer = [];
	for(var i = 0; i < userAnswer.length; i++) {
		proposedAnswer.push(userAnswer[i].letter)
	}
	proposedAnswer = proposedAnswer.join('');
	if(proposedAnswer !== data.answer) {
		incorrect_message_elem.classList.remove('hidden');
	} else {
		incorrect_message_elem.classList.add('hidden');
		correct_message_elem.classList.remove('hidden');
		get_next_question_btn.classList.remove('hidden');
		data.score +=1;
		score_elem.innerHTML = "Correct answers " + data.score;
	}
}

function checkRemainingLetters() {
	if(letter_container_elem.querySelectorAll(".letter").length > 0) {
		return true;
	} return false;
};

function checkContainer(container, child) {
	var node = child.parentNode;
	while (node != null) {
		if (node == container) {
			return true;
		}
		node = node.parentNode;
	}
	return false;
}
