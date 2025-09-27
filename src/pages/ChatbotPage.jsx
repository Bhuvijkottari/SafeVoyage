import React from "react";
import ChatBot from "react-chatbotify";

const flow = {
  start: {
    message: "Hello! How can I assist you today?",
    path: "userResponse",
  },
  userResponse: {
    type: "user",
    onReceive: (input) => {
      const text = input.toLowerCase();
      if (text.includes("hello") || text.includes("hi") || text.includes("yo")) return "greet";
      if (text.includes("help") || text.includes("pls") || text.includes("please")) return "help";
      if (text.includes("bye") || text.includes("goodbye")) return "bye";
      return "fallback";
    },
  },
  greet: {
    message: "Hey there! How can I help?",
    path: "userResponse",
  },
  help: {
    message: "Sure, please tell me what you need help with.",
    path: "userResponse",
  },
  bye: {
    message: "Goodbye! Have a great day!",
    end: true,
  },
  fallback: {
    message: "Sorry, I do not understand your message 😢. Please try something else.",
    path: "userResponse",
  },
};

const options = {
  theme: {
    primaryColor: "#ff5f6d",
    secondaryColor: "#ffc371",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  headerStyle: {
    backgroundColor: "#ff5f6d",
    color: "#fff",
    fontWeight: "700",
    fontSize: 20,
    padding: "16px",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  chatWindowStyle: {
    borderRadius: 24,
    backgroundColor: "#1a1220",
    border: "3px solid #ff5f6d",
    boxShadow: "0 15px 40px rgba(255, 95, 109, 0.5)",
  },
  botBubbleStyle: {
    backgroundColor: "#ff5f6d",
    color: "#fff",
    fontWeight: "600",
  },
  userBubbleStyle: {
    backgroundColor: "#ffc371",
    color: "#4a2c01",
    fontWeight: "600",
  },
  sendButtonStyle: {
    backgroundColor: "#ff5f6d",
    fontWeight: "bold",
    padding: "12px 26px",
    borderRadius: 18,
    fontSize: 16,
    cursor: "pointer",
  },
};

export default function ChatbotPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        background: "linear-gradient(135deg, #34092d 0%, #1a1220 50%, #34092d 100%)",
      }}
    >
      <h1
        className="text-4xl font-extrabold text-white mb-12 tracking-widest"
        style={{ textShadow: "2px 2px 15px rgba(255,195,113,0.4)" }}
      >
        🚀 Assistant Bot
      </h1>
      <div className="w-full max-w-lg rounded-3xl shadow-xl">
        <ChatBot flow={flow} options={options} />
      </div>
    </div>
  );
}
