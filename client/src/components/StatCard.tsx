type Props = {
  title: string;
  value: number;
  color: string;
};

function StatCard({ title, value, color }: Props) {
  return (
    <div
      className={`rounded-xl shadow-lg p-6 text-white ${color}`}
    >
      <h3 className="text-lg font-medium">{title}</h3>

      <p className="mt-3 text-4xl font-bold">
        {value}
      </p>
    </div>
  );
}

export default StatCard;