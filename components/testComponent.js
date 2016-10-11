import React from 'react'
import {
  VictoryAxis,
  VictoryArea,
  VictoryBar,
  VictoryChart,
  VictoryLine,
  VictoryPie,
  VictoryScatter,
  VictoryGroup
} from "victory";
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineMarkSeries} from 'react-vis';
import Graph from'./react-graph';
import randomcolor from 'randomcolor'

const CatPoint = ({ x, y, datum }) => 
  <svg>
   <ellipse cx={x} cy={y} rx="10" ry="10" fill="red" strokeWidth="1" stroke="rgb(0,0,0)"/>
   <text x={x} y={y}>Name</text>
  </svg>
  

export default class TestComponent extends React.Component {

  constructor() {
    super()
    this.state = {
      text: 'Old text',
      hColor: 'white'
    }
  }

  getDate() {
    return parseInt((Math.random() * (100 - 40) + 40), 10)
  }

  getCoords(data) {
    let res = []
    for (let i in data) {
      console.log('i', i)
      res.push({x: parseInt(i, 10) + parseInt((Math.random() * (50 - 20) + 20), 10), y: parseInt(i, 10) + parseInt((Math.random() * (50 - 20) + 20), 10)})
      for (let j in data[i]) {
        console.log('j', j)
        res.push({x: parseInt(i, 10) + parseInt((Math.random() * (50 - 20) + 20), 10), y: data[i][j] + parseInt((Math.random() * (50 - 20) + 20), 10)})
      }
    }
    console.log(res)
    return res
  }

      //   '102': [101, 103, 104, 105],
      // '103': [102, 101, 104, 105],
      // '104': [102, 103, 101, 105],
      // '105': [102, 103, 104, 101]

  render() {
    const apiData = {
      '101': [102, 103, 104, 105],
 
    }
    var data1 = {
      nodes: [
        {id: 101, label: 'Вася Пупкин', borderWidth: 0 ,color: {background: randomcolor(), border: randomcolor() }},
        {id: 102, label: 'Света Аникеева', color: randomcolor()},
        {id: 103, label: 'Алексанрд Драч', color: randomcolor()},
        {id: 104, label: 'Владимир Великий', color: randomcolor()},
        {id: 105, label: 'Просто Крутой', color: randomcolor()},
        {id: 106, label: 'Вася Пупкин', color: randomcolor()},
        {id: 107, label: 'Света Аникеева', color: randomcolor()},
        {id: 108, label: 'Алексанрд Драч', color: randomcolor()},
        {id: 109, label: 'Владимир Великий', color: randomcolor()},
        {id: 110, label: 'Просто Крутой', color: randomcolor()},
        {id: 111, label: 'Вася Пупкин', color: randomcolor()},
        {id: 112, label: 'Света Аникеева', color: randomcolor()},
        {id: 113, label: 'Алексанрд Драч', color: randomcolor()},
        {id: 114, label: 'Владимир Великий', color: randomcolor()},
        {id: 115, label: 'Просто Крутой', color: randomcolor()},
        {id: 116, label: 'Вася Пупкин', color: randomcolor()},
        {id: 117, label: 'Света Аникеева', color: randomcolor()},
        {id: 118, label: 'Алексанрд Драч', color: randomcolor()},
        {id: 119, label: 'Владимир Великий', color: randomcolor()},
        {id: 120, label: 'Просто Крутой', color: randomcolor()}
      ],
      edges: [
        {from: 101, to: 102},
        {from: 101, to: 103},
        {from: 101, to: 104},
        {from: 101, to: 105},
        {from: 102, to: 101},
        {from: 102, to: 103},
        {from: 102, to: 101},
        {from: 102, to: 105},
        {from: 103, to: 102},
        {from: 103, to: 101},
        {from: 103, to: 104},
        {from: 103, to: 105},
        {from: 104, to: 105},
        {from: 104, to: 103},
        {from: 104, to: 101},
        {from: 104, to: 105},
        {from: 105, to: 104},
        {from: 105, to: 103},
        {from: 105, to: 104},
        {from: 105, to: 101},

        {from: 106, to: 102},
        {from: 106, to: 103},
        {from: 106, to: 104},
        {from: 107, to: 105},
        {from: 107, to: 101},
        {from: 107, to: 103},
        {from: 107, to: 101},
        {from: 108, to: 105},
        {from: 108, to: 102},
        {from: 109, to: 101},
        {from: 110, to: 104},
        {from: 111, to: 105},
        {from: 112, to: 105},
        {from: 113, to: 103},
        {from: 113, to: 101},
        {from: 113, to: 105},
        {from: 114, to: 104},
        {from: 115, to: 103},
        {from: 116, to: 104},
        {from: 117, to: 101},
        {from: 118, to: 103},
        {from: 119, to: 104},
        {from: 120, to: 101}
      ]
    };
    const data = [
      {x: this.getDate(), y:  this.getDate()},
      {x: this.getDate(), y:  this.getDate()},
      {x: this.getDate(), y:  this.getDate()},
      {x: this.getDate(), y:  this.getDate()},
      {x: this.getDate(), y:  this.getDate()},
      {x: this.getDate(), y:  this.getDate()},
      {x: this.getDate(), y:  this.getDate()},
      {x: this.getDate(), y: this.getDate()}
    ]
    let newDate = this.getCoords(apiData)
    return (
      <div>
        <h1 className="hello">Graph</h1>
        
        <Graph graph={data1} style={{ position: 'absolute', width: 100 + '%', height: 80 + '%' }} />
      </div>
    )
  }
}



// <XYPlot
//           width={300}
//           height={300}>
//           <LineMarkSeries
//             data={[
//               {x: 1, y: 10},
//               {x: 2, y: 5},
//               {x: 3, y: 15}
//             ]}/>
//         </XYPlot>
//         <VictoryLine 
//           style={{data:
//             {stroke: "red", strokeWidth: 4, position: 'absolute'},
//             parent: {position: 'absolute'}
//           }} 
//           animate={{}}
//           data={data}
//         />
//         <VictoryScatter 
//           style={{data:
//             {stroke: "red", strokeWidth: 10, fill: 'red'}
//           }} 
//           animate={{}}
//           data={data}
//           dataComponent={<CatPoint />}
//         />