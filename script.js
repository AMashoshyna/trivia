
var data = {};
// AJAX util
function req() {

    // reset to initial state
	clearLetterContainer();
	clearAnswerContainer();
	document.getElementById('incorrect-message').classList.add('hidden');
	document.getElementById('correct-message').classList.add('hidden');
	userAnswer = [];

 // fetch data from server - thnx for help to fellow kottan @wack17s
	const xhr = new XMLHttpRequest();
	xhr.open('GET', 'https://jservice.io/api/random', false);
	xhr.send();

	if(xhr.status !=200) {
		console.log(xhr.status + ': ' + xhr.statusText)
	} else {
		const res = JSON.parse(xhr.responseText);
		var answer = res[0].answer.toLowerCase().trim();
		if(!validateAnswer(answer)) {
			req();
		} else {

			const answer = res[0].answer.toLowerCase().trim();
			data.answer = answer;
			const question = res[0].question;
			const id = res[0].id;
			const category = res[0].category.title.toUpperCase();
			const shuffledAnswer = shuffle(answer);

			document.getElementById('question').innerHTML = question;
			document.getElementById('id').innerHTML = 'QUESTION ' + id;
			console.log(answer);
			document.getElementById('category').innerHTML =  'Category: ' + category;

			for(var i = 0; i < shuffledAnswer.length; i++) {
				var element = document.createElement('div');
				element.className += 'letter-cube';
				element.setAttribute('draggable', true);
				element.setAttribute('id', i);
				element.setAttribute('ondragstart', "drag(event)")
				element.innerHTML = shuffledAnswer[i];
				var parent = document.getElementById('letter-container');
				parent.appendChild(element);
			}
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

function validateAnswer(answer) {
	var regEx = /\s/;
	if(answer.search(regEx) !== -1) {
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
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
    if(checkDoubling(userAnswer, document.getElementById(data))) {
    	removeDouble(userAnswer, document.getElementById(data))
    }
    userAnswer.push({'letter': document.getElementById(data).innerHTML,
'id': document.getElementById(data).getAttribute('id') });
    console.log(userAnswer);
    if(!checkRemainingLetters()) {
	    	checkUserAnswer();
    }
};
function dropBack(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
    userAnswer.splice(userAnswer.indexOf(data), 1)
    console.log(userAnswer);
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
	debugger;
	var id = item.getAttribute('id');
	for(var i = 0; i < arr.length; i++) {
		if(arr[i].id === id) {
			arr.splice(i, 1);
			return;
		}
	}
	
}

var userAnswer = [];

function checkRemainingLetters() {
	var parent = document.getElementById('letter-container');
	if(parent.firstChild) {
		return true;
	} return false;
};

function checkUserAnswer() {
	var proposedAnswer = [];
	for(var i = 0; i < userAnswer.length; i++) {
		proposedAnswer.push(userAnswer[i].letter)
	}
	proposedAnswer = proposedAnswer.join('');
	if(proposedAnswer !== data.answer) {
		document.getElementById('incorrect-message').classList.remove('hidden');
	} else {
		document.getElementById('correct-message').classList.remove('hidden');
	}
}
