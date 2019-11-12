const 
	// body = document.querySelector('body'),
	tilesNumber = document.querySelector('#settings span'),
	tilesInput = document.querySelector('#settings input'),
	startBtn = document.querySelector('#settings button[name=start]'),
	resetBtn = document.querySelector('#gameArea button[name=reset]'),
	hintBtn = document.querySelector('#gameArea button[name=hint]');

// var table = document.getElementById("game-board");
// var table, td, cols5;
// var tr = table.getElementsByTagName("tr");

let cardElements = document.getElementsByClassName('game-card');
let cardElementsArray = [];
let imgElements = document.getElementsByClassName('game-card-img');
let imgElementsArray = [];
let counter = document.getElementById('moveCounter');
let timer = document.getElementById('timer');
let gameArea = document.getElementById('gameArea');
let settings = document.getElementById('settings');
let row1 = document.getElementById('game-grid-row-1');
let row2 = document.getElementById('game-grid-row-2');
let row3 = document.getElementById('game-grid-row-3');
let row4 = document.getElementById('game-grid-row-4');
let rating5 = document.getElementById('label5');
let rating4 = document.getElementById('label4');
let rating3 = document.getElementById('label3');
let rating2 = document.getElementById('label2');
let container = document.getElementById('pikachu');
let ratings = document.getElementById('ratings');

let clicked = false;
let replay = false;
let openedCards = [];
let matchedCards =  [];
let moves;
let interval;
// var hoursLabel = document.getElementById("hours");
var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var totalSeconds = 0;
var totalMinutes =  minutesLabel.innerHTML;
let gameEnd = document.getElementById("gameEnd");
let main = document.getElementById("container");

	
function setTime(){
	++totalSeconds;
	secondsLabel.innerHTML = pad(totalSeconds%60);
	minutesLabel.innerHTML = pad(parseInt(totalSeconds/60));
//   hoursLabel.innerHTML = pad(parseInt(totalMinutes/60));
}


function pad(val){
	var valString = val + "";
	if(valString.length < 2){
		return "0" + valString;	
	} else{
		return valString;
	}
}


