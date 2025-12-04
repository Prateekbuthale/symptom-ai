import Navbar from "../components/Navbar";

export default function Assessment() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="pt-20 flex max-w-6xl mx-auto">
        {/* LEFT SIDEBAR */}
        <aside className="w-1/4 bg-white p-6 shadow-sm rounded-xl h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Assessment</h2>
          <p className="text-gray-500 text-sm mb-4">
            Answer a few questions to help us understand your condition.
          </p>

          <p className="text-sm text-gray-600 mb-2 font-medium">Progress</p>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-brand-blue rounded-full"
              style={{ width: "10%" }}
            ></div>
          </div>

          <div className="mt-6 p-4 bg-brand-light text-brand-blue rounded-lg text-sm">
            <strong>Medical Disclaimer</strong>
            <p className="text-gray-600 mt-1">
              This tool does not provide medical advice. Contact emergency
              services if needed.
            </p>
          </div>
        </aside>

        {/* CHAT AREA */}
        <main className="flex-1 px-8">
          <div className="mt-6 space-y-6">
            {/* Bot bubble */}
            <div className="bg-white shadow-sm p-4 rounded-xl max-w-md">
              <p className="text-gray-700">
                I understand you're experiencing:{" "}
                <strong>"headache and body pain"</strong>. Let's figure this out
                together.
              </p>
            </div>

            {/* Bot question */}
            <div className="bg-white shadow-sm p-4 rounded-xl max-w-md">
              <p className="text-gray-700">
                How long have you had these symptoms?
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              {["Less than a day", "A few days", "A week or more"].map(
                (opt) => (
                  <button
                    key={opt}
                    className="px-4 py-2 rounded-full border border-gray-300 hover:border-brand-blue text-gray-700 hover:text-brand-blue transition"
                  >
                    {opt}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Input */}
          <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-sm p-4 flex justify-center">
            <input
              placeholder="Type your answer..."
              className="w-1/2 border border-gray-300 rounded-full px-5 py-2 focus:ring-brand-blue outline-none"
            />
            <button className="ml-3 bg-brand-blue text-white p-3 rounded-full hover:bg-blue-700">
              ➤
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

