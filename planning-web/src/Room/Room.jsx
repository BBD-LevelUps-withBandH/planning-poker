import React, { useEffect, useState } from 'react';
import './Room.css';
import { useParams } from 'react-router-dom';
import UserChoice from '../UserChoice/UserChoice.jsx';
import Agenda from '../Agenda/Agenda.jsx';
import PropTypes from 'prop-types';

/**
 *
 * @param {boolean} hidden - whether cards are currently hidden
 * @param {Array<{choice: number|string|undefined}>}users - all active room users
 * @param {number} [topic] - current topic number
 * @returns {boolean} true if you should be able to reveal choices
 */
function canReveal(hidden, users, topic) {
  return (hidden && typeof topic === 'number' && users.some(user => user.choice || user.choice === 0));
}

/**
 *
 * @param {boolean} hidden - whether cards are currently hidden
 * @param {Array} tickets - all room tickets
 * @param {number} [topic] - current topic number
 * @returns {boolean} true if you can change to next topic
 */
function canChangeTopic(hidden, tickets, topic) {
  return ((topic === null && tickets.length > 0) || (!hidden && tickets.length > topic + 1));
}

/**
 * @param {object} props - React Props
 * @param {{name: string, choice: number|string|undefined, superMan: boolean|undefined}} props.currentUser - current User
 * @returns {JSX.Element} Room page
 */
export default function Room({ currentUser }) {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);
  const [hidden, setHidden] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (!currentUser.superMan) {
      const timeout = setTimeout(() => setUsers(prevState => [...prevState, currentUser]));
      return () => clearTimeout(timeout);
    }
  }, []);
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
          currentUser.superMan && canReveal(hidden, users, topic)
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
          currentUser.superMan && canChangeTopic(hidden, tickets, topic)
            ? (
              <button
                type='button'
                onClick={
                  () => {
                    setHidden(true);
                    setTopic(prev => (prev === null ? 0 : prev + 1));
                    for (const roomUser of users) roomUser.choice = undefined;
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
        currentUser={ currentUser }
        tickets={ tickets }
        setTickets={ setTickets }
        currentTopic={ topic }
      />
    </article>
  );
}

Room.propTypes = {
  currentUser: PropTypes.shape({
    name: PropTypes.string,
    choice: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    superMan: PropTypes.bool,
  }),
};
