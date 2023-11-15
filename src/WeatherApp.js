import React, { useState, useEffect } from 'react';
import axios from 'axios';
import weathericon from "../src/screens/HomeColor/img/WeatherIcon - 2-40.svg";
import wind from "../src/screens/HomeColor/img/wind-con.svg";
import hum from "../src/screens/HomeColor/img/hum.svg";
import rain from "../src/screens/HomeColor/img/rain.svg";
import sky from "../src/screens/HomeColor/img/sky.svg";
import map from "../src/screens/HomeColor/img/map.svg";
import search from "../src/screens/HomeColor/img/search.svg";
import clock from "../src/screens/HomeColor/img/clock.svg";
import frame from '../src/screens/HomeColor/img/Frame.svg'
import "../src/screens/HomeColor/style.css";

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [currentDate, setCurrentDate] = useState(null);
  const [windSpeed, setWindSpeed] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [rainValue, setRainValue] = useState(0);
  const [nextDays, setNextDays] = useState([]);
  const [isCelsius, setIsCelsius] = useState(true);
  const [sunrise, setSunrise] = useState('');
  const [sunset, setSunset] = useState('');
  const [goldenHour, setGoldenHour] = useState('');

  const API_KEY = '014b081fb933a0cfb108f54c9d6bace9';

  useEffect(() => {
    getCurrentDate().then((date) => setCurrentDate(date));
  });

  const getCurrentDate = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
      );
      const currentDate = new Date(response.data.dt * 1000);
      const daysOfWeek = ['Sund', 'Mond', 'Tues', 'Wedn', 'Thurs', 'Fri', 'Satur'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
      const dayOfWeek = daysOfWeek[currentDate.getDay()];
      const day = currentDate.getDate();
      const month = months[currentDate.getMonth()];
      const year = currentDate.getFullYear();
      const time = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true, hourCycle: 'h12' });
      const nextDays = daysOfWeek.slice(currentDate.getDay() + 1, currentDate.getDay() + 5).concat(daysOfWeek[0]);
      setNextDays(nextDays.map((day, index) => ({
        dayOfWeek: day,
        temp: weatherData && weatherData.main ? weatherData.main.temp : null
      })));

      const sunrise = new Date(response.data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true, hourCycle: 'h12' });
      const sunset = new Date(response.data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true, hourCycle: 'h12' });
      const goldenHour = new Date(response.data.sys.sunset * 1000 - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true, hourCycle: 'h12' });

      setSunrise(sunrise);
      setSunset(sunset);
      setGoldenHour(goldenHour);

      return {
        dayOfWeek,
        day,
        month,
        year,
        time
      };
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
      );
      setWeatherData(response.data);
      const date = await getCurrentDate();
      setCurrentDate(date);
      setWindSpeed(response.data.wind.speed);
      setHumidity(response.data.main.humidity);
      setRainValue(response.data.rain ? response.data.rain['1h'] : 0);
    } catch (error) {
    }
  };

  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
  };

  const kelvinToCelsius = (kelvin) => {
    return (kelvin - 273.15).toFixed(0);
  };

  const kelvinToFahrenheit = (kelvin) => {
    return ((kelvin - 273.15) * 9 / 5 + 32).toFixed(0);
  };

  return (
    <div className='body'>
      <div className="bg-color">
        <div className="container">
          <div className='header'>
            <img className="weathericon" src={weathericon} alt="" />
            <p className='gradus'>
              <button className={`far font ${isCelsius ? 'active temp_color' : ''}`} onClick={toggleTemperatureUnit}>C</button>
              <button className={`cel font ${!isCelsius ? 'active temp_color' : ''}`} onClick={toggleTemperatureUnit}>F</button>
            </p>
          </div>
          {weatherData && weatherData.main && currentDate && (
            <div>
              <div className='temp2'>
                <p className='temp'>{isCelsius ? kelvinToCelsius(weatherData.main.temp) : kelvinToFahrenheit(weatherData.main.temp)}</p>
                <span className='celsia'>{isCelsius ? '° C' : '° F'}</span>
              </div>
              <div className='date'>
                <p>{currentDate.day} th {currentDate.month} {currentDate.year - 2000}</p>
                <p>{currentDate.dayOfWeek} | {currentDate.time}</p>
              </div>
              <div className='weather_components'>
                <div className='weather_1'>
                  <img className="wind" src={wind} alt="" />
                  <p className='wind_p font'>Wind {windSpeed} km/h |</p>
                </div>
                <div className='weather_2'>
                  <img className="wind" src={hum} alt="" />
                  <p className='wind_p font'> Hum {humidity}% |</p>
                </div>
                <div className='weather_3'>
                  <img className="wind" src={rain} alt="" />
                  <p className='wind_p font'> Rain {rainValue} % </p>
                </div>
              </div>
              <div className='cards'>
                {nextDays.map((day, index) => (
                  <div className={`card_${index + 1}`} key={index}>
                                        <p className='wind_p font'>{day.temp ? `${isCelsius ? kelvinToCelsius(day.temp) : kelvinToFahrenheit(day.temp)} ${isCelsius ? '°C' : '°F'}` : ''} </p>
                    <img className='sky' src={sky} alt="" />
                    <p className='nextday font'>{day.dayOfWeek}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className='footer'>
          <div className='footer_header'>
            <form onSubmit={handleSubmit} className='form'>
              <div className='search-form'>
                <img className='map' src={map} alt="" />
                <input
                  className='search_inp'
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Введите название города"
                />
              </div>
              <button type="submit" className='search_btn'><img className='search' src={search} alt="" /></button>
            </form>
          </div>
          <div className='footer_section'>
            <div className='time_items'>
              <div className='times sun'>
                <p className='times_sun font'>Sunrise</p>
                <div className='time_item-1'>
                  <img className='clock' src={clock} alt="" />
                  <p className='times_sun font'>{sunrise}</p>
                </div>
              </div>
              <div className='times'>
                <p className='times_sun font'>Golden Hour</p>
                <div className='time_item-2'>
                  <img className='clock' src={clock} alt="" />
                  <p className='times_sun font'>{goldenHour}</p>
                </div>
              </div>
              <div className='times sun'>
                <p className='times_sun font'>Sunset</p>
                <div className='time_item-3'>
                  <img className='clock' src={clock} alt="" />
                  <p className='times_sun font'>{sunset}</p>
                </div>
              </div>
            </div>
            <div className='polosa'>
              <div className='hr'>
                <hr></hr>
                <em className='font em'>i</em>
              </div>
            </div>
            <div className='footer_footer'>
              <div className='frame_1'>
                <p className='font air'>Air Quality</p>
                <img className='frame_img' src={frame} alt="" />
                <p className='frame_p font'>3/5</p>
                <p className='frame_p2 font'>Moderate</p>
              </div>
              <div className='frame_2'>
                <p className='font air'>UV Index</p>
                <img className='frame_img' src={frame} alt="" />
                <p className='frame_p font'>6/10</p>
                <p className='frame_p2 font'>High</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;