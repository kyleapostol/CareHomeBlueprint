'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ArfSection as FacilitySection, PhaseData, ArfBullet as FacilityBullet } from '../types/types';
import ChecklistToggle from './ChecklistToggle';
import { useChecklist } from '../app/contexts/ChecklistProvider';

export type PhaseKey = 'prerequisites' | 'licensing' | 'vendorization' | 'operations';
export type FacilityType = 'arf' | 'rcfe' | 'adp';

type Props = {
  phases: Record<string, PhaseData>;
  facilityType: FacilityType;
};

export default function FacilityGuide({ phases, facilityType }: Props) {
  // Pull everything needed from the single context call
  const { completedIds, toggleTask, isInitialized, resetTrack } = useChecklist();

  // Dynamically set phases based on facility type
  const PHASE_ORDER = facilityType === 'rcfe'
    ? ['prerequisites', 'licensing', 'operations']
    : ['prerequisites', 'licensing', 'vendorization'];

  const [activePhase, setActivePhase] = useState<string>(PHASE_ORDER[0]);
  const phaseData = phases[activePhase] || { phase: '', description: '', sections: [] };
  const sections: FacilitySection[] = phaseData.sections ?? [];

  const [activeSectionId, setActiveSectionId] = useState<string>(sections[0]?.id ?? '');
  const [activeDetail, setActiveDetail] = useState<FacilitySection | FacilityBullet | null>(null);

  const [isChecklistMode, setIsChecklistMode] = useState(false);

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

  const handleReset = () => {
    if (window.confirm("Are you sure? This will permanently delete your progress for this facility type.")) {
      resetTrack();
    }
  };

  const handleMouseEnter = (item: FacilitySection | FacilityBullet) => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setActiveDetail(item);
    }
  };

  const handleMouseLeave = () => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setActiveDetail(null);
    }
  };

  const toggleDetail = (item: FacilitySection | FacilityBullet) => {
    setActiveDetail(prev => (prev && 'id' in prev && prev.id === item.id ? null : item));
  };

  if (!isInitialized) {
    return <div className="p-8 text-slate-400 animate-pulse">Loading your workspace...</div>;
  }

  // Map Tailwind colors to your facility types for the mobile nav
  const themeColors = {
    arf: { bg: 'bg-orange-800', textBorder: 'text-orange-800 border-orange-800' },
    rcfe: { bg: 'bg-blue-700', textBorder: 'text-blue-700 border-blue-700' },
    adp: { bg: 'bg-emerald-700', textBorder: 'text-emerald-700 border-emerald-700' } // Adjust ADP color as needed
  };
  const activeTheme = themeColors[facilityType] || themeColors.arf;

  return (
    <section className="flex flex-col lg:grid lg:grid-cols-[240px_1fr_280px] gap-4 lg:items-start w-full" aria-label={`${facilityType} navigator`}>

      {/* LEFT: Sidebar panels (Desktop Only) */}
      <aside className="hidden lg:flex mpp-left w-full flex-col gap-4 lg:gap-[0.75rem]">
        <div className="panel">
          <div className="panel-label">Phases</div>
          <div className="grid gap-2 nav-list">
            {PHASE_ORDER.map((key) => {
              if (!phases[key]) return null;
              const selected = key === activePhase;
              return (
                <button
                  key={key}
                  type="button"
                  className={`nav-item whitespace-normal ${selected ? 'is-active' : ''}`}
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
          <div className="grid gap-2 nav-list">
            {sections.map((s) => {
              const selected = s.id === activeSection?.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  className={`nav-item compact whitespace-normal ${selected ? 'is-active' : ''}`}
                  onClick={() => setActiveSectionId(s.id)}
                  onMouseEnter={() => handleMouseEnter(s)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="nav-title">{s.title}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reset Button - Only shows if there is progress */}
        {completedIds.length > 0 && (
          <button
            onClick={handleReset}
            className="text-[10px] uppercase tracking-widest font-bold text-red-400 hover:text-red-600 transition-colors py-2 px-1 text-left"
          >
            Clear {facilityType.toUpperCase()} Progress
          </button>
        )}
      </aside>

      {/* CENTER: Content */}
      <main className="mpp-main w-full min-w-0">

        {/* STICKY HEADER WRAPPER (Mobile Nav + Controls) */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm -mx-4 px-4 lg:mx-0 lg:px-0 border-b border-gray-100 lg:border-none pb-2 lg:pb-0 transition-all">

          {/* MOBILE NAV: PHASES */}
          <div className="lg:hidden flex overflow-x-auto gap-2 py-3 no-scrollbar snap-x px-1">
            {PHASE_ORDER.map(key => {
              const selected = activePhase === key;
              return (
                <button
                  key={key}
                  onClick={() => setActivePhase(key)}
                  className={`snap-start shrink-0 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all
                    ${selected
                      ? `${activeTheme.bg} text-white shadow-md` // <-- Updated line
                      : 'bg-slate-100 text-slate-500 border border-transparent'}
                  `}
                >
                  {phases[key]?.phase}
                </button>
              );
            })}
          </div>

          {/* MOBILE NAV: SECTIONS */}
          <div className="lg:hidden flex overflow-x-auto gap-4 pb-3 no-scrollbar snap-x px-1 border-b border-gray-100">
            {sections.map(s => {
              const selected = activeSectionId === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSectionId(s.id)}
                  className={`snap-start shrink-0 whitespace-nowrap text-xs font-bold transition-all pb-2 px-1 border-b-2
                    ${selected
                      ? activeTheme.textBorder // <-- Updated line
                      : 'border-transparent text-slate-400'}
                  `}
                >
                  {s.title}
                </button>
              );
            })}
          </div>


          {/* MAIN HEADER PANEL */}
          <div className="panel !mb-0 !p-0 !shadow-none !bg-transparent lg:!bg-white lg:!p-6 lg:!shadow-sm lg:!mb-4">
            <div className="flex flex-col gap-4 pt-2 lg:pt-0">
              <div className="hidden lg:block">
                <div className="main-phase">{phaseData.phase}</div>
                {phaseData.description && <div className="main-desc">{phaseData.description}</div>}
              </div>

              <div className="flex items-center justify-between lg:justify-start gap-6 shrink-0">
                <ChecklistToggle isActive={isChecklistMode} onToggle={setIsChecklistMode} />

                {isChecklistMode && (
                  <div className="mpp-progress-container flex-1 lg:flex-none lg:w-64">
                    <span className="mpp-progress-label">{phasePercentage}% Phase Complete</span>
                    <div className="mpp-progress-track">
                      <div
                        className="mpp-progress-fill"
                        style={{ width: `${phasePercentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="panel mt-4 lg:mt-0">
          {activeSection ? (
            <div className="mpp-section-container">
              {/* Hiding the Title on Mobile */}
              <h2 className="section-title text-xl lg:text-2xl hidden lg:block">
                {activeSection.title}
              </h2>
              {/*  Hiding the Summary on Mobile to save vertical space  */}
              {activeSection.summary && (<p className="section-summary hidden lg:block">{activeSection.summary}</p>)}

              {bullets.length ? (
                <ul className="items">
                  {bullets.map((bullet, idx) => {
                    const isCompleted = completedIds.includes(bullet.id);
                    const isExpanded = activeDetail?.id === bullet.id;

                    return (
                      <li
                        key={`${activeSection.id}-${idx}`}
                        className={`
                            group relative border-b border-gray-50 last:border-0
                            item
                            ${isChecklistMode ? 'cursor-pointer hover:bg-slate-50' : ''}
                        `}
                      >
                        <div className="mpp-item-content flex items-start min-h-[56px] lg:min-h-0 py-3 lg:py-2 gap-3">
                          {/* Checkbox Area */}
                          {isChecklistMode && (
                            <div
                              className="pt-1 shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleTask(bullet.id);
                              }}
                            >
                              <div className={`mpp-checkbox ${isCompleted ? 'is-active' : 'is-inactive'}`}>
                                {isCompleted && (
                                  <svg className="mpp-checkbox-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Content Area */}
                          <div
                            className="flex-1"
                            onClick={() => toggleDetail(bullet)}
                            onMouseEnter={() => handleMouseEnter(bullet)}
                            onMouseLeave={handleMouseLeave}
                          >
                            <div className={`item-title text-base lg:text-sm ${isChecklistMode && isCompleted ? 'opacity-40 grayscale line-through' : ''}`}>
                              {bullet.label}
                            </div>

                            {/* Mobile Expand Hint */}
                            {!isExpanded && (
                              <div className="lg:hidden text-xs mt-1 font-medium text-gray-400">
                                Tap for details
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Mobile Expert Guidance Drawer */}
                        {isExpanded && (
                          <div className="lg:hidden bg-gray-50 -mx-4 px-4 py-4 mb-4 border-y border-gray-100 animate-in slide-in-from-top-2">
                            <div className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-500">Expert Guidance</div>
                            <h4 className="font-semibold text-gray-900 mb-2">{bullet.label}</h4>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {bullet.detail || activeSection.summary}
                            </p>
                          </div>
                        )}
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

              {/* Mobile Reset Button */}
              {completedIds.length > 0 && (
                <div className="lg:hidden mt-8 flex justify-center pb-8">
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 rounded-lg bg-red-50 text-red-600 text-sm font-bold border border-red-100"
                  >
                    Clear {facilityType.toUpperCase()} Progress
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </main>

      {/* RIGHT: Context Panels (Desktop Only) */}
      <aside className="hidden lg:block mpp-right w-full">
        <div className="panel">
          {activeDetail ? (
            <div className="mpp-detail-view">
              <div className="panel-label">Expert Guidance</div>
              <h3 className="mpp-detail-title">
                {'label' in activeDetail ? activeDetail.label : activeDetail.title}
              </h3>
              <div className="mpp-detail-content">
                {'detail' in activeDetail ? (
                  <p>{activeDetail.detail}</p>
                ) : (
                  <p>{'summary' in activeDetail ? activeDetail.summary : null}</p>
                )}
              </div>
              {!('detail' in activeDetail) && (
                <div className="mpp-detail-hint">
                  Hover over items for specific Title 22/17 regulations.
                </div>
              )}
            </div>
          ) : isChecklistMode ? (
            <div className="mpp-detail-view">
              <div className="panel-label">Section Completion</div>
              <div className="mpp-progress-card">
                <div className="mpp-progress-percentage">
                  {bullets.length ? Math.round((bullets.filter((b) => completedIds.includes(b.id)).length / bullets.length) * 100) : 0}%
                </div>
                <p className="mpp-progress-text">
                  {bullets.filter((b) => completedIds.includes(b.id)).length} of {bullets.length} items completed
                </p>
                <p className="mpp-progress-subtext">{activeSection.title}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="panel-label hidden lg:block">Phase Overview</div>
              {phaseData.timeline && (
                <div className="meta-row">
                  <div className="meta-k">Typical timeline</div>
                  <div className="meta-v">{phaseData.timeline}</div>
                </div>
              )}
              {phaseData.commonDelays?.length ? (
                <>
                  <div className="mpp-subhead">Common delays</div>
                  <ul className="bullets">
                    {phaseData.commonDelays.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </>
              ) : null}
              {phaseData.reviewerFocus?.length ? (
                <>
                  <div className="mpp-subhead">What reviewers look for</div>
                  <ul className="bullets">
                    {phaseData.reviewerFocus.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </>
              ) : null}
              {!phaseData.timeline && !phaseData.commonDelays?.length && (
                <div className="empty hidden lg:block">
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