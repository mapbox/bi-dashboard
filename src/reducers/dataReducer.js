//libraries for computing color and some light stats
import stats from "stats-lite";
import chroma from "chroma-js";

//Color palette
const colors = chroma
  .scale(["#0571b0", "#92c5de", "#f7f7f7", "#f4a582", "#ca0020"])
  .classes(5);

//Create state for this reducer = state.map...
export default function dataReducer(
  state = {
    loaded: false,
    stateSource: {},
    countySource: {},
    states: {},
    counties: {},
    stateTime: [],
    countyTime: [],
    histogram: [],
    stateTitle: "All States",
    countyTitle: "All Counties"
  },
  action
) {
  //Helper functions
  let generateTimeSeries = data => {
    let forYear = {
      "2008": [],
      "2009": [],
      "2010": [],
      "2011": [],
      "2012": [],
      "2013": [],
      "2014": [],
      "2015": []
    };
    // eslint-disable-next-line
    data.map((value, index) => {
      forYear[value.year].push(value.rate);
    });
    let timeSeries = Object.keys(forYear).map(value => {
      return { x: parseInt(value, 10), y: stats.median(forYear[value]) };
    });
    return timeSeries;
  };

  let generateHistogram = data => {
    let histogram = [];
    let preHist = data.map(value => {
      return value.rate;
    });
    let hist = stats.histogram(preHist, 20);
    for (let i = 1; i < hist.bins + 1; i++) {
      histogram.push({
        x: hist.binLimits[0] + hist.binWidth * i - hist.binWidth / 2,
        y: hist.values[i - 1]
      });
    }
    return histogram;
  };

  let generateColors = (data, year) => {
    let dataFilter = data.filter(date => date.year === year);
    let colorScale = dataFilter.map(value => {
      let toStyle = value.rate / 10;
      return [value.GEOID, colors(toStyle).css()];
    });
    let style = {
      property: "GEOID",
      stops: colorScale
    };
    return style;
  };
  //Reducer Functions
  //You see FULFILLED because AXIOS is using Promises. 
  //This app uses a middleware to detect Promise fulfillment, and append FULFILLED when complete
  //You'll see this in store.js
  switch (action.type) {
    case "STATE_DATA_FULFILLED": {
      state = {
        //Don't mutate state, create a copy and update
        ...state,
        states: generateColors(action.payload.data.states, "2015"),
        stateTime: generateTimeSeries(action.payload.data.states),
        stateSource: action.payload.data.states
      };
      break;
    }
    case "STATE_NEW_DATA_FULFILLED": {
      state = {
        ...state,
        states: generateColors(action.payload[0], action.payload[1].toString()),
      };
      break;
    }
    case "COUNTY_NEW_DATA_FULFILLED": {
      state = {
        ...state,
        counties: generateColors(action.payload[0], action.payload[1].toString()),
      };
      break;
    }
    case "COUNTY_DATA_FULFILLED": {
      state = {
        ...state,
        counties: generateColors(action.payload.data.counties, "2015"),
        countyTime: generateTimeSeries(action.payload.data.counties),
        countySource: action.payload.data.counties,
        loaded: true
      };
      break;
    }
    case "STATE_HIST_FULFILLED": {
      state = {
        ...state,
        histogram: generateHistogram(action.payload.data.states)
      };
      break;
    }
    case "COUNTY_HIST_FULFILLED": {
      state = {
        ...state,
        histogram: generateHistogram(action.payload.data.counties)
      };
      break;
    }
    case "SINGLE_STATE_DATA_FULFILLED": {
      state = {
        ...state,
        stateTime: generateTimeSeries(action.payload[0]),
        stateTitle: action.payload[1]
      };
      break;
    }
    case "SINGLE_COUNTY_DATA_FULFILLED": {
      state = {
        ...state,
        countyTime: generateTimeSeries(action.payload[0]),
        countyTitle: action.payload[1] + " County"
      };
      break;
    }
    default:
  }
  return state;
}
