import { useState } from 'react'
import './App.css'
import BarcodeScanner from "react-qr-barcode-scanner";

function App() {
    const [data, setData] = useState("Not Found");
    const [showScanner, setShowScanner] = useState(false);

    return (
      <>
      <button onClick={() => setShowScanner(!showScanner) }>Show Scanner</button>
        {showScanner && <BarcodeScanner
          width={500}
          height={500}
          onUpdate={(_err, result) => {
            if (result)  setData(result.getText());
            else setData("Not Found");
          }}
        />}
        <p>{data}</p>
      </>
    );
}

export default App
