/**
 * gets the favorites string from the local storage and turns it into
 * an usable object before returning it
 * @returns
 */
export function getFavs() {
  const arrayFavs = JSON.parse(localStorage.getItem("arrayFavs"));
  if (Array.isArray(arrayFavs)) {
    return arrayFavs;
  } else {
    return [];
  }
}
/**
 * saves the favorites object on the local storate as a string
 * @param {*} arrayFavs
 */
function saveFavs(arrayFavs) {
  localStorage.setItem("arrayFavs", JSON.stringify(arrayFavs));
}

/**
 * adds a character on the favorites object
 * @param {*} character
 */
function addFav(character) {
  const favs = getFavs();
  favs.push({
    id: character._id,
    name: character.name,
    comment: "",
  });
  saveFavs(favs);
}
/**
 * deletes an element from the favorites object
 * @param {*} idCharacter
 */
export function deleteFav(idCharacter) {
  const favs = getFavs();
  const index = favs.findIndex((item) => item.id === idCharacter);
  favs.splice(index, 1);
  saveFavs(favs);
}

/**
 * checks if a character is already in favorites
 * @param {*} idCharacter
 * @returns bool
 */
export function isFav(idCharacter) {
  const favs = getFavs();
  const found = favs.find((item) => item.id === idCharacter);
  if (found === undefined) {
    return false;
  } else {
    return true;
  }
}
/**
 * toggles the favorite status of a character
 * @param {*} character
 */
export function toggleFav(character) {
  if (isFav(character._id)) {
    //delete it
    deleteFav(character._id);
  } else {
    //add it
    addFav(character);
  }
}
//display header and footer
export async function displayHeaderAndFooter() {
  const response = await fetch("templates.html");
  if (!response.ok) {
    console.log("Error fetching header and footer");
    return;
  }

  const templates = document.createElement("template");
  templates.innerHTML = await response.text();

  const headerTemplate =
    templates.content.querySelector("#template-header").content;
  document.querySelector("#header").appendChild(headerTemplate);

  const footerTemplate =
    templates.content.querySelector("#template-footer").content;
  document.querySelector("#footer").appendChild(footerTemplate);
}

//get the id from query string
export function getParamId(type) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get(type);

  return id;
}

//function to shuffle an array
//https://www.freecodecamp.org/news/how-to-shuffle-an-array-of-items-using-javascript-or-typescript/
export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// https://stackoverflow.com/a/7228322
export function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * helper function to sort objects by values
 * @param {*} obj
 * @returns
 */
export function sortObject(obj) {
  let sortable = [];
  let res = {};
  for (let o in obj) {
    sortable.push([o, obj[o]]);
  }
  sortable.sort(function (a, b) {
    return b[1] - a[1];
  });

  return sortable;
}
