class Table {
    constructor(blindBet = 200) {
        this.suits = ['spades', 'clubs', 'diams', 'hearts'];
        this.hands = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        this.cards = [];
        this.seats = [];
        this.waitingSeats = [];
        this.comunity = [];
        this.shuffle();
        this.blindBet = blindBet;
        this.firstBet = blindBet;
        this.bank = 0;
        this.currentUserHand = null;
        this.flop = false;
        this.second = false;
        this.third = false;
        this.riseBet = false;
    }

    startBet() {
        if (this.seats.length > 0) {
            let user = Math.round(Math.random() * (this.seats.length - 1));
            this.currentUserHand = user;
            this.seats[user].game = true;
        }
        // this.placeSmallBet();
    }

    nextPlayer() {

        if (this.seats.length > 0 && this.seats[this.currentUserHand].game && !this.seats[this.currentUserHand].fold && !this.riseBet) {
            this.seats[this.currentUserHand].game = false;
            this.seats[this.currentUserHand].didBet = true;
            this.currentUserHand++;
            const checkValue = this.currentUserHand;
            if (checkValue > this.seats.length - 1) {
                this.currentUserHand = 0;
            }
        }

        if (this.seats.length > 0 && this.seats[this.currentUserHand].fold) {
            this.seats[this.currentUserHand].game = false;
            this.seats[this.currentUserHand].didBet = true;
            this.currentUserHand++;
            const checkValue = this.currentUserHand;
            if (checkValue > this.seats.length - 1) {
                this.currentUserHand = 0;
            }

            if (this.seats[this.currentUserHand].fold) {
                this.seats[this.currentUserHand].fold = true;
                this.nextPlayer()
            }
        }

        //on rise press
        if (this.seats.length > 0 && this.riseBet) {
            this.riseBet = false;
            for (let seat of this.seats) {
                seat.didBet = false;
                seat.risedBet = false;
            }
            this.seats[this.currentUserHand].risedBet = true;
            this.seats[this.currentUserHand].game = false;
            this.seats[this.currentUserHand].didBet = true;
            this.currentUserHand++;
            const checkValue = this.currentUserHand;
            if (checkValue > this.seats.length - 1) {
                this.currentUserHand = 0;
            }
            if (this.seats.length > 0 && this.seats[this.currentUserHand].fold) {
                this.nextPlayer()
            }
        }

        //last one rised
        if (this.seats.length > 0 && this.seats[this.currentUserHand].risedBet) {
            this.seats[this.currentUserHand].risedBet = false;
            this.seats[this.currentUserHand].didBet = true;
        }


        if (this.seats.length > 0 && !this.seats[this.currentUserHand].didBet && !this.seats[this.currentUserHand].fold && !this.seats[this.currentUserHand].risedBet) {
            this.seats[this.currentUserHand].game = true;
        }

        if (this.everyOneDidFold()) {

        }


        if (this.seats.length > 0 && this.seats[this.currentUserHand].didBet && !this.seats[this.currentUserHand].fold) {

            this.nextRound();
            tableCards.innerHTML = '';
            this.turn().forEach(card => {
                const color = (card.icon == "H" || card.icon == "D") ? 'red' : 'black';
                console.log(color);
                tableCards.innerHTML += `<span class="handCard" style="color:${color};">${card.hand}&${card.suit};</span>`
            });

            if (this.seats.length > 0 && this.seats[this.currentUserHand].fold) {
                this.nextPlayer()
            }
            if (this.seats.length > 0) {
                this.seats[this.currentUserHand].game = true;
            }
        }
    }

    turn() {
        const cards = [];
        if (!this.flop) {
            this.flop = true;
            for (let i = 0; i < 3; i++) {
                cards.push(this.comunity[i]);
            }
        } else if (!this.second) {
            this.second = true;
            for (let i = 0; i < 4; i++) {
                cards.push(this.comunity[i]);
            }
        } else if (!this.third) {
            this.third = true;
            for (let i = 0; i < 5; i++) {
                cards.push(this.comunity[i]);
            }
        }
        else if (this.flop && this.second && this.third) {
            //on game finish 3 flops made
            this.defineWinner();
            restart();
            this.restartGame();
            newNewList();
            dealCardsHandColor();
            deleteCurrentPlayerColor();
            updateCurrentPlayerColor()

        }
        this.checkIfAnyNewHandsMatched(cards);
        updateUsersScore();
        return cards;
    }

