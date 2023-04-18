// CSS
import './App.css';

// React
import { useCallback, useEffect, useState} from 'react'

// data
import { wordList } from './data/words'

// Components
import StartScrenn from './components/StartScrenn';
import Game from './components/Game';
import GameOver from './components/GameOver';


const stages = [
  {id: 1, name:"start"},
  {id: 2, name:"game"},
  {id: 3, name:"end"},
]

const guessesQnt = 3;

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordList);

  const [pickedWord, setPickedWord] = useState('');
  const [pickedCategory, setPickedCategory] = useState('');
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQnt);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    // escolher categoria aleatória
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];

    // escolher palavra aleatória
    const word = words[category][Math.floor(Math.random() * words[category].length)];

    return {word, category};
  }, [words]);

  // start do palavra secreta
  const startGame = useCallback(() => {
    // limpa todas as letras
    clearLetterStates();
    // Escolher palavra e categoria
    const {word, category} = pickWordAndCategory();

    // trsnsformando o array em letras
    let wordLetters = word.split('');

    wordLetters = wordLetters.map((l) => l.toLowerCase());

    // settar os estados
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);
  // processar a letra do input
  const verifyLetter = (letter) => {
    
    const normalizedLetter = letter.toLowerCase();

    // checar se a letra já foi utilizada
    if(guessedLetters.includes(normalizedLetter) ||
     wrongLetters.includes(normalizedLetter)
     ) {
      return;
     }

     // puxar as letras acertadas ou remover as chances
     if(letters.includes(normalizedLetter)) {
        setGuessedLetters((actualGuessLeters) => [
          ...actualGuessLeters,
          normalizedLetter
        ])
     }else {
      setWrongLetters((actualWrongLeters) => [
        ...actualWrongLeters,
        normalizedLetter
      ]);

      setGuesses((actualGuesses) => (actualGuesses - 1));
     }
  }

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };
    // checar se as tentativas acabaram
    useEffect(() => {
          if (guesses <= 0) {
            // resetar todos os estágios

            clearLetterStates();
            setGameStage(stages[2].name);
          }
      }, [guesses]);

      // checar as condições de vitória
      useEffect(() => {

        const uniqueLetters = [...new Set(letters)];

        // condição de vitória
        if(guessedLetters.length === uniqueLetters.length) {
          // adiciona pontos
          setScore((actualScore) => (actualScore += 100));
          // resetar o game com uma nova palavra
          startGame();
        }

      }, [guessedLetters, letters, startGame]);
  
  // restart do jogo
  const retry = () => {

    setScore(0);
    setGuesses(3);
    setGameStage(stages[0].name);
  }

  return (
    <div className="App">
      {gameStage === 'start' && <StartScrenn startGame={startGame}/>}
      {gameStage === 'game' && <Game 
      verifyLetter={verifyLetter}
      pickedWord={pickedWord}
      pickedCategory={pickedCategory}
      letters={letters}
      guessedLetters={guessedLetters}
      wrongLetters={wrongLetters}
      guesses={guesses}
      score={score}
      />}
      {gameStage === 'end' && <GameOver retry={retry} score={score}/>}
    </div>
  );
}

export default App;
