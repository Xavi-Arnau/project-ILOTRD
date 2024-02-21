import {
  displayHeaderAndFooter,
  shuffle,
  randomIntFromInterval,
} from "../utils/common.js";
import {
  fetchRandomQuote,
  getCharacterFromId,
  getRandomCharacters,
} from "../model/data.js";
/**
 * gets a variable value from local storage
 * @param {*} item
 * @param {*} init
 * @returns
 */
function getCurrentValue(item, init = 0) {
  let val = parseInt(localStorage.getItem(item));

  if (!Number.isInteger(val)) {
    setCurrentValue(init, item);
    val = init;
  }

  return val;
}
/**
 * sets a variable on local storage
 * @param {*} val
 * @param {*} item
 */
function setCurrentValue(val, item) {
  localStorage.setItem(item, val.toString());
}

//initialize (if needed) and display current score
function displayScore() {
  //current score
  const targetStreak = document.querySelector("#currentStreak");
  targetStreak.textContent = getCurrentValue("currentStreak", 0);

  const targetTries = document.querySelector("#numberOfTries");
  targetTries.textContent = getCurrentValue("numberOfTries");

  const targetBestScore = document.querySelector("#bestScore");
  targetBestScore.textContent = getCurrentValue("bestScore");
}

/**
 * displays a random quote to be used on the quiz
 */
async function getRandomQuote() {
  let data = await fetchRandomQuote();

  const character = await getCharacterFromId(data.docs[0].character);

  //display the quote
  const displayQuote = document.querySelector("#quote");
  displayQuote.textContent = data.docs[0].dialog;

  let arrayAnswers = ["#answer1", "#answer2", "#answer3", "#answer4"];
  arrayAnswers = shuffle(arrayAnswers);
  //console.log(arrayAnswers);

  //display the answers
  const answer1 = document.querySelector(arrayAnswers[0]);
  answer1.textContent = character.name;
  answer1.classList.add("correct");
  //random chars
  const randomCharacters = await getRandomCharacters();

  const answer2 = document.querySelector(arrayAnswers[1]);
  const character2 = randomCharacters.docs[0];
  answer2.textContent = character2.name;
  answer2.classList.add("incorrect");

  const answer3 = document.querySelector(arrayAnswers[2]);
  const character3 = randomCharacters.docs[1];
  answer3.textContent = character3.name;
  answer3.classList.add("incorrect");

  const answer4 = document.querySelector(arrayAnswers[3]);
  const character4 = randomCharacters.docs[2];
  answer4.textContent = character4.name;
  answer4.classList.add("incorrect");

  //we set the event listeners for correct and incorrect
  document.querySelectorAll(".incorrect").forEach(function (elem) {
    elem.addEventListener("click", wrongAnswer);
  });

  document.querySelector(".correct").addEventListener("click", rightAnswer);
}
/**
 * increment the number of attempts
 */
function incrementTries() {
  let tries = getCurrentValue("numberOfTries");
  if (!Number.isInteger(tries)) {
    tries = 1;
  } else {
    tries++;
  }
  setCurrentValue(tries, "numberOfTries");
}
//increment current streak by 1
function incrementCurrentStreak() {
  let streak = getCurrentValue("currentStreak");
  if (!Number.isInteger(streak)) {
    streak = 0;
  } else {
    streak++;
  }
  setCurrentValue(streak, "currentStreak");
}
//update best score if the current streak is better
function updateBestScore() {
  let bestScore = getCurrentValue("bestScore");
  let currentStreak = getCurrentValue("currentStreak");
  if (currentStreak > bestScore) {
    setCurrentValue(currentStreak, "bestScore");
  }
}
/**
 * what we do when the answer is right
 * @param {*} event
 */
function rightAnswer(event) {
  disableButtons();
  event.target.closest("div").classList.add("text-bg-success", "blink");
  //alert("ok");
  incrementCurrentStreak();
  updateBestScore();
  displayScore();
  //loadQuiz();
  setTimeout(() => {
    location.reload();
  }, 3000);
}
/**
 * what we do when the answer is wrong
 * @param {*} event
 */
function wrongAnswer(event) {
  disableButtons();
  event.target.closest("div").classList.add("text-bg-danger", "blink");
  document
    .querySelector("button.correct")
    .closest("div")
    .classList.add("text-bg-success", "blink");

  //alert("ko");
  updateBestScore();
  setCurrentValue(0, "currentStreak");
  displayScore();
  //loadQuiz();
  setTimeout(() => {
    location.reload();
  }, 3000);
}
/**
 * disable the buttons after answering
 */
function disableButtons() {
  document.querySelectorAll("button").forEach((elem) => (elem.disabled = true));
}

/**
 * set up the answers
 */
function loadButtonsTemplate() {
  //select the container to put the new elements
  const container = document.querySelector("#buttons-container");
  //clean the container
  container.innerHTML = "";
  //get the template that we use to display the data
  const buttonsTemplate = document.querySelector("#buttons-template").content;

  container.appendChild(buttonsTemplate.cloneNode(true));
}

/**
 * actions to load the quiz
 */
function loadQuiz() {
  //clean answers from previous question
  loadButtonsTemplate();

  //on the page load we increment the number of tries
  incrementTries();
  //get a random quote and display it
  getRandomQuote();
  //display the score box
  displayScore();
}

loadQuiz();
displayHeaderAndFooter();
