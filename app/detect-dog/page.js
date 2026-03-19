"use client";

import { useRef, useState, useEffect } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";

export default function DetectDog(){

const videoRef = useRef(null);
const canvasRef = useRef(null);
const imageRef = useRef(null);

const [model,setModel] = useState(null);
const [result,setResult] = useState("");
const [loading,setLoading] = useState(true);


// Load AI model automatically
useEffect(() => {

const loadModel = async () => {

try{

await tf.ready();

const loadedModel = await mobilenet.load({
version:2,
alpha:1.0
});

setModel(loadedModel);
setLoading(false);

}catch(error){

console.error("Model load error:",error);

}

};

loadModel();

}, []);


// Start camera
const startCamera = async () => {

const stream = await navigator.mediaDevices.getUserMedia({video:true});

videoRef.current.srcObject = stream;

};


// Capture photo
const capturePhoto = () => {

const video = videoRef.current;
const canvas = canvasRef.current;

canvas.width = video.videoWidth;
canvas.height = video.videoHeight;

const ctx = canvas.getContext("2d");
ctx.drawImage(video,0,0);

};


// Upload image
const uploadImage = (e) => {

const file = e.target.files[0];

if(file){
const url = URL.createObjectURL(file);
imageRef.current.src = url;
}

};


// Detect dog
const detectDog = async () => {

if(!model){
alert("Model still loading");
return;
}

let predictions;

if(imageRef.current.src){
predictions = await model.classify(imageRef.current);
}else{
predictions = await model.classify(canvasRef.current);
}

setResult(
predictions.map(p => `${p.className} (${(p.probability*100).toFixed(1)}%)`).join(", ")
);

};


return(
    
<div

  style={{
    maxWidth: "600px",
    margin: "50px auto",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    backgroundColor: "#fff",
    textAlign: "center",
    fontFamily: "'Fredoka', sans-serif"
  }}
>
    <img
            src="/assets/download-removebg-preview.png"
            alt="Peeking Puppies"
            className="puppy-top"
          />
  <h1 style={{ marginBottom: "10px" }}>Breed Identify</h1>

  <p style={{ color: "#555", fontSize: "14px", marginBottom: "20px" }}>
    Use the power of AI to identify dogs in photos or live camera feed. Capture images or upload photos, then let the AI tell you which dog breed it is!
  </p>

  {loading && <p style={{ color: "#555" }}>Loading AI Model...</p>}

  {/* Vertical Flex Container */}
  <div
    style={{
      display: "flex",
      flexDirection: "column",  // changed from row to column
      gap: "30px",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap"
    }}
  >
    {/* Camera Section */}
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
      <button
        onClick={startCamera}
        style={{
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#A67B5B",
          color: "#fff",
          cursor: "pointer",
          fontWeight: "bold",
          transition: "background 0.3s"
        }}
        onMouseEnter={e => e.target.style.backgroundColor = "#d58d56"}
        onMouseLeave={e => e.target.style.backgroundColor = "#A67B5B"}
      >
        Start Camera
      </button>

      <video
        ref={videoRef}
        autoPlay
        style={{ width: "300px", borderRadius: "10px", boxShadow:" rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px" }}
      />

      <button
        onClick={capturePhoto}
        style={{
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#A67B5B",
          color: "#fff",
          cursor: "pointer",
          fontWeight: "bold",
          transition: "background 0.3s"
        }}
        onMouseEnter={e => e.target.style.backgroundColor = "#d58d56"}
        onMouseLeave={e => e.target.style.backgroundColor = "#A67B5B"}
      >
        Capture Photo
      </button>

      <canvas
        ref={canvasRef}
        style={{ width: "300px", borderRadius: "10px",boxShadow:" rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px" }}
      />
    </div>

    {/* Upload Section */}
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
      <h3 style={{ margin: "0 0 10px 0" }}>OR Upload Dog Photo</h3>

      <input
        type="file"
        accept="image/*"
        onChange={uploadImage}
        style={{ padding: "8px", borderRadius: "6px", border: "1px solid #A67B5B",fontFamily: "'Fredoka', sans-serif" }}
      />

      <img
        ref={imageRef}
        alt="Uploaded Dog"
        style={{ width: "200px", minHeight:"30px",maxHeight:"250px",borderRadius: "5px", boxShadow:" rgba(0, 0, 0, 0.25) 0px 14px 28px" }}
      />

      <button
        onClick={detectDog}
        style={{
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#A67B5B",
          color: "#fff",
          cursor: "pointer",
          fontWeight: "bold",
          transition: "background 0.3s",
          marginTop: "10px"
        }}
        onMouseEnter={e => e.target.style.backgroundColor = "#d58d56"}
        onMouseLeave={e => e.target.style.backgroundColor = "#A67B5B"}
      >
        Detect Dog
      </button>

      <h2 style={{ marginTop: "20px", color: "#333" }}>{result}</h2>
    </div>
  </div>
</div>
);
}