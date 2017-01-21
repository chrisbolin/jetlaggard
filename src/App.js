import React, { Component } from 'react';
import moment from 'moment-timezone';
import './App.css';

const places = [
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

const Slider = () => (
  <div className="Slider">
    <div className="core"/>
  </div>
);

class App extends Component {
  constructor(){
    super();
    this.initialTimestamp = Date.now();
  }
  componentDidMount(){
    this.sliderElement = document.getElementsByClassName('Slider')[0];

    // correct to center
    setTimeout(() => {
      window.scroll(document.body.clientWidth * 12.5, 0);
    }, 0);

    this._intervalId = setInterval(() => {
      this.forceUpdate();
    }, 16);
  }

  getX() {
    // x ranges from 0 to 1
    if (this.sliderElement) {
      return 2 * window.scrollX / (this.sliderElement.clientWidth - document.body.clientWidth);
    } else {
      return 0.5;
    }
  }
  getTimestamp() {
    return roundTo(
      this.initialTimestamp + (this.getX() - 0.5) * 7 * 24 * 60 * 60 * 1000,
      15 * 60 * 1000
    );
  }
  render() {
    return (
      <div className="App">
        <PlaceList places={places} timestamp={this.getTimestamp()}/>
        <Slider placers={places}/>
      </div>
    );
  }
}

export default App;
