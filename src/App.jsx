import "./App.css";
import { useContext, useEffect, useState } from "react";
import GuessSlots from "./GuessSlots";
import { OptionGroup } from "./Options";
import Controls from "./Controls";
import { nextItem } from "./ItemUtils";
import { generateDynamics } from "./dynamicsUtils";
import { ConstantsContext } from "./ConstantsContext";

function App() {
  const [item, setItem] = useState(null);
  const [frozen, setFrozen] = useState(false);
  const [dynamics, setDynamics] = useState(null); // This is the complex structure representing the guesses and options.
  const [score, setScore] = useState({
    correct: 0,
    total: 0,
    streak: 0,
    wasCorrect: null,
  });

  let context = useContext(ConstantsContext);

  // Set the first item on mount.
  useEffect(() => {
    setItem(nextItem(context.itemPool, context.itemConstants, null));
  }, []);

  // Updates the options and guesses every time the item changes.
  useEffect(() => {
    if (item != null) {
      setDynamics(generateDynamics(item, context));
    }
  }, [item]);

  function writeFeedback() {
    if (score.wasCorrect == null) return "";
    if (score.wasCorrect) return "Correct!";
    return "Wrong";
  }

  if (item != null && dynamics != null) {
    return (
      <ConstantsContext.Provider value={context}>
        <div className={"feedback " + (score.wasCorrect ? "correct" : "wrong")}>
          {writeFeedback()}
        </div>
        <div className="score">
          <p>
            <span>Score:</span> {score.correct} / {score.total}
          </p>
          <p>
            <span>Streak:</span> {score.streak}{" "}
          </p>
        </div>
        <h2 id="item-name">{item.dname}</h2>
        <img id="item" src={"https://cdn.dota2.com/" + item.img} />
        <GuessSlots
          dynamics={dynamics}
          setDynamics={setDynamics}
          frozen={frozen}
        />
        <hr />
        <OptionGroup
          dynamics={dynamics}
          setDynamics={setDynamics}
          frozen={frozen}
        />
        <Controls
          item={item}
          setItem={setItem}
          dynamics={dynamics}
          setDynamics={setDynamics}
          frozen={frozen}
          setFrozen={setFrozen}
          score={score}
          setScore={setScore}
        />
      </ConstantsContext.Provider>
    );
  } else {
    return <></>;
  }
}

export default App;
