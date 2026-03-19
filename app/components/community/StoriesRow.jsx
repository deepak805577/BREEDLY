export default function StoriesRow({ stories = [], onAddStory }) {
  return (
    <div style={{
      display: "flex",
      gap: 12,
      padding: "12px 14px",
      overflowX: "auto",
      scrollbarWidth: "none",
      background: "#fff",
      borderBottom: "1.5px solid #F0E0EC",
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
          0%, 100% { border-color: #FFD54F; }
          50%       { border-color: #3B4FC8; }
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
          width: 56, height: 56,
          borderRadius: "50%",
          border: isAdd ? "2.5px dashed #C5B0DF" : `2.5px solid ${unseen ? "#FFD54F" : "#C5B0DF"}`,
          padding: 2,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.15s",
        }}
      >
        <div style={{
          width: "100%", height: "100%",
          borderRadius: "50%",
          background: isAdd ? "#F3EAF6" : "#F5EEF9",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: isAdd ? 22 : 24,
          color: isAdd ? "#3B4FC8" : "inherit",
          fontWeight: isAdd ? 700 : 400,
        }}>
          {emoji}
        </div>
      </div>
      <div style={{
        fontSize: 11, fontWeight: 700,
        color: "#9B8AAB",
        maxWidth: 58,
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
