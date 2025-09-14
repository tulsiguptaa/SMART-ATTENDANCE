import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Navbar.css'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    const isActive = (path) => {
        return location.pathname === path
    }

    if (!user) {
        return null // Don't show navbar on login/signup pages
    }

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/dashboard" className="navbar-brand">
                    <h2>Smart QR Attendance</h2>
                </Link>

                <div className="navbar-menu">
                    <div className="navbar-nav">
                        <Link
                            to="/dashboard"
                            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                        >
                            Dashboard
                        </Link>

                        {user.role === 'student' && (
                            <Link
                                to="/attendance"
                                className={`nav-link ${isActive('/attendance') ? 'active' : ''}`}
                            >
                                Mark Attendance
                            </Link>
                        )}

                        {(user.role === 'teacher' || user.role === 'admin') && (
                            <Link
                                to="/teacher"
                                className={`nav-link ${isActive('/teacher') ? 'active' : ''}`}
                            >
                                Teacher Panel
                            </Link>
                        )}

                        <Link
                            to="/report"
                            className={`nav-link ${isActive('/report') ? 'active' : ''}`}
                        >
                            Reports
                        </Link>
                    </div>

                    <div className="navbar-user">
                        <div className="user-info">
                            <span className="user-name">{user.name}</span>
                            <span className="user-role">{user.role}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="logout-button"
                        >
                            Logout
                        </button>
                    </div>

                    <button
                        className="menu-toggle"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="mobile-menu">
                        <Link
                            to="/dashboard"
                            className={`mobile-nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Dashboard
                        </Link>

                        {user.role === 'student' && (
                            <Link
                                to="/attendance"
                                className={`mobile-nav-link ${isActive('/attendance') ? 'active' : ''}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Mark Attendance
                            </Link>
                        )}

                        {(user.role === 'teacher' || user.role === 'admin') && (
                            <Link
                                to="/teacher"
                                className={`mobile-nav-link ${isActive('/teacher') ? 'active' : ''}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Teacher Panel
                            </Link>
                        )}

                        <Link
                            to="/report"
                            className={`mobile-nav-link ${isActive('/report') ? 'active' : ''}`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Reports
                        </Link>

                        <div className="mobile-user-info">
                            <div className="user-details">
                                <span className="user-name">{user.name}</span>
                                <span className="user-role">{user.role}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="mobile-logout-button"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar
