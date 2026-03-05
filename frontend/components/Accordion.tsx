'use client';

import { useState } from 'react';
import type { ArfSection as FacilitySection } from '@/types/types';

type AccordionProps = {
  sections: FacilitySection[];
};

export default function Accordion({ sections }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(sections[0]?.id ?? null);

  return (
    <div className="mpp-accordion" role="list">
      {sections.map((section) => {
        const isOpen = openId === section.id;

        return (
          <article key={section.id} className="mpp-accordion-item" role="listitem">
            <button
              type="button"
              className="mpp-accordion-trigger"
              aria-expanded={isOpen}
              aria-controls={`panel-${section.id}`}
              onClick={() => setOpenId(isOpen ? null : section.id)}
            >
              <span className="mpp-trigger-title">{section.title}</span>
              <span className="mpp-trigger-icon" aria-hidden="true">
                {isOpen ? '−' : '+'}
              </span>
            </button>

            {isOpen && (
              <div id={`panel-${section.id}`} className="mpp-accordion-panel">
                <p>{section.summary}</p>
                <ul>
                  {section.bullets.map((bullet, idx) => (
                    <li key={idx}>
                      <strong>{bullet.label}</strong>
                      {bullet.detail && <p style={{ marginTop: '0.25rem', fontSize: '0.95em', opacity: 0.9 }}>{bullet.detail}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
