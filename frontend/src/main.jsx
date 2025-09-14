import App from './App.jsx'
import React from 'react';
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from "./hooks/useAuth.jsx";

createRoot(document.getElementById('root')).render(
   <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
