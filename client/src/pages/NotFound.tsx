import { useEffect } from "react";
import { Link } from "react-router-dom";

function NotFound() {
  useEffect(() => {
    document.title = "CampusFind | Page Not Found";
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-6">
      <div className="max-w-xl rounded-2xl bg-white p-10 text-center shadow-xl">
        <div className="text-7xl">🔍</div>

        <h1 className="mt-4 text-7xl font-extrabold text-blue-600">
          404
        </h1>

        <h2 className="mt-4 text-3xl font-bold text-gray-800">
          Page Not Found
        </h2>

        <p className="mt-4 text-gray-600">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <Link
          to="/"
          className="mt-8 inline-block rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;