import { Motion, spring, StaggeredMotion, TransitionMotion, presets } from 'react-motion'
import animaze from 'animaze';

export default class MyMotion extends React.Component {

  constructor() {
    super()
    this.state = {
      coolThings: ['React', 'Redux', 'Babel', 'Webpack'],
      items: [{key: 'a', size: 100}, {key: 'b', size: 100}, {key: 'c', size: 100}],
      word: ["H", "e", "l", "l", "o", "!"]
    }
  }

  getThings(feachures) {
    let title = `This is cool:`
    for (let thing of feachures) {
      console.log(thing)
      title += thing
    }
    return title
  }
  // animazeOpacity = () => animaze({
  //   tick: v => { document.getElementById("qqq").style.opacity = v; }, // v is varied from 0 to 1                                             // during animation 
  // });
 
  // animazeScroll = () =>  animaze({
  //     tick: v => window.scrollTo(0, 200 * v),
  //     duration: 500, // default is 240 
  //     ease: k => 0.5 * (1 - Math.cos(Math.PI * k)), // this is default one 
  // });

  // componentDidMount() {
  //   //this.animazeOpacity().then(this.animazeScroll);
  // }

  deleteItem() {
    this.setState({
      items: (this.state.items.length 
        ? this.state.items.slice(0, this.state.items.length - 1) 
        : [{key: 'a', size: 100}, {key: 'b', size: 100}, {key: 'c', size: 100}]) // remove c.
    });
  }

  addItem() {
    this.setState({
      items: [...this.state.items, {key: Math.random().toString(), size: 100}]
    });
  }

  willLeave() {
    // triggered when c's gone. Keeping c until its width/height reach 0.
    return {width: spring(0), height: spring(0)};
  }

  willEnter() {
    // triggered when c's gone. Keeping c until its width/height reach 0.
    return {width: spring(10, presets.wobbly), height: spring(10, presets.wobbly)};
  }

  render() {
    return (
      <div id="qqq" style={{ height: 500 + 'px' }}>
        
        {
          <Motion defaultStyle={{x: 0, y: 0}} style={{x: spring(400, {stiffness: 50, damping: 5}), y: spring(100, {stiffness: 50, damping: 5})}}>
            {value => <div style={{ marginLeft: value.x + 'px', marginTop: value.y + 'px' }}>{value.x}  {value.y}</div>}
          </Motion>
        }

        {
          <StaggeredMotion
            defaultStyles={[{h: 10, s: 110, t: 110}, {h: 30, s: 90, t: 90}, {h: 50, s: 70, t: 70}, {h: 70, s: 50, t: 50}, {h: 90, s: 30, t: 30}, {h: 110, s: 10, t: 10}]}
            styles={prevInterpolatedStyles => prevInterpolatedStyles.map((_, i) => {
              return i === 0
                ? {h: spring(200), s: spring(30), t: spring(50)}
                : {h: spring(prevInterpolatedStyles[i - 1].h), s: spring(prevInterpolatedStyles[i - 1].s), t: spring(prevInterpolatedStyles[i - 1].t)}
            })}>
            {interpolatingStyles => {
                //console.log("interpolatingStyles ", interpolatingStyles)
                return <div style={{ height:500 + 'px' }}>
                  {interpolatingStyles.map((style, i) =>
                    <div key={i} style={{display:"inline", marginTop: style.t + 'px', marginLeft: style.s + 'px', width: style.h, height: 30 + 'px', fontSize: style.s + 'px'}}>{this.state.word[i]}</div>)
                  }
                </div>
              }
            }
          </StaggeredMotion>
        }

        {
          <TransitionMotion
            
            willLeave={this.willLeave}
            styles={this.state.items.map(item => ({
              key: item.key,
              style: {width: item.size, height: item.size},
            }))}>
            {interpolatedStyles =>
              // first render: a, b, c. Second: still a, b, c! Only last one's a, b.
              <div>
                {interpolatedStyles.map(config => {
                  return <div key={config.key} style={{...config.style, border: '1px solid'}} />
                })}
              </div>
            }
          </TransitionMotion>

          // <button onClick={ this.deleteItem.bind(this) }>Delete</button>
          // <button onClick={ this.addItem.bind(this) }>Add</button>
        }
      </div>
    )
  }
}