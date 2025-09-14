import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import QRCode from 'qrcode'
import './TeacherDashboard.css'

const TeacherDashboard = () => {
    const { user } = useAuth()
    const [isGenerating, setIsGenerating] = useState(false)
    const [currentCode, setCurrentCode] = useState('')
    const [qrCodeData, setQrCodeData] = useState('')
    const [timeLeft, setTimeLeft] = useState(0)
    const [isActive, setIsActive] = useState(false)
    const [attendanceList, setAttendanceList] = useState([])
    const [selectedClass, setSelectedClass] = useState('')

    // Generate 6-digit code
    const generateCode = () => {
        const code = Math.floor(100000 + Math.random() * 900000).toString()
        return code
    }

    // Generate QR code
    const generateQRCode = async (code) => {
        try {
            const qrData = {
                code: code,
                teacherId: user._id,
                class: selectedClass,
                timestamp: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 60000).toISOString() // 60 seconds
            }

            const qrString = JSON.stringify(qrData)
            const qrCodeUrl = await QRCode.toDataURL(qrString, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            })

            return qrCodeUrl
        } catch (error) {
            console.error('Error generating QR code:', error)
            throw error
        }
    }

    // Start attendance session
    const startAttendance = async () => {
        if (!selectedClass) {
            alert('Please select a class first')
            return
        }

        setIsGenerating(true)
        try {
            const code = generateCode()
            const qrCodeUrl = await generateQRCode(code)

            setCurrentCode(code)
            setQrCodeData(qrCodeUrl)
            setIsActive(true)
            setTimeLeft(60) // 60 seconds

            // Start countdown
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timer)
                        setIsActive(false)
                        setCurrentCode('')
                        setQrCodeData('')
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)

        } catch (error) {
            console.error('Error starting attendance:', error)
            alert('Failed to start attendance session')
        } finally {
            setIsGenerating(false)
        }
    }

    // Stop attendance session
    const stopAttendance = () => {
        setIsActive(false)
        setCurrentCode('')
        setQrCodeData('')
        setTimeLeft(0)
    }

    // Format time display
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="teacher-dashboard">
            <div className="teacher-header">
                <h1>Teacher Dashboard</h1>
                <p>Generate QR codes for student attendance</p>
            </div>

            <div className="teacher-content">
                <div className="attendance-controls">
                    <div className="class-selection">
                        <label htmlFor="classSelect">Select Class:</label>
                        <select
                            id="classSelect"
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            disabled={isActive}
                        >
                            <option value="">Choose a class</option>
                            <option value="Class A">Class A</option>
                            <option value="Class B">Class B</option>
                            <option value="Class C">Class C</option>
                            <option value="Class D">Class D</option>
                        </select>
                    </div>

                    <div className="control-buttons">
                        {!isActive ? (
                            <button
                                className="start-button"
                                onClick={startAttendance}
                                disabled={isGenerating || !selectedClass}
                            >
                                {isGenerating ? 'Generating...' : 'Start Attendance'}
                            </button>
                        ) : (
                            <button
                                className="stop-button"
                                onClick={stopAttendance}
                            >
                                Stop Attendance
                            </button>
                        )}
                    </div>
                </div>

                {isActive && (
                    <div className="attendance-session">
                        <div className="code-display">
                            <h2>6-Digit Code</h2>
                            <div className="code-container">
                                <span className="code-number">{currentCode}</span>
                            </div>
                            <div className="timer">
                                <span className="time-left">Time Left: {formatTime(timeLeft)}</span>
                            </div>
                        </div>

                        <div className="qr-display">
                            <h2>QR Code</h2>
                            <div className="qr-container">
                                {qrCodeData && (
                                    <img
                                        src={qrCodeData}
                                        alt="QR Code for attendance"
                                        className="qr-image"
                                    />
                                )}
                            </div>
                            <p className="qr-instructions">
                                Students should scan this QR code with their phones
                            </p>
                        </div>
                    </div>
                )}

                <div className="attendance-stats">
                    <h2>Today's Attendance</h2>
                    <div className="stats-grid">
                        <div className="stat-item">
                            <span className="stat-number">0</span>
                            <span className="stat-label">Total Students</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">0</span>
                            <span className="stat-label">Present</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">0</span>
                            <span className="stat-label">Absent</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">0</span>
                            <span className="stat-label">Late</span>
                        </div>
                    </div>
                </div>

                <div className="recent-attendance">
                    <h2>Recent Attendance</h2>
                    <div className="attendance-list">
                        {attendanceList.length === 0 ? (
                            <p className="no-data">No attendance records yet</p>
                        ) : (
                            attendanceList.map((record, index) => (
                                <div key={index} className="attendance-record">
                                    <span className="student-name">{record.studentName}</span>
                                    <span className="attendance-time">{record.time}</span>
                                    <span className={`attendance-status ${record.status}`}>
                                        {record.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TeacherDashboard
