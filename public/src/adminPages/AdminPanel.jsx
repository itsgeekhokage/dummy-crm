
import React, {useEffect, useState} from "react";
import Navbar from "./Navbar";
import CreateUser from "./CreateUser";
import styled from "styled-components";
import SingleUser from "./SingleUser";
import AllUsers from "./AllUsers";
import CreateProject from "./CreateProject";
import AllProjects from "./AllProjects";
import Modal from "../parts/Modal";
import CsvToJsonConverter from "./TestPage";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

const FullPanel = styled.div`
  width: 100vw;
  height: 100vh;
`;

const AdminPanel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const openModal = () => {
    setModalVisible(true);
  };
  useEffect(()=>{
    console.log(location.state)
    if(location?.state?.admin != true) navigate("/");
  },[])
  return (
    <FullPanel>
      <Navbar />
      <Outlet/>
    </FullPanel>
  );
};

export default AdminPanel;
