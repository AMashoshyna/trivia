
var data = {};
var buffer = {};
data.answer = '';
data.round = 0;
data.score = 0;
var userAnswer = [];
var answer_container_elem = document.getElementById('answer-container');
var letter_container_elem = document.getElementById('letter-container');
var correct_message_elem = document.getElementById('correct-message');
var incorrect_message_elem = document.getElementById('incorrect-message');
var skip_question_btn = document.getElementById('skip-question');
var get_next_question_btn = document.getElementById('get-next-question');
var question_elem = document.getElementById('question');
var id_elem = document.getElementById('id');
var category_elem = document.getElementById('category');
var score_elem = document.getElementById('score');
var progress_elem = document.getElementById('progress');

skip_question_btn.addEventListener('click', getNewQuestion, false);
get_next_question_btn.addEventListener('click', getNewQuestion, false);

getNewQuestion();

function getNewQuestion() {
	var response, nextAnswer;
	
	fetchData().then(function(resp) {
		console.log(resp)
		response = JSON.parse(resp);
		nextAnswer = response[0].answer.toUpperCase().trim();
		if(!validateAnswer(nextAnswer)) {
			getNewQuestion();
		} else {
			resetState();
			data.answer = response[0].answer.toUpperCase().trim();
			data.round += 1;
			data.question = response[0].question;
			data.id = response[0].id;
			data.category = response[0].category.title;
			data.shuffledAnswer = shuffle(data.answer);
			showNewQuestion(data);
		}

	}, function(Error) {
		console.log(Error);
	})

};
function fetchData(){
	return new Promise(function(resolve, reject) {
		const xhr = new XMLHttpRequest();
		xhr.open('GET', 'https://jservice.io/api/random', true);
		xhr.onload = function() {
			if (xhr.status === 200) {
				resolve(xhr.response);
			} else {
				reject(Error('The data didn\'t load successfully; error code:' + xhr.statusText));
			}
		};
		xhr.onerror = function() {
			reject(Error('There was a network error.'));
		};
		xhr.send();

	})
}

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
	progress_elem.innerHTML = "Total questions: " + data.round;
	score_elem.innerHTML = "Correct answers: " + data.score;

	for(var i = 0; i < data.shuffledAnswer.length; i++) {
		var boxElement = document.createElement('div');
		boxElement.className += 'letter-box';
		boxElement.setAttribute('id', i + "box"); 
		boxElement.addEventListener('drop', drop, false);
		boxElement.addEventListener('dragover', allowDrop, false);
		answer_container_elem.appendChild(boxElement);
	}

	for(var i = 0; i < data.shuffledAnswer.length; i++) {
		var boxElement = document.createElement('div');
		boxElement.className += 'letter-box';
		boxElement.addEventListener('drop', drop, false);
		boxElement.addEventListener('dragover', allowDrop, false);

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

// thnx for hint to fellow kottan zonzujiro
function shuffle(str) {
	var arr = str.split("");
	return arr.sort(() => 0.5 - Math.random()).join("");
}

//check if the answer is suitable, otherwise skip question
function validateAnswer(answer) {
	var regExBlank = /\s/;
	if(answer.search(regExBlank) !== -1 || answer.length > 10 || answer.length < 3) {
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
	ev.dataTransfer.setData("id", ev.target.id);
}

function drop(ev) {
	var index;
	var id = ev.dataTransfer.getData("id");
	ev.preventDefault();
	if(ev.target.getAttribute('class')!=="letter-box") {
		return;
	}
	
	ev.target.appendChild(document.getElementById(id));
	if(checkContainer(letter_container_elem, ev.target)) {
		// if letter is dragged from answer container back to letter container
		userAnswer.splice(userAnswer.indexOf(id), 1)
	} else {
		// if letter is dragged to answer container
		// if(checkDoubling(userAnswer, document.getElementById(data))) {
		// 	removeDouble(userAnswer, document.getElementById(data))
		// }
		console.dir(userAnswer);
		for(var i = 0; i < userAnswer.length; i++) {
			if(userAnswer[i] && userAnswer[i].id == id) {
				userAnswer[i] = {};
			}
		}
		index = parseInt(ev.target.getAttribute('id'));
		userAnswer[index] = {
			'letter': document.getElementById(id).innerHTML,
			'id': id
		};
		if(!checkRemainingLetters()) {
			checkUserAnswer();
		}
	}
};

function checkDoubling(arr, item) {
	var result = false;
	var attr;
	for (var i = 0; i < arr.length; i++) {
		attr = item.getAttribute('id');
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
		correct_message_elem.classList.add('hidden');
		get_next_question_btn.classList.add('hidden');
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
	return letter_container_elem.querySelectorAll(".letter").length > 0;
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
