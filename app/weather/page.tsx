"use client";

import {useState, useEffect} from 'react';

export default function WeatherPage() {

    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchWeather = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/open-weather', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ city })
            });
            const data = await res.json();
            if (res.ok) {
                setWeather(data.weather);
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('Failed to fetch weather data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Weather Information</h1>
        <input
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{padding: '8px', marginRight: '8px'}}
        />
        <button onClick={fetchWeather} disabled={loading}>
            {loading ? 'Loading...' : 'Get Weather'}
        </button>
        {error && <p style={{color: 'red'}}>{error}</p>}
        {weather && (
            <div>
                <h2>Weather in {weather.name}</h2>
                <p>Temperature: {weather.main.temp}°C</p>
                <p>Condition: {weather.weather[0].description}</p>
            </div>
        )}
    </div>
);
}