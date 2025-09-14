# Smart QR Attendance - Frontend Setup

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
Create a `.env` file in the root directory with:
```
VITE_API_URL=http://localhost:8008/api
```

### 3. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation bar
│   ├── QRScanner.jsx   # QR code scanner
│   └── SelfieCapture.jsx # Selfie capture component
├── pages/              # Page components
│   ├── Login.jsx       # Login page
│   ├── Signup.jsx      # Registration page
│   ├── Dashboard.jsx   # Main dashboard
│   ├── Attendance.jsx  # Student attendance marking
│   ├── TeacherDashboard.jsx # Teacher QR generation
│   └── Report.jsx      # Attendance reports
├── context/            # React context
│   └── Auth.jsx        # Authentication context
├── hooks/              # Custom hooks
│   └── useAuth.js      # Authentication hook
├── services/           # API services
│   └── api.js          # Axios API configuration
└── styles/             # CSS files
    ├── App.css         # Global styles
    └── index.css       # Base styles
```

## 🎨 Features

### For Students:
- **Login/Signup** - Secure authentication
- **Mark Attendance** - Scan QR code and take selfie
- **Dashboard** - View attendance statistics
- **Reports** - View attendance history

### For Teachers:
- **Generate QR Codes** - Create 6-digit codes and QR codes
- **Class Management** - Select classes for attendance
- **Real-time Stats** - View attendance statistics
- **Reports** - Comprehensive attendance reports

### For Admins:
- **User Management** - Manage all users
- **Reports** - System-wide attendance reports
- **Analytics** - Detailed attendance analytics

## 🔧 Technologies Used

- **React 19** - Frontend framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **QRCode** - QR code generation
- **jsQR** - QR code scanning
- **React Webcam** - Camera access
- **CSS3** - Modern styling with gradients

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes

## 🔐 Security Features

- JWT token authentication
- Protected routes
- Role-based access control
- Secure API communication
- Input validation

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🐛 Troubleshooting

### Common Issues:

1. **Camera not working**: Ensure HTTPS or localhost
2. **QR scanning issues**: Check camera permissions
3. **API connection errors**: Verify backend is running
4. **Build errors**: Clear node_modules and reinstall

### Environment Variables:
- `VITE_API_URL` - Backend API URL (default: http://localhost:8008/api)

## 📞 Support

For issues or questions, check the console for error messages and ensure the backend is running properly.
