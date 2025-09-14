import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { CalendarDays, QrCode, Users, FileText } from "lucide-react";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState({});
  const [summary, setSummary] = useState({ total: 0, present: 0, absent: 0 });
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        // Teacher profile
        const teacherRes = await axios.get("http://localhost:8008/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeacher(teacherRes.data.user);

        // Summary of class attendance
        const summaryRes = await axios.get("http://localhost:8008/api/attendance/class-summary", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSummary(summaryRes.data.summary);

        // Recent attendance
        const recentRes = await axios.get("http://localhost:8008/api/attendance/recent", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecentAttendance(recentRes.data.records);

        // Full report
        const reportRes = await axios.get("http://localhost:8008/api/attendance/report", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReportData(reportRes.data.records);
      } catch (err) {
        console.error("Teacher Dashboard Error:", err.message);
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    setFilterDate(e.target.value);
  };

  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8008/api/attendance/report", {
        headers: { Authorization: `Bearer ${token}` },
        params: { date: filterDate },
      });
      setReportData(res.data.records);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {teacher.name}</h1>
          <p className="text-gray-600 capitalize">{teacher.role}</p>
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
          <Users className="text-blue-500 w-8 h-8" />
          <div>
            <p className="text-sm text-gray-500">Total Students</p>
            <p className="text-xl font-bold">{summary.total}</p>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4 flex items-center space-x-4">
          <CalendarDays className="text-green-500 w-8 h-8" />
          <div>
            <p className="text-sm text-gray-500">Present</p>
            <p className="text-xl font-bold">{summary.present}</p>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4 flex items-center space-x-4">
          <CalendarDays className="text-red-500 w-8 h-8" />
          <div>
            <p className="text-sm text-gray-500">Absent</p>
            <p className="text-xl font-bold">{summary.absent}</p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => navigate("/attendance")}
          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <QrCode className="w-5 h-5" />
          <span>Mark Attendance</span>
        </button>
        <button
          onClick={() => navigate("/report")}
          className="flex items-center space-x-2 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          <FileText className="w-5 h-5" />
          <span>View Reports</span>
        </button>
      </div>

      {/* Recent Attendance */}
      <div className="bg-white shadow rounded-lg p-4 mb-8">
        <h2 className="text-lg font-bold mb-4">Recent Attendance</h2>
        <ul>
          {recentAttendance.length > 0 ? (
            recentAttendance.map((rec, idx) => (
              <li
                key={idx}
                className="flex justify-between border-b py-2 text-gray-700"
              >
                <span>{rec.name}</span>
                <span
                  className={`font-medium ${
                    rec.status === "Present" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {rec.status}
                </span>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No recent records.</p>
          )}
        </ul>
      </div>

      {/* Full Report Table */}
      <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
        <h2 className="text-lg font-bold mb-4">Attendance Report</h2>
        <form
          className="flex items-center space-x-2 mb-4"
          onSubmit={handleFilterSubmit}
        >
          <input
            type="date"
            value={filterDate}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Filter
          </button>
        </form>

        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 border">Roll Number</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {reportData.length > 0 ? (
              reportData.map((rec, idx) => (
                <tr key={idx} className="text-center">
                  <td className="px-4 py-2 border">{rec.rollNumber}</td>
                  <td className="px-4 py-2 border">{rec.name}</td>
                  <td
                    className={`px-4 py-2 border font-medium ${
                      rec.status === "Present" ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {rec.status}
                  </td>
                  <td className="px-4 py-2 border">{rec.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 text-gray-500 text-center">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherDashboard;
