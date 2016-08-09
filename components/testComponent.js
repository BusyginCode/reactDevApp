import React from 'react'
export default class TestComponent extends React.Component {

  constructor() {
    super()
    this.state = {
      text: 'Old text',
      hColor: 'white'
    }
  }

  render() {
    return (
      <div>
        <h1 className="hello" style={{ color: this.state.hColor }}>{this.state.text}</h1>
        <button onFocus={() => this.setState({hColor: 'red'})} onClick={() => this.setState({text: 'New text!'})}>Add</button>
      </div>
    )
  }
}