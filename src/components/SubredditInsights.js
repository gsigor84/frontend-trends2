"use client";

import { useState } from "react";
import API_BASE_URL from "../utils/config";

const SubredditInsights = () => {
  const [subreddit, setSubreddit] = useState(""); // User input
  const [data, setData] = useState(null); // API response
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(`${API_BASE_URL}/subreddit_insights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subreddit: subreddit.trim() }),
      });

      if (!res.ok) throw new Error("Failed to fetch subreddit insights");

      const result = await res.json();
      if (result.error) {
        setError(result.error);
      } else {
        setData(result.data || {});
      }
    } catch (err) {
      setError(err.message || "Failed to fetch subreddit insights.");
      console.error("Error fetching subreddit insights:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-6 p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Subreddit Insights
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        <input
          type="text"
          placeholder="Enter subreddit name (e.g., learnprogramming)"
          value={subreddit}
          onChange={(e) => setSubreddit(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !subreddit.trim()}
          className={`w-full max-w-md px-6 py-2 text-white font-semibold rounded-lg transition ${loading || !subreddit.trim()
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
            }`}
        >
          {loading ? "Fetching Insights..." : "Get Insights"}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <p className="mt-4 text-center text-red-500 font-medium">{error}</p>
      )}

      {/* Insights Data */}
      {data && (
        <div className="mt-8 space-y-6">
          {/* Subreddit Overview */}
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Overview: r/{data.subreddit || "N/A"}
            </h3>
            <p className="text-gray-600">{data.description || "No description available"}</p>
            <div className="mt-2 text-gray-600 space-y-1">
              <p>
                <strong>Subscribers:</strong>{" "}
                {data.subscribers
                  ? data.subscribers.toLocaleString()
                  : "N/A"}
              </p>
              <p>
                <strong>Active Users:</strong>{" "}
                {data.active_users
                  ? data.active_users.toLocaleString()
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              Engagement Metrics
            </h4>
            <ul className="list-disc list-inside text-gray-600">
              <li>
                <strong>Average Upvotes:</strong>{" "}
                {data.average_upvotes !== undefined
                  ? data.average_upvotes
                  : "N/A"}
              </li>
              <li>
                <strong>Comments-to-Posts Ratio:</strong>{" "}
                {data.comments_to_posts_ratio !== undefined
                  ? data.comments_to_posts_ratio.toFixed(2)
                  : "N/A"}
              </li>
            </ul>
          </div>

          {/* Top Posts */}
          {data.top_posts && data.top_posts.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Top Posts</h4>
              <ul className="space-y-4 max-h-[300px] overflow-y-auto">
                {data.top_posts.map((post, index) => (
                  <li
                    key={index}
                    className="p-4 bg-white rounded-lg shadow hover:shadow-md transition"
                  >
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 font-semibold hover:underline"
                    >
                      {post.title}
                    </a>
                    <p className="text-gray-600 mt-1">
                      Upvotes: {post.upvotes} | Comments: {post.num_comments}
                    </p>
                    <p className="text-gray-600 mt-1">{post.excerpt}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Keywords */}
          {data.keywords && data.keywords.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Common Keywords
              </h4>
              <div className="flex flex-wrap gap-2">
                {data.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sentiment Analysis */}
          {data.sentiment && (
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Sentiment Analysis
              </h4>
              <p className="text-gray-600">
                The overall sentiment of recent discussions is{" "}
                <strong>{data.sentiment}</strong>.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubredditInsights;
