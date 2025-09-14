import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Signup.css'

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        rollNumber: '',
        class: '',
        phone: '',
        parentEmail: '',
        role: 'student'
    })
    const [errors, setErrors] = useState({})

    const { register, user, loading, error, clearError } = useAuth()
    const navigate = useNavigate()

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate('/dashboard')
        }
    }, [user, navigate])

    // Clear errors when component mounts
    useEffect(() => {
        clearError()
    }, [clearError])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required'
        }

        if (!formData.email) {
            newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid'
        }

        if (!formData.password) {
            newErrors.password = 'Password is required'
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
        }

        if (!formData.rollNumber.trim()) {
            newErrors.rollNumber = 'Roll number is required'
        }

        if (!formData.class.trim()) {
            newErrors.class = 'Class is required'
        }

        if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = 'Phone number must be 10 digits'
        }

        if (formData.parentEmail && !/\S+@\S+\.\S+/.test(formData.parentEmail)) {
            newErrors.parentEmail = 'Parent email is invalid'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        const { confirmPassword, ...userData } = formData
        const result = await register(userData)

        if (result.success) {
            navigate('/dashboard')
        }
    }

    return (
        <div className="signup-container">
            <div className="signup-card">
                <div className="signup-header">
                    <h1>Smart QR Attendance</h1>
                    <p>Create your account</p>
                </div>

                <form onSubmit={handleSubmit} className="signup-form">
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={errors.name ? 'error' : ''}
                                placeholder="Enter your full name"
                                disabled={loading}
                            />
                            {errors.name && <span className="field-error">{errors.name}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="rollNumber">Roll Number</label>
                            <input
                                type="text"
                                id="rollNumber"
                                name="rollNumber"
                                value={formData.rollNumber}
                                onChange={handleChange}
                                className={errors.rollNumber ? 'error' : ''}
                                placeholder="Enter your roll number"
                                disabled={loading}
                            />
                            {errors.rollNumber && <span className="field-error">{errors.rollNumber}</span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'error' : ''}
                            placeholder="Enter your email"
                            disabled={loading}
                        />
                        {errors.email && <span className="field-error">{errors.email}</span>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={errors.password ? 'error' : ''}
                                placeholder="Create a password"
                                disabled={loading}
                            />
                            {errors.password && <span className="field-error">{errors.password}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={errors.confirmPassword ? 'error' : ''}
                                placeholder="Confirm your password"
                                disabled={loading}
                            />
                            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="class">Class</label>
                            <input
                                type="text"
                                id="class"
                                name="class"
                                value={formData.class}
                                onChange={handleChange}
                                className={errors.class ? 'error' : ''}
                                placeholder="Enter your class"
                                disabled={loading}
                            />
                            {errors.class && <span className="field-error">{errors.class}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Phone Number (Optional)</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={errors.phone ? 'error' : ''}
                                placeholder="Enter your phone number"
                                disabled={loading}
                            />
                            {errors.phone && <span className="field-error">{errors.phone}</span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="parentEmail">Parent Email (Optional)</label>
                        <input
                            type="email"
                            id="parentEmail"
                            name="parentEmail"
                            value={formData.parentEmail}
                            onChange={handleChange}
                            className={errors.parentEmail ? 'error' : ''}
                            placeholder="Enter parent's email"
                            disabled={loading}
                        />
                        {errors.parentEmail && <span className="field-error">{errors.parentEmail}</span>}
                    </div>

                    <button
                        type="submit"
                        className="signup-button"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="signup-footer">
                    <p>
                        Already have an account?
                        <Link to="/login" className="link"> Sign in here</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Signup
