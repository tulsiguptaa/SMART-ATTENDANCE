import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { attendanceAPI } from '../services/api'
import './Dashboard.css'

const Dashboard = () => {
    const { user } = useAuth()
    const [attendanceStats, setAttendanceStats] = useState({
        totalDays: 0,
        presentDays: 0,
        absentDays: 0,
        lateDays: 0,
        percentage: 0
    })
    const [recentAttendance, setRecentAttendance] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAttendanceData()
    }, [])

    const fetchAttendanceData = async () => {
        try {
            setLoading(true)

            if (user.role === 'student') {
                // Get student's attendance history
                const response = await attendanceAPI.getUserAttendanceHistory(user._id)
                const attendanceData = response.data

                // Calculate statistics
                const totalDays = attendanceData.length
                const presentDays = attendanceData.filter(record => record.status === 'present').length
                const absentDays = attendanceData.filter(record => record.status === 'absent').length
                const lateDays = attendanceData.filter(record => record.status === 'late').length
                const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0

                setAttendanceStats({
                    totalDays,
                    presentDays,
                    absentDays,
                    lateDays,
                    percentage
                })

                // Get recent attendance (last 10 records)
                setRecentAttendance(attendanceData.slice(0, 10))
            } else {
                // For teachers/admins, get today's attendance
                const response = await attendanceAPI.getTodayAttendance()
                setRecentAttendance(response.data)
            }
        } catch (error) {
            console.error('Error fetching attendance data:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'present': return 'status-present'
            case 'absent': return 'status-absent'
            case 'late': return 'status-late'
            default: return 'status-unknown'
        }
    }

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        )
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Welcome back, {user.name}!</h1>
                <p className="dashboard-subtitle">
                    {user.role === 'student'
                        ? 'Track your attendance and stay updated'
                        : 'Manage attendance and monitor students'
                    }
                </p>
            </div>

            {user.role === 'student' && (
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">📊</div>
                        <div className="stat-content">
                            <h3>{attendanceStats.percentage}%</h3>
                            <p>Attendance Rate</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-content">
                            <h3>{attendanceStats.presentDays}</h3>
                            <p>Present Days</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">❌</div>
                        <div className="stat-content">
                            <h3>{attendanceStats.absentDays}</h3>
                            <p>Absent Days</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">⏰</div>
                        <div className="stat-content">
                            <h3>{attendanceStats.lateDays}</h3>
                            <p>Late Days</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="dashboard-content">
                <div className="attendance-section">
                    <h2>
                        {user.role === 'student' ? 'Recent Attendance' : 'Today\'s Attendance'}
                    </h2>

                    {recentAttendance.length === 0 ? (
                        <div className="no-data">
                            <p>No attendance records found</p>
                        </div>
                    ) : (
                        <div className="attendance-list">
                            {recentAttendance.map((record, index) => (
                                <div key={record._id || index} className="attendance-item">
                                    <div className="attendance-date">
                                        {formatDate(record.date)}
                                    </div>
                                    <div className="attendance-details">
                                        <span className="attendance-class">{record.class}</span>
                                        {user.role !== 'student' && (
                                            <span className="attendance-user">{record.userId?.name || 'Unknown'}</span>
                                        )}
                                    </div>
                                    <div className={`attendance-status ${getStatusColor(record.status)}`}>
                                        {record.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="quick-actions">
                    <h2>Quick Actions</h2>
                    <div className="action-buttons">
                        {user.role === 'student' && (
                            <button
                                className="action-button primary"
                                onClick={() => window.location.href = '/attendance'}
                            >
                                Mark Attendance
                            </button>
                        )}

                        {(user.role === 'teacher' || user.role === 'admin') && (
                            <button
                                className="action-button primary"
                                onClick={() => window.location.href = '/teacher'}
                            >
                                Generate QR Code
                            </button>
                        )}

                        <button
                            className="action-button secondary"
                            onClick={() => window.location.href = '/report'}
                        >
                            View Reports
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
