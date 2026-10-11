import { useEffect, useState } from 'react';
import { motion, MotionConfig, useReducedMotion } from 'framer-motion';
import Anatomy from './components/Anatomy';
import DataExplorer from './components/DataExplorer';
import Icon from './components/Icon';
import StudyDialog from './components/StudyDialog';
import Variability from './components/Variability';
import { study, type Outcome, type Region } from './data/study';
import { useSound } from './hooks/useSound';

function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <span className={`brand ${footer ? 'brand-footer' : ''}`}>
      <svg viewBox="0 0 32 34" width="29" height="32" fill="none" aria-hidden="true"><path d="M3 8v18M10 3v28M17 8v18M24 12v10" stroke="currentColor" strokeWidth="3" /><path d="M0 17h28" stroke="currentColor" strokeWidth="2" /></svg>
      <span>LOAD<span className="brand-slash">/</span><br />PARADOX</span>
    </span>
  );
}

const studyNotes = [
  { title: 'One person, two loading conditions.', content: <>Twenty healthy young men trained for 10 weeks, three times a week. Arms and legs were randomly assigned to higher or lower loads. Both conditions used three sets of unilateral biceps curls or knee extensions taken to volitional fatigue. This design compared different loads within the same person.</> },
  { title: 'More than one way to measure growth.', content: <>Researchers measured fat- and bone-free mass using DXA, muscle thickness and cross-sectional area using ultrasound, and muscle fibre area using biopsies. These measurements are not interchangeable: the study found limited relationships between different indices of hypertrophy.</> },
  { title: 'A finding, not a universal prescription.', content: <>The study involved only healthy young men and lasted 10 weeks. It does not establish identical effects for every person, population or training program. A non-significant difference is not proof of equivalence, and the findings depend on the high effort used in both loading conditions.</> },
];

