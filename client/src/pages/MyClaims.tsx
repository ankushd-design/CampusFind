import { useEffect, useState } from "react";
import api from "../services/api";

type Claim = {
  _id: string;
  status: string;
  createdAt: string;
  item: {
    _id: string;
    title: string;
    description: string;
    category: string;
    type: string;
    location: string;
    image: string;
    status: string;
  };
};

function MyClaims() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.get("/claims/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setClaims(res.data.claims);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClasses = (status: string) => {
    if (status === "Pending") return "bg-yellow-100 text-yellow-700";
    if (status === "Accepted") return "bg-green-100 text-green-700";
    if (status === "Rejected") return "bg-red-100 text-red-700";
    return "bg-blue-100 text-blue-700";
  };

  return (
    <div className="mx-auto max-w-7xl p-6">
      <h1 className="mb-8 text-center text-4xl font-bold">
        My Claims
      </h1>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="mt-4 text-lg font-semibold text-gray-700">
            Loading claims...
          </p>
        </div>
      ) : claims.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-lg">
          <div className="text-6xl">📝</div>

          <h2 className="mt-4 text-3xl font-bold text-gray-700">
            No Claims Yet
          </h2>

          <p className="mt-3 text-gray-500">
            Claims you make will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {claims.map((claim) => (
            <div
              key={claim._id}
              className="overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-lg"
            >
              <img
                src={
                  claim.item.image
                    ? `http://localhost:5000${claim.item.image}`
                    : "https://via.placeholder.com/500x300?text=No+Image"
                }
                alt={claim.item.title}
                className="h-56 w-full object-cover"
              />

              <div className="p-6">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-blue-600">
                    {claim.item.title}
                  </h2>

                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusClasses(
                      claim.status
                    )}`}
                  >
                    {claim.status}
                  </span>
                </div>

                <p className="text-gray-600 line-clamp-3">
                  {claim.item.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                    {claim.item.category}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-sm ${
                      claim.item.type === "Lost"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {claim.item.type}
                  </span>
                </div>

                <div className="mt-4 space-y-1">
                  <p className="text-gray-500">📍 {claim.item.location}</p>

                  <p className="text-sm text-gray-400">
                    📅 Claimed on{" "}
                    {new Date(claim.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyClaims;