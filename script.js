localStorage.clear();

//Добавляем ссылку на стили
const head = document.getElementsByTagName('head')[0];
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'style.css';
head.appendChild(link);

//Некоторые переменные: размер поля, значения таблици победителей и статус начала игры
// статус нажатой кнопки pause
const s4 = 4, s3 = 3, s8 = 8;
let startGame = false;
let timerStatus = false;
let pauseStatus = false;

if(!('winers' in localStorage)){
    localStorage.setItem('winers', "");
} else if(!('statusField' in localStorage)){
    localStorage.setItem('statusField', "");
}

//Получаем доступ к body
const body = document.getElementsByTagName('body')[0];

//Создаем кнопки управления и статистику
const gameButtons = document.createElement('div');
gameButtons.className = 'game-buttons';
const buttonMixAndStart = document.createElement('button');
buttonMixAndStart.textContent = "Размешать и начать";
buttonMixAndStart.className = 'button';
const buttonPause = document.createElement('button');
buttonPause.textContent = "Пауза/Продолжить";
buttonPause.className = 'button';
gameButtons.appendChild(buttonMixAndStart);
gameButtons.appendChild(buttonPause);

const gameStat = document.createElement('div');
gameStat.className = "game-statistic";

//Смотрим в локал если игра прервалась достаем значения количества ходов и время
let step = Number(localStorage.step) || 0;
let timer;
if(Number(localStorage.length) != 0){
    timer = [Number(localStorage.minute), Number(localStorage.second)];
} else {
    timer = [0, 0];
}

//Добавляем элементы статы, некрасиво, но работет
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

//Создаем игровое поле
const gameShield = document.createElement('div');
gameShield.className = 'game-shield';
body.appendChild(gameShield);

//Генерируем игровой блок
function createBlock(numb, size){
    let block = document.createElement('div');
    if(numb == 0 && numb == ""){
        block.className = 'last-block';
    } else {
        block.textContent = numb;
        block.className = 'game-block';
    }
    block.style.width = `${100/size-2}%`;
    block.style.height = `${100/size-2}%`;
    return block;
}

//Генерируем поле
function createGameShield(size){
    let len = size*size;
    let mas = [];
    for(let i = len-1, j = 0; i >= 0; i--, j++){
        mas[j] = createBlock(i, size);
        gameShield.appendChild(mas[j]);
    }
}

//Создаем поле с блоками
//Если перезагрузили страницу при запущенной игре пересобираем поле
if(localStorage.statusField == ""){
    createGameShield(s4);
} else {
    let mas = JSON.parse(localStorage.statusField);
    for(let j = 0; j <= mas.length-1; j++){
        let el = createBlock(mas[j], Math.sqrt(mas.length));
        gameShield.appendChild(el);
    }
    localStorage.setItem('statusSize', Math.sqrt(mas.length));
}


//Создаем кнопки управления размером игрового поля
const sizesBlock = document.createElement('div');
sizesBlock.className = 'sizes-block';
const standartSize = document.createElement('input');
const size3X3 = document.createElement('input');
const size8X8 = document.createElement('input');
standartSize.type = 'button';
size3X3.type = 'button';
size8X8.type = 'button';
standartSize.value = '4X4';
size3X3.value = '3X3';
size8X8.value = '8X8';
standartSize.name = s4;
size3X3.name = s3;
size8X8.name = s8;
standartSize.className = 'sizes-block__element';
size3X3.className = 'sizes-block__element';
size8X8.className = 'sizes-block__element';

//Проверяю какой размер поля и в соответствии с этим кидаю active на кнопку размера
switch(localStorage.statusSize){
    case '3':
        size3X3.classList.add('active-size');
    break;
    case '4':
        standartSize.classList.add('active-size');
    break;
    case '8':
        size8X8.classList.add('active-size');
    break;
    default: 
        standartSize.classList.add('active-size');
    break;
}

sizesBlock.appendChild(standartSize);
sizesBlock.appendChild(size3X3);
sizesBlock.appendChild(size8X8);

body.appendChild(sizesBlock);


//Создание кнопки и окна, при нажатии на кнопку вызывает окно с результатом
const results = document.createElement('button');
results.className = 'results';
results.textContent = 'Таблица результатов';

const resultsTableWindow = document.createElement('div');
const resultsTable = document.createElement('div');
const titleTable = document.createElement('p');
const resultList = document.createElement('ol');
const offButton = document.createElement('button');
resultsTableWindow.className = 'message-window';
resultsTable.className = 'body-message';
offButton.className = 'off-button';
titleTable.className = 'title-table';
offButton.textContent = "Закрыть";
titleTable.textContent = "Таблица результатов";
resultList.style.marginBottom = "20px";
resultsTable.appendChild(titleTable);
resultsTable.appendChild(resultList);
resultsTable.appendChild(offButton);
resultsTableWindow.appendChild(resultsTable);
resultsTableWindow.classList.add('hidden');

body.appendChild(resultsTableWindow);

