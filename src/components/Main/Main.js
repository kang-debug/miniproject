import React, { useEffect, useState } from 'react';
import './Main.css';
import Profile from './profile';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserCoin } from '../../redux/userSlice';

function Main() {
    const userData = useSelector((state) => state.user.userData);
    const dispatch = useDispatch();

    // coinUpBtn 처럼 (updateUserCoin("여기에 증감소할 값을 넣어 주시면 됩니다"))
    const coinUpBtn = () => {
        if (userData.coin === 0) {
            dispatch(updateUserCoin(1)); 
        axios.post('http://localhost:3001/update-coin', {
          username: userData.username,
          coin: userData.coin + 1,
        });
        } else{
            alert("Coin이 0일 때 적용됩니다!");
        }
      };

    return (
        <div className='main'>
            <Profile />
            <div className='coinUp' onClick={coinUpBtn}>
                Coin Up
            </div>
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

export default Main;

