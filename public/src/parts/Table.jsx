import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AudioCard from "./AudioCard";
import { CSVLink } from "react-csv";

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .userDashboardSearchDiv {
    margin-bottom: 1rem;
    #downloadButton {
      color: yellow;
      text-decoration: none;
      padding: 0 1rem;
      margin: auto 0;
      width: auto;
    }
    #dropDown{
      border: 0;
      background-color: #3a3a3a;
      outline: 0;
      color: #ffffff;
      text-align: center;
      margin: 1rem;
      font-size: 1rem;
      cursor: pointer;
      font-family: var(--font-family);
    }
  }

  .userDashboardSearchBar {
    padding: 0.5rem;
  }

  .infoMessage {
    color: red;
    margin: 0.3rem;
    display: flex;
    justify-content: center;
  }

  .table {
    width: 100%;
    overflow: auto;
    height: 80vh;
  }

  .row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    width: 90vw;
    cursor: pointer;
  }

  .headerCell {
    background-color: #3a3a3a;
    color: white;
    padding: 10px;
    text-align: center;
    min-width: 150px;
    border: 1px solid #ddd;
    height: 3rem;
  }

  .dataCell {
    border-left: 1px solid #ddd;
    padding: 10px;
    text-align: center;
    min-width: 150px;
    overflow: hidden;
    height: 2.3rem;
  }
`;

const Table = ({ data, userData, userName }) => {
  const [filteredKeys, setFilteredKeys] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  let [limit, setLimit] = useState(data.limit);
  let [headerKey, setHeaderKey] = useState("");
  let [searchKey, setSearchKey] = useState("");
  let [sampleData, setSampleData] = useState(data.audioFiles);
  let [csvDownload, setCSVDownload] = useState("");

  const filterData = (key) => {
    setSearchKey(key);
    let newList = data.audioFiles.filter((item) => {
      return typeof(item[headerKey])==="number" ? item[headerKey] == key.trim() : item[headerKey]?.toLowerCase().includes(key.trim().toLowerCase())
    });
    if (key === "") newList = data.audioFiles;
    setSampleData(newList);
  };

  useEffect(() => {
    const filteredArray = Object.entries(data?.headers)
      .filter(([key, header]) => header.status === true)
      .map(([key, header]) => ({ [key]: header }));

    setFilteredKeys(filteredArray);
  }, [data?.headers]);

  useEffect(() => {
    const jsonData = data.audioFiles.map((item) => {
      let obj = {};
      obj["fileName"] = item.fileName;
      const comment = item.comments.find(
        (com) => com.userName === userData.userName
      );
      if (comment) obj["comment"] = comment.comment;
      else obj["comment"] = "";
      const playobj = item.plays.find(
        (com) => com.userName === userData.userName
      );
      if (playobj) obj["plays"] = playobj.plays;
      else obj["plays"] = "";
      return obj;
    });
    setCSVDownload(jsonData);
  }, [filteredKeys]);

  useEffect(() => {
    let project = userData?.assignedProject?.find(
      (item) => item.project === data._id
    );
    const newLimit = data.limit + project.extraCount;
    setLimit(newLimit);
  }, [data]);

  return (
    <Container>
      <div className="userDashboardSearchDiv">
        <select id="dropDown" onChange={(e)=>setHeaderKey(e.target.value)}>
          <option value="0">Select Field</option>
          {filteredKeys.map((item, index) => {
            const key = Object.keys(item)[0];
            return <option value={key} key={index}>{item[key].nickName}</option>;
          })}
        </select>
        <input
          type="text"
          placeholder="Search your audio..."
          className="userDashboardSearchBar"
          value={searchKey}
          onChange={(e) => filterData(e.target.value)}
        />
        <CSVLink
          filename={`${userData.userName}-${data.projectName}`}
          data={csvDownload}
          id="downloadButton">
          Download Project
        </CSVLink>
      </div>
      <div>
        <div className="infoMessage">
          {`You can listen to each audio file ${limit} times only. Please connect with the Admin to listen more.`}
        </div>
        <div className="infoMessage">
          {`Audios will expire by ${data.deadline.slice(
            0,
            10
          )}. To listen further, please connect with the Admin.`}
        </div>
      </div>
      <div className="table">
        <div className="row">
          {filteredKeys.map((item, index) => {
            const key = Object.keys(item)[0];
            return (
              <div
                key={index}
                className="headerCell">
                {item[key].nickName}
              </div>
            );
          })}
        </div>
        {sampleData.map((item, rowIndex) => (
          <div
            key={rowIndex}
            className="row"
            style={
              selectedProject == item
                ? { color: "blue" }
                : { backgroundColor: "" }
            }
            onClick={() => setSelectedProject(item)}>
            {filteredKeys.map((keyObj, colIndex) => {
              const key = Object.keys(keyObj)[0];
              const audioFileData = item[key];
              return (
                <div
                  key={colIndex}
                  className="dataCell">
                  {audioFileData}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ width: "100%", height : "4rem"}}>
        {selectedProject === null ? (
          ""
        ) : new Date(data.deadline).toISOString() >=
          new Date(Date.now()).toISOString() ? (
          <AudioCard
            file={selectedProject}
            userData={userData}
            projectLimit={limit}
          />
        ) : (
          <div style={{ height: "4rem", display:"flex", justifyContent:"center", alignItems:"center"}}>Sorry, but this project has expired</div>
        )}
      </div>
    </Container>
  );
};

export default Table;
