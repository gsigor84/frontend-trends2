"use client";

import { useState } from "react";
import axios from "axios";
import SubredditSearch from "@/components/SubredditSearch";
import TrendingSearches from "@/components/TrendingSearches";
import SubredditInsights from "@/components/SubredditInsights";
import Tweets from "@/components/Tweets";
import API_BASE_URL from "../utils/config";

export default function Home() {
  const [trends, setTrends] = useState(""); // User input
  const [response, setResponse] = useState(null); // API response
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error message

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset error state

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
    <div className="max-w-3xl mx-auto my-10 px-6 py-8 bg-gray-50 shadow-lg rounded-lg">
      <TrendingSearches />
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Gemini Business Insights</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6">
        <label
          htmlFor="trends-input"
          className="text-lg font-medium text-gray-700 w-full max-w-md"
        >
          Enter Trends Data:
        </label>
        <textarea
          id="trends-input"
          rows="6"
          placeholder="Write your trends data here..."
          value={trends}
          onChange={(e) => setTrends(e.target.value)}
          disabled={loading} // Disable input during API call
          className="w-full max-w-md p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 disabled:opacity-50"
        ></textarea>
        <button
          type="submit"
          disabled={loading || !trends.trim()}
          className={`px-6 py-3 text-white font-medium rounded-lg transition duration-300 ${loading || !trends.trim()
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
            }`}
        >
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>
      {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
      {response && (
        <div className="mt-6 p-6 bg-white border rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Response:</h2>
          <pre className="whitespace-pre-wrap break-words text-sm text-gray-800">{response}</pre>
        </div>
      )}
      <div className="mt-10">
        <SubredditSearch /> {/* Existing SubredditSearch component */}
      </div>
      <div className="mt-6">
        <SubredditInsights />
      </div>
      <div className="mt-6">
        <Tweets />
      </div>
    </div>
  );
}
