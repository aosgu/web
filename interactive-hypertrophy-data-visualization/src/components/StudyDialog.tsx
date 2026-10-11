import { useEffect, useRef } from 'react';
import { study } from '../data/study';
import Icon from './Icon';

interface StudyDialogProps {
  type: 'data' | 'protocol' | null;
  onClose: () => void;
}

export default function StudyDialog({ type, onClose }: StudyDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (type && !dialog.open) dialog.showModal();
    if (!type && dialog.open) dialog.close();
    if (!type) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [type]);

  return (
    <dialog ref={ref} className="study-dialog" aria-labelledby="dialog-title" onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === ref.current) onClose(); }}>
      <div className="dialog-inner">
        <button className="icon-button dialog-close" aria-label="Close study notes" onClick={onClose} autoFocus><Icon name="close" size={22} /></button>
        <span className="section-kicker">FIELD NOTES / {type === 'data' ? 'READING THE DATA' : 'THE EXPERIMENT'}</span>
        <h2 id="dialog-title">{type === 'data' ? <>A dot isn't<br /><em>a person.</em></> : <>Same person.<br /><em>Different loads.</em></>}</h2>
        {type === 'data' ? (
          <>
            <p className="dialog-intro">These visualizations use published summary statistics, not raw participant records.</p>
            <svg className="dialog-key" viewBox="0 0 450 88" role="img" aria-label="A dot marks the mean; the whisker extends one standard deviation in each direction."><path d="M65 32h320M65 24v16m320-16v16" stroke="#4568ff" strokeWidth="1.5" /><circle cx="225" cy="32" r="17" stroke="#4568ff" fill="#15204b" /><circle cx="225" cy="32" r="5" fill="#4568ff" /><text x="65" y="70" fill="#969faf" fontSize="11">Mean - 1 SD</text><text x="225" y="70" textAnchor="middle" fill="#eef0f6" fontSize="11">Mean</text><text x="385" y="70" textAnchor="end" fill="#969faf" fontSize="11">Mean + 1 SD</text></svg>
            <dl className="reading-notes">
              <div><dt>The dot</dt><dd>The average change from baseline after 10 weeks, for the selected measure and loading condition.</dd></div>
              <div><dt>The whiskers</dt><dd>One standard deviation on either side of the mean. This describes spread, not a confidence interval. It is not a minimum-to-maximum range.</dd></div>
              <div><dt>The p value</dt><dd>The reported comparison between high and low loads. A value above 0.05 is not statistically significant, but does not prove the loads are exactly equivalent.</dd></div>
            </dl>
            <p className="dialog-caution">In the protein synthesis view, the dots instead show change relative to rest in weeks 1 and 10. The displayed comparison tests time, not load.</p>
          </>
        ) : (
          <>
            <p className="dialog-intro">A within-person design: each participant trained one limb with a higher load and the opposite limb with a lower load.</p>
            <dl className="reading-notes protocol-notes">
              <div><dt>Who</dt><dd>20 healthy young men, studied for 10 weeks.</dd></div>
              <div><dt>How</dt><dd>Unilateral biceps curls and knee extensions, three sessions per week. Each exercise used three sets taken to volitional fatigue.</dd></div>
              <div><dt>Higher load</dt><dd>Approximately 70&ndash;80% of one-repetition maximum (1RM), for 8&ndash;12 repetitions.</dd></div>
              <div><dt>Lower load</dt><dd>Approximately 30&ndash;40% of 1RM, for 20&ndash;25 repetitions.</dd></div>
              <div><dt>Measured</dt><dd>Muscle size with DXA, ultrasound and biopsies; strength with 1RM and maximal voluntary contraction; protein synthesis with deuterated water.</dd></div>
            </dl>
            <p className="dialog-caution">The anatomical figure is a schematic, not a measurement of muscle size. Its left/right load assignment is illustrative; actual assignments were randomized.</p>
          </>
        )}
        <a className="dialog-source" href={study.url} target="_blank" rel="noreferrer">Read the original study <Icon name="arrow-up-right" size={17} /></a>
      </div>
    </dialog>
  );
}