body.appendChild(results);

//Функция рандома 
function getRandomInt(){
    return Math.floor(Math.random() * Math.floor(gameShield.childNodes.length));
}

//Перемешивание блоков
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

//Недотаймер
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
        localStorage.setItem('minute', timer[0]);
        localStorage.setItem('second', timer[1]);
        t = setTimeout('clock()', 1000);
    }
}

//Функция проверки конца игры
function checkEndGame(){
    let blockArray = Array.from(gameShield.childNodes);
    let gameComplete = 0;
    let len = blockArray.length;

    for(let i = len-1, k=0; i >= 1; i--, k++){
        if(i == Number(blockArray[k].textContent)){
            gameComplete++;
        }
    }

    if(gameComplete == len-1){
        timerStatus = false;
        alert(`Ура! Вы решили головоломку за ${timer[0]}:${timer[1]} и ${step} ходов!!!`);
        let verification  = confirm('Желаете ли внести результат в список победителей?');
        if(verification){
            let name = prompt('Введите Имя');
            let stat = [name, step, timer];
            localStorage.winers += stat + ' ';
        }
        stepCounter.textContent = step = 0;
        timer = [0,0];
        time.textContent = `${timer[0]}:${timer[1]}`;
    }
}

//Поиск позиции блока в gameShield.childNodes
function findPosition(el, array) {
    for(let i = 0; i < array.length; i++){
        if(array[i] == el){
            return i;
        }
    }
}

//Смена блоков местами
function blockSwap(eventBlock){
    let lastBlock = gameShield.querySelector('.last-block');
    let blocksArray = Array.from(gameShield.childNodes);
    let eventPosArray = findPosition(event.target, blocksArray);
    let lastPosArray = findPosition(lastBlock, blocksArray);
    let valueArray = [];

    blocksArray[lastPosArray] = eventBlock;
    blocksArray[eventPosArray] = lastBlock;

    blocksArray.forEach(el => valueArray.push(el.textContent))
    localStorage.statusField = JSON.stringify(valueArray);

    return blocksArray;
}

//Проверка условия ортогональности 
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

//Действие на нажатие кнопки Button Mix and Start
buttonMixAndStart.addEventListener('click', () => {
    startGame = true;
    buttonMixAndStart.classList.add('button-activity');
    if(startGame){
        if(timerStatus == false) {
            timerStatus = true; 
            shieldMix();
            clock();
        } else {    
            timer[0] = 0;
            timer[1] = 0;
            step = 0;
            stepCounter.textContent = step;
            time.textContent = `${timer[0]}:${timer[1]}`;
            shieldMix();
        }
    }
});

//Действие на кнопку пауза/ продолжить
buttonPause.addEventListener('click', () => {
    if(pauseStatus == false){
        pauseStatus = true;
        startGame = false;
        buttonPause.classList.add('button-activity');
        buttonMixAndStart.classList.remove('button-activity');
    } else {
        pauseStatus = false;
        timerStatus = true;
        startGame = true;
        clock();
        buttonPause.classList.remove('button-activity');
        buttonMixAndStart.classList.add('button-activity');
    }
});

//Нажатие на игровое поле с проверкой условия размещения
gameShield.addEventListener('click', (event) => { 
    if(trueSwap(event.target) && startGame){
            gameShield.append(...blockSwap(event.target));
            step++;
            localStorage.setItem('step', step);
            stepCounter.textContent = step;
            checkEndGame(); 
    }
});

//Смена размеров игрового поля
sizesBlock.addEventListener('click', (event) => {
    if(!event.target.classList.contains('sizes-block')){
        startGame = false;
        timerStatus = false;
        localStorage.minute = timer[0] = 0;
        localStorage.second = timer[1] = 0;
        localStorage.step = step = 0;
        stepCounter.textContent = step;
        time.textContent = `${timer[0]}:${timer[1]}`;
        document.querySelectorAll('.sizes-block__element').forEach((el) => {
            el.classList.remove('active-size');
        });
        event.target.classList.add('active-size');
        while(gameShield.firstChild) {
            gameShield.removeChild(gameShield.firstChild);
        }
        createGameShield(Number(event.target.name));
        localStorage.statusField = "";
    }
});

//нажатие на кнопку результаты
results.addEventListener('click', () => {
    resultsTableWindow.classList.remove('hidden');
    let mas = localStorage.winers.split(' ');
    for(let i = 0; i < mas.length; i++){
        mas[i] = mas[i].split(',');
    }
    mas.pop();
    while (resultList.firstChild) {
        resultList.removeChild(resultList.firstChild);
    }
    for(let i = 0; i < 10; i++){
        let li = document.createElement('li');
        li.textContent = mas[i][0] +'   ' + mas[i][1] +'   ' + mas[i][2] + ':' +  mas[i][3];
        resultList.appendChild(li);
    }
});

//Закрытие окна результаты
offButton.addEventListener('click', () => {
    resultsTableWindow.classList.add('hidden');
});

