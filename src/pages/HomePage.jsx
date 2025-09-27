import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";
import {
  MapPin,
  Bell,
  Info,
  Menu,
  X,
  Cloud,
  AlertTriangle,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Danger and safe zones
const dangerZones = [
  { lat: 12.8696, lng: 74.8805, radius: 300, name: "⚠ Flood-Prone Area" },
  { lat: 12.8672, lng: 74.8881, radius: 200, name: "⚠ Wildlife Alert" },
];
const safeZones = [{ lat: 12.8725, lng: 74.882, name: "✅ Safe Tourist Zone" }];

// Translations including news items
const translations = {
  en: {
    menu: "Menu",
    weather: "Weather & Conditions",
    report: "Report an Incident",
    chatbot: "Help / Chatbot",
    whereToGo: "Where would you like to go?",
    sos: "SOS",
    info: "Info",
    travelTips: "Travel Tips",
    touristGuide: "Tourist Guide",
    safeTravels: "Safe Travels",
    news: [
      "🌄 Arunachal Pradesh: New eco-tourism initiative launched in Ziro Valley.",
      "🏞️ Assam: Kaziranga National Park reports rise in rhino population.",
      "🎉 Nagaland: Hornbill Festival dates announced for December.",
      "🌊 Tripura: River festival to boost local tourism and culture.",
      "🛣️ Meghalaya: New highway project to improve connectivity.",
    ],
  },
  hi: {
    menu: "मेनू",
    weather: "मौसम और स्थितियाँ",
    report: "घटना की रिपोर्ट करें",
    chatbot: "सहायता / चैटबॉट",
    whereToGo: "आप कहाँ जाना चाहेंगे?",
    sos: "एसओएस",
    info: "जानकारी",
    travelTips: "यात्रा सुझाव",
    touristGuide: "पर्यटक मार्गदर्शक",
    safeTravels: "सुरक्षित यात्रा",
    news: [
      "🌄 अरुणाचल प्रदेश: ज़िरो घाटी में नई ईको-टूरिज़्म पहल शुरू।",
      "🏞️ असम: काज़ीरंगा नेशनल पार्क में गैंडे की संख्या में वृद्धि।",
      "🎉 नागालैंड: हॉर्नबिल फेस्टिवल की तारीखें दिसंबर में घोषित।",
      "🌊 त्रिपुरा: नदी उत्सव स्थानीय पर्यटन और संस्कृति को बढ़ावा देगा।",
      "🛣️ मेघालय: कनेक्टिविटी सुधारने के लिए नई हाइवे परियोजना।",
    ],
  },
  kn: {
    menu: "ಮೆನು",
    weather: "ಹವಾಮಾನ ಮತ್ತು ಪರಿಸ್ಥಿತಿಗಳು",
    report: "ಘಟನೆ ವರದಿ ಮಾಡಿ",
    chatbot: "ಸಹಾಯ / ಚಾಟ್‌ಬಾಟ್",
    whereToGo: "ನೀವು ಎಲ್ಲಿಗೆ ಹೋಗಲು ಇಚ್ಛಿಸುತ್ತೀರಿ?",
    sos: "SOS",
    info: "ಮಾಹಿತಿ",
    travelTips: "ಪ್ರವಾಸ ಸಲಹೆಗಳು",
    touristGuide: "ಪ್ರವಾಸಿ ಮಾರ್ಗದರ್ಶಿ",
    safeTravels: "ಸುರಕ್ಷಿತ ಪ್ರಯಾಣ",
    news: [
      "🌄 ಅರුණಾಚಲ ಪ್ರದೇಶ: ಜಿರೋ ವ್ಯಾಲಿಯಲ್ಲಿ ಹೊಸ ಇಕೋ-ಟೂರಿಸಮ್ ಪ್ರಾರಂಭ.",
      "🏞️ ಅಸ್ಸಾಂ: ಕಾಜಿರಂಗಾ ನ್ಯಾಷನಲ್ ಪಾರ್ಕ್‌ನಲ್ಲಿ ಗಂಡೆ ಸಂಖ್ಯೆ ಏರಿಕೆ.",
      "🎉 ನಾಗಾಲ್ಯಾಂಡ್: ಹಾರ್ನ್‌ಬಿಲ್ ಹಬ್ಬದ ದಿನಾಂಕಗಳು ಡಿಸೆಂಬರ್‌ನಲ್ಲಿ ಘೋಷಣೆ.",
      "🌊 ತ್ರಿಪುರ: ನದಿ ಹಬ್ಬ ಸ್ಥಳೀಯ ಪ್ರವಾಸೋದ್ಯಮ ಮತ್ತು ಸಂಸ್ಕೃತಿಗೆ ಉತ್ತೇಜನ.",
      "🛣️ ಮೇಘಾಲಯ: ಸಂಪರ್ಕ ಸುಧಾರಣೆಗೆ ಹೊಸ ಹೈವೇ ಯೋಜನೆ.",
    ],
  },
};

// Live location marker component
function LiveLocationMarker() {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setPosition(coords);
        map.setView(coords, 14);
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [map]);

  return position ? (
    <Marker
      position={position}
      icon={L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149059.png",
        iconSize: [35, 35],
      })}
    >
      <Popup>You are here</Popup>
    </Marker>
  ) : null;
}

