import React from 'react';
import BarcodeScanner from 'react-qr-barcode-scanner';

type BarcodeScannerComponentProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onUpdate: (err: any, result: any) => void;
};

const BarcodeScannerComponent: React.FC<BarcodeScannerComponentProps> = ({ onUpdate }) => {
    return (
        <BarcodeScanner
            width="100%"
            height="auto"
            onUpdate={onUpdate}
        />
    );
};

export default BarcodeScannerComponent;
