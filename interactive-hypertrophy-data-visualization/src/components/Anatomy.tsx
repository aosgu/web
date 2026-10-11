import { useId, useState, type KeyboardEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Region } from '../data/study';
import type { PlaySound } from '../hooks/useSound';

interface AnatomyProps {
  region: Region;
  onSelect: (region: Region) => void;
  playSound: PlaySound;
}

const coreMuscles = [
  'M282 121 278 145 Q250 155 226 166 L267 170 295 155 296 128Z',
  'M294 165 C266 150 235 154 219 174 C211 192 215 220 229 231 C252 237 280 234 295 225Z',
  'M221 162 C203 161 185 175 176 194 C166 213 164 232 171 247 C188 241 203 224 213 201Z',
  'M213 233 Q206 257 215 287 L242 326 257 294 251 250Z',
  'M220 280 Q210 315 219 344 L251 382 264 362 246 327Z',
  'M219 345 Q217 375 228 401 L278 427 290 403 256 380Z',
  'M269 240 Q280 236 296 240 L296 268 Q280 272 267 264Z',
  'M267 275 Q281 274 296 277 L296 301 Q280 305 266 296Z',
  'M267 306 Q282 307 296 309 L296 333 Q281 337 270 329Z',
  'M272 339 Q284 341 296 343 L296 369 Q282 373 275 361Z',
  'M277 373 Q286 377 297 379 L297 404 286 420 280 401Z',
  'M165 247 Q148 264 140 314 L150 327 Q149 293 168 263Z',
  'M148 334 C132 349 122 392 117 428 L126 443 C146 424 161 384 165 345Z',
  'M167 341 Q168 370 145 416 L130 447 142 427 Q164 401 176 360Z',
  'M121 443 Q114 453 115 465 L105 491 109 500 119 480 114 505 121 508 129 483 126 508 134 508 140 480 142 500 148 497 151 468 149 455 137 447Z',
  'M233 611 Q219 631 222 652 Q239 668 255 652 L267 628 256 613Z',
  'M228 656 C211 675 213 710 225 741 L237 779 245 783 243 745 251 701 249 663Z',
  'M257 653 Q274 677 265 712 L251 760 248 787 260 787 Q267 746 276 706 Q283 676 267 648Z',
  'M240 781 239 801 Q225 813 215 816 L215 825 253 827 267 819 262 799 260 782Z',
];

const armMuscles = [
  'M175 239 C160 253 151 285 153 310 Q152 331 166 337 C181 322 194 284 195 253 L186 242Z',
  'M196 249 Q208 262 197 293 L172 334 169 335 Q193 289 196 249Z',
];

const legMuscles = [
  'M232 409 C215 430 201 466 204 511 C203 545 218 580 235 601 L250 597 C235 563 226 527 230 484 L247 431Z',
  'M252 425 C238 442 230 472 232 503 C234 535 254 577 274 594 C283 562 283 535 278 503 Q272 457 252 425Z',
  'M282 497 C271 524 266 563 254 601 Q265 618 283 607 L290 590Z',
  'M268 428 283 420 Q300 442 296 484 L288 527 281 485Z',
  'M235 399 Q245 405 252 421 L283 499 287 522 Q275 482 249 443Z',
];

const coreFibres = [
  'M280 134 289 152M274 145 281 156M254 156 274 162',
  'M226 175 Q257 164 291 174M221 182 Q255 172 292 182M219 189 Q250 183 292 190M219 198 Q249 192 292 198M221 207 Q250 202 292 206M225 216 Q253 214 292 213M236 226 Q264 227 290 220',
  'M211 171 Q190 196 175 235M213 177 Q198 204 182 233M214 185 Q206 208 191 226M204 172 Q184 192 173 220',
  'M217 248 247 261M216 257 248 271M218 268 249 280M223 284 246 296M223 304 251 328M222 318 253 343M226 336 257 359M231 355 256 376',
  'M274 246 Q283 244 291 247M273 253 291 254M273 280 291 284M273 288 291 291M273 313 291 316M276 321 291 324M278 348 291 352M280 356 291 361',
  'M237 384 275 413M243 382 283 407',
  'M153 348 Q139 384 123 427M156 355 132 423M160 354 Q156 386 142 408M141 354 Q129 387 123 413',
  'M128 455 119 473M134 457 129 476M139 461 137 477M144 462 144 480',
  'M228 620 Q240 626 259 620M227 630 Q238 638 255 632M228 640 Q239 649 250 639',
  'M229 668 Q222 696 236 748M235 665 Q230 707 240 756M243 669 Q247 700 241 728M259 668 Q270 695 257 730M263 682 252 751M229 687 Q221 704 232 730',
  'M246 790 250 810M243 806 229 817M251 817 221 820M257 807 257 817',
];

