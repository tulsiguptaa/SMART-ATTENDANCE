import { useEffect, useRef, useState } from 'react'
import jsQR from 'jsqr'
import './QRScanner.css'

const QRScanner = ({ onScan }) => {
    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const streamRef = useRef(null)
    const [isScanning, setIsScanning] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        startCamera()
        return () => {
            stopCamera()
        }
    }, [])

    const startCamera = async () => {
        try {
            setError('')
            setIsScanning(true)

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment', // Use back camera on mobile
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            })

            streamRef.current = stream
            videoRef.current.srcObject = stream

            // Start scanning after video loads
            videoRef.current.onloadedmetadata = () => {
                startQRScanning()
            }
        } catch (err) {
            console.error('Error accessing camera:', err)
            setError('Unable to access camera. Please check permissions.')
            setIsScanning(false)
        }
    }

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop())
            streamRef.current = null
        }
        setIsScanning(false)
    }

    const startQRScanning = () => {
        const video = videoRef.current
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        const scanFrame = () => {
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                canvas.width = video.videoWidth
                canvas.height = video.videoHeight
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
                const qrCode = jsQR(imageData.data, imageData.width, imageData.height)

                if (qrCode) {
                    onScan(qrCode.data)
                    stopCamera()
                    return
                }
            }

            if (isScanning) {
                requestAnimationFrame(scanFrame)
            }
        }

        scanFrame()
    }

    const handleRetry = () => {
        stopCamera()
        startCamera()
    }

    return (
        <div className="qr-scanner">
            <div className="scanner-container">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="scanner-video"
                />
                <canvas
                    ref={canvasRef}
                    className="scanner-canvas"
                    style={{ display: 'none' }}
                />

                {isScanning && (
                    <div className="scanner-overlay">
                        <div className="scanner-frame">
                            <div className="corner top-left"></div>
                            <div className="corner top-right"></div>
                            <div className="corner bottom-left"></div>
                            <div className="corner bottom-right"></div>
                        </div>
                        <p className="scanner-text">Position QR code within the frame</p>
                    </div>
                )}
            </div>

            {error && (
                <div className="scanner-error">
                    <p>{error}</p>
                    <button onClick={handleRetry} className="retry-button">
                        Try Again
                    </button>
                </div>
            )}

            {!isScanning && !error && (
                <div className="scanner-controls">
                    <button onClick={startCamera} className="start-button">
                        Start Scanning
                    </button>
                </div>
            )}
        </div>
    )
}

export default QRScanner
