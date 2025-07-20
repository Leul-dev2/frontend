import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const BASE_URL = "https://backend-ecomm-jol4.onrender.com/api";

export default function AdminChats() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Load all chats on component mount
  useEffect(() => {
    setLoadingChats(true);
    setError(null);

    axios
      .get(`${BASE_URL}/chats/all`)
      .then((res) => {
        // Adjust this if your backend response shape is different
        setChats(res.data);
        setLoadingChats(false);
      })
      .catch((err) => {
        setError("Failed to load chats");
        setLoadingChats(false);
        console.error(err);
      });
  }, []);

  // Load messages for selected chat
  const loadMessages = async (chatId) => {
    setSelectedChat(chatId);
    setLoadingMessages(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/chats/${chatId}/messages`);
      setMessages(res.data);
      setLoadingMessages(false);
    } catch (err) {
      setError("Failed to load messages");
      setMessages([]);
      setLoadingMessages(false);
      console.error(err);
    }
  };

  // Send admin reply
  const sendReply = async () => {
    if (!reply.trim()) return;

    try {
      await axios.post(`${BASE_URL}/chats/${selectedChat}/messages`, {
        message: reply.trim(),
      });
      setReply("");
      await loadMessages(selectedChat); // Refresh messages
    } catch (err) {
      setError("Failed to send reply");
      console.error(err);
    }
  };

  return (
    <div style={{ display: "flex", gap: "2rem", padding: "1rem" }}>
      {/* Left panel: list of chats */}
      <div style={{ width: "30%", borderRight: "1px solid #ccc", paddingRight: "1rem" }}>
        <h2>Chats</h2>
        {loadingChats && <p>Loading chats...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loadingChats && !error && chats.length === 0 && <p>No chats available</p>}
        {!loadingChats && chats.map((chat) => (
          <div
            key={chat.id}
            style={{
              padding: "10px",
              border: selectedChat === chat.id ? "2px solid #007bff" : "1px solid #ddd",
              marginBottom: "5px",
              cursor: "pointer",
              borderRadius: "5px",
              backgroundColor: selectedChat === chat.id ? "#e9f0ff" : "white",
            }}
            onClick={() => loadMessages(chat.id)}
          >
            Chat ID: {chat.id}
          </div>
        ))}
      </div>

      {/* Right panel: messages + reply */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {selectedChat ? (
          <>
            <h2>Messages for Chat: {selectedChat}</h2>

            <div
              style={{
                border: "1px solid #ccc",
                flexGrow: 1,
                overflowY: "auto",
                marginBottom: "1rem",
                padding: "1rem",
                borderRadius: "5px",
                backgroundColor: "#fafafa",
              }}
            >
              {loadingMessages && <p>Loading messages...</p>}
              {error && <p style={{ color: "red" }}>{error}</p>}
              {!loadingMessages && messages.length === 0 && <p>No messages yet</p>}
              {!loadingMessages && messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    marginBottom: "0.5rem",
                    padding: "8px",
                    borderRadius: "8px",
                    backgroundColor: msg.senderId === "admin" ? "#d0f0c0" : "#f0f0f0",
                    alignSelf: msg.senderId === "admin" ? "flex-end" : "flex-start",
                    maxWidth: "70%",
                    wordBreak: "break-word",
                  }}
                >
                  <strong>{msg.senderId === "admin" ? "Admin" : "User"}:</strong> {msg.message}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <textarea
              rows={3}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type your reply here..."
              style={{ width: "100%", marginBottom: "1rem", resize: "vertical", padding: "8px" }}
            />

            <button
              onClick={sendReply}
              disabled={!reply.trim()}
              style={{
                padding: "10px 15px",
                backgroundColor: reply.trim() ? "#007bff" : "#999",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: reply.trim() ? "pointer" : "not-allowed",
                alignSelf: "flex-end",
                minWidth: "100px",
              }}
            >
              Send Reply
            </button>
          </>
        ) : (
          <p>Select a chat to view messages and reply.</p>
        )}
      </div>
    </div>
  );
}
