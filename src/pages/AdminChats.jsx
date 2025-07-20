import React, { useEffect, useState, useRef } from "react";
import { fetchAllChats, fetchMessages, sendAdminReply } from "./adminChatApi";

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

  // Load all chats on mount
  useEffect(() => {
    async function loadChats() {
      setLoadingChats(true);
      setError(null);
      try {
        const data = await fetchAllChats();
        setChats(data);
      } catch (e) {
        setError("Failed to load chats");
        console.error(e);
      } finally {
        setLoadingChats(false);
      }
    }
    loadChats();
  }, []);

  // Load messages for a chat
  const loadMessages = async (chatId) => {
    setSelectedChat(chatId);
    setLoadingMessages(true);
    setError(null);
    try {
      const data = await fetchMessages(chatId);
      setMessages(data);
    } catch (e) {
      setError("Failed to load messages");
      setMessages([]);
      console.error(e);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Send admin reply
  const handleSendReply = async () => {
    if (!reply.trim()) return;

    try {
      await sendAdminReply(selectedChat, reply.trim());
      setReply("");
      await loadMessages(selectedChat);
    } catch (e) {
      setError("Failed to send reply");
      console.error(e);
    }
  };

  return (
    <div style={{ display: "flex", gap: "2rem", padding: "1rem" }}>
      {/* Chat List */}
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

      {/* Messages & Reply */}
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
              onClick={handleSendReply}
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
