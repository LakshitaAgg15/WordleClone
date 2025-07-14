import React, { useContext } from "react";
import { AppContext } from "../App";

function GameOver() {
  const {
    board,
    setBoard,
    currAttempt,
    gameOver,
    onSelectLetter,
    correctWord,
    onDelete,
    resetGame,
  } = useContext(AppContext);

  return (
    <div className="gameOver">
      <h3>
        <p style={{ color: gameOver.guessedWord ? "green" : "red" }}>
          {gameOver.guessedWord
            ? "You Correctly Guessed the Word!"
            : "You Failed to Guess the Word"}
        </p>
      </h3>
      <h1>Correct Word: {correctWord.toUpperCase()}</h1>
      {gameOver.guessedWord && (
        <h3>You guessed in {currAttempt.attempt} attempts</h3>
      )}
      <button className="play-again" onClick={resetGame}>
        🔁 Play Again
      </button>
    </div>
  );
}

export default GameOver;
