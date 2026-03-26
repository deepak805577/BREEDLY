"use client"

import { useRef, useState, useEffect, useCallback } from "react"
const API_URL =
  process.env.NEXT_PUBLIC_AI_API_URL || "http://localhost:5001"
// ── Mood metadata ────────────────────────────────────────────────────────────
const MOODS = {
  Alert: {
    emoji: "👀",
    color: "#E8A838",
    bg: "#FDF3DC",
    border: "#F0C060",
    desc: "Your dog noticed something! They're on high alert — check the surroundings.",
    intensity: 85,
  },
  Happy: {
    emoji: "🐾",
    color: "#6AAF7A",
    bg: "#EAF5ED",
    border: "#8FCC9E",
    desc: "Tail-wagging energy! Your pup is in a great mood right now.",
    intensity: 92,
  },
  Fear: {
    emoji: "😟",
    color: "#7B9ED4",
    bg: "#EBF1FA",
    border: "#A4C0E8",
    desc: "Your dog seems anxious or scared. Give them comfort and a safe space.",
    intensity: 70,
  },
  Aggressive: {
    emoji: "⚡",
    color: "#D96B5A",
    bg: "#FAECEA",
    border: "#E89A8E",
    desc: "High tension detected. Keep calm and give your dog some space.",
    intensity: 78,
  },
  Attention: {
    emoji: "🗣️",
    color: "#A67B5B",
    bg: "#F5EDE3",
    border: "#C8A07A",
    desc: "\"Hey, look at me!\" Your dog wants your attention right now.",
    intensity: 65,
  },
}

// ── Waveform bars component (canvas-based) ───────────────────────────────────
function WaveformCanvas({ analyser, isRecording }) {
  const canvasRef = useRef(null)
  const rafRef    = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const W = canvas.width
    const H = canvas.height

    function drawIdle() {
      ctx.clearRect(0, 0, W, H)
      const barCount = 40
      const barW = 3
      const gap = (W - barCount * barW) / (barCount + 1)
      for (let i = 0; i < barCount; i++) {
        const x = gap + i * (barW + gap)
        const h = 4 + Math.sin(Date.now() / 800 + i * 0.4) * 3
        ctx.fillStyle = "rgba(176,137,104,0.25)"
        ctx.beginPath()
        ctx.roundRect(x, H / 2 - h / 2, barW, h, 2)
        ctx.fill()
      }
      rafRef.current = requestAnimationFrame(drawIdle)
    }

    function drawLive() {
      if (!analyser) return
      const bufferLen = analyser.frequencyBinCount
      const dataArr   = new Uint8Array(bufferLen)
      analyser.getByteFrequencyData(dataArr)

      ctx.clearRect(0, 0, W, H)
      const barCount = 40
      const barW = 3
      const gap = (W - barCount * barW) / (barCount + 1)
      const step = Math.floor(bufferLen / barCount)

      for (let i = 0; i < barCount; i++) {
        const val = dataArr[i * step] / 255
        const h   = Math.max(4, val * H * 0.85)
        const x   = gap + i * (barW + gap)
        const alpha = 0.5 + val * 0.5
        ctx.fillStyle = `rgba(127,85,57,${alpha})`
        ctx.beginPath()
        ctx.roundRect(x, H / 2 - h / 2, barW, h, 2)
        ctx.fill()
      }
      rafRef.current = requestAnimationFrame(drawLive)
    }

    cancelAnimationFrame(rafRef.current)
    if (isRecording && analyser) drawLive()
    else drawIdle()

    return () => cancelAnimationFrame(rafRef.current)
  }, [isRecording, analyser])

  return (
    <canvas
      ref={canvasRef}
      width={280}
      height={60}
      style={{ display: "block", margin: "0 auto" }}
    />
  )
}

// ── Timer display ────────────────────────────────────────────────────────────
function useTimer(running) {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    if (!running) { setSeconds(0); return }
    const id = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [running])
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0")
  const ss = String(seconds % 60).padStart(2, "0")
  return `${mm}:${ss}`
}

