import React from 'react';
import './UserChoice.css';
import PropTypes from 'prop-types';

/**
 *
 * @param {object} props - React Props
 * @param {string} props.name - username
 * @param {string|number} [props.choice] - numeric or other choice
 * @param {boolean} props.hidden - whether to hide or display choice
 * @returns {JSX.Element} UserChoice Component
 */
export default function UserChoice({ name, choice, hidden }) {
  return (
    <li className='user-choice v-container-h'>
      <p>{name}</p>
      {choice ? <figure className={ `v-container-hv${hidden ? ' hidden' : ''}` }>{choice}</figure> : <div />}
    </li>
  );
}

UserChoice.propTypes = {
  name: PropTypes.string,
  choice: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  hidden: PropTypes.bool,
};
