import {
  fetchBooks,
  fetchMovies,
  fetchCharacters,
  getImageFromId,
} from "../model/data.js";
import { displayHeaderAndFooter, isFav, toggleFav } from "../utils/common.js";
const fellowship = [
  "5cd99d4bde30eff6ebccfbe6", //aragorn
  "5cd99d4bde30eff6ebccfea0", //gandalf
  "5cd99d4bde30eff6ebccfc15", //frodo
  "5cd99d4bde30eff6ebccfc7c", //merry
  "5cd99d4bde30eff6ebccfe2e", //pippin
  "5cd99d4bde30eff6ebccfd0d", //sam
  "5cd99d4bde30eff6ebccfd81", //legolas
  "5cd99d4bde30eff6ebccfd23", //gimli
  "5cd99d4bde30eff6ebccfc57", //Boromir
];
/**
 * displays the books
 */
async function displayBooksList() {
  //select the container to put the new elements
  const container = document.querySelector("#books-list");
  //get the data
  const books = await fetchBooks();
  //get the template that we use to display the data
  const bookTemplate = document.querySelector("#book-template").content;
  //create the fragment
  const fragment = document.createDocumentFragment();

  for (let book of books) {
    const clone = bookTemplate.cloneNode(true);
    clone.querySelector(".book-title").textContent = book.name;
    clone.querySelector(".book-poster").src = await getImageFromId(
      "books",
      book._id
    );
    clone.querySelector(".book-poster").alt = book.name;
    clone.querySelector(".book-link").href = "./book.html?idBook=" + book._id;

    fragment.appendChild(clone);
  }
  container.appendChild(fragment);
}
/**
 * displays the movies
 */
async function displayMoviesList() {
  //select the container to put the new elements
  const container = document.querySelector("#movies-list");
  //get the data
  const movies = await fetchMovies();
  //get the template that we use to display the data
  const movieTemplate = document.querySelector("#movie-template").content;
  //create the fragment
  const fragment = document.createDocumentFragment();

  //iterate and make new movie elements using the template
  for (let movie of movies) {
    const clone = movieTemplate.cloneNode(true);
    clone.querySelector(".movie-title").textContent = movie.name;
    clone.querySelector(".movie-poster").src = await getImageFromId(
      "movies",
      movie._id
    );
    clone.querySelector(".movie-poster").alt = movie.name;
    clone.querySelector(".movie-link").href =
      "./movie.html?idMovie=" + movie._id;

    fragment.appendChild(clone);
  }
  container.appendChild(fragment);
}
/**
 * displays the characters
 * @param {*} initial
 * @param {*} page
 */
async function displayCharactersList(initial = false, page = 1) {
  let race = document.querySelector("#race").value;
  let gender = document.querySelector("#gender").value;
  let name = document.querySelector("#name").value;
  let filters = [];
  //at initial load the fellowship characters
  if (initial) {
    let id = "_id=" + fellowship.join(",");
    filters.push(id);
  } else {
    if (race && race !== "Race") {
      if (race === "Other") {
        race = "race!=Human,Hobbit,Elf,Ent,Dwarf,Maiar";
      } else {
        race = "race=" + race;
      }
      filters.push(race);
    }
    if (gender && gender !== "Gender") {
      if (gender === "Other") {
        gender = "gender!=Male,Female";
      } else {
        gender = "gender=" + gender;
      }
      filters.push(gender);
    }
    if (name) {
      name = `name=/${name}/i`;
      filters.push(name);
    }
  }

  const characters = await fetchCharacters(filters, page);
  //console.log(characters);

  //pagination
  //delete current pagination
  document.querySelector("#characters-pagination").textContent = "";
  if (characters.pages > 1) {
    //we have more than one results page so we display it
    displayPagination(characters.pages, characters.page);
  }

  const table = document.querySelector("#character-row").content;
  const container = document.querySelector("#characters-table tbody");

  const fragment = document.createDocumentFragment();
  for (let character of characters.docs) {
    const clone = table.cloneNode(true);
    //fill the row with character data
    clone.querySelector(".character-link").textContent = character.name;
    clone.querySelector(".character-link").href =
      "./character.html?idCharacter=" + character._id;
    clone.querySelector(".character-race").textContent = character.race;
    clone.querySelector(".character-gender").textContent = character.gender;
    const button = clone.querySelector(".character-fav button");
    const starIcon = clone.querySelector(".character-fav button i");
    //if fav star is red and filled
    if (isFav(character._id)) {
      button.classList.add("btn", "btn-danger");
      starIcon.classList.add("bi-star-fill");
    } else {
      button.classList.add("btn", "btn-success");
      starIcon.classList.add("bi-star");
    }
    //show a different button if the item is already in favs or not
    button.addEventListener("click", function (event) {
      toggleFav(character);
      if (this.classList.contains("btn-success")) {
        this.classList.add("btn-danger");
        this.classList.remove("btn-success");
        this.querySelector("i").classList.remove("bi-star");
        this.querySelector("i").classList.add("bi-star-fill");
      } else {
        this.classList.remove("btn-danger");
        this.classList.add("btn-success");

        this.querySelector("i").classList.add("bi-star");
        this.querySelector("i").classList.remove("bi-star-fill");
      }
    });

    fragment.appendChild(clone);
  }
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  container.appendChild(fragment);
}
/**
 * displays the pagination
 * @param {*} pages
 * @param {*} currentPage
 */
function displayPagination(pages, currentPage) {
  const template = document.querySelector("#template-page").content;
  const container = document.querySelector("#characters-pagination");

  const fragment = document.createDocumentFragment();
  let start = currentPage - 5;
  if (start < 1) {
    start = 1;
  }
  let finish = currentPage + 5;
  if (finish > pages) {
    finish = pages;
  }

  for (let i = start; i <= finish; i++) {
    const clone = template.cloneNode(true);
    const button = clone.querySelector("a.page-link");
    button.textContent = i;
    //active page
    if (i === currentPage) {
      button.classList.add("active");
    }
    button.addEventListener("click", function (event) {
      event.preventDefault();
      console.log(this.textContent);
      //display new results
      displayCharactersList(false, this.textContent);
    });
    fragment.appendChild(clone);
  }
  container.appendChild(fragment);
}
/**
 * makes the form ready
 */
function searchForm() {
  const submit = document.querySelector("form button");
  submit.addEventListener("click", function (event) {
    event.preventDefault();
    //console.log(document.getElementById("race").value);
    displayCharactersList();
  });
}

displayBooksList();
displayMoviesList();
displayCharactersList(true);
searchForm();
displayHeaderAndFooter();
