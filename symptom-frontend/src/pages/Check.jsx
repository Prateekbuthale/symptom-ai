import React, { useState } from "react";
import { submitAssessment } from "../utils/api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Check() {
  const [text, setText] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("male");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!text.trim()) {
      setError("Please enter symptoms");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result = await submitAssessment({ text, age, sex });
      localStorage.setItem("assessment_result", JSON.stringify(result));
      window.location.href = "/result";
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          Describe Your Symptoms
        </h1>

        <textarea
          rows="6"
          placeholder="Example: I have a headache and fatigue for 2 days..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <select
          value={sex}
          onChange={(e) => setSex(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow-md disabled:bg-blue-300"
        >
          {loading ? <LoadingSpinner /> : "Analyze Symptoms"}
        </button>
      </div>
    </div>
  );
}
