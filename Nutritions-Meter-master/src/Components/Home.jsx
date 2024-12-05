import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import Charts from "./Charts";

const Home = () => {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      alert("Please upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    // Check if the file is .xlsx and process it locally before sending
    if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        try {
          setLoading(true);
          const response = await axios.post(
            "http://localhost:5000/process-file",
            { data: jsonData }, // Send JSON for .xlsx files
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          setResults(response.data);
        } catch (error) {
          console.error("Error processing the file:", error);
          alert("Failed to process the file. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      // For other file types, send as a formData
      try {
        setLoading(true);
        const response = await axios.post(
          "http://localhost:5000/process-file",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setResults(response.data); // Assuming the API processes CSV files or others directly
      } catch (error) {
        console.error("Error processing the file:", error);
        alert("Failed to process the file. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="home">
      <h1>Food Item Analysis</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".csv, .xlsx, .xls"
          onChange={handleFileChange}
        />
        <button type="submit">Upload and Process</button>
      </form>
      {loading && <p>Processing file, please wait...</p>}
      {results && <Charts data={results} />}
    </div>
  );
};

export default Home;
