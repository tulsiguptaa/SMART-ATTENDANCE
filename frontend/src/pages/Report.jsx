import React, { useEffect, useState } from "react";
import axios from "axios";

const Report = () => {
  const [reportData, setReportData] = useState([]);
  const [summary, setSummary] = useState({ total: 0, present: 0, absent: 0 });
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReport = async (date = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8008/api/attendance/report", {
        headers: { Authorization: `Bearer ${token}` },
        params: { date },
      });

      setReportData(res.data.records || []);
      setSummary(res.data.summary || { total: 0, present: 0, absent: 0 });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch report. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleFilterChange = (e) => {
    setDateFilter(e.target.value);
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchReport(dateFilter);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Attendance Reports</h1>

      {/* Filter */}
      <form
        className="flex items-center space-x-2 mb-6"
        onSubmit={handleFilterSubmit}
      >
        <input
          type="date"
          value={dateFilter}
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

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded p-4 text-center">
          <p className="text-gray-500">Total Students</p>
          <p className="text-xl font-bold">{summary.total}</p>
        </div>
        <div className="bg-white shadow rounded p-4 text-center">
          <p className="text-green-500">Present</p>
          <p className="text-xl font-bold">{summary.present}</p>
        </div>
        <div className="bg-white shadow rounded p-4 text-center">
          <p className="text-red-500">Absent</p>
          <p className="text-xl font-bold">{summary.absent}</p>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : reportData.length === 0 ? (
          <p className="text-center text-gray-500">No records found.</p>
        ) : (
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
              {reportData.map((record, idx) => (
                <tr key={idx} className="text-center">
                  <td className="px-4 py-2 border">{record.rollNumber}</td>
                  <td className="px-4 py-2 border">{record.name}</td>
                  <td
                    className={`px-4 py-2 border font-medium ${
                      record.status === "Present" ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {record.status}
                  </td>
                  <td className="px-4 py-2 border">{record.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Report;
