"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import { useChatBot } from "@/lib/useChatBot";
import { ChatMessage } from "../components/chat/ChatMessage";
import { DogProfileBar } from "../components/chat/DogProfileBar";
import { QuickChips } from "../components/chat/QuickChips";
import { TypingIndicator } from "../components/chat/TypingIndicator";

import "./chat.css";

export default function ChatPage() {

  const {
    messages,
    loading,
    error,
    dogProfile,
    setDogProfile,
    sendMessage,
    clearChat
  } = useChatBot();

  const [input, setInput] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Auto resize textarea
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
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const hasProfile = dogProfile.breed || dogProfile.age;

  return (
    <div className="chat">
      <div className="dogs" style={{display:"flex",justifyContent:"center"}}>
        <img
            src="/assets/download-removebg-preview.png"
            alt="Peeking Puppies"
            className="puppy-top"
            style={{ width: "250px"}}
          />
    
      </div>
       
    <div className="chat-page">
    
     
      {/* Header */}

      <header className="chat-header">

        <div className="chat-header-inner">

          <div className="chat-header-left">

            <h1 className="chat-title">Paw Assistant</h1>

            <p className="chat-subtitle">
              {hasProfile
                ? `Chatting about your ${dogProfile.name ? dogProfile.name + " · " : ""}${dogProfile.breed || "dog"}${dogProfile.age ? ` · ${dogProfile.age}` : ""}`
                : "Breed-aware advice powered by AI"}
            </p>

          </div>

          <button
            className="clear-btn"
            onClick={clearChat}
          >
            Clear
          </button>

        </div>

        <DogProfileBar
          profile={dogProfile}
          onChange={setDogProfile}
        />

      </header>

      {/* Messages */}

      <main className="chat-body">

        <div className="messages-list">

          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
            />
          ))}

          {loading && <TypingIndicator />}

          {error && (
            <div className="error-banner">
              ⚠️ {error}
            </div>
          )}

          <div ref={bottomRef} />

        </div>

      </main>

      {/* Input */}

      <footer className="chat-footer">

        <QuickChips
          onSelect={(p) => sendMessage(p)}
          disabled={loading}
        />

        <div className="input-row">

          <textarea
            ref={textareaRef}
            className="chat-input"
            placeholder="Ask about nutrition, training, health..."
            value={input}
            rows={1}
            disabled={loading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button
            className="send-btn"
            onClick={handleSend}
            disabled={!input.trim() || loading}
          >
            Send
          </button>

        </div>

        <p className="footer-note">
          BreedLy AI can make mistakes. Always consult a vet.
        </p>

      </footer>

    </div>
    </div>
  );
}