"use client";
import { useRef, useState, useEffect } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import "./detect.css";

export default function DetectDog() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const [model, setModel] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(true);
  const [detecting, setDetecting] = useState(false);
  const [mode, setMode] = useState("camera"); // camera or upload

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        const loadedModel = await mobilenet.load({ version: 2, alpha: 1.0 });
        setModel(loadedModel);
        setLoading(false);
      } catch (error) {
        console.error("Model load error:", error);
      }
    };
    loadModel();
  }, []);

  const startCamera = async () => {
    setMode("camera");
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  const captureAndDetect = async () => {
    setDetecting(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const predictions = await model.classify(canvas);
    setResult(predictions);
    setDetecting(false);
  };

  const uploadImage = (e) => {
    setMode("upload");
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      imageRef.current.src = url;
      setResult("");
    }
  };

  const detectUploaded = async () => {
    setDetecting(true);
    const predictions = await model.classify(imageRef.current);
    setResult(predictions);
    setDetecting(false);
  };

  return (
    <main className="detect-page">
      <div className="detect-container">
        <header>
          <h1>Breed <em>Identify</em></h1>
          <p className="subtitle">Our Neural Network analyzes 1,000+ traits to identify your dog's lineage.</p>
        </header>

        {loading ? (
          <div className="loading-state">
            <p>Initializing AI Vision Engine...</p>
          </div>
        ) : (
          <div className="detect-grid">
            {/* Live Camera Lab */}
            <div className="media-box">
              <h3 style={{fontFamily: 'Fraunces'}}>Vision Lab</h3>
              <video ref={videoRef} autoPlay className="preview-window" />
              <canvas ref={canvasRef} style={{ display: "none" }} />
              <div style={{width: '100%', display: 'flex', gap: '10px'}}>
                <button onClick={startCamera} className="ai-btn ai-btn-secondary">Enable Camera</button>
                <button onClick={captureAndDetect} className="ai-btn ai-btn-primary">Scan Live</button>
              </div>
            </div>

            {/* Upload Lab */}
            <div className="media-box">
              <h3 style={{fontFamily: 'Fraunces'}}>Upload Lab</h3>
              <div className="preview-window" style={{background: '#F0E6D8', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <img ref={imageRef} alt="" style={{maxWidth: '100%', maxHeight: '100%'}} />
              </div>
              <input type="file" accept="image/*" onChange={uploadImage} id="file-up" style={{display: 'none'}} />
              <div style={{width: '100%', display: 'flex', gap: '10px'}}>
                <label htmlFor="file-up" className="ai-btn ai-btn-secondary" style={{textAlign: 'center', cursor: 'pointer'}}>Select Photo</label>
                <button onClick={detectUploaded} className="ai-btn ai-btn-primary">Analyze Photo</button>
              </div>
            </div>

            {/* AI Analysis Result */}
            {(result || detecting) && (
              <div className="result-area">
                <span className="result-tag">AI Analysis Report</span>
                {detecting ? (
                  <h2 style={{fontFamily: 'Fraunces'}}>Scanning biometric data...</h2>
                ) : (
                  <div>
                    <h2 style={{fontFamily: 'Fraunces', color: '#A3B18A'}}>
                        Matches Found: {result[0].className.split(',')[0]}
                    </h2>
                    <p style={{fontSize: '0.9rem', color: '#666', marginTop: '10px'}}>
                      Confidence Level: {(result[0].probability * 100).toFixed(1)}%
                    </p>
                    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '15px'}}>
                        {result.slice(1,3).map(p => (
                            <span key={p.className} style={{fontSize: '0.75rem', background: '#fff', padding: '4px 10px', borderRadius: '5px'}}>
                                {p.className.split(',')[0]}
                            </span>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}