    defineWinner() {
        let max = -1;
        let seats = this.seats;
        for (let i = 0; i < this.seats.length; i++) {
            const score = seats[i].score;
            if (score > max) {
                max = score;
            }
        }
        const playerWithMaxScore = seats.filter(player => player.score >= max);

        if (max > 0) {
            let bank = this.bank / playerWithMaxScore.length;
            for (let i = 0; i < playerWithMaxScore.length; i++) {
                playerWithMaxScore[i].money += bank;
            }
        }

    }

    newGame() {
        console.log('New Game!!!!!!');
        alert('New Game!!!!!!');
        this.flop = false;
        this.second = false;
        this.third = false;
        this.blindBet = this.firstBet;
        this.bank = 0;
        for (let seat of this.seats) {
            seat.fold = false;
            seat.didBet = false;
            seat.game = false;
            seat.betPerGame = 0;
            seat.score = 0;
        }
        this.cards.splice(0, this.cards.length);
        this.comunity.splice(0, this.comunity.length);
        this.seats.splice(0, this.seats.length);
        this.shuffle();
        // clearCards();
    }

    restartGame() {
        console.log('Shuffle Cards!!!!!!');
        alert('Shuffle Cards!!!!!!')
        this.flop = false;
        this.second = false;
        this.third = false;
        this.blindBet = this.firstBet;
        this.bank = 0;
        for (let seat of this.seats) {
            seat.fold = false;
            seat.didBet = false;
            seat.game = false;
            seat.betPerGame = 0;
            seat.score = 0;
        }
        this.cards.splice(0, this.cards.length);
        this.comunity.splice(0, this.comunity.length);
        this.shuffle();
        this.dealCards();
    }

    nextRound() {
        this.blindBet = this.firstBet;
        for (let seat of this.seats) {
            seat.didBet = false;
            seat.game = false;
        }
        // this.currentUserHand++;
        // const checkValue = this.currentUserHand;
        // if (checkValue > this.seats.length - 1) {
        //     this.currentUserHand = 0;
        // }
    }

    everyOneDidFold() {
        const users = this.seats.length - 1;
        let a = 0;
        this.seats.forEach((player) => {
            if (player.fold) {
                a++;
            }
        });
        if (users === a) {
            const winner = this.seats.filter(player => !player.fold);
            winner[0].money += this.bank;
            restart();
            this.restartGame();
            dealCardsHandColor();
            deleteCurrentPlayerColor();
            updateCurrentPlayerColor();
        }
    }

    dealCards() {
        //Before deal cards add users from waiting seats to playing seats array
        this.seats = [...this.waitingSeats];
        console.log(this.seats);

        for (let j = 0; j < 2; j++) {
            for (let i = 0; i < this.seats.length; i++) {
                this.seats[i].hand.push(this.cards[0]);
                this.cards.shift();
            }
        }
        for (let i = 0; i < 5; i++) {
            this.comunity.push(this.cards[0]);
            this.cards.shift();
        }
        this.checkPlayersCardsForPair();
        this.startBet();
    }


    // check if user got any pair of hands after first cards dale to players
    checkPlayersCardsForPair() {
        this.seats.forEach(player => {
            if (player.hand[0].hand === player.hand[1].hand) {
                player.score = 1
            }
        })
    }


    pairInHand(first, second) {
        if (first === second) {
            return first
        } else {
            return false
        }
    }

    pairOnTable(cards) {
        if (cards) {
            const values = {};
            for (let i = 0; i < cards.length; i++) {
                if (values[cards[i].hand]) {
                    return cards[i].hand
                } else {
                    values[cards[i].hand] = true;
                }
            }
        }
    }


    threeEquals(firstUserHand, secondUserHand, tableHand) {
        return firstUserHand === secondUserHand && firstUserHand === tableHand
    }



