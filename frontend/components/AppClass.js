import React from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  constructor() {
    super()
    this.state = {
      message: initialMessage, 
      email: initialEmail, 
      index: initialIndex, 
      steps: initialSteps}
  }

  getXY = (i) => {
    const coordinates = ['1,1','1,2','1,3','2,1','2,2','2,3','3,1','3,2','3,3']
    return coordinates[i]
  }

  getXYMessage = (i) => {
    return `Coordinates (${this.getXY(i)})`
  }

  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState(initialState)
  }

  getNextIndex = (dir) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    const dirs = {left: -1, right:1, up:-3, down:3}
    const left = [0,3,6];
    const right = [2, 5, 8];

    const newInd = this.state.index + dirs[dir];
    if (dir === 'left' &&  left.includes(this.state.index)) return this.state.index;
    if (dir === 'right' &&  right.includes(this.state.index)) return this.state.index;
    return newInd > -1 && newInd < 9 ? newInd : this.state.index;
  }

  move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    this.setState({message: initialMessage})
    const newIndex = this.getNextIndex(evt.target.id)
    if (newIndex !== this.state.index) {
      this.setState({index: newIndex});
      
      this.setState({steps: this.state.steps + 1})
    } else this.setState({message: `You can't go ${evt.target.id}`})
  }

  onChange = (evt) => {
    // You will need this to update the value of the input.
    this.setState({...this.state, email: evt.target.value})
  }

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    axios.post('http://localhost:9000/api/result/', {
      email: this.state.email, 
      x: parseInt(this.getXY(this.state.index).substring(0,1)), 
      y: parseInt(this.getXY(this.state.index).substring(2)), 
      steps: this.state.steps
    })
      .then(res => this.setState({...this.state, message: res.data.message}))
      .catch(err => this.setState({...this.state, message: err.response.data.message}))
      .finally(this.setState({...this.state, email: initialEmail}))
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage(this.state.index)}</h3>
          <h3 id="steps">You moved {this.state.steps} times</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={this.move}>LEFT</button>
          <button id="up" onClick={this.move}>UP</button>
          <button id="right" onClick={this.move}>RIGHT</button>
          <button id="down" onClick={this.move}>DOWN</button>
          <button id="reset" onClick={this.reset}>reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input 
            id="email" 
            type="email" 
            placeholder="type email"
            value={this.state.email}
            onChange={this.onChange}
          />
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
