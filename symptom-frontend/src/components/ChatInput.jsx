export default function ChatInput({ input, setInput, sendMessage, loading }) {
  return (
    <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Describe your symptoms or answer the AI..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-md"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm text-md font-medium disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
