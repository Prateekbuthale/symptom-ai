import { useLocation, useNavigate } from "react-router-dom";
import ConditionCard from "../components/ConditionCard";
import RecommendationCard from "../components/RecommendationCard";
import RedFlagAlert from "../components/RedFlagAlert";

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  // Try getting from navigation
  const navResult = location.state?.result;

  // Try getting from localStorage
  const storedResult = JSON.parse(
    localStorage.getItem("assessment_result") || "null"
  );

  // Prefer navigation state → fallback to storage
  const result = navResult || storedResult;

  // Debug: Log the result to see what we're receiving
  console.log("Result data:", result);

  if (!result) {
    return (
      <div className="p-6 text-center">
        <h2>No assessment result found.</h2>
        <button
          onClick={() => navigate("/check")}
          className="mt-4 text-blue-600 underline"
        >
          Start a new assessment →
        </button>
      </div>
    );
  }

  // 4️⃣ Save to localStorage (only if new)
  if (navResult) {
    localStorage.setItem("assessment_result", JSON.stringify(navResult));
  }

  // 5️⃣ Emergency check
  if (result.emergency === true) {
    return (
      <RedFlagAlert message="Critical symptoms detected. Seek medical help immediately." />
    );
  }

  // Transform data to match component expectations
  // Handle possible_conditions: can be array of strings or array of objects
  const conditions = result.possible_conditions || [];
  const normalizedConditions = conditions.map((cond) => {
    if (typeof cond === "string") {
      // If it's a string, convert to object format
      return {
        name: cond,
        likelihood: "Possible",
        reasoning: "Based on your symptoms, this condition is a possibility.",
      };
    }
    // If it's already an object, use it as-is
    return cond;
  });

  // Handle recommendations: can be array of strings or object
  let recommendationsDisplay = null;
  if (Array.isArray(result.recommendations)) {
    // If it's an array of strings, display as a list
    recommendationsDisplay = (
      <div className="bg-white shadow-md p-5 rounded-lg border">
        <ul className="list-disc list-inside space-y-2">
          {result.recommendations.map((rec, i) => (
            <li key={i} className="text-gray-700">
              {rec}
            </li>
          ))}
        </ul>
      </div>
    );
  } else if (result.recommendations && typeof result.recommendations === "object") {
    // If it's an object, use the RecommendationCard component
    recommendationsDisplay = <RecommendationCard rec={result.recommendations} />;
  } else {
    // Fallback
    recommendationsDisplay = (
      <div className="bg-white shadow-md p-5 rounded-lg border">
        <p className="text-gray-600">No specific recommendations available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Possible Conditions
        </h1>

        {normalizedConditions.length > 0 ? (
          normalizedConditions.map((cond, i) => (
            <ConditionCard key={i} condition={cond} />
          ))
        ) : (
          <div className="bg-white shadow-card rounded-xl p-5 border border-gray-100">
            <p className="text-gray-600">No conditions identified.</p>
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
          Recommendations
        </h2>

        {recommendationsDisplay}

        {result.symptoms && result.symptoms.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
              Symptoms Identified
            </h2>
            <div className="bg-white shadow-md p-5 rounded-lg border">
              <ul className="list-disc list-inside space-y-2">
                {result.symptoms.map((symptom, i) => (
                  <li key={i} className="text-gray-700">
                    {typeof symptom === "string"
                      ? symptom
                      : symptom.name || JSON.stringify(symptom)}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <p className="text-sm text-gray-500 mt-6">{result.disclaimer}</p>

        <a href="/check" className="mt-8 inline-block text-blue-600 underline">
          Run another check →
        </a>
      </div>
    </div>
  );
}
