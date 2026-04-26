"use client";

import { useState, useCallback, useRef } from "react";
import type { Message, DogProfile } from "@/app/types/chat";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

const WELCOME: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi! I'm the BreedLy Paw Assistant 🐾 Select your dog's breed and age above, then ask me anything — nutrition, training, grooming, health, and more. I'll give advice tailored to your pup!",
  timestamp: new Date(),
};

export function useChatBot() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dogProfile, setDogProfile] = useState<DogProfile>({ breed: "", age: "", name: "" });
  const abortRef = useRef<AbortController | null>(null);

const sendMessage = useCallback(
  async (text: string, options?: { displayMessage?: string }) => {
    if (!text.trim() || loading) return;
    setError(null);

    // ✅ use clean text for UI
    const displayText = options?.displayMessage || text;

    const userMsg: Message = {
      id: uid(),
      role: "user",
      content: displayText, // 👈 ONLY CLEAN TEXT SHOWN
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    // ✅ use FULL text (prompt) for backend history
    const history = [
      ...messages.filter((m) => m.id !== "welcome"),
      { ...userMsg, content: text } // 👈 IMPORTANT: send full prompt
    ].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          messages: history,
          dogProfile,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Unexpected error");
      }

      const botMsg: Message = {
        id: uid(),
        role: "assistant",
        content: data.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);

    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;

      const msg =
        err instanceof Error
          ? err.message
          : "Connection error. Please try again.";

      setError(msg);
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
    } finally {
      setLoading(false);
    }
  },
  [messages, loading, dogProfile]
);
  const clearChat = useCallback(() => {
    abortRef.current?.abort();
    setMessages([WELCOME]);
    setError(null);
  }, []);

  return { messages, loading, error, dogProfile, setDogProfile, sendMessage, clearChat };
}