    pairHand(userHands, tableCards){
        const newTableHands = tableCards.map(card => card.hand);
        const newCards = [...userHands, ...newTableHands];
        let pairFlag = false;
        const pair = {};


        for(let i=0; i < newCards.length; i++){
            if(pair[newCards[i]]){
                pairFlag = true
            }else{
                pair[newCards[i]] = true;
            }
        }

        return pairFlag;
    }

    twoPair(userHands, tableCards){
        const newTableHands = tableCards.map(card => card.hand);
        const newCards = [...userHands, ...newTableHands];
        let count = 0;
        const pair = {};

        for(let i=0; i < newCards.length; i++){
            pair[newCards[i]] = 0;
        }

        for(let i=0; i < newCards.length; i++){
            pair[newCards[i]]++;
            if(pair[newCards[i]] === 2){
                count++;
            }
        }

        return count >= 2;
    }

    //TODO add one if A
    //TODO probelmm catched with hand 23456 8 where 7 was mising
    straight(userCards, tableCards) {
        const tableHands = tableCards.map(function (card) {
            return card.cardValue;
        });
        const allCards = [...userCards, ...tableHands];
        const straightHand = [];
        let count = 0;

        //Delete duplicates
        for (let i = 0; i < allCards.length; i++) {
            for (let j = i + 1; j < allCards.length; j++) {
                if (allCards[i] === allCards[j]) {
                    allCards.splice(j, 1);
                }
            }
        }

        allCards.sort((a, b) => a - b);

        if (allCards.length > 4 && allCards[0] - allCards[3] !== -3) {
            allCards.splice(0, 2);
        } else if (allCards.length > 4 && allCards[allCards.length - 4] - allCards[allCards.length - 1] !== -3) {
            allCards.splice(allCards.length - 2, 2);
        }


        for (let i = 0; i < allCards.length; i++) {
            for (let j = 0; j < allCards.length; j++) {
                if (allCards[i] - allCards[j] === -1) {
                    count++;
                }
            }
        }

        return count >= 4;
    }


    flush(userCards, tableCards) {
        const tableHands = tableCards.map(function (card) {
            return card.icon;
        });
        const allCards = [...userCards, ...tableHands];
        let spades = 0, clubs = 0, diams = 0, hearts = 0;


        for (let i = 0; i < allCards.length; i++) {
            switch (allCards[i]) {
                case "C":
                    clubs++;
                    break;
                case "D":
                    diams++;
                    break;
                case "S":
                    spades++;
                    break;
                case "H":
                    hearts++;
                    break;
            }
        }
        return clubs > 4 || diams > 4 || spades > 4 || hearts > 4;
    }

    fullHouse(userCards, tableCards) {
        const tableHands = tableCards.map(function (card) {
            return card.cardValue;
        });

        const allCards = [...userCards, ...tableHands];

        let matchPair = {}, matchThree = {}, pair = false, three = false, afterThree = [];

        for (let i = 0; i < allCards.length; i++) {
            matchThree[allCards[i]] = 0;
        }
        for (let i = 0; i < allCards.length; i++) {
            matchThree[allCards[i]]++;
            if (matchThree[allCards[i]] === 3) {
                three = true;
                deleteThree(allCards[i]);
            }
        }

        function deleteThree(value) {
            afterThree = allCards.filter(function (card) {
                return card !== value;
            });

            for (let i = 0; i < afterThree.length; i++) {
                if (matchPair[afterThree[i]]) {
                    pair = true;
                } else {
                    matchPair[afterThree[i]] = true;
                }
            }
        }

        return pair && three;
    };


    threeOfKind(userCards, tableCards) {
        const tableHands = tableCards.map(function (card) {
            return card.cardValue;
        });

        const allCards = [...userCards, ...tableHands];
        let three = false, matchFour = {};

        for (let i = 0; i < allCards.length; i++) {
            matchFour[allCards[i]] = 0;
        }
        for (let i = 0; i < allCards.length; i++) {
            matchFour[allCards[i]]++;
            if (matchFour[allCards[i]] === 3) {
                three = true;
            }
        }

        return three;
    }



    fourOfKind(userCards, tableCards) {
        const tableHands = tableCards.map(function (card) {
            return card.cardValue;
        });

        const allCards = [...userCards, ...tableHands];
        let four = false, matchFour = {};

        for (let i = 0; i < allCards.length; i++) {
            matchFour[allCards[i]] = 0;
        }
        for (let i = 0; i < allCards.length; i++) {
            matchFour[allCards[i]]++;
            if (matchFour[allCards[i]] === 4) {
                four = true;
            }
        }

        return four;
    }

