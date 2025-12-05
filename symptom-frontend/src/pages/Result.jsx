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
  } else if (
    result.recommendations &&
    typeof result.recommendations === "object"
  ) {
    // If it's an object, use the RecommendationCard component
    recommendationsDisplay = (
      <RecommendationCard rec={result.recommendations} />
    );
  } else {
    // Fallback
    recommendationsDisplay = (
      <div className="bg-white shadow-md p-5 rounded-lg border">
        <p className="text-gray-600">No specific recommendations available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Results
          </h1>
          <a
            href="/check"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Continue chat →
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Possible Conditions
            </h2>

            {normalizedConditions.length > 0 ? (
              normalizedConditions.map((cond, i) => (
                <ConditionCard key={i} condition={cond} />
              ))
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600">
                  No conditions identified.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {result.symptoms && result.symptoms.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Symptoms Identified
                </h2>
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-700">
                    {result.symptoms.map((symptom, i) => (
                      <li key={i}>
                        {typeof symptom === "string"
                          ? symptom
                          : symptom.name || JSON.stringify(symptom)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Recommendations
              </h2>
              {recommendationsDisplay}
            </div>
          </div>
        </div>

        <div className="mt-8 text-xs sm:text-sm text-gray-600 space-y-2 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <p className="font-medium text-gray-900 mb-2">Medical Disclaimer:</p>
          <p>
            This assessment is generated by an AI-based educational tool and is
            not a medical diagnosis. It is intended for informational purposes
            only and should not be used as a substitute for professional medical
            advice, diagnosis, or treatment.
          </p>
          <p>
            Always seek the advice of a qualified healthcare provider with any
            questions you may have regarding a medical condition. Never
            disregard professional medical advice or delay seeking it because of
            information provided here.
          </p>
          <p className="font-medium">
            If you believe you are experiencing a medical emergency, call your
            local emergency number immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
