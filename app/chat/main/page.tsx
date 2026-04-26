"use client";

import { useEffect, useRef, useState, useCallback, useContext, createContext } from "react";
import type { KeyboardEvent } from "react";

import { useChatBot }      from "@/lib/useChatBot";
import { ChatMessage }     from "../../components/chat/ChatMessage";
import { DogProfileBar }   from "../../components/chat/DogProfileBar";
import { QuickChips }      from "../../components/chat/QuickChips";
import { TypingIndicator } from "../../components/chat/TypingIndicator";

/* ═══════════════════════════════════════════════════════════
   DESIGN TOKENS
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
  rXl: "28px", rLg: "20px", rMd: "14px", rSm: "10px", rPill: "999px",
  shSm: "0 4px 16px rgba(100,70,40,0.06)",
  shMd: "0 8px 32px rgba(100,70,40,0.10)",
  shLg: "0 20px 56px rgba(100,70,40,0.14)",
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
  "What should I feed my dog? 🥗",
  "How often should I groom? ✂️",
  "Is my dog's weight healthy? ⚖️",
  "Training tips for my breed 🐕",
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
   SVG ICONS
═══════════════════════════════════════════════════════════ */
const Icon = {
  Send:   () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>,
  Plus:   () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>,
  Search: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>,
  Menu:   () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6H20M4 12H14M4 18H9"/></svg>,
  X:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  Emoji:  () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M8.5 14s1.5 2 3.5 2 3.5-2 3.5-2"/><circle cx="9" cy="10" r="1" fill="currentColor"/><circle cx="15" cy="10" r="1" fill="currentColor"/></svg>,
  DblChk: () => <svg width="15" height="10" viewBox="0 0 30 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M2 6l5 5 8-9"/><path d="M15 6l5 5 8-9"/></svg>,
  Save:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>,
  Trash:  () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>,
  Mic:    () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M19 10a7 7 0 01-14 0M12 19v3M9 22h6"/></svg>,
};

/* ═══════════════════════════════════════════════════════════
   INLINE DOG PROFILE BAR
   (Uses your DogProfileBar component if it exists,
    falls back to this inline version with breed dropdown)
═══════════════════════════════════════════════════════════ */
interface DogProfile { name: string; breed: string; age: string; }

