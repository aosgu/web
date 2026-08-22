import { useState } from 'react';
import Folder from './components/Folder';

function PlusButton() {
  return (
    <button
      type="button"
      className="grid h-[58px] w-[58px] place-items-center rounded-[18px] bg-neutral-900 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black active:scale-95"
      style={{
        boxShadow:
          '0 10px 20px -8px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.6)',
      }}
      aria-label="Add file"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </button>
  );
}

function DotsButton() {
  return (
    <button
      type="button"
      className="rounded-[14px] border border-neutral-300/80 bg-white/60 px-4 py-2.5 font-mono text-[15px] leading-none tracking-[0.18em] text-neutral-700 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-white active:scale-95"
      style={{ boxShadow: '0 6px 14px -8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.9)' }}
      aria-label="More"
    >
      ooo
    </button>
  );
}

/** the white document sheets that peek out of the "Archives" folder */
function Sheets() {
  return (
    <>
      <div
        className="absolute rounded-[16px]"
        style={{
          left: 78,
          top: -46,
          width: 218,
          height: 200,
          background: 'linear-gradient(180deg,#ffffff 0%,#fdfdfe 55%,#e9ebef 100%)',
          boxShadow: '0 14px 26px -18px rgba(12,14,20,0.7)',
        }}
      />
      <div
        className="absolute rounded-[14px]"
        style={{
          left: 96,
          top: -70,
          width: 182,
          height: 190,
          background: 'linear-gradient(180deg,#ffffff 0%,#f4f5f8 100%)',
          boxShadow: '0 12px 22px -16px rgba(12,14,20,0.6)',
        }}
      />
    </>
  );
}

export default function App() {
  const [openAll, setOpenAll] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f1f1f1] text-neutral-900">
      {/* dotted backdrop */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(0,0,0,0.13) 1.4px, transparent 1.5px)',
          backgroundSize: '22px 22px',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.35) 45%, rgba(226,226,229,0.55) 100%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[12px] uppercase tracking-[0.32em] text-neutral-500">
              pure css / svg — no images
            </p>
            <h1 className="mt-3 text-4xl font-medium tracking-tight text-neutral-900 sm:text-5xl">
              Frosted Folders
            </h1>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-neutral-500">
              Glassmorphic folder icons built from clip-path silhouettes, backdrop blur and layered
              gradient artwork. Hover a folder to open it.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpenAll((v) => !v)}
            className="w-fit rounded-full border border-neutral-300 bg-white/70 px-5 py-2.5 text-sm font-medium text-neutral-700 shadow-sm backdrop-blur transition hover:bg-white active:scale-95"
          >
            {openAll ? 'Close all' : 'Open all'}
          </button>
        </header>

        <div className="mt-16 grid justify-items-center gap-y-24 sm:mt-20 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-28">
          <div className="lg:pt-4">
            <Folder
              width={340}
              height={252}
              frontTop={44}
              tabWidth={158}
              step={48}
              theme="glass"
              variant="aurora"
              title="My Files"
              action={<PlusButton />}
              forceOpen={openAll}
            />
            <Caption label="Glass" meta="backdrop-filter: blur(22px)" />
          </div>

          <div className="lg:pt-28">
            <Folder
              width={340}
              height={252}
              frontTop={62}
              tabWidth={150}
              step={44}
              theme="white"
              variant="plum"
              title="Archives"
              peek={<Sheets />}
              action={<DotsButton />}
              forceOpen={openAll}
            />
            <Caption label="Paper" meta="documents peek on hover" />
          </div>

          <div className="lg:-mt-10">
            <Folder
              width={340}
              height={252}
              frontTop={52}
              tabWidth={168}
              step={50}
              theme="dark"
              variant="ember"
              title="My Files"
              subtitle="Wed 19 Aug"
              align="right"
              forceOpen={openAll}
            />
            <Caption label="Noir" meta="smoked glass over marble" />
          </div>

          <div className="lg:pt-14">
            <Folder
              width={340}
              height={252}
              frontTop={48}
              tabWidth={162}
              step={46}
              theme="glass"
              variant="ink"
              title="Projects"
              subtitle="24 items"
              action={<PlusButton />}
              forceOpen={openAll}
            />
            <Caption label="Ink" meta="clip-path folder silhouette" />
          </div>
        </div>

        <footer className="mt-28 border-t border-neutral-300/70 pt-6 font-mono text-[12px] uppercase tracking-[0.28em] text-neutral-400">
          react · tailwind · svg clip-path
        </footer>
      </div>
    </div>
  );
}

function Caption({ label, meta }: { label: string; meta: string }) {
  return (
    <div className="mt-8 flex w-[340px] items-baseline justify-between">
      <span className="text-sm font-medium tracking-tight text-neutral-700">{label}</span>
      <span className="font-mono text-[11px] tracking-tight text-neutral-400">{meta}</span>
    </div>
  );
}
