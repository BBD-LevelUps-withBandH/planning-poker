import React from 'react';
import './RoomChoose.css';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { api } from '../backend.js';

/**
 * @returns {JSX.Element} RoomChoose page
 */
export default function RoomChoose() {
  const navigateTo = useNavigate();
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
              .then(data => navigateTo(`room/${data.roomUuid}`));
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
            navigateTo(`room/${form.get('code')}`);
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
