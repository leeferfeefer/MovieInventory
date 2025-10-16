import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.get("/api/movie-info", (req, res) => {
  const { upc } = req.query;
  if (!upc) {
    return res.status(400).json({ error: "UPC is required" });
  }

  // Mock response for now
  res.json({ message: `Movie info for UPC: ${upc}` });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});