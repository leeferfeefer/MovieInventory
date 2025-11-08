import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = 3000;

// CORS configuration
const corsOptions = {
  origin: ["http://localhost:5173", "https://localhost:5173"],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.get("/api/movie_info", async (req, res) => {
  const { upc } = req.query;
  if (!upc) {
    return res.status(400).json({ error: "UPC is required" });
  }

  try {
    const response = await fetch(
      `https://api.upcitemdb.com/prod/trial/lookup?upc=${upc}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching movie info:", error);
    res.status(500).json({ error: "Failed to fetch movie information" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running`);
});
