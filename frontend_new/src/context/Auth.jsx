import { createContext, useContext, useReducer, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext()

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_START':
            return { ...state, loading: true, error: null }
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                loading: false,
                user: action.payload.user,
                token: action.payload.token,
                error: null
            }
        case 'LOGIN_FAILURE':
            return { ...state, loading: false, error: action.payload }
        case 'LOGOUT':
            return { ...state, user: null, token: null, error: null }
        case 'CLEAR_ERROR':
            return { ...state, error: null }
        case 'SET_LOADING':
            return { ...state, loading: action.payload }
        case 'UPDATE_USER':
            return { ...state, user: { ...state.user, ...action.payload } }
        default:
            return state
    }
}

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        token: localStorage.getItem('token'),
        loading: true,
        error: null
    })

    // Check if user is logged in on app start
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token')
            if (token) {
                try {
                    const response = await authAPI.getProfile()
                    dispatch({
                        type: 'LOGIN_SUCCESS',
                        payload: { user: response.data.user, token }
                    })
                } catch (error) {
                    console.log('Auth check failed, user not logged in')
                    localStorage.removeItem('token')
                    dispatch({ type: 'LOGOUT' })
                }
            }
            dispatch({ type: 'SET_LOADING', payload: false })
        }
        checkAuth()
    }, [])

    const login = async (email, password) => {
        dispatch({ type: 'LOGIN_START' })
        try {
            const response = await authAPI.login(email, password)
            const { user, token } = response.data

            localStorage.setItem('token', token)
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { user, token }
            })
            return { success: true }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed'
            dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage })
            return { success: false, error: errorMessage }
        }
    }

    const register = async (userData) => {
        dispatch({ type: 'LOGIN_START' })
        try {
            const response = await authAPI.register(userData)
            const { user, token } = response.data

            localStorage.setItem('token', token)
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { user, token }
            })
            return { success: true }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed'
            dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage })
            return { success: false, error: errorMessage }
        }
    }

    const logout = async () => {
        try {
            // Note: Your backend doesn't have a logout endpoint, so we'll just clear local storage
            localStorage.removeItem('token')
            dispatch({ type: 'LOGOUT' })
        } catch (error) {
            console.error('Logout error:', error)
            localStorage.removeItem('token')
            dispatch({ type: 'LOGOUT' })
        }
    }

    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' })
    }

    const updateUser = (userData) => {
        dispatch({ type: 'UPDATE_USER', payload: userData })
    }

    const value = {
        ...state,
        login,
        register,
        logout,
        clearError,
        updateUser
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export default AuthContext