import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Attendance = () => {
  const videoRef = useRef(null);
  const [scanResult, setScanResult] = useState("");
  const [status, setStatus] = useState("");
  const [scanning, setScanning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let controls;

    const startScanner = async () => {
      try {
        setScanning(true);
        controls = await codeReader.decodeFromVideoDevice(
          null,
          videoRef.current,
          async (result, err) => {
            if (result) {
              if (scanResult !== result.text) {
                setScanResult(result.text);
                await markAttendance(result.text);
              }
            }
            if (err && !(err instanceof ZXing.NotFoundException)) {
              console.error(err);
              setStatus("Scanning error. Please retry.");
            }
          }
        );
      } catch (error) {
        console.error(error);
        setStatus("Could not start camera. Check permissions.");
      }
    };

    startScanner();
    return () => {
      if (controls) controls.stop();
      setScanning(false);
    };
  }, [scanResult]);

  const markAttendance = async (qrData) => {
    try {
      setStatus("Marking attendance...");
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:8008/api/attendance/mark",
        { qrData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStatus(res.data.message || "Attendance marked successfully!");
    } catch (err) {
      setStatus(err.response?.data?.message || "Failed to mark attendance.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Mark Attendance</h2>

        <video
          ref={videoRef}
          style={{ width: "100%", borderRadius: "8px" }}
          muted
          autoPlay
        />

        {scanResult && (
          <p className="text-center mt-4 text-gray-700">
            Scanned: <span className="font-semibold">{scanResult}</span>
          </p>
        )}
        {status && (
          <p className="text-center mt-2 font-medium text-blue-600">{status}</p>
        )}

        <button
          className="mt-6 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Attendance;
