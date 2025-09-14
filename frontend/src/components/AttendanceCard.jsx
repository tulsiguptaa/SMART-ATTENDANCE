import React from "react";
import { UserCheck, UserX } from "lucide-react";

/**
 * AttendanceCard
 * @param {string} name - Student name
 * @param {string} rollNumber - Student roll number
 * @param {string} status - "Present" or "Absent"
 * @param {string} date - Date of attendance (optional)
 */
const AttendanceCard = ({ name, rollNumber, status, date }) => {
  const isPresent = status === "Present";

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg shadow-md ${
        isPresent ? "bg-green-100" : "bg-red-100"
      }`}
    >
      <div className="flex items-center space-x-4">
        {isPresent ? (
          <UserCheck className="text-green-600 w-6 h-6" />
        ) : (
          <UserX className="text-red-600 w-6 h-6" />
        )}
        <div>
          <p className="font-semibold text-gray-800">{name}</p>
          <p className="text-sm text-gray-600">Roll: {rollNumber}</p>
          {date && <p className="text-xs text-gray-500">{date}</p>}
        </div>
      </div>
      <span
        className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
          isPresent ? "bg-green-600" : "bg-red-600"
        }`}
      >
        {status}
      </span>
    </div>
  );
};

export default AttendanceCard;
