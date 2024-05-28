import React from 'react';
import './Room.css';
import { useParams } from 'react-router-dom';

/**
 * @returns {JSX.Element} Room page
 */
export default function Room() {
  const { id } = useParams();
  return (
    <main className='room'>
      {id}
    </main>
  );
}
