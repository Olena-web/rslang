import { getWords } from "../js/api";
import { PAGES_PER_GROUP, WORDS_PER_PAGE } from "../js/constants";
import { SprintWord, Word } from "../js/types";
import { countdown } from "./countDown";

/* return array of 80 words containing of a random page from the chosen level
  and words from previous pages of the same level or
  words from the previous level 
*/

async function getArrayOfWords (level: number) {

  let page = getRandomNumber(PAGES_PER_GROUP);
  let additionalwords: Word[] = [];
  let items = await getWords(level, page);

  if (page > 1) {
    additionalwords = await getWords(level, page - 1);
    items = items.concat(additionalwords);
    if (page > 2 ) {
      additionalwords = await getWords(level, page - 2)
      items = items.concat(additionalwords);
      if (page > 3 ) {
        additionalwords = await getWords(level, page - 3);
        items = items.concat(additionalwords);
      } 
    }
    
  } else {
    if (level > 1) {
      additionalwords = await getWords(level - 1, 5);
      items = items.concat(additionalwords);
      additionalwords = await getWords(level - 1, 4);
      items = items.concat(additionalwords);
    }
  }

  return items;
}

// toggle level-selection screen and main game screen

export function replay() {
  const initialScreen = <HTMLElement>document.querySelector('.sprint-start-screen');
  const gameScreen = <HTMLElement>document.querySelector('.sprint-game-screen');
  gameScreen.classList.add('hide');
  initialScreen.classList.remove('hide');
}

export async function startSprintGame(level: number) {

  let points: number = 0;
  let index: number = 0;    
  let words = await getArrayOfWords(level);
  let results: SprintWord[] = [];

  const initialScreen = <HTMLElement>document.querySelector('.sprint-start-screen');
  (<HTMLElement>initialScreen).classList.add('hide');

  const parentDiv = <HTMLElement>document.querySelector('.sprint-view');

  const gameScreen = <HTMLElement>document.createElement('div');
  gameScreen.classList.add('sprint-game-screen');

  let html = `
    <div class="icon replay-button" title="К выбору уровня"></div>
    <div class="timer-wrapper">
      <div class="clock-image"></div>
      <div class="timer" id="counter"></div>
    </div>
    
    <div class="points"><span class="sprint-text">Очки: </span><span id="sprint-points">0</span></div>
    <div class="question-wrapper">
      <span class="sprint-word english-word" id="sprint-english-word">${words[index].word}</span>
      <span class="is"> значит </span>
      <span class="sprint-word translation" id="sprint-translation">${words[index].wordTranslate}</span>?
    </div>
    <div class="sprint-controls-wrapper" id="sprint-controls">
      <div class="button sprint-answer-button sprint-correct" id="sprint-correct-btn">Верно</div>
      <div class="button sprint-answer-button sprint-incorrect" id="sprint-incorrect-btn">Неверно</div>
    </div>    
  `

  gameScreen.innerHTML = html;
  (<HTMLElement>parentDiv).appendChild(gameScreen);

  // change to intiail screen if replay button is clicked
  const replayBtn = gameScreen.querySelector('.replay-button');
  (<HTMLElement>replayBtn).addEventListener('click', () => {
    replay();
  })

  const controls = document.getElementById('sprint-controls');  

  // to make the first word work
  let correctAnswer = words[index].wordTranslate;  

  (<HTMLElement>controls).addEventListener("click", (event) => {

    const englishWord = <HTMLElement>document.getElementById('sprint-english-word');
    const translation = <HTMLElement>document.getElementById('sprint-translation');   
        
    if ((((<HTMLElement>event.target).id === 'sprint-correct-btn') && ((<HTMLElement>translation).innerText === correctAnswer)) ||  (((<HTMLElement>event.target).id != 'sprint-correct-btn') && ((<HTMLElement>translation).innerText != correctAnswer)))  {
      points++;
      refreshPoints(points);
      results.push({id: words[index].id, sound: words[index].audio, word: words[index].word, translation: words[index].wordTranslate, isCorrectlyAnswered: true});
    } else {
      results.push({id: words[index].id, sound: words[index].audio, word: words[index].word, translation: words[index].wordTranslate, isCorrectlyAnswered: false});
    }

    index++;

    if (words[index] == null) {
      alert('Ты использовал все доступные слова. Молодец!');
      renderSprintResults(results);
      // replay();
    } else {
      let randomAnswers = getRandomAnswers(1, words);
      correctAnswer = words[index].wordTranslate;
      randomAnswers.push(correctAnswer);
      (<HTMLElement>englishWord).innerText = words[index].word;
      (<HTMLElement>translation).innerText = randomAnswers[getRandomNumber(2)];
    }
  })

  countdown();

  let watching = setInterval(() => {
    const counter = (<HTMLElement>document.getElementById('counter')).innerText;
    if (counter == '0:00') {
      clearInterval(watching);
      renderSprintResults(results);
    }
  }, 1000);
   
}

