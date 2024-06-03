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
  const api = 'https://api.planning-poker.projects.bbdgrad.com/';
  const pollTimeMs = 5_000;
  const [topic, setTopic] = useState(null);
  const [hidden, setHidden] = useState(true);
  const [choices, setChoices] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [choice, setChoice] = useState(null);
  const [users, setUsers] = useState([]);
  const [room, setRoom] = useState(null);
  const [votes, setVotes] = useState([]);
  const [userInRoomDetails, setUserInRoomDetails] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const getChoice = (userInRoomId) => {
    const vote = votes.find(vote => vote.ticketId === topic?.ticketId && userInRoomId === vote.userInRoomId);
    if (!vote) return;
    return choices.find(choice => choice.voteTypeId === vote.voteId)
  }

  useEffect(() => {
    fetch(`${api}rooms/${id}`)
      .then(response => {
        if (response.statusCode === 404) throw response;
        return response.json();
      })
      .then(setRoom)
      .catch(setNotFound);
  }, []);

  useEffect(() => {
    fetch(`${api}vote-types`)
      .then(response => response.json())
      .then(setChoices);
  }, []);

  useEffect(() => {
    if (room) {
      fetch(`${api}rooms/${id}/users`,
        {method: 'POST', body: JSON.stringify({userId: 3})})
        .then(response => response.json())
        .then(setUserInRoomDetails);

      const pollUsersInRoom = () => fetch(`${api}rooms/${id}/users`)
        .then(response => response.json())
        .then(setUsers)
        .then(() => new Promise(resolve => setTimeout(() => resolve(), pollTimeMs)))
        .then(pollUsersInRoom);

      // const pollCurrentTopic = () => fetch('topic')
      //   .then(response => response.json())
      //   .then(setTopic)
      //   .then(() => new Promise(resolve => setTimeout(() => resolve(), pollTimeMs)))
      //   .then(pollCurrentTopic);

      const pollTickets = () => fetch(`${api}rooms/${id}/tickets`)
        .then(response => response.json())
        .then(tickets => {
          setTickets(tickets);
          setTopic(tickets[1]);
          return Promise.all(tickets.map(({ticketId}) => fetch(`${api}votes/ticket/${ticketId}`).then(response => response.json())))
        })
        .then(ticketVotes => ticketVotes.flat())
        .then(setVotes)
        .then(() => new Promise(resolve => setTimeout(() => resolve(), pollTimeMs)))
        .then(pollTickets);

      const usersInRoom = setTimeout(pollUsersInRoom);
      // const currentTopic = setTimeout(pollCurrentTopic);
      const agenda = setTimeout(pollTickets);

      return () => {
        clearTimeout(usersInRoom);
        // clearTimeout(currentTopic);
        clearTimeout(agenda);
      };
    }
  }, [room]);

  if (notFound) return <h2>Nothing here pal, soz</h2>;

  return (
    <article className='room container'>
      <main className='v-container-vh'>
        {
          topic && <h2 className='container-v'>Current Topic: <p>{topic.ticketName}</p></h2>
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
            users.map(({ userId, userInRoomId }, index) => (
              <UserChoice
                key={ index }
                name={ userId }
                choice={ getChoice(userInRoomId) }
                hidden={ hidden }
              />
            ))
          }
        </ul>
        {
          !currentUser.superMan && topic
          && <form
            className='container'
            onSubmit={
              event => {
                event.preventDefault();
                fetch(`${api}vote/create`, {
                  method: 'POST',
                  body: JSON.stringify({ userInRoomId: userInRoomDetails.userInRoomId, voteTypeId: choice.voteTypeId, ticketId: topic.ticketId}),
                })
                  .catch(() => setChoice(null));
                // TODO send to BE
              }
            }
          >
            <h2>Vote</h2>
            {
              choices.map((value, i) => (
                <button
                  className={ choice === value ? 'chosen' : undefined }
                  type='submit'
                  key={ i }
                  onClick={
                    () => {
                      setChoice(value);
                    }
                  }
                >
                  {value.vote}
                </button>
              ))
            }
          </form>
        }
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
        votes={ votes.map(({ticketId, voteTypeId}) => ({ticketId, vote: choices.find(choice => choice.voteTypeId === voteTypeId)?.vote})) }
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
