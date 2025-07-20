import React, { useEffect, useState, useRef } from "react";
import {
  fetchAllChats,
  fetchMessages,
  sendAdminReply,
} from "../api/adminChatApi";

export default function AdminChats() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const loadChats = async () => {
      setLoadingChats(true);
      setError(null);
      try {
        const data = await fetchAllChats();
        if (Array.isArray(data)) {
          setChats(data);
        } else if (data && Array.isArray(data.chats)) {
          setChats(data.chats);
        } else {
          console.warn("Unexpected chats data format:", data);
          setChats([]);
          setError("Could not load chats: invalid format.");
        }
      } catch (err) {
        console.error("Error fetching chats:", err);
        setError("Failed to load chats.");
        setChats([]);
      } finally {
        setLoadingChats(false);
      }
    };
    loadChats();
  }, []);

  const loadMessages = async (chatId) => {
    setSelectedChat(chatId);
    setLoadingMessages(true);
    setError(null);
    try {
      const data = await fetchMessages(chatId);
      if (Array.isArray(data)) {
        setMessages(data);
      } else if (data && Array.isArray(data.messages)) {
        setMessages(data.messages);
      } else {
        console.warn("Unexpected messages format:", data);
        setMessages([]);
        setError("Could not load messages: invalid format.");
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load messages.");
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendReply = async () => {
    if (!reply.trim()) return;
    try {
      await sendAdminReply(selectedChat, reply.trim());
      setReply("");
      await loadMessages(selectedChat);
    } catch (err) {
      console.error("Error sending reply:", err);
      setError("Failed to send reply.");
    }
  };

  const formatTimestamp = (ts) => {
    if (!ts) return "";
    const date = new Date(ts);
    return date.toLocaleString([], {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "short",
    });
  };

  const renderChatItem = (chat) => {
    const chatId = chat.id || chat._id || "unknown_id";
    const chatName =
      chat.name || chat.userName || chat.user?.name || `Chat ${chatId}`;
    const isSelected = selectedChat === chatId;

    return (
      <div
        key={chatId}
        onClick={() => loadMessages(chatId)}
        style={{
          padding: "12px 15px",
          marginBottom: 8,
          borderRadius: 8,
          cursor: "pointer",
          backgroundColor: isSelected ? "#007bff" : "#f9f9f9",
          color: isSelected ? "#fff" : "#333",
          fontWeight: isSelected ? 600 : 500,
          boxShadow: isSelected
            ? "0 4px 8px rgba(0,123,255,0.3)"
            : "0 1px 3px rgba(0,0,0,0.05)",
          transition: "all 0.2s ease",
        }}
      >
        <div style={{ fontSize: 16 }}>{chatName}</div>
        <div style={{ fontSize: 12, opacity: 0.6 }}>ID: {chatId}</div>
      </div>
    );
  };

  const renderMessage = (msg) => {
    const msgId = msg.id || msg._id || "unknown_msg_id";
    const isAdmin = msg.senderId === "admin";
    const senderName = isAdmin ? "Admin" : msg.senderName || "User";
    const timestamp = msg.createdAt ? formatTimestamp(msg.createdAt) : "";

    return (
      <div
        key={msgId}
        style={{
          maxWidth: "70%",
          marginBottom: 12,
          alignSelf: isAdmin ? "flex-end" : "flex-start",
          backgroundColor: isAdmin ? "#d1f7c4" : "#f1f1f1",
          padding: "10px 15px",
          borderRadius: 18,
          wordBreak: "break-word",
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <strong style={{ marginBottom: 4 }}>{senderName}</strong>
        <span>{msg.message || "(empty)"}</span>
        {timestamp && (
          <small
            style={{
              alignSelf: "flex-end",
              fontSize: 11,
              marginTop: 6,
              opacity: 0.6,
            }}
          >
            {timestamp}
          </small>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        padding: 20,
        height: "100vh",
        backgroundColor: "#f5f7fa",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          width: "30%",
          backgroundColor: "#fff",
          borderRadius: 10,
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          padding: 16,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 style={{ marginBottom: 16 }}>Chats</h2>
        {loadingChats && <p>Loading chats…</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loadingChats && !error && chats.length === 0 && (
          <p>No chats available.</p>
        )}
        <div style={{ overflowY: "auto", flexGrow: 1 }}>
          {chats.map(renderChatItem)}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          backgroundColor: "#fff",
          borderRadius: 10,
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          padding: 16,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {selectedChat ? (
          <>
            <h2 style={{ marginBottom: 16 }}>
              Chat:{" "}
              <span style={{ color: "#007bff" }}>{selectedChat}</span>
            </h2>
            <div
              style={{
                flexGrow: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#fafafa",
                borderRadius: 8,
                border: "1px solid #ddd",
                padding: 12,
              }}
            >
              {loadingMessages && <p>Loading messages…</p>}
              {error && <p style={{ color: "red" }}>{error}</p>}
              {!loadingMessages && messages.length === 0 && (
                <p>No messages yet.</p>
              )}
              {messages.map(renderMessage)}
              <div ref={messagesEndRef} />
            </div>

            <textarea
              rows={3}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type your reply…"
              style={{
                marginTop: 12,
                padding: 12,
                borderRadius: 10,
                border: "1px solid #ccc",
                fontSize: 16,
                resize: "vertical",
                width: "100%",
              }}
            />

            <button
              onClick={handleSendReply}
              disabled={!reply.trim()}
              style={{
                marginTop: 10,
                alignSelf: "flex-end",
                backgroundColor: reply.trim() ? "#007bff" : "#999",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "10px 20px",
                cursor: reply.trim() ? "pointer" : "not-allowed",
              }}
            >
              Send
            </button>
          </>
        ) : (
          <p>Select a chat to see messages and reply.</p>
        )}
      </div>
    </div>
  );
}
