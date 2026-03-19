'use client';
import { useState } from 'react';
import './training.css'; // Make sure your CSS is the same as original

export default function TrainingPage() {
  const [openModalId, setOpenModalId] = useState(null);

  const openModal = (id) => setOpenModalId(id);
  const closeModal = () => setOpenModalId(null);

  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div className="training-guide-page">
      {/* Hero Header */}
      <header className="main-header new-main">
        <img src="/assets/playing.jpg" alt="Dog Playing" className="main-img" />
        <div className="main-overlay">
          <div className="main-inner">
            <h1>🐶 Train with Love, Lead with Trust</h1>
            <p>Your journey to a well-behaved, joyful dog starts here.</p>
            <blockquote>
              “A well-trained dog isn’t just obedient — it’s deeply connected to you.”
              <span>– BreedLy Wisdom 🐾</span>
            </blockquote>
            <a href="#topics" className="main-btn">Start Learning</a>
          </div>
        </div>
      </header>

      {/* Topics Grid */}
      <section className="card-sections" id="topics">
        <h2 style={{ textAlign: 'center' }}>🐾 Training Topics Overview</h2>
        <div className="topics-grid">
          {[
            { id: 'modal-foundation', icon: 'fas fa-brain', title: 'Understanding Dog Behavior', desc: 'Learn how dogs think and build trust through psychology.' },
            { id: 'modal-commands', icon: 'fas fa-dog', title: 'Basic Commands', desc: 'Teach sit, stay, come, and more.' },
            { id: 'modal-behavior', icon: 'fas fa-ban', title: 'Behavior Training', desc: 'Correct unwanted behaviors with compassion.' },
            { id: 'modal-potty', icon: 'fas fa-toilet-paper', title: 'Potty Training', desc: 'Build solid habits and routines.' },
            { id: 'modal-leash', icon: 'fas fa-walking', title: 'Leash Training', desc: 'Walks without pulling or chaos.' },
            { id: 'modal-social', icon: 'fas fa-users', title: 'Socialization', desc: 'Positive exposure to people, places, and pets.' },
            { id: 'modal-advanced', icon: 'fas fa-award', title: 'Advanced Training', desc: 'Master complex behaviors like heel and recall.' },
            { id: 'modal-mistakes', icon: 'fas fa-exclamation-triangle', title: 'Common Mistakes', desc: 'Avoid errors that slow progress or harm trust.' },
            { id: 'modal-tools', icon: 'fas fa-box-open', title: 'Tools & Enrichment', desc: 'Use smart tools to help your pup succeed.' },
          ].map(topic => (
            <div key={topic.id} className="topic-card" onClick={() => openModal(topic.id)}>
              <i className={topic.icon}></i>
              <h3>{topic.title}</h3>
              <p>{topic.desc}</p>
            </div>
          ))}
        </div>
      </section>{/* 🧠 MODALS WITH FULL DETAILS */}
{openModalId && (
  <>
    {/* Understanding Dog Behavior */}
    {openModalId === 'modal-foundation' && (
      <div className="modal" onClick={closeModal}>
        <div className="modal-content" onClick={stopPropagation}>
          <span className="close" onClick={closeModal}>&times;</span>
          <h2><i className="fas fa-brain"></i> Understanding Dog Behavior</h2>
          <ul>
            <li>🔁 Dogs learn by forming associations — routines matter.</li>
            <li>🍖 Reinforce good behavior with rewards, not punishment.</li>
            <li>🐾 Body language matters — observe tail, ears, eyes.</li>
            <li>⌛ Be patient; dogs don’t misbehave out of malice.</li>
          </ul>
          <img src="/assets/behaviour.jpg" className="img-center" alt="Dog behavior psychology illustration" />
        </div>
      </div>
    )}

    {/* Basic Commands */}
    {openModalId === 'modal-commands' && (
      <div className="modal" onClick={closeModal}>
        <div className="modal-content" onClick={stopPropagation}>
          <span className="close" onClick={closeModal}>&times;</span>
          <h2><i className="fas fa-dog"></i> Basic Commands</h2>

          {/* Sit */}
          <h3>🐾 Sit</h3>
          <p><strong>Purpose:</strong> The “Sit” command is a foundational obedience cue. It helps calm your dog, build impulse control, and is a gateway for teaching other behaviors.</p>
          <p><strong>When to Use:</strong> Before meals, during leash clipping, at doors, or when guests arrive.</p>
          <ol>
            <li>Hold a treat close to your dog’s nose.</li>
            <li>Slowly move your hand upwards — your dog’s head will follow and their rear will lower.</li>
            <li>As soon as the dog sits, say “Sit”, then praise and treat.</li>
            <li>Repeat several short sessions daily in different environments.</li>
            <li>Phase out treats slowly by replacing them with praise.</li>
          </ol>
          <div className="media">
            <img src="/assets/sit.jpg" className="img-center" alt="Dog learning to sit" />
            <div className="video-wrapper">
              <video controls preload="metadata" width="50%" style={{ borderRadius: '16px' }}>
                <source src="/assets/videos/sit.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Stay */}
          <h3>✋ Stay</h3>
          <p><strong>Purpose:</strong> “Stay” teaches your dog to remain in position. It’s critical for safety and self-control.</p>
          <p><strong>When to Use:</strong> At crosswalks, during grooming, or when you need to pause interaction.</p>
          <ol>
            <li>Ask your dog to “Sit”.</li>
            <li>Show your palm like a “stop” signal and say “Stay”.</li>
            <li>Take one step back. If the dog remains, return and reward.</li>
            <li>Gradually increase distance and duration.</li>
            <li>End the command with “Okay” or “Free” to release.</li>
          </ol>
          <div className="media">
            <img src="/assets/stay.jpg" className="img-center" alt="Dog in a stay position" />
            <div className="video-wrapper">
              <video controls preload="metadata" width="50%" style={{ borderRadius: '16px' }}>
                <source src="/assets/videos/stay.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Down */}
          <h3>🐕 Down</h3>
          <p><strong>Purpose:</strong> “Down” asks your dog to lie down completely. It’s used to calm your dog or keep them relaxed in high-energy places.</p>
          <p><strong>When to Use:</strong> At cafés, during long waits, or for calm behavior at home.</p>
          <ol>
            <li>Start from sitting. Hold a treat at their nose, then move it slowly to the ground.</li>
            <li>Let their body follow. As elbows touch down, say “Down” and reward.</li>
            <li>Practice short holds before releasing.</li>
            <li>Gradually add distractions or longer durations.</li>
          </ol>
          <div className="media">
            <img src="/assets/down.jpg" className="img-center" alt="Dog in down position" />
            <div className="video-wrapper">
              <video controls preload="metadata" width="50%" style={{ borderRadius: '16px' }}>
                <source src="/assets/videos/down.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Behavior Training */}
    {openModalId === 'modal-behavior' && (
      <div className="modal" onClick={closeModal}>
        <div className="modal-content" onClick={stopPropagation}>
          <span className="close" onClick={closeModal}>&times;</span>
          <h2><i className="fas fa-ban"></i> Behavior Training</h2>
          <p><strong>Purpose:</strong> Behavior training addresses unwanted actions like jumping, barking, chewing, or nipping — not through punishment, but through redirection and reinforcement of calm behavior.</p>

          {/* Jumping */}
          <h3>🐾 Jumping on People</h3>
          <ol>
            <li>Ignore the jumping completely — no eye contact, touch, or speech.</li>
            <li>Turn your back. Wait until all four paws are on the ground.</li>
            <li>Then reward calmly with “Good paws down!” and a treat.</li>
            <li>Ask for a “Sit” instead when greeting people.</li>
          </ol>
          <div className="media">
            <img src="/assets/jumping.jpg" className="img-center" alt="Dog jumping issue" />
            <div className="video-wrapper">
              <video controls preload="metadata" width="50%" style={{ borderRadius: '16px' }}>
                <source src="/assets/videos/jumping.mp4" type="video/mp4" />
              </video>
            </div>
          </div>

          {/* Barking */}
          <h3>🔊 Excessive Barking</h3>
          <ol>
            <li>Identify the trigger (doorbell, other dogs, etc.).</li>
            <li>Teach “Quiet” using positive interruption (clap once, say “Quiet”).</li>
            <li>When the barking stops — reward immediately.</li>
            <li>Gradually lengthen quiet time before rewarding.</li>
          </ol>
          <div className="media">
            <img src="/assets/barking.jpg" className="img-center" alt="Dog barking" />
            <div className="video-wrapper">
              <video controls preload="metadata" width="50%" style={{ borderRadius: '16px' }}>
                <source src="/assets/videos/barking.mp4" type="video/mp4" />
              </video>
            </div>
          </div>

          {/* Chewing */}
          <h3>🦷 Destructive Chewing</h3>
          <ol>
            <li>Keep valuable items out of reach.</li>
            <li>Give a chew toy every time chewing begins.</li>
            <li>Redirect and praise for chewing approved toys only.</li>
          </ol>
          <div className="media">
            <img src="/assets/chewing.jpg" className="img-center" alt="Dog chewing on toy" />
            <div className="video-wrapper">
              <video controls preload="metadata" width="50%" style={{ borderRadius: '16px' }}>
                <source src="/assets/videos/chewing.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Potty Training */}
    {openModalId === 'modal-potty' && (
      <div className="modal" onClick={closeModal}>
        <div className="modal-content" onClick={stopPropagation}>
          <span className="close" onClick={closeModal}>&times;</span>
          <h2><i className="fas fa-toilet-paper"></i> Potty Training</h2>
          <p><strong>Purpose:</strong> Potty training teaches your dog where and when it’s appropriate to relieve themselves. Early consistency prevents accidents and confusion.</p>
          <p><strong>When to Start:</strong> From the day you bring your puppy or dog home. Begin immediately.</p>

          <h3>🚪 Step-by-Step Indoor/Outdoor Training</h3>
          <ol>
            <li>🕒 Take your dog outside first thing in the morning, after naps, meals, and playtime.</li>
            <li>📍 Always go to the same potty spot to create habit.</li>
            <li>🎯 Use a command like “Go potty” and wait silently.</li>
            <li>✅ Immediately praise and give a treat after they finish.</li>
            <li>📅 Keep a potty schedule to prevent indoor accidents.</li>
            <li>🧽 Clean any mess indoors with enzymatic cleaner — don’t punish.</li>
          </ol>
          <img src="/assets/potty.jpg" className="img-center" alt="Puppy potty training outside" />
          <h3>🚨 Accident Handling</h3>
          <p>Never scold. Dogs won’t understand after the fact. Instead, interrupt gently and lead them outside if caught mid-act.</p>
          <div className="video-wrapper">
            <video controls preload="metadata" width="50%" style={{ borderRadius: '16px' }}>
              <source src="/assets/videos/potty.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    )}
    {/* Socialization Modal */}
{openModalId === 'modal-social' && (
  <div className="modal" onClick={closeModal}>
    <div className="modal-content" onClick={stopPropagation}>
      <span className="close" onClick={closeModal}>&times;</span>
      <h2><i className="fas fa-users"></i> Socialization</h2>

      <p>
        <strong>Purpose:</strong> Socialization exposes your dog to people,
        environments, animals, and sounds to reduce fear, anxiety, or
        aggression later in life.
      </p>

      <h3>🎉 Step-by-Step Social Plan</h3>
      <ol>
        <li>Start with calm people at home — let the dog approach at their pace.</li>
        <li>Use treats when introducing to new sounds (doorbell, vacuum, traffic).</li>
        <li>Visit different safe locations: pet stores, parks, sidewalks.</li>
        <li>Introduce calm dogs one-on-one — avoid off-leash chaos initially.</li>
        <li>Track progress and keep sessions short + positive.</li>
      </ol>

      <img src="/assets/meet.jpg" className="img-center" alt="Dog meeting new people" />

      <h3>🎓 Golden Rule</h3>
      <p>
        Never force — all interactions must be voluntary. Let your dog observe
        at a distance first if unsure.
      </p>

      <div className="media">
        <img src="/assets/soical.jpg" className="img-center" alt="Dog socializing at the park" />
        <div className="video-wrapper">
          <video controls preload="metadata" width="50%" style={{ borderRadius: '16px' }}>
            <source src="/assets/videos/social.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  </div>
)}

{/* Advanced Training Modal */}
{openModalId === 'modal-advanced' && (
  <div className="modal" onClick={closeModal}>
    <div className="modal-content" onClick={stopPropagation}>
      <span className="close" onClick={closeModal}>&times;</span>
      <h2><i className="fas fa-award"></i> Advanced Training</h2>

      <h3>🚶 Heel Command</h3>
      <p><strong>Purpose:</strong> Walks calmly next to you, matching pace, ignoring distractions.</p>
      <ol>
        <li>Start walking with your dog beside your left leg.</li>
        <li>Say “Heel” and reward frequently while in position.</li>
        <li>If dog strays, stop and reset with “Let’s go”.</li>
      </ol>
      <div className="media">
        <img src="/assets/heel.jpg" className="img-center" alt="Dog learning heel command" />
        <div className="video-wrapper">
          <video controls preload="metadata" width="50%" style={{ borderRadius: '16px' }}>
            <source src="/assets/videos/heel.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      <h3>🌀 Recall (Come When Called)</h3>
      <p>Build rock-solid recall by practicing daily.</p>
      <ol>
        <li>Use a long line in a quiet area.</li>
        <li>Call “Come!” in an excited tone.</li>
        <li>Reward with big praise and treats.</li>
        <li>Never punish after recall.</li>
      </ol>
      <div className="media">
        <img src="/assets/recall.jpg" className="img-center" alt="Dog practicing recall" />
        <div className="video-wrapper">
          <video controls preload="metadata" width="50%" style={{ borderRadius: '16px' }}>
            <source src="/assets/videos/recall.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  </div>
)}

{/* Common Mistakes Modal */}
{openModalId === 'modal-mistakes' && (
  <div className="modal" onClick={closeModal}>
    <div className="modal-content" onClick={stopPropagation}>
      <span className="close" onClick={closeModal}>&times;</span>
      <h2><i className="fas fa-exclamation-triangle"></i> Common Mistakes</h2>

      <p>
        <strong>Purpose:</strong> Understanding what not to do in training can
        often be more important than knowing what to do. These mistakes often
        delay progress or damage your dog’s trust.
      </p>

      <h3>❌ Mistake #1: Repeating Commands</h3>
      <p>Don’t say “Sit sit sit sit…” — it weakens the cue. Say it once, then wait or gently reset.</p>

      <h3>😠 Mistake #2: Training When Angry</h3>
      <p>Dogs sense frustration. Never train if you’re tired, frustrated, or angry — it’ll confuse or scare your dog.</p>

      <h3>❌ Mistake #3: Punishing After the Fact</h3>
      <p>Dogs don’t link punishment to earlier behavior. If your dog peed 5 minutes ago, correcting them now won’t teach anything.</p>

      <h3>📏 Mistake #4: Inconsistent Rules</h3>
      <p>If one person allows couch access and another punishes it — your dog won’t know what’s right. Make household rules clear and consistent.</p>

      <div className="video-wrapper"></div>
    </div>
  </div>
)}

{/* Tools & Enrichment Modal */}
{openModalId === 'modal-tools' && (
  <div className="modal" onClick={closeModal}>
    <div className="modal-content" onClick={stopPropagation}>
      <span className="close" onClick={closeModal}>&times;</span>
      <h2><i className="fas fa-box-open"></i> Tools & Enrichment</h2>

      <p>
        <strong>Purpose:</strong> Mental stimulation and proper tools help
        prevent boredom and enhance training results.
      </p>

      <h3>🧩 Enrichment Tools</h3>
      <ul>
        <li>Snuffle mats — let your dog forage for food.</li>
        <li>KONG toys — stuff with frozen treats.</li>
        <li>Puzzle bowls — slow down fast eaters.</li>
      </ul>
      <img src="/assets/en.jpg" className="img-center" alt="Enrichment tools" />

      <h3>🎾 Play & Chew</h3>
      <ul>
        <li>Use rope toys and fetch balls daily.</li>
        <li>Rotate toys weekly to renew interest.</li>
      </ul>
      <img src="/assets/play.jpg" className="img-center" alt="Dog playing with toys" />

      <h3>🚫 Tools to Avoid</h3>
      <p>Prong collars, electric shock collars, and choke chains are harmful. Stick to humane, positive training aids.</p>
      <img src="/assets/bite.jpg" className="img-center" alt="Avoid harmful tools" />
    </div>
  </div>
)}


    
        </>
      )}

      {/* Back to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          background: '#ff9f43',
          color: 'white',
          border: 'none',
          padding: '0.8rem 1rem',
          borderRadius: '50%',
          fontSize: '1.5rem',
          cursor: 'pointer',
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
          zIndex: 1000,
        }}
        aria-label="Back to top"
      >
        <i className="fas fa-arrow-up"></i>
      </button>

      <footer>
        <p>
          🐾 Built with love by <strong>BreedLy</strong> – “Because every good dog deserves a good life.”
        </p>
      </footer>
    </div>
  );
}
