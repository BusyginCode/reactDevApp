import {default as React, Component} from 'react';
const vis = require('vis');
const uuid = require('uuid');

class Graph extends Component {
  constructor(props) {
    super(props);
    const {identifier} = this.props;
    this.updateGraph = this.updateGraph.bind(this);
    this.state = {
      hierarchicalLayout: true,
      identifier : identifier ? identifier : uuid.v4()
    };
  }

  componentDidMount() {
    this.updateGraph();
  }

  componentDidUpdate() {
    this.updateGraph();
  }

  changeMode(event) {
    this.setState({hierarchicalLayout: !this.state.hierarchicalLayout});
    this.updateGraph();
  }

  updateGraph() {
    let container = document.getElementById(this.state.identifier);
    var options = {
      nodes:{
        borderWidth: 1,
        borderWidthSelected: 2,
        brokenImage:undefined,
        color: {
          border: '#2B7CE9',
          background: '#97C2FC',
          highlight: {
            border: '#2B7CE9',
            background: '#D2E5FF'
          },
          hover: {
            border: '#2B7CE9',
            background: '#D2E5FF'
          }
        },
        fixed: {
          x:false,
          y:false
        },
        font: {
          color: '#343434',
          size: 14, // px
          face: 'arial',
          background: 'none',
          strokeWidth: 0, // px
          strokeColor: '#ffffff',
          align: 'center'
        },
        group: undefined,
        hidden: false,
        icon: {
          face: 'FontAwesome',
          code: undefined,
          size: 50,  //50,
          color:'#2B7CE9'
        },
        image: undefined,
        label: undefined,
        labelHighlightBold: true,
        level: undefined,
        mass: 1,
        physics: true,
        scaling: {
          min: 10,
          max: 30,
          label: {
            enabled: false,
            min: 14,
            max: 30,
            maxVisible: 30,
            drawThreshold: 5
          },
          customScalingFunction: function (min,max,total,value) {
            if (max === min) {
              return 0.5;
            }
            else {
              let scale = 1 / (max - min);
              return Math.max(0,(value - min)*scale);
            }
          }
        },
        shadow:{
          enabled: false,
          color: 'rgba(0,0,0,0.5)',
          size:10,
          x:5,
          y:5
        },
        shape: 'ellipse',
        shapeProperties: {
          borderDashes: false, // only for borders
          borderRadius: 6,     // only for box shape
          interpolation: false,  // only for image and circularImage shapes
          useImageSize: false,  // only for image and circularImage shapes
          useBorderWithImage: false  // only for image shape
        },
        size: 25,
        title: undefined,
        value: undefined,
        x: undefined,
        y: undefined
      }
    }

    if (this.state.hierarchicalLayout) {
      options.hierarchicalLayout = {
        enabled: true,
        direction: 'UD',
        levelSeparation: 500,
        nodeSpacing: 10
      };
    } else {
      options.hierarchicalLayout = {
        enabled: false
      };
    }

    new vis.Network(container, this.props.graph, options);
  }

  render() {
    const {identifier} = this.state;
    const { style } = this.props
    return React.createElement('div', {onDoubleClick: this.changeMode.bind(this), id: identifier, style}, identifier);
  }
}

Graph.defaultProps = {
  graph: {},
  style: {width: '640px', height: '480px'}
};

export default Graph;
