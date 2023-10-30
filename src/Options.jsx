import "./Options.css";
import { useContext } from "react";
import { link, unlink, nextGuessIndex } from "./dynamicsUtils";
import { ConstantsContext } from "./ConstantsContext";

/* eslint-disable react/prop-types */
function Option({ index, dynamics, setDynamics, frozen }) {
  // This represents the object this component renders.
  let option = dynamics.options[index];
  let itemConstants = useContext(ConstantsContext).itemConstants;

  // Gets the URL of the image to display on the option.
  function getImageURL() {
    if (option.name == "recipe") {
      return "/src/assets/recipe.png";
    } else {
      return "https://cdn.dota2.com/" + itemConstants[option.name].img;
    }
  }

  return (
    <>
      <img
        draggable="false"
        className={option.guessIndex != null ? "grayscale" : ""}
        src={getImageURL()}
        title={option.dname}
        onClick={() => {
          if (!frozen) {
            if (option.guessIndex == null) {
              link(
                nextGuessIndex(dynamics.guesses),
                index,
                dynamics,
                setDynamics
              );
            } else {
              unlink(option.guessIndex, index, dynamics, setDynamics);
            }
          }
        }}
      />
    </>
  );
}

export function OptionGroup({ dynamics, setDynamics, frozen }) {
  let oMap = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <div className="options-grid">
      {oMap.map((index) => {
        return (
          <Option
            key={index}
            index={index}
            dynamics={dynamics}
            setDynamics={setDynamics}
            frozen={frozen}
          ></Option>
        );
      })}
    </div>
  );
}
