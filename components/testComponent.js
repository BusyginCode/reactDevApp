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
        {id: 101, label: 'Вася Пупкин'},
        {id: 102, label: 'Света Аникеева'},
        {id: 103, label: 'Алексанрд Драч'},
        {id: 104, label: 'Владимир Великий'},
        {id: 105, label: 'Просто Крутой'}
      ],
      edges: [
        {from: 101, to: 102},
        {from: 101, to: 103},
        {from: 101, to: 104},
        {from: 101, to: 105},
        {from: 102, to: 101},
        {from: 102, to: 103},
        {from: 102, to: 104},
        {from: 102, to: 105},
        {from: 103, to: 102},
        {from: 103, to: 101},
        {from: 103, to: 104},
        {from: 103, to: 105},
        {from: 104, to: 102},
        {from: 104, to: 103},
        {from: 104, to: 101},
        {from: 104, to: 105},
        {from: 105, to: 102},
        {from: 105, to: 103},
        {from: 105, to: 104},
        {from: 105, to: 101}
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
        
        <Graph graph={data1} style={{ position: 'absolute', width: 100 + '%', height: 100 + '%' }} />
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