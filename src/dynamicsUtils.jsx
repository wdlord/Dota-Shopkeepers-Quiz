// This file is essentially the Controller. It contains functionality for the guesses and the options.

export function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

// Structure of a new Guess data object.
function Guess(index) {
  return {
    index: index,
    name: "",
    optionIndex: null,
  };
}

// Structure of a new Option data object.
function Option(index, name, dname) {
  return {
    index: index,
    name: name,
    dname: dname,
    guessIndex: null,
  };
}

// Generates the object encapsulating our guesses and options.
export function generateDynamics(item, context) {
  // Generate the guesses.
  let guesses = generateGuesses(item);

  // Generate the options.
  let options = generateOptions(item, context);

  return {
    guesses: guesses,
    options: options,
  };
}

// Generates the correct amount of guess slots.
function generateGuesses(item) {
  return Array.from(item.components, (c, i) => Guess(i));
}

// Populates the quiz options.
function generateOptions(item, context) {
  let options = [];

  for (let i = 0; i < 9; i++) {
    // Add the correct non-recipe components.
    if (i < item.components.length && item.components[i] != "recipe") {
      let name = item.components[i];
      let dname = context.itemConstants[name].dname;
      options.push(Option(i, name, dname));
    }

    // Otherwise add dummy options.
    else {
      let name = randomOption(item, context);
      let dname = context.itemConstants[name].dname;
      options.push(Option(i, name, dname));
    }
  }

  shuffle(options);

  // Add the recipe.
  options.push(Option(10, "recipe", "Recipe"));

  return options;
}

// Generates a dummy option.
function randomOption(item, context) {
  let optionName = null;
  let loops = 0;

  // Repeatedly select a new random item until it passes the additional quiz filter.
  do {
    let randomIndex = randomIntFromInterval(0, context.ingredients.length - 1);
    optionName = context.ingredients[randomIndex];
    loops++;
  } while (
    optionNotAcceptable(optionName, item, context.itemConstants) &&
    loops <= 100
  );

  // Failsafe, usually caused by very cheap items.
  if (loops >= 100) {
    return "branches";
  }

  return optionName;
}

// Filters out some additional items to make the quiz more engaging.
function optionNotAcceptable(option, item, itemConstants) {
  let optionConstant = itemConstants[option];

  // Cannot be more expensive than the main item.
  if (optionConstant.cost >= item.cost) return true;

  // Cannot have no cost.
  if (!optionConstant.cost) return true;

  // Cannot be a recipe.
  if (option.includes("recipe")) return true;

  // No wards.
  if (option.includes("ward")) return true;

  // Power treads is always the belt of strength variety.
  if (
    item.dname == "Power Treads" &&
    ["robe", "boots_of_elves"].includes(option)
  ) {
    return true;
  }

  // Can't be an item that is no longer in the game.
  let removed = ["necronomicon", "necronomicon_2"];
  if (removed.includes(option)) return true;

  // Avoid mult-level dagon confusion.
  if (option.includes("dagon")) return true;

  // Avoid unbelievable options.
  let badOptions = [
    "travel_boots",
    "blink",
    "ultimate_scepter",
    "magic_stick",
    "quelling_blade",
  ];
  if (badOptions.includes(option)) return true;
}

// Links a guess and an option.
export function link(guessIndex, optionIndex, dynamics, setDynamics) {
  // Handles guesses being full.
  if (guessIndex == -1) return;

  // Set the guess.
  let newGuesses = Array.from(dynamics.guesses);
  newGuesses[guessIndex].name = dynamics.options[optionIndex].name;
  newGuesses[guessIndex].optionIndex = optionIndex;

  // Set the option.
  let newOptions = Array.from(dynamics.options);
  newOptions[optionIndex].guessIndex = guessIndex;

  setDynamics({ guesses: newGuesses, options: newOptions });
}

// Unlinks a guess and an option.
export function unlink(guessIndex, optionIndex, dynamics, setDynamics) {
  // Set the guess.
  let newGuesses = Array.from(dynamics.guesses);
  newGuesses[guessIndex].name = "";
  newGuesses[guessIndex].optionIndex = null;

  // Set the option.
  let newOptions = Array.from(dynamics.options);
  newOptions[optionIndex].guessIndex = null;

  setDynamics({ guesses: newGuesses, options: newOptions });
}

// Returns the index of the next empty guess slot.
export function nextGuessIndex(guesses) {
  for (let i in guesses) {
    if (guesses[i].optionIndex == null) return i;
  }
  return -1;
}

// Modifies the options to show correct answers in color and incorrect answers in grayscale.
export function showAnswers(item, dynamics, setDynamics) {
  let answers = Array.from(item.components);

  let newOptions = [];

  for (let o of dynamics.options) {
    // Try to find the option name in the answers.
    let index = answers.indexOf(o.name);

    // If we found it, show it in color, and pop it from the answers.
    if (index != -1) {
      o.guessIndex = null;
      answers.splice(index, 1);
    }

    // If we did not find it, show it in grayscale.
    else {
      o.guessIndex = -1;
    }

    newOptions.push(o);
  }
  setDynamics({ guesses: dynamics.guesses, options: newOptions });
}
