import React, { useEffect, useState } from 'react';
import './Room.css';
import { useParams } from 'react-router-dom';
import UserChoice from '../UserChoice/UserChoice.jsx';
import Agenda from '../Agenda/Agenda.jsx';

/**
 * @returns {JSX.Element} Room page
 */
export default function Room() {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);
  const [hidden, setHidden] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const interval = setInterval(() => setUsers(prevState => [
      ...prevState,
      {
        name: 'Dummy',
        choice: Math.floor(Math.random() * 13),
      },
    ]), 5000); // TODO remove once implemented
    return () => clearInterval(interval);
  }, []);
  return (
    <article className='room container'>
      <main className='v-container-vh'>
        {
          topic === null
            ? null
            : <h2 className='container-v'>Current Topic: <p>{tickets[topic].topic}</p></h2>
        }
        <ul className='container-vh'>
          {
            users.length === 0 && (
              <article className='v-container'>
                <h3>Nobody is here...</h3>
                <section className='container'>
                  <p>Share this code:</p>
                  <p>{id}</p>
                </section>
                <section className='container'>
                  <p>Or this url:</p>
                  <a href={ location.href.split('?').at(0) }> {location.href.split('?').at(0)}</a>
                </section>
              </article>
            )
          }
          {
            users.map(({ name, choice }, index) => (
              <UserChoice
                key={ index }
                name={ name }
                choice={ choice }
                hidden={ hidden }
              />
            ))
          }
        </ul>
        {
          hidden && typeof topic === 'number' && users.some(user => user.choice || user.choice === 0)
            ? (
              <button
                type='button'
                onClick={
                  () => {
                    setHidden(false);
                    const voters = users.filter(user => user.choice || user.choice === 0);
                    tickets[topic].score = voters.reduce((acc, currentValue) => acc + currentValue.choice, 0) / voters.length;
                  }
                }
              >
                Reveal
              </button>
            )
            : null
        }
        {
          (topic === null && tickets.length > 0) || (!hidden && tickets.length > topic + 1)
            ? (
              <button
                type='button'
                onClick={
                  () => {
                    setHidden(true);
                    setTopic(prev => (prev === null ? 0 : prev + 1));
                    for (const user of users) user.choice = undefined;
                  }
                }
              >
                Next Topic
              </button>
            )
            : null
        }
      </main>
      <Agenda
        tickets={ tickets }
        setTickets={ setTickets }
        currentTopic={ topic }
      />
    </article>
  );
}
