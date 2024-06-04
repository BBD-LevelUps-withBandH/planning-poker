import React, { useEffect, useState } from 'react';
import './Room.css';
import { useParams } from 'react-router-dom';
import UserChoice from '../UserChoice/UserChoice.jsx';
import Agenda from '../Agenda/Agenda.jsx';
import { api } from '../backend.js';
import handleSignIn from '../handleSignIn.js';

/**
 *
 * @param {boolean} hidden - whether cards are currently hidden
 * @param {Array} votes - all active room users
 * @param {{topicId: string}} [topic] - current topic
 * @returns {boolean} true if you should be able to reveal choices
 */
function canReveal(hidden, votes, topic) {
  return hidden && topic && votes.some(({ topicId }) => topicId === topic.topicId);
}

/**
 *
 * @param {boolean} hidden - whether cards are currently hidden
 * @param {Array} tickets - all room tickets
 * @param {object} [topic] - current topic
 * @returns {boolean} true if you can change to next topic
 */
function canChangeTopic(hidden, tickets, topic) {
  return ((!topic && tickets.length > 0) || (!hidden && tickets.length > tickets.indexOf(topic) + 1));
}

/**
 * @returns {JSX.Element} Room page
 */
export default function Room() {
  const { id } = useParams();
  const pollTimeMs = 5000;
  const [topic, setTopic] = useState(null); // TODO make backend
  const [hidden, setHidden] = useState(true); // TODO make backend
  const [choices, setChoices] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [choice, setChoice] = useState(null);
  const [users, setUsers] = useState([]);
  const [room, setRoom] = useState(null);
  const [votes, setVotes] = useState([]);
  const [userInRoomDetails, setUserInRoomDetails] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const getChoice = userInRoomId => {
    const vote = votes.find(vote => vote.ticketId === topic?.ticketId && userInRoomId === vote.userInRoomId);
    if (!vote) return;
    return choices.find(choice => choice.voteTypeId === vote.voteId);
  };

  useEffect(() => {
    if (sessionStorage.getItem('access_token')) {
      fetch(`${api}rooms/${id}`, { headers: { Authorization: `Bearer ${sessionStorage.getItem('access_token')}` } },)
        .then(response => {
          if (response.statusCode === 404) throw response;
          return response.json();
        })
        .then(setRoom)
        .catch(setNotFound);
      fetch(`${api}vote-types`, { headers: { Authorization: `Bearer ${sessionStorage.getItem('access_token')}` } },)
        .then(response => response.json())
        .then(setChoices);
    } else { handleSignIn(`room/${id}`); }
  }, []);

  useEffect(() => {
    if (room) {
      fetch(
        `${api}rooms/${id}/users`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
          },
        },
      )
        .then(response => response.json())
        .then(setUserInRoomDetails)
        .catch(() => setUserInRoomDetails({ // TODO remove once integration supports re-joining
          userInRoomId: 16,
          userId: 3,
          roomId: 1,
        }));

      let polling = true;

      const pollUsersInRoom = () => fetch(`${api}rooms/${id}/users`, { headers: { Authorization: `Bearer ${sessionStorage.getItem('access_token')}` } })
        .then(response => response.json())
        .then(setUsers)
        .then(() => new Promise(resolve => setTimeout(() => resolve(), pollTimeMs)))
        .then(() => polling && pollUsersInRoom());

      // const pollCurrentTopic = () => fetch('topic', { headers: { Authorization : `Bearer ${sessionStorage.getItem('access_token')}` } })
      //   .then(response => response.json())
      //   .then(setTopic)
      //   .then(() => new Promise(resolve => setTimeout(() => resolve(), pollTimeMs)))
      //   .then(() => polling && pollCurrentTopic());

      const pollTickets = () => fetch(`${api}rooms/${id}/tickets`, { headers: { Authorization: `Bearer ${sessionStorage.getItem('access_token')}` } })
        .then(response => response.json())
        .then(tickets => {
          setTickets(tickets);
          setTopic(tickets[1]);
          return Promise.all(tickets.map(({ ticketId }) => fetch(`${api}votes/ticket/${ticketId}`, { headers: { Authorization: `Bearer ${sessionStorage.getItem('access_token')}` } }).then(response => response.json())));
        })
        .then(ticketVotes => ticketVotes.flat())
        .then(setVotes)
        .then(() => new Promise(resolve => setTimeout(() => resolve(), pollTimeMs)))
        .then(() => polling && pollTickets());

      const usersInRoom = setTimeout(pollUsersInRoom, 50);
      // const currentTopic = setTimeout(pollCurrentTopic, 50);
      const agenda = setTimeout(pollTickets, 50);

      return () => {
        polling = false;
        clearTimeout(usersInRoom);
        // clearTimeout(currentTopic);
        clearTimeout(agenda);
      };
    }
  }, [room]);

  if (notFound || !room) return <h2>Nothing here pal, soz</h2>;

  return (
    <article className='room container'>
      <main className='v-container-vh'>
        {topic && <h2 className='container-v'>Current Topic: <p>{topic.ticketName}</p></h2>}
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
          room.ownerId !== userInRoomDetails?.userId && topic
          && <form
            className='container'
            onSubmit={
              event => {
                event.preventDefault();
                fetch(`${api}votes/create`, {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    userInRoomId: userInRoomDetails.userInRoomId,
                    voteTypeId: choice.voteTypeId,
                    ticketId: topic.ticketId,
                  }),
                })
                  .then(response => response.ok || setChoice(null));
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
          room.ownerId === userInRoomDetails?.userId && canReveal(hidden, users, topic)
            ? (
              <button
                type='button'
                onClick={
                  () => {
                    setHidden(false);
                  }
                }
              >
                Reveal
              </button>
            )
            : null
        }
        {
          room.ownerId === userInRoomDetails?.userId && canChangeTopic(hidden, tickets, topic)
            ? (
              <button
                type='button'
                onClick={
                  () => {
                    setHidden(true);
                    setTopic(tickets.at(tickets.indexOf(topic) + 1));
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
        userInRoomDetails={ userInRoomDetails }
        room={ room }
        votes={
          votes.map(({ ticketId, voteTypeId }) => ({
            ticketId,
            vote: choices.find(choice => choice.voteTypeId === voteTypeId)?.vote,
          }))
        }
        tickets={ tickets }
        setTickets={ setTickets }
        currentTopic={ topic }
      />
    </article>
  );
}
