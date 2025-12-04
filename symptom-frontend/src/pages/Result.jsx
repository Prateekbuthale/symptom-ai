import ConditionCard from "../components/ConditionCard";
import RecommendationCard from "../components/RecommendationCard";
import RedFlagAlert from "../components/RedFlagAlert";

export default function Result() {
  const result = JSON.parse(localStorage.getItem("assessment_result") || "{}");

  if (!result) return <h2 className="p-8 text-center">No results found.</h2>;

  if (result.safe === false) {
    return <RedFlagAlert message={result.emergency} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Possible Conditions
        </h1>

        {result.possible_conditions?.map((cond, i) => (
          <ConditionCard key={i} condition={cond} />
        ))}

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
          Recommendations
        </h2>

        <RecommendationCard rec={result.recommendations} />

        <p className="text-sm text-gray-500 mt-6">{result.disclaimer}</p>

        <a href="/check" className="mt-8 inline-block text-blue-600 underline">
          Run another check →
        </a>
      </div>
    </div>
  );
}
