// hooks
import { useState, useRef } from 'react';

// css
import './Game.css'

const Game = ({
    verifyLetter, 
    pickedWord, 
    pickedCategory, 
    letters,
    wrongLetters, 
    guessedLetters, 
    guesses, 
    score,
    }) => {

        const [letter, setLetter] = useState('');
        const letterInputRef = useRef(null);

        const handleSubmit = (e) => {
            e.preventDefault();

            verifyLetter(letter);

            setLetter('');

            letterInputRef.current.focus();
        };
  return (
    <div className='game'>
        <p className='points'>
            Pontuação: {score}
        </p>
        <h1>Adivinhe a palavra: </h1>
        <h3 className='tip'>
            Dica sobre a palavra: <span>{pickedCategory}</span>
        </h3>
        <p>Você ainda tem {guesses} tentativa(s).</p>
        <div className='wordContainer'>
            {letters.map((letter, i) => 
                guessedLetters.includes(letter) ? (
                    <span key={i} className='letter'>{letter}</span>

                ) : (
                    <span key={i} className='blankSquare'></span>
                )
            )}
        </div>
        <div className='letterContainer'>
            <p>Tente adivinhar a letra:</p>
            <form onSubmit={handleSubmit}>
                <input type='text' 
                name='letter' 
                maxLength='1' 
                required onChange={(e) => setLetter(e.target.value)}
                value={letter}
                ref={letterInputRef}
                />
                <button>Jogar</button>
            </form>
        </div>
        <div className='wrongLetterContainer'>
            <p>Letras já utilizadas: </p>
            {wrongLetters.map((letter, i) => (
                <span key={i}>{letter}, </span>
            ))}
        </div>
    </div>
  )
}

export default Game