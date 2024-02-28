/** @format */

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Papa from "papaparse";
import { useNavigate, useLocation } from "react-router-dom";
import ProjectTable from "../parts/ProjectTable";
import {
  appendProjectFiles,
  replaceProjectFiles,
  updateProject,
  updateHeaderLink,
} from "../../api";
import { CSVLink } from "react-csv";
import { toast } from "react-toastify";

const Dashboard = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  span {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    background-color: white;
    gap: 20px;
    margin: 0.3rem;
    span {
      display: flex;
      border: 0;
      text-decoration: none;
      background-color: #3a3a3a;
      padding: 0.2rem 2rem;
      width: max-content;
      a {
        color: whitesmoke;
        text-decoration: none;
      }
    }
  }
`;
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  min-width: 300px;
  max-width: 800px;
  gap: 1rem;
  padding: 4rem 5rem;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  margin: 1rem auto;

  div {
    display: flex;
    gap: 20px;
    font-size: 1.1rem;
    label {
      width: 30%;
      display: flex;
      align-items: center;
    }
    input {
      width: 70%;
      font-size: 1.2rem;
      padding: 2px 8px;
    }
    select {
      width: 70%;
      font-size: 1.2rem;
      padding: 2px 8px;
    }
    span {
      background-color: var(--heading-color);
      font-size: 1.2rem;
      padding: 0.4rem;
      max-width: max-content;
      color: var(--font-color);
      border: 0;
      outline: 0;
      border-radius: 0.4rem;
      margin-bottom: -2rem;
      margin-left: 80%;
      cursor: pointer;
    }
  }
`;
const FileUploadContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 15px;
  cursor: pointer;
`;
const FileActionButton = styled.div`
  background-color: var(--heading-color);
  font-size: 0.8rem !important;
  padding: 0.3rem 0.4rem;
  color: var(--font-color);
  border: 0;
  outline: 0;
  border-radius: 0.4rem;
  cursor: pointer;
`;

const View = styled.div`
  display: flex;
  justify-content: center;
  background-color: var(--blue-color);
  color: var(--font-color);
  padding: 0.4rem 1rem;
  border-radius: 0.2rem;
  cursor: pointer;
