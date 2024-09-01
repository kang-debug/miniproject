import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserCoin } from '../../redux/userSlice';
import axios from 'axios';
import './Game2.css';

export default () => {
    const [isJumping, setIsJumping] = useState(false);
    const [position, setPosition] = useState(0);
    const [obstaclePosition, setObstaclePosition] = useState(100);  // 장애물의 초기 위치를 오른쪽 끝으로 설정
    const [isGameOver, setIsGameOver] = useState(false);
    const [speed, setSpeed] = useState(2);  // 초기 속도
    const [score, setScore] = useState(0);  // 게임 점수 (시간에 비례)
    const [isGameStarted, setIsGameStarted] = useState(false);  // 게임 시작 여부
    const userData = useSelector((state) => state.user.userData);
    const dispatch = useDispatch();
    useEffect(() => {
        if (isJumping) {
            let jumpTimer = setTimeout(() => {
                setIsJumping(false);
            }, 300);
            return () => clearTimeout(jumpTimer);
        }
    }, [isJumping]);

    useEffect(() => {
        if (isGameStarted && !isGameOver) {
            let obstacleTimer = setInterval(() => {
                if (obstaclePosition > -10) {  // 장애물이 화면을 벗어날 때까지 이동
                    setObstaclePosition(prevPosition => prevPosition - speed);  // 장애물이 왼쪽으로 이동
                } else {
                    setObstaclePosition(100);  // 장애물이 화면을 벗어나면 오른쪽 끝으로 재설정
                    setScore(prevScore => prevScore + 1);  // 점수 증가
                }
            }, 30);

            // 충돌 감지: 장애물과 공룡의 위치가 겹칠 때 게임 오버
            if (obstaclePosition < 10 && obstaclePosition > 0 && position < 50) {
                dispatch(updateUserCoin(+Math.floor(score / 5)));
                axios.post('http://localhost:3001/update-coin', {
                    username: userData.username,
                    coin: userData.coin + Math.floor(score / 5),
                });
                clearInterval(obstacleTimer);
                setIsGameOver(true);
            }

            return () => clearInterval(obstacleTimer);
        }
    }, [obstaclePosition, speed, isGameStarted, isGameOver]);

    useEffect(() => {
        if (isGameStarted && !isGameOver) {
            let speedIncreaseTimer = setInterval(() => {
                setSpeed(prevSpeed => prevSpeed + 0.2);  // 0.2씩 속도 증가
            }, 2000);  // 매 2초마다 속도 증가

            return () => clearInterval(speedIncreaseTimer);
        }
    }, [isGameStarted, isGameOver]);

    const handleJump = () => {
        if (!isJumping && !isGameOver && isGameStarted) {
            setIsJumping(true);
            setPosition(50);
            setTimeout(() => setPosition(0), 300);
        }
    };

    const handleStart = () => {
        if (!isGameStarted && !isGameOver) {
            setIsGameStarted(true);
            dispatch(updateUserCoin(-1));
            axios.post('http://localhost:3001/update-coin', {
                username: userData.username,
                coin: userData.coin - 1,
            });
        }
    };

    const handleRestart = () => {
        dispatch(updateUserCoin(-1));
        axios.post('http://localhost:3001/update-coin', {
            username: userData.username,
            coin: userData.coin - 1,
        });
        setIsJumping(false);
        setPosition(0);
        setObstaclePosition(100);
        setSpeed(2);
        setScore(0);
        setIsGameOver(false);
        setIsGameStarted(true);
    };

    return (
        <div className="game-container" onClick={handleJump}>
            <span className="info-text">좌클릭 = 점프, 보유코인: {userData.coin}</span>
            <div className={`dino ${isJumping ? 'jump' : ''}`} style={{ bottom: position + 'px' }} />
            <div className="ground" />
            <div className="obstacle" style={{ left: `${obstaclePosition}%` }} />
            {isGameOver && (
                <div className="game-over">
                    <div>Game Over</div>
                    <div>획득코인: {Math.floor(score / 5)}</div>
                    <button className="restart-button" onClick={handleRestart}>Restart</button>
                </div>
            )}
            {!isGameStarted && !isGameOver && (
                <button className="start-button" onClick={handleStart}>Start Game</button>
            )}
            <div className="score">Score: {score}</div>
        </div>

    )
}