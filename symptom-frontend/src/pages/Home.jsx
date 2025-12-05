import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="bg-linear-to-b from-gray-50 to-white min-h-screen">
      <Navbar />

      <main className="pt-5 pb-5">
        <section className="max-w-7xl mx-auto  flex flex-col gap-12 lg:flex-row lg:items-center min-h-[calc(100vh-7rem)]">
          {/* Hero text */}
          <div className="flex-1 space-y-6">
            <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
              ✨ AI-Powered Health Assistant
            </span>

            <h1 className="text-6xl sm:text-6xl font-bold text-gray-900 leading-tight">
              Get a personalized symptom check <br />
              <span className="text-blue-700">in minutes.</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-xl">
              Describe your symptoms in your own words, and our advanced AI will
              guide you through a personalized health assessment.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <a
                href="/check"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-blue-700 text-white font-semibold shadow-lg shadow-blue-200 hover:bg-blue-800 transition"
              >
                Start chat now
              </a>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-full border">
                🔒 Secure & private
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-full border">
                ⚡ Quick results
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-full border">
                ⏱️ 24/7 Availability
              </div>
            </div>
          </div>

          {/* Chat preview card */}
          <div className="flex-1">
            <div className="bg-white border border-gray-200 shadow-xl rounded-2xl p-6 space-y-1">
              <div className="flex items-center justify-between">
                {/* <div className="font-semibold text-gray-900">Live Preview</div> */}
                {/* <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Real-time
                </span> */}
              </div>

              <div className="space-y-3">
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 px-4 py-3 my-2 rounded-2xl rounded-bl-none shadow-sm max-w-xs text-md">
                    Hi there 👋 I’m your AI health assistant. What symptoms are
                    you experiencing today?
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white px-4 py-3 my-2 rounded-2xl rounded-br-none shadow-sm max-w-xs text-md">
                    I’ve had wrist pain and tingling for a few days.
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 px-4 py-3 my-2 rounded-2xl rounded-bl-none shadow-sm max-w-xs text-md">
                    Got it. Any numbness or weakness when gripping objects?
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white px-4 py-3 my-2 rounded-2xl rounded-br-none shadow-sm max-w-xs text-md">
                    Yes, I feel the weakness while gripping objects.
                  </div>
                </div>
              </div>

              {/* <div className="mt-4 flex items-center gap-3">
                <input
                  disabled
                  value="Describe your symptoms..."
                  className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-500 bg-gray-50"
                  readOnly
                />
                <button className="px-4 py-2 rounded-full bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-200">
                  Send
                </button>
              </div> */}
            </div>
          </div>
        </section>
      </main>
      <div className="w-full max-w-7xl mx-auto text-center mt-4 mb-3">
        <p className="text-s text-gray-500">
          This tool does not provide medical advice. Always consult a doctor for
          serious concerns.
        </p>
      </div>
    </div>
  );
}
