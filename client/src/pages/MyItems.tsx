import { useEffect, useState } from "react";
import api from "../services/api";
import ItemCard from "../components/ItemCard";
import Swal from "sweetalert2";

type Item = {
  _id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  location: string;
  image: string;
  createdAt: string;
};

function MyItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.get("/items/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setItems(res.data.items);
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load your items.",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete Item?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/items/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setItems((prevItems) =>
        prevItems.filter((item) => item._id !== id)
      );

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Item deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err: any) {
      console.error(err);

      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text:
          err.response?.data?.message ||
          "Something went wrong.",
      });
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-6">
      <h1 className="mb-8 text-center text-4xl font-bold">
        My Items
      </h1>

      {loading ? (
        <div className="py-20 text-center text-2xl font-semibold text-blue-600">
          Loading items...
        </div>
      ) : items.length === 0 ? (
        <h2 className="text-center text-gray-500">
          No items found.
        </h2>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ItemCard
              key={item._id}
              id={item._id}
              title={item.title}
              description={item.description}
              category={item.category}
              type={item.type}
              location={item.location}
              image={item.image}
              createdAt={item.createdAt}
              onDelete={deleteItem}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyItems;