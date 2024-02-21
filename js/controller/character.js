import { getParamId, displayHeaderAndFooter } from "../utils/common.js";

import {
  getCharacterFromId,
  getImageFromId,
  getDescriptionFromId,
} from "../model/data.js";

//use the api to retrieve data using the book id
async function displayCharacter() {
  const idCharacter = getParamId("idCharacter");

  const character = await getCharacterFromId(idCharacter);
  //console.log(character);
  //use the data to fill the char profile
  //name
  const name = document.querySelector("#character-name");
  name.textContent = character.name;
  //birth
  const birth = document.querySelector("#birth");
  birth.textContent = character.birth;
  //death
  const death = document.querySelector("#death");
  death.textContent = character.death;
  //gender
  const gender = document.querySelector("#gender");
  gender.textContent = character.gender;
  //hair
  const hair = document.querySelector("#hair");
  hair.textContent = character.hair;
  //height
  const height = document.querySelector("#height");
  height.textContent = character.height;
  //race
  const race = document.querySelector("#race");
  race.textContent = character.race;
  //realm
  const realm = document.querySelector("#realm");
  realm.textContent = character.realm;
  //spouse
  const spouse = document.querySelector("#spouse");
  spouse.textContent = character.spouse;
  //wiki
  const wiki = document.querySelector("#wiki");
  wiki.textContent = character.wikiUrl;
  wiki.href = character.wikiUrl;

  const pic = await getImageFromId("characters", character._id);

  if (pic) {
    document.querySelector("#character-pic").src = pic;
  }
  document.querySelector("#character-pic").alt = character.name;

  //description
  const description = await getDescriptionFromId("characters", character._id);
  if (description) {
    document.querySelector("#description").textContent = description;
  }
}

displayCharacter();
displayHeaderAndFooter();
