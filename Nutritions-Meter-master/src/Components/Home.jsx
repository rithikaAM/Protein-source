import React, { useState } from "react";
import axios from "axios";
import Charts from "./Charts";

const Home = () => {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/process-file",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setResults(response.data); // Assuming the API returns processed data.
    } catch (error) {
      console.error("Error processing the file:", error);
      alert("Failed to process the file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <h1>Food Item Analysis</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button type="submit">Upload and Process</button>
      </form>
      {loading && <p>Processing file, please wait...</p>}
      {results && <Charts data={results} />}
    </div>
  );
};

export default Home;
