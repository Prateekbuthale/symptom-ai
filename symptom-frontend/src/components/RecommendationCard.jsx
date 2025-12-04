export default function RecommendationCard({ rec }) {
  return (
    <div className="bg-white shadow-md p-5 rounded-lg border">
      <p className="mb-3">
        <strong>Mild:</strong> {rec.mild}
      </p>
      <p className="mb-3">
        <strong>Moderate:</strong> {rec.moderate}
      </p>
      <p>
        <strong>Warning Signs:</strong> {rec.warning}
      </p>
    </div>
  );
}
