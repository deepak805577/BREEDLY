"use client";

import { useEffect, useRef, useState, useCallback, useContext, createContext } from "react";
import type { KeyboardEvent } from "react";

import { useChatBot }      from "@/lib/useChatBot";
import { ChatMessage }     from "../../components/chat/ChatMessage";
import { DogProfileBar }   from "../../components/chat/DogProfileBar";
import { QuickChips }      from "../../components/chat/QuickChips";
import { TypingIndicator } from "../../components/chat/TypingIndicator";

/* ═══════════════════════════════════════════════════════════
   DESIGN TOKENS (Aligned with Breedly Design System)
   ═══════════════════════════════════════════════════════════ */
const T = {
  bg:          "#F5EFE6",
  bgSoft:      "#EFE7DB",
  card:        "#E8D8C4",
  surface:     "#FAF7F2",
  accent:      "#B08968",
  accentDark:  "#7F5539",
  teal:        "#2E9C8A",
  text:        "#3E3E3E",
  textMid:     "#6F6F6F",
  textLight:   "#9A9A9A",
  border:      "rgba(176,137,104,0.18)",
  borderMid:   "rgba(176,137,104,0.28)",
  userBubble:  "#7F5539",
  botBubble:   "#FAF7F2",
  rXl: "28px", rLg: "20px", rMd: "14px", rSm: "8px", rPill: "999px",
  shSm: "0 4px 16px rgba(100,70,40,0.04)",
  shMd: "0 8px 32px rgba(100,70,40,0.08)",
  shLg: "0 24px 60px rgba(100,70,40,0.12)",
  fontDisplay: "'Fraunces', Georgia, serif",
  fontBody:    "'DM Sans', system-ui, sans-serif",
};

/* ═══════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════ */
const ALL_BREEDS = [
  "Labrador Retriever","Golden Retriever","German Shepherd","Beagle","Poodle",
  "Bulldog","French Bulldog","Rottweiler","Yorkshire Terrier","Dachshund",
  "Shih Tzu","Siberian Husky","Dobermann","Great Dane","Boxer","Maltese",
  "Border Collie","Cocker Spaniel","Pomeranian","Chihuahua","Pug",
  "Lhasa Apso","Indian Spitz","Saint Bernard","Samoyed","Dalmatian",
  "Alaskan Malamute","Belgian Malinois","Rough Collie","Afghan Hound",
  "Weimaraner","Irish Setter","Bichon Frise","Mixed Breed","Other",
];

const DEFAULT_QUICK_REPLIES = [
  "What should I feed my dog?",
  "How often should I groom?",
  "Is my dog's weight healthy?",
  "Training tips for my breed",
];

const PERSIST_CHATS   = "breedly_chats_v2";
const PERSIST_PROFILE = "breedly_dog_profile_v2";

/* ═══════════════════════════════════════════════════════════
   TOAST SYSTEM
   ═══════════════════════════════════════════════════════════ */
type ToastType = "success" | "error" | "info";
interface ToastItem { id: string; message: string; type: ToastType; }

const ToastCtx = createContext<{
  addToast: (msg: string, type?: ToastType) => void;
} | null>(null);

function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be inside ToastProvider");
  return ctx;
}

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "success") => {
    const id = uid();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  }, []);

  const colors: Record<ToastType, string> = {
    success: T.teal, error: "#D63031", info: T.accentDark,
  };

  return (
    <ToastCtx.Provider value={{ addToast }}>
      {children}
      <div style={{ position:"fixed", bottom:24, right:20, zIndex:9999, display:"flex", flexDirection:"column", gap:8 }}>
        {toasts.map(t => (
          <div key={t.id} style={{ background:colors[t.type], color:"#fff", padding:"12px 18px", borderRadius:T.rMd, fontSize:13, fontWeight:500, boxShadow:T.shMd, animation:"slideInUp .3s ease", fontFamily:T.fontBody }}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

/* ═══════════════════════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════════════════════ */
function uid() { return Math.random().toString(36).slice(2, 9); }
function fmtTime(d: Date) { return d.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }); }
function fmtDate(d: Date) {
  const today = new Date();
  const diff  = today.setHours(0,0,0,0) - new Date(d).setHours(0,0,0,0);
  if (diff === 0)         return "Today";
  if (diff === 86400000)  return "Yesterday";
  return d.toLocaleDateString([], { weekday:"long", month:"short", day:"numeric" });
}
function groupByDate(messages: any[]) {
  const groups: any[] = [];
  let lastLabel: string | null = null;
  messages.forEach(m => {
    const label = fmtDate(new Date(m.timestamp));
    if (label !== lastLabel) { groups.push({ type:"divider", label, id:label }); lastLabel = label; }
    groups.push({ type:"message", ...m });
  });
  return groups;
}

/* ═══════════════════════════════════════════════════════════
   SVG ICONS (Replaces all Emojis for Premium UI)
   ═══════════════════════════════════════════════════════════ */
const Icon = {
  Send:   () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>,
  Plus:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>,
  Search: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>,
  Menu:   () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M4 6H20M4 12H14M4 18H9"/></svg>,
  X:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  Emoji:  () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>,
  DblChk: () => <svg width="15" height="10" viewBox="0 0 30 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M2 6l5 5 8-9"/><path d="M15 6l5 5 8-9"/></svg>,
  Save:   () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>,
  Trash:  () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>,
  Mic:    () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M19 10a7 7 0 01-14 0M12 19v3M9 22h6"/></svg>,
  
  // Vector icons to replace Emojis
  Dog:    () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
      <path d="M8 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
      <path d="M16 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
      <path d="M12 14v2"/>
      <path d="M10 16h4"/>
    </svg>
  ),
  User:   () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Copy:   () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  ),
  React:  () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
      <line x1="9" y1="9" x2="9.01" y2="9"/>
      <line x1="15" y1="9" x2="15.01" y2="9"/>
    </svg>
  ),
  Resend: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/>
      <polyline points="1 20 1 14 7 14"/>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
    </svg>
  ),
};

/* ═══════════════════════════════════════════════════════════
   INLINE DOG PROFILE BAR
   ═══════════════════════════════════════════════════════════ */
