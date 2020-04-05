const head = document.getElementsByTagName('head')[0];
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'style.css';
head.appendChild(link);

const body = document.getElementsByTagName('body')[0];

const gameButtons = document.createElement('div');
gameButtons.className = 'game-buttons';
const buttonMixAndStart = document.createElement('button');
buttonMixAndStart.textContent = "Размешать и начать";
buttonMixAndStart.className = 'button';
const buttonPause = document.createElement('button');
buttonPause.textContent = "Пауза";
buttonPause.className = 'button';
gameButtons.appendChild(buttonMixAndStart);
gameButtons.appendChild(buttonPause);

const gameStat = document.createElement('div');
gameStat.className = "game-statistic";

let step = 0;
let timer = [0, 0];
let timerStatus = false;
let pauseStatus = false;

const stepCounter = document.createElement('div');
const stepCounterText = document.createElement('span');
stepCounterText.textContent = 'Ходы: ';
stepCounter.textContent = step;
stepCounter.className = 'game-statistic__el';
stepCounterText.className = 'game-statistic__el';

const time = document.createElement('div');
const timeText = document.createElement('span');
timeText.textContent = 'Время: ';
time.textContent = `${timer[0]}:${timer[1]}`;
time.className = 'game-statistic__el';
timeText.className = 'game-statistic__el';
gameStat.appendChild(stepCounterText);
gameStat.appendChild(stepCounter);
gameStat.appendChild(timeText);
gameStat.appendChild(time);

body.appendChild(gameButtons);
body.appendChild(gameStat);

const gameShield = document.createElement('div');
gameShield.className = 'game-shield';

body.appendChild(gameShield);

function createBlock(numb){
    let block = document.createElement('div');
    if(numb == 0){
        block.className = 'last-block';
    } else {
        block.textContent = numb;
        block.className = 'game-block';
    }
    gameShield.appendChild(block);
}

function createGameShield(){
    for(let i = 15; i >= 0; i--){
        createBlock(i);
    }
}

function getRandomInt(){
    return Math.floor(Math.random() * Math.floor(16));
}

function shieldMix(){
    step = 0;
    timer = [0, 0];
    stepCounter.textContent = step;
    time.textContent = `${timer[0]}:${timer[1]}`;
    let blocksArray = Array.from(gameShield.childNodes);
    for(let i = 0; i < blocksArray.length; i++){
        let randIndex = getRandomInt();
        let temp = blocksArray[i];
        blocksArray[i] = blocksArray[randIndex];
        blocksArray[randIndex] = temp;
    }
    gameShield.appendChild(...blocksArray);
}

function clock(){
    if(pauseStatus == true && timerStatus == true) {
        timerStatus = false;
        clearTimeout(t);
    } else if(timerStatus){
        timer[1]++;
        if(timer[1] == 60){
            timer[0]++;
            timer[1] = 0;
        }
        time.textContent = `${timer[0]}:${timer[1]}`; 
        t = setTimeout('clock()', 1000);
    }
}

function checkEndGame(/*numb of elements*/){
    let blockArray = Array.from(gameShield.childNodes);
    let gameComplete = 0;

    for(let i = 15, k=0; i >= 1; i--, k++){
        if(i == Number(blockArray[k].textContent)){
            gameComplete++;
        }
    }

    if(gameComplete == 15){
        timerStatus = false;
        alert(`Ура! Вы решили головоломку за ${timer[0]}:${timer[1]} и ${step} ходов!!!`)
    }
   
}

createGameShield();

buttonMixAndStart.addEventListener('click', () => {
    if(timerStatus == false) {
        timerStatus = true; 
        shieldMix();
        clock();
    } else {
        timerStatus = false; 
        timer[0] = 0;
        timer[1] = 0;
        step = 0;
        stepCounter.textContent = step;
        time.textContent = `${timer[0]}:${timer[1]}`;
        shieldMix();
    }

});

buttonPause.addEventListener('click', () => {
    if(pauseStatus == false){
        console.log(pauseStatus,timerStatus);
        pauseStatus = true;
    } else {
        pauseStatus = false;
        timerStatus = true;
        clock();
    }
});

function findPosition(el, array) {
    for(let i = 0; i < array.length; i++){
        if(array[i] == el){
            return i;
        }
    }
}

function blockSwap(eventBlock){
    let lastBlock = gameShield.querySelector('.last-block');
    let blocksArray = Array.from(gameShield.childNodes);
    let eventPosArray = findPosition(event.target, blocksArray);
    let lastPosArray = findPosition(lastBlock, blocksArray);
    
    blocksArray[lastPosArray] = eventBlock;
    blocksArray[eventPosArray] = lastBlock;
   
    return blocksArray;
}

function trueSwap(eventBlock) {
    let lastBlock = gameShield.querySelector('.last-block');
    let lastElemPosLeft = lastBlock.getBoundingClientRect().left;
    let lastElemPosTop = lastBlock.getBoundingClientRect().top;
    let targetPosLeft = eventBlock.getBoundingClientRect().left;
    let targetPosTop = eventBlock.getBoundingClientRect().top;
    let targetPosRight = eventBlock.getBoundingClientRect().right;
    let lastElemPosRight = lastBlock.getBoundingClientRect().right;
    let lastElemPosBot =  lastBlock.getBoundingClientRect().bottom;
    let targetPosBot =  eventBlock.getBoundingClientRect().bottom;

    if(targetPosTop == lastElemPosTop &&
    (Math.round(targetPosLeft+4) == Math.round(lastElemPosLeft - (lastElemPosRight-lastElemPosLeft))
     || Math.round(targetPosRight-4) == Math.round(lastElemPosRight + (lastElemPosRight-lastElemPosLeft)))){
        return true;
    } else if(targetPosLeft == lastElemPosLeft && Math.round(targetPosTop+6) == Math.round(lastElemPosTop - (lastElemPosBot-lastElemPosTop))){
        return true;
    } else if(targetPosLeft == lastElemPosLeft && Math.round(targetPosBot-6) == Math.round(lastElemPosBot + (lastElemPosBot-lastElemPosTop))) {
        return true;
    } else{
        return false;
    }
}

gameShield.addEventListener('click', (event) => { 
    if(trueSwap(event.target)){
        gameShield.append(...blockSwap(event.target));
        step++;
        stepCounter.textContent = step;
        console.log(event.target.textContent)
    }
    checkEndGame(); 
});

