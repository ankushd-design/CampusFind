import { Link } from "react-router-dom";

type ItemProps = {
  id?: string;
  title: string;
  description: string;
  category: string;
  type: string;
  location: string;
  image?: string;
  status?: string;
  createdAt?: string;
  onDelete?: (id: string) => void;
};

function ItemCard({
  id,
  title,
  description,
  category,
  type,
  location,
  image,
  status = "Open",
  createdAt,
  onDelete,
}: ItemProps) {
  const getStatusClasses = () => {
    if (status === "Open") return "bg-green-100 text-green-700";
    if (status === "Claimed") return "bg-yellow-100 text-yellow-700";
    return "bg-blue-100 text-blue-700";
  };

  const cardContent = (
    <>
      <div className="relative">
        <img
          src={
            image
              ? `http://localhost:5000${image}`
              : "https://via.placeholder.com/500x300?text=No+Image"
          }
          alt={title}
          className="h-56 w-full object-cover"
        />

        <span
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${getStatusClasses()}`}
        >
          {status}
        </span>
      </div>

      <div className="p-6">
        <div className="mb-3">
          <h2 className="text-2xl font-bold leading-tight text-blue-600">
            {title}
          </h2>
        </div>

        <p className="line-clamp-3 text-gray-600">{description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
            {category}
          </span>

          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              type === "Lost"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {type}
          </span>
        </div>

        <div className="mt-4 space-y-1">
          <p className="text-gray-500">📍 {location}</p>

          {createdAt && (
            <p className="text-sm text-gray-400">
              📅 Posted on {new Date(createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-md transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      {id ? (
        <Link to={`/items/${id}`} className="block">
          {cardContent}
        </Link>
      ) : (
        cardContent
      )}

      {id && onDelete && (
        <div className="flex gap-3 border-t p-4">
          <Link
            to={`/edit/${id}`}
            className="flex-1 rounded-lg bg-blue-600 py-2 text-center text-white transition hover:bg-blue-700"
          >
            Edit
          </Link>

          <button
            onClick={() => onDelete(id)}
            className="flex-1 rounded-lg bg-red-600 py-2 text-white transition hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default ItemCard;