`;

const CreateProject = () => {
  let [projectId, setProjectId] = useState("");
  let [projectName, setProjectName] = useState("");
  let [status, setStatus] = useState("Active");
  let [limit, setLimit] = useState(0);
  let [deadline, setDeadline] = useState(null);
  let [headers, setHeaders] = useState([]);
  let [audioFiles, setAudioFiles] = useState([]);
  const [jsonResult, setJsonResult] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const csvSampleData = [
    {
      uniqueId: "",
      fileName: "",
      audioFileLink: "",
      name: "",
      age: "",
      gender: "",
      casteCategory: "",
      category: "",
      locality: "",
      ac: "",
      pc: "",
      district: "",
      occupation: "",
      income: "",
      education: "",
      adhoc1: "",
      adhoc2: "",
      adhoc3: "",
      adhoc4: "",
    },
  ];
  const [csvTableData, setcsvTableData] = useState([]);

  useEffect(() => {
    if (location.state) {
      let { _id, projectName, status, audioFiles, headers, deadline, limit } =
        location.state;
      deadline = deadline.slice(0, 10);
      setProjectId(_id);
      setProjectName(projectName);
      setStatus(status);
      setLimit(limit);
      setDeadline(deadline);
      setHeaders(headers);
      setAudioFiles(audioFiles);
      const transformedData = audioFiles?.map((item) => {
        if (item) {
          const { _id, project, __v, ...rest } = item;
          const comments = item.comments
            ?.map((comment) => `${comment.userName} : ${comment.comment}`)
            .join("\n");
          const plays = item.plays
            ?.map((play) => `${play.userName} : ${play.plays}`)
            .join("\n");
          return { ...rest, comments, plays };
        }
      });
      setcsvTableData(transformedData);
    } else navigate("/");
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    Papa.parse(file, {
      complete: (result) => {
        const parsedHeaders = result.data[0].map((header) => header.trim());
        const parsedValues = result.data
          .slice(1)
          .map((row) => row.map((value) => value.trim()));

        if (
          JSON.stringify(Object.keys(csvSampleData[0])) ==
          JSON.stringify(parsedHeaders)
        ) {
          const jsonData = parsedValues.map((row) => {
            const obj = {};
            parsedHeaders.forEach((header, index) => {
              obj[header] = row[index];
            });
            return obj;
          });
          setJsonResult(jsonData);
        } else {
          alert(
            "plss re-check your input file headers according to CSV Sample file..."
          );
        }
      },
      header: false,
    });
  };

  const appendHandler = () => {
    const postData = {
      id: projectId,
      data: jsonResult,
    };
    fetch(appendProjectFiles, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.response === 202) {
          setAudioFiles(data.files);
          setcsvTableData(data.files);
          if (data.count != 0)
            toast.info(
              `Data successfully updated! ${
                jsonResult.lengh - data.count
              } duplicates Trimmed`
            );
          else toast.info("Data successfully updated...");
        } else {
          toast.warn(
            "Internal Server Error, try reconsidering your data, or come back later..."
          );
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };

  const replaceHandler = () => {
    if (jsonResult === null)
      toast.warn("data is null, check once or try re-entering...");
    else {
      const postData = {
        id: projectId,
        data: jsonResult,
      };
      fetch(replaceProjectFiles, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.response === 202) {
            toast.warn("data successfully replaced...");
            setAudioFiles(data.newAudioModels, () => {
              setcsvTableData(data.newAudioModels);
            });
          } else
            toast.warn(
              "Server problem, try reconsidering your data or come back later..."
            );
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    }
  };

  const headerUpdater = (projectdata) => {
    const postData = {
      id: headers._id,
      data: headers,
    };
    fetch(updateHeaderLink, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.response) submitHandler(projectdata);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };

  const submitHandler = (data) => {
    const postData = {
      id: projectId,
      data: data,
    };
    fetch(updateProject, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.response === 202) navigate("../allprojects");
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };

  const handleDateChange = (event) => {
    // const formattedDate = event.target.value.split("-").reverse().join("/");
    setDeadline(event.target.value);
  };

  const handleSubmit = (e) => {
    const projectdata = {
      projectName,
      status,
      deadline,
      limit,
      headers,
    };
    headerUpdater(projectdata);
  };

  return (
    <Dashboard>
      <span>
        <span>
          <CSVLink
            filename={"sample"}
            data={csvSampleData}>
            Sample CSV Data
          </CSVLink>
        </span>
        <span>
          <CSVLink
            fiename={projectName}
            data={csvTableData}>
            Download Project
          </CSVLink>
        </span>
      </span>
      <StyledForm>
        <div>
          <label htmlFor="">Project Name</label>
          <input
            type="text"
            value={projectName}
          />
        </div>
        <div>
          <label htmlFor="">Upload File</label>
          <FileUploadContainer>
            <input
              type="file"
              onChange={handleFileChange}
            />
            {/* {audioFiles.length === 0 && (
              <FileActionButton onClick={() => replaceHandler()}>
                Add
              </FileActionButton>
            )} */}
            <>
              <FileActionButton onClick={appendHandler}>
                Append
              </FileActionButton>
              <FileActionButton onClick={() => replaceHandler()}>
                Replace
              </FileActionButton>
            </>
          </FileUploadContainer>
        </div>
        <div>
          <label htmlFor="">Status</label>
          <div>
            <input
              type="radio"
              id="active"
              name="status"
              value="Active"
              checked={status === "Active"}
              onChange={(e) => setStatus(e.target.value)}
            />{" "}
            <label htmlFor="active">Active</label>
            <input
              type="radio"
              id="inactive"
              name="status"
              value="Inactive"
              checked={status === "Inactive"}
              onChange={(e) => setStatus(e.target.value)}
            />{" "}
            <label htmlFor="inactive">Inactive</label>
          </div>
        </div>
        <div>
          <label htmlFor="">Deadline</label>
          <input
            type="date"
            id="deadline"
            value={deadline || ""}
            onChange={handleDateChange}
          />
        </div>
        <div>
          <label htmlFor="">Limit</label>
          <input
            type="Number"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            min={0}
            max={20}
          />
        </div>
        <div>
          <span onClick={(e) => handleSubmit(e)}>Submit</span>
        </div>
      </StyledForm>
      <ProjectTable
        headers={headers}
        setHeaders={setHeaders}
        audioFiles={audioFiles}
      />
    </Dashboard>
  );
};

export default CreateProject;
