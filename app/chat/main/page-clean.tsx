"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import { useChatBot } from "@/lib/useChatBot";
import { ChatMessage } from "../../components/chat/ChatMessage";
import { DogProfileBar } from "../../components/chat/DogProfileBar";
import { QuickChips } from "../../components/chat/QuickChips";
import { TypingIndicator } from "../../components/chat/TypingIndicator";

import "../chat.css";

export default function ChatPage() {
  const {
    messages,
    loading,
    error,
    dogProfile,
    setDogProfile,
    sendMessage,
    clearChat,
  } = useChatBot();

  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  /* Auto-scroll to bottom when messages change */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* Auto-resize textarea */
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 140) + "px";
  }, [input]);

  /* Initialize Speech Recognition */
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition && !recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setInput((prev) =>
              prev + (prev ? " " : "") + transcript
            );
          } else {
            interimTranscript += transcript;
          }
        }
      };

      recognition.onerror = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const dog = dogProfile || { name: "", breed: "", age: "" };

    const prompt = `
Dog Details:
Name: ${dog.name || "Unknown"}
Breed: ${dog.breed || "Unknown"}
Age: ${dog.age || "Unknown"}

User Question:
${text}
`;

    sendMessage(prompt, {
      displayMessage: text,
    });

    setInput("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleVoiceInput() {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInput("");
      recognitionRef.current.start();
    }
  }

  function handleQuickChip(prompt: string) {
    if (loading) return;

    const dog = dogProfile || { name: "", breed: "", age: "" };

    const fullPrompt = `
Dog Details:
Name: ${dog.name || "Unknown"}
Breed: ${dog.breed || "Unknown"}
Age: ${dog.age || "Unknown"}

User Question:
${prompt}
`;

    sendMessage(fullPrompt, {
      displayMessage: prompt,
    });
  }

  return (
    <div className="cp-chat-container">
      <div className="cp-window">
        {/* header */}
        <header className="cp-header">
          <div className="cp-header-top">
            <div className="cp-header-left">
              <div className="cp-avatar-badge">🐾</div>
              <div>
                <p className="cp-title">Paw Assistant</p>
                <p className="cp-subtitle">
                  {dogProfile.breed || dogProfile.age
                    ? `Chatting about ${dogProfile.name ? dogProfile.name + " · " : ""}${dogProfile.breed || "your dog"}${dogProfile.age ? ` · ${dogProfile.age}` : ""}`
                    : "Breed-aware AI · always available"}
                </p>
              </div>
            </div>
            <div className="cp-header-right">
              <span className="cp-online-dot" />
              <span className="cp-online-label">Online</span>
              <button className="cp-clear-btn" onClick={clearChat}>
                ✕ Clear
              </button>
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
                  Ask me anything about dog food, health, training, or
                  grooming. Fill in your dog's profile above for
                  personalised answers.
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
          <QuickChips onSelect={handleQuickChip} disabled={loading} />
          <div className="cp-input-row">
            <div className="cp-input-wrapper">
              <button
                className="cp-voice-btn"
                onClick={handleVoiceInput}
                disabled={loading}
                title={
                  isListening
                    ? "Stop recording"
                    : "Start voice input (click to record)"
                }
                aria-label={
                  isListening ? "Stop recording" : "Start voice input"
                }
                style={{
                  animation: isListening
                    ? "pulse 1s ease-in-out infinite"
                    : "none",
                }}
              >
                🎤
              </button>
              <textarea
                ref={textareaRef}
                className="cp-input"
                placeholder={
                  isListening
                    ? "Listening... 🎧"
                    : "Ask about nutrition, training, health…"
                }
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
          </div>
          <p className="cp-footer-note">
            Paw Assistant can make mistakes. Always consult a vet.
          </p>
        </footer>
      </div>
    </div>
  );
}
