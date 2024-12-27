const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:8080" // Development URL
    : "https://gtrends-new.onrender.com"); // Production URL

export default API_BASE_URL;
