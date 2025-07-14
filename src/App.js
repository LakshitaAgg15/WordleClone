import "./App.css";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";
import { createContext, useEffect, useState } from "react";
import { boardDefault, generateWordSet } from "./components/Words";
import GameOver from "./components/GameOver";
export const AppContext = createContext();

function App() {
  const [board, setBoard] = useState(boardDefault());
  const [currAttempt, setCurrAttempt] = useState({ attempt: 0, letterPos: 0 });
  const [wordSet, setWordSet] = useState(new Set());
  const [correctWord, setCorrectWord] = useState("");
  const [error, setError] = useState("");
  const [disabledLetters, setDisabledLetters] = useState([]);
  const [correctLetters, setCorrectLetters] = useState([]);
  const [almostLetters, setAlmostLetters] = useState([]);
  const [gameOver, setGameOver] = useState({
    gameOver: false,
    guessedWord: false,
  });

  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    generateWordSet().then((words) => {
      setWordSet(words.wordSet);
      setCorrectWord(words.todaysWord);
    });
  }, []);

  const resetGame = () => {
    setBoard(boardDefault());
    setCurrAttempt({ attempt: 0, letterPos: 0 });
    setDisabledLetters([]);
    setCorrectLetters([]);
    setAlmostLetters([]);
    setGameOver({ gameOver: false, guessedWord: false }); // ✅ ALLOWED HERE

    generateWordSet().then((words) => {
      setWordSet(words.wordSet);
      setCorrectWord(words.todaysWord);
    });
  };

  const onSelectLetter = (key) => {
    if (currAttempt.letterPos > 4) return; // max 5 letters
    const newBoard = [...board];
    newBoard[currAttempt.attempt][currAttempt.letterPos] = key;
    setBoard(newBoard);
    setCurrAttempt({
      ...currAttempt,
      letterPos: currAttempt.letterPos + 1,
      if(gameOver) {
        return;
      },
    });
  };
  const onDelete = () => {
    if (currAttempt.letterPos === 0) return;
    const newBoard = [...board];
    newBoard[currAttempt.attempt][currAttempt.letterPos - 1] = "";
    setBoard(newBoard);
    setCurrAttempt({ ...currAttempt, letterPos: currAttempt.letterPos - 1 });
  };

  const onEnter = () => {
    if (currAttempt.letterPos !== 5) return; // only enter if full word

    let currWord = "";
    for (let i = 0; i < 5; i++) {
      // currWord += board[currAttempt.attempt][i];
      currWord += board[currAttempt.attempt][i].toLowerCase();
    }

    if (wordSet.has(currWord.toLowerCase())) {
      setCurrAttempt({ attempt: currAttempt.attempt + 1, letterPos: 0 });
    } else {
      setError("Word Not Found");
      setTimeout(() => setError(""), 3000);
    }

    if (currWord === correctWord) {
      setGameOver({ gameOver: true, guessedWord: true });
      return;
    }
    console.log(currAttempt);
    if (currAttempt.attempt === 5) {
      if (wordSet.has(currWord.toLowerCase())) {
        setCurrAttempt({ attempt: currAttempt.attempt + 1, letterPos: 0 });
        setGameOver({ gameOver: true, guessedWord: false });
      } else if (currWord === correctWord) {
        setGameOver({ gameOver: true, guessedWord: true });
        return;
      } else {
        setError("Word Not Found");
        setTimeout(() => setError(""), 3000);
      }
    }

    const checkGuess = (guess, correctWord) => {
      const guessLetters = guess.toUpperCase().split("");
      const correctLetters = correctWord.toUpperCase().split("");
      const result = Array(5).fill("error");

      // Create a mutable copy to track letter counts
      const correctWordMap = {};
      for (const letter of correctLetters) {
        correctWordMap[letter] = (correctWordMap[letter] || 0) + 1;
      }

      // Pass 1: Find Green letters
      for (let i = 0; i < 5; i++) {
        if (guessLetters[i] === correctLetters[i]) {
          result[i] = "correct";
          correctWordMap[guessLetters[i]]--;
        }
      }

      // Pass 2: Find Yellow and Gray letters
      for (let i = 0; i < 5; i++) {
        if (result[i] === "correct") continue; // Skip greens

        if (correctWordMap[guessLetters[i]] > 0) {
          result[i] = "almost";
          correctWordMap[guessLetters[i]]--;
        } else {
          result[i] = "error";
        }
      }

      return result;
    };
  };
  return (
    <div className={`App ${theme}`}>
      <nav className="navbar">
        <h1>WORDLE</h1>
        {/* <button onClick={toggleTheme} className="theme-toggle">
          {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button> */}

        <button
          className="theme-toggle"
          onClick={toggleTheme}
          onMouseDown={(e) => e.preventDefault()} // prevents focus
        >
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </nav>
      {error && <div className="error-toast">{error}</div>}
      <AppContext.Provider
        value={{
          board,
          setBoard,
          currAttempt,
          setCurrAttempt,
          onDelete,
          onEnter,
          onSelectLetter,
          correctWord,
          disabledLetters,
          setDisabledLetters,
          gameOver,
          correctLetters,
          setCorrectLetters,
          almostLetters,
          setAlmostLetters,
          resetGame,
        }}
      >
        <div className="game">
          <Board />

          {gameOver.gameOver ? <GameOver /> : <Keyboard />}
        </div>
      </AppContext.Provider>
      <footer>© 2025 Wordle Clone by Lakshita</footer>
    </div>
  );
}

export default App;
