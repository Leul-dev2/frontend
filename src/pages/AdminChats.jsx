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

  // Auto scroll messages view on update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Load all chats
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
          setChats([]);
          setError("Invalid data format for chats");
          console.error("⚠️ Unexpected data:", data);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load chats");
        setChats([]);
      } finally {
        setLoadingChats(false);
      }
    };
    loadChats();
  }, []);

  // Load messages of selected chat
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
        setMessages([]);
        console.error("⚠️ Unexpected messages format:", data);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load messages");
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Send reply message
  const handleSendReply = async () => {
    if (!reply.trim()) return;
    try {
      await sendAdminReply(selectedChat, reply.trim());
      setReply("");
      await loadMessages(selectedChat);
    } catch (err) {
      console.error(err);
      setError("Failed to send reply");
    }
  };

  // Helper to format timestamps
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

  // Chat item display: ID + name fallback
  const renderChatItem = (chat) => {
    const chatId = chat.id || chat._id;
    const chatName = chat.name || chat.userName || "Unknown User";
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
          color: isSelected ? "white" : "#333",
          boxShadow: isSelected
            ? "0 4px 8px rgba(0,123,255,0.3)"
            : "0 1px 3px rgba(0,0,0,0.1)",
          transition: "background-color 0.2s ease, box-shadow 0.2s ease",
          fontWeight: isSelected ? "600" : "500",
          userSelect: "none",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ fontSize: 16 }}>{chatName}</div>
        <div style={{ fontSize: 12, opacity: 0.7 }}>Chat ID: {chatId}</div>
      </div>
    );
  };

  // Message bubble component
  const renderMessage = (msg) => {
    const msgId = msg.id || msg._id;
    const isAdmin = msg.senderId === "admin";
    const senderName = isAdmin ? "Admin" : msg.senderName || "User";
    const timestamp = msg.createdAt
      ? formatTimestamp(new Date(msg.createdAt))
      : "";

    return (
      <div
        key={msgId}
        style={{
          maxWidth: "70%",
          marginBottom: 10,
          alignSelf: isAdmin ? "flex-end" : "flex-start",
          backgroundColor: isAdmin ? "#d0f0c0" : "#f0f0f0",
          color: "#222",
          padding: "12px 16px",
          borderRadius: 20,
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          wordBreak: "break-word",
          position: "relative",
          fontSize: 15,
          lineHeight: 1.3,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <strong style={{ marginBottom: 6 }}>{senderName}</strong>
        <span>{msg.message}</span>
        {timestamp && (
          <small
            style={{
              fontSize: 11,
              opacity: 0.6,
              marginTop: 8,
              alignSelf: "flex-end",
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
        height: "calc(100vh - 40px)",
        boxSizing: "border-box",
        backgroundColor: "#f5f7fa",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Chats List */}
      <div
        style={{
          width: "30%",
          backgroundColor: "white",
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          padding: 16,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 style={{ marginBottom: 20, color: "#333" }}>Chats</h2>
        {loadingChats && <p>Loading chats...</p>}
        {error && !loadingChats && (
          <p style={{ color: "red", fontWeight: "600" }}>{error}</p>
        )}
        {!loadingChats && !error && chats.length === 0 && (
          <p style={{ color: "#777" }}>No chats found.</p>
        )}
        <div
          style={{
            overflowY: "auto",
            flexGrow: 1,
            paddingRight: 4,
          }}
        >
          {chats.map(renderChatItem)}
        </div>
      </div>

      {/* Messages and Reply */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          padding: 16,
        }}
      >
        {selectedChat ? (
          <>
            <h2 style={{ marginBottom: 16, color: "#333" }}>
              Messages for Chat:{" "}
              <span
                style={{ color: "#007bff", fontWeight: "700" }}
                title={selectedChat}
              >
                {selectedChat}
              </span>
            </h2>
            <div
              style={{
                flexGrow: 1,
                overflowY: "auto",
                padding: 10,
                display: "flex",
                flexDirection: "column",
                scrollBehavior: "smooth",
                backgroundColor: "#fafafa",
                borderRadius: 8,
                border: "1px solid #ddd",
              }}
            >
              {loadingMessages && <p>Loading messages...</p>}
              {error && !loadingMessages && (
                <p style={{ color: "red", fontWeight: "600" }}>{error}</p>
              )}
              {!loadingMessages && messages.length === 0 && (
                <p style={{ color: "#777" }}>No messages yet.</p>
              )}
              {!loadingMessages &&
                messages.map((msg) => renderMessage(msg))}
              <div ref={messagesEndRef} />
            </div>

            <textarea
              rows={3}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type your reply here..."
              style={{
                marginTop: 12,
                padding: 12,
                resize: "vertical",
                borderRadius: 12,
                border: "1px solid #ccc",
                fontSize: 16,
                fontFamily: "inherit",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                outline: "none",
                width: "100%",
              }}
            />

            <button
              onClick={handleSendReply}
              disabled={!reply.trim()}
              style={{
                marginTop: 12,
                padding: "12px 20px",
                borderRadius: 12,
                border: "none",
                backgroundColor: reply.trim() ? "#007bff" : "#999",
                color: "white",
                fontWeight: "600",
                cursor: reply.trim() ? "pointer" : "not-allowed",
                alignSelf: "flex-end",
                minWidth: 120,
                boxShadow: reply.trim()
                  ? "0 4px 8px rgba(0,123,255,0.4)"
                  : "none",
                transition: "background-color 0.2s ease",
                userSelect: "none",
              }}
            >
              Send Reply
            </button>
          </>
        ) : (
          <p style={{ color: "#777" }}>Select a chat to view messages and reply.</p>
        )}
      </div>
    </div>
  );
}
