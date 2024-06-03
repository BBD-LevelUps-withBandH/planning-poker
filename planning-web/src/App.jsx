import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './NavBar/NavBar.jsx';
import RoomChoose from './RoomChoose/RoomChoose.jsx';
import Room from './Room/Room.jsx';
import AuthHandler from './AuthHandler.jsx';

/**
 * @returns {JSX.Element} Main App component
 */
export default function App() {
  const [user, setUser] = useState({ name: 'Liam' });
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route
          path='/'
          element={ <RoomChoose setUser={ setUser } /> }
        />
        <Route
          path='/room/:id'
          element={ <Room currentUser={ user } /> }
        />
        <Route
          path='/auth'
          element={<AuthHandler />}  // Add AuthHandler route
        />
      </Routes>
    </BrowserRouter>
  );
}
