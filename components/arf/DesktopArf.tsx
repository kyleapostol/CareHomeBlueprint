'use client';

import { useEffect, useMemo, useState } from 'react';
import type { PhaseData, Item, Section } from '@/types/types';

type PhaseKey = 'prerequisites' | 'licensing' | 'vendorization';

type Props = {
  phases: Record<PhaseKey, PhaseData>;
};

const PHASE_ORDER: PhaseKey[] = ['prerequisites', 'licensing', 'vendorization'];

export default function DesktopArf({ phases }: Props) {
  const [activePhase, setActivePhase] = useState<PhaseKey>('prerequisites');

  const phaseData = phases[activePhase];
  const sections: Section[] = phaseData.sections ?? [];

  const [activeSectionId, setActiveSectionId] = useState<string>(sections[0]?.id ?? '');

  // When phase changes, reset section selection
  useEffect(() => {
    setActiveSectionId((prev) => {
      const stillExists = sections.some((s) => s.id === prev);
      return stillExists ? prev : (sections[0]?.id ?? '');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePhase]);

  const activeSection = useMemo(() => {
    return sections.find((s) => s.id === activeSectionId) ?? sections[0];
  }, [sections, activeSectionId]);

  const items: Item[] = activeSection?.items ?? [];

  return (
    <section className="arf-desktop" aria-label="ARF desktop navigator">
      {/* LEFT: Navigation */}
      <aside className="arf-left">
        <div className="panel">
          <div className="panel-label">Phases</div>
          <div className="nav-list">
            {PHASE_ORDER.map((key) => {
              const selected = key === activePhase;
              return (
                <button
                  key={key}
                  type="button"
                  className={`nav-item ${selected ? 'is-active' : ''}`}
                  onClick={() => setActivePhase(key)}
                >
                  <div className="nav-title">{phases[key].phase}</div>
                  {phases[key].description ? (
                    <div className="nav-sub">{phases[key].description}</div>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="panel">
          <div className="panel-label">Sections</div>
          <div className="nav-list">
            {sections.map((s) => {
              const selected = s.id === activeSection?.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  className={`nav-item compact ${selected ? 'is-active' : ''}`}
                  onClick={() => setActiveSectionId(s.id)}
                >
                  <div className="nav-title">{s.title}</div>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* CENTER: Content */}
      <main className="arf-main">
        <div className="panel">
          <div className="main-header">
            <div className="main-phase">{phaseData.phase}</div>
            {phaseData.description ? <div className="main-desc">{phaseData.description}</div> : null}
          </div>

          {activeSection ? (
            <div className="section">
              <h2 className="section-title">{activeSection.title}</h2>
              {activeSection.summary ? <p className="section-summary">{activeSection.summary}</p> : null}

              {items.length ? (
                <ul className="items">
                  {items.map((item, idx) => (
                    <li key={`${activeSection.id}-${idx}`} className="item">
                      <div className="item-title">{item.title}</div>
                      {item.notes ? <div className="item-notes">{item.notes}</div> : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="empty">
                  <div className="empty-title">Nothing listed yet.</div>
                  <div className="empty-sub">
                    Add checklist items to this section in the JSON when you’re ready.
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="empty">
              <div className="empty-title">No sections yet.</div>
              <div className="empty-sub">Add sections in the JSON for this phase.</div>
            </div>
          )}
        </div>
      </main>

      {/* RIGHT: Context */}
      <aside className="arf-right">
        <div className="panel">
          <div className="panel-label">Phase Overview</div>

          {phaseData.timeline ? (
            <div className="meta-row">
              <div className="meta-k">Typical timeline</div>
              <div className="meta-v">{phaseData.timeline}</div>
            </div>
          ) : null}

          {phaseData.commonDelays?.length ? (
            <>
              <div className="panel-subhead">Common delays</div>
              <ul className="bullets">
                {phaseData.commonDelays.map((t, i) => (
                  <li key={`delay-${i}`}>{t}</li>
                ))}
              </ul>
            </>
          ) : null}

          {phaseData.reviewerFocus?.length ? (
            <>
              <div className="panel-subhead">What reviewers look for</div>
              <ul className="bullets">
                {phaseData.reviewerFocus.map((t, i) => (
                  <li key={`focus-${i}`}>{t}</li>
                ))}
              </ul>
            </>
          ) : null}

          {!phaseData.timeline && !phaseData.commonDelays?.length && !phaseData.reviewerFocus?.length ? (
            <div className="empty">
              <div className="empty-title">No overview yet.</div>
              <div className="empty-sub">Add timeline/delays/reviewer focus in the JSON.</div>
            </div>
          ) : null}
        </div>
      </aside>
    </section>
  );
}
