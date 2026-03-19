"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../../lib/supabase";
import StepWelcome  from "./StepWelcome";
import StepDogName  from "./StepDogName";
import StepBreed    from "./StepBreed";
import StepDogAge   from "./StepDogAge";
import StepDogPhoto from "./StepDogPhoto";
import StepDone     from "./StepDone";

const TOTAL_STEPS = 5;

export default function OnboardingFlow({ onComplete }) {
  const { user, updateProfile } = useAuth();
  const [step,    setStep]    = useState(0);
  const [saving,  setSaving]  = useState(false);
  const [data,    setData]    = useState({
    full_name:      "",
    dog_name:       "",
    primary_breed:  "",
    dog_age:        "",
    dog_photo_url:  null,
    dog_photo_file: null,
  });

  const update = (fields) => setData(prev => ({ ...prev, ...fields }));

  const next = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
  const back = () => setStep(s => Math.max(s - 1, 0));

  async function handleFinish() {
    setSaving(true);
    try {
      let dog_photo_url = data.dog_photo_url;

      // Upload dog photo if provided
      if (data.dog_photo_file) {
        const file     = data.dog_photo_file;
        const ext      = file.name.split(".").pop();
        const filePath = `dogs/${user.id}.${ext}`;

        const { error: uploadErr } = await supabase.storage
          .from("community-posts")
          .upload(filePath, file, { upsert: true });

        if (!uploadErr) {
          const { data: urlData } = supabase.storage
            .from("community-posts")
            .getPublicUrl(filePath);
          dog_photo_url = urlData.publicUrl;
        }
      }

      await updateProfile({
        full_name:     data.full_name     || null,
        dog_name:      data.dog_name      || null,
        primary_breed: data.primary_breed || null,
        dog_age:       data.dog_age       ? parseInt(data.dog_age) : null,
        dog_photo_url: dog_photo_url      || null,
      });

      onComplete?.();
    } catch (err) {
      console.error("Onboarding save failed:", err);
    } finally {
      setSaving(false);
    }
  }

  const steps = [
    <StepWelcome  key={0} onNext={next} />,
    <StepDogName  key={1} data={data} update={update} onNext={next} onBack={back} />,
    <StepBreed    key={2} data={data} update={update} onNext={next} onBack={back} />,
    <StepDogAge   key={3} data={data} update={update} onNext={next} onBack={back} />,
    <StepDogPhoto key={4} data={data} update={update} onNext={next} onBack={back} />,
    <StepDone     key={5} data={data} onFinish={handleFinish} saving={saving} />,
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka+One&display=swap');
        .onboarding * { box-sizing: border-box; margin: 0; padding: 0; }
        .onboarding {
          font-family: 'Nunito', sans-serif;
          min-height: 100vh;
          background: #FBF2F8;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px 20px;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(32px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .step-enter { animation: slideIn 0.3s ease forwards; }
      `}</style>

      <div className="onboarding">
        {/* Progress bar — hide on welcome and done screens */}
        {step > 0 && step < TOTAL_STEPS && (
          <div style={{ width: "100%", maxWidth: 420, marginBottom: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#9B8AAB", fontFamily: "'Nunito', sans-serif" }}>
                Step {step} of {TOTAL_STEPS - 1}
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#3B4FC8", fontFamily: "'Nunito', sans-serif" }}>
                {Math.round((step / (TOTAL_STEPS - 1)) * 100)}%
              </span>
            </div>
            <div style={{ height: 6, background: "#EDD8F5", borderRadius: 99, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${(step / (TOTAL_STEPS - 1)) * 100}%`,
                background: "linear-gradient(90deg, #3B4FC8, #7B5EA7)",
                borderRadius: 99,
                transition: "width 0.4s ease",
              }} />
            </div>
          </div>
        )}

        {/* Step card */}
        <div
          key={step}
          className="step-enter"
          style={{ width: "100%", maxWidth: 420 }}
        >
          {steps[step]}
        </div>
      </div>
    </>
  );
}
