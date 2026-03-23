"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function HomePage() {
  const [aiTyped, setAiTyped] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiDone, setAiDone] = useState(false);
 
/* ─── Static data ─────────────────────────────────────────────────────────── */
const BREED_PREVIEWS = [
  { name: "Golden Retriever", energy: "High",   size: "Large",  grooming: "Medium", match: 94, emoji: "🦮" },
  { name: "Shih Tzu",         energy: "Low",    size: "Small",  grooming: "High",   match: 88, emoji: "🐩" },
  { name: "Beagle",           energy: "High",   size: "Medium", grooming: "Low",    match: 81, emoji: "🐕" },
];
 
const CARE_TOPICS = [
  { icon: "🥗", title: "Nutrition", desc: "Right food by breed size & age.",       href: "/care/nutrition", tag: "Food"       },
  { icon: "🩺", title: "Health",    desc: "Vaccines, deworming & vet visits.",      href: "/care/health",   tag: "Preventive" },
  { icon: "🐕", title: "Training",  desc: "Reward-based methods that truly work.", href: "/care/training", tag: "Behaviour"  },
];
 
const COMMUNITY_POSTS = [
  { avatar: "R", name: "Riya M.",  time: "2h ago", text: "My Golden finally learned 'stay' after 3 weeks 🎉 Positive reinforcement really works!", tags: ["Training","Golden"] },
  { avatar: "A", name: "Aarav K.", time: "5h ago", text: "First walk with Bruno today — couldn't stop smiling the whole time 🐾",                  tags: ["FirstDog"]          },
  { avatar: "P", name: "Priya S.", time: "1d ago", text: "Any grooming tips for long-coat breeds? Getting tangled fast in monsoon season.",         tags: ["Grooming","Help"]   },
];
 
const CARE_TIPS = [
  { title: "Balanced Nutrition", text: "Breed size and age decide portion size and food type.", icon: "🥗" },
  { title: "Preventive Health",  text: "Vaccination and deworming prevent long-term issues.",  icon: "🩺" },
  { title: "Positive Training",  text: "Reward-based training builds trust and confidence.",   icon: "🐕" },
  { title: "Daily Exercise",     text: "Even 30 minutes of movement improves mood and health.",icon: "🏃" },
];
 
const PUPHUB_TOOLS = [
  {
    icon: "📸",
    title: "Breed Identifier",
    desc: "Upload a photo of any dog and our AI instantly identifies the breed, traits, and care needs.",
    badge: "AI Vision",
    badgeColor: "teal",
    href: "/puphub/breed-identifier",
    demo: "Upload photo → Get breed in seconds",
    demoIcon: "🔍",
  },
  {
    icon: "🎙️",
    title: "Bark Analyser",
    desc: "Record your dog's bark and let AI decode what they're trying to tell you — stress, play, alert and more.",
    badge: "AI Audio",
    badgeColor: "amber",
    href: "/puphub/bark-analyser",
    demo: "Record bark → Understand mood",
    demoIcon: "🌊",
  },
  {
    icon: "📍",
    title: "Nearby Pet Care",
    desc: "Find vets, groomers, pet stores and dog parks near you — with reviews from the Breedly community.",
    badge: "Location",
    badgeColor: "sage",
    href: "/puphub/nearby",
    demo: "Enable location → See nearby spots",
    demoIcon: "🗺️",
  },
];
 
