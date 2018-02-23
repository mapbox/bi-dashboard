![MapboxLogo](./mapbox-logo-color.png)

# Mapbox for Business Intelligence - Build your own dashboard

This React-based dashboard template was created for the [Mapbox Live session on building custom business intelligence tools](https://www.youtube.com/watch?time_continue=1&v=okUoOJkZmFw) and is a starting point for building your own dashboard or data visualization. You can use it to experiment with your own data, or fork it to create something new.

The app itself is bootstrapped with [Create React App](https://github.com/facebook/create-react-app). You do not need this installed for this demo to work, but you do need npm installed. You can either install this via `brew install node` or just follow [these instructions](https://docs.npmjs.com/getting-started/installing-node)

This repo is meant to be instructional, so it will not be accepting issues or feature-based PRs.

However, if you make something cool and want to share, please fork, update the README, and submit a PR. We want to see your work! 

---

## Getting started

Clone this repo and run `npm install` or `yarn install`. This will download all the dependencies. Once you have done that, you will need to open `src/components/App.js` and put in your Mapbox access token for the map to render. From there, you can run `npm start` or `yarn start` to begin development. This will create a development server running on `localhost:3000` and auto-launch the page in your browser. Any changes you make to the app will be hot-reloaded so you can work more effectively.

There is sample data referenced in the app. It is historical unemployment data, with shapes coming from the [U.S. Census](https://www.census.gov/geo/maps-data/data/tiger-cart-boundary.html). The dataset is a copy of the one found in the original Mapbox [Data Join example](https://www.mapbox.com/labs/dataset-join/).

All styling is done via `inline-styles`. This was chosen for simplicity, but you could easily swap these out for CSS, [styled-components](https://github.com/styled-components/styled-components), [emotion](https://github.com/emotion-js/emotion), or any other layout/styling method.

What's an `inline-style`? They look like this, and allow you to independently control the style attributes of individual elements. Great for development, but you might want somethign a little more repeatable for anything more advanced.

```jsx
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
/>Hello
</h1>
```

---

## Application Structure

This app is built using the following technologies.

* UI: [React](https://reactjs.org/)
* State Management: [Redux](https://reactjs.org/)
* Maps: [Mapbox GL](https://www.mapbox.com/mapbox-gl-js/api/) (_If you need a primer on Mapbox + React, check out this [blog](https://blog.mapbox.com/mapbox-gl-js-react-764da6cc074a)_)
* Charts: [Victory](http://formidable.com/open-source/victory/)
* Colors: [ChromaJS](https://gka.github.io/chroma.js/)
* Math: [stats-lite](https://github.com/brycebaril/node-stats-lite)
* XHR/AJAX: [axios](https://github.com/axios/axios)

The application is set up as follows:

```markdown
bi-dashboard
├── README.md -> What you are reading now
├── node_modules -> After npm install
├── package.json -> Dependencies
├── .gitignore -> What not to commit
├── public //The initial HTML page with React anchor
│   └── favicon.ico
│   └── index.html
│   └── manifest.json
└── src //The App
    └── actions
    │   └── actions.js -> Redux Actions > reducer > state
    └── components
    │   └── App.js -> The core app
    │   └── Graph.js -> The charts
    │   └── Map.js -> The map
    └── data
    │   └── countyUnemployment.csv
    │   └── countyUnemployment.json
    │   └── stateUnemployment.csv
    │   └── stateUnemployment.json
    ├── reducers -> actions into state
    │   └── dataReducer.js -> handling data requests
    │   └── index.js -> combining the reducers together
    │   └── mapReducer.js -> handling map actions
    ├── index.js -> Connection between code and HTML
    ├── index.css
    ├── registerServiceWorker.js
    ├── logo.svg
    └── store.js -> app state
```

---

## Quick Primer on React/Redux for this app

React typically specifies a `uni-directional dataflow` as a best practice. If you have to have state, it should be controlled and if necessary, pass that state down to other components to be rendered as props.

In a post-Tableau world, BI experts expect dashboard to have some sort of bi-directional interactivity. Touches, clicks, zooms, pans, and hovers can/should affect other parts of the app. To facilitate this, this app uses Redux. Redux creates a global store that any component can subscribe to. That state is converted into `props`, via `mapStateToProps`, and when props change, React will re-render the necessary components.

Any component can dispatch an action (defined in `src/actions/actions.js`), which can affect state. This action type is captured by a reducer (defined in `src/reducers`), which updates the state. The components that are subscribed to this portion of the state tree then update.

Example: The Map moves -> triggers a `POSITION_CHANGE` action. This passes through `mapReducer.js` and updates `state.map.zoom`. The App component subscribes to this part of the state tree as follows:

```jsx
function mapStateToProps(state) {
  return {
    states: state.data.states,
    counties: state.data.counties,
    loaded: state.data.loaded,
    zoom: state.map.zoom
  };
}
```

This turns `state.map.zoom` into `this.props.zoom`. This prop is used in the header to control the text as follows:

```jsx
{"U.S. Unemployment Rate by " + (this.props.zoom > 4.5 ? "County," : "State,") +" " +"2005"}
```

The same is true for map clicks, slider moves, and other zoom events. To learn more, please consult the Redux docs (linked above).

---

## Examples using this boilerplate

* [Mapbox Boilerplate Webinar Demo](https://www.mapbox.com/labs/busintel/)

## Need help?

Contact help@mapbox.com if you have any questions. A full set of Mapbox tutorials, documentation, and Help guides to further refine your dashboard are [available here](https://www.mapbox.com/help/).
