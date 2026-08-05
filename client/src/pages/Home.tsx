import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import ItemCard from "../components/ItemCard";

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

function Home() {
  useEffect(() => {
    document.title = "CampusFind | Home";
  }, []);

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category]);

  const fetchItems = async () => {
    try {
      setLoading(true);

      const res = await api.get("/items", {
        params: {
          search,
          category,
        },
      });

      setItems(res.data.items);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    return {
      total: items.length,
      lost: items.filter((i) => i.type === "Lost").length,
      found: items.filter((i) => i.type === "Found").length,
    };
  }, [items]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <h1 className="text-5xl font-bold">
            CampusFind
          </h1>

          <p className="mt-4 text-lg text-blue-100">
            Helping students reunite with their lost belongings.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-6">
            <div className="rounded-xl bg-white/20 px-8 py-4 backdrop-blur">
              <h2 className="text-3xl font-bold">
                {stats.total}
              </h2>
              <p>Total Items</p>
            </div>

            <div className="rounded-xl bg-white/20 px-8 py-4 backdrop-blur">
              <h2 className="text-3xl font-bold">
                {stats.lost}
              </h2>
              <p>Lost</p>
            </div>

            <div className="rounded-xl bg-white/20 px-8 py-4 backdrop-blur">
              <h2 className="text-3xl font-bold">
                {stats.found}
              </h2>
              <p>Found</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Search Section */}
        <div className="mb-10 rounded-xl bg-white p-6 shadow-lg">
          <h2 className="mb-5 text-2xl font-bold">
            Search Items
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <input
              type="text"
              placeholder="🔍 Search by title or description..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option>All</option>
              <option>Electronics</option>
              <option>Documents</option>
              <option>Clothing</option>
              <option>Accessories</option>
              <option>Books</option>
              <option>Others</option>
            </select>
          </div>
        </div>

        <h2 className="mb-6 text-3xl font-bold">
          Latest Items
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>

            <p className="mt-4 text-lg font-semibold text-gray-700">
              Loading items...
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-lg">
            <div className="text-6xl">
              📭
            </div>

            <h2 className="mt-4 text-3xl font-bold text-gray-700">
              No Items Found
            </h2>

            <p className="mt-3 text-gray-500">
              Try changing the search or category filter.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;