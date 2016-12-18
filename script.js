function req() {
	const xhr = new XMLHttpRequest();
	xhr.open('GET', 'https://jservice.io/api/random', false);
	xhr.send();

	if(xhr.status !=200) {
		console.log(xhr.status + ': ' + xhr.statusText)
	} else {
		const res = JSON.parse(xhr.responseText);
		const question = res[0].question;
		const answer = res[0].answer;
		const id = res[0].id;
		const category = res[0].category.title;

	document.getElementById('question').innerHTML = question;
	document.getElementById('id').innerHTML = 'QUESTION ' + id;
	console.log(answer);
	document.getElementById('category').innerHTML =  'Category: ' + category;

	for(var i = 0; i < answer.length; i++) {
		var element = document.createElement('div');
		element.className += 'letter-cube';
		element.innerHTML = answer[i];
		var parent = document.getElementById('letter-soup');
		parent.appendChild(element);

	}


	};
};
req();