import { getParamId, displayHeaderAndFooter } from "../utils/common.js";

import {
  getImageFromId,
  getDescriptionFromId,
  getBookFromId,
  getChapters,
} from "../model/data.js";

//use the api to retrieve data using the book id
async function displayBook() {
  const idBook = getParamId("idBook");

  //use the data to fill the book profile
  const book = await getBookFromId(idBook);
  //title
  const title = document.querySelector("h2");
  title.textContent = book.name;

  //movie picture
  const pic = await getImageFromId("books", book._id);

  document.querySelector("#book-picture").src = pic;
  document.querySelector("#book-picture").alt = book.name;
  document.querySelector("title").textContent = "Books - " + book.name;

  //description
  const description = await getDescriptionFromId("books", book._id);
  if (description) {
    document.querySelector("#description").textContent = description;
  }
}

//use the api to retrieve data using the movie id
async function displayChapters() {
  const idBook = getParamId("idBook");
  const target = document.getElementById("chapters");

  const chapters = await getChapters(idBook);
  //console.log(chapters);

  for (let chapter of chapters.docs) {
    //create the li
    const newChapterLi = document.createElement("li");
    newChapterLi.classList.add("list-group-item");
    const text = document.createTextNode(chapter.chapterName);
    newChapterLi.appendChild(text);

    //add the li to the list
    target.appendChild(newChapterLi);
  }
}

displayBook();
displayChapters();
displayHeaderAndFooter();
