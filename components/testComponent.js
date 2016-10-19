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
import calculator from '../utils/calculator'

export default class TestComponent extends React.Component {

  constructor() {
    super()
    this.state = {
      text: 'Old text',
      hColor: 'white',
      
    }
    calculator()
    console.log(window)
  }

  calculate = () => {
    let insertFormData = {
      charts:1,
      deadlineHrs:168,
      deadlinePricePerPage:17,
      discountPercent:95,
      getProgressiveDeliveryOn:0,
      getSamplesOn:true,
      getUsedSourcesOn:false,
      pages:3,
      slides:1,
      spacing:"double",
      winbackCoupons:[],
      writerCategoryId:2,
      writerPercent:0,
    }
    let insertAdditionalData = {
      charts:1,
      deadlineHrs:168,
      deadlinePricePerPage:17,
      getProgressiveDeliveryOn:0,
      getSamplesOn:true,
      getUsedSourcesOn:false,
      pages:3,
      slides:1,
      writerPercent:0,
    }
    console.log(window.UVOCostCalculator(insertFormData, insertAdditionalData))
  }

  render() {
   
    return (
      <div>
        <h1 className="hello">Graph</h1>
        <button onClick={this.calculate}>Calculate</button>
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