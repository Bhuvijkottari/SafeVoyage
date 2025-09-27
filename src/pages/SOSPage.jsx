// src/pages/SOSPage.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { MapContainer, TileLayer, Marker, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ✅ Import your siren sound from assets
import sirenSound from "../assets/siren.mp3";

export default function SOSPage() {
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [sirenAudio, setSirenAudio] = useState(null);

  // Get user location for map preview
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => console.error("GPS error:", err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const handleSOS = async () => {
    if (!userLocation) {
      alert("Fetching your location... Please allow GPS access.");
      return;
    }

    // 🔊 Play siren sound
    const audio = new Audio(sirenSound);
    audio.loop = true; // keeps playing until user stops it
    audio.play().catch((err) => console.error("Audio play error:", err));
    setSirenAudio(audio);

    setSending(true);
    setStatus("Sending SOS... ⏳");

    const data = {
      lat: userLocation.lat,
      lng: userLocation.lng,
      timestamp: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "sos_alerts"), data);
      setStatus("✅ SOS sent successfully!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to send SOS");
    } finally {
      setSending(false);
    }
  };

  const stopSiren = () => {
    if (sirenAudio) {
      sirenAudio.pause();
      sirenAudio.currentTime = 0; // reset
      setSirenAudio(null);
    }
  };

  const emergencyContacts = [
    { name: "Police", number: "100" },
    { name: "Ambulance", number: "102" },
    { name: "Fire", number: "101" },
    { name: "Disaster Helpline", number: "108" },
  ];

  // Custom icon for Leaflet marker
  const redIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-red-100 to-red-200 p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-10 left-10 w-40 h-40 bg-red-300/30 rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-red-400/20 rounded-full animate-pulse-slow animation-delay-1500"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-yellow-300/20 rounded-full animate-pulse-slow animation-delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-red-400/30 flex flex-col items-center space-y-6">
        <h1 className="text-4xl font-extrabold text-red-600 mb-3 drop-shadow-lg animate-bounce">
          SOS Alert 🚨
        </h1>
        <p className="text-center text-gray-700 mb-4">
          Press the button below to send your current location to authorities immediately.
        </p>

        {/* Map Preview */}
        {userLocation ? (
          <MapContainer
            center={[userLocation.lat, userLocation.lng]}
            zoom={15}
            scrollWheelZoom={false}
            className="w-full h-64 rounded-2xl shadow-lg"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[userLocation.lat, userLocation.lng]} icon={redIcon}>
              <Popup>Your current location</Popup>
            </Marker>
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={50}
              pathOptions={{ color: "red", fillColor: "red", fillOpacity: 0.3 }}
            />
          </MapContainer>
        ) : (
          <p className="text-gray-600">Fetching your location...</p>
        )}

        {/* Glowing SOS Button */}
        <button
          onClick={handleSOS}
          disabled={sending}
          className="relative bg-red-600 text-white px-8 py-5 rounded-3xl shadow-lg hover:bg-red-700 hover:scale-105 transition transform text-xl font-bold tracking-wide animate-pulse"
        >
          {sending ? "Sending..." : "Send SOS"}
          <span className="absolute top-0 left-0 w-full h-full rounded-3xl bg-red-400/20 animate-ping"></span>
        </button>

        {/* Stop Siren Button (only shows when playing) */}
        {sirenAudio && (
          <button
            onClick={stopSiren}
            className="mt-3 bg-gray-800 text-white px-6 py-2 rounded-2xl shadow hover:bg-black transition"
          >
            Stop Siren 🔇
          </button>
        )}

        {/* Status */}
        {status && <p className="mt-4 text-lg font-semibold text-gray-800">{status}</p>}

        {/* Emergency Contacts */}
        <div className="w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">Emergency Contacts</h2>
          <ul className="flex flex-col gap-3">
            {emergencyContacts.map((contact, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center bg-red-100/60 rounded-xl px-6 py-4 shadow-md hover:bg-red-200 transition"
              >
                <span className="font-semibold text-red-700">{contact.name}</span>
                <a
                  href={`tel:${contact.number}`}
                  className="bg-red-600 text-white px-4 py-2 rounded-xl shadow hover:bg-red-700 transition"
                >
                  {contact.number}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