export function getRandomNumber(num: number) {
  return Math.floor(Math.random() * num);
}

// create an array of random answers
export function getRandomAnswers(num: number, words: Word[]) {
  let arrayOfAnswers: string[] = [];

  for (let i = 0; i < num; i++) {
    arrayOfAnswers.push(words[getRandomNumber(WORDS_PER_PAGE)].wordTranslate);
  }
  return arrayOfAnswers;
}

function refreshPoints(points:number) {
  const pointsDiv = document.getElementById('sprint-points');
  (<HTMLElement>pointsDiv).innerText = points.toString();
}

export async function renderSprintResults(array: SprintWord[]) {

  let index: number = 0;
  let html = `
    
    <div class="sprint-results">
      <div class="icon results-replay-btn replay-button" title="К выбору уровня"></div>
      <div class="title sprint-results-title">Твои результаты:</div>

      <table class="table" id="sprint-results-table">
        <thead>
          <th></th>
          <th>Звук</th>
          <th>Слово</th>
          <th>Перевод</th>
          <th>Результат</th>
        </thead>
        <tbody>
          ${await renderSprintRows(array)}
        </tbody>
      </table> 
    </div> 
  `;
  const resultsView = document.createElement('div');
  resultsView.classList.add('sprint-results-view');
  resultsView.innerHTML = html;

  const gameScreen = <HTMLElement>document.querySelector('.sprint-game-screen');
  gameScreen.classList.add('hide');

  const parentDiv = <HTMLElement>document.querySelector('.sprint-view');  
  parentDiv.appendChild(resultsView);

  // Toggle screens
  const replayBtn = resultsView.querySelector('.replay-button');
  (<HTMLElement>replayBtn).addEventListener('click', () => {
    const initialScreen = <HTMLElement>document.querySelector('.sprint-start-screen');
    resultsView.classList.add('hide');
    (<HTMLElement>initialScreen).classList.remove('hide');    
  })
}

export async function renderSprintRows(arrayOfResults: SprintWord[]) {
  let tableRowsHtml = '';
  const table = document.getElementById('sprint-results-table');
  const resultsBody = document.createElement('tbody');
  resultsBody.classList.add('results-rows');

  arrayOfResults.forEach((word: SprintWord, index: number) => {   
    let classForIcon: string;

    if (word.isCorrectlyAnswered) {
      classForIcon = 'sprint-result-correct';
    } else {
      classForIcon = 'sprint-result-incorrect';
    }

    tableRowsHtml +=
    `
    <tr id="word-${index}">
      <td>${index + 1}</td>
      <td class="sprint-sound-icon" src="${word.sound}"></td>
      <td>${word.word}</td>
      <td>${word.translation}</td>
      <td class="sprint-icon ${classForIcon}"></td>
    </tr>
    `
  })
  // resultsBody.innerHTML = tableRowsHtml;
  // (<HTMLElement>table).appendChild(resultsBody);
  return tableRowsHtml;
}