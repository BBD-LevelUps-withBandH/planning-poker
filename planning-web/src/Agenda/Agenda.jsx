import React, { Dispatch, SetStateAction } from 'react';
import './Agenda.css';
import PropTypes from 'prop-types';

/**
 *
 * @param {object} props - React Props
 * @param {Array<{ticketName: string, ticketId: string}>} props.tickets - tickets to be estimated
 * @param {Dispatch<SetStateAction<Array<{topic: string, score: number}>>>} props.setTickets - setState for tickets
 * @param {{ticketName: string, ticketId: string}} [props.currentTopic] - index of current topic
 * @param {Array<{ticketId: string, vote: string}>} props.votes - all the votes for the room
 * @param {{name: string, choice: number|string|undefined, superMan: boolean|undefined}} props.currentUser - current User
 * @returns {JSX.Element} Agenda Component
 */
export default function Agenda({ tickets, setTickets, currentTopic, currentUser, votes }) {
  function getTicketBody ({ticketName, ticketId}, index) {
    const ticketVotes = votes.filter(vote => vote.ticketId === ticketId && !isNaN(Number(vote.vote)));
    return (
      <section
        className={`container-v${currentTopic?.ticketId === ticketId ? ' current' : ''}`}
        key={index}
      >
        <li>{ticketName}</li>
        <p>{ticketVotes.length > 0 && tickets.indexOf(currentTopic) > index && (ticketVotes.reduce((sum, {vote}) => sum + Number(vote), 0) / ticketVotes.length).toFixed(1)}</p>
      </section>
    )
  }

  return (
    <aside className='agenda v-container-h'>
      <h2>Agenda:</h2>
      <ol className='v-container'>
        {
          tickets.map(getTicketBody)
        }
        {
          currentUser.superMan
          && <form
            className='container'
            onSubmit={
              event => {
                event.preventDefault();
                const topic = new FormData(event.target).get('topic');
                setTickets(prevState => [
                  ...prevState,
                  { topic },
                ]);
                event.target.reset();
              }
            }
          >
            <textarea
              name='topic'
              required
            />
            <button type='submit'>
              Add topic
            </button>
          </form>
        }
      </ol>
    </aside>
  );
}

Agenda.propTypes = {
  tickets: PropTypes.arrayOf(PropTypes.shape({
    topic: PropTypes.string,
    score: PropTypes.number,
  })),
  setTickets: PropTypes.func,
  currentTopic: PropTypes.number,
  currentUser: PropTypes.shape({
    name: PropTypes.string,
    choice: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    superMan: PropTypes.bool,
  }),
};
