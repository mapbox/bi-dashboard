import React, { Component } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import {
  VictoryChart,
  VictoryArea,
  VictoryLine,
  VictoryTheme,
  VictoryAxis,
  VictoryLabel,
  VictoryBrushContainer
} from "victory";
import { connect } from "react-redux";
import * as actions from "../actions/actions";

function mapStateToProps(state) {
  return {
    states: state.data.stateTime,
    counties: state.data.countyTime,
    histogram: state.data.histogram,
    stateTitle: state.data.stateTitle,
    countyTitle: state.data.countyTitle,
    zoom: state.map.zoom
  };
}

class Graph extends Component {
  state = {
    domain: { x: [2014, 2015] }
  };

  render() {
    return (
      <div style={{ height: "90vh", padding: 10 }}>
        <div style={{ display: "flex" }}>
          <div style={{ paddingLeft: 5, paddingTop: 8, fontWeight: 300 }}>
            <VictoryLabel text="Unemployment Distribution" />
          </div>
        </div>
        <VictoryChart
          theme={VictoryTheme.material}
          domainPadding={10}
          style={{
            labels: { fontSize: 12 },
            parent: {
              height: "45%",
              padding: 0,
              borderBottom: "1px solid #ccc"
            }
          }}
          animate={{
            duration: 1000,
            onLoad: { duration: 1000 }
          }}
        >
          <VictoryAxis
            tickFormat={t => `${Math.round(t)}%`}
            style={{
              tickLabels: { fontSize: 12, padding: 5, fontWeight: 300 }
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              tickLabels: { fontSize: 12, padding: 5, fontWeight: 300 }
            }}
          />
          <VictoryArea
            data={this.props.histogram}
            interpolation="natural"
            style={{ data: { fill: "black", opacity: 0.5 } }}
          />
        </VictoryChart>
        <div style={{ paddingLeft: 5, paddingTop: 8, fontWeight: 300 }}>
          <VictoryLabel text="Unemployment Time Series" />
        </div>
        <VictoryChart
          theme={VictoryTheme.material}
          containerComponent={
            <VictoryBrushContainer
              brushDimension="x"
              brushDomain={this.state.domain}
              allowResize={false}
              allowDrag={false}
            />
          }
          domainPadding={10}
          style={{
            labels: { fontSize: 12 },
            parent: { height: "45%", padding: 0 }
          }}
          animate={{
            duration: 1000,
            onLoad: { duration: 1000 }
          }}
        >
          <VictoryAxis
            tickFormat={t => t}
            style={{
              tickLabels: { fontSize: 12, padding: 5, fontWeight: 300 }
            }}
          />
          <VictoryAxis
            tickFormat={t => `${Math.round(t)}%`}
            dependentAxis
            style={{
              tickLabels: { fontSize: 12, padding: 5, fontWeight: 300 }
            }}
          />
          <VictoryLine
            data={this.props.states}
            interpolation="natural"
            style={{ data: { stroke: "#c43a31" } }}
          />
          <VictoryLine
            data={this.props.counties}
            interpolation="natural"
            style={{ data: { stroke: "#c4d" } }}
          />
        </VictoryChart>
        <div style={{ width: "65%", paddingLeft: "15%" }}>
          <Slider
            marks={{
              2009: "2009",
              2015: "2015"
            }}
            trackStyle={{ backgroundColor: "blue" }}
            min={2009}
            max={2015}
            included={false}
            step={1}
            onChange={e => {
              this.props.dispatch(actions.getNewCounties(e));
              this.props.dispatch(actions.getNewStates(e));
              this.setState({ domain: { x: [e - 1, e] } });
            }}
            defaultValue={2015}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            paddingTop: 20,
            paddingBottom: 0,
            margin: 0
          }}
        >
          <div style={{ fontWeight: 300 }}>
            {
              <VictoryLabel
                text={this.props.stateTitle}
                style={{ color: "#c43a31" }}
              />
            }
          </div>
          <div style={{ fontWeight: 300 }}>vs</div>
          <div style={{ fontWeight: 300 }}>
            <VictoryLabel
              text={this.props.countyTitle}
              style={{ color: "#c4d" }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Graph);
