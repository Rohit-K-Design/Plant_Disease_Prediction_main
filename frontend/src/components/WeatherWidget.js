import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WeatherWidget.css';
import { WEATHER_API_KEY } from '../config';

function WeatherWidget() {
  const [location, setLocation] = useState('Bangalore');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [showForecast, setShowForecast] = useState(false);

  const fetchWeather = async (loc) => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        { params: { q: loc, appid: WEATHER_API_KEY, units: 'metric' } }
      );
      setWeather(res.data);
    } catch (err) {
      console.error('Weather fetch error:', err);
      setWeather(null);
    }
  };

  const fetchForecast = async (loc) => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast`,
        { params: { q: loc, appid: WEATHER_API_KEY, units: 'metric' } }
      );
      const dailyForecasts = res.data.list.filter(item =>
        item.dt_txt.includes('12:00:00')
      ).slice(0, 5); // Get the next 5 days at 12:00
      setForecast(dailyForecasts);
    } catch (err) {
      console.error('Forecast fetch error:', err);
      setForecast([]);
    }
  };

  useEffect(() => {
    fetchWeather(location);
    fetchForecast(location);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchWeather(location);
      fetchForecast(location);
    }
  };

  return (
    <div className="weather-widget">
      <input
        type="text"
        className="weather-input"
        value={location}
        onChange={e => setLocation(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter city and press Enter"
      />

      {weather && (
        <div className="weather-content">
          <div className="weather-item">
            <span className="icon">📍</span>
            <span className="value">{weather.name}</span>
          </div>
          <div className="weather-item">
            <span className="icon">🌡️</span>
            <span className="value">{Math.round(weather.main.temp)}°C</span>
          </div>
          <div className="weather-item">
            <span className="icon">💨</span>
            <span className="value">{weather.wind.speed} m/s</span>
          </div>
          <div className="weather-item">
            <span className="icon">🌧️</span>
            <span className="value">
              {weather.rain?.['1h'] ? `${weather.rain['1h']} mm` : '0 mm'}
            </span>
          </div>
        </div>
      )}

      <button
        className="btn btn-sm btn-outline-light mt-2"
        onClick={() => setShowForecast(!showForecast)}
      >
        {showForecast ? 'Hide' : 'Show'} 5-Day Forecast
      </button>

      {showForecast && forecast.length > 0 && (
        <div className="forecast-container mt-3">
          {forecast.map((day, idx) => (
            <div key={idx} className="forecast-day">
              <p><strong>{new Date(day.dt_txt).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })}</strong></p>
              <p>{day.main.temp}°C</p>
              <p>{day.weather[0].main}</p>
              <p>💨 {day.wind.speed} m/s</p>
              <p>🌧️ {day.rain?.['3h'] ? `${day.rain['3h']} mm` : '0 mm'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WeatherWidget;
