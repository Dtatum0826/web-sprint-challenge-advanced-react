import { useState } from "react"
import React from 'react'
import axios from "axios"

const URL = 'http://localhost:9000/api/result'
const row = 3
// Suggested initial states
const initialMessage = '2,2'
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const [message, setMessage] = useState(initialMessage)
  const [email, setEmail] = useState(initialEmail)
  const [steps, setSteps] = useState(initialSteps)
  const [index, setIndex] = useState(initialIndex)
  const [errors, setErrors] = useState('')


  function reset() {
    setMessage(initialMessage)
    setEmail(initialEmail)
    setSteps(initialSteps)
    setIndex(initialIndex)
    setErrors('')
    // Use this helper to reset all states to their initial values.
  }
  function resetEmail(){
    setEmail(initialEmail)
  }

  function getNextIndex(direction) {



    let newIndex;

    switch (direction) {
      case 'up':
        if (index > 2) {
          newIndex = index - 3
        } else return index
        break
      case 'down':
        if (index < 6) {
          newIndex = index + 3
        } else return index
        break
      case 'left':
        if (index % row !== 0) {
          newIndex = index - 1
        } else if (index % row === 0) {
          return index
        }
        break
      case 'right':
        if ((index + 1) % row !== 0) {
          newIndex = index + 1
        } else if ((index + 1) % row === 0) {
          return index
        }
        break
      default:
        newIndex = index
    }
    if (newIndex < 0 || newIndex > 8) {
      return index
    } else {
      return newIndex
    }

    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  }

  function move(evt) {
    const direction = evt.target.id
    const nextIndex = getNextIndex(direction)
    const x = nextIndex % 3 + 1;
    const y = Math.floor(nextIndex / 3) + 1;
    setMessage(`${x},${y}`)

    switch (direction) {
      case 'up':
        if (nextIndex < 3 && nextIndex === index) {
          setErrors(`You can't go up`)
          setSteps(steps)
        } else if (nextIndex !== index) {
          setIndex(nextIndex)
          setSteps(steps + 1)
        }
        break
      case 'down':
        if (nextIndex > 5 && nextIndex === index ) {
          setErrors(`You can't go down`)
          setSteps(steps)
        } else if (nextIndex !== index) {
          setIndex(nextIndex)
          setSteps(steps + 1);
        }
      case 'left':
        if (index === 6 || index === 3 || index === 0 && nextIndex === index) {
          setErrors(`You can't go left`)
          setSteps(steps)
        } else if (nextIndex !== index) {
          setIndex(nextIndex)
          setSteps(steps + 1);
        }
        break
      case 'right':
        if (nextIndex === index) {
          setErrors(`You can't go right`)
          setSteps(steps)
        } else if (nextIndex !== index) {
          setIndex(nextIndex)
          setSteps(steps + 1);
        }
        break
      default:
        setErrors('')

    }
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
  }

  function onChange(evt) {

    setEmail(evt.target.value)
    // You will need this to update the value of the input.
  }

  function onSubmit(evt) {
    evt.preventDefault()
    axios.post(URL, { x: message[0], y: message[2], steps: steps, email: email })
      .then(res => {
      setErrors(res.data.message)
        resetEmail()
        
      })
      .catch(err => {
       setErrors(err.response.data.message)
      })
      
    // Use a POST request to send a payload to the server.
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Coordinates({message})</h3>
        <h3 id="steps">{steps === 1 ? `You moved ${steps} time` : `You moved ${steps} times`}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''} `}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{errors}</h3>
      </div>
      <div id="keypad">
        <button onClick={move} id="left">LEFT</button>
        <button onClick={move} id="up">UP</button>
        <button onClick={move} id="right">RIGHT</button>
        <button onClick={move} id="down">DOWN</button>
        <button onClick={reset} id="reset">reset</button>
      </div>
      <form>
        <input value ={email} onChange={onChange} id="email" type="email" placeholder="type email"></input>
        <input onClick={onSubmit} id="submit" type="submit"></input>
      </form>
    </div>
  )
}
