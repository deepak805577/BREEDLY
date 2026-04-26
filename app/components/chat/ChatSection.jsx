"use client";

import { useEffect, useRef, useState } from "react";
import { useChatBot } from "@/lib/useChatBot";
import { ChatMessage } from "./ChatMessage";
import { DogProfileBar } from "./DogProfileBar";
import { QuickChips } from "./QuickChips";
import { TypingIndicator } from "./TypingIndicator";

export default function ChatSection() {
  const {
    messages, loading, error,
    dogProfile, setDogProfile,
    sendMessage, clearChat,
  } = useChatBot();

  const [input, setInput] = useState("");

  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  /* auto-scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* auto-resize textarea */
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 140) + "px";
  }, [input]);

  /* auto-focus */
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  function handleSend() {
    const text = input.trim();
    if (!text || loading) return;
    sendMessage(text);
    setInput("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const hasProfile = dogProfile.breed || dogProfile.age;

  return (
    <section className="cp-chat-section">
      <div className="cp-chat-inner">

        <span className="cp-eyebrow" style={{ textAlign: "center", display: "block" }}>Chat</span>
        <h2 className="cp-section-title">Start a conversation.</h2>

        <div className="cp-window">

          {/* header */}
          <header className="cp-header">
            <div className="cp-header-top">
              <div className="cp-header-left">
                <div className="cp-avatar-badge">🐾</div>
                <div>
                  <p className="cp-title">Paw Assistant</p>
                  <p className="cp-subtitle">
                    {hasProfile
                      ? `Chatting about ${dogProfile.name ? dogProfile.name + " · " : ""}${dogProfile.breed || "your dog"}${dogProfile.age ? ` · ${dogProfile.age}` : ""}`
                      : "Breed-aware AI · always available"}
                  </p>
                </div>
              </div>
              <div className="cp-header-right">
                <span className="cp-online-dot" />
                <span className="cp-online-label">Online</span>
                <button className="cp-clear-btn" onClick={clearChat}>✕ Clear</button>
              </div>
            </div>

            <DogProfileBar profile={dogProfile} onChange={setDogProfile} />
          </header>

          {/* messages */}
          <main className="cp-body">
            <div className="cp-messages">
              {messages.length === 0 && (
                <div className="cp-welcome">
                  <div className="cp-welcome-icon">🐾</div>
                  <h3>Hello! I'm your Paw Assistant.</h3>
                  <p>
                    Ask me anything about dog food, health, training, or grooming.
                    Fill in your dog's profile above for personalised answers.
                  </p>
                </div>
              )}

              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}

              {loading && <TypingIndicator />}
              {error && <div className="cp-error">⚠️ {error}</div>}

              <div ref={bottomRef} />
            </div>
          </main>

          {/* input */}
          <footer className="cp-footer">
            <QuickChips onSelect={(p) => sendMessage(p)} disabled={loading} />

            <div className="cp-input-row">
              <textarea
                ref={textareaRef}
                className="cp-input"
                placeholder="Ask about nutrition, training, health…"
                value={input}
                rows={1}
                disabled={loading}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                className="cp-send-btn"
                onClick={handleSend}
                disabled={!input.trim() || loading}
              >
                ↑
              </button>
            </div>

            <p className="cp-footer-note">
              Paw Assistant can make mistakes. Always consult a vet.
            </p>
          </footer>

        </div>
      </div>
    </section>
  );
}