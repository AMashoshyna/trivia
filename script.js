
var data = {};
data.answer = '';
data.round = 0;
data.score = 0;
var userAnswer = [];

// AJAX util
function req() {

    // reset to initial state
    clearLetterContainer();
    clearAnswerContainer();
    document.getElementById('incorrect-message').classList.add('hidden');
    document.getElementById('correct-message').classList.add('hidden');
    document.getElementById('get-next-question').classList.add('hidden');
    userAnswer = [];

// fetch data from server - thnx for help to fellow kottan @wack17s
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://jservice.io/api/random', false);
xhr.send();

if(xhr.status != 200) {
	console.log(xhr.status + ': ' + xhr.statusText)
} else {
	const res = JSON.parse(xhr.responseText);
	var answer = res[0].answer.toUpperCase().trim();
	if(!validateAnswer(answer)) {
		req();
	} else {
		const answer = res[0].answer.toUpperCase().trim();
		data.answer = answer;
		data.round += 1;
		const question = res[0].question;
		const id = res[0].id;
		const category = res[0].category.title;
		const shuffledAnswer = shuffle(answer);

		document.getElementById('question').innerHTML = question;
		document.getElementById('id').innerHTML = 'QUESTION ' + id;
		console.log(answer);
		document.getElementById('category').innerHTML =  'Category: ' + category;
		document.getElementById('progress').innerHTML = "Total questions: " + data.round;
		document.getElementById('score').innerHTML = "Correct answers: " + data.score;

		for(var i = 0; i < shuffledAnswer.length; i++) {
			var boxElement = document.createElement('div');
			boxElement.className += 'letter-box';
			boxElement.setAttribute('ondrop', "drop(event)");
			boxElement.setAttribute('ondragover', "allowDrop(event)");
			document.getElementById('answer-container').appendChild(boxElement);
		}

		for(var i = 0; i < shuffledAnswer.length; i++) {
			var boxElement = document.createElement('div');
			boxElement.className += 'letter-box';
			boxElement.setAttribute('ondrop', "dropBack(event)");
			boxElement.setAttribute('ondragover', "allowDrop(event)");

			var element = document.createElement('div');
			element.className += 'letter';
			element.setAttribute('draggable', true);
			element.setAttribute('id', i);
			element.setAttribute('ondragstart', "drag(event)")
			element.innerHTML = shuffledAnswer[i];
			boxElement.appendChild(element);
			var parent = document.getElementById('letter-container');
			parent.appendChild(boxElement);
		};
	}
};
};
req();

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

function clearLetterContainer() {
	var parent = document.getElementById('letter-container');
	while(parent.firstChild) {
		parent.removeChild(parent.firstChild)
	}
};
function clearAnswerContainer() {
	var parent = document.getElementById('answer-container');
	while(parent.firstChild) {
		parent.removeChild(parent.firstChild)
	}
}

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
	if(checkDoubling(userAnswer, document.getElementById(data))) {
		removeDouble(userAnswer, document.getElementById(data))
	}
	userAnswer.push({'letter': document.getElementById(data).innerHTML,
		'id': document.getElementById(data).getAttribute('id') });
	ev.target.appendChild(document.getElementById(data));
	if(!checkRemainingLetters()) {
		checkUserAnswer();
	}
};

function dropBack(ev) {
	ev.preventDefault();
	if(ev.target.getAttribute('class')!=="letter-box") {
		return;
	}
	var data = ev.dataTransfer.getData("text");
	ev.target.appendChild(document.getElementById(data));
	userAnswer.splice(userAnswer.indexOf(data), 1)
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
		document.getElementById('incorrect-message').classList.remove('hidden');
	} else {
		document.getElementById('incorrect-message').classList.add('hidden');
		document.getElementById('correct-message').classList.remove('hidden');
		document.getElementById('get-next-question').classList.remove('hidden');
		data.score +=1;
		document.getElementById('score').innerHTML = "Correct answers " + data.score;
	}
}

function checkRemainingLetters() {
	var parent = document.getElementById('letter-container');
	if(parent.querySelectorAll(".letter").length > 0) {
		return true;
	} return false;
};
