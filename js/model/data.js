const AUTHTOKEN = "8Wp-OGyTs8mLXdxhXqVj";
import { randomIntFromInterval, sortObject } from "../utils/common.js";
/**
 * fetches books from the api
 * @returns array
 */
export async function fetchBooks() {
  const api = "https://the-one-api.dev/v2/book";

  const response = await fetch(api);
  if (!response.ok) return [];

  //all is good
  const books = await response.json();
  return books.docs;
}
/**
 * fetches movies from the api
 * @returns array
 */
export async function fetchMovies() {
  const api = "https://the-one-api.dev/v2/movie";
  const headers = {
    Accept: "application/json",
    Authorization: "Bearer " + AUTHTOKEN,
  };

  const response = await fetch(api, {
    headers: headers,
  });
  if (!response.ok) return [];

  const movies = await response.json();
  //console.log(movies);
  return movies.docs;
}
/**
 * fetches characters from the api using the filters
 * @param {*} arrayFilters
 * @param {*} page
 * @returns array
 */
export async function fetchCharacters(arrayFilters, page) {
  //transform the array of filters into a string to use in the url
  let filters = arrayFilters.join("&");
  const api =
    "https://the-one-api.dev/v2/character?" +
    filters +
    "&limit=10&page=" +
    page;
  //console.log(api);
  const headers = {
    Accept: "application/json",
    Authorization: "Bearer " + AUTHTOKEN,
  };

  const response = await fetch(api, {
    headers: headers,
  });
  if (!response.ok) return [];
  const characters = await response.json();
  return characters;
}
/**
 * retrieves characters from the api and makes some stats
 * @returns object
 */
export async function characterStats() {
  const api = "https://the-one-api.dev/v2/character?";
  const headers = {
    Accept: "application/json",
    Authorization: "Bearer " + AUTHTOKEN,
  };

  const response = await fetch(api, {
    headers: headers,
  });
  if (!response.ok) return [];
  const characters = await response.json();
  let totalCharacters = characters.docs.length;
  let gender = { Other: 0 };
  let race = { Other: 0 };

  let alive = characters.docs.filter(
    (elem) =>
      elem.death === "" ||
      elem.death.includes("Still alive") ||
      elem.death.includes("Immortal")
  );
  let married = characters.docs.filter((elem) => elem.spouse === "");
  //console.log(alive);
  //console.log(characters.docs);
  let cleanGenders = [
    "",
    "NaN",
    "male",
    "Males",
    "Most likely male",
    undefined,
  ];
  let cleanRaces = ["", "NaN", undefined];

  for (let char of characters.docs) {
    if (!cleanGenders.includes(char.gender)) {
      if (!gender[char.gender]) {
        gender[char.gender] = 1;
      } else {
        gender[char.gender] += 1;
      }
    } else {
      gender["Other"] = gender["Other"] + 1;
    }
    if (!cleanRaces.includes(char.race)) {
      if (!race[char.race]) {
        race[char.race] = 1;
      } else {
        race[char.race] += 1;
      }
    } else {
      race["Other"] = race["Other"] + 1;
    }
  }
  gender = sortObject(gender);
  race = sortObject(race);

  return {
    gender: gender,
    race: race,
    alive: alive.length,
    dead: totalCharacters - alive.length,
    married: married.length,
    single: totalCharacters - married.length,
    total: totalCharacters,
  };
}
/**
 * fetches data from a particular movie on the api
 * @param {*} idMovie
 * @returns
 */
export async function fetchMovie(idMovie) {
  const api = "https://the-one-api.dev/v2/movie/" + idMovie;
  const headers = {
    Accept: "application/json",
    Authorization: "Bearer " + AUTHTOKEN,
  };

  const response = await fetch(api, {
    headers: headers,
  });

  const data = await response.json();
  return data;
}
/**
 * fetches quotes from a particular movie on the api
 * @param {*} idMovie
 * @returns
 */
export async function fetchQuotes(idMovie) {
  const api = "https://the-one-api.dev/v2/quote?limit=10&movie=" + idMovie;
  const headers = {
    Accept: "application/json",
    Authorization: "Bearer " + AUTHTOKEN,
  };

  const response = await fetch(api, {
    headers: headers,
  });

  const quotes = await response.json();
  return quotes;
}
/**
 * gets a quote at random from the api
 * @returns
 */
export async function fetchRandomQuote() {
  const randomQuoteKey = randomIntFromInterval(0, 2383);

  //use the random key to get one random quote using the pagination capabilities of the api
  const api =
    "https://the-one-api.dev/v2/quote?limit=1&offset=" + randomQuoteKey;
  const headers = {
    Accept: "application/json",
    Authorization: "Bearer " + AUTHTOKEN,
  };

  const response = await fetch(api, {
    headers: headers,
  });
  const data = await response.json();

  return data;
}

//get data of a character using their id
export async function getCharacterFromId(id) {
  //use the random key to get one random quote using the pagination capabilities of the api
  const api = "https://the-one-api.dev/v2/character/" + id;
  const headers = {
    Accept: "application/json",
    Authorization: "Bearer " + AUTHTOKEN,
  };

  const response = await fetch(api, {
    headers: headers,
  });
  const data = await response.json();
  //console.log(data);
  //console.log(data.docs[0].dialog);
  return data.docs[0];
}

//we need 3 wrong answers for the quiz so we retrieve 3 characters at random
export async function getRandomCharacters() {
  const randomCharKey = randomIntFromInterval(0, 930);
  const api =
    "https://the-one-api.dev/v2/character?limit=3&offset=" + randomCharKey;
  const headers = {
    Accept: "application/json",
    Authorization: "Bearer " + AUTHTOKEN,
  };

  const response = await fetch(api, {
    headers: headers,
  });
  const data = await response.json();
  //console.log(data);
  return data;
}

//retrieve images data from the json file
export async function getImageFromId(type, id) {
  const response = await fetch("./js/model/data.json");
  if (!response.ok) {
    console.log("Error fetching local data");
    return;
  }

  //all is good
  const data = await response.json();
  const found = data[type].find((element) => element.id === id);
  //console.log(found);
  if (!found) {
    return false;
  }
  return found.image;
}
/**
 * gets a description from the local json
 * @param {*} type
 * @param {*} id
 * @returns
 */
export async function getDescriptionFromId(type, id) {
  const response = await fetch("./js/model/data.json");
  if (!response.ok) {
    console.log("Error fetching local data");
    return;
  }

  //all is good
  const data = await response.json();
  const found = data[type].find((element) => element.id === id);
  //console.log(found);
  if (!found) {
    return false;
  }
  return found.description;
}

//use the api to retrieve data using the book id
export async function getBookFromId(idBook) {
  const api = "https://the-one-api.dev/v2/book/" + idBook;
  const headers = {
    Accept: "application/json",
    Authorization: "Bearer " + AUTHTOKEN,
  };

  const response = await fetch(api, {
    headers: headers,
  });
  //console.log(response);
  const data = await response.json();
  //console.log(data);
  const book = data.docs[0];
  return book;
}
/**
 * fetches the chapters from a particular book on the api
 * @param {*} idBook
 * @returns
 */
export async function getChapters(idBook) {
  const api = "https://the-one-api.dev/v2/book/" + idBook + "/chapter";
  const headers = {
    Accept: "application/json",
    Authorization: "Bearer " + AUTHTOKEN,
  };

  const response = await fetch(api, {
    headers: headers,
  });
  //console.log(response);
  const chapters = await response.json();
  return chapters;
}
