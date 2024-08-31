import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Login from './components/Login/Login';
import Head from './fix/Head';
import Menu from './fix/Menu';
import Main from './components/Main/Main';
import Game1 from './components/Game/Game1';
import Game2 from './components/Game/Game2';
import Game3 from './components/Game/Game3';
import Game4 from './components/Game/Game4';
import Game5 from './components/Game/Game5';
import Ranking from './components/Ranking/Ranking';
import { logout } from './redux/userSlice';

function App() {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Router>
      <div className="App">
        <Head />
        {isLoggedIn && <Menu handleLogout={handleLogout} />}
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to="/main" />
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/main"
            element={
              isLoggedIn ? (
                <Main />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/ranking"
            element={
              isLoggedIn ? (
                <Ranking />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/1"
            element={
              isLoggedIn ? (
                <Game1 />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/2"
            element={
              isLoggedIn ? (
                <Game2 />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/3"
            element={
              isLoggedIn ? (
                <Game3 />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/4"
            element={
              isLoggedIn ? (
                <Game4 />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/5"
            element={
              isLoggedIn ? (
                <Game5 />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="*"
            element={<Navigate to={isLoggedIn ? "/main" : "/"} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
