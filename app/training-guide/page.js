'use client';
import { useState } from 'react';
import {
  GraduationCap,
  Brain,
  Sparkles,
  Ban,
  Calendar,
  Compass,
  Users,
  Award,
  AlertTriangle,
  Wrench,
  RotateCcw,
  Clock,
  X,
  Heart,
  Scale,
  ArrowUp,
  Activity,
  BookOpen
} from 'lucide-react';
import './training.css';

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
            <div className="section-pill" style={{ background: 'rgba(255, 255, 255, 0.15)', borderColor: 'rgba(255, 255, 255, 0.25)' }}>
              <span className="section-pill-icon" style={{ color: '#FAF7F2', display: 'flex', alignItems: 'center' }}>
                <GraduationCap size={14} />
              </span>
              <span className="section-pill-text" style={{ color: '#FAF7F2' }}>BreedLy Academy</span>
            </div>
            <h1>Train with Love, Lead with Trust</h1>
            <p>Your journey to a well-behaved, joyful dog starts here.</p>
            <blockquote>
              “A well-trained dog isn’t just obedient — it’s deeply connected to you.”
              <span>– BreedLy Wisdom</span>
            </blockquote>
            <a href="#topics" className="main-btn">Start Learning</a>
          </div>
        </div>
      </header>

      {/* Topics Grid */}
      <section className="card-sections" id="topics">
        <div className="section-header-block">
          <div className="section-pill">
            <span className="section-pill-icon" style={{ display: 'flex', alignItems: 'center' }}>
              <BookOpen size={14} />
            </span>
            <span className="section-pill-text">Curriculum</span>
          </div>
          <h2>Training Topics Overview</h2>
        </div>
        
        <div className="topics-grid">
          {[
            { id: 'modal-foundation', icon: Brain, title: 'Understanding Dog Behavior', desc: 'Learn how dogs think and build trust through psychology.' },
            { id: 'modal-commands', icon: Sparkles, title: 'Basic Commands', desc: 'Teach sit, stay, come, and more.' },
            { id: 'modal-behavior', icon: Ban, title: 'Behavior Training', desc: 'Correct unwanted behaviors with compassion.' },
            { id: 'modal-potty', icon: Calendar, title: 'Potty Training', desc: 'Build solid habits and routines.' },
            { id: 'modal-leash', icon: Compass, title: 'Leash Training', desc: 'Walks without pulling or chaos.' },
            { id: 'modal-social', icon: Users, title: 'Socialization', desc: 'Positive exposure to people, places, and pets.' },
            { id: 'modal-advanced', icon: Award, title: 'Advanced Training', desc: 'Master complex behaviors like heel and recall.' },
            { id: 'modal-mistakes', icon: AlertTriangle, title: 'Common Mistakes', desc: 'Avoid errors that slow progress or harm trust.' },
            { id: 'modal-tools', icon: Wrench, title: 'Tools & Enrichment', desc: 'Use smart tools to help your pup succeed.' },
          ].map(topic => {
            const TopicIcon = topic.icon;
            return (
              <div key={topic.id} className="topic-card" onClick={() => openModal(topic.id)}>
                <div className="topic-card-icon-wrapper">
                  <TopicIcon size={24} className="topic-card-icon" />
                </div>
                <h3>{topic.title}</h3>
                <p>{topic.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* MODALS WITH FULL DETAILS */}
      {openModalId && (
        <>
          {/* Understanding Dog Behavior */}
          {openModalId === 'modal-foundation' && (
            <div className="modal" onClick={closeModal}>
              <div className="modal-content" onClick={stopPropagation}>
                <button className="close" onClick={closeModal} aria-label="Close modal">
                  <X size={18} />
                </button>
                <h2>
                  <Brain className="modal-title-icon" size={28} />
                  <span>Understanding Dog Behavior</span>
                </h2>
                
                <div className="bullet-list">
                  <div className="bullet-card">
                    <span className="bullet-card-icon">
                      <RotateCcw size={18} />
                    </span>
                    <p className="bullet-card-text">Dogs learn by forming associations — routines matter.</p>
                  </div>
                  <div className="bullet-card">
                    <span className="bullet-card-icon">
                      <Sparkles size={18} />
                    </span>
                    <p className="bullet-card-text">Reinforce good behavior with rewards, not punishment.</p>
                  </div>
                  <div className="bullet-card">
                    <span className="bullet-card-icon">
                      <Heart size={18} />
                    </span>
                    <p className="bullet-card-text">Body language matters — observe tail, ears, eyes.</p>
                  </div>
                  <div className="bullet-card">
                    <span className="bullet-card-icon">
                      <Clock size={18} />
                    </span>
                    <p className="bullet-card-text">Be patient; dogs don’t misbehave out of malice.</p>
                  </div>
                </div>
                
                <img src="/assets/behaviour.jpg" className="img-center" alt="Dog behavior psychology illustration" style={{ width: '100%', height: '350px', objectFit: 'cover' }} />
              </div>
            </div>
          )}

          {/* Basic Commands */}
          {openModalId === 'modal-commands' && (
            <div className="modal" onClick={closeModal}>
              <div className="modal-content" onClick={stopPropagation}>
                <button className="close" onClick={closeModal} aria-label="Close modal">
                  <X size={18} />
                </button>
                <h2>
                  <Sparkles className="modal-title-icon" size={28} />
                  <span>Basic Commands</span>
                </h2>

                {/* Sit */}
                <h3>Sit</h3>
                <p><strong>Purpose:</strong> The “Sit” command is a foundational obedience cue. It helps calm your dog, build impulse control, and is a gateway for teaching other behaviors.</p>
                <p><strong>When to Use:</strong> Before meals, during leash clipping, at doors, or when guests arrive.</p>
                
                <ol className="step-list">
                  <li className="step-card">
                    <div className="step-number-badge">1</div>
                    <p className="step-text">Hold a treat close to your dog’s nose.</p>
                  </li>
                  <li className="step-card">
                    <div className="step-number-badge">2</div>
                    <p className="step-text">Slowly move your hand upwards — your dog’s head will follow and their rear will lower.</p>
                  </li>
                  <li className="step-card">
                    <div className="step-number-badge">3</div>
                    <p className="step-text">As soon as the dog sits, say “Sit”, then praise and treat.</p>
                  </li>
                  <li className="step-card">
                    <div className="step-number-badge">4</div>
                    <p className="step-text">Repeat several short sessions daily in different environments.</p>
                  </li>
                  <li className="step-card">
                    <div className="step-number-badge">5</div>
                    <p className="step-text">Phase out treats slowly by replacing them with praise.</p>
                  </li>
                </ol>

                <div className="media">
                  <img src="/assets/sit.jpg" className="img-center" alt="Dog learning to sit" />
                  <div className="video-wrapper">
                    <video controls preload="metadata">
                      <source src="/assets/videos/sit.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>

                {/* Stay */}
                <h3>Stay</h3>
                <p><strong>Purpose:</strong> “Stay” teaches your dog to remain in position. It’s critical for safety and self-control.</p>
                <p><strong>When to Use:</strong> At crosswalks, during grooming, or when you need to pause interaction.</p>
                
                <ol className="step-list">
                  <li className="step-card">
                    <div className="step-number-badge">1</div>
                    <p className="step-text">Ask your dog to “Sit”.</p>
                  </li>
                  <li className="step-card">
                    <div className="step-number-badge">2</div>
                    <p className="step-text">Show your palm like a “stop” signal and say “Stay”.</p>
                  </li>
                  <li className="step-card">
                    <div className="step-number-badge">3</div>
                    <p className="step-text">Take one step back. If the dog remains, return and reward.</p>
                  </li>
                  <li className="step-card">
                    <div className="step-number-badge">4</div>
                    <p className="step-text">Gradually increase distance and duration.</p>
                  </li>
                  <li className="step-card">
                    <div className="step-number-badge">5</div>
                    <p className="step-text">End the command with “Okay” or “Free” to release.</p>
                  </li>
                </ol>

                <div className="media">
                  <img src="/assets/stay.jpg" className="img-center" alt="Dog in a stay position" />
                  <div className="video-wrapper">
                    <video controls preload="metadata">
                      <source src="/assets/videos/stay.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>

                {/* Down */}
                <h3>Down</h3>
                <p><strong>Purpose:</strong> “Down” asks your dog to lie down completely. It’s used to calm your dog or keep them relaxed in high-energy places.</p>
                <p><strong>When to Use:</strong> At cafés, during long waits, or for calm behavior at home.</p>
                
                <ol className="step-list">
                  <li className="step-card">
                    <div className="step-number-badge">1</div>
                    <p className="step-text">Start from sitting. Hold a treat at their nose, then move it slowly to the ground.</p>
                  </li>
                  <li className="step-card">
                    <div className="step-number-badge">2</div>
                    <p className="step-text">Let their body follow. As elbows touch down, say “Down” and reward.</p>
                  </li>
                  <li className="step-card">
                    <div className="step-number-badge">3</div>
                    <p className="step-text">Practice short holds before releasing.</p>
                  </li>
                  <li className="step-card">
                    <div className="step-number-badge">4</div>
                    <p className="step-text">Gradually add distractions or longer durations.</p>
                  </li>
                </ol>

                <div className="media">
                  <img src="/assets/down.jpg" className="img-center" alt="Dog in down position" />
                  <div className="video-wrapper">
                    <video controls preload="metadata">
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
                <button className="close" onClick={closeModal} aria-label="Close modal">
                  <X size={18} />
                </button>
                <h2>
                  <Ban className="modal-title-icon" size={28} />
                  <span>Behavior Training</span>
                </h2>
                <p><strong>Purpose:</strong> Behavior training addresses unwanted actions like jumping, barking, chewing, or nipping — not through redirection and reinforcement of calm behavior.</p>

                {/* Jumping */}
                <h3>Jumping on People</h3>
                <ol className="step-list">
                  <li className="step-card">
                    <div className="step-number-badge">1</div>
                    <p className="step-text">Ignore the jumping completely — no eye contact, touch, or speech.</p>
                  </li>
                  <li className="step-card">
                    <div className="step-number-badge">2</div>
                    <p className="step-text">Turn your back. Wait until all four paws are on the ground.</p>
                  </li>
                  <li className="step-card">
                    <div className="step-number-badge">3</div>
                    <p className="step-text">Then reward calmly with “Good paws down!” and a treat.</p>
                  </li>
                  <li className="step-card">
                    <div className="step-number-badge">4</div>
                    <p className="step-text">Ask for a “Sit” instead when greeting people.</p>
                  </li>
                </ol>

                <div className="media">
                  <img src="/assets/jumping.jpg" className="img-center" alt="Dog jumping issue" />
                  <div className="video-wrapper">
                    <video controls preload="metadata">
                      <source src="/assets/videos/jumping.mp4" type="video/mp4" />
                    </video>
                  </div>
                </div>

                {/* Barking */}
                <h3>Excessive Barking</h3>
                <ol className="step-list">
                  <li className="step-card">
                    <div className="step-number-badge">1</div>
                    <p className="step-text">Identify the trigger (doorbell, other dogs, etc.).</p>
                  </li>
                  <li className="step-card">
                    <div className="step-number-badge">2</div>
                    <p className="step-text">Teach “Quiet” using positive interruption (clap once, say “Quiet”).</p>
                  </li>
                  <li className="step-card">
                    <div className="step-number-badge">3</div>
                    <p className="step-text">When the barking stops — reward immediately.</p>
                  </li>
                  <li className="step-card">
                    <div className="step-number-badge">4</div>
                    <p className="step-text">Gradually lengthen quiet time before rewarding.</p>
                  </li>
                </ol>

                <div className="media">
                  <img src="/assets/barking.jpg" className="img-center" alt="Dog barking" />
                  <div className="video-wrapper">
                    <video controls preload="metadata">
                      <source src="/assets/videos/barking.mp4" type="video/mp4" />
                    </video>
                  </div>
                </div>

                {/* Chewing */}
                <h3>Destructive Chewing</h3>
                <ol className="step-list">
                  <li className="step-card">
                    <div className="step-number-badge">1</div>
                    <p className="step-text">Keep valuable items out of reach.</p>
                  </li>
                  <li className="step-card">
                    <div className="step-number-badge">2</div>
                    <p className="step-text">Give a chew toy every time chewing begins.</p>
                  </li>
                  <li className="step-card">
                    <div className="step-number-badge">3</div>
                    <p className="step-text">Redirect and praise for chewing approved toys only.</p>
                  </li>
                </ol>

                <div className="media">
                  <img src="/assets/chewing.jpg" className="img-center" alt="Dog chewing on toy" />
                  <div className="video-wrapper">
                    <video controls preload="metadata">
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
                <button className="close" onClick={closeModal} aria-label="Close modal">
                  <X size={18} />
                </button>
                <h2>
                  <Calendar className="modal-title-icon" size={28} />
                  <span>Potty Training</span>
                </h2>
                <p><strong>Purpose:</strong> Potty training teaches your dog where and when it’s appropriate to relieve themselves. Early consistency prevents accidents and confusion.</p>
                <p><strong>When to Start:</strong> From the day you bring your puppy or dog home. Begin immediately.</p>

                <h3>Step-by-Step Indoor/Outdoor Training</h3>
                <ol className="step-list">
                  <li className="step-card">
                    <div className="step-number-badge">1</div>
                    <p className="step-text">Take your dog outside first thing in the morning, after naps, meals, and playtime.</p>
                  </li>
                  <li className="step-card">
                    <div className="step-number-badge">2</div>
                    <p className="step-text">Always go to the same potty spot to create habit.</p>
                  </li>
                  <li className="step-card">
                    <div className="step-number-badge">3</div>
                    <p className="step-text">Use a command like “Go potty” and wait silently.</p>
                  </li>
                  <li className="step-card">
                    <div className="step-number-badge">4</div>
                    <p className="step-text">Immediately praise and give a treat after they finish.</p>
                  </li>
                  <li className="step-card">
                    <div className="step-number-badge">5</div>
                    <p className="step-text">Keep a potty schedule to prevent indoor accidents.</p>
                  </li>
                  <li className="step-card">
                    <div className="step-number-badge">6</div>
                    <p className="step-text">Clean any mess indoors with enzymatic cleaner — don’t punish.</p>
                  </li>
                </ol>

                <img src="/assets/potty.jpg" className="img-center" alt="Puppy potty training outside" style={{ width: '100%', height: '300px', objectFit: 'cover', margin: '2rem 0 !important' }} />
                
                <h3>Accident Handling</h3>
                <p>Never scold. Dogs won’t understand after the fact. Instead, interrupt gently and lead them outside if caught mid-act.</p>
                
                <div className="video-wrapper" style={{ marginTop: '1.5rem' }}>
                  <video controls preload="metadata" style={{ width: '100%', height: '300px', borderRadius: '16px', objectFit: 'cover' }}>
                    <source src="/assets/videos/potty.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>
            </div>
          )}

          {/* Leash Training */}
          {openModalId === 'modal-leash' && (
            <div className="modal" onClick={closeModal}>
              <div className="modal-content" onClick={stopPropagation}>
                <button className="close" onClick={closeModal} aria-label="Close modal">
                  <X size={18} />
                </button>
                <h2>
                  <Compass className="modal-title-icon" size={28} />
                  <span>Leash Training</span>
                </h2>
                <p><strong>Purpose:</strong> Leash training teaches your dog to walk calmly by your side on a loose leash. It reduces stress, prevents pulling, and makes walks an enjoyable bonding activity.</p>

                <h3>Step-by-Step Loose Leash Walk</h3>
                <ol className="step-list">
                  <li className="step-card">
                    <div className="step-number-badge">1</div>
                    <p className="step-text">Reward your dog for simply standing next to you while on the leash.</p>
                  </li>
                  <li className="step-card">
                    <div className="step-number-badge">2</div>
                    <p className="step-text">Take a few steps forward. If the leash remains loose, reward with a treat.</p>
                  </li>
                  <li className="step-card">
                    <div className="step-number-badge">3</div>
                    <p className="step-text">If the dog pulls, stop immediately. Do not yank the leash — just be a "tree".</p>
                  </li>
                  <li className="step-card">
                    <div className="step-number-badge">4</div>
                    <p className="step-text">Wait for the dog to return to your side or turn to look at you, then reward.</p>
                  </li>
                  <li className="step-card">
                    <div className="step-number-badge">5</div>
                    <p className="step-text">Walk forward again, rewarding loose leash positioning frequently.</p>
                  </li>
                </ol>

                <img src="/assets/leash.jpg" className="img-center" alt="Dog loose leash walking outside" style={{ width: '100%', height: '300px', objectFit: 'cover', margin: '2rem 0 !important' }} />
              </div>
            </div>
          )}

          {/* Socialization Modal */}
          {openModalId === 'modal-social' && (
            <div className="modal" onClick={closeModal}>
              <div className="modal-content" onClick={stopPropagation}>
                <button className="close" onClick={closeModal} aria-label="Close modal">
                  <X size={18} />
                </button>
                <h2>
                  <Users className="modal-title-icon" size={28} />
                  <span>Socialization</span>
                </h2>

                <p><strong>Purpose:</strong> Socialization exposes your dog to people, environments, animals, and sounds to reduce fear, anxiety, or aggression later in life.</p>

                <h3>Step-by-Step Social Plan</h3>
                <ol className="step-list">
                  <li className="step-card">
                    <div className="step-number-badge">1</div>
                    <p className="step-text">Start with calm people at home — let the dog approach at their pace.</p>
                  </li>
                  <li className="step-card">
                    <div className="step-number-badge">2</div>
                    <p className="step-text">Use treats when introducing to new sounds (doorbell, vacuum, traffic).</p>
                  </li>
                  <li className="step-card">
                    <div className="step-number-badge">3</div>
                    <p className="step-text">Visit different safe locations: pet stores, parks, sidewalks.</p>
                  </li>
                  <li className="step-card">
                    <div className="step-number-badge">4</div>
                    <p className="step-text">Introduce calm dogs one-on-one — avoid off-leash chaos initially.</p>
                  </li>
                  <li className="step-card">
                    <div className="step-number-badge">5</div>
                    <p className="step-text">Track progress and keep sessions short + positive.</p>
                  </li>
                </ol>

                <img src="/assets/meet.jpg" className="img-center" alt="Dog meeting new people" style={{ width: '100%', height: '300px', objectFit: 'cover', margin: '2rem 0 !important' }} />

                <h3>Golden Rule</h3>
                <p>Never force — all interactions must be voluntary. Let your dog observe at a distance first if unsure.</p>

                <div className="media">
                  <img src="/assets/soical.jpg" className="img-center" alt="Dog socializing at the park" />
                  <div className="video-wrapper">
                    <video controls preload="metadata">
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
                <button className="close" onClick={closeModal} aria-label="Close modal">
                  <X size={18} />
                </button>
                <h2>
                  <Award className="modal-title-icon" size={28} />
                  <span>Advanced Training</span>
                </h2>

                <h3>Heel Command</h3>
                <p><strong>Purpose:</strong> Walks calmly next to you, matching pace, ignoring distractions.</p>
                
                <ol className="step-list">
                  <li className="step-card">
                    <div className="step-number-badge">1</div>
                    <p className="step-text">Start walking with your dog beside your left leg.</p>
                  </li>
                  <li className="step-card">
                    <div className="step-number-badge">2</div>
                    <p className="step-text">Say “Heel” and reward frequently while in position.</p>
                  </li>
                  <li className="step-card">
                    <div className="step-number-badge">3</div>
                    <p className="step-text">If dog strays, stop and reset with “Let’s go”.</p>
                  </li>
                </ol>

                <div className="media">
                  <img src="/assets/heel.jpg" className="img-center" alt="Dog learning heel command" />
                  <div className="video-wrapper">
                    <video controls preload="metadata">
                      <source src="/assets/videos/heel.mp4" type="video/mp4" />
                    </video>
                  </div>
                </div>

                <h3>Recall (Come When Called)</h3>
                <p>Build rock-solid recall by practicing daily.</p>
                
                <ol className="step-list">
                  <li className="step-card">
                    <div className="step-number-badge">1</div>
                    <p className="step-text">Use a long line in a quiet area.</p>
                  </li>
                  <li className="step-card">
                    <div className="step-number-badge">2</div>
                    <p className="step-text">Call “Come!” in an excited tone.</p>
                  </li>
                  <li className="step-card">
                    <div className="step-number-badge">3</div>
                    <p className="step-text">Reward with big praise and treats.</p>
                  </li>
                  <li className="step-card">
                    <div className="step-number-badge">4</div>
                    <p className="step-text">Never punish after recall.</p>
                  </li>
                </ol>

                <div className="media">
                  <img src="/assets/recall.jpg" className="img-center" alt="Dog practicing recall" />
                  <div className="video-wrapper">
                    <video controls preload="metadata">
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
                <button className="close" onClick={closeModal} aria-label="Close modal">
                  <X size={18} />
                </button>
                <h2>
                  <AlertTriangle className="modal-title-icon" size={28} />
                  <span>Common Mistakes</span>
                </h2>

                <p><strong>Purpose:</strong> Understanding what not to do in training can often be more important than knowing what to do. These mistakes often delay progress or damage your dog’s trust.</p>

                <div className="bullet-list">
                  <div className="bullet-card" style={{ alignItems: 'flex-start' }}>
                    <span className="bullet-card-icon" style={{ marginTop: '2px' }}>
                      <X size={18} />
                    </span>
                    <div>
                      <h4 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.1rem', fontWeight: '400', color: 'var(--accent-dark)', marginBottom: '4px' }}>Repeating Commands</h4>
                      <p className="bullet-card-text" style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>Don’t say “Sit sit sit sit…” — it weakens the cue. Say it once, then wait or gently reset.</p>
                    </div>
                  </div>
                  
                  <div className="bullet-card" style={{ alignItems: 'flex-start' }}>
                    <span className="bullet-card-icon" style={{ marginTop: '2px' }}>
                      <AlertTriangle size={18} />
                    </span>
                    <div>
                      <h4 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.1rem', fontWeight: '400', color: 'var(--accent-dark)', marginBottom: '4px' }}>Training When Angry</h4>
                      <p className="bullet-card-text" style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>Dogs sense frustration. Never train if you’re tired, frustrated, or angry — it’ll confuse or scare your dog.</p>
                    </div>
                  </div>

                  <div className="bullet-card" style={{ alignItems: 'flex-start' }}>
                    <span className="bullet-card-icon" style={{ marginTop: '2px' }}>
                      <Ban size={18} />
                    </span>
                    <div>
                      <h4 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.1rem', fontWeight: '400', color: 'var(--accent-dark)', marginBottom: '4px' }}>Punishing After the Fact</h4>
                      <p className="bullet-card-text" style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>Dogs don’t link punishment to earlier behavior. If your dog peed 5 minutes ago, correcting them now won’t teach anything.</p>
                    </div>
                  </div>

                  <div className="bullet-card" style={{ alignItems: 'flex-start' }}>
                    <span className="bullet-card-icon" style={{ marginTop: '2px' }}>
                      <Scale size={18} />
                    </span>
                    <div>
                      <h4 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.1rem', fontWeight: '400', color: 'var(--accent-dark)', marginBottom: '4px' }}>Inconsistent Rules</h4>
                      <p className="bullet-card-text" style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>If one person allows couch access and another punishes it — your dog won’t know what’s right. Make household rules clear and consistent.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tools & Enrichment Modal */}
          {openModalId === 'modal-tools' && (
            <div className="modal" onClick={closeModal}>
              <div className="modal-content" onClick={stopPropagation}>
                <button className="close" onClick={closeModal} aria-label="Close modal">
                  <X size={18} />
                </button>
                <h2>
                  <Wrench className="modal-title-icon" size={28} />
                  <span>Tools & Enrichment</span>
                </h2>

                <p><strong>Purpose:</strong> Mental stimulation and proper tools help prevent boredom and enhance training results.</p>

                <h3>Enrichment Tools</h3>
                <div className="bullet-list">
                  <div className="bullet-card">
                    <span className="bullet-card-icon">
                      <Sparkles size={18} />
                    </span>
                    <p className="bullet-card-text">Snuffle mats — let your dog forage for food.</p>
                  </div>
                  <div className="bullet-card">
                    <span className="bullet-card-icon">
                      <Heart size={18} />
                    </span>
                    <p className="bullet-card-text">KONG toys — stuff with frozen treats.</p>
                  </div>
                  <div className="bullet-card">
                    <span className="bullet-card-icon">
                      <Clock size={18} />
                    </span>
                    <p className="bullet-card-text">Puzzle bowls — slow down fast eaters.</p>
                  </div>
                </div>
                
                <img src="/assets/en.jpg" className="img-center" alt="Enrichment tools" style={{ width: '100%', height: '300px', objectFit: 'cover', margin: '2rem 0 !important' }} />

                <h3>Play & Chew</h3>
                <div className="bullet-list">
                  <div className="bullet-card">
                    <span className="bullet-card-icon">
                      <Activity size={18} />
                    </span>
                    <p className="bullet-card-text">Use rope toys and fetch balls daily.</p>
                  </div>
                  <div className="bullet-card">
                    <span className="bullet-card-icon">
                      <RotateCcw size={18} />
                    </span>
                    <p className="bullet-card-text">Rotate toys weekly to renew interest.</p>
                  </div>
                </div>
                
                <img src="/assets/play.jpg" className="img-center" alt="Dog playing with toys" style={{ width: '100%', height: '300px', objectFit: 'cover', margin: '2rem 0 !important' }} />

                <h3>Tools to Avoid</h3>
                <p>Prong collars, electric shock collars, and choke chains are harmful. Stick to humane, positive training aids.</p>
                
                <img src="/assets/bite.jpg" className="img-center" alt="Avoid harmful tools" style={{ width: '100%', height: '300px', objectFit: 'cover', margin: '2rem 0 !important' }} />
              </div>
            </div>
          )}
        </>
      )}

      {/* Floating Back to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="back-to-top-btn"
        aria-label="Back to top"
      >
        <ArrowUp size={18} />
      </button>

      {/* Branded Premium Footer */}
      <footer className="training-footer">
        <p>
          Built with love by <strong>BreedLy</strong> – “Because every good dog deserves a good life.”
        </p>
      </footer>
    </div>
  );
}
