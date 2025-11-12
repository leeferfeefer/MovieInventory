import React, { useCallback, useState, useRef } from "react";
import BarcodeScannerComponent from "./components/BarcodeScannerComponent";
import MovieInfoModal from "./components/MovieInfoModal";
import MeCrazy from "./assets/me-crazy-small.jpg";
import { getMovieInfo } from "./services/upc.service";
import "./App.css";

/**
 * TODO
 * 
 * Break out this shit in smaller components
 * Add to DB functionality
 * Fix styling
 * Rescan ability - Clear what is scanned?
 * Show photo ability of what was last scanned? - After modal is closed
 * Move the loader to be a overlay centered to screen
 * Remove from DB ability
 * Display description?
 * Search (by name, actor, description, genre, rating, etc.)
 * Rating system?
 * Mark as watched?
 * Random chooser
 * 
 */

function App() {
  const [data, setData] = useState("Not Found");
  const [showScanner, setShowScanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [movieInfo, setMovieInfo] = useState<UpcDBItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scannedUpc = useRef<string | null>(null);

  const toggleShowScanner = useCallback(() => {
    setShowScanner((prev) => !prev);
  }, []);

  const fetchMovieInfo = useCallback(async (upc: string) => {
    try {
      setIsLoading(true);
      const info = await getMovieInfo(upc);
      if (info && info.items.length > 0) {
        setMovieInfo(info.items[0]);
        setIsModalOpen(true);
      } else {
        setMovieInfo(null);
      }
    } catch (error) {
      console.error("Error fetching movie info:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="app-container">
      <button onClick={toggleShowScanner}>
        {showScanner ? "Hide Scanner" : "Show Scanner"}
      </button>
      {showScanner && (
        <BarcodeScannerComponent
          onUpdate={(err, result) => {
            if (err) {
              console.error("Scanner error:", err);
              return;
            }
            if (result) {
              const resultText = result.getText();
              setData(resultText);
              if (resultText !== scannedUpc.current) {
                scannedUpc.current = resultText;
                fetchMovieInfo(scannedUpc.current);
              }
            } else {
              setData("Not Found");
            }
          }}
        />
      )}
      <p className="scanned-results">Scanned Results: {data}</p>
      {isLoading && (
        <img
          src={MeCrazy}
          alt="Loading..."
          className="rotating"
          style={{
            height: "80px",
            width: "80px",
            objectFit: "cover",
            borderRadius: "50%",
          }}
        />
      )}
      {isModalOpen && movieInfo && (
        <MovieInfoModal
          images={movieInfo.images}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
