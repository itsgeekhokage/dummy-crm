import { useState } from "react";
import "./App.css";
import UserDashboard from "./userPages/UserDashboard";
import UserLogin from "./Login";
import Navbar from "./adminPages/Navbar";
import AdminPanel from "./adminPages/AdminPanel";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import CreateUser from "./adminPages/CreateUser";
import AllUsers from "./adminPages/AllUsers";
import SingleUser from "./adminPages/SingleUser";
import CreateProject from "./adminPages/CreateProject";
import AllProjects from "./adminPages/AllProjects";
import NewProject from "./adminPages/NewProject";
import CsvToJsonConverter from "./adminPages/TestPage";

function App() {
  const [count, setCount] = useState(0);
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route
          path="/"
          element={<UserLogin />}></Route>
        <Route
          path="/home"
          element={<UserDashboard />}></Route>
        <Route
          path="/admin"
          element={<AdminPanel />}>
            <Route path="newUser" element={<CreateUser/>}></Route>
            <Route path="allUser" element={<AllUsers/>}></Route>
            <Route path="singleUser" element={<SingleUser/>}></Route>
            <Route path="newproject" element={<NewProject/>}></Route>
            <Route path="createproject" element={<CreateProject/>}></Route>
            <Route path="allprojects" element={<AllProjects/>}></Route>
          </Route>
      </Route>
    )
  );

  return (
    <>
      <RouterProvider router={router} />
      {/* <CsvToJsonConverter/> */}
    </>
  );
}

export default App;
