'use client';

import { useState } from 'react';
import Accordion from './Accordion';
import type { PhaseData } from '@/types/types';

// Expanded to support the new RCFE phase
type PhaseKey = 'prerequisites' | 'licensing' | 'vendorization' | 'operations';
export type FacilityType = 'arf' | 'rcfe' | 'adp';

type PhaseTabsProps = {
  phases: Record<string, PhaseData>; 
  facilityType: FacilityType;
};

export default function PhaseTabs({ phases, facilityType }: PhaseTabsProps) {
  // Dynamically set the tabs based on the facility you are rendering
  const PHASE_ORDER = facilityType === 'rcfe' 
    ? ['prerequisites', 'licensing', 'operations'] 
    : ['prerequisites', 'licensing', 'vendorization'];

  const [activePhase, setActivePhase] = useState<string>(PHASE_ORDER[0]);

  // Safety fallback to prevent crashes during initial load
  const activeData = phases[activePhase] || { phase: '', description: '', sections: [] };

  return (
    <section className="mpp-tabs" aria-label={`${facilityType.toUpperCase()} phases`}>
      <div className="mpp-tab-list" role="tablist" aria-orientation="horizontal">
        {PHASE_ORDER.map((phaseKey) => {
          const phaseObj = phases[phaseKey];
          
          // Failsafe in case a JSON file is missing
          if (!phaseObj) return null;

          const label = phaseObj.phase;
          const selected = activePhase === phaseKey;

          return (
            <button
              key={phaseKey}
              type="button"
              role="tab"
              className={`mpp-tab ${selected ? 'is-active' : ''}`}
              aria-selected={selected}
              aria-controls={`phase-${phaseKey}`}
              onClick={() => setActivePhase(phaseKey)}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div id={`phase-${activePhase}`} role="tabpanel" className="mpp-tab-panel">
        <p className="mpp-phase-description">{activeData.description}</p>
        <Accordion sections={activeData.sections ?? []} />
      </div>
    </section>
  );
}