// server.js or backend file
import express from "express";
import fetch from "node-fetch"; // If using Node.js < 18

const app = express();
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  try {
    // Gemini AI API call
    const response = await fetch("https://api.gemini.ai/v1/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer YOUR_GEMINI_API_KEY`,
      },
      body: JSON.stringify({
        model: "gemini-1", 
        input: message,
      }),
    });

    const data = await response.json();
    res.json({ reply: data.output_text || "No response" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Error connecting to Gemini API" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
