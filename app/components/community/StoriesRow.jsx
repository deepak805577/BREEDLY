export default function StoriesRow({ stories = [], onAddStory }) {
  return (
    <div style={{
      display: "flex",
      gap: 14,
      padding: "14px 16px",
      overflowX: "auto",
      scrollbarWidth: "none",
      background: "var(--soft-white)",
      borderBottom: "1px solid var(--border)",
    }}>
      {/* Add Story button */}
      <StoryItem
        emoji="+"
        label="Your story"
        isAdd
        onClick={onAddStory}
      />
      {stories.map(story => (
        <StoryItem
          key={story.id}
          emoji={story.emoji}
          label={story.name}
          unseen={story.unseen}
        />
      ))}

      <style>{`
        .breedly-community ::-webkit-scrollbar { display: none; }
        @keyframes storyPulse {
          0%, 100% { border-color: var(--accent); }
          50%       { border-color: var(--accent-dark); }
        }
        .story-unseen { animation: storyPulse 2.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

function StoryItem({ emoji, label, unseen, isAdd, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, flexShrink: 0, cursor: "pointer" }}
    >
      <div
        className={unseen ? "story-unseen" : ""}
        style={{
          width: 58, height: 58,
          borderRadius: "50%",
          border: isAdd ? "2.5px dashed var(--border-strong)" : `2.5px solid ${unseen ? "var(--accent)" : "var(--border)"}`,
          padding: 2,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.15s, border-color 0.2s",
        }}
      >
        <div style={{
          width: "100%", height: "100%",
          borderRadius: "50%",
          background: isAdd ? "var(--bg-soft)" : "var(--primary-soft)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: isAdd ? 22 : 24,
          color: isAdd ? "var(--accent-dark)" : "inherit",
          fontWeight: isAdd ? 700 : 400,
        }}>
          {emoji}
        </div>
      </div>
      <div style={{
        fontSize: 11, fontWeight: 500,
        color: "var(--text-secondary)",
        fontFamily: "var(--font-body)",
        maxWidth: 60,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        textAlign: "center",
      }}>
        {label}
      </div>
    </div>
  );
}
