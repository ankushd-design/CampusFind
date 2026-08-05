import { Link, NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "rounded-md bg-blue-700 px-3 py-2 font-medium"
      : "rounded-md px-3 py-2 font-medium transition hover:bg-blue-500";

  return (
    <nav className="sticky top-0 z-50 bg-blue-600 text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-wide"
        >
          CampusFind
        </Link>

        {/* Navigation */}
        <div className="flex flex-wrap items-center gap-2">
          <NavLink to="/" className={navClass}>
            Home
          </NavLink>

          {token ? (
            <>
              <NavLink
                to="/dashboard"
                className={navClass}
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/profile"
                className={navClass}
              >
                Profile
              </NavLink>

              <NavLink
                to="/create"
                className={navClass}
              >
                Create
              </NavLink>

              <NavLink
                to="/my-items"
                className={navClass}
              >
                My Items
              </NavLink>

              <NavLink
                to="/my-claims"
                className={navClass}
              >
                My Claims
              </NavLink>

              <NavLink
                to="/received-claims"
                className={navClass}
              >
                Received Claims
              </NavLink>

              <button
                onClick={logout}
                className="ml-2 rounded-md bg-red-500 px-4 py-2 font-medium transition hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={navClass}
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className={navClass}
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;