    flushSR(userCardsSuit, userCardsValue, userCards, tableCards) {
        const newCards = [...tableCards, ...userCards];
        const tableHands = tableCards.map(function (card) {
            return card.icon;
        });
        const allCards = [...userCardsSuit, ...tableHands];
        let straightCount = 0;
        const finalHands = [];

        let hands = {};
        hands.S = 0;
        hands.C = 0;
        hands.D = 0;
        hands.H = 0;

        for (let i = 0; i < allCards.length; i++) {
            switch (allCards[i]) {
                case "C":
                    hands.C++;
                    break;
                case "D":
                    hands.D++;
                    break;
                case "S":
                    hands.S++;
                    break;
                case "H":
                    hands.H++;
                    break;
            }
        }

        if (hands.S > 4) {
            checkForStraight("S")
        } else if (hands.C > 4) {
            checkForStraight("C")
        } else if (hands.D > 4) {
            checkForStraight("D")
        } else if (hands.H > 4) {
            checkForStraight("H")
        }

        function checkForStraight(value) {
            for (let i = 0; i < newCards.length; i++) {
                if (newCards[i].icon === value) {
                    finalHands.push(newCards[i].cardValue);
                }
            }

            if (finalHands.length > 4 && finalHands[0] - finalHands[3] !== -3) {
                finalHands.splice(0, 2);
            } else if (finalHands.length > 4 && finalHands[finalHands.length - 4] - finalHands[finalHands.length - 1] !== -3) {
                finalHands.splice(finalHands.length - 2, 2);
            }

            for (let i = 0; i < finalHands.length; i++) {
                for (let j = 0; j < finalHands.length; j++) {
                    if (finalHands[i] - finalHands[j] === -1) {
                        straightCount++;
                    }
                }
            }
        }

        return straightCount >= 4;

    }

    // On flop check if any hand is matching with user card
    checkIfAnyNewHandsMatched(cards) {
        for (let i = 0; i < this.seats.length; i++) {
            let last = 0;
            let first = this.seats[i].hand[0];
            let second = this.seats[i].hand[1];
                if (this.pair(first, second, cards) > last) {
                    this.seats[i].score = this.pair(first, second, cards);
                    last = this.pair(first, second, cards);
                }
        }
    }

    pair(userFirst, userSecond, cardsOnTable) {
        // console.log(userFirst, userSecond, tableHand);
        let value = 0;
        if (this.pairHand([userFirst.hand, userSecond.hand], cardsOnTable)) {
            console.log('pair');
            value = 1;
        }

        if(this.twoPair([userFirst.hand, userSecond.hand], cardsOnTable)){
            value = 2;
        }

        if (this.threeOfKind([userFirst.cardValue, userSecond.cardValue], cardsOnTable)) {
            console.log('Three of kind')
            value = 3;
        }

        if (this.straight([userFirst.cardValue, userSecond.cardValue], cardsOnTable)) {
            value = 4;
        }

        if (this.flush([userFirst.icon, userSecond.icon], cardsOnTable)) {
            value = 5;
        }

        if (this.fullHouse([userFirst.cardValue, userSecond.cardValue], cardsOnTable)) {
            value = 6;
        }

        if (this.fourOfKind([userFirst.cardValue, userSecond.cardValue], cardsOnTable)) {
            console.log('Four of kind');
            value = 7;
        }

        if (this.flushSR([userFirst.icon, userSecond.icon], [userFirst.cardValue, userSecond.cardValue], [userFirst, userSecond], cardsOnTable)) {
            value = 8;
        }

        return value;
    }

    shuffle() {
        for (let i = 0; i < this.suits.length; i++) {
            let suitNew = this.suits[i][0].toUpperCase();
            for (let j = 0; j < this.hands.length; j++) {
                this.cards.push({
                    suit: this.suits[i],
                    hand: this.hands[j],
                    cardValue: parseInt(j) + 2,
                    icon: suitNew
                })
            }
        }
        return this.shuffleCards(this.cards);
    };

