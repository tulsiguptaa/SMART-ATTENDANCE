import React, { useRef, useEffect, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

const QRScanner = ({ onScan, onError }) => {
  const videoRef = useRef(null);
  const [scanner, setScanner] = useState(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    setScanner(codeReader);

    return () => {
      codeReader.reset();
      setScanner(null);
      setScanning(false);
    };
  }, []);

  const startScanning = async () => {
    if (!scanner) return;
    setScanning(true);
    try {
      const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
      if (videoInputDevices.length === 0) {
        onError && onError("No camera found");
        return;
      }

      const selectedDeviceId = videoInputDevices[0].deviceId;

      scanner.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result, err) => {
          if (result) {
            onScan(result.getText());
            stopScanning();
          }
          if (err && !(err.name === "NotFoundException")) {
            console.error(err);
          }
        }
      );
    } catch (error) {
      onError && onError(error.message);
    }
  };

  const stopScanning = () => {
    if (scanner) {
      scanner.reset();
    }
    setScanning(false);
  };

  return (
    <div className="flex flex-col items-center">
      <video ref={videoRef} className="w-full max-w-md rounded-lg shadow-md" />
      <div className="mt-4 flex gap-4">
        {!scanning ? (
          <button
            onClick={startScanning}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Start Scanning
          </button>
        ) : (
          <button
            onClick={stopScanning}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Stop Scanning
          </button>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
