import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { attendanceAPI } from '../services/api'
import './Report.css'

const Report = () => {
    const { user } = useAuth()
    const [attendanceData, setAttendanceData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        dateFrom: '',
        dateTo: '',
        class: '',
        status: ''
    })
    const [stats, setStats] = useState({
        totalRecords: 0,
        presentCount: 0,
        absentCount: 0,
        lateCount: 0,
        attendanceRate: 0
    })

    useEffect(() => {
        fetchAttendanceData()
    }, [])

    useEffect(() => {
        applyFilters()
    }, [attendanceData, filters])

    const fetchAttendanceData = async () => {
        try {
            setLoading(true)
            let response

            if (user.role === 'student') {
                response = await attendanceAPI.getUserAttendanceHistory(user._id)
            } else {
                response = await attendanceAPI.getAllAttendance()
            }

            setAttendanceData(response.data)
        } catch (error) {
            console.error('Error fetching attendance data:', error)
        } finally {
            setLoading(false)
        }
    }

    const applyFilters = () => {
        let filtered = [...attendanceData]

        if (filters.dateFrom) {
            filtered = filtered.filter(record =>
                new Date(record.date) >= new Date(filters.dateFrom)
            )
        }

        if (filters.dateTo) {
            filtered = filtered.filter(record =>
                new Date(record.date) <= new Date(filters.dateTo)
            )
        }

        if (filters.class) {
            filtered = filtered.filter(record =>
                record.class === filters.class
            )
        }

        if (filters.status) {
            filtered = filtered.filter(record =>
                record.status === filters.status
            )
        }

        setFilteredData(filtered)
        calculateStats(filtered)
    }

    const calculateStats = (data) => {
        const totalRecords = data.length
        const presentCount = data.filter(record => record.status === 'present').length
        const absentCount = data.filter(record => record.status === 'absent').length
        const lateCount = data.filter(record => record.status === 'late').length
        const attendanceRate = totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0

        setStats({
            totalRecords,
            presentCount,
            absentCount,
            lateCount,
            attendanceRate
        })
    }

    const handleFilterChange = (e) => {
        const { name, value } = e.target
        setFilters(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const clearFilters = () => {
        setFilters({
            dateFrom: '',
            dateTo: '',
            class: '',
            status: ''
        })
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

    const exportToCSV = () => {
        const headers = ['Date', 'Class', 'Student', 'Status', 'QR Code', 'Verified']
        const csvContent = [
            headers.join(','),
            ...filteredData.map(record => [
                formatDate(record.date),
                record.class,
                record.userId?.name || 'Unknown',
                record.status,
                record.qrCodeUsed,
                record.verified ? 'Yes' : 'No'
            ].join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `attendance-report-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
    }

    if (loading) {
        return (
            <div className="report-loading">
                <div className="loading-spinner"></div>
                <p>Loading reports...</p>
            </div>
        )
    }

    return (
        <div className="report-page">
            <div className="report-header">
                <h1>Attendance Reports</h1>
                <p>View and analyze attendance data</p>
            </div>

            <div className="report-stats">
                <div className="stat-card">
                    <h3>{stats.attendanceRate}%</h3>
                    <p>Attendance Rate</p>
                </div>
                <div className="stat-card">
                    <h3>{stats.totalRecords}</h3>
                    <p>Total Records</p>
                </div>
                <div className="stat-card">
                    <h3>{stats.presentCount}</h3>
                    <p>Present</p>
                </div>
                <div className="stat-card">
                    <h3>{stats.absentCount}</h3>
                    <p>Absent</p>
                </div>
                <div className="stat-card">
                    <h3>{stats.lateCount}</h3>
                    <p>Late</p>
                </div>
            </div>

            <div className="report-filters">
                <h2>Filters</h2>
                <div className="filter-grid">
                    <div className="filter-group">
                        <label htmlFor="dateFrom">From Date:</label>
                        <input
                            type="date"
                            id="dateFrom"
                            name="dateFrom"
                            value={filters.dateFrom}
                            onChange={handleFilterChange}
                        />
                    </div>

                    <div className="filter-group">
                        <label htmlFor="dateTo">To Date:</label>
                        <input
                            type="date"
                            id="dateTo"
                            name="dateTo"
                            value={filters.dateTo}
                            onChange={handleFilterChange}
                        />
                    </div>

                    <div className="filter-group">
                        <label htmlFor="class">Class:</label>
                        <select
                            id="class"
                            name="class"
                            value={filters.class}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Classes</option>
                            <option value="Class A">Class A</option>
                            <option value="Class B">Class B</option>
                            <option value="Class C">Class C</option>
                            <option value="Class D">Class D</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="status">Status:</label>
                        <select
                            id="status"
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Status</option>
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                            <option value="late">Late</option>
                        </select>
                    </div>
                </div>

                <div className="filter-actions">
                    <button onClick={clearFilters} className="clear-filters-button">
                        Clear Filters
                    </button>
                    <button onClick={exportToCSV} className="export-button">
                        Export CSV
                    </button>
                </div>
            </div>

            <div className="report-table">
                <h2>Attendance Records</h2>

                {filteredData.length === 0 ? (
                    <div className="no-data">
                        <p>No attendance records found</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="attendance-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Class</th>
                                    {user.role !== 'student' && <th>Student</th>}
                                    <th>Status</th>
                                    <th>QR Code</th>
                                    <th>Verified</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((record, index) => (
                                    <tr key={record._id || index}>
                                        <td>{formatDate(record.date)}</td>
                                        <td>{record.class}</td>
                                        {user.role !== 'student' && (
                                            <td>{record.userId?.name || 'Unknown'}</td>
                                        )}
                                        <td>
                                            <span className={`status-badge ${getStatusColor(record.status)}`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td>{record.qrCodeUsed}</td>
                                        <td>
                                            <span className={`verified-badge ${record.verified ? 'verified' : 'not-verified'}`}>
                                                {record.verified ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                        <td>{new Date(record.createdAt).toLocaleTimeString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Report
