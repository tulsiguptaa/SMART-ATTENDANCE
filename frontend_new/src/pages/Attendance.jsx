import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { attendanceAPI } from '../services/api'
import QRScanner from '../components/QRScanner'
import SelfieCapture from '../components/SelfieCapture'
import './Attendance.css'

const Attendance = () => {
    const { user } = useAuth()
    const [step, setStep] = useState(1) // 1: QR Scan, 2: Selfie, 3: Success
    const [qrData, setQrData] = useState(null)
    const [selfieUrl, setSelfieUrl] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // Handle QR code scan
    const handleQRScan = (data) => {
        try {
            const qrInfo = JSON.parse(data)

            // Validate QR code
            if (!qrInfo.code || !qrInfo.teacherId || !qrInfo.class) {
                setError('Invalid QR code format')
                return
            }

            // Check if QR code is expired
            const now = new Date()
            const expiresAt = new Date(qrInfo.expiresAt)
            if (now > expiresAt) {
                setError('QR code has expired. Please ask your teacher for a new one.')
                return
            }

            // Check if it's for the correct class
            if (qrInfo.class !== user.class) {
                setError('This QR code is not for your class')
                return
            }

            setQrData(qrInfo)
            setStep(2)
            setError('')
        } catch (err) {
            setError('Invalid QR code. Please try again.')
        }
    }

    // Handle selfie capture
    const handleSelfieCapture = (imageUrl) => {
        setSelfieUrl(imageUrl)
        setStep(3)
    }

    // Submit attendance
    const submitAttendance = async () => {
        if (!qrData || !selfieUrl) {
            setError('Missing required data')
            return
        }

        setIsSubmitting(true)
        setError('')

        try {
            const attendanceData = {
                qrCodeUsed: qrData.code,
                class: qrData.class,
                selfieUrl: selfieUrl,
                deviceId: navigator.userAgent, // Simple device identification
                status: 'present'
            }

            const response = await attendanceAPI.markAttendance(attendanceData)

            if (response.data.success) {
                setSuccess('Attendance marked successfully!')
                setStep(4)
            } else {
                setError(response.data.message || 'Failed to mark attendance')
            }
        } catch (err) {
            console.error('Error marking attendance:', err)
            setError(err.response?.data?.message || 'Failed to mark attendance')
        } finally {
            setIsSubmitting(false)
        }
    }

    // Reset form
    const resetForm = () => {
        setStep(1)
        setQrData(null)
        setSelfieUrl('')
        setError('')
        setSuccess('')
    }

    return (
        <div className="attendance-page">
            <div className="attendance-container">
                <div className="attendance-header">
                    <h1>Mark Attendance</h1>
                    <p>Scan the QR code displayed by your teacher</p>
                </div>

                <div className="attendance-steps">
                    <div className={`step ${step >= 1 ? 'active' : ''}`}>
                        <div className="step-number">1</div>
                        <div className="step-label">Scan QR Code</div>
                    </div>
                    <div className={`step ${step >= 2 ? 'active' : ''}`}>
                        <div className="step-number">2</div>
                        <div className="step-label">Take Selfie</div>
                    </div>
                    <div className={`step ${step >= 3 ? 'active' : ''}`}>
                        <div className="step-number">3</div>
                        <div className="step-label">Submit</div>
                    </div>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="success-message">
                        {success}
                    </div>
                )}

                <div className="attendance-content">
                    {step === 1 && (
                        <div className="qr-scan-section">
                            <h2>Step 1: Scan QR Code</h2>
                            <p>Point your camera at the QR code displayed by your teacher</p>

                            <QRScanner onScan={handleQRScan} />

                            <div className="qr-info">
                                <h3>Instructions:</h3>
                                <ul>
                                    <li>Make sure your camera has permission to access</li>
                                    <li>Point the camera at the QR code</li>
                                    <li>Keep the QR code within the scanning area</li>
                                    <li>Wait for the scan to complete automatically</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="selfie-section">
                            <h2>Step 2: Take Selfie</h2>
                            <p>Take a clear selfie for verification</p>

                            <SelfieCapture onCapture={handleSelfieCapture} />

                            <div className="selfie-info">
                                <h3>Instructions:</h3>
                                <ul>
                                    <li>Make sure your face is clearly visible</li>
                                    <li>Look directly at the camera</li>
                                    <li>Ensure good lighting</li>
                                    <li>Click "Capture" when ready</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="submit-section">
                            <h2>Step 3: Submit Attendance</h2>
                            <p>Review your information and submit</p>

                            <div className="attendance-summary">
                                <div className="summary-item">
                                    <label>Class:</label>
                                    <span>{qrData?.class}</span>
                                </div>
                                <div className="summary-item">
                                    <label>QR Code:</label>
                                    <span>{qrData?.code}</span>
                                </div>
                                <div className="summary-item">
                                    <label>Selfie:</label>
                                    <img src={selfieUrl} alt="Selfie preview" className="selfie-preview" />
                                </div>
                            </div>

                            <div className="submit-actions">
                                <button
                                    className="submit-button"
                                    onClick={submitAttendance}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Attendance'}
                                </button>
                                <button
                                    className="back-button"
                                    onClick={() => setStep(2)}
                                    disabled={isSubmitting}
                                >
                                    Back to Selfie
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="success-section">
                            <div className="success-icon">✅</div>
                            <h2>Attendance Marked Successfully!</h2>
                            <p>Your attendance has been recorded. You can now close this page.</p>

                            <button
                                className="new-attendance-button"
                                onClick={resetForm}
                            >
                                Mark Another Attendance
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Attendance
