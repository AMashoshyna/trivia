function req() {
	const xhr = new XMLHttpRequest();
	xhr.open('GET', 'https://jservice.io/api/random', false);
	xhr.send();

	if(xhr.status !=200) {
		console.log(xhr.status + ': ' + xhr.statusText)
	} else {
		const res = JSON.parse(xhr.responseText);
		const question = res[0].question;
		const answer = res[0].answer.toLowerCase();
		const id = res[0].id;
		const category = res[0].category.title;
		const shuffledAnswer = shuffle(answer);

	document.getElementById('question').innerHTML = question;
	document.getElementById('id').innerHTML = 'QUESTION ' + id;
	console.log(answer);
	document.getElementById('category').innerHTML =  'Category: ' + category;



	for(var i = 0; i < shuffledAnswer.length; i++) {
		var element = document.createElement('div');
		element.className += 'letter-cube';
		element.setAttribute('draggable', true);
		element.innerHTML = shuffledAnswer[i];
		var parent = document.getElementById('letter-soup');
		parent.appendChild(element);

	}


	};
};
req();


// credit Andy Earnshaw http://stackoverflow.com/a/3943985/7024059

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
}