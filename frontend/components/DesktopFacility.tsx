'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ArfSection as FacilitySection, PhaseData, ArfBullet as FacilityBullet } from '@/types/types';
import { Switch } from '@headlessui/react';
import { toast } from 'sonner'; 
import { useRouter } from 'next/navigation';
import ChecklistToggle from './ChecklistToggle';

export type PhaseKey = 'prerequisites' | 'licensing' | 'vendorization';
export type FacilityType = 'arf' | 'rcfe' | 'adp';

type Props = {
  phases: Record<PhaseKey, PhaseData>;
  facilityType: FacilityType;
};

const PHASE_ORDER: PhaseKey[] = ['prerequisites', 'licensing', 'vendorization'];

export default function DesktopFacility({ phases, facilityType }: Props) {
  const router = useRouter();
  const [activePhase, setActivePhase] = useState<PhaseKey>('prerequisites');

  const phaseData = phases[activePhase];
  const sections: FacilitySection[] = phaseData.sections ?? [];

  const [activeSectionId, setActiveSectionId] = useState<string>(sections[0]?.id ?? '');
  const [activeDetail, setActiveDetail] = useState<FacilitySection | FacilityBullet | null>(null);

  const [isChecklistMode, setIsChecklistMode] = useState(false);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  // Integrated Handler for the Checklist Switch
  const handleToggleChange = (enabled: boolean) => {
    const token = localStorage.getItem('jwt');

    if (enabled && !token) {
      toast.error("Progress won't be saved", {
        description: "Sign in to keep track of your licensing journey.",
        duration: 5000,
        action: {
          label: "Sign In",
          onClick: () => router.push('/login'),
        },
      });
    }
    setIsChecklistMode(enabled);
  };

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
    <section className="mpp-desktop-grid" aria-label={`${facilityType} desktop navigator`}>
      {/* LEFT: Sidebar panels */}
      <aside className="mpp-left">
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
      <main className="mpp-main">
        <div className="panel">
          <div className="main-header sticky top-0 bg-white z-10">
            <div>
              <div className="main-phase">{phaseData.phase}</div>
              {phaseData.description && <div className="main-desc">{phaseData.description}</div>}
            </div>
            
            <div className="flex items-center gap-6">
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
                        onClick={() => isChecklistMode && toggleId(bullet.id)}
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
      <aside className="mpp-right">
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
              <div className="panel-label">Phase Overview</div>
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