import React, { Dispatch, SetStateAction } from 'react';
import './Agenda.css';
import PropTypes from 'prop-types';

/**
 *
 * @param {object} props - React Props
 * @param {Array<{topic: string, score: number}>} props.tickets - tickets to be estimated
 * @param {Dispatch<SetStateAction<Array<{topic: string, score: number}>>>} props.setTickets - setState for tickets
 * @param {number} [props.currentTopic] - index of current topic
 * @returns {JSX.Element} Agenda Component
 */
export default function Agenda({ tickets, setTickets, currentTopic }) {
  return (
    <aside className='agenda v-container-h'>
      <h2>Agenda:</h2>
      <ol className='v-container'>
        {
          tickets.map(({ topic, score }, index) => (
            <section
              className={ `container-v${currentTopic === index ? ' current' : ''}` }
              key={ index }
            >
              <li>{topic}</li> <p>{score}</p>
            </section>
          ))
        }
        <form
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
};
