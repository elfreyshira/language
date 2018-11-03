import React, { Component } from 'react';
import './App.css';

import _ from 'lodash';

import allTopics from './resources/esl-questions/all-topics';
import emotions from './resources/wheel-of-emotions/emotions';

const topics = _.keys(allTopics)

function Button (props) {
  return (
    <button className="hit-button" {...props}>
        {props.children}
    </button>
  )
}


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {selections: []}
  }

  getRandomQuestion () {
    const chosenTopic = _.sample(topics)
    const chosenQuestion = _.sample(allTopics[chosenTopic])

    const selectionObj = {
      type: 'question',
      data: {
        title: chosenTopic,
        body: chosenQuestion
      }
    }

    this.setState({
      selections: [selectionObj].concat(this.state.selections)
    })

  }

  getRandomFeeling () {

    const emotionLevel1 = _.sample(_.keys(emotions))
    const emotionLevel2 = _.sample(_.keys(emotions[emotionLevel1]))
    const emotionLevel3 = _.sample(emotions[emotionLevel1][emotionLevel2])

    const selectionObj = {
      type: 'question',
      data: {
        title: `${emotionLevel1} → ${emotionLevel2} → ${emotionLevel3}`,
        body: ''
      }
    }

    this.setState({
      selections: [selectionObj].concat(this.state.selections)
    })
  }

  render() {
    return (
      <div className="App">
        <Button onClick={()=>this.getRandomQuestion()}>Discussion Question</Button>
        <Button onClick={()=>this.getRandomFeeling()}>Feel Wheel</Button>
        <ul>
          {_.map(this.state.selections, (selection, idx) => (
            <li key={selection.data.title + selection.data.body + idx}>
              <h2>{selection.data.title}</h2>
              <p>{selection.data.body}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
