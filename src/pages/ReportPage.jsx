import React, { useState } from "react";

export default function ReportPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-950 text-gray-100 flex flex-col items-center justify-center p-6">
      {!submitted ? (
        <form
          action="https://formspree.io/f/xkgqgdry"
          method="POST"
          onSubmit={() => setSubmitted(true)}
          className="bg-gray-800 bg-opacity-80 p-10 rounded-3xl w-full max-w-lg shadow-2xl border border-yellow-400/40 space-y-8"
        >
          <h2 className="text-4xl font-extrabold mb-8 text-yellow-400 tracking-wider drop-shadow-lg animate-pulse">
            Report an Incident
          </h2>

          <label className="flex flex-col text-left text-lg font-semibold">
            Name
            <input
              type="text"
              name="name"
              required
              className="mt-2 p-4 rounded-xl bg-gray-700/90 placeholder-yellow-300 placeholder-opacity-80 text-white
                border-2 border-transparent focus:outline-none focus:ring-4 focus:ring-yellow-400/50 transition"
              placeholder="Your full name"
            />
          </label>

          <label className="flex flex-col text-left text-lg font-semibold">
            Email
            <input
              type="email"
              name="email"
              required
              className="mt-2 p-4 rounded-xl bg-gray-700/90 placeholder-yellow-300 placeholder-opacity-80 text-white
                border-2 border-transparent focus:outline-none focus:ring-4 focus:ring-yellow-400/50 transition"
              placeholder="Your email address"
            />
          </label>

          <label className="flex flex-col text-left text-lg font-semibold">
            Incident Type
            <select
              name="type"
              required
              className="mt-2 p-4 rounded-xl bg-gray-700/90 text-white focus:outline-none focus:ring-4 focus:ring-yellow-400/50 transition"
              defaultValue=""
            >
              <option value="" disabled>
                Select type
              </option>
              <option value="flood">🌊 Flood</option>
              <option value="wildlife">🦌 Wildlife</option>
              <option value="accident">🚑 Accident</option>
              <option value="other">❓ Other</option>
            </select>
          </label>

          <label className="flex flex-col text-left text-lg font-semibold">
            Description
            <textarea
              name="description"
              required
              rows="5"
              className="mt-2 p-4 rounded-xl bg-gray-700/90 placeholder-yellow-300 placeholder-opacity-80 text-white resize-none
                border-2 border-transparent focus:outline-none focus:ring-4 focus:ring-yellow-400/50 transition"
              placeholder="Please describe the incident in detail..."
            />
          </label>

          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 font-bold text-gray-900 py-4 rounded-3xl shadow-lg
              transform transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            Submit Report
          </button>
        </form>
      ) : (
        <div className="max-w-md p-8 bg-green-900 bg-opacity-90 rounded-3xl shadow-2xl border border-green-600 animate-fade-in text-center">
          <h2 className="text-4xl font-extrabold text-green-400 mb-6 tracking-wide">
            🎉 Thank you for reporting!
          </h2>
          <p className="text-green-200 text-lg leading-relaxed">
            We have received your incident report and will take necessary action. Travel safe!
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-10 px-6 py-3 rounded-full bg-yellow-400 text-gray-900 font-semibold shadow-lg hover:bg-yellow-500 transition"
          >
            Report Another
          </button>
        </div>
      )}

      {/* Fade in keyframe */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease forwards;
        }
      `}</style>
    </div>
  );
}
