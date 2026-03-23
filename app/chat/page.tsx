"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import { useChatBot }      from "@/lib/useChatBot";
import { ChatMessage }     from "../components/chat/ChatMessage";
import { DogProfileBar }   from "../components/chat/DogProfileBar";
import { QuickChips }      from "../components/chat/QuickChips";
import { TypingIndicator } from "../components/chat/TypingIndicator";

import "./chat.css";

const SAMPLE_QS = [
  { q: "What should I feed my 3-month Labrador?",         icon: "🥗" },
  { q: "How often should I bathe a Shih Tzu?",            icon: "✂️" },
  { q: "My dog keeps barking at night — why?",            icon: "🔊" },
  { q: "When does a puppy need its first vaccine?",       icon: "🩺" },
  { q: "Is it safe for dogs to eat mango?",               icon: "🍋" },
  { q: "How do I stop my dog from pulling on the leash?", icon: "🐕" },
];

export default function ChatPage() {
  const {
    messages, loading, error,
    dogProfile, setDogProfile,
    sendMessage, clearChat,
  } = useChatBot();

  const [input, setInput] = useState("");

  const bottomRef   = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatRef     = useRef<HTMLDivElement>(null);

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

  function handleSend() {
    const text = input.trim();
    if (!text || loading) return;
    sendMessage(text);
    setInput("");
    setTimeout(() => chatRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function startWithSample(q: string) {
    sendMessage(q);
    setTimeout(() => chatRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  }

  const hasProfile = dogProfile.breed || dogProfile.age;

  return (
    <div className="cp-page">

      {/* ── HERO ── */}
      <section className="cp-hero">
        <div className="cp-hero-glow" />
        <span className="cp-eyebrow">Paw Assistant</span>
        <h1 className="cp-hero-title">
          Ask anything about<br />
          <em>your dog.</em>
        </h1>
        <p className="cp-hero-sub">
          Breed-aware AI advice on food, health, training, and grooming —
          calm, practical answers whenever you need them.
        </p>
        <div className="cp-hero-chips">
          <span>🥗 Nutrition</span>
          <span>🩺 Health</span>
          <span>🐕 Training</span>
          <span>✂️ Grooming</span>
          <span>🧬 Breed info</span>
        </div>
        <a
          href="#chat"
          className="cp-hero-cta"
          onClick={(e) => {
            e.preventDefault();
            chatRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          Start chatting →
        </a>
      </section>

      {/* ── SAMPLE QUESTIONS ── */}
      <section className="cp-samples">
        <div className="cp-samples-inner">
          <span className="cp-eyebrow" style={{ textAlign: "center", display: "block" }}>Try asking</span>
          <h2 className="cp-section-title">Questions dog owners ask every day.</h2>
          <div className="cp-sample-grid">
            {SAMPLE_QS.map(({ q, icon }) => (
              <button key={q} className="cp-sample-q" onClick={() => startWithSample(q)}>
                <span className="cp-sample-icon">{icon}</span>
                <span className="cp-sample-text">{q}</span>
                <span className="cp-sample-arrow">→</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHAT WINDOW ── */}
      <section className="cp-chat-section" id="chat" ref={chatRef}>
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
                  aria-label="Send"
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

      {/* ── TRUST ── */}
      <section className="cp-trust">
        <span className="cp-eyebrow" style={{ color: "#B08968" }}>Responsible by design</span>
        <h2>Built for thoughtful dog care.</h2>
        <p>
          Paw Assistant gives you a starting point — not a replacement for your vet.
          Every answer encourages responsible, dog-first decisions.
        </p>
        <div className="cp-trust-pills">
          <span>✔ Breed-specific advice</span>
          <span>✔ Evidence-informed</span>
          <span>✔ Always vet-recommended</span>
        </div>
      </section>

    </div>
  );
}
