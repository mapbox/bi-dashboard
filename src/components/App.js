import React, { Component } from "react";
import { connect } from "react-redux";
import Map from "./Map";
import * as actions from "../actions/actions";

function mapStateToProps(state) {
  return {
    states: state.data.states,
    counties: state.data.counties,
    loaded: state.data.loaded,
    zoom: state.map.zoom
  };
}

class App extends Component {
  //This is where your initial data comes from
  componentDidMount() {
    this.props.dispatch(actions.getCounties());
    this.props.dispatch(actions.getStates());
    this.props.dispatch(actions.getHistogram("state"));
  }

  render() {
    let app;
    //This is a loading interstitial in case data takes longer than normal to return
    if (!this.props.loaded) {
      app = (
        <img
          src="https://www.dropbox.com/s/2et51rjjh1nhdh0/spinner_210_white.gif?raw=1"
          alt="loading spinner"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            marginTop: "-50px",
            marginLeft: "-100px"
          }}
        />
      );
    } else {
      //This is the regular app interface
      app = (
        <div>
          <h1
            style={{
              position: "absolute",
              width: 650,
              padding: 5,
              top: 5,
              left: "28%",
              zIndex: 1,
              color: "black",
              backgroundColor: "#fff",
              opacity: 0.95,
              borderRadius: 5
            }}
          >
            {"U.S. Unemployment Rate by " +
              (this.props.zoom > 4.5 ? "County," : "State,") +
              " " +
              "2005"}
          </h1>
          <div
            style={{
              position:"absolute",
              display: "flex",
              zIndex: 1,
              width: 150,
              height: 10,
              left: "45%",
              top: 90,
              fontSize: 12,
              fontWeight: 300,
              justifyContent: "space-evenly"
            }}
          >
            <p>Lower</p>
            <p>Higher</p>
          </div>
          <div
            style={{
              position: "absolute",
              display: "flex",
              top: 80,
              width: 150,
              height: 20,
              zIndex: 1,
              left: "45%",
              backgroundColor: "white"
            }}
          >
            <div
              style={{
                width: "20%",
                height: "100%",
                backgroundColor: "rgb(5, 113, 176)",
                fontSize: 8,
                textAlign: "center",
                fontWeight: 300
              }}
            />
            <div
              style={{
                width: "20%",
                height: "100%",
                backgroundColor: "rgb(146, 197, 222)"
              }}
            />
            <div
              style={{
                width: "20%",
                height: "100%",
                backgroundColor: "rgb(247, 247, 247)"
              }}
            />
            <div
              style={{
                width: "20%",
                height: "100%",
                backgroundColor: "rgb(244, 165, 130)"
              }}
            />
            <div
              style={{
                width: "20%",
                height: "100%",
                backgroundColor: "rgb(202, 0, 32)"
              }}
            />
            </div>
          <Map
            token="INSERT YOUR TOKEN HERE"
            mapStyle="mapbox://styles/mapbox/light-v9"
            states={this.props.states}
            counties={this.props.counties}
          />
        </div>
      );
    }
    return <div>{app}</div>;
  }
}

export default connect(mapStateToProps)(App);
