import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Check() {
  const navigate = useNavigate();
  const defaultGreeting = {
    role: "assistant",
    content:
      "Hello! I’m your AI health assistant. Please describe your symptoms in your own words so I can understand what you're experiencing.",
  };

  const [messages, setMessages] = useState([defaultGreeting]);
  const [sessions, setSessions] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Unique session per conversation
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID());

  // Ref for auto-scroll
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function fetchHistory() {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setHistoryLoading(true);
      const res = await fetch("http://localhost:5003/api/assessment/history", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await res.json();
      setSessions(data.sessions || []);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setHistoryLoading(false);
    }
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  const startNewSession = () => {
    const newId = crypto.randomUUID();
    setSessionId(newId);
    setMessages([defaultGreeting]);
  };

  const selectSession = (session) => {
    setSessionId(session.sessionId);
    const msgs =
      session.messages && session.messages.length > 0
        ? session.messages
        : [defaultGreeting];
    setMessages(msgs);
  };

  const parseResultContent = (content) => {
    try {
      const parsed = JSON.parse(content);
      if (
        parsed &&
        (parsed.possible_conditions ||
          parsed.recommendations ||
          parsed.symptoms)
      ) {
        return parsed;
      }
    } catch (_err) {
      return null;
    }
    return null;
  };

  const summarizeContent = (content) => {
    const parsed = parseResultContent(content);
    if (parsed) {
      const conditions = parsed.possible_conditions || [];
      if (conditions.length > 0) {
        const preview = conditions.slice(0, 2).join(", ");
        return `Result: ${preview}${conditions.length > 2 ? "..." : ""}`;
      }
      return "Result ready";
    }
    return content;
  };

  const firstSymptomLabel = (session) => {
    // Prefer parsed symptoms from any message (starting from last)
    const msgs = session.messages || [];
    for (let i = msgs.length - 1; i >= 0; i -= 1) {
      const parsed = parseResultContent(msgs[i].content);
      if (parsed && Array.isArray(parsed.symptoms) && parsed.symptoms.length) {
        const first = parsed.symptoms[0];
        if (typeof first === "string") return first;
        if (first && first.name) return first.name;
      }
    }
    // Fallback: first user message snippet
    const firstUser = msgs.find((m) => m.role === "user");
    if (firstUser?.content) {
      return (
        firstUser.content.slice(0, 30) +
        (firstUser.content.length > 30 ? "…" : "")
      );
    }
    return `Session ${session.sessionId.slice(0, 8)}`;
  };

  const renderMessageContent = (content) => {
    const parsed = parseResultContent(content);
    if (!parsed) return content;

    const conditions = parsed.possible_conditions || [];
    const recs = parsed.recommendations || [];
    const symptoms = parsed.symptoms || [];

    return (
      <div className="space-y-2 text-md">
        {symptoms.length > 0 && (
          <div>
            <div className="font-semibold text-gray-800">Symptoms</div>
            <ul className="list-disc list-inside text-gray-800">
              {symptoms.map((s, idx) => (
                <li key={idx}>
                  {typeof s === "string" ? s : JSON.stringify(s)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {conditions.length > 0 && (
          <div>
            <div className="font-semibold text-gray-800">
              Possible conditions
            </div>
            <ul className="list-disc list-inside text-gray-800">
              {conditions.map((c, idx) => (
                <li key={idx}>
                  {typeof c === "string" ? c : JSON.stringify(c)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {Array.isArray(recs) && recs.length > 0 && (
          <div>
            <div className="font-semibold text-gray-800">Recommendations</div>
            <ul className="list-disc list-inside text-gray-800">
              {recs.map((r, idx) => (
                <li key={idx}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        {parsed.disclaimer && (
          <div className="text-md text-gray-600">{parsed.disclaimer}</div>
        )}
      </div>
    );
  };

  async function sendMessage() {
    if (!input.trim()) return;

    const newUserMsg = { role: "user", content: input };

    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5003/api/assessment/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          message: newUserMsg.content,
          history: updatedMessages,
          sessionId,
        }),
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await res.json();

      // Debug: Log the response
      console.log("API Response:", data);

      // If AI generated a final result → redirect to results page
      if (data.done === true && data.result) {
        // Debug: Log the result structure
        console.log("Final result:", data.result);

        // Save result to localStorage for persistence
        localStorage.setItem("assessment_result", JSON.stringify(data.result));

        // Navigate and pass state too
        navigate("/result", { state: { result: data.result } });

        return;
      }

      // Otherwise add AI reply to chat
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "Can you explain more?" },
      ]);

      // Refresh history to keep sidebar updated
      fetchHistory();
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="w-full flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="w-64 bg-white border border-gray-200  min-h-[calc(100vh-5rem)] sticky flex flex-col shadow-sm">
          <div className="p-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-md font-semibold text-gray-900">Your Chats</h3>
            <button
              onClick={startNewSession}
              className="text-md text-blue-600 hover:text-blue-700 font-medium"
            >
              New
            </button>
          </div>

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

        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-white border border-gray-200  shadow-sm">
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2.5 rounded-lg text-md ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-blue-50 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {renderMessageContent(msg.content)}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-600 px-4 py-2.5 rounded-lg rounded-bl-sm animate-pulse text-md">
                  AI is thinking…
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="border-t border-gray-200 px-4 py-3">
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
        </div>
      </div>
    </div>
  );
}
