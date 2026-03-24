import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FileText } from 'lucide-react';

const History = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const username = localStorage.getItem('username');
        const res = await axios.get(`http://localhost:5000/history/${username}`);
        setRecords(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-7xl">

      {/* Header */}
      <h1 className="text-3xl font-bold text-sky-700 mb-6 flex items-center gap-2">
        <FileText /> Patient History
      </h1>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-sky-100 overflow-hidden">

        {records.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            No records found
          </div>
        ) : (
          <table className="w-full text-sm text-left">

            {/* Table Head */}
            <thead className="bg-sky-100 text-sky-700">
              <tr>
                <th className="p-4">Patient</th>
                <th className="p-4">ID</th>
                <th className="p-4">Diagnosis</th>
                <th className="p-4">Confidence</th>
                <th className="p-4">Stage</th>
                <th className="p-4">Risk</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {records.map((rec) => (
                <tr key={rec._id} className="border-t hover:bg-sky-50 transition">

                  <td className="p-4 font-medium">{rec.patient_name}</td>
                  <td className="p-4">{rec.patient_id}</td>

                  {/* Diagnosis */}
                  <td className={`p-4 font-semibold ${
                    rec.diagnosis.includes("Malignant")
                      ? "text-red-600"
                      : "text-sky-600"
                  }`}>
                    {rec.diagnosis}
                  </td>

                  {/* Confidence */}
                  <td className="p-4">{rec.model_confidence}</td>

                  {/* Stage */}
                  <td className="p-4">
                    {rec.stage ? rec.stage : "-"}
                  </td>

                  {/* Risk */}
                  <td className={`p-4 font-bold ${
                    rec.risk_level === "High"
                      ? "text-red-600"
                      : "text-sky-600"
                  }`}>
                    {rec.risk_level}
                  </td>

                  {/* Date */}
                  <td className="p-4 text-gray-500">
                    {rec.scan_date}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}
      </div>
    </div>
  );
};

export default History;