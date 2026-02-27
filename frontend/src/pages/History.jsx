import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';

const History = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/history/${username}`);
        setRecords(res.data);
      } catch (err) {
        console.error("Failed to fetch history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [username]);

  const filteredRecords = records.filter((rec) =>
    rec.patient_name.toLowerCase().includes(query.toLowerCase()) ||
    rec.patient_id.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 max-w-6xl">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Scan History
        </h1>

        {/* Search Input */}
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm flex items-center border border-slate-200 w-60">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            placeholder="Search records..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="outline-none text-sm w-full"
          />
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 text-lg">
          Loading records...
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-2xl shadow-lg border border-slate-100">
          <p className="text-gray-500 text-lg">
            No records found for Dr. {username}.
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Try uploading a CT scan from the dashboard.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-semibold text-gray-700 text-sm uppercase">Date</th>
                  <th className="p-4 font-semibold text-gray-700 text-sm uppercase">Patient Name</th>
                  <th className="p-4 font-semibold text-gray-700 text-sm uppercase">ID</th>
                  <th className="p-4 font-semibold text-gray-700 text-sm uppercase">Diagnosis</th>
                  <th className="p-4 font-semibold text-gray-700 text-sm uppercase">Confidence</th>
                  <th className="p-4 font-semibold text-gray-700 text-sm uppercase">Risk</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((rec) => (
                  <tr
                    key={rec._id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                      {rec.scan_date}
                    </td>

                    <td className="p-4 font-semibold text-slate-800">
                      {rec.patient_name}
                    </td>

                    <td className="p-4 text-sm text-gray-500">
                      {rec.patient_id}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                          rec.diagnosis.includes("Malignant")
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {rec.diagnosis}
                      </span>
                    </td>

                    <td className="p-4 text-sm text-gray-600">
                      {rec.confidence}
                    </td>

                    <td className="p-4">
                      <span
                        className={`text-xs font-bold ${
                          rec.risk_level === "High"
                            ? "text-red-600"
                            : "text-blue-700"
                        }`}
                      >
                        {rec.risk_level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
