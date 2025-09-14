import api from "./api.js"; // import the axios instance

// ---- Attendance APIs ---- //

// Mark attendance with QR + selfie + studentId
export const markAttendance = async ({ qrData, selfie, studentId }) => {
  try {
    const res = await api.post("/attendance/mark", { qrData, selfie, studentId });
    return res.data;
  } catch (error) {
    console.error("Error marking attendance:", error);
    throw error;
  }
};

// Get attendance history for the logged-in user
export const getAttendanceHistory = async () => {
  try {
    const res = await api.get("/attendance/history");
    return res.data;
  } catch (error) {
    console.error("Error fetching attendance history:", error);
    throw error;
  }
};

// Get all attendance records (for teacher/admin dashboard)
export const getAllAttendanceRecords = async () => {
  try {
    const res = await api.get("/attendance/all");
    return res.data;
  } catch (error) {
    console.error("Error fetching all attendance records:", error);
    throw error;
  }
};
