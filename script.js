const emojis = ["✌","😂","😝","😁","😱","👉","🙌","🍻","🔥","🌈","☀","🎈","🌹","💄","🎀","⚽","🎾","🏁","😡","👿","🐻","🐶","🐬","🐟","🍀","👀","🚗","🍎","💝","💙","👌","❤","😍","😉","😓","😳","💪","💩","🍸","🔑","💖","🌟","🎉","🌺","🎶","👠","🏈","⚾","🏆","👽","💀","🐵","🐮","🐩","🐎","💣","👃","👂","🍓","💘","💜","👊","💋","😘","😜","😵","🙏","👋","🚽","💃","💎","🚀","🌙","🎁","⛄","🌊","⛵","🏀","🎱","💰","👶","👸","🐰","🐷","🐍","🐫","🔫","👄","🚲","🍉","💛","💚"];

let numberOfCards = 0;
let firstCard = null;
let lastCard = null;
let lockBoard = false;

function startGame(){
    const width = parseInt(document.getElementById('width').value);
    const height = parseInt(document.getElementById('height').value);

    if(isOutOfRange(width, 4, 11)){
        alert('Ширина должна быть от 4 до 11');
        return;
    }

    if(isOutOfRange(height, 3, 6)){
        alert('Высота должна быть от 3 до 6');
        return;
    }

    reset();
    setUpBoard(width, height);
}

function setUpBoard(width, height){
    const board = document.getElementById('board');
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${width}, 100px)`;
    board.style.gridTemplateRows = `repeat(${height}, 100px)`;

    numberOfCards = width * height;
    const selectedEmoj = shuffleArray(emojis).slice(0, numberOfCards / 2);
    const doubleEmojes = [...selectedEmoj, ...selectedEmoj];

    if (numberOfCards % 2 === 1){
        doubleEmojes.push('');
    }

    const gameEmojis = shuffleArray(doubleEmojes);

    gameEmojis.forEach((emoji) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emoji;

        const emojiElement = document.createElement('span');
        emojiElement.textContent = emoji;
        emojiElement.style.visibility = 'hidden';
        card.appendChild(emojiElement);

        card.addEventListener('click', () => flipCard(card, emojiElement));

        board.appendChild(card);
    })
}

function flipCard(card, emojiElement){
    if (lockBoard === true || card === firstCard || card.classList.contains('matched')){
        return
    }
    card.classList.add('flipped');
    emojiElement.style.visibility = 'visible';

    if(firstCard === null) {
        firstCard = card;
    } else{
        lastCard = card;
        checkForMatch();
    }
}

function checkForMatch(){
    const isMatch = firstCard.dataset.emoji === lastCard.dataset.emoji;

    if(isMatch){
        disableCards();
    }else{
        unFlipCards();
    }

}

function disableCards(){
    firstCard.classList.add('matched');
    lastCard.classList.add('matched');

    const adjustedTotal = numberOfCards % 2 === 0 ? numberOfCards : numberOfCards - 1;
    if (document.querySelectorAll('.card.matched').length === adjustedTotal) {
        setTimeout(() => {
            alert('Поздравляю! Вы выиграли!');
        }, 500)
    }
    reset();
}

function unFlipCards(){
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        lastCard.classList.remove('flipped');

        firstCard.firstChild.style.visibility = 'hidden';
        lastCard.firstChild.style.visibility = 'hidden';

        reset();
    }, 1000);
}

function reset(){
    [firstCard, lastCard] = [null, null];
    lockBoard = false;
}

function isOutOfRange (val,minVal, maxVal){
    return val < minVal || val > maxVal;
}

function shuffleArray(array){
 for (let i = array.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
 }
 return array;
}

document.getElementById('startbtn').addEventListener('click', startGame);