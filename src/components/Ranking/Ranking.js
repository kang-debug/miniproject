import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Ranking.css';

export default function Ranking() {
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await axios.get('http://localhost:3001/ranking');
        setRankings(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Failed to fetch rankings:', error);
      }
    };

    fetchRankings();
  }, []);

  return (
    <div className='ranking'>
      <h1>Ranking</h1>
      <table>
        <thead>
          <tr>
            <th>순위</th>
            <th>유저명</th>
            <th>코인수</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((user, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{user.username}</td>
              <td>{user.coin}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
