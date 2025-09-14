import React, { useRef, useEffect, useState } from "react";

const SelfieCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
      videoRef.current.play();
    } catch (err) {
      console.error("Camera Error:", err);
      alert("Cannot access camera. Please allow camera access.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, 300, 300);
    const imageData = canvasRef.current.toDataURL("image/png"); // Base64
    onCapture(imageData);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <video
        ref={videoRef}
        width="300"
        height="300"
        className="rounded-lg shadow-md"
      ></video>
      <canvas ref={canvasRef} width="300" height="300" className="hidden" />
      <button
        onClick={capturePhoto}
        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
      >
        Capture Selfie
      </button>
    </div>
  );
};

export default SelfieCapture;
