export function TypingIndicator() {
  return (
    <div className="chat-message bot" aria-live="polite" aria-label="Assistant is typing">
      <div className="avatar bot-avatar" aria-hidden="true">🐾</div>
      <div className="bubble bubble-bot typing-bubble">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
      </div>
    </div>
  );
}
