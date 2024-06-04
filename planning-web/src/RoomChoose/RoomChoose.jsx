import React from 'react';
import './RoomChoose.css';
import PropTypes from 'prop-types';

/**
 * @returns {JSX.Element} RoomChoose page
 */
export default function RoomChoose() {
  const handleSignIn = (redirectPath) => {
    const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;
    const redirectUri = import.meta.env.VITE_REDIRECT_URI;
    const clientId = import.meta.env.VITE_CLIENT_ID;
    window.location.href = `${cognitoDomain}/oauth2/authorize?identity_provider=Google&redirect_uri=${redirectUri}&response_type=token&client_id=${clientId}&scope=email openid phone&state=${redirectPath}`;
  };

  return (
    <main className='room-choose v-container'>
      <form
        className='v-container'
        onSubmit={
          event => {
            event.preventDefault();
            fetch(`${api}rooms/create`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ownerId: 1, // TODO link to cofnito
                roomName: ':)',
                closed: false,
              }),
            })
              .then(response => response.json())
              .then(data => handleSignIn(`room/${data.roomUuid}`));
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
            handleSignIn(`room/${form.get('code')}`);
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
