import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CalendarDays, QrCode, UserCircle } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [attendanceSummary, setAttendanceSummary] = useState({
    total: 0,
    present: 0,
    absent: 0,
  });
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userRes = await axios.get("http://localhost:8008/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data.user);

        const summaryRes = await axios.get("http://localhost:8008/api/attendance/summary", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAttendanceSummary(summaryRes.data.summary);

        const recentRes = await axios.get("http://localhost:8008/api/attendance/recent", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecentAttendance(recentRes.data.records);

        // Format trend data for chart
        const trend = summaryRes.data.trend || [];
        setTrendData(trend);
      } catch (error) {
        console.error("Dashboard Error:", error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user?.name || "User"}
          </h1>
          <p className="text-gray-600 capitalize">{user?.role || "student"}</p>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white shadow rounded-lg p-4 flex items-center space-x-4">
          <CalendarDays className="text-blue-500 w-8 h-8" />
          <div>
            <p className="text-sm text-gray-500">Total Days</p>
            <p className="text-xl font-bold">{attendanceSummary.total}</p>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4 flex items-center space-x-4">
          <CalendarDays className="text-green-500 w-8 h-8" />
          <div>
            <p className="text-sm text-gray-500">Present</p>
            <p className="text-xl font-bold">{attendanceSummary.present}</p>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4 flex items-center space-x-4">
          <CalendarDays className="text-red-500 w-8 h-8" />
          <div>
            <p className="text-sm text-gray-500">Absent</p>
            <p className="text-xl font-bold">{attendanceSummary.absent}</p>
          </div>
        </div>
      </div>

      {/* Attendance Trend Chart */}
      <div className="bg-white shadow rounded-lg p-4 mb-8">
        <h2 className="text-lg font-bold mb-4">Attendance Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <Line type="monotone" dataKey="present" stroke="#3b82f6" strokeWidth={2} />
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="5 5" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Attendance */}
      <div className="bg-white shadow rounded-lg p-4 mb-8">
        <h2 className="text-lg font-bold mb-4">Recent Attendance</h2>
        <ul>
          {recentAttendance.length > 0 ? (
            recentAttendance.map((record, idx) => (
              <li
                key={idx}
                className="flex justify-between border-b py-2 text-gray-700"
              >
                <span>{record.date}</span>
                <span
                  className={`font-medium ${
                    record.status === "Present" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {record.status}
                </span>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No records available.</p>
          )}
        </ul>
      </div>

      {/* Navigation Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => navigate("/attendance")}
          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <QrCode className="w-5 h-5" /> <span>Mark Attendance</span>
        </button>
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center space-x-2 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          <UserCircle className="w-5 h-5" /> <span>Profile</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
