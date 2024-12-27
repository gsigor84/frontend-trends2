"use client";

import React, { useState } from "react";
import axios from "axios";

export default function SerpSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [topKeywords, setTopKeywords] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);
    setTopKeywords({});

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/serp_search`,
        { query }
      );

      const { results: fetchedResults, top_keywords } = response.data;

      if (fetchedResults && top_keywords) {
        setResults(fetchedResults);
        setTopKeywords(top_keywords);
      } else {
        setError("No results found.");
      }
    } catch (err) {
      console.error("Error fetching SERP results:", err);
      setError("An error occurred while fetching search results.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">
        Search with SERPStack
      </h2>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Enter a search query..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2 text-white font-semibold rounded-lg transition ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-4 text-red-500 text-center">
          <p>{error}</p>
        </div>
      )}

      {/* Top Results */}
      {results.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">Top Results:</h3>
          <ul className="space-y-2">
            {results.map((result, index) => (
              <li
                key={index}
                className={`p-2 border-b ${index < 3 ? "text-green-600 font-semibold" : ""
                  }`}
              >
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {index + 1}. {result.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Top Keywords */}
      {Object.keys(topKeywords).length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-2">Top Keywords:</h3>
          <ul className="grid grid-cols-2 gap-2">
            {Object.entries(topKeywords)
              .sort((a, b) => b[1] - a[1])
              .map(([keyword, count], index) => (
                <li
                  key={index}
                  className="bg-blue-100 px-4 py-2 rounded-lg text-gray-800 font-medium"
                >
                  {keyword}: <span className="font-bold">{count}</span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
