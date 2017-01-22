import React, { Component } from 'react';
import moment from 'moment-timezone';
import { times } from 'lodash';

import './App.css';

const myPlaces = [
  {
    name: 'India',
    zone: 'Asia/Calcutta',
  },
  {
    name: 'Boston',
    zone: 'America/New_York',
  },
  {
    name: 'South Dakota',
    zone: 'America/Chicago',
  },
  {
    name: 'Seattle',
    zone: 'America/Los_Angeles',
  },
];

const roundTo = (number, rounding) => (
  Math.round(number/rounding) * rounding
);

const Place = ({name, zone, timestamp}) => {
  const m = moment.tz(timestamp, zone);
  const printedTime = m.format('h:mm A ddd');

  return (
    <div className="Place">
      <div className="name">{name}</div>
      <div className="time">{printedTime}</div>
    </div>
  );
};

const PlaceList = ({places, timestamp}) => (
  <div className="PlaceList">
    {
      places.map(place =>
        <Place {...place} timestamp={timestamp} key={place.name}/>
      )
    }
  </div>
);

const PlaceTimeline = ({ initialTimestamp, zone }) => {
  const m = moment.tz(initialTimestamp, zone);
  const hourOffset = m.hours();
  const fractionalOffset = m.minutes()/60;
  console.log(m.format('HH:mm'), hourOffset);
  return (
    <div className="PlaceTimeline">
      <svg width="100%" height="20" viewBox="0 0 171.36 1" preserveAspectRatio="none">
        {
          times(24 * 8,
            index => <TimelineHour index={index} hourOffset={hourOffset} fractionalOffset={fractionalOffset} key={index}/>
          )
        }
      </svg>
    </div>
  );
};

const TimelineHour = ({ index, hourOffset, fractionalOffset }) => {
  const xPosition = index - fractionalOffset - 20/60; // correction factor to translate to center of screen
  const hour = Math.round(index + fractionalOffset + hourOffset + 10 - 20/60) % 24;
  return <g>
    <rect width="0.98" height="1" x={xPosition} fill="lightblue"/>
    <text x={xPosition} y={0.5} fontSize="0.4">{hour}</text>
  </g>;
};

class Slider extends Component {
  shouldComponentUpdate(nextProps){
    return nextProps.places.length !== this.props.places.length;
  }
  render() {
    const { places, initialTimestamp } = this.props;
    return (
      <div>
        <div className="Slider">
          <div className="spanner"/>
          {
            places.map(
              place => (
                <PlaceTimeline {...place} initialTimestamp={initialTimestamp} key={place.name}/>
              )
            )
          }
        </div>
      </div>
    );
  }
}

class App extends Component {
  constructor(){
    super();
    this.initialTimestamp = Date.now();
  }
  centerView(){
    setTimeout(() => {
      window.scroll(document.body.clientWidth * 25, 0);
    }, 0);
  }
  componentDidMount(){
    this.sliderElement = document.getElementsByClassName('Slider')[0];
    this.centerView();

    this._intervalId = setInterval(() => {
      this.forceUpdate();
    }, 16);
  }

  getX() {
    // x ranges from 0 to 1
    if (this.sliderElement) {
      return window.scrollX / (this.sliderElement.clientWidth - document.body.clientWidth);
    } else {
      return 1;
    }
  }
  getTimestamp() {
    return roundTo(
      this.initialTimestamp + (this.getX() - 0.5) * 7 * 24 * 60 * 60 * 1000, // span 1 week (3.5 days on each side)
      1 * 60 * 1000 // round to 5 minute increments
    );
  }
  render() {
    return (
      <div className="App">
        <Slider places={myPlaces} initialTimestamp={this.initialTimestamp}/>
        <PlaceList places={myPlaces} timestamp={this.getTimestamp()}/>
      </div>
    );
  }
}

export default App;
