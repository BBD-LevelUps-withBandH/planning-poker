import React, { useEffect, useState } from 'react';
import './RoomChoose.css';
import PropTypes from 'prop-types';
import { api } from '../backend.js';
import { useNavigate } from 'react-router-dom';
import handleSignIn from '../handleSignIn.js';

/**
 * @returns {JSX.Element} RoomChoose page
 */
export default function RoomChoose() {
  const navigateTo = useNavigate();
  const [loggingIn, setLoggingIn] = useState(false);

  const createRoom = () => fetch(`${api}rooms/create`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      roomName: ':)',
      closed: false,
    }),
  })
    .then(response => response.json())
    .then(data => navigateTo(`/room/${data.roomUuid}`));

  useEffect(() => {
    const { hash } = window.location;
    if (hash) {
      setLoggingIn(true);
      const params = new URLSearchParams(hash.slice(1));
      const accessToken = params.get('access_token');
      const idToken = params.get('id_token');
      const redirectPath = params.get('state');

      if (accessToken && idToken) {
        sessionStorage.setItem('access_token', accessToken);
        sessionStorage.setItem('id_token', idToken);

        window.location.hash = '';

        if (redirectPath === 'create') createRoom();
        else navigateTo(`/${redirectPath}`, { replace: true });
      }
    }
  }, []);

  if (loggingIn) return <h2>Logging you in...</h2>

  return (
    <main className='room-choose v-container'>
      <form
        className='v-container'
        onSubmit={
          event => {
            event.preventDefault();
            if (sessionStorage.getItem('access_token')) createRoom();
            else handleSignIn('create');
          }
        }
      >
        <h2>Create a room</h2>
        <button type='submit'>Create</button>
      </form>
      <form
        className='v-container'
        onSubmit={
          event => {
            event.preventDefault();
            const form = new FormData(event.target);
            if (sessionStorage.getItem('access_token')) { navigateTo(`room/${form.get('code')}`); } else { handleSignIn(`room/${form.get('code')}`); }
          }
        }
      >
        <h2>Join a room</h2>
        <label className='container-v'>
          <p>Room Code:</p>
          <input
            type='text'
            name='code'
            required
          />
        </label>
        <button type='submit'>Join</button>
      </form>
    </main>
  );
}

RoomChoose.propTypes = { setUser: PropTypes.func };
