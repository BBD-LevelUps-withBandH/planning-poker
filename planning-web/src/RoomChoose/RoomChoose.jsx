import React, { Dispatch, SetStateAction } from 'react';
import './RoomChoose.css';
import { useNavigate } from 'react-router-dom';
import { createUUID } from '../chatgpt/uuid.js';
import PropTypes from 'prop-types';

/**
 * @param {object} props - React Props
 * @param {Dispatch<SetStateAction<object>>} props.setUser - set State for user
 * @returns {JSX.Element} RoomChoose page
 */
export default function RoomChoose({ setUser }) {
  const navigateTo = useNavigate();
  return (
    <main className='room-choose v-container'>
      <form
        className='v-container'
        onSubmit={
          () => {
            setUser(prevState => ({
              ...prevState,
              superMan: true,
            }));
            navigateTo(`room/${createUUID()}`);
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
