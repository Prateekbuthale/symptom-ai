export default function ChatSidebar({
  sessions,
  historyLoading,
  sessionId,
  startNewSession,
  selectSession,
  summarizeContent,
  firstSymptomLabel,
}) {
  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 flex flex-col shadow-sm z-40">
      {/* ✅ Fixed Header */}
      <div className="p-3 border-b bg-white border-gray-200 flex items-center justify-between">
        <h3 className="text-md font-semibold text-gray-900">Your Chats</h3>
        <button
          onClick={startNewSession}
          className="text-md text-blue-600 hover:text-blue-700 font-medium"
        >
          New
        </button>
      </div>

      {/* ✅ Independent Scroll Area */}
      <div className="flex-1 overflow-y-auto">
        {historyLoading ? (
          <div className="p-3 text-md text-gray-500">Loading history…</div>
        ) : sessions.length === 0 ? (
          <div className="p-3 text-md text-gray-500">
            No chats yet. Start a new conversation.
          </div>
        ) : (
          sessions.map((session) => {
            const lastMessageRaw =
              session.messages?.[session.messages.length - 1]?.content ||
              "No messages";

            const lastMessage = summarizeContent(lastMessageRaw);
            const isActive = session.sessionId === sessionId;

            return (
              <button
                key={session.sessionId}
                onClick={() => selectSession(session)}
                className={`w-full text-left px-3 py-2.5 border-b border-gray-100 hover:bg-blue-50 transition ${
                  isActive ? "bg-blue-50" : ""
                }`}
              >
                <div className="text-md font-medium text-gray-900 truncate mb-0.5">
                  {firstSymptomLabel(session)}
                </div>
                <div className="text-md text-gray-500 truncate">
                  {lastMessage}
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
