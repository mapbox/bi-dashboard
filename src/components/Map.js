import React from "react";
//Mapbox
import mapboxgl from "mapbox-gl";
//Redux
import { connect } from "react-redux";
import * as actions from "../actions/actions";
//Charts as single component
import Graph from "./Graph";

//Connect to state tree
function mapStateToProps(state) {
  return {
    lng: state.map.lng,
    lat: state.map.lat,
    zoom: state.map.zoom,
    stateColor: state.data.states,
    countyColor: state.data.counties
  };
}

class Map extends React.Component {
  map;
  //Our function do fill colors on the map
  setFill = (layer, colors) => {
    const { property, stops } = colors;
    this.map.setPaintProperty(layer, "fill-color", {
      property,
      stops,
      type: "categorical",
      default: "rgba(0, 0, 0, 0)"
    });
  };

  constructor(props) {
    super(props);
    //Set your Access Token in App.js
    mapboxgl.accessToken = this.props.token;
  }

  componentDidMount() {
    //Build a map, using default state set in mapReducer.js.
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: this.props.mapStyle,
      center: [this.props.lng, this.props.lat],
      zoom: this.props.zoom,
      minZoom: 3,
      maxZoom: 6
    });

    //Triggered when map style loads
    this.map.on("load", () => {
      //Add Data
      this.map.addSource("states", {
        type: "vector",
        url: "mapbox://christoomey.6t4zi80h"
      });

      this.map.addSource("counties", {
        type: "vector",
        url: "mapbox://christoomey.71kd3rfd"
      });

      //Add and Style a layer
      this.map.addLayer(
        {
          id: "states",
          type: "fill",
          source: "states",
          minzoom: 3,
          maxzoom: 5,
          "source-layer": "States-ctyzdc",
          paint: {
            "fill-outline-color": "#bbb",
            "fill-opacity": {
              base: 1,
              stops: [[3, 1], [4, 1], [5, 0]]
            }
          }
        },
        //Place viz layer underneath the last set of labels
        "waterway-label"
      );

      this.map.addLayer(
        {
          id: "counties",
          type: "fill",
          source: "counties",
          minzoom: 4,
          maxzoom: 7,
          "source-layer": "County-9ymcwp",
          paint: {
            "fill-outline-color": "#bbb",
            "fill-opacity": {
              base: 1,
              stops: [[4, 0], [4.5, 0.5], [5, 1], [6, 1]]
            }
          }
        },
        //Place viz layer underneath the previous one. 
        //This avoids click errors when the state layer is still visible
        "states"
      );
      this.setFill("states", this.props.stateColor);
      this.setFill("counties", this.props.countyColor);
    });

    //Click handler for state layer
    this.map.on("click", "states", e => {
      let geoid = e.features[0].properties.GEOID;
      let name = e.features[0].properties.NAME;
      //Dispatch Redux Action
      this.props.dispatch(actions.getSingleState(geoid, name));
    });

    //Click handler for county layer
    this.map.on("click", "counties", e => {
      let geoid = e.features[0].properties.GEOID;
      let name = e.features[0].properties.NAME;
      //Dispatch Redux Action
      this.props.dispatch(actions.getSingleCounty(geoid, name));
    });

    //Move handler
    this.map.on('move', () => {
      //Dispatch Redux Action
      this.props.dispatch(actions.mapMove(this.map.getZoom()));
    })

    //Move-end handler
    this.map.on('moveend', () => {
      //Dispatch Redux Action
      (this.props.zoom > 4.5 ? this.props.dispatch(actions.getHistogram('county')) : this.props.dispatch(actions.getHistogram('state')))
    })
  }

  //When new props come in, repaint
  componentWillReceiveProps(nextProps) {
    this.setFill("states", this.props.stateColor);
    this.setFill("counties", this.props.countyColor);
  }

  //Inline styled layout with relative sizing, based on viewport
  render() {
    return (
      <div style={{ display: "flex" }}>
        <div style={{ width: "25vw" }}>
          <Graph />
        </div>
        <div
          ref={el => (this.mapContainer = el)}
          style={{ height: "100vh", width: "75vw" }}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps)(Map);
