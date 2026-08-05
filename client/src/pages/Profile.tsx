import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../services/api";
import Input from "../components/Input";
import Button from "../components/Button";

function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [totalItems, setTotalItems] = useState(0);
  const [totalClaims, setTotalClaims] = useState(0);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setName(res.data.user.name);
      setEmail(res.data.user.email);

      setTotalItems(res.data.stats.totalItems);
      setTotalClaims(res.data.stats.totalClaims);
    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setPageLoading(false);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await api.put(
        "/users/profile",
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Profile updated");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="py-20 text-center text-2xl font-semibold text-blue-600">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-8 text-center text-4xl font-bold">
        My Profile
      </h1>

      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold">
            Total Items Posted
          </h2>

          <p className="mt-4 text-4xl font-bold text-blue-600">
            {totalItems}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold">
            Total Claims Made
          </h2>

          <p className="mt-4 text-4xl font-bold text-green-600">
            {totalClaims}
          </p>
        </div>
      </div>

      <form
        onSubmit={updateProfile}
        className="rounded-xl bg-white p-8 shadow"
      >
        <Input
          name="name"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          name="email"
          label="Email"
          value={email}
          onChange={() => {}}
          disabled
        />

        <div className="mt-6 flex gap-4">
          <Button
            type="submit"
            loading={loading}
          >
            Save Changes
          </Button>

          <Link
            to="/change-password"
            className="rounded-lg bg-gray-700 px-6 py-3 font-semibold text-white hover:bg-gray-800"
          >
            Change Password
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Profile;