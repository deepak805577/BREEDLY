"use client";

import { Message } from "../../types/chat";

interface Props {
  message: Message;
}

// Minimal markdown: bold, bullet lists
function renderContent(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    const isBullet = /^[-•*]\s/.test(line.trimStart());
    const formatted = line
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>");

    if (isBullet) {
      elements.push(
        <li key={i} dangerouslySetInnerHTML={{ __html: formatted.replace(/^[-•*]\s/, "") }} />
      );
    } else if (line.trim() === "") {
      elements.push(<br key={i} />);
    } else {
      elements.push(
        <p key={i} dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    }
  });

  // Wrap consecutive <li> in a <ul>
  const wrapped: React.ReactNode[] = [];
  let listBuffer: React.ReactNode[] = [];

  elements.forEach((el, i) => {
    const isLi = (el as React.ReactElement)?.type === "li";
    if (isLi) {
      listBuffer.push(el);
    } else {
      if (listBuffer.length > 0) {
        wrapped.push(<ul key={`ul-${i}`}>{listBuffer}</ul>);
        listBuffer = [];
      }
      wrapped.push(el);
    }
  });
  if (listBuffer.length > 0) wrapped.push(<ul key="ul-last">{listBuffer}</ul>);

  return wrapped;
}

export function ChatMessage({ message }: Props) {
  const isBot = message.role === "assistant";

  return (
    <div className={`chat-message ${isBot ? "bot" : "user"}`}>
      {isBot && (
        <div className="avatar bot-avatar" aria-hidden="true">
          🐾
        </div>
      )}
      <div className={`bubble ${isBot ? "bubble-bot" : "bubble-user"}`}>
        {renderContent(message.content)}
      </div>
      {!isBot && (
        <div className="avatar user-avatar" aria-hidden="true">
          👤
        </div>
      )}
    </div>
  );
}
