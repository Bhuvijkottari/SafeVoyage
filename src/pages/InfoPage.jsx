// src/pages/InfoPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function InfoPage() {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);

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

  const infoSections = [
    { name: "Nearby Hospitals", color: "from-red-500 to-red-700", query: "hospital" },
    { name: "Nearby Police Stations", color: "from-blue-500 to-blue-700", query: "police station" },
    { name: "Public Transport Stations", color: "from-green-400 to-green-600", query: "bus station" },
    { name: "Nearby Hotels", color: "from-yellow-400 to-yellow-600", query: "hotel" },
  ];

  const emergencyContacts = [
    { name: "Police", number: "100" },
    { name: "Ambulance", number: "102" },
    { name: "Fire", number: "101" },
    { name: "Tourist Helpline", number: "1363" },
  ];

  const openMap = (query) => {
    if (!userLocation) {
      alert("Fetching your location... Please allow GPS access.");
      return;
    }
    const url = `https://www.google.com/maps/search/${encodeURIComponent(
      query
    )}/@${userLocation.lat},${userLocation.lng},15z`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="flex flex-col flex-grow">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-yellow-400 mb-6 text-center drop-shadow-lg tracking-wide">
          Info Page
        </h1>
        <p className="text-center text-gray-300 mb-8 text-sm sm:text-base">
          Find essential travel info and nearby facilities for tourists.
        </p>

        {/* Info Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 flex-grow">
          {infoSections.map((section, idx) => (
            <div
              key={idx}
              className={`relative p-6 rounded-3xl shadow-2xl bg-gradient-to-br ${section.color} hover:scale-105 transition-transform duration-300 cursor-pointer min-h-[140px] flex items-center justify-between`}
            >
              <span className="font-semibold text-white text-lg sm:text-xl">{section.name}</span>
              <button
                onClick={() => openMap(section.query)}
                className="bg-white text-gray-900 px-6 py-3 rounded-2xl shadow-lg hover:scale-105 hover:bg-gray-100 transition-all duration-300"
              >
                View
              </button>
            </div>
          ))}
        </div>

        {/* Emergency Contacts Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-red-500 mb-4 text-center">Emergency Contacts 🚨</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {emergencyContacts.map((contact, idx) => (
              <a
                key={idx}
                href={`tel:${contact.number}`}
                className="flex items-center justify-between p-4 rounded-2xl bg-gray-800 hover:bg-gray-700 shadow-lg transition-all duration-300"
              >
                <span className="text-white font-semibold">{contact.name}</span>
                <span className="text-yellow-400 font-bold">{contact.number}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-center mt-auto">
        <button
          onClick={() => navigate(-1)}
          className="mt-6 bg-gradient-to-br from-gray-700 to-gray-800 text-white px-8 py-3 rounded-3xl shadow-2xl hover:scale-105 hover:from-gray-600 hover:to-gray-700 transition-all duration-300"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
