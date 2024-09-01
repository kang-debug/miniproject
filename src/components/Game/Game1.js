import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserCoin } from '../../redux/userSlice';
import axios from 'axios';
import Mole from './Mole';
import moleImg from './mole.png'
import './Game1.css';

export default () => {
    const userData = useSelector((state) => state.user.userData);
    const dispatch = useDispatch();
    const [moles, setMoles] = useState(Array.from({ length: 5 * 5 }, () => false));
    const [isGameRunning, setIsGameRunning] = useState(false);
    //두더지 클릭시 점수
    const [score, setScore] = useState(0)
    const moleClickScore = () => {
        setScore(score + 1)
    }
    //타이머 30초
    const [time, setTime] = useState(30)

    useEffect(() => {
        let moleInterval;

        if (isGameRunning) {
            // 게임시작, 랜덤 두더지 나오기
            moleInterval = setInterval(() => {

                const randomIndex = Math.floor(Math.random() * moles.length);
                const newMoles = [...moles];
                newMoles[randomIndex] = true;
                setMoles(newMoles);

                // 0.5초 후에 두더지 다시 숨김
                setTimeout(() => {
                    newMoles[randomIndex] = false;
                    setMoles(newMoles);
                }, 500);
                setTime((prevTime) => {
                    if (prevTime === 1) {
                        alert(` 점수는 ${score} 입니다. 점수만큼 코인이 증가합니다.`)
                        dispatch(updateUserCoin(+score));
                        axios.post('http://localhost:3001/update-coin', {
                            username: userData.username,
                            coin: userData.coin + score,
                        });
                        setIsGameRunning(false)
                        setScore(0)
                        return 30
                    }
                    return prevTime - 1
                })
            }, 500);
        }
        return () => {
            clearInterval(moleInterval);
        };
    }, [isGameRunning, moles, score]);

    const startGame = () => {
        setIsGameRunning(true);
        dispatch(updateUserCoin(-1)); // Decrease coin by 1
        axios.post('http://localhost:3001/update-coin', {
            username: userData.username,
            coin: userData.coin - 1,
        });
    };

    const endGame = () => {
        setIsGameRunning(false);
        setMoles(Array.from({ length: 5 * 5 }, () => false))
        setScore(0)
        setTime(30)
    }

    return (
        <div className='wrap'>
            <div className='moleTit'>
                <h1>
                    <img src={moleImg} alt='logo' /><br />
                    두더지 게임
                </h1>
                <div className='startEnd'>
                    <button onClick={startGame} type='button' disabled={isGameRunning}>
                        시작
                    </button>
                    <button onClick={endGame} type='button'>
                        End
                    </button>
                </div>
                <div className='moleScoreTime'>
                    <button type='button'>점수 : {score}</button>
                    <button type='button'>남은 시간 : {time}</button>
                    <button type='button'>남은 코인: {userData.coin}</button>
                </div>
            </div>
            <div className='moleList'>
                <ol>
                    {moles.map((show, index) => (
                        <li key={index} onClick={() => show && moleClickScore()}>
                            <Mole show={show} />
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    )
}