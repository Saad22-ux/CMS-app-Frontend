import { NavLink } from "react-router-dom";

export default function Navbar() {

    const NavItem = ({ to, icon, label }) => (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm ${
                    isActive
                        ? "bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200"
                        : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
                }`
            }
        >
            <span>{icon}</span>
            <span>{label}</span>
        </NavLink>
    );

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

                {/* LOGO */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">
                        SI
                    </div>
                    <h1 className="font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 tracking-tight">
                        CMS APP
                    </h1>
                </div>

                {/* NAVIGATION LINKS */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
                    <NavItem to="/" icon="📊" label="Dashboard" />
                    <NavItem to="/courses" icon="📚" label="Courses" />
                    <NavItem to="/users" icon="👥" label="Users" />
                    <NavItem to="/professors" icon="👨‍🏫" label="Professors" />
                </div>


                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-slate-700">Admin User</p>
                        <p className="text-[10px] text-slate-400">Super Admin</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-slate-100 border-2 border-white shadow-md flex items-center justify-center text-sm">
                        👤
                    </div>
                </div>

            </div>
        </nav>
    );
}