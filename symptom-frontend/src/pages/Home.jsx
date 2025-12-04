import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="pt-32 max-w-4xl mx-auto text-center px-6">
        <span className="inline-block bg-brand-light text-brand-blue px-4 py-1 rounded-full text-sm font-medium shadow-sm mb-6">
          ✨ AI-Powered Health Assistant
        </span>

        <h1 className="text-5xl font-bold text-gray-800 leading-tight">
          Check your symptoms <br />
          <span className="text-brand-blue">with confidence.</span>
        </h1>

        <p className="mt-6 text-gray-600 text-lg max-w-2xl mx-auto">
          Describe your symptoms in your own words, and our advanced AI will
          guide you through a personalized health assessment.
        </p>

        {/* Search Box */}
        <div className="mt-12 bg-white shadow-card rounded-xl2 p-6 max-w-2xl mx-auto">
          <div className="flex gap-3 border-b mb-4 pb-2">
            <button className="flex-1 text-brand-blue font-semibold border-b-2 border-brand-blue pb-2">
              Natural Language
            </button>
            <button className="flex-1 text-gray-400 pb-2">Guided Form</button>
          </div>

          <textarea
            placeholder="e.g., I have a headache that gets worse when I look at light, and I feel nauseous..."
            className="w-full border border-gray-200 rounded-xl p-4 text-gray-700 focus:ring-2 focus:ring-brand-blue outline-none"
            rows="4"
          />

          <div className="flex justify-between items-center mt-3">
            <p className="text-xs text-gray-400">Private & Secure</p>

            <a
              href="/check"
              className="bg-brand-blue text-white px-6 py-2 rounded-full hover:bg-blue-700 transition flex items-center gap-2"
            >
              Start Check →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
