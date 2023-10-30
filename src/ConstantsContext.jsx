// This file controls constant data that is only changed the first time the program launches.
// This includes fetching the items from OpenDota, and creating pools of items and ingredients.

import { createContext } from "react";

// Fetches all the item constants from OpenDota.
async function getItemConstants() {
  let response = await fetch("https://api.opendota.com/api/constants/items");
  const data = await response.json();
  return data;
}

// Creates a pool of items to pull from for quiz questions.
function createItemPool() {
  let unreleased = [
    "samurai_tabi",
    "witches_switch",
    "hermes_sandals",
    "lunar_crest",
  ];
  let removed = [
    "necronomicon",
    "necronomicon_2",
    "necronomicon_3",
    "diffusal_blade_2",
    "wraith_pact",
  ];
  let pool = [];
  for (const [key, value] of Object.entries(itemConstants)) {
    if (value["created"] && !unreleased.includes(key) && !removed.includes(key))
      pool.push(key);
  }
  return pool;
}

// Generates a list of all DOTA items that are used in crafting other items.
function getAllIngredients() {
  let ingredients = [];

  for (let itemName of Object.keys(itemConstants)) {
    if (itemConstants[itemName].components) {
      for (let c of itemConstants[itemName].components) {
        if (c != "" && !c.includes("recipe") && !ingredients.includes(c))
          ingredients.push(c);
      }
    }
  }

  return ingredients;
}

let itemConstants = await getItemConstants();
let itemPool = createItemPool();
let ingredients = getAllIngredients();

export const ConstantsContext = createContext({
  itemConstants: itemConstants,
  itemPool: itemPool,
  ingredients: ingredients,
});