// ── Main component ───────────────────────────────────────────────────────────
// States: "idle" | "recording" | "analyzing" | "result" | "error"
export default function BarkAnalyzer() {
  const mediaRecorderRef = useRef(null)
  const audioChunksRef   = useRef([])
  const analyserRef      = useRef(null)
  const streamRef        = useRef(null)

  const [state,   setState]   = useState("idle")    // "idle"|"recording"|"analyzing"|"result"|"error"
  const [result,  setResult]  = useState(null)       // key of MOODS
  const [errMsg,  setErrMsg]  = useState("")

  const timer = useTimer(state === "recording")

const audioContextRef = useRef(null)

const startRecording = useCallback(async () => {
  audioChunksRef.current = []

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    streamRef.current = stream

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    audioContextRef.current = audioCtx

    const source = audioCtx.createMediaStreamSource(stream)
    const analyser = audioCtx.createAnalyser()
    analyser.fftSize = 128

    source.connect(analyser)
    analyserRef.current = analyser

    const mr = new MediaRecorder(stream)
    mediaRecorderRef.current = mr

    mr.ondataavailable = e => {
      if (e.data.size > 0) {
        audioChunksRef.current.push(e.data)
      }
    }

    mr.start()
    setState("recording")

  } catch (err) {
    setErrMsg("Microphone access denied. Please allow microphone permissions.")
    setState("error")
  }
}, [])
const stopRecording = useCallback(() => {
  const mr = mediaRecorderRef.current
  if (!mr || mr.state === "inactive") return

  mr.onstop = async () => {
    try {
      streamRef.current?.getTracks().forEach(t => t.stop())
      analyserRef.current = null
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
  audioContextRef.current.close()
}

      if (audioChunksRef.current.length === 0) {
        throw new Error("No audio recorded")
      }

      setState("analyzing")

      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
      const formData = new FormData()
      formData.append("audio", audioBlob, "bark.webm")

      const res = await fetch(`${API_URL}/predict-bark`, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`)
      }

      const data = await res.json()

      if (!data.meaning) {
        throw new Error("Invalid response from server")
      }

      setResult(data.meaning)
      setState("result")

    } catch (err) {
      setErrMsg(err.message || "Analysis failed. Please try again.")
      setState("error")
    }

    audioChunksRef.current = []
  }

  mr.stop()
}, [])

  // ── Reset ──
  const reset = useCallback(() => {
  analyserRef.current = null
  streamRef.current?.getTracks().forEach(t => t.stop())
if (audioContextRef.current && audioContextRef.current.state !== "closed") {
  audioContextRef.current.close()
}

  setResult(null)
  setErrMsg("")
  setState("idle")
}, [])
  const mood = result ? MOODS[result] : null
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:          #F5EFE6;
          --bg-soft:     #EFE7DB;
          --card:        #FAF7F2;
          --card-inner:  #F0E6D8;
          --accent:      #B08968;
          --accent-dark: #7F5539;
          --text:        #3E3E3E;
          --text-mid:    #6F6F6F;
          --text-light:  #9A9A9A;
          --border:      rgba(176,137,104,0.20);
          --radius-xl:   24px;
          --radius-lg:   16px;
          --radius-md:   12px;
          --radius-pill: 999px;
          --shadow:      0 8px 32px rgba(100,70,40,0.08);
          --shadow-lg:   0 20px 60px rgba(100,70,40,0.14);
          --ease:        all 0.30s cubic-bezier(0.4,0,0.2,1);
        }

        body {
          font-family: 'DM Sans', system-ui, sans-serif;
          background: var(--bg);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        /* ── Page enter animation ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .bark-card { animation: fadeUp 0.5s ease both; }

        /* ── Pulsing ring when recording ── */
        @keyframes pulseRing {
          0%   { box-shadow: 0 0 0 0 rgba(127,85,57,0.30); }
          70%  { box-shadow: 0 0 0 14px rgba(127,85,57,0); }
          100% { box-shadow: 0 0 0 0 rgba(127,85,57,0); }
        }
        .recording-btn { animation: pulseRing 1.4s ease infinite; }

        /* ── Spinner for analyzing ── */
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 36px; height: 36px;
          border: 3px solid var(--card-inner);
          border-top-color: var(--accent-dark);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto;
        }

        /* ── Result card slide-in ── */
        @keyframes resultIn {
          from { opacity: 0; transform: scale(0.94) translateY(10px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        .result-card { animation: resultIn 0.4s cubic-bezier(0.34,1.1,0.64,1) both; }

        /* ── Intensity bar fill ── */
        @keyframes barGrow { from { width: 0; } }
        .bar-fill { animation: barGrow 0.7s 0.2s cubic-bezier(0.4,0,0.2,1) both; }

        /* ── Buttons ── */
        .btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          padding: 13px 28px;
          border-radius: var(--radius-pill);
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 500;
          cursor: pointer;
          transition: var(--ease);
          letter-spacing: 0.02em;
          white-space: nowrap;
        }
        .btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .btn-primary {
          background: var(--accent-dark);
          color: #FAF7F2;
        }
        .btn-primary:not(:disabled):hover {
          background: var(--accent);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(127,85,57,0.22);
        }
        .btn-primary:not(:disabled):active { transform: scale(0.97); }

        .btn-stop {
          background: #FAF7F2;
          color: var(--accent-dark);
          border: 1.5px solid rgba(127,85,57,0.30);
        }
        .btn-stop:not(:disabled):hover {
          background: var(--card-inner);
          border-color: var(--accent);
          transform: translateY(-2px);
        }

        .btn-ghost {
          background: transparent;
          color: var(--text-light);
          border: 1.5px solid var(--border);
          padding: 10px 22px;
          font-size: 13px;
        }
        .btn-ghost:hover { color: var(--accent-dark); border-color: var(--accent); background: var(--card-inner); }
      `}</style>

      <div className="bark-card" style={{
        background: "var(--card)",
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-lg)",
        width: "100%",
        maxWidth: 420,
        overflow: "hidden",
      }}>

        {/* ── Header ── */}
        <div style={{
          background: "linear-gradient(135deg, #F0E6D8 0%, #E8D8C4 50%, #DFC9AE 100%)",
          padding: "28px 28px 22px",
          position: "relative",
          overflow: "hidden",
          borderBottom: "1px solid var(--border)",
        }}>
          {/* Subtle dot pattern */}
          <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.18, pointerEvents:"none" }}>
            <defs>
              <pattern id="hdots" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.2" fill="#7F5539"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hdots)"/>
          </svg>

          <div style={{ position:"relative", zIndex:1 }}>
            <div style={{
              display: "inline-flex", alignItems:"center", gap:6,
              background:"rgba(127,85,57,0.12)",
              borderRadius:"var(--radius-pill)",
              padding:"4px 14px",
              marginBottom:12,
            }}>
              <span style={{ fontSize:12 }}>🎙️</span>
              <span style={{ fontFamily:"'DM Sans'", fontSize:11, fontWeight:500, color:"var(--accent-dark)", letterSpacing:"0.08em", textTransform:"uppercase" }}>
                Bark Analyser
              </span>
            </div>
            <h1 style={{
              fontFamily:"'Fraunces', serif",
              fontSize:26, fontWeight:300,
              color:"var(--accent-dark)",
              lineHeight:1.25,
              marginBottom:6,
            }}>
              What is your dog<br/><em>trying to say?</em>
            </h1>
            <p style={{ fontSize:13, color:"var(--text-mid)", lineHeight:1.65, fontWeight:300 }}>
              Record a bark and our AI decodes the emotion behind it.
            </p>
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ padding:"24px 28px 30px" }}>

          {/* ── IDLE / RECORDING / ANALYZING ── */}
          {state !== "result" && state !== "error" && (
            <>
              {/* Waveform area */}
              <div style={{
                background:"var(--bg-soft)",
                borderRadius:"var(--radius-lg)",
                border:"1px solid var(--border)",
                padding:"18px 20px",
                marginBottom:20,
                position:"relative",
                overflow:"hidden",
              }}>
                {/* Recording indicator dot */}
                {state === "recording" && (
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
                    <span style={{ width:8, height:8, borderRadius:"50%", background:"#D96B5A", display:"inline-block", animation:"pulseRing 1.4s ease infinite" }}/>
                    <span style={{ fontSize:11, fontWeight:500, color:"#D96B5A", letterSpacing:"0.06em", textTransform:"uppercase" }}>
                      Recording — {timer}
                    </span>
                  </div>
                )}

                {state === "idle" && (
                  <p style={{ fontSize:12, color:"var(--text-light)", marginBottom:10, textAlign:"center", letterSpacing:"0.04em" }}>
                    Press record to begin
                  </p>
                )}

                {state === "analyzing" && (
                  <p style={{ fontSize:12, color:"var(--text-mid)", marginBottom:10, textAlign:"center" }}>
                    Analysing your dog's bark…
                  </p>
                )}

                {state === "analyzing"
                  ? <div className="spinner" />
                  : <WaveformCanvas analyser={analyserRef.current} isRecording={state === "recording"} />
                }
              </div>

              {/* Buttons */}
              <div style={{ display:"flex", gap:10 }}>
                <button
                  className={`btn btn-primary${state === "recording" ? " recording-btn" : ""}`}
                  onClick={startRecording}
                  disabled={state === "recording" || state === "analyzing"}
                  style={{ flex:1 }}
                >
                  {state === "recording" ? <>🔴 Recording…</> : <>🎙️ Start</>}
                </button>
                <button
                  className="btn btn-stop"
                  onClick={stopRecording}
                  disabled={state !== "recording"}
                  style={{ flex:1 }}
                >
                  ⏹ Stop &amp; Analyse
                </button>
              </div>

              {/* Mood legend */}
              <div style={{ marginTop:20, display:"flex", flexWrap:"wrap", gap:6, justifyContent:"center" }}>
                {Object.entries(MOODS).map(([key, m]) => (
                  <span key={key} style={{
                    fontSize:11, fontWeight:500,
                    padding:"3px 11px",
                    borderRadius:"var(--radius-pill)",
                    background:m.bg,
                    color:m.color,
                    border:`1px solid ${m.border}`,
                    letterSpacing:"0.02em",
                  }}>
                    {m.emoji} {key}
                  </span>
                ))}
              </div>
            </>
          )}

          {/* ── RESULT ── */}
          {state === "result" && mood && (
            <div className="result-card">
              {/* Mood badge */}
              <div style={{
                background:mood.bg,
                border:`1.5px solid ${mood.border}`,
                borderRadius:"var(--radius-lg)",
                padding:"22px 20px",
                marginBottom:16,
                textAlign:"center",
              }}>
                <div style={{ fontSize:52, marginBottom:10, lineHeight:1 }}>{mood.emoji}</div>
                <div style={{
                  fontFamily:"'Fraunces', serif",
                  fontSize:28, fontWeight:300,
                  color:mood.color,
                  marginBottom:4,
                }}>
                  {result}
                </div>
                <p style={{ fontSize:13, color:"var(--text-mid)", lineHeight:1.65, fontWeight:300, maxWidth:280, margin:"0 auto" }}>
                  {mood.desc}
                </p>
              </div>

              {/* Confidence meter */}
              <div style={{ marginBottom:20 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ fontSize:11, color:"var(--text-light)", letterSpacing:"0.07em", textTransform:"uppercase" }}>
                    Confidence
                  </span>
                  <span style={{ fontSize:11, fontWeight:500, color:mood.color }}>
                    {mood.intensity}%
                  </span>
                </div>
                <div style={{ height:6, background:"var(--bg-soft)", borderRadius:3, overflow:"hidden" }}>
                  <div
                    className="bar-fill"
                    style={{
                      height:"100%",
                      width:`${mood.intensity}%`,
                      background:`linear-gradient(90deg, ${mood.border}, ${mood.color})`,
                      borderRadius:3,
                    }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div style={{ display:"flex", gap:10 }}>
                <button className="btn btn-primary" onClick={reset} style={{ flex:1 }}>
                  🎙️ Record Again
                </button>
                <button className="btn btn-ghost" onClick={reset}>
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* ── ERROR ── */}
          {state === "error" && (
            <div style={{
              background:"#FDF0EF",
              border:"1px solid #F5C8C4",
              borderRadius:"var(--radius-lg)",
              padding:"18px 20px",
              marginBottom:16,
              textAlign:"center",
            }}>
              <div style={{ fontSize:32, marginBottom:10 }}>😕</div>
              <div style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:300, color:"#C0635A", marginBottom:6 }}>
                Something went wrong
              </div>
              <p style={{ fontSize:13, color:"#C0635A", lineHeight:1.6, marginBottom:16 }}>
                {errMsg}
              </p>
              <button className="btn btn-primary" onClick={reset}>
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}