/** @format */

import React, { useState } from "react";
import Papa from "papaparse"; // Make sure to install papaparse using npm or yarn
import { CSVLink } from "react-csv";

const CsvToJsonConverter = () => {
  const [jsonResult, setJsonResult] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const jsonData = result.data;
          setJsonResult(jsonData);
        },
        header: true, // Assuming the first row contains headers
      });
    }
  };
  console.log(jsonResult);

  let headers = [
    { label: "First Name", key: "firstname" },
    { label: "Last Name", key: "lastname" },
    { label: "Email", key: "email" },
  ];

  let data = [
    { firstname: "Ahmed", lastname: "Tomi", email: "ah@smthing.co.com" },
    { firstname: "Raed", lastname: "Labes", email: "rl@smthing.co.com" },
    { firstname: "Yezzi", lastname: "Min l3b", email: "ymin@cocococo.com" },
  ];

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
      />
      <CSVLink
        filename="export.csv"
        data={data}
        headers={headers}>
        Download me
      </CSVLink>
      ;
      {jsonResult && (
        <div>
          <h2>JSON Result:</h2>
          <pre>{JSON.stringify(jsonResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CsvToJsonConverter;
