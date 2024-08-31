import { useSelector, useDispatch } from 'react-redux';
import { updateUserCoin } from '../../redux/userSlice';
import axios from 'axios';

function Game2() {
  const userData = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();

  const handleCoinDecrease = () => {
    dispatch(updateUserCoin(-1)); // Decrease coin by 1
    axios.post('http://localhost:3001/update-coin', {
      username: userData.username,
      coin: userData.coin - 1,
    });
  };

  return (
    <div>
      <button onClick={handleCoinDecrease}>Decrease Coin</button>
    </div>
  );
}

export default Game2;