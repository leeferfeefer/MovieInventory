/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState, useRef } from "react";
import "./App.css";
import BarcodeScanner from "react-qr-barcode-scanner";
import MeCrazy from "./assets/me-crazy-small.jpg";
import { getMovieInfo } from "./services/upc.service";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const scannerButtonTextOptions = {
  show: "Show Scanner",
  hide: "Hide Scanner",
};

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

  const scannerButtonText = showScanner
    ? scannerButtonTextOptions.hide
    : scannerButtonTextOptions.show;

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
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const renderCarousel = () => {
    if (!movieInfo || !movieInfo.images || movieInfo.images.length === 0) {
      return <p>No images available</p>;
    }

    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };

    return (
      <Slider {...settings}>
        {movieInfo.images.map((image, index) => (
          <div key={index}>
            <img
              src={image}
              alt={`Movie image ${index + 1}`}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        ))}
      </Slider>
    );
  };

  return (
    <div className="app-container">
      <button onClick={toggleShowScanner}>{scannerButtonText}</button>
      {showScanner && (
        <BarcodeScanner
          width="100%"
          height="auto"
          onUpdate={(err, result) => {
            if (err) {
              if ((err as any).name === "NotFoundException2") {
                console.debug("Barcode not found. Please adjust the camera.");
                return;
              }
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
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={() => setIsModalOpen(false)}>
              Close
            </button>
            {renderCarousel()}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
