import { useEffect, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { downloadData, formatValue, metrics, synthesis, type Condition, type Outcome, type Region } from '../data/study';
import type { PlaySound } from '../hooks/useSound';
import Icon from './Icon';
import ResultPlot, { type PlotRow } from './ResultPlot';

interface DataExplorerProps {
  region: Region;
  setRegion: (region: Region) => void;
  outcome: Outcome;
  setOutcome: (outcome: Outcome) => void;
  playSound: PlaySound;
  onExplain: () => void;
}

const outcomes: { id: Outcome; label: string }[] = [
  { id: 'hypertrophy', label: 'Muscle growth' },
  { id: 'strength', label: 'Strength' },
  { id: 'synthesis', label: 'Protein synthesis' },
];

export default function DataExplorer({ region, setRegion, outcome, setOutcome, playSound, onExplain }: DataExplorerProps) {
  const [metricId, setMetricId] = useState('arm-csa');
  const [view, setView] = useState<'chart' | 'table'>('chart');
  const [showSd, setShowSd] = useState(true);
  const [focus, setFocus] = useState<'both' | Condition>('both');
  const [downloaded, setDownloaded] = useState(false);
  const availableMetrics = metrics.filter((metric) => metric.region === region && metric.outcome === outcome);
  const counterpartId = region === 'upper' ? metricId.replace(/^leg-/, 'arm-') : metricId.replace(/^arm-/, 'leg-');
  const selectedMetric = availableMetrics.find((metric) => metric.id === metricId || metric.id === counterpartId) || availableMetrics[0] || metrics[0];
  const isSynthesis = outcome === 'synthesis';
  const unit = isSynthesis ? '%/day' : selectedMetric.unit;
  const precision = isSynthesis ? 2 : selectedMetric.precision;
  const rows: PlotRow[] = isSynthesis ? [
    { id: 'high', label: 'Week 01', detail: 'EARLY TRAINING', measurement: synthesis.first },
    { id: 'low', label: 'Week 10', detail: 'LATE TRAINING', measurement: synthesis.last },
  ] : [
    { id: 'high', label: 'Higher load', detail: '70\u201380% 1RM', measurement: selectedMetric.high },
    { id: 'low', label: 'Lower load', detail: '30\u201340% 1RM', measurement: selectedMetric.low },
  ];

  useEffect(() => { setFocus('both'); }, [region, outcome]);

  function changeOutcome(next: Outcome) {
    setOutcome(next);
    setFocus('both');
    playSound('select');
  }

  function tabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number | undefined;
    if (event.key === 'ArrowRight') next = (index + 1) % outcomes.length;
    if (event.key === 'ArrowLeft') next = (index + outcomes.length - 1) % outcomes.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = outcomes.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      changeOutcome(outcomes[next].id);
      document.getElementById(`tab-${outcomes[next].id}`)?.focus();
    }
  }

  return (
    <section className="explorer section-shell" id="explore" aria-labelledby="explorer-heading">
      <div className="section-kicker"><span><span className="section-number">02</span> / FOLLOW THE EVIDENCE</span><span className="kicker-context">20 PARTICIPANTS <span className="tiny-divider">/</span> 10 WEEKS</span></div>
      <div className="explorer-heading-row">
        <h2 id="explorer-heading" tabIndex={-1}>Same effort. <span className="muted-heading">What changed?</span></h2>
        <button className="text-button how-to-read" onClick={() => { playSound('open'); onExplain(); }}><Icon name="info" size={15} /> How to read the data</button>
      </div>

      <div className="explorer-nav">
        <div className="outcome-tabs" role="tablist" aria-label="Research outcome">
          {outcomes.map((item, index) => (
            <button key={item.id} id={`tab-${item.id}`} role="tab" aria-selected={outcome === item.id} tabIndex={outcome === item.id ? 0 : -1} aria-controls="outcome-panel" className={outcome === item.id ? 'active' : ''} onClick={() => changeOutcome(item.id)} onKeyDown={(event) => tabKey(event, index)}>
              {item.label}
              {outcome === item.id && <motion.span className="tab-underline" layoutId="outcome-line" transition={{ type: 'spring', stiffness: 350, damping: 35 }} />}
            </button>
          ))}
        </div>
        <div className="view-switch" role="group" aria-label="Visualization format">
          <button aria-label="Chart view" aria-pressed={view === 'chart'} className={view === 'chart' ? 'active' : ''} onClick={() => { setView('chart'); playSound(); }} title="Chart view"><Icon name="chart" size={17} /></button>
          <button aria-label="Data table view" aria-pressed={view === 'table'} className={view === 'table' ? 'active' : ''} onClick={() => { setView('table'); playSound(); }} title="Data table view"><Icon name="table" size={17} /></button>
        </div>
      </div>

      <div id="outcome-panel" role="tabpanel" aria-labelledby={`tab-${outcome}`}>
        <div className="explorer-controls">
          {isSynthesis ? (
            <p className="synthesis-context"><span className="status-dot" /> MYOFIBRILLAR PROTEIN SYNTHESIS <span className="optional-label">/ VASTUS LATERALIS</span></p>
          ) : (
            <div className="region-switch" role="group" aria-label="Limb region">
              <button className={region === 'upper' ? 'active' : ''} aria-pressed={region === 'upper'} onClick={() => { setRegion('upper'); setFocus('both'); playSound(); }}>Upper body <span>01</span></button>
              <button className={region === 'lower' ? 'active' : ''} aria-pressed={region === 'lower'} onClick={() => { setRegion('lower'); setFocus('both'); playSound(); }}>Lower body <span>02</span></button>
            </div>
          )}
          {!isSynthesis && view === 'chart' && (
            <label className="metric-select-wrap">
              <span className="sr-only">Measurement</span>
              <select value={selectedMetric.id} onChange={(event) => { setMetricId(event.target.value); playSound(); }}>
                {availableMetrics.map((metric) => <option key={metric.id} value={metric.id}>{metric.shortLabel}</option>)}
              </select>
              <Icon name="chevron-down" size={15} />
            </label>
          )}
          {view === 'table' && <span className="table-filter-note">All reported measures in this view</span>}
        </div>

        <div className="explorer-content">
          <div className="chart-main">
            <div className="chart-title-row">
              <div><h3>{isSynthesis ? 'The muscle-building signal' : view === 'table' ? `${region === 'upper' ? 'Upper' : 'Lower'} limb outcomes` : selectedMetric.tissue}</h3><p>{isSynthesis ? 'Change in protein synthesis relative to rest' : `${view === 'table' ? 'Selected published outcomes' : selectedMetric.label} after 10 weeks`}</p></div>
              {view === 'chart' && <label className="sd-toggle"><input type="checkbox" checked={showSd} onChange={(event) => { setShowSd(event.target.checked); playSound(); }} /><span>Show variability</span></label>}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {view === 'chart' ? (
                <motion.div key="chart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <ResultPlot key={outcome} rows={rows} unit={unit} precision={precision} showSd={showSd} focus={focus} playSound={playSound} label={isSynthesis ? 'Myofibrillar protein synthesis' : selectedMetric.label} baseline={isSynthesis ? 'rest' : 'baseline'} />
                  <div className="plot-bottom-row">
                    <div className="plot-legend" role="group" aria-label="Highlight a comparison group">
                      {rows.map((row) => <button key={row.id} className={focus !== 'both' && focus !== row.id ? 'is-dimmed' : ''} aria-pressed={focus === 'both' || focus === row.id} title={focus === row.id ? 'Show both groups' : `Focus on ${row.label.toLowerCase()}; select again to show both`} onClick={() => { setFocus(focus === row.id ? 'both' : row.id); playSound(); }}><span className={`legend-dot ${row.id}`} />{row.label}</button>)}
                    </div>
                    <span className="chart-hover-hint">HOVER OR TAP A POINT <Icon name="plus" size={12} /></span>
                  </div>
                </motion.div>
              ) : (
                <motion.div className="data-table-wrap" key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  {isSynthesis ? (
                    <table className="data-table"><caption className="sr-only">Protein synthesis changes relative to rest, mean plus or minus standard deviation.</caption><thead><tr><th>Training phase</th><th>Change (%/day)</th><th>P vs. rest</th></tr></thead><tbody><tr><th>Week 1</th><td>0.27 &plusmn; 0.11</td><td>&lt; 0.0001</td></tr><tr><th>Week 10</th><td>0.10 &plusmn; 0.14</td><td>0.009</td></tr></tbody></table>
                  ) : (
                    <table className="data-table"><caption className="sr-only">{region === 'upper' ? 'Upper' : 'Lower'} limb {outcome} changes after 10 weeks. Mean plus or minus standard deviation. P values compare loads.</caption><thead><tr><th>Measurement</th><th><span className="legend-dot high" /> Higher load</th><th><span className="legend-dot low" /> Lower load</th><th>P value</th></tr></thead><tbody>
                      {availableMetrics.map((metric) => <tr key={metric.id}><th><button onClick={() => { setMetricId(metric.id); setView('chart'); playSound(); }}>{metric.shortLabel}<span>{metric.unit}</span><Icon name="arrow-up-right" size={12} /></button></th><td>{formatValue(metric.high.mean, metric.precision)} &plusmn; {formatValue(metric.high.sd, metric.precision)}</td><td>{formatValue(metric.low.mean, metric.precision)} &plusmn; {formatValue(metric.low.sd, metric.precision)}</td><td>{metric.p}</td></tr>)}
                    </tbody></table>
                  )}
                  <p className="table-caption">Mean &plusmn; standard deviation. {isSynthesis ? 'Reported in the study abstract; not separated by load.' : 'Select a measurement to return to its visualization.'}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <aside className="result-insight" aria-live="polite">
            <div className="insight-eyebrow"><span className="status-dot" /> {isSynthesis ? 'THE TRAINING EFFECT' : 'THE LOAD EFFECT'}</div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={outcome} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <h3>{isSynthesis ? <>The signal<br />settles down.</> : outcome === 'strength' ? <>Two loads.<br />Similar gains.</> : <>More weight.<br />Not more growth.</>}</h3>
                <p>{isSynthesis ? 'Protein synthesis rose above rest, but the response was smaller in week 10. No load effect was reported.' : outcome === 'strength' ? 'Strength increased, with no statistically significant difference between loads for this measure.' : 'Both loads increased muscle size. The difference between loads was not statistically significant.'}</p>
              </motion.div>
            </AnimatePresence>
            <div className="p-value"><span className="mono">p {isSynthesis ? '<' : '='}</span><span>{isSynthesis ? '0.001' : selectedMetric.p}</span></div>
            <span className="p-value-note">{isSynthesis ? 'Week 1 vs. week 10' : view === 'table' ? `${selectedMetric.shortLabel} / between loads` : 'Between-load comparison'}</span>
            <button className="insight-explainer" onClick={() => { onExplain(); playSound('open'); }}>What does this mean? <Icon name="arrow-up-right" size={14} /></button>
          </aside>
        </div>
      </div>

      <div className="explorer-footnote">
        <p><span className="footnote-mark">*</span> {view === 'table' ? (isSynthesis ? 'Source: study abstract. Changes relative to rest; mean +/- SD. Values are not separated by loading condition.' : 'Source: Table 3. Mean +/- SD; the same 20 men contributed to both loads. Selected outcomes, not individual data.') : (isSynthesis ? `Dots show mean changes relative to rest.${showSd ? ' Whiskers show +/- 1 SD.' : ' Variability is hidden.'} This compares time, not load. Source: study abstract.` : `Dots show mean changes.${showSd ? ' Whiskers show +/- 1 SD.' : ' Variability is hidden.'} The same 20 men contributed to both loads. Source: Table 3.`)}</p>
        <button className="text-button download-button" onClick={() => { downloadData(); setDownloaded(true); playSound('open'); }}><Icon name={downloaded ? 'check' : 'download'} size={15} /><span>{downloaded ? 'Download again' : 'Download the data'}</span></button>
      </div>
      <span className="sr-only" role="status">{downloaded ? 'The study data CSV download has been started.' : ''}</span>
    </section>
  );
}