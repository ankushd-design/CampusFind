import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="mt-16 bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Logo */}
          <div>
            <h2 className="text-2xl font-bold text-blue-400">
              CampusFind
            </h2>

            <p className="mt-3 text-gray-400">
              Helping students reconnect with their
              lost belongings through a simple and
              secure Lost & Found platform.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">
              Quick Links
            </h3>

            <div className="flex flex-col gap-2">
              <Link
                to="/"
                className="text-gray-400 hover:text-white"
              >
                Home
              </Link>

              <Link
                to="/dashboard"
                className="text-gray-400 hover:text-white"
              >
                Dashboard
              </Link>

              <Link
                to="/my-items"
                className="text-gray-400 hover:text-white"
              >
                My Items
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">
              Tech Stack
            </h3>

            <p className="text-gray-400">
              React • TypeScript
            </p>

            <p className="text-gray-400">
              Node.js • Express.js
            </p>

            <p className="text-gray-400">
              MongoDB • Tailwind CSS
            </p>
          </div>
        </div>

        <hr className="my-8 border-gray-700" />

        <p className="text-center text-gray-500">
          © {new Date().getFullYear()} CampusFind.
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;