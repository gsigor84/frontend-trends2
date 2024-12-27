"use client";

import { useState } from "react";
import axios from "axios";
import TrendingSearches from "@/components/TrendingSearches";
import SubredditSearch from "@/components/SubredditSearch";
import SubredditInsights from "@/components/SubredditInsights";
import SerpSearch from "@/components/SerpSearch";
import ProductSuggestions from "@/components/ProductSuggestions"; // Import the new component
import API_BASE_URL from "../utils/config"; // Import the centralized API URL

export default function Home() {
  const [trends, setTrends] = useState(""); // User input
  const [response, setResponse] = useState(null); // API response
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error message

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${API_BASE_URL}/gemini`, { trends });
      setResponse(res.data.response);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred while processing your request.");
      console.error("Error sending data to Gemini API:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">Business Insights Dashboard</h1>
        <p className="text-gray-700 mt-2">Empower your decisions with data-driven insights.</p>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column */}
        <div className="space-y-10">
          <TrendingSearches />
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Gemini Business Insights
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6">
              <input
                type="text"
                placeholder="Enter trends"
                value={trends}
                onChange={(e) => setTrends(e.target.value)}
                disabled={loading}
                className="w-full max-w-md px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !trends.trim()}
                className={`px-8 py-3 text-white text-lg font-semibold rounded-lg transition duration-300 ${loading || !trends.trim()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                {loading ? "Processing..." : "Submit"}
              </button>
            </form>
            {error && <div className="mt-6 text-red-600 text-center">{error}</div>}
            {response && (
              <div className="mt-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Response:</h3>
                <pre className="whitespace-pre-wrap break-words text-sm text-gray-900">
                  {response}
                </pre>
              </div>
            )}
          </div>
          {/* Add the new ProductSuggestions component here */}
          <ProductSuggestions />
        </div>

        {/* Right Column */}
        <div className="space-y-10">
          <SubredditSearch />
          <SubredditInsights />
          <SerpSearch />
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} Business Insights Dashboard. All rights reserved.
      </footer>
    </div>
  );
}