export default function App() {
  const [region, setRegion] = useState<Region>('upper');
  const [outcome, setOutcome] = useState<Outcome>('hypertrophy');
  const [replayKey, setReplayKey] = useState(0);
  const [activeSection, setActiveSection] = useState('overview');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [dialog, setDialog] = useState<'data' | 'protocol' | null>(null);
  const { enabled: soundEnabled, toggle: toggleSound, play: playSound } = useSound();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActiveSection(entry.target.id); });
    }, { rootMargin: '-15% 0px -60% 0px' });
    ['overview', 'explore', 'study'].forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mobileMenu) return;
    const onEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenu(false);
        document.querySelector<HTMLButtonElement>('.mobile-menu-button')?.focus();
      }
    };
    const onOutsideClick = (event: PointerEvent) => {
      if (event.target instanceof Element && !event.target.closest('.site-header')) setMobileMenu(false);
    };
    window.addEventListener('keydown', onEscape);
    document.addEventListener('pointerdown', onOutsideClick);
    return () => {
      window.removeEventListener('keydown', onEscape);
      document.removeEventListener('pointerdown', onOutsideClick);
    };
  }, [mobileMenu]);

  function navigate(id: string) {
    setMobileMenu(false);
    setActiveSection(id);
    playSound();
  }

  function selectMuscle(next: Region) {
    setMobileMenu(false);
    setRegion(next);
    setOutcome('hypertrophy');
    setActiveSection('explore');
    document.getElementById('explore')?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' });
    document.getElementById('explorer-heading')?.focus({ preventScroll: true });
  }

  return (
    <MotionConfig reducedMotion="user">
      <a href="#explore" className="skip-link">Skip to the interactive data</a>
      <header className="site-header">
        <div className="header-inner section-shell">
          <a href="#overview" className="brand-link" aria-label="Load Paradox, back to overview" onClick={() => navigate('overview')}><Brand /></a>
          <span className="brand-descriptor">A DIFFERENT PERSPECTIVE<br />ON MUSCLE GROWTH</span>
          <nav className={`main-nav ${mobileMenu ? 'is-open' : ''}`} aria-label="Main navigation" id="main-navigation">
            {[{ id: 'overview', label: 'Overview' }, { id: 'explore', label: 'Explore the data' }, { id: 'study', label: 'The study' }].map((item) => <a key={item.id} href={`#${item.id}`} className={activeSection === item.id ? 'active' : ''} aria-current={activeSection === item.id ? 'location' : undefined} onClick={() => navigate(item.id)}>{item.label}</a>)}
          </nav>
          <div className="header-actions">
            <button className={`sound-button ${soundEnabled ? 'is-on' : ''}`} onClick={toggleSound} aria-pressed={soundEnabled} aria-label={`Interaction sounds ${soundEnabled ? 'on' : 'off'}. Click to ${soundEnabled ? 'mute' : 'enable'}.`} title={`Turn sounds ${soundEnabled ? 'off' : 'on'}`}><Icon name={soundEnabled ? 'sound' : 'muted'} size={17} /><span>Sound {soundEnabled ? 'on' : 'off'}</span></button>
            <a className="paper-button" href={study.url} target="_blank" rel="noreferrer" aria-label="Read the original paper, opens in a new tab" onClick={() => playSound('open')}><span>Read the paper</span><Icon name="arrow-up-right" size={15} /></a>
            <button className="mobile-menu-button icon-button" aria-label={mobileMenu ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileMenu} aria-controls="main-navigation" onClick={() => { setMobileMenu(!mobileMenu); playSound(); }}><Icon name={mobileMenu ? 'close' : 'menu'} size={22} /></button>
          </div>
        </div>
      </header>

      <main>
        <section id="overview" className="hero" aria-labelledby="hero-heading">
          <div className="hero-grid-plane" aria-hidden="true" />
          <div className="hero-inner section-shell">
            <motion.div className="hero-copy" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>
              <div className="hero-eyebrow"><span className="live-mark"><i /><i /><i /></span> SCIENCE, NOT GYM LORE.</div>
              <h1 id="hero-heading">The load<br /><em>paradox.</em></h1>
              <p className="hero-description"><strong>Different weights. Similar muscle growth.</strong><br />An interactive look at what happens when<br className="desktop-break" /> different loads meet the same effort.</p>
              <div className="hero-actions">
                <a className="primary-button" href="#explore" onClick={() => navigate('explore')}>Explore the data <Icon name="arrow-down" size={18} /></a>
                <button className="protocol-link" onClick={() => { setDialog('protocol'); playSound('open'); }}>The experiment <Icon name="arrow-up-right" size={14} /></button>
              </div>
            </motion.div>
            <div className="anatomy-stage">
              <Anatomy key={replayKey} region={region} onSelect={selectMuscle} playSound={playSound} />
              <button className="replay-button" onClick={() => { setReplayKey((key) => key + 1); playSound('replay'); }} title="Replay the anatomical reveal"><Icon name="replay" size={14} /><span>Replay</span></button>
            </div>
            <div className="hero-bottomline"><span className="hero-source">LEES ET AL. <span>/</span> J PHYSIOL. 2025</span><span className="anatomy-hint"><Icon name="plus" size={11} /> SELECT A MUSCLE. FOLLOW THE EVIDENCE.</span><a className="scroll-cue" href="#explore" aria-label="Scroll to explore the evidence" onClick={() => navigate('explore')}><Icon name="arrow-down" size={15} /></a></div>
          </div>
        </section>

        <DataExplorer region={region} setRegion={setRegion} outcome={outcome} setOutcome={setOutcome} playSound={playSound} onExplain={() => setDialog('data')} />
        <Variability playSound={playSound} />

        <section className="study-section section-shell" id="study" aria-labelledby="study-heading">
          <div className="study-main">
            <div className="study-copy"><div className="section-kicker"><span><span className="section-number">04</span> / KNOW THE CONTEXT</span></div><h2 id="study-heading">The study.<br /><span className="muted-heading">Not the whole story.</span></h2><p>Good science asks a specific question.<br />Understanding the boundaries matters.</p></div>
            <div className="study-accordion">
              {studyNotes.map((note, index) => <details key={note.title} className="study-note" open={index === 0 ? true : undefined}><summary onClick={() => playSound()}><span className="note-index">0{index + 1}</span><span>{note.title}</span><Icon name="plus" size={18} /></summary><p>{note.content}</p></details>)}
            </div>
          </div>
          <div className="citation"><div className="citation-label"><span className="status-dot" /> THE ORIGINAL RESEARCH</div><div className="citation-content"><a className="citation-title" href={study.url} target="_blank" rel="noreferrer" onClick={() => playSound('open')}>{study.title}<Icon name="arrow-up-right" size={22} /></a><p>{study.authors} <span>{study.journal}.</span> Published {study.date}.</p><a className="doi-link" href={study.url} target="_blank" rel="noreferrer">DOI: {study.doi}</a></div></div>
        </section>
      </main>

      <footer className="site-footer section-shell"><a href="#overview" aria-label="Load Paradox, back to top" onClick={() => navigate('overview')}><Brand footer /></a><p>An independent visual exploration.<br /><span>Evidence over assumptions.</span></p><a className="back-to-top" href="#overview" onClick={() => navigate('overview')}>Back to top <Icon name="arrow-down" size={14} /></a></footer>
      <StudyDialog type={dialog} onClose={() => { setDialog(null); playSound(); }} />
    </MotionConfig>
  );
}
