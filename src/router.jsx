import { createBrowserRouter } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminDashboard from "./components/Admin/AdminDashboard";
import App from "./App";
import HomeDashboard from "./components/Home/HomeDashboard";
import AddProjectFormModal from "./components/ProjectManager/AddProjectFormModal";
import ProjectDashboard from "./components/ProjectManager/ProjectDashboard";
import ContactsPage from "./components/Contacts/ContactsPage";
import TasksDashboard from "./components/Tasks/TasksDashboard";


const router = createBrowserRouter([
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/admindashboard", element: <AdminDashboard /> },
    { path: "/home", element: <HomeDashboard /> },
    { path:"/createProject",element:<AddProjectFormModal/>},
    { path:"/projectdashboard",element:<ProjectDashboard/>},
    { path:"/contactspage",element:<ContactsPage/>}, 
    { path:"/tasksdashboard",element:<TasksDashboard/>}    
])

export default router;