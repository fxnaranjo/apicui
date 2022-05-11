import React from 'react';
import { blue } from '@carbon/colors';
import './Information.scss';

const Information = ({ title, description, step }) => {
  return (
    <div className="information">
      <div className="cinformation">
        { step && <div className="step" style={{ backgroundColor: blue[60] }}>{step}</div> }
        <h4 className="title">{title}</h4>
      </div>
      { description && <p className="description">{description}</p> }
    </div>
  )
}

export default Information;