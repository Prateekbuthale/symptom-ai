export default function RedFlagAlert({ message }) {
  return (
    <div className="min-h-screen flex justify-center items-center bg-red-50 p-4 pt-20">
      <div className="bg-white border border-red-300 rounded-lg p-6 sm:p-8 max-w-lg text-center shadow-sm">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">
          ⚠️ Emergency Warning
        </h2>
        <p className="text-red-700 text-base mb-4">{message}</p>
        <p className="text-sm text-gray-600 mb-6">
          Please seek emergency medical help immediately.
        </p>

        <a
          href="/check"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          Go Back
        </a>
      </div>
    </div>
  );
}
