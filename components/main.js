import { inject, observer } from 'mobx-react'
import DevTools from 'mobx-react-devtools'

import OrderShape from '../schemas/OrderShape'

import PropValidation from '../utils/propValidation/propValidation'

import { Button, Alert, Spinner } from 'elemental' 

@inject("mainStore")
@observer
export default class Main extends React.Component {
  
  constructor() {
    super()
    this.state = {}
  }

  addHundler = () => {
    this.props.mainStore.addTemp(0, "Kiev");
  };

  render() {
    const r = <TempContainer key={ 277 } index={ 277 } temp={ {} } />
    console.log(typeof r)
    return (
      <div>
        {
          this.props.mainStore.getTemperatures && this.props.mainStore.getTemperatures.map(
            (temp, key) =>
              <TempContainer key={ key } index={ key } temp={ temp } />
          )  
        }       
        <button className="addButtons" ref="addButtons" onClick={ this.addHundler } style={styles.addStyle}>Add</button>
      </div>
    )
  }
}

@observer
class TempContainer extends React.Component {

  render() {
    return (
      <div style={styles.tempStyle}>
        <h1>This is h1</h1>
        <div style={styles.tempValStyle}>Temperatire: { this.props.temp.temperature }</div>
        <button style={styles.tempValStyle} onClick={ () => this.props.temp.upTemperature() }>+</button>
        <button style={styles.tempValStyle} onClick={ () => this.props.temp.downTemperature() }>-</button>
        <div>Location: { this.props.temp.location }</div>
        <Button size="lg" type="primary" onClick={() => alert("!!!!")}>Button1</Button>
      </div> 
    )
  }

}

const styles = {
  tempStyle: {
    padding: 10 + 'px',
    border: '1px solid black'
  },
  addStyle: {
    padding: 5 + 'px',
    marginTop: 10 + 'px'
  },
  tempValStyle: {
    display: "inline",
    marginLeft: 10 + 'px'
  }
}

