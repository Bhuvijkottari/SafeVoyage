import React, { useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function RouteFinderPage() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [routeCoords, setRouteCoords] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [routeInfo, setRouteInfo] = useState({ distance: null, duration: null });

  async function handleSearch(e) {
    e.preventDefault();
    if (!source || !destination) return alert("Please enter both locations");
    try {
      // 1️⃣ Nominatim geocode
      const [srcRes, destRes] = await Promise.all([
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(source)}`).then(res => res.json()),
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}`).then(res => res.json())
      ]);
      if (!srcRes.length || !destRes.length) {
        return alert("Could not find one of the locations.");
      }
      const src = [parseFloat(srcRes[0].lat), parseFloat(srcRes[0].lon)];
      const dest = [parseFloat(destRes[0].lat), parseFloat(destRes[0].lon)];
      setMarkers([src, dest]);
      // 2️⃣ OSRM route
      const routeRes = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${src[1]},${src[0]};${dest[1]},${dest[0]}?overview=full&geometries=geojson`
      );
      const data = await routeRes.json();
      if (data.routes.length > 0) {
        const coords = data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]);
        setRouteCoords(coords);

        // Extract distance/duration (in meters, seconds)
        const { distance, duration } = data.routes[0];
        setRouteInfo({ distance, duration });
      } else {
        alert("No route found.");
        setRouteCoords([]); setRouteInfo({ distance: null, duration: null });
      }
    } catch (error) {
      console.error(error);
      alert("Error fetching route.");
      setRouteCoords([]); setRouteInfo({ distance: null, duration: null });
    }
  }

  // Helper to format meters to km and seconds to h:m
  function formatInfo(distance, duration) {
    const km = (distance / 1000).toFixed(2) + " km";
    const hours = Math.floor(duration / 3600);
    const mins = Math.round((duration % 3600) / 60);
    const minsStr = mins > 0 ? `${mins} min` : "";
    const hoursStr = hours > 0 ? `${hours} hr` : "";
    return { 
      distStr: km, 
      durStr: (hoursStr && minsStr) ? `${hoursStr} ${minsStr}` : hoursStr || minsStr 
    };
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 flex flex-col items-center p-6 relative">
      {/* Glowing background blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-purple-700 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-blue-700 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      
      <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 text-5xl font-extrabold mb-6 text-center drop-shadow-[0_0_15px_rgba(168,85,247,0.7)]">
        🛣️ Find Your Route
      </h1>
      
      {/* Form */}
      <form onSubmit={handleSearch}
        className="backdrop-blur-xl bg-black/40 p-6 rounded-3xl border border-purple-500/30 shadow-lg flex flex-col gap-4 w-full max-w-lg"
      >
        <input type="text" placeholder="Enter starting point..."
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="p-4 rounded-xl text-white placeholder-gray-400 bg-black/60 border border-gray-700 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none"
        />
        <input type="text" placeholder="Enter destination..."
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="p-4 rounded-xl text-white placeholder-gray-400 bg-black/60 border border-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button type="submit"
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105 text-white p-4 rounded-2xl text-lg font-bold shadow-[0_0_15px_rgba(139,92,246,0.6)] hover:shadow-[0_0_25px_rgba(139,92,246,0.9)] transition-all duration-300"
        >
          Show Route 🚀
        </button>
      </form>
      
      {/* Row Layout: Info + Map */}
      <div className="mt-6 flex flex-col md:flex-row w-full max-w-5xl gap-6">
        
        {/* Info panel  */}
        <div className="w-full md:w-1/4 flex-shrink-0 bg-gradient-to-br from-black/70 via-black/80 to-gray-900/90 rounded-3xl border border-blue-600/20 p-6 shadow-xl flex flex-col justify-start gap-8 min-h-[200px] mb-4 md:mb-0">
          <h2 className="text-xl font-bold text-blue-200 mb-2 flex items-center gap-2">
            <span className="material-icons text-blue-400">info</span> Route Info
          </h2>
          {(routeInfo.distance && routeInfo.duration) ?
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="material-icons text-green-400">straighten</span>
                <span className="font-semibold text-lg text-white">Distance:</span>
                <span className="text-white text-lg">{formatInfo(routeInfo.distance, routeInfo.duration).distStr}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-icons text-yellow-300">schedule</span>
                <span className="font-semibold text-lg text-white">Duration:</span>
                <span className="text-white text-lg">{formatInfo(routeInfo.distance, routeInfo.duration).durStr}</span>
              </div>
            </div>
            : <div className="text-sm text-blue-400">Enter locations and search to view distance & time!</div>
          }
        </div>

        {/* Map */}
        <div className="w-full md:w-3/4 h-[500px] rounded-3xl overflow-hidden border border-purple-500/30 shadow-[0_0_20px_rgba(139,92,246,0.6)]">
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            style={{ height: "100%", width: "100%" }}
            className="rounded-3xl"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              subdomains="abcd"
            />
            {markers.map((pos, idx) => (
              <Marker
                key={idx}
                position={pos}
                icon={L.icon({
                  iconUrl: idx === 0
                    ? "https://cdn-icons-png.flaticon.com/512/684/684908.png"
                    : "https://cdn-icons-png.flaticon.com/512/684/684908.png",
                  iconSize: [32, 32],
                })}
              >
                <Popup>{idx === 0 ? "Start" : "Destination"}</Popup>
              </Marker>
            ))}
            {routeCoords.length > 0 && (
              <Polyline positions={routeCoords} color="lime" weight={5} opacity={0.7} />
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
