// Controls the main quiz item.

import { randomIntFromInterval } from "./dynamicsUtils";

function Item(name, object, itemConstants) {
  return {
    name: name,
    dname: object.dname,
    components: makeComponents(name, object.components, itemConstants),
    cost: object.cost,
    img: object.img,
  };
}

// Creates a better list of the components used to make an item.
function makeComponents(itemName, components, itemConstants) {
  // Duplicate components array.
  let newComponents = Array.from(components);

  // If components already includes a recipe, replace it with the string "recipe".
  if (newComponents[newComponents.length - 1].includes("recipe")) {
    newComponents.splice(newComponents.length - 1, 1, "recipe");
  }

  // If a constant exists for this item's recipe, add "recipe" to the components list.
  else if (Object.keys(itemConstants).includes("recipe_" + itemName)) {
    newComponents.push("recipe");
  }

  return newComponents;
}

// Randomly selects an item to be used in the quiz.
export function nextItem(itemPool, itemConstants, lastItem) {
  // Filters out some items.
  function isAcceptable(newItem, lastItem) {
    if (lastItem && lastItem.name == newItem.name) return false;
    if (newItem.cost < 100) return false;
    return true;
  }

  // Select a new item from the item pool until we find one that is acceptable.
  let newItem = null;
  do {
    let randomIndex = randomIntFromInterval(0, itemPool.length - 1);
    let itemName = itemPool[randomIndex];
    newItem = Item(itemName, itemConstants[itemName], itemConstants);
  } while (!isAcceptable(newItem, lastItem));

  return newItem;
}
