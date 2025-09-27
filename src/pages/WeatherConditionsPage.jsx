import React, { useEffect, useState } from "react";

export default function WeatherConditionsPage() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState("");

  const lat = 12.9141;
  const lon = 74.8560;
  const apiKey = "a7230003c1db746a62e32e186a0ee079";

  useEffect(() => {
    async function fetchWeather() {
      try {
        const wRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        );
        const wData = await wRes.json();
        if (!wData.weather) throw new Error();

        const fRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        );
        const fData = await fRes.json();
        setWeather(wData);
        setForecast(fData.list.slice(0, 8));
      } catch (e) {
        setError("Weather details cannot be fetched (API problem or key/quota issue).");
      }
    }
    fetchWeather();
  }, []);

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-950">
        <div className="p-8 rounded-2xl bg-gray-800/70 shadow-xl text-red-400 font-bold text-lg">
          {error}
        </div>
      </div>
    );
  if (!weather || !forecast)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-950">
        <div className="p-8 rounded-2xl bg-gray-800/70 shadow-xl text-blue-400 font-bold text-lg">
          Loading weather...
        </div>
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-950 text-gray-100 py-8 px-6 items-center space-y-16">
      {/* Main weather card */}
      <div className="bg-gray-800/90 rounded-3xl shadow-2xl border border-blue-900/40 p-10 flex items-center space-x-10 max-w-xl w-full">
        <img
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
          alt={weather.weather[0].description}
          className="w-32 h-32 drop-shadow-2xl animate-pulse"
        />
        <div>
          <h2 className="text-7xl font-extrabold text-blue-300 drop-shadow-lg animate-fade-in">
            {Math.round(weather.main.temp)}°C
          </h2>
          <p className="capitalize text-3xl font-semibold text-blue-400 mb-2 animate-fade-in-delay">
            {weather.weather[0].description}
          </p>
          <p className="text-xl text-gray-400">
            Feels like <span className="font-semibold">{Math.round(weather.main.feels_like)}°C</span>
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl w-full">
        {[
          { label: "Humidity", value: weather.main.humidity + "%", icon: "💧" },
          { label: "Wind Speed", value: weather.wind.speed + " m/s", icon: "🌬️" },
          { label: "Pressure", value: weather.main.pressure + " hPa", icon: "⚖️" },
          { label: "Visibility", value: (weather.visibility / 1000).toFixed(1) + " km", icon: "👀" },
        ].map(({ label, value, icon }) => (
          <div
            key={label}
            className="bg-gray-800/90 rounded-xl shadow-xl border border-blue-800/40 p-6 flex flex-col items-center justify-center text-center transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer"
          >
            <div className="text-yellow-400 text-4xl mb-2 animate-bounce">{icon}</div>
            <p className="text-sm text-blue-300">{label}</p>
            <p className="text-3xl font-bold text-blue-100">{value}</p>
          </div>
        ))}
      </div>

      {/* Forecast Scroll */}
      <div className="max-w-5xl w-full">
        <h3 className="text-2xl font-semibold mb-6 text-blue-400 tracking-wide uppercase">🌤 Next 24 Hours Forecast</h3>
        <div className="overflow-x-auto flex space-x-6 pb-6">
          {forecast.map((hr, idx) => (
            <div
              key={idx}
              className="bg-gray-800/90 rounded-xl p-6 flex flex-col items-center min-w-[90px] shadow-2xl border border-blue-900/20 cursor-pointer select-none hover:bg-blue-900/20 transition"
            >
              <p className="text-sm text-blue-400 mb-2 font-semibold">{new Date(hr.dt * 1000).getHours()}:00</p>
              <img
                src={`https://openweathermap.org/img/wn/${hr.weather[0].icon}@4x.png`}
                alt={hr.weather[0].description}
                className="w-16 h-16 mb-2 animate-pulse"
              />
              <p className="text-lg font-extrabold text-blue-200">{Math.round(hr.main.temp)}°C</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
