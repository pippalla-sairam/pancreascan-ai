import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, AlertTriangle, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const [formData, setFormData] = useState({
    name: '', age: '', sex: 'Male', patient_id: '', symptoms: ''
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload a CT Scan image.");

    setLoading(true);
    const data = new FormData();
    data.append('file', file);
    data.append('username', localStorage.getItem('username'));
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));

    try {
      const res = await axios.post('http://localhost:5000/predict', data);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error analyzing image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">

      {/* Header */}
      <h1 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">
        Patient Diagnostics
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* ---- LEFT: INPUT FORM ---- */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 h-fit">
          <h2 className="text-xl font-bold mb-5 flex items-center text-blue-900">
            <FileText className="mr-2" /> Patient Information
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Patient ID */}
            <div>
              <label className="block text-sm text-gray-700 font-medium">Patient ID</label>
              <input
                required name="patient_id"
                type="text"
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg mt-1 bg-slate-50 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                placeholder="e.g., PID-0123"
              />
            </div>

            {/* Name + Age */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 font-medium">Full Name</label>
                <input
                  required name="name"
                  type="text"
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg mt-1 bg-slate-50 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 font-medium">Age</label>
                <input
                  required name="age"
                  type="number"
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg mt-1 bg-slate-50 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Sex */}
            <div>
              <label className="block text-sm text-gray-700 font-medium">Sex</label>
              <select
                name="sex"
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg border mt-1 bg-slate-50 focus:ring-2 focus:ring-blue-600"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            {/* Symptoms */}
            <div>
              <label className="block text-sm text-gray-700 font-medium">Symptoms</label>
              <textarea
                name="symptoms"
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg mt-1 bg-slate-50 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                rows={3}
                placeholder="Abdominal pain, nausea, weight loss..."
              />
            </div>

            {/* CT Scan Upload */}
            <div className="border-2 border-dashed border-blue-300 p-7 rounded-xl text-center hover:bg-blue-50 cursor-pointer transition shadow-sm">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="upload-scan"
              />
              <label htmlFor="upload-scan" className="cursor-pointer block">
                <Upload className="mx-auto h-12 w-12 text-blue-500" />
                <p className="mt-2 text-gray-600">Click to upload CT Scan</p>
              </label>
            </div>

            {/* Preview */}
            {preview && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Preview:</p>
                <img
                  src={preview}
                  alt="Scan Preview"
                  className="h-44 w-full object-cover rounded-lg border shadow-sm"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-lg font-semibold text-white shadow-lg transition
                ${loading ? "bg-slate-400 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-800"}`}
            >
              {loading ? "Analyzing Scan..." : "Run AI Analysis"}
            </button>
          </form>
        </div>

        {/* ---- RIGHT: RESULTS PANEL ---- */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 min-h-[330px]">
            <h2 className="text-xl font-bold mb-5 text-blue-900">Diagnostic Report</h2>

            {result ? (
              <div
                className={`p-6 rounded-xl border-l-4 animate-fade-in shadow-md ${
                  result.diagnosis.includes("Malignant")
                    ? "bg-red-50 border-red-600"
                    : "bg-green-50 border-green-600"
                }`}
              >
                {/* Diagnosis icon & title */}
                <div className="flex items-start mb-6">
                  {result.diagnosis.includes("Malignant") ? (
                    <AlertTriangle className="text-red-600 h-10 w-10 mr-4" />
                  ) : (
                    <CheckCircle className="text-green-600 h-10 w-10 mr-4" />
                  )}

                  <div>
                    <h3
                      className={`text-2xl font-extrabold ${
                        result.diagnosis.includes("Malignant")
                          ? "text-red-700"
                          : "text-green-700"
                      }`}
                    >
                      {result.diagnosis}
                    </h3>
                    <p className="text-gray-700 mt-1 font-medium">
                      AI Confidence: {result.confidence}
                    </p>
                  </div>
                </div>

                {/* Patient Info Grid */}
                <div className="grid grid-cols-2 gap-4 border-t pt-4 text-sm text-gray-700">

                  <div>
                    <p className="text-gray-500">Patient Name</p>
                    <p className="font-semibold">{result.patient_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Patient ID</p>
                    <p className="font-semibold">{result.patient_id}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Risk Assessment</p>
                    <p
                      className={`font-bold ${
                        result.risk_level === "High"
                          ? "text-red-600"
                          : "text-blue-600"
                      }`}
                    >
                      {result.risk_level} Risk
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Scan Date</p>
                    <p className="font-semibold">{result.scan_date}</p>
                  </div>

                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col justify-center items-center text-gray-400">
                <div className="p-5 bg-slate-100 rounded-full shadow-sm mb-4">
                  <FileText className="h-10 w-10 text-slate-300" />
                </div>
                <p className="text-center">No diagnostic results yet.</p>
                <p className="text-sm">Upload a scan to generate analysis.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
