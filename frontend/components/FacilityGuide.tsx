'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ArfSection as FacilitySection, PhaseData, ArfBullet as FacilityBullet } from '@/types/types';
import ChecklistToggle from './ChecklistToggle';
import { useChecklist } from '@/app/contexts/ChecklistProvider'; 

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

  if (!isInitialized) {
    return <div className="p-8 text-slate-400 animate-pulse">Loading your workspace...</div>;
  }

  return (
    <section className="flex flex-col lg:grid lg:grid-cols-[240px_1fr_280px] gap-4 lg:items-start w-full" aria-label={`${facilityType} navigator`}>
      
      {/* LEFT: Sidebar panels */}
      <aside className="mpp-left w-full flex flex-col gap-4 lg:gap-[0.75rem]">
        <div className="panel">
          <div className="panel-label hidden lg:block">Phases</div>
          <div className="flex flex-row lg:grid overflow-x-auto lg:overflow-visible gap-2 lg:gap-2 pb-2 lg:pb-0 nav-list">
            {PHASE_ORDER.map((key) => {
              if (!phases[key]) return null;
              const selected = key === activePhase;
              return (
                <button
                  key={key}
                  type="button"
                  className={`nav-item whitespace-nowrap lg:whitespace-normal shrink-0 ${selected ? 'is-active' : ''}`}
                  onClick={() => setActivePhase(key)}
                >
                  <div className="nav-title">{phases[key].phase}</div>
                  {phases[key].description && <div className="nav-sub hidden lg:block">{phases[key].description}</div>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="panel">
          <div className="panel-label hidden lg:block">Sections</div>
          <div className="flex flex-row lg:grid overflow-x-auto lg:overflow-visible gap-2 lg:gap-2 pb-2 lg:pb-0 nav-list">
            {sections.map((s) => {
              const selected = s.id === activeSection?.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  className={`nav-item compact whitespace-nowrap lg:whitespace-normal shrink-0 ${selected ? 'is-active' : ''}`}
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
        <div className="panel">
          <div className="main-header sticky top-0 bg-white z-10 flex flex-col gap-4">
            <div>
              <div className="main-phase">{phaseData.phase}</div>
              {phaseData.description && <div className="main-desc">{phaseData.description}</div>}
            </div>
            
            <div className="flex items-center gap-6 shrink-0">
              <ChecklistToggle isActive={isChecklistMode} onToggle={setIsChecklistMode} />
              
              {isChecklistMode && (
                <div className="mpp-progress-container">
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

          {activeSection ? (
            <div className="mpp-section-container">
              <h2 className="section-title">{activeSection.title}</h2>
              {activeSection.summary && <p className="section-summary">{activeSection.summary}</p>}

              {bullets.length ? (
                <ul className="items">
                  {bullets.map((bullet, idx) => {
                    const isCompleted = completedIds.includes(bullet.id);
                    return (
                      <li
                        key={`${activeSection.id}-${idx}`}
                        className={`item group ${isChecklistMode ? 'interactive cursor-pointer hover:bg-slate-50' : ''}`}
                        onMouseEnter={() => setActiveDetail(bullet)}
                        onMouseLeave={() => setActiveDetail(null)}
                        onClick={() => isChecklistMode && toggleTask(bullet.id)}
                      >
                        <div className="mpp-item-content">
                          {isChecklistMode && (
                            <div className={`mpp-checkbox ${isCompleted ? 'is-active' : 'is-inactive'}`}>
                              {isCompleted && (
                                <svg className="mpp-checkbox-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          )}
                          <div className={`item-title ${isChecklistMode && isCompleted ? 'opacity-40 grayscale line-through' : ''}`}>
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

      {/* RIGHT: Context Panels */}
      <aside className="mpp-right w-full">
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