const armFibres = [
  'M177 251 Q162 286 165 323',
  'M182 250 Q169 287 168 320',
  'M187 253 Q181 289 170 316',
  'M169 260 Q158 284 158 307',
  'M191 263 Q187 291 178 306',
  'M201 263 182 312',
];

const legFibres = [
  'M229 429 Q208 485 220 539',
  'M230 448 Q214 493 225 553',
  'M225 469 Q218 530 235 576',
  'M211 483 Q208 536 229 581',
  'M250 438 Q236 489 256 557',
  'M254 443 Q244 490 263 574',
  'M259 454 Q250 498 269 576',
  'M265 472 Q261 520 274 563',
  'M239 478 Q233 521 249 550',
  'M281 528 266 594M281 548 273 599M272 440 288 482',
];

export default function Anatomy({ region, onSelect, playSound }: AnatomyProps) {
  const uid = useId().replace(/:/g, '');
  const reducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState<Region | null>(null);
  const gradient = (name: string) => `url(#${uid}-${name})`;

  function activate(next: Region) {
    playSound('select');
    onSelect(next);
  }

  function keyActivate(event: KeyboardEvent<SVGGElement>, next: Region) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      activate(next);
    }
  }

  return (
    <svg className="anatomy-svg" viewBox="0 0 740 600" role="group" aria-label="Interactive anatomical schematic. Select the biceps or quadriceps to explore the results. Load assignment is illustrative; actual sides were randomized.">
      <defs>
        <radialGradient id={`${uid}-halo`}>
          <stop offset="0" stopColor="#002fa7" stopOpacity="0.17" />
          <stop offset="0.7" stopColor="#002fa7" stopOpacity="0.04" />
          <stop offset="1" stopColor="#002fa7" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-core`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#121b29" />
          <stop offset="0.55" stopColor="#243143" />
          <stop offset="1" stopColor="#0e1522" />
        </linearGradient>
        <linearGradient id={`${uid}-high`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#002fa7" />
          <stop offset="0.45" stopColor="#3158ff" />
          <stop offset="0.7" stopColor="#1238de" />
          <stop offset="1" stopColor="#061d77" />
        </linearGradient>
        <linearGradient id={`${uid}-low`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4b6381" />
          <stop offset="0.42" stopColor="#b8c9df" />
          <stop offset="0.7" stopColor="#8295b0" />
          <stop offset="1" stopColor="#23354e" />
        </linearGradient>
        <filter id={`${uid}-glow`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      <circle cx="388" cy="294" r="282" fill={gradient('halo')} />
      <g className="anatomy-grid" fill="none" stroke="#253043" strokeWidth="0.7">
        <circle cx="388" cy="285" r="224" />
        <circle cx="388" cy="285" r="180" strokeDasharray="2 7" />
        <circle cx="388" cy="285" r="132" opacity="0.4" />
        <path d="M126 285h523M388 27v528" strokeDasharray="3 7" />
        <path d="M229 126 547 444M229 444 547 126" opacity="0.35" />
        {Array.from({ length: 72 }, (_, index) => {
          const angle = (index * Math.PI) / 36;
          const inner = index % 6 === 0 ? 215 : 220;
          return <line key={index} x1={388 + Math.cos(angle) * inner} y1={285 + Math.sin(angle) * inner} x2={388 + Math.cos(angle) * 224} y2={285 + Math.sin(angle) * 224} />;
        })}
      </g>
      <g className="orbital-path" style={{ transformOrigin: '388px 285px' }}>
        <path d="M388 61a224 224 0 0 1 174 83" fill="none" stroke="#244dff" strokeWidth="1" opacity="0.55" />
        <circle cx="562" cy="144" r="2" fill="#4667ff" />
      </g>
      <g className="figure-registration" fill="none" stroke="#455063" strokeWidth="0.8">
        <path d="M160 58v12m-6-6h12M612 58v12m-6-6h12M160 507v12m-6-6h12M612 507v12m-6-6h12" />
      </g>
      <g className="svg-micro" fill="#626d80">
        <text x="165" y="46">FIG. 01</text>
        <text x="613" y="46" textAnchor="end">FRONTAL VIEW</text>
        <text x="154" y="289" textAnchor="end" fontSize="8">270</text>
        <text x="623" y="289" fontSize="8">090</text>
      </g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, delay: 0.1 }}>
        <g transform="translate(184 6) scale(.68)" className="anatomical-body">
          <g fill={gradient('core')} stroke="#64738b" strokeWidth="0.9" strokeLinejoin="round">
            <path d="M300 24 C275 24 261 45 263 74 L267 100 Q278 122 300 127 Q322 122 333 100 L337 74 C339 45 325 24 300 24Z" />
            <path d="M264 66q-9-7-8 7l4 20 7 2m69-29q9-7 8 7l-4 20-7 2" />
            <path d="M282 119 279 147 298 164 321 147 318 119M300 127v35" fill="none" />
          </g>
          <g fill="none" stroke="#60748e" strokeWidth="0.8" opacity="0.55">
            <path d="M274 56q26-10 52 0M268 68q32-9 64 0M271 81q11-7 22-1m14 0q11-6 22 1M275 90q7 3 14-1m23 0q7 4 13 0M299 64l-5 34q5 4 12 0M286 108q15-4 28 0M291 113h16M269 56q11-19 31-22 20 2 31 22M283 35q-12 33-4 41m37-40q11 31 5 42" />
            <path d="M273 95 283 111 296 120m31-25-10 16-13 9" />
          </g>
          {[false, true].map((mirror) => (
            <g key={String(mirror)} transform={mirror ? 'translate(600 0) scale(-1 1)' : undefined}>
              <g fill={gradient('core')} stroke="#52617b" strokeWidth="0.95" strokeLinejoin="round">
                {coreMuscles.map((path, index) => <path key={index} d={path} />)}
              </g>
              <g fill="none" stroke="#8192ad" strokeWidth="0.65" opacity="0.42">
                {coreFibres.map((path, index) => <path key={index} d={path} />)}
              </g>
              <g
                className={`muscle-group ${region === 'upper' ? 'is-selected' : ''} ${hovered === 'upper' ? 'is-hovered' : ''}`}
                onPointerEnter={() => { setHovered('upper'); playSound('hover'); }}
                onPointerLeave={() => setHovered(null)}
                onClick={() => activate('upper')}
              >
                <g fill={gradient(mirror ? 'low' : 'high')} stroke={mirror ? '#a9bad2' : '#466aff'} strokeWidth="1">
                  {armMuscles.map((path, index) => <motion.path key={index} d={path} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: reducedMotion ? 0 : 1.5, delay: reducedMotion ? 0 : 0.3 + index * 0.1 }} />)}
                </g>
                <g fill="none" stroke={mirror ? '#293d5a' : '#071b7d'} strokeWidth="1" opacity="0.8">
                  {armFibres.map((path, index) => <path key={index} d={path} />)}
                </g>
              </g>
              <g
                className={`muscle-group ${region === 'lower' ? 'is-selected' : ''} ${hovered === 'lower' ? 'is-hovered' : ''}`}
                onPointerEnter={() => { setHovered('lower'); playSound('hover'); }}
                onPointerLeave={() => setHovered(null)}
                onClick={() => activate('lower')}
              >
                <g fill={gradient(mirror ? 'low' : 'high')} stroke={mirror ? '#a9bad2' : '#466aff'} strokeWidth="1">
                  {legMuscles.map((path, index) => <motion.path key={index} d={path} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: reducedMotion ? 0 : 1.8, delay: reducedMotion ? 0 : 0.4 + index * 0.09 }} />)}
                </g>
                <g fill="none" stroke={mirror ? '#293d5a' : '#071b7d'} strokeWidth="0.95" opacity="0.75">
                  {legFibres.map((path, index) => <path key={index} d={path} />)}
                </g>
              </g>
            </g>
          ))}
          <path d="M300 166v65m0 8v131m0 10v47" stroke="#697a92" strokeWidth="0.9" opacity="0.7" fill="none" />
        </g>
      </motion.g>

      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8 }}>
        <g className="load-annotation">
          <circle cx="86" cy="162" r="3" fill="#3157ff" />
          <text x="97" y="165" className="svg-micro" fill="#6b86ff">HIGHER LOAD</text>
          <text x="82" y="199" className="svg-load-number" fill="#edf0f7">70<tspan fontSize="18">&ndash;</tspan>80<tspan fontSize="18">%</tspan></text>
          <text x="86" y="218" className="svg-micro" fill="#7f8796">1RM / 8&ndash;12 REPS</text>
          <path d="M88 233h113l33-24h38" fill="none" stroke="#3157ff" strokeWidth="0.75" opacity="0.7" />
          <circle cx="272" cy="209" r="2.5" fill="#3157ff" />
        </g>
        <g className="load-annotation">
          <circle cx="565" cy="162" r="3" fill="#b6c4d7" />
          <text x="576" y="165" className="svg-micro" fill="#b6c4d7">LOWER LOAD</text>
          <text x="562" y="199" className="svg-load-number" fill="#edf0f7">30<tspan fontSize="18">&ndash;</tspan>40<tspan fontSize="18">%</tspan></text>
          <text x="565" y="218" className="svg-micro" fill="#7f8796">1RM / 20&ndash;25 REPS</text>
          <path d="M658 233H558l-30-24h-24" fill="none" stroke="#a3b3cb" strokeWidth="0.75" opacity="0.65" />
          <circle cx="504" cy="209" r="2.5" fill="#b6c4d7" />
        </g>
      </motion.g>

      <g
        role="button" tabIndex={0} aria-label="Explore upper-limb results for the biceps brachii"
        className={`anatomy-hotspot ${region === 'upper' ? 'active' : ''}`}
        onClick={() => activate('upper')} onKeyDown={(event) => keyActivate(event, 'upper')}
        onFocus={() => setHovered('upper')} onBlur={() => setHovered(null)}
        onPointerEnter={() => { setHovered('upper'); playSound('hover'); }} onPointerLeave={() => setHovered(null)}
      >
        <rect x="144" y="299" width="163" height="50" fill="transparent" />
        <path d="M165 309h66l30-41 33-59" fill="none" stroke="currentColor" strokeWidth="0.75" />
        <circle className="hotspot-aura" cx="294" cy="209" r="16" fill="none" stroke="currentColor" strokeWidth="0.7" />
        <circle cx="294" cy="209" r="7" fill="#101831" stroke="currentColor" />
        <path d="M291 209h6m-3-3v6" stroke="currentColor" strokeWidth="0.8" />
        <text x="165" y="329" className="svg-micro" fill="currentColor">01 / BICEPS BRACHII</text>
      </g>
      <g
        role="button" tabIndex={0} aria-label="Explore lower-limb results for the vastus lateralis"
        className={`anatomy-hotspot ${region === 'lower' ? 'active' : ''}`}
        onClick={() => activate('lower')} onKeyDown={(event) => keyActivate(event, 'lower')}
        onFocus={() => setHovered('lower')} onBlur={() => setHovered(null)}
        onPointerEnter={() => { setHovered('lower'); playSound('hover'); }} onPointerLeave={() => setHovered(null)}
      >
        <rect x="473" y="396" width="172" height="55" fill="transparent" />
        <path d="M444 350 479 398h138" fill="none" stroke="currentColor" strokeWidth="0.75" />
        <circle className="hotspot-aura" cx="444" cy="350" r="16" fill="none" stroke="currentColor" strokeWidth="0.7" />
        <circle cx="444" cy="350" r="7" fill="#101831" stroke="currentColor" />
        <path d="M441 350h6m-3-3v6" stroke="currentColor" strokeWidth="0.8" />
        <text x="484" y="419" className="svg-micro" fill="currentColor">02 / VASTUS LATERALIS</text>
      </g>

      <g className="figure-bottom-note svg-micro" fill="#737c8d">
        <path d="M278 583h13m-6-6v12" stroke="#4264ee" strokeWidth="0.8" />
        <text x="301" y="586" fontSize="8.5">TWO LOADS. ONE INDIVIDUAL.</text>
      </g>
    </svg>
  );
}