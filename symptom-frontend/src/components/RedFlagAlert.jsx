export default function RedFlagAlert({ message }) {
  return (
    <div className="min-h-screen flex justify-center items-center bg-red-50 p-8">
      <div className="bg-white border border-red-300 shadow-lg rounded-xl p-8 max-w-lg text-center">
        <h2 className="text-3xl font-bold text-red-600 mb-4">
          ⚠️ Emergency Warning
        </h2>
        <p className="text-red-700 text-lg mb-4">{message}</p>
        <p className="text-sm text-gray-600">
          Please seek emergency medical help immediately.
        </p>

        <a
          href="/check"
          className="mt-6 inline-block text-brand-blue underline"
        >
          Go Back
        </a>
      </div>
    </div>
  );
}
