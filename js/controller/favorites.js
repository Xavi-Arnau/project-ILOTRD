import { displayHeaderAndFooter, getFavs, deleteFav } from "../utils/common.js";

import { getImageFromId } from "../model/data.js";
/**
 * displays the favorites
 */
async function listFavorites() {
  //select the container to put the new elements
  const container = document.querySelector("#favorites");
  //get the template that we use to display the data
  const favTemplate = document.querySelector("#favorite-template").content;
  //create the fragment
  const fragment = document.createDocumentFragment();
  const favs = getFavs();
  for (let fav of favs) {
    const clone = favTemplate.cloneNode(true);
    clone.querySelector(".card-title").textContent = fav.name;
    clone.querySelector("a.fav-link").href =
      "./character.html?idCharacter=" + fav.id;
    const pic = await getImageFromId("characters", fav.id);
    if (pic) {
      clone.querySelector("img").src = pic;
    }

    clone.querySelector("img").alt = fav.name;
    //remove fav button
    const favButton = clone.querySelector("a.fav-remove");

    favButton.addEventListener("click", function (event) {
      event.preventDefault();
      deleteFav(fav.id);

      this.closest("div.fav-item").remove();
    });

    fragment.appendChild(clone);
  }

  container.appendChild(fragment);
}

listFavorites();
displayHeaderAndFooter();
