import { useEffect, useRef, useState, type CSSProperties } from "react";

const channels = [
  {
    name: "Blue Hour",
    description: "For the long way home.",
    frequency: 110,
    label: "110 HZ",
    color: "#7794ff",
  },
  {
    name: "Red Rooms",
    description: "For staying out a little longer.",
    frequency: 146.83,
    label: "147 HZ",
    color: "#ff506b",
  },
  {
    name: "Soft Focus",
    description: "For finding a little quiet.",
    frequency: 220,
    label: "220 HZ",
    color: "#a9b8ff",
  },
];

function BrandMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" className="brand-mark">
      <circle cx="20" cy="20" r="19" fill="#ff506b" />
      <path d="M20 1a19 19 0 0 1 0 38Z" fill="#4668ff" />
      <circle cx="20" cy="20" r="5" fill="#f5f0e8" />
    </svg>
  );
}

function PlayMark({ playing }: { playing: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="play-mark">
      {playing ? (
        <path d="M8 6v12M16 6v12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      ) : (
        <path d="m9 6 10 6-10 6V6Z" fill="currentColor" />
      )}
    </svg>
  );
}

function ArrowMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="arrow-mark">
      <path d="M4.5 12h14m-5.5-5.5 5.5 5.5-5.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RecordArtwork() {
  const grooves = [
    { radius: 320, opacity: 0.2 },
    { radius: 304, opacity: 0.32 },
    { radius: 287, opacity: 0.22 },
    { radius: 269, opacity: 0.35 },
    { radius: 251, opacity: 0.24 },
    { radius: 231, opacity: 0.28 },
    { radius: 212, opacity: 0.22 },
    { radius: 194, opacity: 0.3 },
    { radius: 175, opacity: 0.23 },
  ];
  const ticks = Array.from({ length: 36 }, (_, index) => {
    const angle = (index / 36) * Math.PI * 2;
    const innerRadius = index % 3 === 0 ? 326 : 332;
    const outerRadius = 342;
    return {
      key: index,
      x1: 700 + Math.cos(angle) * innerRadius,
      y1: 500 + Math.sin(angle) * innerRadius,
      x2: 700 + Math.cos(angle) * outerRadius,
      y2: 500 + Math.sin(angle) * outerRadius,
    };
  });

  return (
    <svg viewBox="0 0 1000 1000" className="record-art" aria-hidden="true">
      <defs>
        <radialGradient id="vinyl" cx="38%" cy="34%" r="72%">
          <stop offset="0" stopColor="#2848e8" />
          <stop offset="0.66" stopColor="#172c9f" />
          <stop offset="1" stopColor="#101a57" />
        </radialGradient>
        <radialGradient id="label" cx="34%" cy="25%" r="88%">
          <stop offset="0" stopColor="#ff8290" />
          <stop offset="1" stopColor="#f23d5d" />
        </radialGradient>
        <filter id="record-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="36" />
        </filter>
      </defs>

      <circle cx="700" cy="500" r="392" fill="#f53c5b" opacity="0.25" filter="url(#record-glow)" />
      <ellipse className="orbit-line" cx="700" cy="500" rx="455" ry="185" fill="none" stroke="#a0afff" strokeWidth="1.5" strokeDasharray="2 13" opacity="0.75" transform="rotate(-29 700 500)" />
      <circle cx="292" cy="254" r="7" fill="#ff6478" className="orbit-star" />
      <circle cx="1040" cy="530" r="5" fill="#b8c3ff" className="orbit-star orbit-star-late" />

      <g className="record-spin">
        <circle cx="700" cy="500" r="365" fill="#f34460" />
        <circle cx="700" cy="500" r="347" fill="url(#vinyl)" stroke="#ff93a1" strokeOpacity="0.6" strokeWidth="1.5" />
        {grooves.map((groove) => (
          <circle
            key={groove.radius}
            cx="700"
            cy="500"
            r={groove.radius}
            fill="none"
            stroke="#a9b7ff"
            strokeOpacity={groove.opacity}
            strokeWidth="1.4"
          />
        ))}
        {ticks.map((tick) => (
          <line
            key={tick.key}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke="#ffe1dc"
            strokeOpacity="0.72"
            strokeWidth="2"
            strokeLinecap="round"
          />
        ))}
        <circle cx="700" cy="500" r="142" fill="#0e1a61" stroke="#93a7ff" strokeOpacity="0.6" strokeWidth="2" />
        <circle cx="700" cy="500" r="125" fill="url(#label)" />
        <circle cx="700" cy="500" r="101" fill="none" stroke="#ffc1c7" strokeOpacity="0.45" strokeWidth="1" />
        <text x="700" y="490" textAnchor="middle" fill="#fff1df" className="record-type">RT / 001</text>
        <text x="700" y="511" textAnchor="middle" fill="#fff1df" className="record-subtype">ROOMTONE</text>
        <circle cx="700" cy="500" r="7" fill="#101a57" stroke="#fff1df" strokeWidth="2" />
      </g>

      <path className="signal-sweep" d="M32 630C186 627 197 474 326 481s145 145 255 145 99-121 166-121 67 57 123 57 80-59 128-62" fill="none" stroke="#ff6478" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M42 649H344" stroke="#8099ff" strokeWidth="1" strokeOpacity="0.38" />
      <circle cx="326" cy="481" r="4" fill="#ffd4cf" />
    </svg>
  );
}

