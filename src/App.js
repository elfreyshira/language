import React, { Component } from 'react'
import _ from 'lodash'

import allTopics from './resources/esl-questions/all-topics'
import emotions from './resources/wheel-of-emotions/emotions'

import './App.css'

const topics = _.keys(allTopics)
const isAdminMode =  window.location.search.match("mode=admin")

function Button (props) {
  return (
    <button className="hit-button" {...props}>
        {props.children}
    </button>
  )
}

function getKey () {
  return (new Date()).getTime()
}


function openWindowWithPost(url, data, target) {
  const form = document.createElement("form")
  form.target = target
  form.method = "POST"
  form.action = url
  form.style.display = "none"

  for (let key in data) {
    const input = document.createElement("input")
    input.type = "hidden"
    input.name = key
    input.value = data[key]
    form.appendChild(input)
  }

  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)
}

if (isAdminMode) {
  document.addEventListener('keydown', function(keyObj){
    if (keyObj.key === '/') {
      var inputElement = document.getElementById('wordsearch')
      window.setTimeout(function() {
        inputElement.focus()
        inputElement.select()
      }, 50)
    }
  }, false)
}




///////////////////////////////////////////
///////////////////////////////////////////


function Checkbox (props) {
  return (
    <div>
      <label>
        <input type="checkbox" {...props} />
        {props.children || props.label}
      </label>
    </div>
  )
}






const websiteMapping = {
  gtrans1: (searchValue) => window.open('https://translate.google.com.sg/?hl=en&client=tw-ob#view=home&op=translate&sl=id&tl=en&text=' + encodeURI(searchValue), 'gtrans1'),
  kbbi: (searchValue) => window.open('https://kbbi.kemdikbud.go.id/entri/' + encodeURI(searchValue), 'kbbi'),
  gtrans2: (searchValue) => window.open('https://translate.google.com.sg/?hl=en&client=tw-ob#view=home&op=translate&sl=id&tl=en&text=' + encodeURI(searchValue), 'gtrans2'),
  
  babla: (searchValue) => window.open('https://www.babla.co.id/bahasa-indonesia-bahasa-inggris/' + searchValue.split(' ').join('-'), 'babla'),
  glosbe: (searchValue) => window.open('https://id.glosbe.com/id/en/' + encodeURI(searchValue) + '?stem=false', 'glosbe'),
  jagokata: (searchValue) => window.open('https://jagokata.com/kata-bijak/kata-' + searchValue.split(' ').join('+') + '.html', 'jagokata'),
  sinonimkata: (searchValue) => openWindowWithPost('http://www.sinonimkata.com/search.php', {q: searchValue}, 'sinonimkata'),
  oxford: (searchValue) => window.open('https://id.oxforddictionaries.com/translate/indonesian-english/' + searchValue.split(' ').join('_'), 'oxford'),

  alkitab: (searchValue) => window.open('https://alkitab.sabda.org/search.php?scope=all&exact=off&search=' + searchValue.split(' ').join('+'), 'alkitab'),
  kitabsuci: (searchValue) => window.open('https://kitabsuci.mobi/kitabsuci/search/' + searchValue.split(' ').join('+'), 'kitabsuci'),

  kitabgaul: (searchValue) => window.open('https://kitabgaul.com/word/' + searchValue.split(' ').join('-'), 'kitabgaul'),
  twitter: (searchValue) => window.open('https://twitter.com/search?q=' + encodeURIComponent(searchValue + ' lang:id'), 'twitter'),

  kompas: (searchValue) => window.open('https://search.kompas.com/search/?q=' + searchValue.split(' ').join('+'), 'kompas'),
  kbbiui: (searchValue) => window.open('http://bahasa.cs.ui.ac.id/kbbi/kbbi.php?keyword=' + searchValue.split(' ').join('+') + '&varbidang=all&vardialek=all&varragam=all&varkelas=all&submit=tabel', 'kbbiui'),
  }



class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selections: [],
      searchValue: '',
      urlsSelected: _.mapValues(websiteMapping, () => true)
    }
  }

  getRandomQuestion () {
    const chosenTopic = _.sample(topics)
    const chosenQuestion = _.sample(allTopics[chosenTopic])

    const selectionObj = {
      type: 'question',
      uniqueKey: getKey(),
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
      uniqueKey: getKey(),
      data: {
        title: `${emotionLevel1} → ${emotionLevel2} → ${emotionLevel3}`,
        body: ''
      }
    }

    this.setState({
      selections: [selectionObj].concat(this.state.selections)
    })
  }

  searchForWord (evt) {
    _.forEach(this.state.urlsSelected, (isChecked, source) => {
      if (isChecked) {
        websiteMapping[source](this.state.searchValue)
      }
    })

    evt.preventDefault()
  }

  renderWordSearch () {
    return (
      <form>
        <input
          id="wordsearch"
          type="text"
          value={this.state.searchValue}
          onChange={(evt)=>this.setState({searchValue: evt.target.value})}
        />
        <div>
          {_.map(this.state.urlsSelected, (value, key) => {
            return (
              <Checkbox
                key={key}
                checked={value}
                label={key}
                onChange={(evt) => {
                  const clonedUrlsSelected = _.clone(this.state.urlsSelected)
                  clonedUrlsSelected[key] = evt.target.checked
                  this.setState({urlsSelected: clonedUrlsSelected})
                }
                }
              />
            )
          })}


        </div>
        <Button type="submit" onClick={(evt)=>{this.searchForWord(evt)}}>
          Search Word
        </Button>
      </form>
    )
  }

  render() {
    return (
      <div className="App">
        <Button onClick={()=>this.getRandomQuestion()}>Discussion Question</Button>
        <Button onClick={()=>this.getRandomFeeling()}>Feel Wheel</Button>
        
        {!isAdminMode ? null : this.renderWordSearch()}

        <ul>
          {_.map(this.state.selections, (selection, idx) => (
            <li key={selection.uniqueKey}>
              <h2>{selection.data.title}</h2>
              <p>{selection.data.body}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default App