    shuffleCards(cards) {
        for (let i = cards.length - 1; i > 0; i--) {
            const randomCard = Math.floor(Math.random() * i);
            for (let j = 0; j < i; j++) {
                let temp = cards[i];
                cards[i] = cards[randomCard];
                cards[randomCard] = temp;
                break;
            }
        }
        return cards;
    };

    //Actions

    join(name) {
        const player = new Player(name, [], this.blindBet);
        this.waitingSeats.push(player);
        return name;
    };

    placeSmallBet() {
        if (!this.seats[this.currentUserHand].didBet && this.seats[this.currentUserHand].game && !this.seats[this.currentUserHand].fold) {
            console.log(this.seats);
            this.bank += this.seats[this.currentUserHand].placeSmallBlind();
        }
        this.nextPlayer();
    }


    check() {
        this.nextPlayer();
    }

    call() {
        if (this.seats.length > 0 && !this.seats[this.currentUserHand].didBet && this.seats[this.currentUserHand].game && !this.seats[this.currentUserHand].fold) {
            console.log(this.seats);
            this.bank += this.seats[this.currentUserHand].call(this.blindBet);
        }
        this.nextPlayer();
    }

    rice(value) {
        if (value > this.blindBet) {
            if (!this.seats[this.currentUserHand].didBet && this.seats[this.currentUserHand].game && !this.seats[this.currentUserHand].fold) {
                console.log(this.seats);
                console.log('rice')
                this.blindBet = value;
                this.bank += this.seats[this.currentUserHand].rice(this.blindBet);
                this.riseBet = true;
            }
            this.nextPlayer();
        } else {
            alert('Rice more then current bet ')
        }
    }

    fold(value) {
        if (!this.seats[this.currentUserHand].didBet && this.seats[this.currentUserHand].game && !this.seats[this.currentUserHand].fold) {
            this.seats[this.currentUserHand].fold = true;
            this.nextPlayer();
        }
    }

}

class Player {
    constructor(name, hand = [], blindBet) {
        this.name = name;
        this.hand = hand;
        this.blindBet = blindBet;
        this.money = 10000;
        this.betPerGame = 0;
        this.game = false;
        this.fold = false;
        this.didBet = false;
        this.risedBet = false;
        this.score = 0;
    }

    placeSmallBlind() {
        if (this.game && !this.fold && !this.didBet) {
            this.betPerGame += (this.blindBet / 2);
            this.money -= (this.blindBet / 2);
        }
        return (this.blindBet / 2);
    }

    call(value) {
        if (this.game && !this.fold && !this.didBet) {
            this.betPerGame += value;
            this.blindBet = value;
            this.money -= this.blindBet;
        }
        return this.blindBet;
    }

    rice(rice) {
        if (this.game && !this.fold && !this.didBet) {
            this.betPerGame += rice;
            this.money -= (rice);
            this.blindBet = rice
        }
        return (this.blindBet);
    }

    fold() {
        if (this.game && !this.fold && !this.didBet) {
            this.fold = true
        }
    }
}


const table = new Table();
// table.join('Deivis');
// table.join('Deivis2');
// table.join('Deivis3');
// table.join('Deivis4');
// table.join('Deivis5');
// table.dealCards();
//
// table.placeSmallBet();
// table.call();
// table.call();
// table.call();
// table.call();
// table.call();
// table.rice(2000);
// table.rice(2000);
// table.rice(2000);
// table.rice(2000);


//UI

const list = document.getElementById('list').children;
const container = document.querySelector('.container');
const dealCardsButton = document.querySelector('.dealCards');
const clearCardsButton = document.querySelector('.clearCards');
const restartCardsButton = document.querySelector('.restartCards');
const tableCards = document.querySelector('.cards');
const riceStake = document.querySelector('.riceStake');
const bank = document.querySelector('.bank');
const bet = document.querySelector('.bet');
const actions = document.querySelector('.actions');
const menu = document.querySelector('.menu');
const game = document.querySelector('.game');
const model = document.querySelector('.model');
const modelButton = document.querySelector('.model > .tab > button');
const enterNameInput = document.querySelector('.model > .tab > input');
const tabParent = document.querySelector('.model > .tab');


