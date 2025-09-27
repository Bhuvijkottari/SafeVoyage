import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Analytics from "./Analytics";

// Sample data
const users = [
  { id: 1, name: "User A", route: { start: [20.5937, 78.9629], end: [19.076, 72.8777], coordinates: [[20.5937, 78.9629], [19.076, 72.8777]], distance: 120, time: 150 }, currentLocation: [20.5, 78.95] },
  { id: 2, name: "User B", route: { start: [21.1458, 79.0882], end: [22.5726, 88.3639], coordinates: [[21.1458, 79.0882], [22.5726, 88.3639]], distance: 1150, time: 1350 }, currentLocation: [21.5, 79.5] },
];

const geofences = [{ id: 1, name: "Danger Zone", center: [20.6, 78.96], radius: 50000 }];

export default function AuthorityDashboard() {
  const [allUsers, setAllUsers] = useState(users);
  const [cameraView, setCameraView] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const isInsideGeofence = (userLoc, fence) => L.latLng(userLoc).distanceTo(L.latLng(fence.center)) <= fence.radius;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 flex flex-col items-center p-6 relative">
      {/* View Camera Button */}
      <button
        onClick={() => setCameraView(true)}
        className="absolute top-6 left-6 bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-2xl font-bold shadow-lg z-50 flex items-center gap-2"
      >
        📹 View Camera
      </button>

      <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 text-5xl font-extrabold mb-6 text-center drop-shadow-[0_0_15px_rgba(168,85,247,0.7)]">
        🛡️ Authority Dashboard
      </h1>

      {/* Analytics */}
      <Analytics users={allUsers} geofences={geofences} />

      <div className="flex w-full max-w-6xl gap-6">
        {/* Sidebar */}
        <div className="w-1/3 bg-black/40 backdrop-blur-xl p-4 rounded-3xl border border-purple-500/30 flex flex-col gap-4 max-h-[600px] overflow-y-auto">
          <h2 className="text-xl font-bold text-white mb-2">Users & Routes</h2>
          {allUsers.map((user) => (
            <div
              key={user.id}
              className={`p-3 rounded-xl border ${
                geofences.some((g) => isInsideGeofence(user.currentLocation, g)) ? "border-red-500" : "border-green-500"
              }`}
            >
              <p className="text-white font-semibold">{user.name}</p>
              <p className="text-gray-300">
                Distance: {user.route.distance} km | ETA: {user.route.time} min
              </p>
              <p className="text-gray-400">
                {geofences.some((g) => isInsideGeofence(user.currentLocation, g)) ? "⚠️ Inside Geofence!" : "✅ Safe"}
              </p>
            </div>
          ))}
        </div>

        {/* Map */}
        <div className="w-2/3 h-[600px] rounded-3xl overflow-hidden border border-purple-500/30 shadow-[0_0_20px_rgba(139,92,246,0.6)] relative">
          <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              subdomains="abcd"
            />
            {geofences.map((g) => (
              <Circle key={g.id} center={g.center} radius={g.radius} pathOptions={{ color: "red", fillOpacity: 0.2 }} />
            ))}

            {allUsers.map((user) => (
              <React.Fragment key={user.id}>
                <Marker
                  position={user.currentLocation}
                  icon={L.icon({ iconUrl: "https://cdn-icons-png.flaticon.com/512/1077/1077114.png", iconSize: [32, 32] })}
                  eventHandlers={{
                    click: () => {
                      setSelectedUser(user);
                      setCameraView(true);
                    },
                  }}
                >
                  <Popup>
                    <p>{user.name}</p>
                    <p>{geofences.some((g) => isInsideGeofence(user.currentLocation, g)) ? "⚠️ In Geofence" : "✅ Safe"}</p>
                  </Popup>
                </Marker>
                <Polyline positions={user.route.coordinates} color="lime" weight={4} opacity={0.7} />
              </React.Fragment>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Camera / User Details Modal */}
      {cameraView && (
        <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-6">
          <div className="bg-gray-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl relative p-6">
            <button
              onClick={() => setCameraView(false)}
              className="absolute top-4 right-4 text-yellow-400 text-3xl font-bold hover:text-yellow-300 focus:outline-none"
              aria-label="Close modal"
            >
              ✖
            </button>
            <h2 className="text-white text-2xl mb-4">Live Camera View {selectedUser ? `- ${selectedUser.name}` : ""}</h2>

            <div className="bg-black border border-yellow-400 rounded-lg w-full h-[400px] flex flex-col items-center justify-center text-yellow-400 p-4 gap-2">
              {selectedUser ? (
                <>
                  <p><strong>Current Location:</strong> {selectedUser.currentLocationName || "Current Location"}</p>
                  <p><strong>Latitude:</strong> {selectedUser.currentLocation[0].toFixed(5)}</p>
                  <p><strong>Longitude:</strong> {selectedUser.currentLocation[1].toFixed(5)}</p>
                  {geofences.some((g) => isInsideGeofence(selectedUser.currentLocation, g)) ? (
                    <p className="text-red-500 font-bold">⚠️ Inside Geofence!</p>
                  ) : (
                    <p className="text-green-500 font-bold">✅ Safe</p>
                  )}
                  <div className="mt-4 bg-black border border-yellow-400 w-full h-48 flex items-center justify-center">
                    🎥 Camera feed placeholder
                  </div>
                </>
              ) : (
                <p>🎥 Camera feed placeholder</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
