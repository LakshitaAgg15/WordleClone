import { React, useContext } from "react";
import { AppContext } from "../App";

// import Keyboard from "./Keyboard";

const Key = ({ keyVal, bigKey, disabled }) => {
  const {
    onDelete,
    onSelectLetter,
    onEnter,
    correctLetters,
    almostLetters,
    disabledLetters,
  } = useContext(AppContext);

  let keyStatus = "";
  if (correctLetters.includes(keyVal)) keyStatus = "correct";
  else if (almostLetters.includes(keyVal)) keyStatus = "almost";
  else if (disabledLetters.includes(keyVal)) keyStatus = "disabled";

  const selectLetter = () => {
    if (keyVal === "ENTER") {
      onEnter();
    } else if (keyVal === "DELETE") {
      onDelete();
    } else {
      onSelectLetter(keyVal);
    }
  };

  return (
    <div
      className={`key ${keyStatus} ${bigKey ? "big" : ""}`}
      onClick={selectLetter}
    >
      {keyVal}
    </div>
  );
};

export default Key;
