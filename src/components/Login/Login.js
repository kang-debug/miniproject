import './Login.css';
import { useState } from "react";
import axios from 'axios';
import Svg1 from './svg1';
import Svg2 from './svg2';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/userSlice';

export default ({}) => {
    const dispatch = useDispatch();
    const [isSignUp, setIsSignUp] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const changeSignIn = () => {
        setPasswordVisible(false);
        setIsSignUp(false);
        setUsername('');
        setPassword('');
        setRepeatPassword('');
    };

    const changeSignUp = () => {
        setPasswordVisible(false);
        setIsSignUp(true);
        setUsername('');
        setPassword('');
        setRepeatPassword('');
    };

    const activeEnterSignIn = (e) => {
        if ((isSignUp == false) && e.key === "Enter") {
            handleLogin();
        }
    };

    const activeEnterSignUp = (e) => {
        if ((isSignUp == true) && e.key === "Enter") {
            handleRegister();
        }
    };

    const handleRegister = () => {
        if (isSignUp && password !== repeatPassword) {
            alert("Password and repeat password do not match");
            return;
        }
        axios.post('http://localhost:3001/register', {
            username: username,
            password: password
        }).then(response => {
            alert(response.data);
            changeSignIn();
        }).catch(error => {
            if (error.response && error.response.status === 400) {
                alert('이미 사용 중인 이름입니다');
                setUsername('');
                setPassword('');
                setRepeatPassword('');
            } else if (error.response && error.response.status === 401) {
                alert('비밀번호를 4이상으로 설정해주세요');
                setPassword('');
                setRepeatPassword('');
            }
            else {
                console.error('There was an error!', error);
            }
        });
    };

    const handleLogin = () => {
        axios.post('http://localhost:3001/login', {
          username: username,
          password: password
        }).then(response => {
          if (response.data.message === 'Login successful') {
            dispatch(login(response.data.userData));
            navigate('/main');
          } else {
            alert('Invalid username or password');
            setUsername(''); 
            setPassword('');
          }
        }).catch(error => {
          console.error('There was an error!', error);
          alert('Invalid username or password');
          setUsername(''); 
          setPassword('');
        });
      };
    
    

    return (
        <div className="login">
            <h1>{isSignUp ? "SIGN UP" : "SIGN IN"}</h1>
            <ul className="links">
                <li>
                    <a href="#" id="signin" onClick={changeSignIn}>SIGN IN</a>
                </li>
                <li>
                    <a href="#" id="signup" onClick={changeSignUp}>SIGN UP</a>
                </li>
            </ul>
            <form>
                <div className="first-input input__block first-input__block">
                    <input
                        type="text"
                        placeholder="Name"
                        className="input"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="input__block" style={{ position: 'relative' }}>
                    <input
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Password"
                        className="input"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => activeEnterSignIn(e)}
                    />
                    <span
                        onClick={togglePasswordVisibility}
                        style={{ position: 'absolute', right: 50, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                    >
                        {passwordVisible ? (
                            <Svg1 />
                        ) : (
                            <Svg2 />)}
                    </span>
                </div>

                {isSignUp && (
                    <div className="input__block">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Repeat password"
                            className="input repeat__password"
                            id="repeat__password"
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                            onKeyDown={(e) => activeEnterSignUp(e)}
                        />
                        <span
                            onClick={togglePasswordVisibility}
                            style={{ position: 'absolute', right: 50, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                        >
                            {passwordVisible ? (
                                <Svg1 />
                            ) : (
                                <Svg2 />)}
                        </span>
                    </div>
                )}

                <button type="button" className="signin__btn" onClick={isSignUp ? handleRegister : handleLogin}>
                    {isSignUp ? "Sign up" : "Sign in"}
                </button>
            </form>
        </div>
    );
}
