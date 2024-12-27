"use client";

import { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../utils/config";

const ProductSuggestions = () => {
  const [inputData, setInputData] = useState(""); // User input for data_to_analyze
  const [results, setResults] = useState([]); // Results from the backend
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/process_product_suggestions`, {
        data_to_analyze: inputData,
      });

      const suggestions = response.data.suggestions;

      // Ensure results is always an array
      setResults(Array.isArray(suggestions) ? suggestions : []);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setError("Failed to fetch product suggestions. Please try again.");
      setResults([]); // Ensure consistent fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Product Suggestions</h2>

      {/* Form Input */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          placeholder="Enter data for analysis..."
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="5"
          required
        ></textarea>
        <button
          type="submit"
          className={`w-full px-6 py-2 text-white font-semibold rounded-lg ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          disabled={loading}
        >
          {loading ? "Processing..." : "Get Suggestions"}
        </button>
      </form>

      {/* Error State */}
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

      {/* Results */}
      {results.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Results:</h3>
          <ul className="list-disc list-inside space-y-2">
            {results.map((item, index) => (
              <li key={index} className="text-gray-600">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && results.length === 0 && inputData && (
        <p className="text-gray-500 mt-4 text-center">No suggestions found. Please try again.</p>
      )}
    </div>
  );
};

export default ProductSuggestions;
