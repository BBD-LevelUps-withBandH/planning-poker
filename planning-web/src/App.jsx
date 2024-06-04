import React, {useEffect, useState} from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './NavBar/NavBar.jsx';
import RoomChoose from './RoomChoose/RoomChoose.jsx';
import Room from './Room/Room.jsx';
import {api} from "./backend.js";

/**
 * @returns {JSX.Element} Main App component
 */
export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (sessionStorage.getItem('id_token') && !user) {
      fetch(`${api}users/create`, { method: 'POST', headers: {
          Authorization: `Bearer ${sessionStorage.getItem('id_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({upn: `user1@example.com`})}) // TODO remove once BE gets upn from token
        .then(response => response.json())
        .then(setUser);
    }
  }, []);
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route
          path='/'
          element={ <RoomChoose setUser={setUser} user={user} /> }
        />
        <Route
          path='/room/:id'
          element={ <Room user={user} /> }
        />
      </Routes>
    </BrowserRouter>
  );
}
