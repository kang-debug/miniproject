import React, { useState } from 'react';
import styles from './Game3.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserCoin } from '../../redux/userSlice';
import axios from 'axios';

export default () => {
    const [guess, setGuess] = useState('');
    const [message, setMessage] = useState('');
    const [targetNumber, setTargetNumber] = useState(Math.floor(Math.random() * 100) + 1);
    const [game, setGame] = useState(false);
    const [count, setCount] = useState('7');

    const userData = useSelector((state) => state.user.userData);
    const dispatch = useDispatch();

    const handleGuessChange = (e) => {
        setGuess(e.target.value);
    };

    const handleGuessSubmit = () => {
        const userGuess = parseInt(guess, 10);
        setCount(count - 1);
        if (count <= 1) {
            alert("횟수를 모두 소모하셨습니다");
            setGame(false);
            handleRestart();
        }
        if (isNaN(userGuess)) {
            setMessage('빈 칸 안에 숫자를 입력해주세요.');
        } else if (userGuess < targetNumber) {
            console.log("정답은 ", targetNumber);
            setMessage('너무 낮습니다! 다시 시도해보세요.');
        } else if (userGuess > targetNumber) {
            setMessage('너무 높습니다! 다시 시도해보세요.');
        } else {
            dispatch(updateUserCoin(2));
            axios.post('http://localhost:3001/update-coin', {
                username: userData.username,
                coin: userData.coin + 2,
            });
            alert('축하합니다! 2코인을 환급해드리겠습니다.');
            setGame(false);
            handleRestart();
        }
    };

    const handleRestart = () => {
        setTargetNumber(Math.floor(Math.random() * 100) + 1);
        setCount(7);
        setGuess('');
        setMessage('');
    };
    const startBtn = () => {
        dispatch(updateUserCoin(-1));
        axios.post('http://localhost:3001/update-coin', {
            username: userData.username,
            coin: userData.coin - 1,
        });
        setGame(true);
        console.log(targetNumber);
    }
    return (
        <div className={styles.container}>
            <h1>숫자 맞추기 게임!</h1>
            <h1>범위 : 1~100</h1>
            {!game && (
                <button onClick={startBtn} className={styles.button}>
                    코인 투입(1코인)
                </button>
            )}
            {game && (
                <div className={styles.game}>
                    <h2>남은 횟수 : {count}</h2>
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
                    {message && <div className={styles.message}>{message}</div>}
                </div>
            )}
            <div className='userInfo'>
                <table>
                    <thead>
                        <tr>
                            <th>이름</th>
                            <th>보유 코인</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{userData.username}</td>
                            <td>{userData.coin}</td> 
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}