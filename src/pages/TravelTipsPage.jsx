// src/pages/TravelTipsPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GiPoliceOfficerHead, GiHospitalCross, GiHealthNormal } from "react-icons/gi";
import { MdTravelExplore } from "react-icons/md";

export default function TravelTipsPage() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);

  const tipsSections = [
    {
      title: "Dos & Don'ts",
      color: "from-green-600 to-green-500",
      icon: <MdTravelExplore className="w-7 h-7 text-white" />,
      items: [
        { type: "do", text: "Carry a copy of your ID and passport." },
        { type: "do", text: "Keep emergency numbers saved on your phone." },
        { type: "do", text: "Respect local customs and traditions." },
        { type: "dont", text: "Avoid wandering alone at night in unfamiliar areas." },
        { type: "dont", text: "Don't leave valuables unattended." },
      ],
    },
    {
      title: "Local Laws & Safety",
      color: "from-teal-600 to-teal-500",
      icon: <GiPoliceOfficerHead className="w-7 h-7 text-white" />,
      items: [
        { type: "rule", text: "Always carry an ID when traveling." },
        { type: "rule", text: "No smoking in restricted areas." },
        { type: "rule", text: "Obey local traffic and drinking laws." },
      ],
    },
    {
      title: "Emergency Prep",
      color: "from-indigo-600 to-indigo-500",
      icon: <GiHospitalCross className="w-7 h-7 text-white" />,
      items: [
        { type: "tip", text: "Save nearest hospital, police, and embassy locations." },
        { type: "tip", text: "Keep your phone charged & carry a power bank." },
        { type: "tip", text: "Carry a small first-aid kit." },
      ],
    },
  ];

  const toggleSection = (index) => setActiveIndex(activeIndex === index ? null : index);

  return (
    <div className="relative flex flex-col min-h-screen bg-gray-900 text-gray-100 p-6 overflow-hidden">
      {/* Background gradient & sparkles */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80"></div>
        <motion.div
          className="absolute w-2 h-2 bg-green-400 rounded-full opacity-50"
          animate={{ x: ["0%", "100%", "0%"], y: ["0%", "100%", "0%"] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-2 h-2 bg-teal-400 rounded-full opacity-50"
          animate={{ x: ["100%", "0%", "100%"], y: ["100%", "0%", "100%"] }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-2 h-2 bg-indigo-400 rounded-full opacity-50"
          animate={{ x: ["50%", "150%", "50%"], y: ["150%", "50%", "150%"] }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Header */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-green-400 mb-4 text-center tracking-wide drop-shadow-lg flex items-center justify-center gap-2">
        🗺️ Travel Tips & Safety Guide
        <GiHealthNormal className="w-8 h-8 animate-pulse" />
      </h1>
      <p className="text-center text-gray-400 mb-8 text-sm sm:text-base">
        Stay safe, smart, and prepared while exploring new places.
      </p>

      {/* Tips Sections */}
      <div className="space-y-6 mb-8">
        {tipsSections.map((section, idx) => (
          <motion.div
            key={idx}
            className="rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm bg-gray-800/70 border border-gray-700"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {/* Section Header */}
            <div
              onClick={() => toggleSection(idx)}
              className={`cursor-pointer px-6 py-4 bg-gradient-to-r ${section.color} flex justify-between items-center transition-transform duration-300 hover:scale-105`}
            >
              <div className="flex items-center gap-3">
                {section.icon}
                <h2 className="text-lg sm:text-xl font-semibold text-white">{section.title}</h2>
              </div>
              <motion.span
                animate={{ rotate: activeIndex === idx ? 45 : 0 }}
                className="text-white text-2xl font-bold"
                transition={{ duration: 0.3 }}
              >
                +
              </motion.span>
            </div>

            {/* Glowing underline */}
            <AnimatePresence>
              {activeIndex === idx && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ scaleX: 0 }}
                  transition={{ duration: 0.4 }}
                  className="h-1 w-full bg-green-400/60 rounded-full mb-2 shadow-lg"
                />
              )}
            </AnimatePresence>

            {/* Section Content */}
            <AnimatePresence>
              {activeIndex === idx && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="p-5 space-y-3"
                >
                  {section.items.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                        item.type === "do"
                          ? "bg-green-800/30 hover:bg-green-700/40"
                          : item.type === "dont"
                          ? "bg-red-800/30 hover:bg-red-700/40"
                          : item.type === "rule"
                          ? "bg-yellow-800/30 hover:bg-yellow-700/40"
                          : "bg-blue-800/30 hover:bg-blue-700/40"
                      }`}
                    >
                      <span className="font-bold text-xl animate-pulse">
                        {item.type === "do" ? "✅" : item.type === "dont" ? "❌" : "⚖️"}
                      </span>
                      <span>{item.text}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Back Button */}
      <div className="flex justify-center mt-auto">
        <motion.button
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px #10B981" }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-8 py-3 rounded-3xl shadow-lg transition-all duration-300"
        >
          ← Back
        </motion.button>
      </div>
    </div>
  );
}
