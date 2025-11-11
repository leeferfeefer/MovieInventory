import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from 'dotenv';
import morgan from "morgan";
import https from "https";
import fs from "fs";
import { getLocalIpAddress } from "./utilities/getLocalIpAddress";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
// Temporary CORS configuration for debugging
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(morgan("tiny"));
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

const options = {
  key: fs.readFileSync("./server.key"),
  cert: fs.readFileSync("./server.cert"),
};

const localIp = getLocalIpAddress();
https.createServer(options, app).listen(PORT, () => {
  console.log(`Server is running on https://localhost:${PORT}`);
  if (localIp) {
    console.log(`Server is also accessible on https://${localIp}:${PORT}`);
  }
});

// For self signed cert generation:
// openssl req -nodes -new -x509 -keyout server.key -out server.cert -days 365