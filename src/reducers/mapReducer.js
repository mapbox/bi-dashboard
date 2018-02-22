export default function mapReducer(
  state = {
    lng: -96.58843185620441,
    lat: 39.24200106637491,
    zoom: 3
  },
  action
) {
  switch (action.type) {
    case "POSITION_CHANGE": {
      state = {
        ...state,
        zoom: action.payload.zoom
      };
      break;
    }
    default:
  }
  return state;
}