for (let i = 0; i < list.length; i++) {
    list[i].onclick = function () {
        if (list[i].classList.contains('join') || list[i].classList.contains('waiting')) {
            // console.log(newList,'nl');
            // console.log(table.seats,'ts');
            // table.seats.splice(i,1);
            // list[i].innerHTML = '';
            // list[i].removeAttribute("class");
            // list[i].removeAttribute("style");
            // newNewList();
            // deleteCurrentPlayerColor();
            // updateCurrentPlayerColor();
            // console.log(newList, 'nl');
            // console.log(table.seats,'ts');

        } else if (!list[i].classList.contains('join')) {
            // list[i].style.background = "seagreen";
            // list[i].innerHTML = table.join('player');
            // list[i].className = 'waiting';
            //
            // console.log(table.seats)
            model.style.display = 'block';
            setUser(i);
        }
    }
}

model.onclick = function (e) {
    if (e.target == model) {
        model.style.display = 'none';
    }
};

function setUser(i) {
    modelButton.onclick = function () {
        if (enterNameInput.value) {
            list[i].style.background = "seagreen";
            list[i].innerHTML = `<div class="playerName">${table.join(enterNameInput.value)}</div>`;
            list[i].className = 'join';
            model.style.display = 'none';
        }

    };
}


function newNewList() {

    for (let i = 0; i < list.length; i++) {
        if (list[i].classList.contains('waiting')) {
            list[i].className = "join";
        }
    }

    newList.splice(0, newList.length);
    for (let i = 0; i < list.length; i++) {
        if (list[i].classList.contains('join')) {
            newList.push(list[i])
        }
    }
}

let dealCardsButtonFlag = false;
let shuffleCardsFlag = false;
dealCardsButton.onclick = function () {
    if (!dealCardsButtonFlag && table.waitingSeats.length > 1) {
        table.dealCards();
        dealCardsToTable();
        updateBetAndBank();
        dealCardsButtonFlag = true;
        shuffleCardsFlag = true;
        game.style.display = "block"

    }
};

clearCardsButton.onclick = function () {
    clearCards();
    table.newGame();
    console.log(newList);
    console.log(table.seats);
    updateBetAndBank();
    dealCardsButtonFlag = false;
    shuffleCardsFlag = false;
    game.style.display = "none";


};

restartCardsButton.onclick = function () {
    if (shuffleCardsFlag) {
        restart();
        table.restartGame();
        newNewList();
        dealCardsHandColor();
        deleteCurrentPlayerColor();
        updateCurrentPlayerColor();
        updateBetAndBank();
        console.log(newList)
    }

};


let newList = [];

function dealCardsToTable() {
    console.log(newList);
    console.log(table.seats)

    for (let i = 0; i < list.length; i++) {
        if (list[i].classList.contains('waiting')) {
            list[i].className = "join";
        }
    }


    //Shorten li list to newList
    for (let i = 0; i < list.length; i++) {
        if (list[i].classList.contains('join')) {
            newList.push(list[i])
        }
    }

    console.log(newList, 'nl')


    //Show User Cards
    dealCardsHandColor();
    //Show color on current user hand
    updateCurrentPlayerColor()
}


function dealCardsHandColor() {
    //Show dale card hand for every player
    for (let i = 0; i < newList.length; i++) {
        const seat = table.seats[i];
        console.log(seat.score);
        newList[i].innerHTML += `<div class="playerScore">${seat.score == 1 ? 'Pair' : ''}</div>`;
        newList[i].innerHTML += `<div class="playerBets">${seat.betPerGame}</div>`;
        newList[i].innerHTML += `<div class="playerMoney">${seat.money}</div>`;
        for (let j = 0; j <= 1; j++) {
            const color = (seat.hand[j].icon == "H" || seat.hand[j].icon == "D") ? 'red' : 'black';
            newList[i].innerHTML += `<div class="handCard" style="color:${color};">${seat.hand[j].hand}&${seat.hand[j].suit};</div>`

        }
    }
}