export default function Home() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [lang, setLang] = useState("en"); // default English
  const [currentNews, setCurrentNews] = useState(0);

  // News carousel effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNews((prev) => (prev + 1) % translations[lang].news.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [lang]);

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100 relative overflow-hidden">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -280 }}
        animate={{ x: isSidebarOpen ? 0 : -280 }}
        transition={{ type: "spring", stiffness: 90 }}
        className="fixed top-0 left-0 h-full w-64 bg-gray-800 shadow-2xl z-[60] flex flex-col p-6 space-y-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white tracking-wide">
            {translations[lang].menu}
          </h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close Sidebar"
            className="p-2 rounded-md hover:bg-gray-700 transition"
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        {[
          {
            label: translations[lang].weather,
            icon: <Cloud className="h-5 w-5 text-blue-400" />,
            onClick: () => {
              navigate("/weather");
              setIsSidebarOpen(false);
            },
          },
          {
            label: translations[lang].report,
            icon: <AlertTriangle className="h-5 w-5 text-yellow-400" />,
            onClick: () => {
              navigate("/report");
              setIsSidebarOpen(false);
            },
          },
          {
            label: translations[lang].chatbot,
            icon: <MessageCircle className="h-5 w-5 text-green-400" />,
            onClick: () => {
              navigate("/chatbot");
              setIsSidebarOpen(false);
            },
          },
        ].map(({ label, icon, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition font-semibold tracking-wide"
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </motion.div>

      {/* Language Selector */}
      <div className="fixed top-7 right-5 z-[9999] flex space-x-2 bg-gray-800 p-2 rounded-xl shadow-lg">
        {["en", "hi", "kn"].map((code) => (
          <button
            key={code}
            onClick={() => setLang(code)}
            className={`px-3 py-1 rounded-lg font-semibold ${
              lang === code
                ? "bg-yellow-400 text-gray-900"
                : "bg-gray-700 text-gray-100"
            }`}
          >
            {code.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Page Content */}
      <motion.div
        animate={{ x: isSidebarOpen ? 220 : 0 }}
        transition={{ type: "spring", stiffness: 90 }}
        className="flex flex-col flex-1 min-h-screen relative bg-gradient-to-br from-gray-900 via-blue-900 to-gray-950"
      >
        {/* Hamburger */}
        <button
          className="fixed top-7 left-5 z-[9999] bg-gray-800 p-3 rounded-xl shadow-lg hover:bg-gray-700 focus:outline-yellow-400 transition"
          aria-label="Open Sidebar"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu className="h-9 w-8 text-white" />
        </button>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: isSidebarOpen ? 30 : 0 }}
          transition={{ type: "spring", stiffness: 90, delay: 0.2 }}
          className="h-80 w-full relative px-4 pt-4 z-0"
        >
          <MapContainer
            center={[12.8703, 74.8806]}
            zoom={13}
            className="h-full w-full rounded-3xl shadow-lg border border-blue-800"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {dangerZones.map((zone, idx) => (
              <Circle
                key={idx}
                center={[zone.lat, zone.lng]}
                radius={zone.radius}
                pathOptions={{
                  color: "red",
                  fillColor: "red",
                  fillOpacity: 0.3,
                  weight: 2,
                }}
              >
                <Popup>{zone.name}</Popup>
              </Circle>
            ))}
            {safeZones.map((zone, idx) => (
              <Marker
                key={idx}
                position={[zone.lat, zone.lng]}
                icon={L.icon({
                  iconUrl:
                    "https://cdn-icons-png.flaticon.com/512/190/190411.png",
                  iconSize: [32, 32],
                  className: "drop-shadow-lg",
                })}
              >
                <Popup>{zone.name}</Popup>
              </Marker>
            ))}
            <LiveLocationMarker />
          </MapContainer>
        </motion.div>

        {/* Where to Go */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, x: isSidebarOpen ? 30 : 0 }}
          transition={{ type: "spring", stiffness: 90, delay: 0.3 }}
          className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 mx-6 mt-6 p-6 rounded-3xl shadow-2xl flex items-center justify-between hover:scale-105 transition-transform duration-300"
        >
          <div className="flex items-center space-x-3">
            <MapPin className="h-8 w-8 text-yellow-300 drop-shadow-md" />
            <p className="text-lg md:text-xl font-bold text-white tracking-wider">
              {translations[lang].whereToGo}
            </p>
          </div>
          <button
            onClick={() => navigate("/route-finder")}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-4 rounded-2xl text-lg md:text-xl shadow-lg transition-colors duration-300"
          >
            ➜
          </button>
        </motion.div>

        {/* News Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, x: isSidebarOpen ? 30 : 0 }}
          transition={{ type: "spring", stiffness: 90, delay: 0.4 }}
          className="mt-6 mx-6 bg-gray-700 p-8 rounded-3xl shadow-lg text-center text-lg font-semibold"
          style={{ minHeight: 120 }}
        >
          <motion.p
            key={currentNews}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-yellow-300 text-lg md:text-xl select-none"
          >
            {translations[lang].news[currentNews]}
          </motion.p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, x: isSidebarOpen ? 30 : 0 }}
          transition={{ type: "spring", stiffness: 90, delay: 0.5 }}
          className="grid grid-cols-3 gap-6 mt-8 mx-6 mb-8"
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/sos")}
            className="bg-red-600 text-white py-6 rounded-2xl shadow-xl flex flex-col items-center justify-center text-lg md:text-xl transition-transform hover:scale-110 hover:shadow-2xl"
            aria-label={translations[lang].sos}
          >
            <Bell className="mb-2 h-8 w-8" />
            {translations[lang].sos}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/info")}
            className="bg-blue-600 text-white py-6 rounded-2xl shadow-xl flex flex-col items-center justify-center text-lg md:text-xl transition-transform hover:scale-110 hover:shadow-2xl"
            aria-label={translations[lang].info}
          >
            <Info className="mb-2 h-8 w-8" />
            {translations[lang].info}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/tips")}
            className="bg-green-600 text-white py-6 rounded-2xl shadow-xl flex flex-col items-center justify-center text-lg md:text-xl transition-transform hover:scale-110 hover:shadow-2xl"
            aria-label={translations[lang].travelTips}
          >
            <MapPin className="mb-2 h-8 w-8" />
            {translations[lang].travelTips}
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, x: isSidebarOpen ? 30 : 0 }}
          transition={{ type: "spring", stiffness: 90, delay: 0.6 }}
          className="mt-auto bg-gray-900 text-gray-300 text-center py-5 rounded-t-3xl shadow-inner select-none"
        >
          <p className="text-sm tracking-wide">
            🗺️ {translations[lang].touristGuide} © {new Date().getFullYear()} | {translations[lang].safeTravels}
          </p>
        </motion.footer>
      </motion.div>
    </div>
  );
}
