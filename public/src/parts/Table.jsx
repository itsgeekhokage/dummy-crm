/** @format */

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import AudioCard from "./AudioCard";

const Container = styled.div`
  height: 100%;
  width: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 3rem;

  .userDashboardSearchDiv {
    margin-bottom: 1rem;
  }

  .userDashboardSearchBar {
    width: 100%;
    padding: 0.5rem;
  }

  .infoMessage {
    color: red;
    margin: 0.3rem;
    display: flex;
    justify-content: center;
  }

  .table{
    width: 90vw;
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
    border-left : 1px solid #ddd;
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
  let [searchKey, setSearchKey] = useState("");
  let [sampleData, setSampleData] = useState(data.audioFiles);

  const filterData = (key) => {
    setSearchKey(key);
    let newList = data.audioFiles.filter((item) =>{
     return  item?.fileName?.toLowerCase().includes(key.trim().toLowerCase())
    }
    );
    if (key === "") newList = data.audioFiles;
    console.log("newList", newList)
    setSampleData(newList);
    console.log("sampleData", sampleData)
  };

  useEffect(() => {
    const filteredArray = Object.entries(data?.headers)
      .filter(([key, header]) => header.status === true)
      .map(([key, header]) => ({ [key]: header }));

    setFilteredKeys(filteredArray);
  }, [data?.headers]);

  useEffect(()=>{
    let project = (userData?.assignedProject?.find(item => item.project === data._id))
    const newLimit = data.limit + project.extraCount;
    setLimit(newLimit);
  }, [data]);

  return (
    <Container>
      <div className="userDashboardSearchDiv">
        <input
          type="text"
          placeholder="Search your audio..."
          className="userDashboardSearchBar"
          value={searchKey}
          onChange={(e)=>filterData(e.target.value)}
        />
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
      <div>
        {selectedProject === null ? "" : <AudioCard file = {selectedProject} userData = {userData} projectLimit = {limit}/> }
      </div>
    </Container>
  );
};

export default Table;
