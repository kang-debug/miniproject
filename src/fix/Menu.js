import './Menu.css';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logout } from '../redux/userSlice';

export default function Menu() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutAndRedirect = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div>
      <ul className="nav nav-pills nav-fill">
        <li className='nav-item'>
          <Link to="/1" className="nav-link">1</Link>
        </li>
        <li className='nav-item'>
          <Link to="/2" className="nav-link">2</Link>
        </li>
        <li className='nav-item'>
          <Link to="/3" className="nav-link">3</Link>
        </li>
        <li className='nav-item'>
          <Link to="/4" className="nav-link">4</Link>
        </li>
        <li className='nav-item'>
          <Link to="/5" className="nav-link">5</Link>
        </li>
        <li className='nav-item'>
          <Link to="/main" className="nav-link">My Page</Link>
        </li>
        <li className='nav-item'>
          <Link to="/ranking" className="nav-link">Ranking</Link>
        </li>
        <li className='nav-item logout-btn' onClick={logoutAndRedirect}>
          Log out
        </li>
      </ul>
    </div>
  );
}
