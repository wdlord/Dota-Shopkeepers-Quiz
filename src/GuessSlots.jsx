import "./GuessSlots.css";
import { useContext } from "react";
import { unlink } from "./dynamicsUtils";
import { ConstantsContext } from "./ConstantsContext";

/* eslint-disable react/prop-types */
function Guess({ index, dynamics, setDynamics, frozen }) {
  let guess = dynamics.guesses[index];
  let itemConstants = useContext(ConstantsContext).itemConstants;

  // Gets the URL of the image to display on the guess slot.
  function getImageURL() {
    if (guess.name == "recipe") {
      return "/src/assets/recipe.png";
    } else if (guess.optionIndex != null) {
      return "https://cdn.dota2.com/" + itemConstants[guess.name].img;
    } else {
      return "/src/assets/question-mark.png";
    }
  }

  return (
    <div className="item-container">
      <img
        draggable="false"
        src={getImageURL()}
        onClick={() => {
          if (!frozen) {
            if (guess.optionIndex != null) {
              unlink(index, guess.optionIndex, dynamics, setDynamics);
            }
          }
        }}
      />
    </div>
  );
}

function GuessSlots({ dynamics, setDynamics, frozen }) {
  let gMap = Array.from(dynamics.guesses, (g, i) => i);

  return (
    <div className="guesses">
      {gMap.map((index) => {
        return (
          <Guess
            key={index}
            index={index}
            dynamics={dynamics}
            setDynamics={setDynamics}
            frozen={frozen}
          />
        );
      })}
    </div>
  );
}

export default GuessSlots;
