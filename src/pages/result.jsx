import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/result.css"; // we'll create this file

export default function ResultScreen() {
  const location = useLocation();
  const results = location.state?.results || [];
  const [summaries, setSummaries] = useState({});

    useEffect(() => {
    const fetchSummaries = async () => {
      const newSummaries = {};
      for (const venue of results) {
        if (venue.address) {
          try {
            const res = await fetch("/api/summarize", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ address: venue.address }),
            });
            const data = await res.json();
            newSummaries[venue._id] = data.summary;
          } catch (e) {
            console.error("Summarization failed", e);
          }
        }
      }
      setSummaries(newSummaries);
    };

    if (results.length > 0) {
      fetchSummaries();
    }
  }, [results]);


  return (
    <div className="results-container">
      <h1 className="results-title">Search Results</h1>

      {results.length === 0 ? (
        <p className="no-results">No results found.</p>
      ) : (
        <div className="card-grid">
          {results.map((venue, idx) => (
            <div key={idx} className="venue-card">
              <img
                src={venue.bg_img_link || "/placeholder.png"}
                alt={venue.name}
                className="venue-image"
              />
              <div className="venue-details">
                <h2 className="venue-name">{venue.name}</h2>
                <p className="venue-city">{venue.city}</p>
                <p className="venue-info">
                  <strong>Category:</strong> {venue.category}
                </p>
                <p className="venue-info">
                  <strong>Landmark:</strong> {venue.mark}
                </p>
                <p className="venue-info">
                  <strong>Price:</strong> ₹{venue.price}
                </p>
                <p className="venue-info">
                  <strong>Rating:</strong> ⭐ {venue.rating}
                </p>
                <p className="venue-description"> {summaries[venue._id] || venue.address}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