function InlineDogProfileBar({ profile, onChange }: { profile: DogProfile; onChange: (p: DogProfile) => void }) {
  const inp: React.CSSProperties = {
    padding: "7px 12px",
    borderRadius: T.rPill,
    border: `1.5px solid ${T.border}`,
    background: T.bg,
    fontFamily: T.fontBody,
    fontSize: 12,
    color: T.text,
    outline: "none",
    transition: "border-color .2s",
    minWidth: 0,
  };

  return (
    <div style={{ padding:"10px 16px", background:T.surface, borderBottom:`1px solid ${T.border}`, display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
      <span style={{ fontSize:11, fontWeight:600, color:T.textLight, textTransform:"uppercase", letterSpacing:"0.08em", flexShrink:0 }}>🐾 Dog:</span>

      {/* Name */}
      <input
        value={profile.name}
        onChange={e => onChange({ ...profile, name: e.target.value })}
        placeholder="Name"
        style={{ ...inp, width:90 }}
        onFocus={e => e.target.style.borderColor=T.accent}
        onBlur={e  => e.target.style.borderColor=T.border}
      />

      {/* Breed dropdown */}
      <select
        value={profile.breed}
        onChange={e => onChange({ ...profile, breed: e.target.value })}
        style={{ ...inp, width:160, WebkitAppearance:"none", cursor:"pointer" }}
        onFocus={e => e.target.style.borderColor=T.accent}
        onBlur={e  => e.target.style.borderColor=T.border}
      >
        <option value="">Select breed…</option>
        {ALL_BREEDS.map(b => <option key={b} value={b}>{b}</option>)}
      </select>

      {/* Age */}
      <input
        value={profile.age}
        onChange={e => onChange({ ...profile, age: e.target.value })}
        placeholder="Age (e.g. 2 yrs)"
        style={{ ...inp, width:110 }}
        onFocus={e => e.target.style.borderColor=T.accent}
        onBlur={e  => e.target.style.borderColor=T.border}
      />

      {/* Profile summary pill when filled */}
      {(profile.breed || profile.name) && (
        <span style={{ fontSize:11, padding:"4px 12px", borderRadius:T.rPill, background:T.card, color:T.accentDark, border:`1px solid ${T.border}`, fontWeight:500 }}>
          {[profile.name, profile.breed, profile.age].filter(Boolean).join(" · ")}
        </span>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   FORMATTED MESSAGE (Markdown support)
═══════════════════════════════════════════════════════════ */
function FormattedMessage({ text, isUser }: { text: string; isUser: boolean }) {
  // Defensive check: ensure text is a non-empty string
  if (!text || typeof text !== "string" || text.trim() === "") {
    return <span style={{ color:T.textLight, fontStyle:"italic" }}>[Empty message]</span>;
  }

  if (isUser) return <span style={{ lineHeight:1.65 }}>{text}</span>;

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
      if (t==="c") parts.push(<code key={k++} style={{background:T.bgSoft,padding:"2px 6px",borderRadius:T.rSm,fontFamily:"monospace",fontSize:12}}>{m[1]}</code>);
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
    elements.push(<ul key={`ul-${idx++}`} style={{margin:"8px 0 8px 18px",padding:0,display:"flex",flexDirection:"column",gap:4}}>{listItems.map((li,i)=><li key={i} style={{lineHeight:1.65}}>{li}</li>)}</ul>);
    listItems = [];
  };

  lines.forEach((line,i) => {
    const t = line.trim();
    if (/^#{1,3}\s/.test(t)) {
      flushList();
      const level = (t.match(/^#+/)?.[0]||"").length;
      const sizes = [15,14,13];
      elements.push(<div key={`h-${i}`} style={{fontSize:sizes[level-1]??13,fontWeight:600,color:T.accentDark,margin:"12px 0 5px"}}>{t.replace(/^#+\s/,"")}</div>);
    } else if (/^[-•*]\s/.test(t)) {
      listItems.push(renderInline(t.replace(/^[-•*]\s/,""),i));
    } else if (t==="") {
      flushList();
      elements.push(<div key={`br-${i}`} style={{height:6}}/>);
    } else {
      flushList();
      elements.push(<p key={`p-${i}`} style={{margin:"6px 0",lineHeight:1.7}}>{renderInline(t,i)}</p>);
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
      <div style={{ padding:"18px 16px 0", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
          <div style={{ fontFamily:T.fontDisplay, fontSize:17, fontWeight:400, color:T.accentDark, display:"flex", alignItems:"center", gap:7 }}>
            🐾 BreedLy
          </div>
          <div style={{ display:"flex", gap:7 }}>
            <button onClick={onNew} aria-label="New chat" style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 13px", borderRadius:T.rPill, background:T.accentDark, border:"none", color:"#fff", fontFamily:T.fontBody, fontSize:12, fontWeight:500, cursor:"pointer", transition:"background .2s" }}
              onMouseEnter={e=>e.currentTarget.style.background=T.accent}
              onMouseLeave={e=>e.currentTarget.style.background=T.accentDark}
            >
              <Icon.Plus /> New
            </button>
            {isMobile && (
              <button onClick={onClose} aria-label="Close" style={{ background:"none", border:"none", cursor:"pointer", color:T.textMid, display:"flex", alignItems:"center", padding:5, borderRadius:T.rSm }}>
                <Icon.X />
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        <div style={{ position:"relative", marginBottom:12 }}>
          <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:T.textLight, pointerEvents:"none" }}><Icon.Search /></span>
          <input type="search" placeholder="Search saved chats…" value={search} onChange={e=>onSearch(e.target.value)} aria-label="Search chats"
            style={{ width:"100%", padding:"8px 12px 8px 30px", border:`1.5px solid ${T.border}`, borderRadius:T.rPill, background:T.bg, fontFamily:T.fontBody, fontSize:12, color:T.text, outline:"none", transition:"border-color .2s" }}
            onFocus={e=>e.target.style.borderColor=T.accent}
            onBlur={e=>e.target.style.borderColor=T.border}
          />
        </div>

        <div style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.12em", color:T.textLight, marginBottom:6, paddingLeft:3 }}>
          Saved Chats
        </div>
      </div>

      {/* Chat list */}
      <ul role="listbox" style={{ flex:1, overflowY:"auto", padding:"0 8px 16px", margin:0, listStyle:"none", scrollbarWidth:"thin", scrollbarColor:`${T.card} transparent` }}>
        {chats.length === 0 && (
          <li style={{ textAlign:"center", padding:"36px 14px", color:T.textLight, fontSize:12, lineHeight:1.7 }}>
            <div style={{ fontSize:26, marginBottom:8 }}>🐾</div>
            No saved chats yet.<br/>Send messages and hit Save.
          </li>
        )}
        {chats.map(chat => {
          const active = chat.id === activeId;
          return (
            <li key={chat.id} role="option" aria-selected={active}>
              <div style={{ display:"flex", alignItems:"stretch", borderRadius:T.rMd, marginBottom:2, background:active?T.card:"transparent", borderLeft:`3px solid ${active?T.accentDark:"transparent"}`, transition:"all .18s" }}
                onMouseEnter={e=>{ if(!active)(e.currentTarget as HTMLElement).style.background=T.bgSoft; }}
                onMouseLeave={e=>{ if(!active)(e.currentTarget as HTMLElement).style.background="transparent"; }}
              >
                <button onClick={()=>onSelect(chat.id)} style={{ flex:1, display:"flex", alignItems:"flex-start", gap:9, padding:"10px 10px 10px 12px", background:"none", border:"none", cursor:"pointer", textAlign:"left" }}>
                  <div style={{ width:34, height:34, borderRadius:"50%", background:active?T.accentDark:T.card, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:14, color:active?"#fff":T.accent, border:`1.5px solid ${active?T.accentDark:T.border}` }}>🐶</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:500, color:active?T.accentDark:T.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:140, fontFamily:T.fontBody, marginBottom:2 }}>{chat.title}</div>
                    <div style={{ fontSize:10, color:T.textLight, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:150 }}>{chat.preview}</div>
                  </div>
                </button>
                {/* Delete */}
                <button onClick={()=>onDelete(chat.id)} title="Delete chat" style={{ padding:"0 10px", background:"none", border:"none", cursor:"pointer", color:T.textLight, display:"flex", alignItems:"center", borderRadius:`0 ${T.rMd} ${T.rMd} 0`, transition:"color .15s" }}
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
      <div style={{ padding:"11px 16px", borderTop:`1px solid ${T.border}`, flexShrink:0, display:"flex", alignItems:"center", gap:9 }}>
        <div style={{ width:30, height:30, borderRadius:"50%", background:T.card, border:`1.5px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>🧑</div>
        <div>
          <div style={{ fontSize:12, fontWeight:500, color:T.text }}>You</div>
          <div style={{ fontSize:10, color:T.textLight }}>Dog owner</div>
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
    <header style={{ background:T.surface, borderBottom:`1px solid ${T.border}`, padding:"11px 16px", display:"flex", alignItems:"center", gap:10, flexShrink:0, boxShadow:T.shSm }}>
      <button onClick={onToggleSidebar} aria-label="Toggle sidebar" style={{ background:"none", border:"none", cursor:"pointer", color:T.textMid, display:"flex", alignItems:"center", padding:5, borderRadius:T.rSm, flexShrink:0, transition:"background .15s" }}
        onMouseEnter={e=>e.currentTarget.style.background=T.bgSoft}
        onMouseLeave={e=>e.currentTarget.style.background="none"}
      >
        <Icon.Menu />
      </button>

      <div style={{ width:36, height:36, borderRadius:9, background:T.accentDark, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>🐾</div>

      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontFamily:T.fontDisplay, fontSize:14, fontWeight:400, color:T.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
          {profile.breed ? `Paw Assistant · ${profile.breed}${profile.name ? ` · ${profile.name}` : ""}` : "Paw Assistant"}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:1 }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:isTyping?T.accent:T.teal, transition:"background .3s" }} />
          <span style={{ fontSize:10, color:T.textLight }}>{isTyping ? "Typing…" : "Breed-aware AI · online"}</span>
        </div>
      </div>

      {/* Save chat button */}
      <button
        onClick={onSave}
        title="Save this conversation"
        style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 13px", borderRadius:T.rPill, background:T.card, border:`1px solid ${T.border}`, fontFamily:T.fontBody, fontSize:11, fontWeight:500, color:T.accentDark, cursor:"pointer", transition:"all .2s", flexShrink:0 }}
        onMouseEnter={e=>{ e.currentTarget.style.background=T.accentDark; e.currentTarget.style.color="#fff"; e.currentTarget.style.borderColor=T.accentDark; }}
        onMouseLeave={e=>{ e.currentTarget.style.background=T.card; e.currentTarget.style.color=T.accentDark; e.currentTarget.style.borderColor=T.border; }}
      >
        <Icon.Save /> Save
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
    toast.addToast(`${em} Added`, "success");
  }

  return (
    <div
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>{ setHover(false); setShowReact(false); }}
      style={{ display:"flex", alignItems:"flex-end", gap:7, justifyContent:isUser?"flex-end":"flex-start", marginBottom:10, animation:"msgPop .25s ease", position:"relative" }}
    >
      {!isUser && (
        <div style={{ width:28, height:28, borderRadius:"50%", background:T.card, border:`1.5px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, flexShrink:0 }}>🐾</div>
      )}

      <div style={{ maxWidth:"72%", display:"flex", flexDirection:"column", alignItems:isUser?"flex-end":"flex-start", gap:4 }}>
        <div style={{ padding:"11px 15px", borderRadius:isUser?`${T.rLg} ${T.rLg} ${T.rSm} ${T.rLg}`:`${T.rLg} ${T.rLg} ${T.rLg} ${T.rSm}`, background:isUser?T.userBubble:T.botBubble, color:isUser?"#fff":T.text, border:isUser?"none":`1px solid ${T.border}`, fontSize:14, fontFamily:T.fontBody, boxShadow:isUser?`0 4px 12px rgba(127,85,57,.2)`:T.shSm, lineHeight:1.65 }}>
          <FormattedMessage text={message.text} isUser={isUser} />
        </div>

        {/* Reactions */}
        {reactions.length>0 && (
          <div style={{ display:"flex", gap:4, flexWrap:"wrap", paddingInline:4 }}>
            {reactions.map(r=>(
              <div key={r.emoji} style={{ display:"flex", alignItems:"center", gap:3, padding:"2px 7px", borderRadius:T.rPill, background:T.bgSoft, border:`1px solid ${T.border}`, fontSize:11, cursor:"pointer", transition:"all .15s" }}
                onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.background=T.card; }}
                onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.background=T.bgSoft; }}
              >
                {r.emoji}{r.count>1&&<span>{r.count}</span>}
              </div>
            ))}
          </div>
        )}

        {/* Meta row */}
        <div style={{ display:"flex", alignItems:"center", gap:6, paddingInline:4 }}>
          <span style={{ fontSize:10, color:T.textLight }}>{fmtTime(new Date(message.timestamp))}</span>
          {isUser && <span style={{ color:message.read?T.teal:T.textLight }}><Icon.DblChk /></span>}

          {/* Hover actions */}
          {hover && (
            <div style={{ display:"flex", gap:6, position:"relative" }}>
              <button onClick={copy} title="Copy" style={{ background:"none", border:"none", cursor:"pointer", fontSize:12, color:T.textMid, padding:0, lineHeight:1 }}>📋</button>
              {!isUser && (
                <div style={{ position:"relative" }}>
                  <button onClick={()=>setShowReact(v=>!v)} title="React" style={{ background:"none", border:"none", cursor:"pointer", fontSize:12, padding:0, lineHeight:1 }}>😊</button>
                  {showReact && (
                    <div style={{ position:"absolute", bottom:24, left:0, background:T.surface, border:`1px solid ${T.border}`, borderRadius:T.rMd, padding:"6px 8px", display:"flex", gap:4, zIndex:100, boxShadow:T.shMd, animation:"slideInUp .18s ease" }}>
                      {EMOJIS.map(em=>(
                        <button key={em} onClick={()=>addReaction(em)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:16, padding:"2px 3px", borderRadius:T.rSm, transition:"transform .1s" }}
                          onMouseEnter={e=>e.currentTarget.style.transform="scale(1.3)"}
                          onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
                        >{em}</button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {isUser && (
                <button onClick={()=>{ onRetry(message.text); toast.addToast("↩ Retrying…","info"); }} title="Resend" style={{ background:"none", border:"none", cursor:"pointer", fontSize:12, color:T.textMid, padding:0, lineHeight:1 }}>🔄</button>
              )}
            </div>
          )}
        </div>
      </div>

      {isUser && (
        <div style={{ width:28, height:28, borderRadius:"50%", background:T.card, border:`1.5px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, flexShrink:0 }}>🧑</div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DATE DIVIDER
═══════════════════════════════════════════════════════════ */
function DateDivider({ label }: { label:string }) {
  return (
    <div role="separator" style={{ display:"flex", alignItems:"center", gap:10, margin:"14px 0 8px", userSelect:"none" }}>
      <div style={{ flex:1, height:1, background:T.border }} />
      <span style={{ fontSize:10, fontWeight:500, color:T.textLight, padding:"2px 10px", borderRadius:T.rPill, background:T.bgSoft, border:`1px solid ${T.border}` }}>{label}</span>
      <div style={{ flex:1, height:1, background:T.border }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MESSAGE INPUT (emoji + voice)
═══════════════════════════════════════════════════════════ */
function MessageInput({ onSend, disabled }: { onSend:(t:string)=>void; disabled:boolean }) {
  const [text, setText]           = useState("");
  const [showEmoji, setEmoji]     = useState(false);
  const [isListening, setListen]  = useState(false);
  const textareaRef               = useRef<HTMLTextAreaElement>(null);
  const recogRef                  = useRef<any>(null);

  /* Voice */
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

  /* Auto-resize */
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120)+"px";
  }, [text]);

  const EMOJIS = ["🐾","🐶","🐕","🦮","🐩","😄","❤️","🎾","🦴","🌿","🍖","💡"];

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
    <div role="form" aria-label="Message composer" style={{ background:T.surface, borderTop:`1px solid ${T.border}`, padding:"9px 13px 11px", flexShrink:0, position:"relative" }}>

      {/* Emoji picker */}
      {showEmoji && (
        <div style={{ position:"absolute", bottom:"100%", left:13, background:T.surface, border:`1px solid ${T.border}`, borderRadius:T.rLg, padding:11, boxShadow:T.shMd, display:"flex", flexWrap:"wrap", gap:5, width:210, zIndex:10 }}>
          {EMOJIS.map(em=>(
            <button key={em} onClick={()=>setText(t=>t+em)} style={{ fontSize:19, background:"none", border:"none", cursor:"pointer", padding:"2px 3px", borderRadius:T.rSm, transition:"background .12s" }}
              onMouseEnter={e=>e.currentTarget.style.background=T.bgSoft}
              onMouseLeave={e=>e.currentTarget.style.background="none"}
            >{em}</button>
          ))}
        </div>
      )}

      <div style={{ display:"flex", gap:7, alignItems:"flex-end" }}>
        {/* Emoji btn */}
        <button onClick={()=>setEmoji(v=>!v)} aria-label="Emoji picker" aria-expanded={showEmoji}
          style={{ flexShrink:0, width:36, height:36, borderRadius:T.rMd, background:showEmoji?T.bgSoft:"none", border:`1px solid ${showEmoji?T.accent:T.border}`, color:T.textMid, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}>
          <Icon.Emoji />
        </button>

        {/* Voice btn */}
        <button onClick={toggleVoice} aria-label={isListening?"Stop recording":"Start voice input"}
          style={{ flexShrink:0, width:36, height:36, borderRadius:T.rMd, background:isListening?T.accentDark:"none", border:`1px solid ${isListening?T.accentDark:T.border}`, color:isListening?"#fff":T.textMid, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s", animation:isListening?"recPulse 1s ease-in-out infinite":"none" }}
          onMouseEnter={e=>{ if(!isListening){e.currentTarget.style.background=T.bgSoft;e.currentTarget.style.borderColor=T.accent;} }}
          onMouseLeave={e=>{ if(!isListening){e.currentTarget.style.background="none";e.currentTarget.style.borderColor=T.border;} }}
        >
          <Icon.Mic />
        </button>

        {/* Textarea */}
        <textarea ref={textareaRef} value={text} onChange={e=>setText(e.target.value)} onKeyDown={handleKey}
          placeholder={isListening ? "Listening… 🎧" : "Ask about nutrition, training, health…"}
          aria-label="Type a message" rows={1} disabled={disabled}
          style={{ flex:1, resize:"none", border:`1.5px solid ${T.border}`, borderRadius:T.rLg, padding:"9px 13px", fontFamily:T.fontBody, fontSize:13, color:T.text, background:T.bg, outline:"none", minHeight:40, maxHeight:120, lineHeight:1.55, transition:"border-color .2s", scrollbarWidth:"thin" }}
          onFocus={e=>e.target.style.borderColor=T.accent}
          onBlur={e=>e.target.style.borderColor=T.border}
        />

        {/* Send btn */}
        <button onClick={send} disabled={!text.trim()||disabled} aria-label="Send"
          style={{ flexShrink:0, width:40, height:40, borderRadius:"50%", background:text.trim()?T.accentDark:T.border, border:"none", color:"#fff", cursor:text.trim()?"pointer":"default", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s", boxShadow:text.trim()?`0 4px 14px rgba(127,85,57,.3)`:"none" }}
          onMouseEnter={e=>{ if(text.trim()) e.currentTarget.style.background=T.accent; }}
          onMouseLeave={e=>{ if(text.trim()) e.currentTarget.style.background=T.accentDark; }}
        >
          <Icon.Send />
        </button>
      </div>

      <p style={{ fontSize:10, color:T.textLight, textAlign:"center", marginTop:6, fontStyle:"italic" }}>
        Enter to send · Shift+Enter for new line · 🎤 for voice
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
    <main role="log" aria-label="Chat messages" aria-live="polite"
      style={{ flex:1, overflowY:"auto", padding:"14px 13px 8px", background:T.bgSoft, scrollbarWidth:"thin", scrollbarColor:`${T.card} transparent` }}
    >
      {messages.length === 0 && (
        <div style={{ textAlign:"center", padding:"56px 20px", display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
          <div style={{ fontSize:44 }}>🐾</div>
          <div style={{ fontFamily:T.fontDisplay, fontSize:17, fontWeight:400, color:T.accentDark }}>Hello! I'm Paw Assistant.</div>
          <p style={{ fontSize:13, color:T.textMid, maxWidth:300, lineHeight:1.7 }}>Fill in your dog's profile above, then ask me anything about food, health, training, or grooming.</p>
        </div>
      )}
      {grouped.map(item =>
        item.type==="divider"
          ? <DateDivider key={item.id} label={item.label} />
          : <MessageBubble key={item.id} message={item} onRetry={onRetry} />
      )}
      {isTyping && (
        <div style={{ display:"flex", alignItems:"flex-end", gap:7, marginBottom:10 }}>
          <div style={{ width:28, height:28, borderRadius:"50%", background:T.card, border:`1.5px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12 }}>🐾</div>
          <div style={{ padding:"11px 15px", borderRadius:`${T.rLg} ${T.rLg} ${T.rLg} ${T.rSm}`, background:T.botBubble, border:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:4, boxShadow:T.shSm }}>
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
    // Note: loadChat displays the snapshot; to resume a live chat
    // call clearChat() + replay msgs via sendToBot if your hook supports it
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

  /* ── Quick replies (only on empty live chat) ── */
  const quickReplies = isLiveView && rawMessages.length===0 ? DEFAULT_QUICK_REPLIES : [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300&family=DM+Sans:wght@300;400;500&display=swap');
        .bc-root*,.bc-root*::before,.bc-root*::after{box-sizing:border-box;margin:0;padding:0}
        @keyframes msgPop    { from{opacity:0;transform:scale(.94) translateY(5px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes typDot    { 0%,80%,100%{transform:translateY(0);opacity:.4} 40%{transform:translateY(-5px);opacity:1} }
        @keyframes slideInUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes recPulse  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(.96)} }
        @keyframes sbSlide   { from{transform:translateX(-100%)} to{transform:translateX(0)} }
        .bc-root ::-webkit-scrollbar{width:3px}
        .bc-root ::-webkit-scrollbar-thumb{background:${T.card};border-radius:3px}
        .bc-root :focus-visible{outline:2px solid ${T.accent};outline-offset:2px}
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
        <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, height:"100%", overflow:"hidden" }}>

          <Header isTyping={loading} onToggleSidebar={()=>setSidebarOpen(v=>!v)} onSave={saveChat} profile={dogProfile} />

          {/* Dog profile bar — uses your DogProfileBar if available, else inline */}
          <InlineDogProfileBar profile={dogProfile} onChange={setDogProfile} />

          {/* Read-only banner when viewing a saved chat */}
          {activeId && (
            <div style={{ background:T.card, borderBottom:`1px solid ${T.border}`, padding:"8px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span style={{ fontSize:12, color:T.accentDark, fontWeight:500 }}>📖 Viewing saved chat</span>
              <button onClick={newChat} style={{ fontSize:11, fontWeight:500, color:T.accentDark, background:"none", border:`1px solid ${T.border}`, borderRadius:T.rPill, padding:"4px 12px", cursor:"pointer", fontFamily:T.fontBody, transition:"all .15s" }}
                onMouseEnter={e=>{ e.currentTarget.style.background=T.accentDark; e.currentTarget.style.color="#fff"; }}
                onMouseLeave={e=>{ e.currentTarget.style.background="none"; e.currentTarget.style.color=T.accentDark; }}
              >
                ← Back to live chat
              </button>
            </div>
          )}

          <MessageList messages={viewMessages} isTyping={isLiveView && loading} bottomRef={bottomRef} onRetry={handleSend} />

          {/* Quick reply chips */}
          {quickReplies.length > 0 && (
            <div role="group" aria-label="Quick replies" style={{ display:"flex", gap:7, flexWrap:"wrap", padding:"8px 14px 2px", background:T.surface, borderTop:`1px solid ${T.border}` }}>
              {quickReplies.map(r=>(
                <button key={r} onClick={()=>handleSend(r)} disabled={loading}
                  style={{ padding:"5px 13px", borderRadius:T.rPill, border:`1.5px solid ${T.border}`, background:T.surface, fontFamily:T.fontBody, fontSize:11, fontWeight:500, color:T.accentDark, cursor:loading?"not-allowed":"pointer", transition:"all .18s", opacity:loading?.6:1 }}
                  onMouseEnter={e=>{ if(!loading){e.currentTarget.style.background=T.card;e.currentTarget.style.borderColor=T.accent;} }}
                  onMouseLeave={e=>{ e.currentTarget.style.background=T.surface;e.currentTarget.style.borderColor=T.border; }}
                >
                  {r}
                </button>
              ))}
            </div>
          )}

          {/* Input (disabled when viewing saved chat) */}
          {isLiveView && <MessageInput onSend={handleSend} disabled={loading} />}

          {!isLiveView && (
            <div style={{ padding:"12px 16px", background:T.surface, borderTop:`1px solid ${T.border}`, textAlign:"center" }}>
              <button onClick={newChat} style={{ padding:"9px 24px", borderRadius:T.rPill, background:T.accentDark, color:"#fff", border:"none", fontFamily:T.fontBody, fontSize:13, fontWeight:500, cursor:"pointer", transition:"all .2s" }}
                onMouseEnter={e=>e.currentTarget.style.background=T.accent}
                onMouseLeave={e=>e.currentTarget.style.background=T.accentDark}
              >
                Start new conversation →
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
