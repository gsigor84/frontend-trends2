"use client";

import React, { useState, useEffect } from "react";
import API_BASE_URL from "../utils/config";

const TrendingSearches = () => {
  const [trendingTerms, setTrendingTerms] = useState([]); // Store API data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [selectedTerms, setSelectedTerms] = useState([]); // To track selected terms

  // Fetch trending searches from the API
  useEffect(() => {
    const fetchTrendingSearches = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/trending_searches`);
        if (!response.ok) {
          throw new Error("Failed to fetch trending searches");
        }
        const data = await response.json();
        setTrendingTerms(data.trending_searches || []);
      } catch (err) {
        console.error("Error fetching trending searches:", err);
        setError("Failed to load trending searches. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingSearches();
  }, []);

  // Toggle selected terms
  const toggleSelection = (term) => {
    setSelectedTerms((prev) =>
      prev.includes(term)
        ? prev.filter((t) => t !== term)
        : [...prev, term]
    );
  };

  // Copy selected terms to clipboard
  const copyToClipboard = () => {
    const textToCopy = selectedTerms.join(", ");
    navigator.clipboard.writeText(textToCopy);
    alert("Copied to clipboard: " + textToCopy);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Trending Searches
      </h2>

      {/* Loading State */}
      {loading && (
        <p className="text-gray-500 text-center">Loading trending searches...</p>
      )}

      {/* Error State */}
      {error && (
        <p className="text-red-500 text-center font-medium">{error}</p>
      )}

      {/* Trending Terms Grid */}
      {!loading && !error && trendingTerms.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          {trendingTerms.map((term, index) => (
            <div
              key={index}
              onClick={() => toggleSelection(term)}
              className={`p-3 rounded-lg text-center text-gray-700 font-medium cursor-pointer shadow-sm transition-all ${selectedTerms.includes(term)
                  ? "bg-blue-200 text-blue-800 border border-blue-400"
                  : "bg-gray-100 hover:bg-blue-100 hover:text-blue-700"
                }`}
            >
              {term}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && trendingTerms.length === 0 && (
        <p className="text-gray-500 text-center">
          No trending searches available.
        </p>
      )}

      {/* Copy to Clipboard Button */}
      {selectedTerms.length > 0 && (
        <div className="text-center">
          <button
            onClick={copyToClipboard}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition"
          >
            Copy Selected Terms
          </button>
        </div>
      )}
    </div>
  );
};

export default TrendingSearches;
