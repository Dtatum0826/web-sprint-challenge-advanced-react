import React from 'react'
import axios from 'axios'
const URL = 'http://localhost:9000/api/result'
const row = 3
// Suggested initial states
const initialMessage = '2,2'
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at
const initialErrors = ''
const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
  errors: initialErrors
}

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  constructor(props) {
    super(props);
    this.state = {
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      steps: initialSteps,
      errors: initialErrors,
    }
  }


  reset = () => {
    this.setState({
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      steps: initialSteps,
      errors: initialErrors,
    })
    // Use this helper to reset all states to their initial values.
  }
  resetEmail = () => {
    this.setState({
      email: initialEmail
    })
  }

  getNextIndex = (direction) => {
    let newIndex;

    switch (direction) {
      case 'up':
        newIndex = this.state.index - 3;
        break
      case 'down':
        if (this.state.index < 6) {
          newIndex = this.state.index + 3
        } else return this.state.index

        break
      case 'left':
        if (this.state.index % row !== 0) {
          newIndex = this.state.index - 1
        } else if (this.state.index % row === 0) {
          return this.state.index
        }
        break
      case 'right':
        if ((this.state.index + 1) % row !== 0) {
          newIndex = this.state.index + 1
        } else if ((this.state.index + 1) % row === 0) {
          return this.state.index
        }
        break
      default:
        newIndex = this.state.index
    }


    if (newIndex < 0 || newIndex > 8) {
      return this.state.index
    } else {
      return newIndex
    }

    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  }

  move = (evt) => {

    const direction = evt.target.id;
    const nextIndex = this.getNextIndex(direction);
    const x = nextIndex % 3 + 1;
    const y = Math.floor(nextIndex / 3) + 1;

    this.setState({
      message: `${(x)},${(y)}`,
      index: nextIndex,
      steps: this.state.steps + 1,
      errors: ``
    })
    switch (direction) {
      case 'up':
        if (nextIndex < 3 && nextIndex === this.state.index) {

          this.setState({
            message: `${(x)},${(y)}`,
            index: this.state.index,
            steps: this.state.steps,
            errors: `You can't go up`
          })
        } else if (nextIndex !== this.state.index) {

          this.setState({
            message: `${(x)},${(y)}`,
            index: nextIndex,
            steps: this.state.steps + 1
          })
        }
        break
      case 'down':
        if (nextIndex  > 5 && nextIndex === this.state.index ) {
          this.setState({
            message: `${(x)},${(y)}`,
            index: this.state.index,
            steps: this.state.steps,
            errors: `You can't go down`
          })
        } else if (nextIndex !== this.state.index) {

          this.setState({
            message: `${(x)},${(y)}`,
            index: nextIndex,
            steps: this.state.steps + 1
          })
        }
      case 'left':
        if (this.state.index === 6 || this.state.index === 3  || this.state.index === 0 &&   nextIndex === this.state.index) {
          this.setState({
            message: `${(x)},${(y)}`,
            index: this.state.index,
            steps: this.state.steps,
            errors: `You can't go left`
          })
        } else if (nextIndex !== this.state.index) {

          this.setState({
            message: `${(x)},${(y)}`,
            index: nextIndex,
            steps: this.state.steps + 1
          })
        }
        break
      case 'right':
        if (nextIndex === this.state.index) {
          this.setState({
            message: `${(x)},${(y)}`,
            index: this.state.index,
            steps: this.state.steps,
            errors: `You can't go right`
          })
        } else if (nextIndex !== this.state.index) {

          this.setState({
            message: `${(x)},${(y)}`,
            index: nextIndex,
            steps: this.state.steps + 1
          })
        }
        break
      default:
        this.setState({
          errors: ''
        })

    }

    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
  }

  onChange = (evt) => {
    const value = evt.target.value
    this.setState({
      email: value,

    })
  }

  onSubmit = (evt) => {
    evt.preventDefault()
    axios.post(URL, { x: this.state.message[0], y: this.state.message[2], steps: this.state.steps, email: this.state.email })
      .then(res => {
        console.log(res.data.message)
         this.setState({
           errors: res.data.message,
         })
        this.resetEmail()

      })
      .catch(err => {
        console.log(err.response.data.message)
        this.setState({
          errors: err.response.data.message,
        })
      })
    // Use a POST request to send a payload to the server.
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">Coordinates({this.state.message})</h3>
          <h3 id="steps">{this.state.steps === 1 ? `You moved ${this.state.steps} time` : `You moved ${this.state.steps} times`}</h3>
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
          <h3 id="message">{this.state.errors}</h3>
        </div>
        <div id="keypad">
          <button onClick={this.move} id="left">LEFT</button>
          <button onClick={this.move} id="up">UP</button>
          <button onClick={this.move} id="right">RIGHT</button>
          <button onClick={this.move} id="down">DOWN</button>
          <button onClick={this.reset} id="reset">reset</button>
        </div>
        <form>
          <input value={this.state.email} onChange={this.onChange} id="email" type="email" placeholder="type email"></input>
          <input onClick={this.onSubmit} id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
