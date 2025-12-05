export default function RecommendationCard({ rec }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      {rec.mild && (
        <p className="mb-3 text-sm text-gray-700">
          <span className="font-medium text-gray-900">Mild:</span> {rec.mild}
        </p>
      )}
      {rec.moderate && (
        <p className="mb-3 text-sm text-gray-700">
          <span className="font-medium text-gray-900">Moderate:</span>{" "}
          {rec.moderate}
        </p>
      )}
      {rec.warning && (
        <p className="text-sm text-gray-700">
          <span className="font-medium text-gray-900">Warning Signs:</span>{" "}
          {rec.warning}
        </p>
      )}
    </div>
  );
}
