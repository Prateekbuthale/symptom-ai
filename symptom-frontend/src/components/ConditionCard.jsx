export default function ConditionCard({ condition }) {
  return (
    <div className="bg-white shadow-card rounded-xl p-5 border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800">{condition.name}</h3>
      <p className="text-gray-600 mt-1">
        <strong>Likelihood:</strong> {condition.likelihood}
      </p>
      <p className="text-gray-700 mt-2">{condition.reasoning}</p>
    </div>
  );
}