function shuffle(array) {
	let currentIndex = array.length,
		temporaryValue,
		randomIndex;

	while (currentIndex !==0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}


function startGame() {

	gameEnd.classList.add("display");
	main.style.opacity = '1';

	clearInterval(interval);

	container.classList.add("display");
	secondsLabel.innerHTML = 0;
	minutesLabel.innerHTML = 0;
	// hoursLabel.innerHTML = 0;
	totalSeconds = 0;
	totalMinutes =  minutesLabel.innerHTML;
	clicked = false;

	rating5.style.background = "url('./img/star-on-big.png')";
	rating5.style.backgroundSize= "30px 30px";
	
	rating4.style.background = "url('./img/star-on-big.png')";
	rating4.style.backgroundSize= "30px 30px";
	rating3.style.background = "url('./img/star-on-big.png')";
	rating3.style.backgroundSize= "30px 30px";
	rating2.style.background = "url('./img/star-on-big.png')";
	rating2.style.backgroundSize= "30px 30px";

	let shuffledImages = shuffle(imgElementsArray);

	for(i=0; i<shuffledImages.length; i++) {
		cardElements[i].innerHTML = "";
		cardElements[i].appendChild(shuffledImages[i]);
		cardElements[i].type = `${shuffledImages[i].alt}`;
		cardElements[i].classList.remove("show", "open", "match", "disabled");
		cardElements[i].children[0].classList.remove("show-img");
	}

	timer.classList.remove("display");
	
	for(let i = 0; i < cardElementsArray.length; i++) {
		cardElementsArray[i].addEventListener("click", displayCard)
	}

	flashCards();

	moves = 0;
	counter.innerText = `${moves}`;

	// for(let i=0; i<starElementsArray.length; i++) {
	// 	starElementsArray[i].style.opacity = 1;
	// }
	clearInterval(interval);
}


function flashCards() {
	for(i=0; i<cardElements.length; i++) {
		cardElements[i].children[0].classList.add("show-img")
	}
	setTimeout(function(){
		for(i=0; i<cardElements.length; i++) {
			if( !cardElements[i].classList.contains("match") )
				cardElements[i].children[0].classList.remove("show-img")
		}
	}, 1000)
}


function displayCard() {

	if( !clicked ) {
		interval = setInterval(setTime, 1000);
		clicked = true;
	}
	this.children[0].classList.toggle('show-img');
	this.classList.toggle("open");
	this.classList.toggle("show");
	this.classList.toggle("disabled");
	cardOpen(this);
}


function cardOpen(card) {
	openedCards.push(card);
	let len = openedCards.length;
	if(len === 2) {
		moveCounter();
		if(openedCards[0].type === openedCards[1].type) {
			matched();
		} else {
			unmatched();
		}
	}
}


function matched() {
	openedCards[0].classList.add("match");
	openedCards[1].classList.add("match");
	openedCards[0].style.opacity = "0.8";
	openedCards[1].style.opacity = "0.8";
	openedCards[0].classList.remove("show", "open");
	openedCards[1].classList.remove("show", "open");
	matchedCards.push(openedCards[0]);
	matchedCards.push(openedCards[1]);
	openedCards = [];
	if(matchedCards.length == tilesInput.value) {
		endGame();
	}
}


function unmatched() {
	openedCards[0].classList.add("unmatched");
	openedCards[1].classList.add("unmatched");
	disable();
	setTimeout(function() {
		openedCards[0].classList.remove("show", "open", "unmatched");
		openedCards[1].classList.remove("show", "open", "unmatched");
		openedCards[0].children[0].classList.remove('show-img');
		openedCards[1].children[0].classList.remove('show-img');
		enable();
		openedCards = [];
	}, 1000)
}


function disable() {
	cardElementsArray.filter((card, i, cardElementsArray) => {
		card.classList.add('disabled');
	})
}


function enable() {
	cardElementsArray.filter((card, i, cardElementsArray) => {
		card.classList.remove('disabled');
		for(let i=0; i<matchedCards.length; i++) {
			matchedCards[i].classList.add('disabled');
		}
	})
}


function moveCounter() {
	moves++;
	counter.innerHTML = `${moves}`;

	if(moves > ( (tilesInput.value/2) + (tilesInput.value/4) )) {
		rating5.style.background = "url('./img/star-off-big.png')";
		rating5.style.backgroundSize= "30px 30px";
	}
	if(moves > ( (tilesInput.value/2) + (tilesInput.value/4) + 3)) {
		rating4.style.background = "url('./img/star-off-big.png')";
		rating4.style.backgroundSize= "30px 30px";
	}
	if(moves > ( (tilesInput.value/2) + (tilesInput.value/4) + 6)) {
		rating3.style.background = "url('./img/star-off-big.png')";
		rating3.style.backgroundSize= "30px 30px";
	}
	if(moves > ( (tilesInput.value/2) + (tilesInput.value/4) + 10)) {
		rating2.style.background = "url('./img/star-off-big.png')";
		rating2.style.backgroundSize= "30px 30px";
	}
}

function endGame() {

	console.log("Over!");
	clearInterval(interval);
	main.style.opacity = '0.2';
    gameEnd.style.opacity = "1";
    gameEnd.classList.remove("display");
	// totalGameMovesElement.innerHTML = moves;
	matchedCards = [];
}


function playAgain() {
	startBtn.removeAttribute('disabled');
	// resetBtn.removeAttribute('disabled');
	tilesInput.removeAttribute('disabled');
	gameArea.classList.add("display");
	gameEnd.classList.add("display");

	start();
}


function start(){
	container.classList.add("display");
	gameArea.classList.remove("display");
	setTimeout(function() {
        startGame()
    }, 1200);
}


window.onload = function () {
	
	// ratings.classList.add("display");
	tilesInput.addEventListener('input', () => {
		tilesNumber.innerHTML = tilesInput.value;
	});

	// resetBtn.addEventListener('click', () => {
	// 	var cols6, cols7, cols8;
	// 	for (var i = 0; i < tr.length; i++) {
	// 	td = tr[i].getElementsByTagName("td");
	// 		cols5 = tr[i].getElementsByClassName("col5");
	// 		cols6 = tr[i].getElementsByClassName("col6");
	// 		cols7 = tr[i].getElementsByClassName("col7");
	// 		cols8 = tr[i].getElementsByClassName("col8");

	// 		for ( var j = 0; j < cols5.length; j++) {
	// 			if(tilesInput.value >= '32')
	// 				cols8[j].classList.add("display");
	// 			if(tilesInput.value >= '28')
	// 				cols7[j].classList.add("display");
	// 			if(tilesInput.value >= '24')
	// 				cols6[j].classList.add("display");
	// 			if(tilesInput.value >= '20')
	// 				cols5[j].classList.add("display");
	// 		}

	// 	gameEnd.classList.add("display")
	// 	gameArea.classList.add("display");
	// 	container.classList.remove("display");
	// 	timer.classList.add("display");
	// 	hintBtn.classList.remove("disabled");
	// 	replay = true;
	// 	ratings.classList.add("display");
	// 	settings.classList.remove("display");
	// 	startBtn.removeAttribute('disabled', '');
	// 	tilesInput.removeAttribute('disabled', '');
	// });

	
	hintBtn.addEventListener('click', () => {
		flashCards();
		totalSeconds += 120;
		hintBtn.classList.add("disabled");
	});

	startBtn.addEventListener('click', () => {

		settings.classList.add("display");
		ratings.classList.remove("display");
		startBtn.setAttribute('disabled', '');
		// resetBtn.setAttribute('disabled', '');
		tilesInput.setAttribute('disabled', '');

		if( tilesInput.value === '32'){
			row1.innerHTML += '<td class="game-card col8" id="game-card">' +
							  '<img class="game-card-img" src="img/p9.png" alt="poke9">' +
							  '</td>';
			row3.innerHTML += '<td class="game-card col8" id="game-card">' +
							  '<img class="game-card-img" src="img/p9.png" alt="poke9">' +
							  '</td>';
			row2.innerHTML += '<td class="game-card col8" id="game-card">' +
							  '<img class="game-card-img" src="img/p10.png" alt="poke10">' +
							  '</td>';
			row4.innerHTML += '<td class="game-card col8" id="game-card">' +
							  '<img class="game-card-img" src="img/p10.png" alt="poke10">' +
							  '</td>';
		}
		if( tilesInput.value >= '28'){
			row1.innerHTML += '<td class="game-card col7" id="game-card">' +
							  '<img class="game-card-img" src="img/p11.png" alt="poke11">' +
							  '</td>';
			row3.innerHTML += '<td class="game-card col7" id="game-card">' +
							  '<img class="game-card-img" src="img/p11.png" alt="poke11">' +
							  '</td>';
			row2.innerHTML += '<td class="game-card col7" id="game-card">' +
							  '<img class="game-card-img" src="img/p12.png" alt="poke12">' +
							  '</td>';
			row4.innerHTML += '<td class="game-card col7" id="game-card">' +
							  '<img class="game-card-img" src="img/p12.png" alt="poke12">' +
							  '</td>';
		}
		if( tilesInput.value >= '24'){
			row1.innerHTML += '<td class="game-card col6" id="game-card">' +
							  '<img class="game-card-img" src="img/p13.png" alt="poke13">' +
							  '</td>';
			row3.innerHTML += '<td class="game-card col6" id="game-card">' +
							  '<img class="game-card-img" src="img/p13.png" alt="poke13">' +
							  '</td>';
			row2.innerHTML += '<td class="game-card col6" id="game-card">' +
							  '<img class="game-card-img" src="img/p14.png" alt="poke14">' +
							  '</td>';
			row4.innerHTML += '<td class="game-card col6" id="game-card">' +
							  '<img class="game-card-img" src="img/p14.png" alt="poke14">' +
							  '</td>';
		}
		if( tilesInput.value >= '20'){
			row1.innerHTML += '<td class="game-card col5" id="game-card">' +
							  '<img class="game-card-img" src="img/p15.png" alt="poke15">' +
							  '</td>';
			row3.innerHTML += '<td class="game-card col5" id="game-card">' +
							  '<img class="game-card-img" src="img/p15.png" alt="poke15">' +
							  '</td>';
			row2.innerHTML += '<td class="game-card col5" id="game-card">' +
							  '<img class="game-card-img" src="img/p16.png" alt="poke16">' +
							  '</td>';
			row4.innerHTML += '<td class="game-card col5" id="game-card">' +
							  '<img class="game-card-img" src="img/p16.png" alt="poke16">' +
							  '</td>';
		}
		// for (var i=0; i<tilesInput.value; i++){
		// 	if(cardElements[i].classList.contains("display")){
		// 		continue;
		// 	}else{
		// 		cardElementsArray.push(cardElements[i]);
		// 		imgElementsArray.push(imgElements[i]);
		// 	}
		// }
		cardElementsArray = [...cardElements];
		imgElementsArray = [...imgElements];
		start();
	});

	

}