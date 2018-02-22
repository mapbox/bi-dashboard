import React from "react";
import mapboxgl from "mapbox-gl";
import { connect } from "react-redux";
import Graph from "./Graph";
import * as actions from "../actions/actions";

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
    mapboxgl.accessToken = this.props.token;
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: this.props.mapStyle,
      center: [this.props.lng, this.props.lat],
      zoom: this.props.zoom,
      minZoom: 3,
      maxZoom: 6
    });

    this.map.on("load", () => {
      this.map.addSource("states", {
        type: "vector",
        url: "mapbox://christoomey.6t4zi80h"
      });

      this.map.addSource("counties", {
        type: "vector",
        url: "mapbox://christoomey.71kd3rfd"
      });

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
        "states"
      );
      this.setFill("states", this.props.stateColor);
      this.setFill("counties", this.props.countyColor);
    });

    this.map.on("click", "states", e => {
      let geoid = e.features[0].properties.GEOID;
      let name = e.features[0].properties.NAME;
      this.props.dispatch(actions.getSingleState(geoid, name));
    });

    this.map.on("click", "counties", e => {
      let geoid = e.features[0].properties.GEOID;
      let name = e.features[0].properties.NAME;
      this.props.dispatch(actions.getSingleCounty(geoid, name));
    });

    this.map.on('move', () => {
      this.props.dispatch(actions.mapMove(this.map.getZoom()));
    })

    this.map.on('moveend', () => {
      (this.props.zoom > 4.5 ? this.props.dispatch(actions.getHistogram('county')) : this.props.dispatch(actions.getHistogram('state')))
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setFill("states", this.props.stateColor);
    this.setFill("counties", this.props.countyColor);
  }

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
