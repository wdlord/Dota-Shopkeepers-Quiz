/* eslint-disable react/prop-types */
import { useContext } from "react";
import { nextItem } from "./ItemUtils";
import { showAnswers } from "./dynamicsUtils";
import { ConstantsContext } from "./ConstantsContext";

function Controls({
  item,
  setItem,
  dynamics,
  setDynamics,
  frozen,
  setFrozen,
  score,
  setScore,
}) {
  let context = useContext(ConstantsContext);

  // Updates the user's quiz score.
  function updateScore(answeredCorrectly) {
    let newScore = { ...score };

    if (answeredCorrectly) {
      newScore.streak++;
      newScore.correct++;
      newScore.wasCorrect = true;
    } else {
      newScore.streak = 0;
      newScore.wasCorrect = false;
    }
    newScore.total++;
    setScore(newScore);
  }

  // Triggers state changes to reset the quiz view.
  function goNext() {
    setItem(nextItem(context.itemPool, context.itemConstants, item));
    setFrozen(false);
  }

  // State changes to display the correct answers to the user.
  function revealAnswers() {
    setFrozen(true);
    showAnswers(item, dynamics, setDynamics);
  }

  // Checks whether or not the user guesses were correct.
  function isCorrect() {
    // Create a list with the correct answers.
    let answers = item.components.toSorted();

    // Create a list of the user's guesses.
    let userGuesses = Array.from(dynamics.guesses, (g) => g.name);
    userGuesses.sort();

    return answers.toString() == userGuesses.toString();
  }

  // Check to see if the guess slots are filled.
  let guessesFull = true;
  for (let g of dynamics.guesses) {
    if (g.optionIndex == null) {
      guessesFull = false;
      break;
    }
  }

  return (
    <>
      <div className="buttons">
        <input
          type="button"
          value={frozen ? "Next" : "Submit"}
          name="submit"
          id="submit"
          className={guessesFull ? "" : "disabled"}
          onClick={() => {
            if (frozen) {
              goNext();
            } else {
              if (guessesFull) {
                let answeredCorrectly = isCorrect();
                if (answeredCorrectly) goNext();
                else revealAnswers();
                updateScore(answeredCorrectly);
              }
            }
          }}
        />
      </div>
    </>
  );
}

export default Controls;
