'use client';

import { useMemo, useState } from 'react';
import Accordion from './Accordion';
import type { PhaseData } from './types';

type PhaseKey = 'prerequisites' | 'licensing' | 'vendorization';

type PhaseTabsProps = {
  phases: Record<PhaseKey, PhaseData>;
};

const PHASE_ORDER: PhaseKey[] = ['prerequisites', 'licensing', 'vendorization'];

export default function PhaseTabs({ phases }: PhaseTabsProps) {
  const [activePhase, setActivePhase] = useState<PhaseKey>('prerequisites');

const activeData = phases[activePhase];

  return (
    <section className="arf-tabs" aria-label="ARF phases">
      <div className="arf-tab-list" role="tablist" aria-orientation="horizontal">
        {PHASE_ORDER.map((phaseKey) => {
          const label = phases[phaseKey].phase;
          const selected = activePhase === phaseKey;

          return (
            <button
              key={phaseKey}
              type="button"
              role="tab"
              className={`arf-tab ${selected ? 'is-active' : ''}`}
              aria-selected={selected}
              aria-controls={`phase-${phaseKey}`}
              onClick={() => setActivePhase(phaseKey)}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div id={`phase-${activePhase}`} role="tabpanel" className="arf-tab-panel">
        <p className="arf-phase-description">{activeData.description}</p>
        <Accordion sections={activeData.sections} />
      </div>
    </section>
  );
}