function updateUserCash() {
    for (let i = 0; i < newList.length; i++) {
        const seat = table.seats[i];
        for (let j = 0; j < newList[i].children.length; j++) {
            const node = newList[i].childNodes[j];
            if (node.className == 'playerMoney') {
                node.innerHTML = '';
                node.innerHTML = Math.round(seat.money);
            }
            if (node.className == 'playerBets') {
                node.innerHTML = '';
                node.innerHTML = seat.betPerGame;
            }
        }
    }
}

function updateUsersScore() {
    for (let i = 0; i < newList.length; i++) {
        const seat = table.seats[i];
        for (let j = 0; j < newList[i].children.length; j++) {
            const node = newList[i].childNodes[j];
            if (node.className == 'playerScore') {
                node.innerHTML = '';
                node.innerHTML = showUserScore(seat.score);
            }
        }
    }
}


//actions UI buttons
const gameDom = document.querySelector('.game');
gameDom.onclick = (event) => {
    if (event.target.className === 'call') {
        table.call();
        deleteCurrentPlayerColor();
        updateCurrentPlayerColor();
        updateBetAndBank();
        updateUserCash();
        console.log(table.currentUserHand)
    }
    if (event.target.className === 'check') {
        table.check();
        deleteCurrentPlayerColor();
        updateCurrentPlayerColor();

    }
    if (event.target.className === 'rice') {
        console.log('rice')
        table.rice(parseInt(riceStake.value));
        deleteCurrentPlayerColor();
        updateCurrentPlayerColor();
        updateBetAndBank();
        updateUserCash();
    }
    if (event.target.className === 'fold') {
        colorFold();
        table.fold();
        deleteCurrentPlayerColor();
        updateCurrentPlayerColor();
    }
};

function deleteCurrentPlayerColor() {
    for (let i = 0; i < newList.length; i++) {
        newList[i].style.background = "seagreen";
    }
}

function updateCurrentPlayerColor() {
    for (let i = 0; i < table.seats.length; i++) {
        if (table.seats[i].game) {
            newList[i].style.background = 'red';
        }
        if (table.seats[i].fold) {
            newList[i].style.background = 'black';
        }
    }
}

function colorFold() {
    newList[table.currentUserHand].style.background = 'black';
}

function clearCards() {
    console.log(newList);
    console.log(table.seats);
    for (let i = 0; i < list.length; i++) {
        list[i].innerHTML = '';
        list[i].style.background = "black";
        list[i].removeAttribute("style");
        list[i].removeAttribute("class");
    }
    newList.splice(0, newList.length);
    tableCards.innerHTML = '';
}

function restart() {
    console.log(newList);
    console.log(table.seats);
    for (let i = 0; i < newList.length; i++) {
        for (let j = 0; j < newList[i].children.length; j++) {
            const node = newList[i].childNodes[j];
            if (node.className === 'playerName') {
                newList[i].innerHTML = `<div class="playerName">${node.textContent}</div>`
            }
        }

        tableCards.innerHTML = '';
        table.seats.forEach(player => {
            player.hand.splice(0, player.hand.length);
        })

    }
}

function updateBetAndBank() {
    bank.innerText = table.bank;
    bet.innerText = table.blindBet;
}

function showUserScore(value) {
    switch (value) {
        case undefined:
            return "Pair";
        case 0:
            return "";
        case 1:
            return "Pair";
        case 2:
            return "Two Pair";
        case 3:
            return "Three";
        case 4:
            return "Straight";
        case 5:
            return "FLush";
        case 6:
            return "Full house";
        case 7:
            return "Four";
        case 8:
            return "Royal Flush";
    }
}

let op = true;
//actions button toggle
actions.onclick = function () {
    op = !op;
    if (!op) {
        actions.style.backgroundColor = '#4CAF50';
        menu.style.display = "none";
    } else {
        actions.style.backgroundColor = '#cc1b2f';
        menu.style.display = "block";
    }
};


//TODO Q Q pair --- 1
//TODO A A Q Q two pair --- 2
//TODO 5 5 5 three of a kind  ---- 3
//TODO 7 8 9 10 J Straight ---- 4
//TODO H H H H H Flush ----- 5
//TODO 10 10 10 A A Full house ----- 6
//TODO 5 5 5 5 four of a kind  ----- 7
//TODO 4H 5H 6H 7H 8H Straight Flush ----- 8
//TODO 10H JH QH KH AH Royal Flush ----- 9




