var compareCard = null;
var isComparing = false;
var delayTime = 1200;

const cardList = document.querySelectorAll(".card");

// Star Variables
const stars = document.querySelectorAll(".fa-star");
var starNum = stars.length;

// Move Variables
var moveCounter = 0;
const counter = document.querySelector(".moves");

// Timer Variables
var totalTime = 0;
var timer = null;
var isTimeStart = false;
const timerPanel = document.querySelector(".timer");

// State strings
var stateInit = "card";
var stateOpen = "card show open shake";
var stateMatch = "card show match matchShake";
var stateMismatch = "card mismatchShake";

//  Init call
document.addEventListener('DOMContentLoaded', Initialization);
document.addEventListener('keyup', FinishShotcut, false);

/*
 * Create a list that holds all of the cards
 */
function Initialization() {
    for (const card of cardList) {
        card.className = stateInit;
    }
    Shuffle(cardList);
    MoveInit();
    TimeInit();
    StarInit();
    console.log("Game initialized");

    const restart = document.querySelector(".restart");
    restart.addEventListener('click', Initialization);

    const deck = document.querySelector('.deck');
    deck.addEventListener('click', OpenCard);
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards
 *   - loop through each card and get its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function Shuffle(array) {
    var currentIndex = array.length, temporaryValue, currentNode, 
                        randomNode, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        currentNode = array[currentIndex].querySelector(".fa");
        randomNode = array[randomIndex].querySelector(".fa");

        temporaryValue = currentNode.className;
        currentNode.className = randomNode.className;
        randomNode.className = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

function OpenCard(card) {
    if ((card.target.className != stateInit
        && card.target.className != stateMismatch)
        || isComparing === true) {
        return;
    }

    if (!isTimeStart) {
        isTimeStart = true;
        timer = setInterval(TimeCounter, 1000);
    }

    console.log(card.target.className + ' is clicked.');
    ;
    card.target.className = stateOpen;
    MatchCheck(card);
}

function MatchCheck(card) {
    if (compareCard != null) {
        isComparing = true;
        if (compareCard.querySelector(".fa").className ===
            card.target.querySelector(".fa").className) {
            setTimeout(function(){ MatchAnimation(card) }, delayTime);
        }
        else {
            setTimeout(function(){MismatchAnimation(card) }, delayTime);
        }
        MoveCount();
        StarStateRefresh();
    }
    else {
        compareCard = card.target;
    }
}

function MismatchAnimation(card) {
    compareCard.className = stateMismatch;
    card.target.className = stateMismatch;
    compareCard = null;
    isComparing = false;
    console.log('mismatch');
}

function MatchAnimation(card) {
    card.target.className = stateMatch;
    compareCard.className = stateMatch;
    compareCard = null;
    isComparing = false;
    console.log('match');

    if (CheckWin()) {
        FinalPopupInit(starNum, totalTime);
    }
}

function MoveCount() {
    moveCounter++;
    counter.innerHTML = moveCounter;
}

function MoveInit() {
    moveCounter = 0;
    counter.innerHTML = 0;
    compareCard = null;
}

function StarStateRefresh() {
    if (moveCounter >= 75) {
        if (stars[0].classList.contains("fa-star")) {
            starNum--;
        }
        stars[0].className = "fa fa-star-o";
    }
    else if (moveCounter >= 50) {
        if (stars[0].classList.contains("fa-star")) {
            starNum--;
        }
        stars[1].className = "fa fa-star-o";
    }
    else if (moveCounter >= 25) {
        if (stars[0].classList.contains("fa-star")) {
            starNum--;
        }
        stars[2].className = "fa fa-star-o";
    } 
}

function StarInit() {
    for(const star of stars) {
        star.className = "fa fa-star";
    }
}

function FinalPopupInit(starNum) {
    // create a div
    const popup = document.createElement('div');
    popup.className = "overlay";

    // insert the congratulation banner
    let myPara = document.createElement('h1');
    myPara.textContent = 'Congratulations! You Won!';
    popup.appendChild(myPara);

    // insert game status banner
    myPara = document.createElement('p');
    myPara.textContent = `With ${starNum} Stars in 
                    ${timerPanel.textContent} Seconds. \n Woooooo!`;
    popup.appendChild(myPara);
    clearInterval(timer);

    // Insert Restart Button
    myPara = document.createElement('button');
    myPara.textContent = "Play again!";
    myPara.addEventListener('click', Initialization);
    myPara.addEventListener('click', FinalPopupDelete);
    popup.appendChild(myPara);

    // add the pop up to the html
    document.body.appendChild(popup);
}

function FinalPopupDelete() {
    const popup = document.querySelector(".overlay");
    popup.parentElement.removeChild(popup);
}

function CheckWin() {
    console.log("checking");
    for (const card of cardList) {
        if (!card.classList.contains("match")) {
            return false;
        }
    }
    return true;
}

function TimeCounter() {
    totalTime++;
    timerPanel.textContent = 
    TimeFormatCheck(Math.round(totalTime / 60).toString()) 
    + ":" + TimeFormatCheck((totalTime % 60).toString());
}

function TimeInit() {
    clearInterval(timer);
    isTimeStart = false;
    totalTime = 0;
    timerPanel.textContent = "00:00";
}

function TimeFormatCheck(i) {
    if (i<10) {
        i="0" + i
    }
    return i;
}

function FinishShotcut(e) {
    if (e.altKey && e.keyCode == 32) {
        for (const card of cardList) {
            card.className = stateMatch;
        }
        FinalPopupInit(starNum, totalTime);
    }
}