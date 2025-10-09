import { useCallback, useEffect, useState, useRef } from "react";
import "./App.css";
import BarcodeScanner from "react-qr-barcode-scanner";
import MeCrazy from "./assets/me-crazy-small.jpg";

const scannerButtonTextOptions = {
  show: "Show Scanner",
  hide: "Hide Scanner",
};

function App() {
  const [data, setData] = useState("Not Found");
  const [showScanner, setShowScanner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const scannedUpc = useRef<string | null>(null);

  const toggleShowScanner = useCallback(() => {
    setShowScanner((prev) => !prev);
  }, []);

  const scannerButtonText = showScanner
    ? scannerButtonTextOptions.hide
    : scannerButtonTextOptions.show;

  return (
    <>
      <button onClick={toggleShowScanner}>{scannerButtonText}</button>
      {showScanner && (
        <BarcodeScanner
          width={500}
          height={500}
          onUpdate={(err, result) => {
            if (err) {
              console.error(err);
              return;
            }
            if (result) {
              const resultText = result.getText();
              setData(resultText);
              scannedUpc.current = resultText;
            } else {
              setData("Not Found");
            }
          }}
        />
      )}
      <p>{data}</p>
      <img
        src={MeCrazy}
        alt="me-crazy"
        className={isLoading ? "rotating" : ""}
        style={{
          height: "100px",
          width: "100px",
          objectFit: "cover",
          borderRadius: "50%",
        }}
      />
    </>
  );
}

export default App;
