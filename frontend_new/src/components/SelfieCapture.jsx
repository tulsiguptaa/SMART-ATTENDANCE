import { useRef, useState, useCallback } from 'react'
import Webcam from 'react-webcam'
import './SelfieCapture.css'

const SelfieCapture = ({ onCapture }) => {
    const webcamRef = useRef(null)
    const [isCapturing, setIsCapturing] = useState(false)
    const [capturedImage, setCapturedImage] = useState(null)
    const [error, setError] = useState('')

    const videoConstraints = {
        width: 400,
        height: 400,
        facingMode: 'user' // Front camera
    }

    const capture = useCallback(() => {
        if (webcamRef.current) {
            try {
                const imageSrc = webcamRef.current.getScreenshot()
                setCapturedImage(imageSrc)
                onCapture(imageSrc)
                setIsCapturing(false)
            } catch (err) {
                console.error('Error capturing image:', err)
                setError('Failed to capture image. Please try again.')
            }
        }
    }, [onCapture])

    const retake = () => {
        setCapturedImage(null)
        setIsCapturing(true)
        setError('')
    }

    const startCapture = () => {
        setIsCapturing(true)
        setError('')
    }

    const handleUserMediaError = (err) => {
        console.error('Error accessing camera:', err)
        setError('Unable to access camera. Please check permissions.')
    }

    if (capturedImage) {
        return (
            <div className="selfie-capture">
                <div className="captured-image-container">
                    <h3>Captured Selfie</h3>
                    <img
                        src={capturedImage}
                        alt="Captured selfie"
                        className="captured-image"
                    />
                    <div className="capture-actions">
                        <button onClick={retake} className="retake-button">
                            Retake
                        </button>
                        <button
                            onClick={() => onCapture(capturedImage)}
                            className="confirm-button"
                        >
                            Use This Photo
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="selfie-capture">
            {!isCapturing ? (
                <div className="capture-prompt">
                    <h3>Ready to take a selfie?</h3>
                    <p>Click the button below to start the camera</p>
                    <button onClick={startCapture} className="start-capture-button">
                        Start Camera
                    </button>
                </div>
            ) : (
                <div className="camera-container">
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={videoConstraints}
                        onUserMediaError={handleUserMediaError}
                        className="webcam"
                    />

                    {error && (
                        <div className="camera-error">
                            <p>{error}</p>
                            <button onClick={startCapture} className="retry-button">
                                Try Again
                            </button>
                        </div>
                    )}

                    <div className="capture-controls">
                        <button onClick={capture} className="capture-button">
                            📸 Capture
                        </button>
                        <button onClick={() => setIsCapturing(false)} className="cancel-button">
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SelfieCapture