interface DogProfile { name: string; breed: string; age: string; }

function InlineDogProfileBar({ profile, onChange }: { profile: DogProfile; onChange: (p: DogProfile) => void }) {
  const inp: React.CSSProperties = {
    padding: "6px 14px",
    borderRadius: T.rPill,
    border: `1.5px solid ${T.border}`,
    background: T.surface,
    fontFamily: T.fontBody,
    fontSize: 12,
    color: T.text,
    outline: "none",
    transition: "all .2s",
    minWidth: 0,
  };

  return (
    <div style={{ padding:"12px 24px", background:"rgba(250, 247, 242, 0.85)", backdropFilter:"blur(8px)", borderBottom:`1px solid ${T.border}`, display:"flex", gap:10, flexWrap:"wrap", alignItems:"center", zIndex: 3 }}>
      <span style={{ fontSize:11, fontWeight:600, color:T.accent, textTransform:"uppercase", letterSpacing:"0.08em", flexShrink:0, display:"flex", alignItems:"center", gap:6 }}>
        <Icon.Dog /> Canine Companion:
      </span>

      {/* Name */}
      <input
        value={profile.name}
        onChange={e => onChange({ ...profile, name: e.target.value })}
        placeholder="Dog's Name"
        style={{ ...inp, width:110 }}
        onFocus={e => { e.target.style.borderColor=T.accent; e.target.style.background="#fff"; }}
        onBlur={e  => { e.target.style.borderColor=T.border; e.target.style.background=T.surface; }}
      />

      {/* Breed dropdown */}
      <div style={{ position:"relative", display:"inline-flex", alignItems:"center" }}>
        <select
          value={profile.breed}
          onChange={e => onChange({ ...profile, breed: e.target.value })}
          style={{ ...inp, width:170, paddingRight:26, WebkitAppearance:"none", cursor:"pointer" }}
          onFocus={e => { e.target.style.borderColor=T.accent; e.target.style.background="#fff"; }}
          onBlur={e  => { e.target.style.borderColor=T.border; e.target.style.background=T.surface; }}
        >
          <option value="">Any Breed</option>
          {ALL_BREEDS.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <span style={{ position:"absolute", right:10, pointerEvents:"none", fontSize:9, color:T.textLight }}>▼</span>
      </div>

      {/* Age */}
      <input
        value={profile.age}
        onChange={e => onChange({ ...profile, age: e.target.value })}
        placeholder="Age (e.g. 2 yrs)"
        style={{ ...inp, width:120 }}
        onFocus={e => { e.target.style.borderColor=T.accent; e.target.style.background="#fff"; }}
        onBlur={e  => { e.target.style.borderColor=T.border; e.target.style.background=T.surface; }}
      />

      {/* Profile summary pill when filled */}
      {(profile.breed || profile.name) && (
        <span style={{ fontSize:11, padding:"4px 12px", borderRadius:T.rPill, background:"rgba(176,137,104,0.12)", color:T.accentDark, border:`1px solid rgba(176,137,104,0.24)`, fontWeight:500, fontFamily:T.fontBody, textTransform:"uppercase", letterSpacing:"0.04em" }}>
          Active Target: {[profile.name, profile.breed, profile.age].filter(Boolean).join(" · ")}
        </span>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   FORMATTED MESSAGE (Markdown support)
   ═══════════════════════════════════════════════════════════ */
function FormattedMessage({ text, isUser }: { text: string; isUser: boolean }) {
  if (!text || typeof text !== "string" || text.trim() === "") {
    return <span style={{ color:T.textLight, fontStyle:"italic" }}>[Empty message]</span>;
  }

  if (isUser) return <span style={{ lineHeight:1.7 }}>{text}</span>;

  const renderInline = (str: string, key: number) => {
    const parts: React.ReactNode[] = [];
    let remaining = str;
    let k = 0;
    while (remaining) {
      const bold   = /\*\*(.*?)\*\*/.exec(remaining);
      const italic = /\*(.*?)\*/.exec(remaining);
      const code   = /`(.*?)`/.exec(remaining);
      const all = [bold&&{t:"b",m:bold},italic&&{t:"i",m:italic},code&&{t:"c",m:code}]
        .filter(Boolean).sort((a:any,b:any)=>a.m.index-b.m.index);
      if (!all.length) { parts.push(<span key={k++}>{remaining}</span>); break; }
      const {t,m} = all[0] as any;
      if (m.index > 0) parts.push(<span key={k++}>{remaining.slice(0,m.index)}</span>);
      if (t==="b") parts.push(<strong key={k++} style={{fontWeight:600,color:T.accentDark}}>{m[1]}</strong>);
      if (t==="i") parts.push(<em key={k++} style={{fontStyle:"italic",color:T.accent}}>{m[1]}</em>);
      if (t==="c") parts.push(<code key={k++} style={{background:"rgba(127,85,57,0.08)",padding:"2px 6px",borderRadius:"4px",fontFamily:"monospace",fontSize:12,color:T.accentDark}}>{m[1]}</code>);
      remaining = remaining.slice(m.index+m[0].length);
    }
    return <span key={key}>{parts}</span>;
  };

  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let idx = 0;

  const flushList = () => {
    if (!listItems.length) return;
    elements.push(<ul key={`ul-${idx++}`} style={{margin:"8px 0 8px 18px",padding:0,display:"flex",flexDirection:"column",gap:6,listStyleType:"disc"}}>{listItems.map((li,i)=><li key={i} style={{lineHeight:1.7,color:T.text}}>{li}</li>)}</ul>);
    listItems = [];
  };

  lines.forEach((line,i) => {
    const t = line.trim();
    if (/^#{1,3}\s/.test(t)) {
      flushList();
      const level = (t.match(/^#+/)?.[0]||"").length;
      const sizes = [17,15,13];
      elements.push(<div key={`h-${i}`} style={{fontSize:sizes[level-1]??14,fontWeight:600,color:T.accentDark,margin:"16px 0 6px",fontFamily:T.fontDisplay}}>{t.replace(/^#+\s/,"")}</div>);
    } else if (/^[-•*]\s/.test(t)) {
      listItems.push(renderInline(t.replace(/^[-•*]\s/,""),i));
    } else if (t==="") {
      flushList();
      elements.push(<div key={`br-${i}`} style={{height:8}}/>);
    } else {
      flushList();
      elements.push(<p key={`p-${i}`} style={{margin:"8px 0",lineHeight:1.75}}>{renderInline(t,i)}</p>);
    }
  });
  flushList();
  return <div>{elements}</div>;
}

/* ═══════════════════════════════════════════════════════════
   SIDEBAR
   ═══════════════════════════════════════════════════════════ */
function Sidebar({ chats, activeId, onSelect, onNew, onDelete, search, onSearch, onClose, isMobile }) {
  return (
    <aside role="navigation" aria-label="Chat history" style={{ width:isMobile?"100%":280, height:"100%", background:T.surface, borderRight:`1px solid ${T.border}`, display:"flex", flexDirection:"column", flexShrink:0, overflow:"hidden" }}>

      {/* Header */}
      <div style={{ padding:"20px 18px 0", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
          <div style={{ fontFamily:T.fontDisplay, fontSize:19, fontWeight:400, color:T.accentDark, display:"flex", alignItems:"center", gap:8 }}>
            BreedLy
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={onNew} aria-label="New Chat" style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:T.rPill, background:"linear-gradient(135deg, var(--accent-dark) 0%, var(--accent) 100%)", border:"none", color:"#fff", fontFamily:T.fontBody, fontSize:13, fontWeight:500, cursor:"pointer", transition:"var(--transition)", boxShadow:"0 4px 12px rgba(127,85,57,0.20)" }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 6px 18px rgba(127,85,57,0.30)"}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 4px 12px rgba(127,85,57,0.20)"}}
            >
              <Icon.Plus /> New Chat
            </button>
            {isMobile && (
              <button onClick={onClose} aria-label="Close" style={{ background:"none", border:"none", cursor:"pointer", color:T.textMid, display:"flex", alignItems:"center", padding:6, borderRadius:T.rSm }}>
                <Icon.X />
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        <div style={{ position:"relative", marginBottom:16 }}>
          <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:T.textLight, pointerEvents:"none", display:"flex" }}><Icon.Search /></span>
          <input type="search" placeholder="Search saved conversations…" value={search} onChange={e=>onSearch(e.target.value)} aria-label="Search chats"
            style={{ width:"100%", padding:"9px 12px 9px 34px", border:`1.5px solid ${T.border}`, borderRadius:T.rPill, background:T.bg, fontFamily:T.fontBody, fontSize:13, color:T.text, outline:"none", transition:"all .2s" }}
            onFocus={e=>{e.target.style.borderColor=T.accent; e.target.style.background="#fff";}}
            onBlur={e=>{e.target.style.borderColor=T.border; e.target.style.background=T.bg;}}
          />
        </div>

        <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.12em", color:T.textLight, marginBottom:8, paddingLeft:4 }}>
          Saved Discussions
        </div>
      </div>

      {/* Chat list */}
      <ul role="listbox" style={{ flex:1, overflowY:"auto", padding:"0 10px 16px", margin:0, listStyle:"none", scrollbarWidth:"thin", scrollbarColor:`${T.card} transparent` }}>
        {chats.length === 0 && (
          <li style={{ textAlign:"center", padding:"48px 16px", color:T.textLight, fontSize:12, lineHeight:1.75 }}>
            <div style={{ display:"inline-flex", padding:12, borderRadius:"50%", background:T.bgSoft, color:T.accentDark, marginBottom:10 }}>
              <Icon.Dog />
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: T.text, marginBottom: 4 }}>No conversations yet</div>
            <div style={{ color: T.textLight }}>Send a message and hit "Save" at the top to store discussions.</div>
          </li>
        )}
        {chats.map(chat => {
          const active = chat.id === activeId;
          return (
            <li key={chat.id} role="option" aria-selected={active}>
              <div style={{ display:"flex", alignItems:"stretch", borderRadius:T.rMd, marginBottom:4, background:active?"rgba(176,137,104,0.12)":"transparent", borderLeft:`3px solid ${active?T.accentDark:"transparent"}`, transition:"var(--transition)" }}
                onMouseEnter={e=>{ if(!active)(e.currentTarget as HTMLElement).style.background="rgba(176,137,104,0.06)"; }}
                onMouseLeave={e=>{ if(!active)(e.currentTarget as HTMLElement).style.background="transparent"; }}
              >
                <button onClick={()=>onSelect(chat.id)} style={{ flex:1, display:"flex", alignItems:"flex-start", gap:10, padding:"12px 10px 12px 12px", background:"none", border:"none", cursor:"pointer", textAlign:"left" }}>
                  <div style={{ width:34, height:34, borderRadius:"50%", background:active?T.accentDark:T.card, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:active?"#fff":T.accent, border:`1.5px solid ${active?T.accentDark:T.border}` }}>
                    <Icon.Dog />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:500, color:active?T.accentDark:T.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:140, fontFamily:T.fontBody, marginBottom:2 }}>{chat.title}</div>
                    <div style={{ fontSize:11, color:T.textLight, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:150 }}>{chat.preview}</div>
                  </div>
                </button>
                {/* Delete */}
                <button onClick={()=>onDelete(chat.id)} title="Delete conversation" style={{ padding:"0 12px", background:"none", border:"none", cursor:"pointer", color:T.textLight, display:"flex", alignItems:"center", borderRadius:`0 ${T.rMd} ${T.rMd} 0`, transition:"color .15s" }}
                  onMouseEnter={e=>e.currentTarget.style.color="#D63031"}
                  onMouseLeave={e=>e.currentTarget.style.color=T.textLight}
                >
                  <Icon.Trash />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Footer */}
      <div style={{ padding:"12px 18px", borderTop:`1px solid ${T.border}`, flexShrink:0, display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:32, height:32, borderRadius:"50%", background:T.card, border:`1.5px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"center", color:T.accentDark }}>
          <Icon.User />
        </div>
        <div>
          <div style={{ fontSize:13, fontWeight:500, color:T.text }}>You</div>
          <div style={{ fontSize:11, color:T.textLight }}>Canine Caretaker</div>
        </div>
      </div>
    </aside>
  );
}

/* ═══════════════════════════════════════════════════════════
   HEADER
   ═══════════════════════════════════════════════════════════ */
function Header({ isTyping, onToggleSidebar, onSave, profile }: { isTyping:boolean; onToggleSidebar:()=>void; onSave:()=>void; profile:DogProfile }) {
  return (
    <header style={{ background:T.surface, borderBottom:`1px solid ${T.border}`, padding:"12px 20px", display:"flex", alignItems:"center", gap:12, flexShrink:0, boxShadow:T.shSm }}>
      <button onClick={onToggleSidebar} aria-label="Toggle sidebar" style={{ background:"none", border:"none", cursor:"pointer", color:T.textMid, display:"flex", alignItems:"center", padding:6, borderRadius:T.rSm, flexShrink:0, transition:"background .15s" }}
        onMouseEnter={e=>e.currentTarget.style.background=T.bgSoft}
        onMouseLeave={e=>e.currentTarget.style.background="none"}
      >
        <Icon.Menu />
      </button>

      <div style={{ width:36, height:36, borderRadius:10, background:T.accentDark, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", flexShrink:0 }}>
        <Icon.Dog />
      </div>

      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontFamily:T.fontDisplay, fontSize:15, fontWeight:400, color:T.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
          {profile.breed ? `Paw Assistant · ${profile.breed}${profile.name ? ` (${profile.name})` : ""}` : "Paw Assistant"}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:2 }}>
          <div style={{ width:7, height:7, borderRadius:"50%", background:isTyping?T.accent:T.teal, transition:"background .3s", boxShadow:isTyping?`0 0 8px ${T.accent}`:`0 0 8px ${T.teal}` }} />
          <span style={{ fontSize:11, color:T.textLight, fontFamily:T.fontBody }}>{isTyping ? "Consulting science..." : "Breed-aware AI · online"}</span>
        </div>
      </div>

      {/* Save chat button */}
      <button
        onClick={onSave}
        title="Save this conversation"
        style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 18px", borderRadius:T.rPill, background:T.card, border:`1.5px solid ${T.border}`, fontFamily:T.fontBody, fontSize:12, fontWeight:500, color:T.accentDark, cursor:"pointer", transition:"var(--transition)", flexShrink:0, boxShadow:"0 2px 8px rgba(100,70,40,0.04)" }}
        onMouseEnter={e=>{ e.currentTarget.style.background=T.accentDark; e.currentTarget.style.color="#fff"; e.currentTarget.style.borderColor=T.accentDark; e.currentTarget.style.transform="translateY(-1px)"; }}
        onMouseLeave={e=>{ e.currentTarget.style.background=T.card; e.currentTarget.style.color=T.accentDark; e.currentTarget.style.borderColor=T.border; e.currentTarget.style.transform="none"; }}
      >
        <Icon.Save /> Save Discussion
      </button>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════
   MESSAGE BUBBLE (with reactions + copy)
   ═══════════════════════════════════════════════════════════ */
function MessageBubble({ message, onRetry }: { message:any; onRetry:(t:string)=>void }) {
  const isUser = message.sender === "user";
  const [hover, setHover] = useState(false);
  const [showReact, setShowReact] = useState(false);
  const [reactions, setReactions] = useState<{emoji:string;count:number}[]>([]);
  const toast = useToast();
  const EMOJIS = ["👍","❤️","😂","😮","😢","🔥","🐾","😍"];

  function copy() {
    navigator.clipboard.writeText(message.text);
    toast.addToast("✓ Copied to clipboard", "success");
  }
  function addReaction(em:string) {
    setReactions(p=>{ const ex=p.find(r=>r.emoji===em); return ex?p.map(r=>r.emoji===em?{...r,count:r.count+1}:r):[...p,{emoji:em,count:1}]; });
    setShowReact(false);
  }

  return (
    <div
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>{ setHover(false); setShowReact(false); }}
      style={{ display:"flex", alignItems:"flex-start", gap:10, justifyContent:isUser?"flex-end":"flex-start", marginBottom:16, animation:"msgPop .3s cubic-bezier(0.34,1.3,0.64,1) both", position:"relative" }}
    >
      {!isUser && (
        <div style={{ width:32, height:32, borderRadius:"50%", background:T.card, border:`1.5px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"center", color:T.accentDark, flexShrink:0, marginTop:2, boxShadow:"0 2px 8px rgba(100,70,40,0.05)" }}>
          <Icon.Dog />
        </div>
      )}

      <div style={{ maxWidth:"74%", display:"flex", flexDirection:"column", alignItems:isUser?"flex-end":"flex-start", gap:4 }}>
        <div style={{ padding:"12px 18px", borderRadius:isUser?`${T.rLg} ${T.rLg} ${T.rSm} ${T.rLg}`:`${T.rLg} ${T.rLg} ${T.rLg} ${T.rSm}`, background:isUser?T.userBubble:"rgba(250, 247, 242, 0.95)", color:isUser?"#fff":T.text, border:isUser?"none":`1px solid ${T.border}`, fontSize:14.5, fontFamily:T.fontBody, fontWeight: 300, boxShadow:isUser?`0 6px 20px rgba(127,85,57,.18)`:T.shSm, lineHeight:1.75 }}>
          <FormattedMessage text={message.text} isUser={isUser} />
        </div>

        {/* Reactions */}
        {reactions.length>0 && (
          <div style={{ display:"flex", gap:4, flexWrap:"wrap", paddingInline:6 }}>
            {reactions.map(r=>(
              <div key={r.emoji} style={{ display:"flex", alignItems:"center", gap:3, padding:"2px 8px", borderRadius:T.rPill, background:T.bgSoft, border:`1px solid rgba(176,137,104,0.30)`, fontSize:11, cursor:"pointer", transition:"all .15s", fontFamily:T.fontBody }}
                onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.background=T.card; }}
                onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.background=T.bgSoft; }}
              >
                {r.emoji}{r.count>1&&<span style={{ fontWeight: 600 }}>{r.count}</span>}
              </div>
            ))}
          </div>
        )}

        {/* Meta row */}
        <div style={{ display:"flex", alignItems:"center", gap:8, paddingInline:6, height: 16 }}>
          <span style={{ fontSize:10, color:T.textLight, fontFamily:T.fontBody }}>{fmtTime(new Date(message.timestamp))}</span>
          {isUser && <span style={{ color:message.read?T.teal:T.textLight, display:"flex" }}><Icon.DblChk /></span>}

          {/* Hover actions */}
          {hover && (
            <div style={{ display:"flex", gap:8, position:"relative", alignItems:"center" }}>
              <button onClick={copy} title="Copy text" style={{ background:"none", border:"none", cursor:"pointer", color:T.textMid, padding:0, display:"flex", alignItems:"center", opacity:0.8, transition:"opacity .1s" }} onMouseEnter={e=>e.currentTarget.style.opacity="1"} onMouseLeave={e=>e.currentTarget.style.opacity="0.8"}>
                <Icon.Copy />
              </button>
              {!isUser && (
                <div style={{ position:"relative", display:"flex" }}>
                  <button onClick={()=>setShowReact(v=>!v)} title="React" style={{ background:"none", border:"none", cursor:"pointer", color:T.textMid, padding:0, display:"flex", alignItems:"center", opacity:0.8, transition:"opacity .1s" }} onMouseEnter={e=>e.currentTarget.style.opacity="1"} onMouseLeave={e=>e.currentTarget.style.opacity="0.8"}>
                    <Icon.React />
                  </button>
                  {showReact && (
                    <div style={{ position:"absolute", bottom:20, left:0, background:T.surface, border:`1px solid ${T.border}`, borderRadius:T.rMd, padding:"6px 8px", display:"flex", gap:5, zIndex:100, boxShadow:T.shLg, animation:"slideInUp .18s ease" }}>
                      {EMOJIS.map(em=>(
                        <button key={em} onClick={()=>addReaction(em)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:16, padding:"2px", borderRadius:T.rSm, transition:"transform .1s" }}
                          onMouseEnter={e=>e.currentTarget.style.transform="scale(1.3)"}
                          onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
                        >{em}</button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {isUser && (
                <button onClick={()=>{ onRetry(message.text); toast.addToast("↩ Retrying…","info"); }} title="Resend question" style={{ background:"none", border:"none", cursor:"pointer", color:T.textMid, padding:0, display:"flex", alignItems:"center", opacity:0.8 }} onMouseEnter={e=>e.currentTarget.style.opacity="1"} onMouseLeave={e=>e.currentTarget.style.opacity="0.8"}>
                  <Icon.Resend />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {isUser && (
        <div style={{ width:32, height:32, borderRadius:"50%", background:T.card, border:`1.5px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"center", color:T.accentDark, flexShrink:0, marginTop:2, boxShadow:"0 2px 8px rgba(100,70,40,0.05)" }}>
          <Icon.User />
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DATE DIVIDER
   ═══════════════════════════════════════════════════════════ */
function DateDivider({ label }: { label:string }) {
  return (
    <div role="separator" style={{ display:"flex", alignItems:"center", gap:12, margin:"20px 0 12px", userSelect:"none" }}>
      <div style={{ flex:1, height:1, background:T.border }} />
      <span style={{ fontSize:10, fontWeight:600, color:T.accent, padding:"4px 12px", borderRadius:T.rPill, background:T.bgSoft, border:`1px solid rgba(176,137,104,0.22)`, fontFamily:T.fontBody, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</span>
      <div style={{ flex:1, height:1, background:T.border }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MESSAGE INPUT COMPOSER (emoji + voice, floating design)
   ═══════════════════════════════════════════════════════════ */
function MessageInput({ onSend, disabled }: { onSend:(t:string)=>void; disabled:boolean }) {
  const [text, setText]           = useState("");
  const [showEmoji, setEmoji]     = useState(false);
  const [isListening, setListen]  = useState(false);
  const textareaRef               = useRef<HTMLTextAreaElement>(null);
  const recogRef                  = useRef<any>(null);

  /* Voice input engine */
  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR || recogRef.current) return;
    const r = new SR();
    r.continuous = false; r.interimResults = true; r.lang = "en-US";
    r.onstart  = () => setListen(true);
    r.onend    = () => setListen(false);
    r.onerror  = () => setListen(false);
    r.onresult = (e: any) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) setText(p => p + (p?" ":"") + e.results[i][0].transcript);
      }
    };
    recogRef.current = r;
  }, []);

  function toggleVoice() {
    if (!recogRef.current) return;
    if (isListening) { recogRef.current.stop(); }
    else { setText(""); recogRef.current.start(); }
  }

  /* Auto-resize textarea container */
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120)+"px";
  }, [text]);

  const EMOJIS = ["👍","❤️","😂","😮","😢","🔥","🐾","😍"];

  function send() {
    const t = text.trim();
    if (!t || disabled) return;
    onSend(t); setText(""); setEmoji(false);
    textareaRef.current?.focus();
  }

  function handleKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); send(); }
    if (e.key==="Escape") setEmoji(false);
  }

  return (
    <div role="form" aria-label="Message composer" className="floating-composer-card">

      {/* Emoji picker popover */}
      {showEmoji && (
        <div style={{ position:"absolute", bottom:"108%", left:16, background:T.surface, border:`1px solid ${T.border}`, borderRadius:T.rLg, padding:12, boxShadow:T.shLg, display:"flex", flexWrap:"wrap", gap:6, width:210, zIndex:10, animation:"slideInUp 0.18s ease" }}>
          {EMOJIS.map(em=>(
            <button key={em} onClick={()=>setText(t=>t+em)} style={{ fontSize:20, background:"none", border:"none", cursor:"pointer", padding:"3px", borderRadius:T.rSm, transition:"background .12s" }}
              onMouseEnter={e=>e.currentTarget.style.background=T.bgSoft}
              onMouseLeave={e=>e.currentTarget.style.background="none"}
            >{em}</button>
          ))}
        </div>
      )}

      <div style={{ display:"flex", gap:8, alignItems:"flex-end" }}>
        {/* Emoji Trigger */}
        <button onClick={()=>setEmoji(v=>!v)} aria-label="Emoji picker" aria-expanded={showEmoji}
          style={{ flexShrink:0, width:38, height:38, borderRadius:T.rMd, background:showEmoji?"rgba(176,137,104,0.18)":"none", border:`1px solid ${showEmoji?T.accent:T.border}`, color:T.textMid, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}>
          <Icon.React />
        </button>

        {/* Microphone Voice Trigger */}
        <button onClick={toggleVoice} aria-label={isListening?"Stop recording":"Start voice input"}
          style={{ flexShrink:0, width:38, height:38, borderRadius:T.rMd, background:isListening?"#D63031":"none", border:`1px solid ${isListening?"#D63031":T.border}`, color:isListening?"#fff":T.textMid, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s", animation:isListening?"recPulse 1s ease-in-out infinite":"none", boxShadow:isListening?"0 0 12px rgba(214,48,49,0.3)":"none" }}
          onMouseEnter={e=>{ if(!isListening){e.currentTarget.style.background=T.bgSoft;e.currentTarget.style.borderColor=T.accent;} }}
          onMouseLeave={e=>{ if(!isListening){e.currentTarget.style.background="none";e.currentTarget.style.borderColor=T.border;} }}
        >
          <Icon.Mic />
        </button>

        {/* Text Input area */}
        <textarea ref={textareaRef} value={text} onChange={e=>setText(e.target.value)} onKeyDown={handleKey}
          placeholder={isListening ? "Listening... Speak now" : "Ask about canine diets, health, training, grooming..."}
          aria-label="Type a message" rows={1} disabled={disabled}
          style={{ flex:1, resize:"none", border:`1.5px solid ${T.border}`, borderRadius:T.rLg, padding:"10px 14px", fontFamily:T.fontBody, fontSize:13.5, color:T.text, background:T.bg, outline:"none", minHeight:42, maxHeight:120, lineHeight:1.6, transition:"all .2s", scrollbarWidth:"thin" }}
          onFocus={e=>{ e.target.style.borderColor=T.accent; e.target.style.background="#fff"; }}
          onBlur={e=>{ e.target.style.borderColor=T.border; e.target.style.background=T.bg; }}
        />

        {/* Send Trigger */}
        <button onClick={send} disabled={!text.trim()||disabled} aria-label="Send message"
          style={{ flexShrink:0, width:40, height:40, borderRadius:"50%", background:text.trim()?T.accentDark:T.border, border:"none", color:"#fff", cursor:text.trim()?"pointer":"default", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s", boxShadow:text.trim()?`0 4px 14px rgba(127,85,57,.3)`:"none" }}
          onMouseEnter={e=>{ if(text.trim()) e.currentTarget.style.background=T.accent; }}
          onMouseLeave={e=>{ if(text.trim()) e.currentTarget.style.background=T.accentDark; }}
        >
          <Icon.Send />
        </button>
      </div>

      <p style={{ fontSize:10, color:T.textLight, textAlign:"center", marginTop:6, fontStyle:"italic", fontFamily:T.fontBody }}>
        Enter to send · Shift+Enter for new line · Click microphone for voice
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MESSAGE LIST
   ═══════════════════════════════════════════════════════════ */
function MessageList({ messages, isTyping, bottomRef, onRetry }) {
  const grouped = groupByDate(messages);
  return (
    <main role="log" aria-label="Chat messages" aria-live="polite" className="cp-body-messages-pane">
      {messages.length === 0 && (
        <div style={{ textAlign:"center", padding:"72px 20px", display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
          <div style={{ display:"inline-flex", padding:16, borderRadius:"50%", background:T.bgSoft, color:T.accentDark, animation:"msgPop .4s ease" }}>
            <Icon.Dog />
          </div>
          <div style={{ fontFamily:T.fontDisplay, fontSize:19, fontWeight:400, color:T.accentDark, animation:"msgPop .4s ease" }}>Hello! I'm Paw Assistant.</div>
          <p style={{ fontSize:13.5, color:T.textMid, maxWidth:320, lineHeight:1.75, fontFamily:T.fontBody, fontWeight:300 }}>Fill in your dog's profile above, then ask me anything about food ratios, training routines, grooming frequencies, or wellness.</p>
        </div>
      )}
      {grouped.map(item =>
        item.type==="divider"
          ? <DateDivider key={item.id} label={item.label} />
          : <MessageBubble key={item.id} message={item} onRetry={onRetry} />
      )}
      {isTyping && (
        <div style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:16 }}>
          <div style={{ width:32, height:32, borderRadius:"50%", background:T.card, border:`1.5px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"center", color:T.accentDark, boxShadow:"0 2px 8px rgba(100,70,40,0.05)" }}>
            <Icon.Dog />
          </div>
          <div style={{ padding:"12px 18px", borderRadius:`${T.rLg} ${T.rLg} ${T.rLg} ${T.rSm}`, background:"rgba(250, 247, 242, 0.95)", border:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:5, boxShadow:T.shSm }}>
            {[0,1,2].map(i=>(
              <div key={i} style={{ width:6, height:6, borderRadius:"50%", background:T.accent, animation:`typDot 1.2s ease-in-out ${i*0.2}s infinite` }} />
            ))}
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </main>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROOT — wrapped in ToastProvider
   ═══════════════════════════════════════════════════════════ */
export default function ChatPageWrapper() {
  return (
    <ToastProvider>
      <ChatInterface />
    </ToastProvider>
  );
}

/* ═══════════════════════════════════════════════════════════
   CHAT INTERFACE
   ═══════════════════════════════════════════════════════════ */
function ChatInterface() {
  const toast = useToast();

  /* ── useChatBot hook (real AI) ── */
  const { messages: rawMessages, loading, sendMessage: sendToBot, clearChat } = useChatBot();

  /* ── Dog profile — auto-saved to localStorage ── */
  const [dogProfile, setDogProfile] = useState<DogProfile>(() => {
    try {
      const saved = localStorage.getItem(PERSIST_PROFILE);
      return saved ? JSON.parse(saved) : { name:"", breed:"", age:"" };
    } catch { return { name:"", breed:"", age:"" }; }
  });

  /* Auto-save profile */
  useEffect(() => {
    try { localStorage.setItem(PERSIST_PROFILE, JSON.stringify(dogProfile)); } catch {}
  }, [dogProfile]);

  /* ── Saved chat history ── */
  const [savedChats, setSavedChats] = useState<any[]>(() => {
    try {
      const s = localStorage.getItem(PERSIST_CHATS);
      return s ? JSON.parse(s) : [];
    } catch { return []; }
  });
  const [activeId, setActiveId] = useState<string|null>(null);

  /* Auto-save history */
  useEffect(() => {
    try { localStorage.setItem(PERSIST_CHATS, JSON.stringify(savedChats)); } catch {}
  }, [savedChats]);

  /* ── UI state ── */
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search,      setSearch]      = useState("");
  const [isMobile,    setIsMobile]    = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  /* Responsive */
  useEffect(() => {
    const check = () => { const m=window.innerWidth<768; setIsMobile(m); if(m) setSidebarOpen(false); };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* Auto scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [rawMessages, loading]);

  /* ── Transform raw messages for UI ── */
  const uiMessages = rawMessages.map(m => {
    const content = (m.content ?? "").trim();
    if (!content) {
      console.warn("[ChatInterface] Skipping empty message:", m);
      return null;
    }
    return {
      id:        m.id,
      text:      content,
      sender:    m.role==="user" ? "user" : "bot",
      timestamp: m.timestamp,
      read:      true,
    };
  }).filter(Boolean) as any[];

  /* ── SEND (builds prompt with dog profile) ── */
  const handleSend = useCallback((text: string) => {
    if (!text.trim() || loading) return;
    const { name, breed, age } = dogProfile;
    const hasProfile = breed || name;
    const prompt = hasProfile
      ? `Dog: ${[name,breed,age].filter(Boolean).join(", ")}\n\nQuestion: ${text}`
      : text;
    sendToBot(prompt, { displayMessage: text });
  }, [sendToBot, loading, dogProfile]);

  /* ── SAVE current chat ── */
  function saveChat() {
    if (rawMessages.length === 0) { toast.addToast("No messages to save", "info"); return; }
    const firstMsg = rawMessages[0];
    const lastMsg  = rawMessages[rawMessages.length-1];
    const firstText = (firstMsg?.content ?? "").slice(0, 40) || "Chat";
    const lastText  = (lastMsg?.content ?? "").slice(0, 60) || "";
    
    if (!firstText || firstText === "Chat") {
      toast.addToast("Messages are empty - cannot save", "error");
      return;
    }

    const chat = {
      id:        uid(),
      title:     firstText,
      preview:   lastText,
      timestamp: new Date(),
      unread:    0,
      snapshot:  uiMessages,
    };
    setSavedChats(p=>[chat,...p]);
    setActiveId(chat.id);
    toast.addToast("✓ Chat saved!", "success");
  }

  /* ── LOAD saved chat (read-only view) ── */
  function loadChat(id: string) {
    setActiveId(id);
    if (isMobile) setSidebarOpen(false);
  }

  /* ── DELETE saved chat ── */
  function deleteChat(id: string) {
    setSavedChats(p=>p.filter(c=>c.id!==id));
    if (activeId===id) { setActiveId(null); }
    toast.addToast("Chat deleted", "info");
  }

  /* ── NEW chat ── */
  function newChat() {
    clearChat();
    setActiveId(null);
    if (isMobile) setSidebarOpen(false);
  }

  const filteredChats = savedChats.filter(c=>c.title.toLowerCase().includes(search.toLowerCase()));
  const viewMessages  = activeId ? (savedChats.find(c=>c.id===activeId)?.snapshot ?? uiMessages) : uiMessages;
  const isLiveView    = !activeId;

  const quickReplies = isLiveView && rawMessages.length===0 ? DEFAULT_QUICK_REPLIES : [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300&family=DM+Sans:wght@300;400;500&display=swap');
        
        .bc-root *, .bc-root *::before, .bc-root *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        /* Message pop entry */
        @keyframes msgPop { 
          from { opacity: 0; transform: scale(0.96) translateY(8px); } 
          to { opacity: 1; transform: scale(1) translateY(0); } 
        }

        /* Typing indicators */
        @keyframes typDot { 
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; } 
          40% { transform: translateY(-5px); opacity: 1; } 
        }

        /* Slide animations */
        @keyframes slideInUp { 
          from { opacity: 0; transform: translateY(14px); } 
          to { opacity: 1; transform: translateY(0); } 
        }

        /* Mic pulse glow */
        @keyframes recPulse { 
          0%, 100% { opacity: 1; transform: scale(1); } 
          50% { opacity: 0.65; transform: scale(0.94); } 
        }

        /* Sidebar slide */
        @keyframes sbSlide { 
          from { transform: translateX(-100%); } 
          to { transform: translateX(0); } 
        }

        .bc-root ::-webkit-scrollbar {
          width: 3px;
        }
        .bc-root ::-webkit-scrollbar-thumb {
          background: ${T.card};
          border-radius: 3px;
        }
        .bc-root :focus-visible {
          outline: 2px solid ${T.accent};
          outline-offset: 2px;
        }

        /* General scrolling pane */
        .cp-body-messages-pane {
          flex: 1;
          overflow-y: auto;
          padding: 20px 24px 130px; /* Leave space for floating card on desktop */
          background: linear-gradient(135deg, #FDFBFA 0%, #F5EFE6 100%);
          scrollbar-width: thin;
          scrollbar-color: ${T.card} transparent;
        }

        /* Floating composer box styles (Desktop style) */
        .floating-composer-card {
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 36px);
          max-width: 740px;
          background: rgba(250, 247, 242, 0.90);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(176, 137, 104, 0.25);
          border-radius: ${T.rLg};
          padding: 10px 14px 12px;
          box-shadow: ${T.shLg};
          z-index: 10;
          transition: var(--transition);
        }
        
        .floating-composer-card:focus-within {
          border-color: ${T.accentDark};
          box-shadow: 0 28px 72px rgba(100, 70, 40, 0.16);
          background: #FFFFFF;
        }

        .floating-chips-row {
          position: absolute;
          bottom: 104%;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          justify-content: center;
          padding: 0 8px;
          z-index: 9;
        }

        /* ── PERFECT RESPONSIVE MOBILE OVERHAUL ── */
        @media (max-width: 768px) {
          /* Message List bottom padding reduced to clear Docked input naturally */
          .cp-body-messages-pane {
            padding: 16px 16px 20px !important;
          }

          /* Dock the composer at the bottom statically rather than floating absolutely */
          .floating-composer-card {
            position: relative !important;
            bottom: auto !important;
            left: auto !important;
            transform: none !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            border-radius: 0 !important;
            border: none !important;
            border-top: 1px solid ${T.border} !important;
            background: ${T.surface} !important;
            box-shadow: none !important;
            padding: 12px 16px !important;
            z-index: 10 !important;
          }

          .floating-composer-card:focus-within {
            box-shadow: none !important;
            background: #FFFFFF !important;
          }

          .floating-chips-row {
            display: none !important; /* Hide on smaller screens to maximize messaging viewport */
          }
        }
      `}</style>

      <div className="bc-root" style={{ width:"100%", height:"100vh", display:"flex", overflow:"hidden", background:T.bg, fontFamily:T.fontBody, position:"relative" }}>

        {/* Sidebar */}
        {isMobile ? (
          sidebarOpen && (
            <>
              <div onClick={()=>setSidebarOpen(false)} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.28)", zIndex:9, backdropFilter:"blur(2px)" }} />
              <div style={{ position:"absolute", left:0, top:0, height:"100%", width:280, zIndex:10, animation:"sbSlide .25s ease" }}>
                <Sidebar chats={filteredChats} activeId={activeId} onSelect={loadChat} onNew={newChat} onDelete={deleteChat} search={search} onSearch={setSearch} onClose={()=>setSidebarOpen(false)} isMobile />
              </div>
            </>
          )
        ) : (
          sidebarOpen && <Sidebar chats={filteredChats} activeId={activeId} onSelect={loadChat} onNew={newChat} onDelete={deleteChat} search={search} onSearch={setSearch} onClose={()=>setSidebarOpen(false)} isMobile={false} />
        )}

        {/* Main pane */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, height:"100%", overflow:"hidden", position:"relative" }}>

          <Header isTyping={loading} onToggleSidebar={()=>setSidebarOpen(v=>!v)} onSave={saveChat} profile={dogProfile} />

          {/* Dog Profile Bar */}
          <InlineDogProfileBar profile={dogProfile} onChange={setDogProfile} />

          {/* Read-only banner when viewing a saved chat */}
          {activeId && (
            <div style={{ background:T.card, borderBottom:`1px solid ${T.border}`, padding:"8px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", zIndex: 2 }}>
              <span style={{ fontSize:12, color:T.accentDark, fontWeight:500, fontFamily:T.fontBody }}>📖 Viewing Saved Discussion Snapshot</span>
              <button onClick={newChat} style={{ fontSize:11, fontWeight:500, color:T.accentDark, background:"none", border:`1px solid ${T.border}`, borderRadius:T.rPill, padding:"4px 12px", cursor:"pointer", fontFamily:T.fontBody, transition:"all .15s" }}
                onMouseEnter={e=>{ e.currentTarget.style.background=T.accentDark; e.currentTarget.style.color="#fff"; }}
                onMouseLeave={e=>{ e.currentTarget.style.background="none"; e.currentTarget.style.color=T.accentDark; }}
              >
                ← Return to Live Assistant
              </button>
            </div>
          )}

          {/* Message List */}
          <MessageList messages={viewMessages} isTyping={isLiveView && loading} bottomRef={bottomRef} onRetry={handleSend} />

          {/* Input & Quick Reply Row */}
          {isLiveView ? (
            <div style={{ position: "relative", width: "100%", display: "flex", flexDirection: "column" }}>
              {/* Quick reply chips floating above input */}
              {quickReplies.length > 0 && (
                <div role="group" aria-label="Quick replies" className="floating-chips-row">
                  {quickReplies.map(r=>(
                    <button key={r} onClick={()=>handleSend(r)} disabled={loading}
                      style={{ padding:"6px 14px", borderRadius:T.rPill, border:`1px solid ${T.border}`, background:"rgba(250, 247, 242, 0.95)", backdropFilter:"blur(8px)", fontFamily:T.fontBody, fontSize:11, fontWeight:500, color:T.accentDark, cursor:loading?"not-allowed":"pointer", transition:"all .18s", opacity:loading?.6:1, boxShadow:"0 4px 12px rgba(100,70,40,0.04)" }}
                      onMouseEnter={e=>{ if(!loading){e.currentTarget.style.background=T.card;e.currentTarget.style.borderColor=T.accent;} }}
                      onMouseLeave={e=>{ e.currentTarget.style.background="rgba(250, 247, 242, 0.95)";e.currentTarget.style.borderColor=T.border; }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}

              <MessageInput onSend={handleSend} disabled={loading} />
            </div>
          ) : (
            <div className="floating-composer-card" style={{ position: isMobile ? "relative" : "absolute", bottom: isMobile ? "auto" : 24, left: isMobile ? "auto" : "50%", transform: isMobile ? "none" : "translateX(-50%)", width: isMobile ? "100%" : "calc(100% - 36px)", borderRadius: isMobile ? 0 : T.rLg, padding: isMobile ? "14px 16px" : "14px 20px", background: isMobile ? T.surface : "rgba(250, 247, 242, 0.90)", border: isMobile ? "none" : `1px solid ${T.border}`, borderTop: isMobile ? `1px solid ${T.border}` : "none", textAlign:"center", boxShadow: isMobile ? "none" : T.shLg, zIndex: 10, margin: 0 }}>
              <p style={{ fontSize:12.5, color:T.textMid, marginBottom:10, fontFamily:T.fontBody }}>This conversation is saved and loaded in read-only mode.</p>
              <button onClick={newChat} style={{ padding:"8px 24px", borderRadius:T.rPill, background:T.accentDark, color:"#fff", border:"none", fontFamily:T.fontBody, fontSize:13, fontWeight:500, cursor:"pointer", transition:"all .2s", boxShadow:"0 4px 12px rgba(127,85,57,0.15)" }}
                onMouseEnter={e=>e.currentTarget.style.background=T.accent}
                onMouseLeave={e=>e.currentTarget.style.background=T.accentDark}
              >
                Start New Discussion →
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
