import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CoursesPage from "./pages/CoursesPage";
import UsersPage from "./pages/UsersPage";
import ProfessorPage from "./pages/ProfessorPage";
import Navbar from "./components/Navbar";

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/professor" element={<ProfessorPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
