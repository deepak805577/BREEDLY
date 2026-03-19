"use client"

import { useRef, useState } from "react"

export default function BarkAnalyzer(){

const mediaRecorderRef = useRef(null)
const audioChunksRef = useRef([])
const [result,setResult] = useState("")

const startRecording = async () => {

const stream = await navigator.mediaDevices.getUserMedia({audio:true})

mediaRecorderRef.current = new MediaRecorder(stream)

mediaRecorderRef.current.start()

mediaRecorderRef.current.ondataavailable = (e)=>{
audioChunksRef.current.push(e.data)
}

}

const stopRecording = () => {

mediaRecorderRef.current.stop()
mediaRecorderRef.current.onstop = async () => {

  const audioBlob = new Blob(audioChunksRef.current)

  const formData = new FormData()
  formData.append("audio", audioBlob)

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_AI_API_URL}/predict-bark`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("API failed");

    const data = await res.json(); // ✅ ONLY THIS
    setResult(data.meaning);

  } catch (err) {
    console.error("Error:", err);
  }

  audioChunksRef.current = []

}

}

return(
<div
  style={{
    maxWidth: "400px",
    margin: "50px auto",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    backgroundColor: "#fff",
    textAlign: "center",
    fontFamily: "'Fredoka', sans-serif",
  }}
>
    <img
            src="/assets/download-removebg-preview.png"
            alt="Peeking Puppies"
            className="puppy-top"
            style={{ width: "250px"}}
          />
  <h1 style={{ marginBottom: "30px",marginTop: "10px" }}>Bark Sound Analyzer</h1>

  <p style={{ color: "#555", fontSize: "14px", marginBottom: "20px" }}>
    Record your dog's bark and let AI analyze it to detect mood, emotions, or alert signals.
  </p>

  <div style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "center" }}>
    <button
      onClick={startRecording}
      style={{
        padding: "10px 20px",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "#e59f69",
        color: "#fff",
        cursor: "pointer",
        fontWeight: "bold",
        width: "180px",
        transition: "background 0.3s",
      }}
      onMouseEnter={e => (e.target.style.backgroundColor = "#ad7c56")}
      onMouseLeave={e => (e.target.style.backgroundColor = "#e59f69")}
    >
      Start Recording
    </button>

    <button
      onClick={stopRecording}
      style={{
        padding: "10px 20px",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "#A67B5B",
        color: "#fff",
        cursor: "pointer",
        fontWeight: "bold",
        width: "180px",
        transition: "background 0.3s",
      }}
      onMouseEnter={e => (e.target.style.backgroundColor = "#e9b994")}
      onMouseLeave={e => (e.target.style.backgroundColor = "#A67B5B")}
    >
      Stop Recording
    </button>

    <h2 style={{ marginTop: "20px", color: "#a67254" }}>{result}</h2>
  </div>
</div>
)

}