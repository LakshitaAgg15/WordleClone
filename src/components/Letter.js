import React, { useContext, useEffect } from "react";
import { AppContext } from "../App";

function Letter({ LetterPos, attemptVal }) {
  const {
    board,
    correctWord,
    currAttempt,
    setDisabledLetters,
    setAlmostLetters,
    setCorrectLetters,
  } = useContext(AppContext);

  const letter = board?.[attemptVal]?.[LetterPos] || "";
  const correct = correctWord.toUpperCase()[LetterPos] === letter;
  const almost =
    !correct && letter !== "" && correctWord.toUpperCase().includes(letter);
  const letterState =
    currAttempt.attempt > attemptVal &&
    (correct ? "correct" : almost ? "almost" : "error");

  useEffect(() => {
    if (letter !== "" && currAttempt.attempt > attemptVal) {
      if (correct) {
        setCorrectLetters((prev) => [...new Set([...prev, letter])]);
      } else if (almost) {
        setAlmostLetters((prev) => [...new Set([...prev, letter])]);
      } else {
        setDisabledLetters((prev) => [...new Set([...prev, letter])]);
      }
    }
  }, [currAttempt.attempt]);

  return (
    <div
      className={`letter ${
        letterState ? "flip" : ""
      } style={{ animationDelay: ${LetterPos * 0.2}s }}`}
      id={letterState}
    >
      {letter}
    </div>
  );
}

export default Letter;