const AI_QUESTION = "What's the best food for a Labrador puppy?";
const AI_ANSWER   = "Labrador puppies do best on large-breed puppy kibble with controlled calcium levels. Feed 3× daily until 6 months, then twice. Avoid overfeeding — Labs are prone to obesity early on.";
  const AI_Q = "What food is best for a Golden Retriever?";
  const AI_A =
    "Golden Retrievers do best on high-quality dry kibble with real chicken or fish as the first ingredient. Feed twice daily — around 3 cups total — and watch their weight, as they love to overeat! 🐾";

  useEffect(() => {
    // Fade-in observer
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add(styles.visible);
        }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(`.${styles.fadeIn}`).forEach((el) => observer.observe(el));

    // Care tip rotator
    const tips = [
      { title: "Balanced Nutrition", text: "Breed size and age decide portion size and food type.", icon: "🥗" },
      { title: "Preventive Health", text: "Vaccination and deworming prevent long-term issues.", icon: "🩺" },
      { title: "Positive Training", text: "Reward-based training builds trust and confidence.", icon: "🐕" },
      { title: "Daily Exercise", text: "Even 30 minutes of movement improves mood and health.", icon: "🏃" },
    ];
    let idx = 0;
    const rotator = setInterval(() => {
      idx = (idx + 1) % tips.length;
      const t = document.getElementById("rt-title");
      const p = document.getElementById("rt-text");
      const i = document.getElementById("rt-icon");
      if (!t || !p || !i) return;
      [t, p, i].forEach((el) => (el.style.opacity = "0"));
      setTimeout(() => {
        t.textContent = tips[idx].title;
        p.textContent = tips[idx].text;
        i.textContent = tips[idx].icon;
        [t, p, i].forEach((el) => (el.style.opacity = "1"));
      }, 300);
    }, 2800);

    // AI typewriter
    let qI = 0, aI = 0, phase = "q";
    let timer;
    const type = () => {
      if (phase === "q") {
        if (qI <= AI_Q.length) { setAiTyped(AI_Q.slice(0, qI)); qI++; timer = setTimeout(type, 36); }
        else { phase = "pause"; timer = setTimeout(type, 700); }
      } else if (phase === "pause") {
        phase = "a"; timer = setTimeout(type, 100);
      } else {
        if (aI <= AI_A.length) { setAiResponse(AI_A.slice(0, aI)); aI++; timer = setTimeout(type, 16); }
        else setAiDone(true);
      }
    };
    timer = setTimeout(type, 1400);

    return () => { observer.disconnect(); clearInterval(rotator); clearTimeout(timer); };
  }, []);

  return (
    <div className={styles.home}>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={`${styles.heroContent} ${styles.fadeIn}`}>
            <span className={styles.heroBadge}>🐾 Thoughtful breed guidance</span>
            <h1 className={styles.heroHeadline}>
              Find a companion<br />
              <em>that truly fits</em><br />
              your life.
            </h1>
            <p className={styles.heroSub}>
              Thoughtful breed recommendations, real-life insights, and a calmer way to choose your dog.
            </p>
            <div className={styles.heroActions}>
              <Link href="/breed-selector" className={styles.btnPrimary}>Find My Match</Link>
              <Link href="/breeds" className={styles.btnGhost}>Explore Breeds</Link>
            </div>
            <p className={styles.heroMicro}>No pressure. Just guidance that feels right.</p>
          </div>
          <div className={`${styles.heroImageWrap} ${styles.fadeIn}`}>
            <div className={styles.heroBlobBg} />
            <img src="/assets/result (2).png" alt="Happy dog" className={styles.heroImg} />
            <div className={styles.floatCard1}><span>🏡</span> Perfect match found</div>
            <div className={styles.floatCard2}><span>⭐</span> </div>
          </div>
        </div>
        <div className={styles.heroFade} />
      </section>

      {/* ── TRUST STRIP ── */}
      <section className={`${styles.trustStrip} ${styles.fadeIn}`}>
        {[["🏡","First-time owners"],["👨‍👩‍👧","Families"],["🐾","Adoption-focused"],["🧠","Informed care"]].map(([icon, label], i) => (
          <div key={label} className={styles.trustItem} style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            {i > 0 && <div className={styles.trustDivider} />}
            <span>{icon}</span>{label}
          </div>
        ))}
      </section>

      {/* ── WHY BREEDLY ── */}
      <section className={`${styles.section} ${styles.fadeIn}`}>
        <p className={styles.eyebrow}>Why Breedly</p>
        <h2 className={styles.sectionTitle}>Built for the dog's wellbeing,<br />not impulse decisions.</h2>
        <div className={styles.grid3}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>🎯</div>
            <h3>Right Breed Match</h3>
            <p>Choose a dog that fits your lifestyle, space, and energy — not just your preference.</p>
          </div>
          <div className={`${styles.card} ${styles.cardAccent}`}>
            <div className={styles.cardIcon}>🌿</div>
            <h3>Responsible Care</h3>
            <p>Food, health, and training guides designed around each breed's specific needs.</p>
          </div>
          <div className={styles.card}>
            <div className={styles.cardIcon}>🛡️</div>
            <h3>Trusted Information</h3>
            <p>No myths. No confusion. Just clear, practical guidance based on evidence.</p>
          </div>
        </div>
      </section>

      {/* ── BREED SELECTOR QUIZ TEASER ── */}
      <section className={`${styles.quizSection} ${styles.fadeIn}`}>
        <div className={styles.quizInner}>
          <div className={styles.quizLeft}>
            <p className={styles.eyebrowLight}>Breed Selector Quiz</p>
            <h2>We don't guess.<br />We ask the<br />right questions.</h2>
            <p>Our quiz considers your lifestyle, space, time, and commitment — so dogs don't end up in the wrong home.</p>
            <Link href="/breed-selector" className={styles.btnCream}>Start the Quiz 🐾</Link>
            <p className={styles.microLight}>Takes less than 2 minutes · Free</p>
          </div>
          <div className={styles.quizRight}>
            {[
              ["⏰","How much time can you give your dog daily?"],
              ["🏠","Do you live in an apartment or a house?"],
              ["💰","Are regular vet and food expenses manageable?"],
              ["🧹","How much grooming are you comfortable with?"],
              ["⚡","How active is your daily lifestyle?"],
            ].map(([icon, q], i) => (
              <div key={i} className={styles.quizQuestion}>
                <span className={styles.quizIcon}>{icon}</span>
                <span>{q}</span>
                <span className={styles.quizArrow}>→</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DAY WITH YOUR DOG ── */}
      <section className={`${styles.daySection} ${styles.fadeIn}`}>
        <div className={styles.daySectionInner}>
          <div className={styles.dayContent}>
            <p className={styles.eyebrow}>A day with your future companion</p>
            <h2 className={styles.sectionTitle} style={{ textAlign:"left", marginBottom:"16px" }}>
              Imagine how your life<br />might feel together.
            </h2>
            <p className={styles.daySubtext}>
              From morning walks to quiet evenings — every dog brings a rhythm of its own. Find the breed whose rhythm matches yours.
            </p>
          </div>
          <div className={styles.dayOrbit}>
            <div className={styles.orbitCenter}>🐕</div>
            <div className={`${styles.orbitItem} ${styles.orbit1}`}>🌅<span>Morning walks</span></div>
            <div className={`${styles.orbitItem} ${styles.orbit2}`}>🎾<span>Playful moments</span></div>
            <div className={`${styles.orbitItem} ${styles.orbit3}`}>😴<span>Quiet naps</span></div>
            <div className={`${styles.orbitItem} ${styles.orbit4}`}>✂️<span>Gentle grooming</span></div>
            <div className={`${styles.orbitItem} ${styles.orbit5}`}>🏡<span>Shared routines</span></div>
            <svg className={styles.orbitRing} viewBox="0 0 300 300" fill="none">
              <circle cx="150" cy="150" r="120" stroke="#B08968" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.4" />
            </svg>
          </div>
        </div>
      </section>

      {/* ── CARE GUIDE TEASER ── */}
      <section className={`${styles.section} ${styles.fadeIn}`}>
        <p className={styles.eyebrow}>Care Guide</p>
        <h2 className={styles.sectionTitle}>Everything your dog needs,<br />explained simply.</h2>
        <div className={styles.careGrid}>
          {[
            { href:"/food-guide",     bg:"#FDF3E7", emoji:"🥗", title:"Nutrition & Food",   desc:"Portion sizes, ingredients to avoid, and breed-specific diets." },
            { href:"/health-guide",   bg:"#EDF7F0", emoji:"🩺", title:"Health & Vet Care",  desc:"Vaccination schedules, common issues, and preventive routines." },
            { href:"/training-guide", bg:"#F0EDF7", emoji:"🎓", title:"Training",           desc:"Reward-based methods, basic commands, and building trust." },
            { href:"/care-grooming", bg:"#F7EDF0", emoji:"✂️", title:"Grooming",          desc:"Coat types, brushing frequency, and at-home grooming tips." },
          ].map((c) => (
            <Link href={c.href} key={c.href} className={styles.careCard}>
              <div className={styles.careCardTop} style={{ background: c.bg }}>
                <span className={styles.careEmoji}>{c.emoji}</span>
              </div>
              <div className={styles.careCardBody}>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <span className={styles.careLink}>Read guides →</span>
              </div>
            </Link>
          ))}
        </div>
        <div className={styles.sectionCta}>
          <Link href="/care" className={styles.btnOutline}>{/* Explore Guides →*/}</Link>
        </div>
      </section>

      {/* ── CARE TIP ROTATOR ── */}
      <section className={`${styles.section} ${styles.sectionCenter} ${styles.fadeIn}`}>
        <p className={styles.eyebrow}>Daily Dog Care</p>
        <h2 className={styles.sectionTitle}>Tips that grow with your dog.</h2>
        <div className={styles.rotatorCard}>
          <span id="rt-icon" className={styles.rotatorIcon} style={{ transition:"opacity 0.3s" }}>🐕</span>
          <h3 id="rt-title" style={{ transition:"opacity 0.3s" }}>Choose the Right Breed</h3>
          <p id="rt-text" style={{ transition:"opacity 0.3s" }}>A dog's happiness depends on matching energy, space, and lifestyle.</p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          TEASER 5 — PUPHUB AI  (3 tools)
      ════════════════════════════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.fadeIn}`}>
        <div className={styles.puphubHeader}>
          <div>
            <p className={styles.eyebrow}>PupHub AI</p>
            <h2 className={styles.sectionTitle} style={{ textAlign:"left", marginBottom:0 }}>
              AI tools built<br />for dog parents.
            </h2>
          </div>
          <Link href="/puphub" className={styles.btnPrimary} style={{ alignSelf:"flex-end" }}>
           {/* Explore PupHub →*/}
          </Link>
        </div>
 
        <div className={styles.puphubGrid}>
          {PUPHUB_TOOLS.map((tool) => (
            <Link href={tool.href} key={tool.title} className={`${styles.puphubCard} ${styles[`puphub_${tool.badgeColor}`]}`}>
              <div className={styles.puphubTop}>
                <span className={styles.puphubIcon}>{tool.icon}</span>
                <span className={`${styles.puphubBadge} ${styles[`badge_${tool.badgeColor}`]}`}>{tool.badge}</span>
              </div>
              <h3>{tool.title}</h3>
              <p>{tool.desc}</p>
              <div className={styles.puphubDemo}>
                <span className={styles.puphubDemoIcon}>{tool.demoIcon}</span>
                <span>{tool.demo}</span>
              </div>
              <span className={styles.puphubArrow}>Try it →</span>
            </Link>
          ))}
        </div>
      </section>
 
      {/* ── AI ASSISTANT TEASER ── */}
      <section className={`${styles.aiSection} ${styles.fadeIn}`}>
        <div className={styles.aiInner}>
          <div className={styles.aiLeft}>
            <p className={styles.eyebrowLight}>AI Assistant</p>
            <h2>Ask anything<br />about dogs.</h2>
            <p>Food, health, behaviour, training — our AI knows every breed inside out. Get instant, personalised answers anytime.</p>
            <Link href="/chat" className={styles.btnCream}>Try the AI Assistant ✨</Link>
            <p className={styles.microLight}>Powered by Claude · Always free</p>
          </div>
          <div className={styles.aiRight}>
            <div className={styles.aiChatWindow}>
              <div className={styles.aiChatHeader}>
                <div className={styles.aiDot} />
                <span>Breedly AI</span>
                <span className={styles.aiOnline}>Online</span>
              </div>
              <div className={styles.aiChatBody}>
                {aiTyped && (
                  <div className={styles.aiMsgUser}>
                    {aiTyped}
                    {aiTyped.length < AI_Q.length && <span className={styles.cursor}>|</span>}
                  </div>
                )}
                {aiResponse && (
                  <div className={styles.aiMsgBot}>
                    <div className={styles.aiBotAvatar}>🤖</div>
                    <div className={styles.aiBotBubble}>
                      {aiResponse}
                      {!aiDone && <span className={styles.cursor}>|</span>}
                    </div>
                  </div>
                )}
              </div>
              {aiDone && (
                <div className={styles.aiChatFooter}>
                  <span>Ask a follow-up question…</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── COMMUNITY TEASER ── */}
      <section className={`${styles.section} ${styles.fadeIn}`}>
        <p className={styles.eyebrow}>Community</p>
        <h2 className={styles.sectionTitle}>Real stories from<br />real dog parents.</h2>
        <div className={styles.communityGrid}>
          {[
            { init:"S", bg:"#E8D5C4", name:"Sneha R.", breed:"Golden Retriever owner", text:"He finally learned to sit today 🐾 three weeks in and I'm already obsessed. Breedly's training guide made it so clear.", tags:["Training","Golden Retriever"] },
            { init:"A", bg:"#D4E8D5", name:"Aryan M.", breed:"Beagle owner", text:"First walk together — couldn't be happier. Took the quiz, got matched with a Beagle, and it was the best decision of my life.", tags:["Adoption","Beagle"] },
            { init:"P", bg:"#D5D4E8", name:"Priya K.", breed:"Shih Tzu owner", text:"Any grooming tips for long coats? My Shih Tzu is getting fluffy 😅 The care guide helped a lot but looking for more tips!", tags:["Grooming","Shih Tzu"] },
          ].map((c) => (
            <div key={c.name} className={styles.communityCard}>
              <div className={styles.communityCardTop}>
                <div className={styles.communityAvatar} style={{ background: c.bg }}>{c.init}</div>
                <div>
                  <strong>{c.name}</strong>
                  <span>{c.breed}</span>
                </div>
              </div>
              <p>"{c.text}"</p>
              <div className={styles.communityTags}>
                {c.tags.map((t) => <span key={t}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.sectionCta}>
          <Link href="/community" className={styles.btnOutline}>Join the Community →</Link>
        </div>
      </section>
       {/* ════════════════════════════════════════════════════════════
          TEASER 6 — MY DOG
      ════════════════════════════════════════════════════════════ */}
         <section className={`${styles.myDogSection} ${styles.fadeIn}`}>
        <div className={styles.myDogInner}>
          {/* Left: illustration / mock profile */}
          <div className={styles.myDogLeft}>
            <div className={styles.myDogProfileCard}>
              <div className={styles.myDogAvatar}>🐶</div>
              <div className={styles.myDogInfo}>
                <span className={styles.myDogName}>Bruno</span>
                <span className={styles.myDogBreed}>Golden Retriever · 2 yrs</span>
              </div>
              <span className={styles.myDogVerified}>✔ Profile complete</span>
              <div className={styles.myDogStats}>
                <div className={styles.myDogStat}><span>Weight</span><strong>28 kg</strong></div>
                <div className={styles.myDogStat}><span>Size</span><strong>Large</strong></div>
                <div className={styles.myDogStat}><span>Health</span><strong>Healthy</strong></div>
              </div>
            </div>
 
            {/* Floating guide pills */}
            <div className={styles.myDogPill} style={{ top:"10px", right:"-20px" }}>
              🥗 Personalised food plan
            </div>
            <div className={styles.myDogPill} style={{ bottom:"50px", left:"-10px", animationDelay:"1.2s" }}>
              🩺 Next vaccine in 3 months
            </div>
            <div className={styles.myDogPill} style={{ bottom:"-10px", right:"10px", animationDelay:"2.1s" }}>
              🏃 30 min walk recommended
            </div>
          </div>
 
          {/* Right: copy */}
          <div className={styles.myDogRight}>
            <p className={styles.eyebrow}>My Dog</p>
            <h2>
              Create your dog's profile.<br />
              <em>Get guides made just<br />for them.</em>
            </h2>
            <p>
              Add your dog's name, breed, age, weight, and health info.
              Breedly tailors food guides, health reminders, and training
              tips specifically for your dog — not a generic one.
            </p>
 
            <div className={styles.myDogFeatures}>
              {[
                { icon:"🥗", text:"Breed & age specific food portions"  },
                { icon:"🩺", text:"Personalised vaccination reminders"  },
                { icon:"🐕", text:"Training tips for your dog's breed"  },
                { icon:"📊", text:"Track weight, health & milestones"   },
              ].map((f) => (
                <div key={f.text} className={styles.myDogFeature}>
                  <span>{f.icon}</span>{f.text}
                </div>
              ))}
            </div>
 
            <div className={styles.myDogActions}>
              <Link href="/my-dog" className={styles.btnPrimary}>
                Create My Dog's Profile 🐾
              </Link>
              <Link href="/my-dog" className={styles.btnGhost}>
                See how it works
              </Link>
            </div>
          </div>
        </div>
      </section>
 

      {/* ── HOW IT WORKS ── */}
      <section className={`${styles.section} ${styles.fadeIn}`}>
        <p className={styles.eyebrow}>How It Works</p>
        <h2 className={styles.sectionTitle}>Three steps to finding<br />your ideal dog.</h2>
        <div className={styles.steps}>
          <div className={styles.step}><span className={styles.stepNum}>01</span><h3>Answer Simple Questions</h3><p>Tell us about your home, activity level, and daily routine.</p></div>
          <div className={styles.stepArrow}>→</div>
          <div className={styles.step}><span className={styles.stepNum}>02</span><h3>Get Breed Matches</h3><p>We recommend breeds that naturally suit your lifestyle.</p></div>
          <div className={styles.stepArrow}>→</div>
          <div className={styles.step}><span className={styles.stepNum}>03</span><h3>Learn & Care</h3><p>Access food, health, and training guides tailored for your dog.</p></div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className={`${styles.missionSection} ${styles.fadeIn}`}>
        <p className={styles.eyebrow}>Our Mission</p>
        <h2>Built for thoughtful adoption.</h2>
        <p>Breedly exists to help people choose responsibly — not impulsively.<br />Because every dog deserves the right home.</p>
        <div className={styles.missionPills}>
          <span>✔ No forced decisions</span>
          <span>✔ Transparent insights</span>
          <span>✔ Long-term care focus</span>
        </div>
      </section>

      {/* ── EMAIL ── */}
      <section className={`${styles.emailSection} ${styles.fadeIn}`}>
        <p className={styles.eyebrow}>Stay Connected</p>
        <h2>Get occasional breed insights<br />and care tips.</h2>
        <p>Simple guidance — not overwhelming newsletters.</p>
        <div className={styles.emailForm}>
          <input type="email" placeholder="Enter your email" className={styles.emailInput} />
          <button className={styles.btnPrimary}>Join</button>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className={`${styles.ctaSection} ${styles.fadeIn}`}>
        <h2>Not sure which breed suits you?</h2>
        <p>Answer a few simple questions and we'll guide you gently.</p>
        <Link href="/breed-selector" className={styles.btnCream}>Start Breed Selector</Link>
        <p className={styles.ctaMicro}>✔ Trusted by responsible dog lovers &nbsp;•&nbsp; ✔ Adoption-first approach</p>
      </section>

    </div>
  );
}