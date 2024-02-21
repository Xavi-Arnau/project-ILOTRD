import { displayHeaderAndFooter } from "../utils/common.js";
import { characterStats } from "../model/data.js";

/**
 * display some stats
 */
async function displayStats() {
  let stats = await characterStats();
  //console.log(stats);

  //gender table
  let genderTable = document.querySelector("#gender tbody");
  for (let gender of stats["gender"]) {
    let perGender = (gender[1] / stats["total"]) * 100;
    fillStatsRow([gender[0], gender[1], perGender.toFixed(2)], genderTable);
  }

  //race table
  let raceTable = document.querySelector("#race tbody");
  for (let race of stats["race"]) {
    let perRace = (race[1] / stats["total"]) * 100;
    fillStatsRow([race[0], race[1], perRace.toFixed(2)], raceTable);
  }

  //status table
  let statusTable = document.querySelector("#status tbody");
  let perAlive = (stats["alive"] / stats["total"]) * 100;
  let perDead = (stats["dead"] / stats["total"]) * 100;
  fillStatsRow(["Alive", stats["alive"], perAlive.toFixed(2)], statusTable);
  fillStatsRow(["Dead", stats["dead"], perDead.toFixed(2)], statusTable);

  //married
  let maritalTable = document.querySelector("#marital tbody");
  let perMarried = (stats["married"] / stats["total"]) * 100;
  let perSingle = (stats["single"] / stats["total"]) * 100;
  fillStatsRow(
    ["Married", stats["married"], perMarried.toFixed(2)],
    maritalTable
  );
  fillStatsRow(["Single", stats["single"], perSingle.toFixed(2)], maritalTable);
}

/**
 * helper function to fill table rows with data
 * @param {*} arr
 * @param {*} table
 */
function fillStatsRow(arr, table) {
  let row = document.createElement("tr");

  for (let item of arr) {
    let td = document.createElement("td");
    let text = document.createTextNode(item);
    td.appendChild(text);
    row.appendChild(td);
  }

  table.appendChild(row);
}

displayStats();
displayHeaderAndFooter();
