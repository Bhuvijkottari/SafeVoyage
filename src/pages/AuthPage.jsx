import React, { useState } from "react";
import RegisterForm from "../components/RegisterForm";
import LoginForm from "../components/LoginForm";

export default function AuthPage() {
  const [selectedRole, setSelectedRole] = useState(null); // null, 'user' or 'authority'
  const [showRegister, setShowRegister] = useState(true);

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background:
          "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80') no-repeat center/cover",
      }}
    >
      <div className="absolute inset-0 bg-black/70 z-0"></div>
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {/* Same Animated shapes */}
        <div className="absolute top-[15%] left-10 w-72 h-72 bg-green-700/20 rounded-full animate-pulse-slow"></div>
        <div className="absolute top-[40%] right-10 w-80 h-80 bg-yellow-700/20 rounded-full animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute bottom-[15%] left-[25%] w-64 h-64 bg-teal-700/20 rounded-full animate-pulse-slow animation-delay-1000"></div>
        <div className="absolute bottom-[20%] right-[35%] w-72 h-72 bg-blue-700/20 rounded-full animate-pulse-slow animation-delay-1500"></div>
      </div>

      <div className="relative z-20 w-full max-w-md p-8 bg-gray-900/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 text-center overflow-hidden">
        <h1 className="text-5xl font-extrabold text-yellow-400 drop-shadow-lg mb-10 flex items-center justify-center gap-3">
          SafeVoyage <span className="text-3xl animate-bounce">🗺️</span>
        </h1>

        {/* Step 1: Role Selection Buttons */}
        {!selectedRole && (
          <div className="flex justify-center space-x-20">
            <button
              className="px-10 py-4 bg-yellow-400 rounded-full font-bold shadow-lg text-gray-900 scale-110 transition-transform hover:scale-105"
              onClick={() => setSelectedRole("user")}
            >
              User
            </button>
            <button
              className="px-10 py-4 bg-yellow-400 rounded-full font-bold shadow-lg text-gray-900 scale-110 transition-transform hover:scale-105"
              onClick={() => setSelectedRole("authority")}
            >
              Authority
            </button>
          </div>
        )}

        {/* Step 2: Show Register/Login toggles & form with slide-in */}
        {selectedRole && (
          <div
            className={`transform transition-transform duration-700 ease-in-out ${
              selectedRole ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
            }`}
          >
            {/* Role Info and Switch Button */}
            <div className="mb-10">
              <div className="text-yellow-300 mb-4 font-semibold">
                Selected Role:{" "}
                <span className="text-yellow-400 capitalize">{selectedRole}</span>
              </div>
              <button
                onClick={() => setSelectedRole(null)}
                className="mb-5 text-yellow-400 underline hover:text-yellow-300"
              >
                &larr; Change Role
              </button>
            </div>

            <div className="flex justify-center mb-8 space-x-6">
              <button
                onClick={() => setShowRegister(true)}
                className={`px-6 py-3 rounded-full font-semibold transition-transform duration-300 ${
                  showRegister
                    ? "bg-yellow-400 text-gray-900 shadow-xl scale-110"
                    : "bg-white/25 text-white hover:bg-white/40"
                }`}
              >
                Register
              </button>
              <button
                onClick={() => setShowRegister(false)}
                className={`px-6 py-3 rounded-full font-semibold transition-transform duration-300 ${
                  !showRegister
                    ? "bg-yellow-400 text-gray-900 shadow-xl scale-110"
                    : "bg-white/25 text-white hover:bg-white/40"
                }`}
              >
                Login
              </button>
            </div>

            <div>{showRegister ? <RegisterForm role={selectedRole} /> : <LoginForm role={selectedRole} />}</div>
          </div>
        )}

        {/* Footer */}
        <p className="text-yellow-300/70 mt-16 text-sm select-none">
          © {new Date().getFullYear()} SafeVoyage. Travel smart, travel safe.
        </p>
      </div>
    </div>
  );
}
