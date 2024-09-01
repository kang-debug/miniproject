import React, { useState } from 'react';
import styles from './Game3.module.css';

export default ({userData}) =>{
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [targetNumber, setTargetNumber] = useState(Math.floor(Math.random() * 100) + 1);

  const handleGuessChange = (e) => {
    setGuess(e.target.value);
  };

  const handleGuessSubmit = () => {
    const userGuess = parseInt(guess, 10);
    if (isNaN(userGuess)) {
      setMessage('빈 칸 안에 숫자를 입력해주세요.');
    } else if (userGuess < targetNumber) {
        console.log("정답은 ",targetNumber);
      setMessage('너무 낮습니다! 다시 시도해보세요.');
    } else if (userGuess > targetNumber) {
      setMessage('너무 높습니다! 다시 시도해보세요.');
    } else {
      setMessage('축하합니다! 당신은 숫자를 맞췄습니다.'); 
    }
  };

  const handleRestart = () => {
    setTargetNumber(Math.floor(Math.random() * 100) + 1);
    setGuess('');
    setMessage('');
  };

  return (
    <div className={styles.container}>
      <h1>숫자 맞추기 게임!</h1>
      <input
        type="number"
        value={guess}
        onChange={handleGuessChange}
        className={styles.input}
        placeholder="숫자를 입력해주세요"
      />
      <button onClick={handleGuessSubmit} className={styles.button}>
        맞추기
      </button>
      <p>
      <button onClick={handleRestart} className={styles.button}>
        다시 시작
      </button>
      </p>
      {message && <div className={styles.message}>{message}</div>}
    </div>
  );
}