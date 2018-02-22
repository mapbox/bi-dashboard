//This is how we get data from remote sources (AJAX/XHR with Promises)
import axios from "axios";

const stateURL =
  "https://dl.dropboxusercontent.com/s/7f6oknwjs7w2sx7/stateUnemployment.json?dl=0";
const countyURL =
  "https://dl.dropboxusercontent.com/s/gl6rl209cgl3xrd/countyUnemployment.json?dl=0";

export function mapMove(zoom) {
  return {
    type: "POSITION_CHANGE",
    payload: {
      zoom: zoom
    }
  };
}

export function getStates() {
  return {
    type: "STATE_DATA",
    payload: axios.get(stateURL)
  };
}

export function getNewStates(year) {
  return {
    type: "STATE_NEW_DATA",
    payload: axios.get(stateURL).then(response => {
      return [response.data.states, year];
    })
  };
}

export function getSingleState(geoid, state) {
  return {
    type: "SINGLE_STATE_DATA",
    payload: axios.get(stateURL).then(response => {
      return [response.data.states.filter(item => item.GEOID === geoid), state];
    })
  };
}

export function getCounties() {
  return {
    type: "COUNTY_DATA",
    payload: axios.get(countyURL)
  };
}

export function getNewCounties(year) {
  return {
    type: "COUNTY_NEW_DATA",
    payload: axios.get(countyURL).then(response => {
      return [response.data.counties, year];
    })
  };
}

export function getSingleCounty(geoid, county) {
  return {
    type: "SINGLE_COUNTY_DATA",
    payload: axios.get(countyURL).then(response => {
      return [
        response.data.counties.filter(item => item.GEOID === geoid),
        county
      ];
    })
  };
}

export function getHistogram(value) {
  if (value === "state") {
    return {
      type: "STATE_HIST",
      payload: axios.get(
        stateURL
      )
    };
  } else {
    return {
      type: "COUNTY_HIST",
      payload: axios.get(
        countyURL
      )
    };
  }
}
