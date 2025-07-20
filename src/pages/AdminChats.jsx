import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminChats() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");

  // Fetch all chats on load
  useEffect(() => {
    axios.get("/api/chats/all").then((res) => {
      setChats(res.data);
    });
  }, []);

  // Fetch messages when chat is selected
  const loadMessages = async (chatId) => {
    setSelectedChat(chatId);
    const res = await axios.get(`/api/chats/${chatId}/messages`);
    setMessages(res.data);
  };

  // Send reply
  const sendReply = async () => {
    if (!reply.trim()) return;

    await axios.post(`/api/chats/${selectedChat}/messages`, {
      message: reply,
    });

    setReply("");
    loadMessages(selectedChat); // Refresh
  };

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      {/* LEFT: list of chats */}
      <div style={{ width: "30%" }}>
        <h2>Chats</h2>
        {chats.map((chat) => (
          <div
            key={chat.id}
            style={{
              padding: "10px",
              border: "1px solid #ddd",
              marginBottom: "5px",
              cursor: "pointer",
            }}
            onClick={() => loadMessages(chat.id)}
          >
            Chat ID: {chat.id}
          </div>
        ))}
      </div>

      {/* RIGHT: messages + reply */}
      {selectedChat && (
        <div style={{ flex: 1 }}>
          <h2>Messages for: {selectedChat}</h2>
          <div
            style={{
              border: "1px solid #ccc",
              height: "300px",
              overflowY: "auto",
              marginBottom: "1rem",
              padding: "1rem",
            }}
          >
            {messages.map((msg) => (
              <div key={msg.id} style={{ marginBottom: "0.5rem" }}>
                <strong>{msg.senderId}:</strong> {msg.message}
              </div>
            ))}
          </div>

          <textarea
            rows="3"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type your reply here"
            style={{ width: "100%", marginBottom: "1rem" }}
          />

          <button onClick={sendReply} disabled={!reply.trim()}>
            Send Reply
          </button>
        </div>
      )}
    </div>
  );
}
