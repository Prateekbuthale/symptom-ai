import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ConditionCard from "../components/ConditionCard";
import RecommendationCard from "../components/RecommendationCard";

export default function Result() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSession() {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_BASEURL}/api/assessment/history`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        const data = await res.json();
        const session = (data.sessions || []).find(
          (s) => s.sessionId === sessionId
        );
        if (session && Array.isArray(session.messages)) {
          // Get last message with a valid result
          for (let i = session.messages.length - 1; i >= 0; i--) {
            try {
              const parsed = JSON.parse(session.messages[i].content);
              if (
                parsed &&
                (parsed.possible_conditions ||
                  parsed.recommendations ||
                  parsed.symptoms)
              ) {
                setResult(parsed);
                return;
              }
            } catch {}
          }
        }
        setResult(null);
      } catch {
        setResult(null);
      } finally {
        setLoading(false);
      }
    }
    fetchSession();
  }, [sessionId, navigate]);

  if (loading) {
    return (
      <div className="p-8 text-lg text-center text-gray-600">
        Loading result…
      </div>
    );
  }

  if (!result) {
    return (
      <div className="p-6 text-center">
        <h2>No assessment result found for this session.</h2>
        <button
          onClick={() => navigate("/results")}
          className="mt-4 text-blue-600 underline"
        >
          Go back to all results
        </button>
      </div>
    );
  }

  // Normalize conditions (array of strings or objects)
  const conditions = result.possible_conditions || [];
  const normalizedConditions = conditions.map((cond) => {
    if (typeof cond === "string") {
      return { name: cond, likelihood: "Possible" };
    }
    return cond;
  });

  // Handle recommendations
  let recommendationsDisplay = null;
  if (Array.isArray(result.recommendations)) {
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
    recommendationsDisplay = (
      <RecommendationCard rec={result.recommendations} />
    );
  } else {
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
            Session Result
          </h1>
          <a
            href="/results"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            ← All Results
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
