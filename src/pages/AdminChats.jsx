import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function AdminChats() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Fetch all chats on mount
  useEffect(() => {
    axios
      .get("/api/chats/all")
      .then((res) => setChats(res.data.chats))
      .catch((err) => console.error("Failed to load chats:", err));
  }, []);

  // Load messages for selected chat
  const loadMessages = async (chatId) => {
    setSelectedChat(chatId);
    try {
      const res = await axios.get(`/api/chats/${chatId}/messages`);
      setMessages(res.data.messages);
    } catch (err) {
      console.error("Failed to load messages:", err);
      setMessages([]);
    }
  };

  // Send admin reply
  const sendReply = async () => {
    if (!reply.trim()) return;

    try {
      await axios.post(`/api/chats/${selectedChat}/messages`, {
        message: reply.trim(),
      });
      setReply("");
      await loadMessages(selectedChat); // Refresh messages after sending
    } catch (err) {
      console.error("Failed to send reply:", err);
    }
  };

  return (
    <div style={{ display: "flex", gap: "2rem", padding: "1rem" }}>
      {/* LEFT: Chats list */}
      <div
        style={{
          width: "30%",
          borderRight: "1px solid #ddd",
          paddingRight: "1rem",
          overflowY: "auto",
          maxHeight: "80vh",
        }}
      >
        <h2>Chats</h2>
        {chats.length === 0 && <p>No chats available</p>}
        {chats.map((chat) => (
          <div
            key={chat.id}
            style={{
              padding: "10px",
              border: selectedChat === chat.id ? "2px solid blue" : "1px solid #ddd",
              marginBottom: "5px",
              cursor: "pointer",
              borderRadius: "4px",
              backgroundColor: selectedChat === chat.id ? "#f0f8ff" : "white",
            }}
            onClick={() => loadMessages(chat.id)}
          >
            Chat ID: {chat.id}
          </div>
        ))}
      </div>

      {/* RIGHT: Messages & Reply */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {selectedChat ? (
          <>
            <h2>Messages for: {selectedChat}</h2>
            <div
              style={{
                border: "1px solid #ccc",
                height: "60vh",
                overflowY: "auto",
                padding: "1rem",
                flexGrow: 1,
                marginBottom: "1rem",
                backgroundColor: "#fafafa",
              }}
            >
              {messages.length === 0 && <p>No messages yet.</p>}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    marginBottom: "0.5rem",
                    textAlign: msg.senderId === "admin" ? "right" : "left",
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      backgroundColor: msg.senderId === "admin" ? "#d1e7dd" : "#f8d7da",
                      padding: "8px 12px",
                      borderRadius: "15px",
                      maxWidth: "70%",
                      wordBreak: "break-word",
                    }}
                  >
                    <strong>{msg.senderId === "admin" ? "Admin" : "User"}:</strong>{" "}
                    {msg.message}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <textarea
              rows="3"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type your reply here"
              style={{ width: "100%", marginBottom: "1rem", resize: "vertical" }}
            />

            <button
              onClick={sendReply}
              disabled={!reply.trim()}
              style={{
                padding: "10px 20px",
                backgroundColor: reply.trim() ? "#0d6efd" : "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: reply.trim() ? "pointer" : "not-allowed",
              }}
            >
              Send Reply
            </button>
          </>
        ) : (
          <p>Please select a chat to view messages and reply.</p>
        )}
      </div>
    </div>
  );
}
