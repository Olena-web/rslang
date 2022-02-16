import { Question1 } from './data/Question1';
import { Round1 } from './data/Round1';

const PLAYED_QUESTIONS = 'playedQuestions';
const PLAYED_ROUNDS = 'playedRounds';
const IS_RECREATE_DEFAULT = true;
const LEVEL_PAGE = 'currentPage';
const QUESTIONS_PER_DAY = 'questionsPerDay';
const TRUE_PER_DAY = 'trueUnswersPerDay';
const LONGEST_PER_DAY = 'longestCorrectUnswersPerDay';

let isInit = false;

if (!isInit) {
  createPlayedQuestion();
  createPlayedRounds();
  createQuestionsPerDay();
  createTrueQuestionsPerDay();
  createLongestTrueQuestionsPerDay();
  isInit = true;
}
//make calqulator for questions all in game per day
function createQuestionsPerDay(recreate = false): void {
  const item = getQuestionsPerDay();
  if (recreate || !item) {
    setQuestionsPerDay(0);
  }
}

export function getQuestionsPerDay(): number {
  let item = window.localStorage.getItem(QUESTIONS_PER_DAY);
  if (!item) {
    return 0;
  } else {
    return +item;
  }
}

export function setQuestionsPerDay(numberOfQuestions: number): void {
  window.localStorage.setItem(QUESTIONS_PER_DAY, `${numberOfQuestions}`);
}

//make calqulator for questions TRUE in game per day
function createTrueQuestionsPerDay(recreate = false): void {
  const item = getTrueQuestionsPerDay();
  if (recreate || !item) {
    setTrueQuestionsPerDay(0);
  }
}

export function getTrueQuestionsPerDay(): number {
  let item = window.localStorage.getItem(TRUE_PER_DAY);
  if (!item) {
    return 0;
  } else {
    return +item;
  }
}

export function setTrueQuestionsPerDay(numberOfTrueQuestions: number): void {
  window.localStorage.setItem(TRUE_PER_DAY, `${numberOfTrueQuestions}`);
}

//make calqulator for longest TRUE SERIA in game per day
function createLongestTrueQuestionsPerDay(recreate = false): void {
  const item = getLongestTrueQuestionsPerDay();
  if (recreate || !item) {
    setLongestTrueQuestionsPerDay(0);
  }
}

export function getLongestTrueQuestionsPerDay(): number {
  let item = window.localStorage.getItem(LONGEST_PER_DAY);
  if (!item) {
    return 0;
  } else {
    return +item;
  }
}

export function setLongestTrueQuestionsPerDay(numberOfLongestTrueQuestions: number): void {
  window.localStorage.setItem(LONGEST_PER_DAY, `${numberOfLongestTrueQuestions}`);
}

function createPlayedQuestion(recreate = IS_RECREATE_DEFAULT): void {
  const item = getPlayedQuestions();
  if (recreate || !Array.isArray(item)) {
    window.localStorage.setItem(PLAYED_QUESTIONS, JSON.stringify([]));
  }
}

function createPlayedRounds(recreate = IS_RECREATE_DEFAULT): void {
  const item = getPlayedRounds();
  //roundsPerDay++ TODO: upgtate inLocalStorage
  if (recreate || !Array.isArray(item)) {
    window.localStorage.setItem(PLAYED_ROUNDS, JSON.stringify([]));
  }
}

export function addPlayedQuestion(question: Question1): void {
  const questions = JSON.parse(<string>window.localStorage.getItem(PLAYED_QUESTIONS));
  questions.push(question);
  window.localStorage.setItem(PLAYED_QUESTIONS, JSON.stringify(questions));
}

export function getPlayedQuestions(): Question1[] {
  const item = window.localStorage.getItem(PLAYED_QUESTIONS);
  if (!item) {
    return [];
  } else {
    return JSON.parse(<string>item);
  }
}

export function getLevelPage(): string {
  return JSON.parse(<string>window.localStorage.getItem(LEVEL_PAGE));
}

export function getPlayedRounds(): Question1[] {
  return JSON.parse(<string>window.localStorage.getItem(PLAYED_ROUNDS));
}

export function clearPlayedQuestions(): void {
  createPlayedQuestion();
}

export function finishRound(groupId: number) {
  const question = getPlayedQuestions();
  const round = new Round1(groupId, question);
  window.localStorage.setItem(
    PLAYED_ROUNDS,
    JSON.parse(<string>window.localStorage.getItem(PLAYED_ROUNDS)).push(round)
  );
  clearPlayedQuestions();
}
