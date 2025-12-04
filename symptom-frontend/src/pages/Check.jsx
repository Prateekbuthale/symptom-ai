import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Check() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I’m your AI health assistant. Please describe your symptoms in your own words so I can understand what you're experiencing.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Unique session per conversation
  const [sessionId] = useState(() => crypto.randomUUID());

  // Ref for auto-scroll
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pt-20">
      {/* Chat Window */}
      <div className="flex-1 max-w-3xl mx-auto w-full p-4 overflow-y-auto space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-3 rounded-2xl text-sm shadow-md ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-600 px-4 py-3 rounded-2xl shadow rounded-bl-none animate-pulse">
              AI is thinking…
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="fixed bottom-0 w-full bg-white border-t">
        <div className="max-w-3xl mx-auto p-4 flex space-x-3">
          <input
            type="text"
            placeholder="Describe your symptoms or answer the AI..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition shadow-md"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
