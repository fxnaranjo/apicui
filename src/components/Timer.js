import React, { useEffect, useState } from 'react';
import { Timer32, Renew16 } from '@carbon/icons-react';
import { Button } from 'carbon-components-react';
import { warmGray, green } from '@carbon/colors';
import './Timer.scss';

const Timer = ({ time = 0, onClickRefresh, disabled }) => {
  const [init, setInit] = useState(time);
  const [counter, setCounter] = useState(time);
  
  useEffect(() => {
    if(counter > 0) {
      setTimeout(() => {
        setCounter(counter - 1);
      }, 1000);
    }
  }, [counter]);

  useEffect(() => {
    if( time && time !== 0 ) {
      console.log(`onChangeTime: ${time}`);
      setInit(time);
    }
  }, [time]);

  useEffect(() => {
    console.log(`onChangeInit: ${init}`);
    setCounter(time);
  }, [init]);

  return (
    <div className="timer" style={{ backgroundColor: warmGray[80] }}>
      <div className="ctimer">
        <div className="icon">
          <Timer32 />
        </div>
        <div className="time">{counter}</div>
        <div className="progress" style={{ backgroundColor: green[60], width: counter * 100 / time + "%" }}></div>
      </div>
      <Button disabled={counter !== 0 || disabled} renderIcon={Renew16} iconDescription="Refresh token" 
        kind="secondary" hasIconOnly onClick={onClickRefresh} />
    </div>
  )
}

export default Timer;