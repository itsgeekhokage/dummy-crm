import React, { useState, useEffect } from "react";
import styled from "styled-components";

const TableContainer = styled.div`
  margin: 20px;
  overflow: auto;
  width: 90vw;
  max-height: 95vh;
`;

const StyledTable = styled.table`
  border-collapse: collapse;
  width: 100%;
`;

const StyledHeaderCell = styled.th`
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  min-width: 130px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  font-size: 1rem;
  border-radius: 4px;
`;

const StyledStatusHeaderCell = styled.th`
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
  color: ${(props) => (props.status ? "#006400" : "#800020")};
  cursor: pointer;
`;

const StyledMainHeaderCell = styled.th`
  padding: 10px;
  text-align: center;
  background-color: #3a3a3a;
  color: white;
  border: 1px solid #ddd;
`;

const TableBody = styled.tbody`
  overflow: auto;
`;

const StyledDataCell = styled.td`
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
`;

const ProjectTable = ({ headers, setHeaders, audioFiles }) => {
  console.log(headers, audioFiles);
  const [editedHeaders, setEditedHeaders] = useState({});

  const filteredKeys = Object.keys(headers).filter(
    (key) => key !== "_id" && key !== "__v"
  );

  const handleStatus = (key) => {
    setHeaders((prevHeaders) => ({
      ...prevHeaders,
      [key]: {
        ...prevHeaders[key],
        status: !prevHeaders[key].status,
      },
    }));
  };

  const handleHeaderEdit = (key) => {
    if (editedHeaders[key] !== undefined && editedHeaders[key].trim() !== "") {
      const newHeaders = { ...headers };
      newHeaders[key].nickName = editedHeaders[key];
      setHeaders(newHeaders);
    }
  };

  const handleInputChange = (key, value) => {
    setEditedHeaders((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    console.log("ye audioFiles:", audioFiles);
  }, [audioFiles]);

  return (
    <TableContainer>
      <StyledTable>
        <thead>
          <tr>
            {filteredKeys.map((key) => (
              <StyledHeaderCell key={key}>
                <StyledInput
                  type="text"
                  value={editedHeaders[key]}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  onBlur={() => handleHeaderEdit(key)}
                  placeholder="Edit header"
                />
              </StyledHeaderCell>
            ))}
          </tr>
          <tr>
            {filteredKeys.map((key) => (
              <StyledStatusHeaderCell
                key={key}
                status={headers[key].status}
                onClick={() => handleStatus(key)}>
                {headers[key].status ? "Show" : "Hide"}
              </StyledStatusHeaderCell>
            ))}
          </tr>
          <tr>
            {filteredKeys.map((key) => (
              <StyledMainHeaderCell key={key}>{key}</StyledMainHeaderCell>
            ))}
          </tr>
        </thead>
        <TableBody>
          {audioFiles.map((item, index) =>
            item ? (
              <tr key={index}>
                {filteredKeys.map((key) => {
                  return (
                    <StyledDataCell key={key}>
                      {key === "comments" ? item[key].length : item[key]}
                    </StyledDataCell>
                  );
                })}
              </tr>
            ) : (
              <> </>
            )
          )}
        </TableBody>
      </StyledTable>
    </TableContainer>
  );
};

export default ProjectTable;
