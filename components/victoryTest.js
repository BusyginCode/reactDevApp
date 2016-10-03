import {
  VictoryAxis,
  VictoryArea,
  VictoryBar,
  VictoryChart,
  VictoryLine,
  VictoryPie,
  VictoryScatter
} from "victory";

export default class VictoryTest extends React.Component {

  getDate() {
    return parseInt((Math.random() * (2015 - 1980) + 1980), 10)
  }


  componentDidMount() {
    setInterval(() => {
      this.forceUpdate()
    }, 2000);
  }


  render() {
    const style = {
      parent: {border: "1px solid #ccc", margin: "2%"}
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
    return (
      <div className="demo">
        <h3>VictoryChart</h3>

        <p>Line chart of function <code>y = x^2</code></p>

        <VictoryChart style={style} domainPadding={{x: 30, y: 30}}>
          <VictoryAxis
            dependentAxis
            tickValues={[
              1980,
              2000,
              2020, 
            ]}
          />
          <VictoryAxis
            label="Decades"
            tickValues={[
              1980,
              2000,
              2020,
            ]}
          />

          <VictoryLine 
            style={{data:
              {stroke: "red", strokeWidth: 4}
            }} 
            animate={{}}
            data={data}
          />
          <VictoryScatter
            animate={{}}
            data={data}
          />
        </VictoryChart>

{

  // animate={{duration: 1000}}

        // <VictoryChart style={style}
        //   domainPadding={{x: 30, y: 30}}
        //   height={600}
        //   width={600}
        //   events={[{
        //     childName: "bar",
        //     target: "data",
        //     eventHandlers: {
        //       onClick: () => {
        //         return [
        //           {
        //             target: "labels",
        //             mutation: () => {
        //               return {text: "o shit"};
        //             }
        //           }, {
        //             childName: "line",
        //             target: "data",
        //             mutation: () => {
        //               return {style: {stroke: "lime"}};
        //             }
        //           }, {
        //             childName: "line",
        //             target: "labels",
        //             mutation: () => {
        //               return {
        //                 style: {fill: "green"},
        //                 text: "waddup"
        //               };
        //             }
        //           }
        //         ];
        //       }
        //     }
        //   }]}
        // >
      

        //   <VictoryBar name="bar"
        //     style={{data: {width: 15, fill: "green"}}}
        //     data={[
        //       {x: 1, y: 1},
        //       {x: 2, y: 2},
        //       {x: 3, y: 3},
        //       {x: 4, y: 2},
        //       {x: 5, y: 1},
        //       {x: 6, y: 2},
        //       {x: 7, y: 3},
        //       {x: 8, y: 2},
        //       {x: 9, y: 1},
        //       {x: 10, y: 2},
        //       {x: 11, y: 3},
        //       {x: 12, y: 2},
        //       {x: 13, y: 1}
        //     ]}
        //   />
        //   <VictoryLine name="line"
        //     y={() => 0.5}
        //     style={{data: {stroke: "blue", strokeWidth: 5}}}
        //     label="LINE"
        //   />
        // </VictoryChart>

        // <h3>VictoryChart</h3>
        // <p>Custom axes and tickformats; Bar + line chart</p>
        // <VictoryChart style={style} domainPadding={{x: 30, y: 30}}>
        //   <VictoryAxis
        //     tickValues={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]}
        //     tickFormat={(x) => `${x}\ntick`}
        //     style={{
        //       axis: {stroke: "black", strokeWidth: 2},
        //       ticks: {stroke: "transparent"},
        //       tickLabels: {fill: "black"}
        //     }}
        //   />
        //   <VictoryAxis label="y axis" dependentAxis
        //     tickValues={[0, 1.5, 3, 4.5]}
        //     style={{
        //       grid: {strokeWidth: 1},
        //       axis: {stroke: "transparent"},
        //       ticks: {stroke: "transparent", padding: 15}
        //     }}
        //   />
        //   <VictoryBar style={{data: {width: 15, fill: "orange"}}}
        //     data={[
        //       {x: 1, y: 1},
        //       {x: 2, y: 2},
        //       {x: 3, y: 3},
        //       {x: 4, y: 2},
        //       {x: 5, y: 1},
        //       {x: 6, y: 2},
        //       {x: 7, y: 3},
        //       {x: 8, y: 2},
        //       {x: 9, y: 1},
        //       {x: 10, y: 2},
        //       {x: 11, y: 3},
        //       {x: 12, y: 2},
        //       {x: 13, y: 1}
        //     ]}
        //   />
        //   <VictoryLine y={() => 0.5}
        //     style={{data: {stroke: "gold", strokeWidth: 3}}}
        //     label="LINE"
        //   />
         //</VictoryChart>

        // <h2>Primitives</h2>

        // <h3>VictoryAxis</h3>
        // <p>Default props</p>
        // <VictoryAxis style={style}/>

        // <h3>VictoryBar</h3>
        // <p>Default props</p>
        // <VictoryBar style={style}/>

        // <h3>VictoryLine</h3>
        // <p>Default props</p>
        // <VictoryLine style={style}/>

        // <h3>VictoryScatter</h3>
        // <p>Default props</p>
        // <VictoryScatter style={style}/>

        //   <h3>VictoryArea</h3>
        //   <p>Default props</p>
        //   <VictoryArea style={style}/>
        }
      </div>
    );
  }
}