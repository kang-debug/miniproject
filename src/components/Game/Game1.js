import React, { useState, useEffect } from 'react';
import Mole from './Mole';
import moleImg from './mole.png'
import './Game1.css';

export default ({userData}) =>{
    const [moles, setMoles] = useState(Array.from({ length: 5 * 5 }, () => false));
    const [isGameRunning, setIsGameRunning] = useState(false);
    //두더지 클릭시 점수
    const [score, setScore] = useState(0)
    const moleClickScore = () => {
        setScore(score+1)
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
            setTime((prevTime)=>{
                if(prevTime === 1){
                    alert(` 점수는 ${score} 입니다.`)
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
    };
    const stopGame = () => {
        setIsGameRunning(false);
    };
    const endGame = () => {
        setIsGameRunning(false);
        setMoles(Array.from({ length: 5 * 5 }, () => false))
        setScore(0)
        setTime(30)
    }

    return(
        <div className='wrap'>
        <div className='moleTit'>
            <h1>
                추억의<img src={moleImg} alt='logo'/><br/>
                두더지 게임
            </h1>
            <div className='startEnd'>
                <button onClick={startGame} type='button' disabled={isGameRunning}>
                Start
                </button>
                <button onClick={stopGame} type='button' disabled={!isGameRunning}>
                Stop
                </button>
                <button onClick={endGame} type='button'>
                End
                </button>
            </div>
            <div className='moleScoreTime'>
                <button type='button'>Score : {score}</button>
                <button type='button'>Timer : {time}</button>
            </div>
        </div>
        <div className='moleList'>
            <ol>
                {moles.map((show, index) => (
                <li key={index} onClick={()=> show && moleClickScore()}>
                    <Mole show={show} />
                </li>
                ))}
            </ol>
        </div>
    </div>
    )
}