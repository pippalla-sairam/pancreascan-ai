import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, AlertTriangle, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const [formData, setFormData] = useState({
    name: '', age: '', gender: 'Male', patient_id: ''
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
      alert("Error analyzing image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">

      {/* Header */}
      <h1 className="text-4xl font-extrabold text-sky-700 mb-6">
        Patient Diagnostics
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* LEFT FORM */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-sky-100">
          <h2 className="text-xl font-bold mb-5 flex items-center text-sky-700">
            <FileText className="mr-2" /> Patient Information
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Patient ID */}
            <input
              required name="patient_id"
              placeholder="Patient ID"
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg bg-sky-50 focus:ring-2 focus:ring-sky-500"
            />

            {/* Name + Age */}
            <div className="grid grid-cols-2 gap-4">
              <input
                required name="name"
                placeholder="Full Name"
                onChange={handleInputChange}
                className="p-3 border rounded-lg bg-sky-50 focus:ring-2 focus:ring-sky-500"
              />
              <input
                required name="age"
                type="number"
                placeholder="Age"
                onChange={handleInputChange}
                className="p-3 border rounded-lg bg-sky-50 focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Gender */}
            <select
              name="gender"
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg border bg-sky-50 focus:ring-2 focus:ring-sky-500"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            {/* Upload */}
            <div className="border-2 border-dashed border-sky-300 p-7 rounded-xl text-center hover:bg-sky-50 transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="upload-scan"
              />
              <label htmlFor="upload-scan" className="cursor-pointer block">
                <Upload className="mx-auto h-12 w-12 text-sky-500" />
                <p className="mt-2 text-gray-600">Upload CT Scan</p>
              </label>
            </div>

            {preview && (
              <img src={preview} className="h-44 w-full object-cover rounded-lg border" />
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-semibold ${
                loading ? "bg-gray-400" : "bg-sky-600 hover:bg-sky-700"
              }`}
            >
              {loading ? "Analyzing..." : "Run AI Analysis"}
            </button>
          </form>
        </div>

        {/* RIGHT RESULT */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-sky-100">

          <h2 className="text-xl font-bold mb-5 text-sky-700">
            Diagnostic Report
          </h2>

          {result ? (
            <div className={`p-6 rounded-xl border-l-4 shadow-md ${
              result.diagnosis.includes("Malignant")
                ? "bg-red-50 border-red-500"
                : "bg-sky-50 border-sky-500"
            }`}>

              {/* Header */}
              <div className="flex items-center mb-4">
                {result.diagnosis.includes("Malignant") ? (
                  <AlertTriangle className="text-red-600 mr-3" />
                ) : (
                  <CheckCircle className="text-sky-600 mr-3" />
                )}

                <h3 className={`text-xl font-bold ${
                  result.diagnosis.includes("Malignant")
                    ? "text-red-700"
                    : "text-sky-700"
                }`}>
                  {result.diagnosis}
                </h3>
              </div>

              {/* Details */}
              <div className="space-y-2 text-gray-700">

                <p><strong>Model Confidence:</strong> {result.model_confidence}</p>

                {result.cancer_probability && (
                  <p><strong>Cancer Probability:</strong> {result.cancer_probability}</p>
                )}

                {result.stage && (
                  <p><strong>Stage:</strong> {result.stage}</p>
                )}

                <p>
                  <strong>Risk Level:</strong>{" "}
                  <span className={result.risk_level === "High" ? "text-red-600 font-bold" : "text-sky-600 font-bold"}>
                    {result.risk_level}
                  </span>
                </p>

                <hr />

                <p><strong>Patient:</strong> {result.patient_name}</p>
                <p><strong>ID:</strong> {result.patient_id}</p>
                <p><strong>Date:</strong> {result.scan_date}</p>

                <p className="text-xs text-gray-400 mt-3">
                  {result.disclaimer}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              Upload a scan to generate results
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;