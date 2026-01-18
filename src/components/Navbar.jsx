import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="bg-white shadow-md px-6 py-4 flex gap-6">
            <h1 className="font-bold text-xl text-blue-600">XML CMS</h1>

            <Link className="hover:text-blue-500" to="/">Dashboard</Link>
            <Link className="hover:text-blue-500" to="/courses">Courses</Link>
            <Link className="hover:text-blue-500" to="/users">Users</Link>
            <Link className="hover:text-blue-500" to="/professor">Professor</Link>
        </nav>
    );
}