function SignalWave({ playing, color, channelIndex }: { playing: boolean; color: string; channelIndex: number }) {
  const bars = Array.from({ length: 48 }, (_, index) => {
    const position = index / 47;
    const envelope = 0.24 + Math.sin(position * Math.PI) * 0.76;
    const rhythm = Math.abs(Math.sin(index * 0.67 + channelIndex * 1.15));
    const height = 12 + rhythm * (channelIndex === 1 ? 70 : 58) * envelope;

    return (
      <rect
        key={index}
        x={position * 496 + 2}
        y={56 - height / 2}
        width="3.5"
        height={height}
        rx="1.75"
        style={{ animationDelay: `${index * -31}ms` }}
      />
    );
  });

  return (
    <svg className={`signal-wave${playing ? " is-playing" : ""}`} viewBox="0 0 500 112" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 56h500" stroke="#d8deff" strokeOpacity="0.2" strokeWidth="1" />
      <g fill={color} className="wave-bars">
        {bars}
      </g>
    </svg>
  );
}

export default function App() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioNotice, setAudioNotice] = useState("");
  const heroArtworkRef = useRef<SVGSVGElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRefs = useRef<OscillatorNode[]>([]);
  const masterGainRef = useRef<GainNode | null>(null);
  const playingRef = useRef(false);
  const channel = channels[selectedIndex];

  function stopSignal() {
    const context = audioContextRef.current;
    const masterGain = masterGainRef.current;

    if (context && masterGain) {
      masterGain.gain.cancelScheduledValues(context.currentTime);
      masterGain.gain.setTargetAtTime(0.0001, context.currentTime, 0.06);
      oscillatorRefs.current.forEach((oscillator) => {
        try {
          oscillator.stop(context.currentTime + 0.45);
        } catch {
          // The oscillator may already be stopping after a rapid toggle.
        }
      });
    }

    oscillatorRefs.current = [];
    masterGainRef.current = null;
    playingRef.current = false;
    setIsPlaying(false);
  }

  function toggleSignal() {
    if (playingRef.current) {
      stopSignal();
      return;
    }

    try {
      const context = audioContextRef.current ?? new window.AudioContext();
      audioContextRef.current = context;

      const masterGain = context.createGain();
      masterGain.gain.setValueAtTime(0.0001, context.currentTime);
      masterGain.gain.setTargetAtTime(0.014, context.currentTime, 0.7);
      masterGain.connect(context.destination);

      const oscillators = [
        context.createOscillator(),
        context.createOscillator(),
      ];
      oscillators[0].type = "sine";
      oscillators[0].frequency.setValueAtTime(channel.frequency, context.currentTime);
      oscillators[1].type = "sine";
      oscillators[1].frequency.setValueAtTime(channel.frequency * 1.5, context.currentTime);
      oscillators.forEach((oscillator) => {
        oscillator.connect(masterGain);
        oscillator.start();
      });

      oscillatorRefs.current = oscillators;
      masterGainRef.current = masterGain;
      playingRef.current = true;
      setIsPlaying(true);
      setAudioNotice("");
      void context.resume().catch(() => {
        setAudioNotice("Audio could not start in this browser.");
        stopSignal();
      });
    } catch {
      setAudioNotice("Audio is not available in this browser.");
    }
  }

  useEffect(() => {
    if (!isPlaying || !audioContextRef.current) return;

    oscillatorRefs.current.forEach((oscillator, index) => {
      const frequency = channel.frequency * (index === 0 ? 1 : 1.5);
      oscillator.frequency.setTargetAtTime(frequency, audioContextRef.current!.currentTime, 0.35);
    });
  }, [channel.frequency, isPlaying]);

  useEffect(() => {
    return () => {
      oscillatorRefs.current.forEach((oscillator) => {
        try {
          oscillator.stop();
        } catch {
          // The oscillator may already be stopped during unmount.
        }
      });
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        void audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <main id="top">
      <section
        className="hero"
        aria-labelledby="hero-title"
        onPointerMove={(event) => {
          if (event.pointerType !== "mouse" || !heroArtworkRef.current) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          const x = (event.clientX - bounds.left) / bounds.width - 0.5;
          const y = (event.clientY - bounds.top) / bounds.height - 0.5;
          heroArtworkRef.current.style.setProperty("--parallax-x", `${x * -15}px`);
          heroArtworkRef.current.style.setProperty("--parallax-y", `${y * -12}px`);
        }}
        onPointerLeave={() => {
          heroArtworkRef.current?.style.setProperty("--parallax-x", "0px");
          heroArtworkRef.current?.style.setProperty("--parallax-y", "0px");
        }}
      >
        <div className="hero-grain" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />
        <RecordArtwork />

        <header className="site-header">
          <a className="brand" href="#top" aria-label="Roomtone home">
            <BrandMark />
            <span>roomtone</span>
          </a>
          <nav className="main-nav" aria-label="Main navigation">
            <a href="#frequency">The frequency</a>
            <a href="#about">Our idea</a>
          </nav>
          <button className="header-listen" type="button" onClick={toggleSignal} aria-pressed={isPlaying}>
            <span className={`live-dot${isPlaying ? " is-on" : ""}`} aria-hidden="true" />
            <span>{isPlaying ? "Signal on" : "Listen in"}</span>
            <ArrowMark />
          </button>
        </header>

        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow"><span />Independent radio for curious ears</p>
          <h1 id="hero-title" className="hero-title">
            <span>ROOM</span>
            <span className="hero-title-second">TONE<span className="title-period">.</span></span>
          </h1>
          <p className="hero-description">A little space for the sounds that stay with you.</p>
          <div className="hero-actions">
            <a className="hero-link" href="#frequency">
              Find your frequency <ArrowMark />
            </a>
            <button className="hero-audio-link" type="button" onClick={toggleSignal} aria-pressed={isPlaying}>
              <span className="small-play"><PlayMark playing={isPlaying} /></span>
              {isPlaying ? "Pause the tone" : "Hear the tone"}
            </button>
          </div>
        </div>
      </section>

      <section className="frequency-section" id="frequency" aria-labelledby="frequency-title">
        <div className="section-wrap">
          <div className="frequency-heading">
            <p className="eyebrow section-eyebrow"><span />THE DIAL / 001-003</p>
            <div className="frequency-heading-row">
              <h2 id="frequency-title">Find your<br /><em>frequency.</em></h2>
              <p className="frequency-intro">Three small signals, composed in real time. Choose a mood and stay for a moment.</p>
            </div>
          </div>

          <div className="tuner-layout">
            <div className="channel-picker" role="group" aria-label="Choose a frequency">
              <p className="field-label">CHOOSE A LISTENING MOOD</p>
              <div className="channel-options">
                {channels.map((option, index) => (
                  <button
                    className="channel-option"
                    type="button"
                    key={option.name}
                    aria-pressed={selectedIndex === index}
                    onClick={() => setSelectedIndex(index)}
                    style={{ "--channel-color": option.color } as CSSProperties}
                  >
                    <span className="option-index">0{index + 1}</span>
                    <span className="option-copy">
                      <span className="option-name">{option.name}</span>
                      <span className="option-description">{option.description}</span>
                    </span>
                    <span className="option-arrow"><ArrowMark /></span>
                  </button>
                ))}
              </div>
              <p className="channel-footnote">A softer signal, made just for you.</p>
            </div>

            <div className={`signal-console${isPlaying ? " is-playing" : ""}`} id="signal-console" style={{ "--signal-color": channel.color } as CSSProperties}>
              <svg className="console-geometry" viewBox="0 0 700 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <circle cx="535" cy="215" r="188" fill="none" stroke="currentColor" strokeOpacity="0.15" />
                <circle cx="535" cy="215" r="149" fill="none" stroke="currentColor" strokeOpacity="0.22" strokeDasharray="1 7" />
                <circle cx="535" cy="215" r="108" fill="currentColor" fillOpacity="0.08" />
                <path d="M220 216h620M535 -80v590" stroke="currentColor" strokeOpacity="0.12" />
                <path d="M296 332c75-204 141-204 218 0s143 204 218 0" fill="none" stroke="currentColor" strokeOpacity="0.28" strokeWidth="1.2" />
              </svg>
              <div className="console-topline">
                <span>ROOMTONE / TONE STUDY</span>
                <span className="console-status"><i />{isPlaying ? "SIGNAL OPEN" : "STANDING BY"}</span>
              </div>
              <div className="console-wave-wrap">
                <SignalWave playing={isPlaying} color={channel.color} channelIndex={selectedIndex} />
              </div>
              <div className="console-bottomline">
                <button className="console-play" type="button" onClick={toggleSignal} aria-label={isPlaying ? "Pause ambient tone" : "Play ambient tone"} aria-pressed={isPlaying}>
                  <PlayMark playing={isPlaying} />
                </button>
                <div className="console-track" aria-live="polite">
                  <span>NOW TUNED TO</span>
                  <strong>{channel.name}</strong>
                </div>
                <span className="console-frequency">{channel.label}</span>
              </div>
              <p className="console-caption" role={audioNotice ? "status" : undefined}>
                {audioNotice || "A gentle, original tone generated in your browser."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section" id="about" aria-labelledby="about-title">
        <div className="about-wrap">
          <div className="about-kicker">
            <p className="eyebrow"><span />A NOTE FROM THE STATION</p>
            <span className="about-edition">ROOMTONE / VOL. 01</span>
          </div>
          <div className="about-content">
            <h2 id="about-title">Make room<br />for <em>feeling.</em></h2>
            <div className="about-copy">
              <p className="about-lede">Good listening is not about having more. It is about noticing more.</p>
              <p>Roomtone is a small, independent experiment in slower listening: no feeds, no rush, just a few carefully tuned signals for wherever you are.</p>
              <a href="#frequency" className="about-link">Return to the dial <ArrowMark /></a>
            </div>
          </div>
          <svg className="about-wave" viewBox="0 0 1440 150" preserveAspectRatio="none" aria-hidden="true">
            <path d="M-20 92c54 0 54-38 108-38s54 76 108 76 54-76 108-76 54 38 108 38 54-57 108-57 54 94 108 94 54-94 108-94 54 57 108 57 54-39 108-39 54 76 108 76 54-76 108-76 54 39 108 39 54-20 108-20" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      </section>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#top" aria-label="Roomtone, back to top">
          <BrandMark />
          <span>roomtone</span>
        </a>
        <p>Independent by nature. Transmitting everywhere.</p>
        <a href="#top" className="back-to-top">Back to top <ArrowMark /></a>
      </footer>
    </main>
  );
}