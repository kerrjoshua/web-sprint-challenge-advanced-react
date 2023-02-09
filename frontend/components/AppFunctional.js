import React, { useState } from 'react'
import axios from 'axios'


// Suggested initial states
const initial = {message:'', email:'', steps:0, index:4}

export default function AppFunctional(props) {
  const [message, setMessage] = useState(initial.message);
  const [email, setEmail] = useState(initial.email);
  const [steps, setSteps] = useState(initial.steps);
  const [index, setIndex] = useState(initial.index);

  function getXY(i) {
    const coordinates = ['1,1','2,1','3,1','1,2','2,2','3,2','1,3','2,3','3,3']
    return coordinates[i]
  }

  function getXYMessage(i) {
    return `Coordinates (${getXY(i)})`
  }

  function reset() {
    setMessage(initial.message);
    setEmail(initial.email);
    setSteps(initial.steps);
    setIndex(initial.index);
  }

  function getNextIndex(dir) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    const dirs = {left: -1, right:1, up:-3, down:3}
    const left = [0,3,6];
    const right = [2, 5, 8];

    const newInd = index + dirs[dir];
    if (dir === 'left' &&  left.includes(index)) return index;
    if (dir === 'right' &&  right.includes(index)) return index;
    return newInd > -1 && newInd < 9 ? newInd : index;
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    setMessage(initial.message)
    const newIndex = getNextIndex(evt.target.id)
    if (newIndex !== index) {
      setIndex(newIndex); 
      setSteps(steps + 1);
    } else setMessage(`You can't go ${evt.target.id}`)
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    setEmail(evt.target.value)
  }

  function onSubmit(evt) {
    evt.preventDefault();
    const x = parseInt(getXY(index).substring(0,1))
    const y = parseInt(getXY(index).substring(2))
    // Use a POST request to send a payload to the server.
    axios.post('http://localhost:9000/api/result/', {email: email, x: x, y: y, steps: steps})
      .then(res => setMessage(res.data.message))
      .catch(err => setMessage(err.response.data.message))
      .finally(setEmail(initial.email))
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage(index)}</h3>
        <h3 id="steps">You moved {steps} time{steps === 1 ? `` : `s`}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input 
          id="email" 
          type="email" 
          placeholder="type email" 
          value={email}
          onChange={onChange}
        />
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
