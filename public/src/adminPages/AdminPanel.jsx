/** @format */

import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

const FullPanel = styled.div`
  width: 100vw;
  height: 100vh;
`;

const AdminPanel = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = JSON.parse(sessionStorage.getItem("crmLogin"));

    if (!storedUserData || !storedUserData.admin) {
      navigate("/");
    }

  }, []);

  return (
    <FullPanel>
      <Navbar />
      <Outlet />
    </FullPanel>
  );
};

export default AdminPanel;
