"use client";

import { useState } from "react";
import API_BASE_URL from "../utils/config";

const SubredditSearch = () => {
  const [keywords, setKeywords] = useState(""); // User input
  const [results, setResults] = useState(null); // API response
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/search_subreddits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keywords: keywords.split(",").map((kw) => kw.trim()), // Convert input to array
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch subreddits");

      const data = await res.json();
      setResults(data.data); // Update results
    } catch (err) {
      setError(err.message || "Failed to fetch subreddits.");
      console.error("Error fetching subreddits:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-6 p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Subreddit Search
      </h2>
      <p className="text-sm text-gray-500 mb-6 text-center">
        Enter keywords (comma-separated) to find related subreddits.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        <input
          type="text"
          placeholder="e.g., finance, mental health"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !keywords.trim()}
          className={`w-full max-w-md px-6 py-2 text-white font-semibold rounded-lg transition ${loading || !keywords.trim()
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
            }`}
        >
          {loading ? "Searching..." : "Search Subreddits"}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <p className="mt-4 text-center text-red-500 font-medium">{error}</p>
      )}

      {/* Results */}
      {results && (
        <div className="mt-8 space-y-6">
          {Object.entries(results).map(([keyword, subreddits]) => (
            <div key={keyword} className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Results for <span className="text-blue-600">"{keyword}"</span>:
              </h3>
              <ul className="divide-y divide-gray-200 bg-gray-50 p-4 rounded-lg shadow">
                {subreddits.map((subreddit) => (
                  <li
                    key={subreddit.name}
                    className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <a
                        href={subreddit.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 font-semibold hover:underline"
                      >
                        r/{subreddit.name}
                      </a>
                      <p className="text-gray-600 text-sm">{subreddit.title}</p>
                    </div>
                    <p className="text-gray-500 text-sm">
                      {subreddit.subscribers.toLocaleString()} subscribers
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && results && Object.keys(results).length === 0 && (
        <p className="text-gray-500 text-center">No results found.</p>
      )}
    </div>
  );
};

export default SubredditSearch;
