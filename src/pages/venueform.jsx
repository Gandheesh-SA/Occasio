import React, { useState, useEffect } from "react";
import { Building2, SquareMenu, IndianRupee, Star } from "lucide-react"; // Example icons, you can change per dropdown
import { useNavigate } from "react-router-dom";

import "../styles/venueform.css";

export default function VenueForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    city: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    rating: "",
  });
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);

    useEffect(() => {
    fetch("/api/cities")

      .then((res) => res.json())
      .then((data) => setCities(data))
      .catch((err) => console.error(err));

    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Query results:", data);
      navigate("/venuelist", { state: { results: data } });

    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="login-container">
      {/* Left Section */}
      <div className="left-section"></div>

      {/* Right Section */}
      <div className="right-section">
        <div className="login-card">
          <h1 className="login-title">Welcome!</h1>

          {/* Dropdown 1 */}
          <div className="dropdown-wrapper">
            <label className="dropdown-label">City</label>
            <div className="input-group">
              <Building2 className="input-icon" size={18} />
              <select className="input-field" name="city" value={formData.city} onChange={handleChange}>
                <option value="">Select a city</option>
                {cities.map((city, idx) => (
                  <option key={idx} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dropdown 2 */}
          <div className="dropdown-wrapper">
            <label className="dropdown-label">Category</label>
            <div className="input-group">
              <SquareMenu className="input-icon" size={18} />
              <select className="input-field" name="category" value={formData.category} onChange={handleChange}>
                <option value="">Select a category</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="dropdown-wrapper">
            <label className="dropdown-label">Min price</label>

            <div className="input-group">
              <IndianRupee className="input-icon" size={18} />
              <input
                type="number"
                placeholder="Enter Min Price"
                className="input-field"
                 name="minPrice"
                value={formData.minPrice}
                onChange={handleChange}

              />
            </div>
          </div>
          <div className="dropdown-wrapper">
            <label className="dropdown-label">Max price</label>

            <div className="input-group">
              <IndianRupee className="input-icon" size={18} />
              <input
                type="number"
                placeholder="Enter Max Price"
                className="input-field"
                name="maxPrice"
                value={formData.maxPrice}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Dropdown 3 */}
          <div className="dropdown-wrapper">
            <label className="dropdown-label">Rating</label>
            <div className="input-group">
              <Star className="input-icon" size={18} />
              <select className="input-field" name="rating"
  value={formData.rating}
  onChange={handleChange}>
                <option value="">Enter rating value</option>
                <option value="3">"3 & above</option>
                <option value="3.5">3.5 & above</option>
                <option value="4">4 & above </option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button onClick={handleSubmit} className="login-button">SUBMIT</button>
        </div>
      </div>
    </div>
  );
}
