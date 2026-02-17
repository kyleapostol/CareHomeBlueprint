'use client';

import { useState } from 'react';
import type { ArfSection } from '../../types/types';

type AccordionProps = {
  sections: ArfSection[];
};

export default function Accordion({ sections }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(sections[0]?.id ?? null);

  return (
    <div className="arf-accordion" role="list">
      {sections.map((section) => {
        console.log('section', section)
        const isOpen = openId === section.id;

        return (
          <article key={section.id} className="arf-accordion-item" role="listitem">
            <button
              type="button"
              className="arf-accordion-trigger"
              aria-expanded={isOpen}
              aria-controls={`panel-${section.id}`}
              onClick={() => setOpenId(isOpen ? null : section.id)}
            >
              <span className="arf-trigger-title">{section.title}</span>
              <span className="arf-trigger-icon" aria-hidden="true">
                {isOpen ? '−' : '+'}
              </span>
            </button>

            {isOpen && (
              <div id={`panel-${section.id}`} className="arf-accordion-panel">
                <p>{section.summary}</p>
                <ul>
                  {section?.bullets ?? section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
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
