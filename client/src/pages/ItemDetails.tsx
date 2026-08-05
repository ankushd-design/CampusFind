import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import api from "../services/api";

type Item = {
  _id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  location: string;
  image: string;
  status: string;
  createdAt: string;
  postedBy: {
    _id: string;
    name: string;
    email: string;
  };
};

function ItemDetails() {
  const { id } = useParams();

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchItem = async () => {
    try {
      const res = await api.get(`/items/${id}`);
      setItem(res.data.item);
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load item details.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        Swal.fire({
          icon: "warning",
          title: "Login Required",
          text: "Please login first.",
        });
        return;
      }

      setClaiming(true);

      await api.post(
        "/claims",
        {
          itemId: item?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await Swal.fire({
        icon: "success",
        title: "Claim Submitted",
        text: "Claim request submitted successfully!",
        timer: 1500,
        showConfirmButton: false,
      });

      fetchItem();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Claim Failed",
        text:
          err.response?.data?.message ||
          "Failed to submit claim.",
      });
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        <p className="mt-4 text-lg font-semibold text-gray-700">
          Loading item details...
        </p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-16 text-center">
        <div className="rounded-xl bg-white p-12 shadow-lg">
          <div className="text-6xl">📭</div>
          <h2 className="mt-4 text-3xl font-bold text-gray-700">
            Item not found
          </h2>
          <p className="mt-3 text-gray-500">
            The item you are looking for does not exist or has been removed.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = item.postedBy._id === userId;

  return (
    <div className="mx-auto max-w-5xl p-6">
      <Link
        to="/"
        className="mb-6 inline-block text-blue-600 hover:underline"
      >
        ← Back
      </Link>

      <div className="overflow-hidden rounded-xl bg-white shadow-lg">
        <div className="relative">
          <img
            src={
              item.image
                ? `https://campusfind-aq4o.onrender.com${item.image}`
                : "https://via.placeholder.com/900x500?text=No+Image"
            }
            alt={item.title}
            className="h-96 w-full object-cover"
          />

          <span
            className={`absolute right-4 top-4 rounded-full px-4 py-2 text-sm font-semibold shadow-sm ${
              item.status === "Open"
                ? "bg-green-100 text-green-700"
                : item.status === "Claimed"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {item.status}
          </span>
        </div>

        <div className="p-8">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h1 className="text-4xl font-bold text-gray-900">
              {item.title}
            </h1>

            <span className="text-sm text-gray-400">
              Posted on {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </div>

          <p className="mb-6 text-lg leading-relaxed text-gray-600">
            {item.description}
          </p>

          <div className="grid gap-4 rounded-xl bg-gray-50 p-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-semibold text-gray-800">{item.category}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p
                className={`font-semibold ${
                  item.type === "Lost"
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {item.type}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-semibold text-gray-800">{item.location}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Posted By</p>
              <p className="font-semibold text-gray-800">{item.postedBy.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold text-gray-800">{item.postedBy.email}</p>
            </div>
          </div>

          {!isOwner && item.status === "Open" && (
            <button
              onClick={handleClaim}
              disabled={claiming}
              className="mt-8 w-full rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {claiming ? "Claiming..." : "Claim Item"}
            </button>
          )}

          {isOwner && (
            <div className="mt-8 rounded-lg bg-blue-100 p-4 text-center font-semibold text-blue-700">
              You are the owner of this item.
            </div>
          )}

          {!isOwner && item.status !== "Open" && (
            <div className="mt-8 rounded-lg bg-gray-200 p-4 text-center font-semibold text-gray-700">
              This item is no longer available for claiming.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemDetails;