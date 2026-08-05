import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import api from "../services/api";

type Stats = {
  totalItems: number;
  lostItems: number;
  foundItems: number;
  claimedItems: number;
  myItems: number;
  myClaims: number;
};

function Dashboard() {
  useEffect(() => {
    document.title = "CampusFind | Dashboard";
  }, []);

  const [stats, setStats] = useState<Stats>({
    totalItems: 0,
    lostItems: 0,
    foundItems: 0,
    claimedItems: 0,
    myItems: 0,
    myClaims: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(res.data.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        <p className="mt-4 text-lg font-semibold text-gray-700">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-10 text-center text-white shadow-lg">
          <h1 className="text-4xl font-bold md:text-5xl">
            CampusFind Dashboard
          </h1>

          <p className="mt-3 text-blue-100">
            A quick overview of your lost and found activity.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Items"
            value={stats.totalItems}
            color="bg-blue-600"
          />

          <StatCard
            title="Lost Items"
            value={stats.lostItems}
            color="bg-red-600"
          />

          <StatCard
            title="Found Items"
            value={stats.foundItems}
            color="bg-green-600"
          />

          <StatCard
            title="Claimed Items"
            value={stats.claimedItems}
            color="bg-yellow-500"
          />

          <StatCard
            title="My Items"
            value={stats.myItems}
            color="bg-purple-600"
          />

          <StatCard
            title="My Claims"
            value={stats.myClaims}
            color="bg-pink-600"
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;