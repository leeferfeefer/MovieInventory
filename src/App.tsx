import { useCallback, useState, useRef } from "react";
import "./App.css";
import BarcodeScanner from "react-qr-barcode-scanner";
import MeCrazy from "./assets/me-crazy-small.jpg";
import { getMovieInfo } from "./services/upc.service";

const scannerButtonTextOptions = {
  show: "Show Scanner",
  hide: "Hide Scanner",
};

function App() {
  const [data, setData] = useState("Not Found");
  const [showScanner, setShowScanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scannedUpc = useRef<string | null>(null);

  const toggleShowScanner = useCallback(() => {
    setShowScanner((prev) => !prev);
  }, []);

  const scannerButtonText = showScanner
    ? scannerButtonTextOptions.hide
    : scannerButtonTextOptions.show;

  const fetchMovieInfo = useCallback(async (upc: string) => {
    try {
      setIsLoading(true);
      const info = await getMovieInfo(upc);
      console.log("Movie info:", info);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="app-container">
      <button onClick={toggleShowScanner}>{scannerButtonText}</button>
      {showScanner && (
        <BarcodeScanner
          width="100%"
          height="auto"
          onUpdate={(err, result) => {
            if (err) {
              console.error(err);
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
          alt="me-crazy"
          className={isLoading ? "rotating" : ""}
          style={{
            height: "80px",
            width: "80px",
            objectFit: "cover",
            borderRadius: "50%",
          }}
        />
      )}
    </div>
  );
}

export default App;
