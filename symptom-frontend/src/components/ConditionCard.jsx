export default function ConditionCard({ condition }) {
  const { name, likelihood, description, reasoning, action } = condition || {};

  // Prefer provided description; fallback to reasoning; otherwise a generic note
  const displayDescription = description || reasoning || "";

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{name}</h3>
      {likelihood && (
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-medium">Likelihood:</span> {likelihood}
        </p>
      )}
      {displayDescription && (
        <p className="text-sm text-gray-700 mb-3">{displayDescription}</p>
      )}
      {action && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-600 mb-1">
            Recommended Action:
          </p>
          <p className="text-sm text-gray-700">{action}</p>
        </div>
      )}
    </div>
  );
}
