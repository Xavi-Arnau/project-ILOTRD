import {
  fetchMovie,
  fetchQuotes,
  getDescriptionFromId,
  getImageFromId,
} from "../model/data.js";
import { displayHeaderAndFooter, getParamId } from "../utils/common.js";

//use the api to retrieve data using the movie id
async function displayMovie() {
  const idMovie = getParamId("idMovie");

  //console.log(response);
  const data = await fetchMovie(idMovie);
  //console.log(data);

  //use the data to fill the movie profile
  //title
  const title = document.querySelector("h2");
  const movie = data.docs[0];
  title.textContent = movie.name;
  //nominations
  document.querySelector("#nominations").textContent =
    movie.academyAwardNominations;
  //wins
  document.querySelector("#wins").textContent = movie.academyAwardWins;
  //revenue
  document.querySelector("#revenue").textContent =
    movie.boxOfficeRevenueInMillions;
  //budget
  document.querySelector("#budget").textContent = movie.budgetInMillions;
  //score
  document.querySelector("#score").textContent = movie.rottenTomatoesScore;
  //runtime
  document.querySelector("#runtime").textContent = movie.runtimeInMinutes;

  //movie picture
  const pic = await getImageFromId("movies", movie._id);
  document.querySelector("#movie-picture").src = pic;
  document.querySelector("#movie-picture").alt = movie.name;
  document.querySelector("title").textContent = "Movies - " + movie.name;

  //description
  const description = await getDescriptionFromId("movies", movie._id);
  if (description) {
    document.querySelector("#description").textContent = description;
  }
}

//use the api to retrieve data using the movie id
async function displayQuotes() {
  const idMovie = getParamId("idMovie");
  const target = document.getElementById("quotes");

  const quotes = await fetchQuotes(idMovie);
  //console.log(idMovie);
  for (let quote of quotes.docs) {
    //create the li
    const newQuoteLi = document.createElement("li");
    newQuoteLi.classList.add("list-group-item");
    const text = document.createTextNode(quote.dialog);
    newQuoteLi.appendChild(text);

    //add the li to the list
    target.appendChild(newQuoteLi);
  }
}

displayMovie();
displayQuotes();
displayHeaderAndFooter();
