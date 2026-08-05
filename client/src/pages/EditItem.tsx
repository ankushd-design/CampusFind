import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../services/api";
import Input from "../components/Input";
import Button from "../components/Button";

function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [type, setType] = useState("Lost");
  const [location, setLocation] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    fetchItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchItem = async () => {
    try {
      const res = await api.get(`/items/${id}`);

      const item = res.data.item;

      setTitle(item.title);
      setDescription(item.description);
      setCategory(item.category);
      setType(item.type);
      setLocation(item.location);

      if (item.image) {
        setPreview(`https://campusfind-aq4o.onrender.com${item.image}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load item.");
    } finally {
      setPageLoading(false);
    }
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !title.trim() ||
      !description.trim() ||
      !location.trim()
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("type", type);
      formData.append("location", location);

      if (image) {
        formData.append("image", image);
      }

      await api.put(`/items/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Item updated successfully!");

      navigate("/my-items");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          "Failed to update item."
      );
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        <p className="mt-4 text-lg font-semibold text-gray-700">
          Loading item...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-4xl font-bold">
          Edit Item
        </h1>

        <p className="mb-8 text-center text-gray-500">
          Update the details of your item.
        </p>

        <form onSubmit={handleSubmit}>
          <Input
            name="title"
            label="Item Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="mb-5">
            <label className="mb-2 block font-medium text-gray-700">
              Description
            </label>

            <textarea
              rows={4}
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Category
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option>Electronics</option>
                <option>Documents</option>
                <option>Clothing</option>
                <option>Accessories</option>
                <option>Books</option>
                <option>Others</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Type
              </label>

              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option>Lost</option>
                <option>Found</option>
              </select>
            </div>
          </div>

          <div className="mt-5">
            <Input
              name="location"
              label="Location"
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
            />
          </div>

          <div className="mb-5">
            <label className="mb-2 block font-medium text-gray-700">
              Change Image (Optional)
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full rounded-lg border border-gray-300 p-3"
            />
          </div>

          {preview && (
            <div className="mb-6">
              <img
                src={preview}
                alt="Preview"
                className="h-72 w-full rounded-xl border object-cover"
              />
            </div>
          )}

          <Button
            type="submit"
            loading={loading}
          >
            Update Item
          </Button>
        </form>
      </div>
    </div>
  );
}

export default EditItem;