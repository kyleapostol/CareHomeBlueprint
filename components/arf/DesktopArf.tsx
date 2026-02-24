'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ArfSection, PhaseData, ArfBullet } from '@/types/types';
import { Switch } from '@headlessui/react'

type PhaseKey = 'prerequisites' | 'licensing' | 'vendorization';

type Props = {
  phases: Record<PhaseKey, PhaseData>;
};

const PHASE_ORDER: PhaseKey[] = ['prerequisites', 'licensing', 'vendorization'];

export default function DesktopArf({ phases }: Props) {
  const [activePhase, setActivePhase] = useState<PhaseKey>('prerequisites');

  const phaseData = phases[activePhase];
  const sections: ArfSection[] = phaseData.sections ?? [];

  const [activeSectionId, setActiveSectionId] = useState<string>(sections[0]?.id ?? '');
  
  // Refined state type to allow both Sections and individual Bullets
  const [activeDetail, setActiveDetail] = useState<ArfSection | ArfBullet | null>(null);

  const [isChecklistMode, setIsChecklistMode] = useState(false);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('carehome-navigator-v1');
    if (saved) setCompletedIds(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('carehome-navigator-v1', JSON.stringify(completedIds));
  }, [completedIds]);

  const toggleId = (id: string) => {
    setCompletedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const phasePercentage = useMemo(() => {
    const allBullets = sections.flatMap((s) => s.bullets ?? []);
    const total = allBullets.length;
    if (total === 0) return 0;
    const completed = allBullets.filter((b) => completedIds.includes(b.id)).length;
    return Math.round((completed / total) * 100);
  }, [sections, completedIds]);

  useEffect(() => {
    setActiveSectionId((prev) => {
      const stillExists = sections.some((s) => s.id === prev);
      return stillExists ? prev : (sections[0]?.id ?? '');
    });
  }, [activePhase, sections]);

  const activeSection = sections.find((s) => s.id === activeSectionId) ?? sections[0];
  const bullets = activeSection?.bullets ?? [];

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
                  {phases[key].description && <div className="nav-sub">{phases[key].description}</div>}
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
                  onMouseEnter={() => setActiveDetail(s)}
                  onMouseLeave={() => setActiveDetail(null)}
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
          <div className="main-header flex justify-between items-start mb-6">
            <div>
              <div className="main-phase text-2xl font-bold text-gray-900">{phaseData.phase}</div>
              {phaseData.description && <div className="main-desc text-gray-600 mt-1">{phaseData.description}</div>}
            </div>
            
            <div className="flex items-center gap-6">
              {isChecklistMode && (
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">{phasePercentage}% Phase Complete</span>
                  <div className="w-32 h-2 bg-gray-200 rounded-full mt-1.5 overflow-hidden">
                    <div 
                      className="h-full bg-amber-600 transition-all duration-500 ease-out" 
                      style={{ width: `${phasePercentage}%` }} 
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${isChecklistMode ? 'text-amber-900' : 'text-gray-500'}`}>
                  Checklist Mode
                </span>
                <Switch
                  checked={isChecklistMode}
                  onChange={setIsChecklistMode}
                  className={`${isChecklistMode ? 'bg-amber-800' : 'bg-gray-300'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2`}
                >
                  <span className="sr-only">Toggle Checklist Mode</span>
                  <span className={`${isChecklistMode ? 'translate-x-5' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
              </div>
            </div>
          </div>

          {activeSection ? (
            <div className="section">
              <h2 className="section-title">{activeSection.title}</h2>
              {activeSection.summary && <p className="section-summary">{activeSection.summary}</p>}

              {bullets.length ? (
                <ul className="items">
                  {bullets.map((bullet, idx) => {
                    const isCompleted = completedIds.includes(bullet.id);
                    return (
                      <li
                        key={`${activeSection.id}-${idx}`}
                        className={`item group relative p-3 rounded-lg transition-colors ${
                          isChecklistMode ? 'cursor-pointer hover:bg-amber-50' : 'hover:bg-gray-50'
                        }`}
                        onMouseEnter={() => setActiveDetail(bullet)}
                        onMouseLeave={() => setActiveDetail(null)}
                        onClick={() => isChecklistMode && toggleId(bullet.id)}
                      >
                        <div className="flex items-start gap-3">
                          {isChecklistMode && (
                            <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                              isCompleted ? 'bg-amber-600 border-amber-600' : 'border-gray-300 bg-white'
                            }`}>
                              {isCompleted && (
                                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          )}
                          <div className={`item-title text-gray-800 ${isChecklistMode && isCompleted ? 'opacity-50 line-through' : ''}`}>
                            {bullet.label}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="empty">
                  <div className="empty-title">Nothing listed yet.</div>
                  <div className="empty-sub">Add bullets in the JSON for this section.</div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </main>

      {/* RIGHT: Context */}
      <aside className="arf-right">
        <div className="panel">
          {activeDetail ? (
            <div className="detail-view">
              <div className="panel-label">Expert Guidance</div>
              
              <h3 className="nav-title" style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>
                {'label' in activeDetail ? activeDetail.label : activeDetail.title}
              </h3>

              <div className="detail-content" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
                {'detail' in activeDetail ? (
                  <p>{activeDetail.detail}</p>
                ) : (
                  <p>{'summary' in activeDetail ? activeDetail.summary : null}</p>
                )}
              </div>

              {/* If hovering a section, tell them to hover items for specific Title 22 info */}
              {(!('detail' in activeDetail)) && (
                <div className="nav-sub" style={{ marginTop: '1.5rem', fontStyle: 'italic', opacity: 0.7 }}>
                  Hover over items for specific Title 22/17 regulations.
                </div>
              )}
            </div>
          ) : isChecklistMode ? (
            <div className="progress-view">
              <div className="panel-label text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Section Completion</div>
              
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="text-4xl font-bold text-amber-600 mb-2">
                  {bullets.length ? Math.round((bullets.filter((b) => completedIds.includes(b.id)).length / bullets.length) * 100) : 0}%
                </div>
                <p className="text-sm text-gray-600">
                  {bullets.filter((b) => completedIds.includes(b.id)).length} of {bullets.length} items completed
                </p>
                <p className="text-sm font-medium text-gray-900 mt-1">{activeSection.title}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="panel-label">Phase Overview</div>

              {phaseData.timeline && (
                <div className="meta-row">
                  <div className="meta-k">Typical timeline</div>
                  <div className="meta-v">{phaseData.timeline}</div>
                </div>
              )}

              {phaseData.commonDelays?.length ? (
                <>
                  <div className="panel-subhead" style={{ marginTop: '1.5rem' }}>Common delays</div>
                  <ul className="bullets">
                    {phaseData.commonDelays.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </>
              ) : null}

              {phaseData.reviewerFocus?.length ? (
                <>
                  <div className="panel-subhead" style={{ marginTop: '1.5rem' }}>What reviewers look for</div>
                  <ul className="bullets">
                    {phaseData.reviewerFocus.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </>
              ) : null}
              
              {!phaseData.timeline && !phaseData.commonDelays?.length && (
                <div className="empty">
                  <div className="empty-title">Ready to start?</div>
                  <div className="empty-sub">Select a section to dive into requirements.</div>
                </div>
              )}
            </>
          )}
        </div>
      </aside>
    </section>
  );
}