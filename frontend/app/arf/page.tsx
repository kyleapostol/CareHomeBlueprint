import PhaseTabs from '@/components/PhaseTabs';
import DesktopFacility from '@/components/DesktopFacility';
import DisclaimerGate from '@/components/DisclaimerGate';
import { ChecklistProvider } from '@/app/contexts/ChecklistProvider'; // 1. Import the Provider

import type { PhaseData } from '@/types/types';

import prerequisites from '@/content/arf/prerequisites.json';
import licensing from '@/content/arf/licensing.json';
import vendorization from '@/content/arf/vendorization.json';

export default function ArfPage() {
  const phases: Record<'prerequisites' | 'licensing' | 'vendorization', PhaseData> = {
    prerequisites,
    licensing,
    vendorization,
  };

  return (
    <DisclaimerGate>
      <main className="page" data-facility-type="arf">
        <div className="page-inner">
          <header className="mpp-header">
            <p className="mpp-eyebrow">ARF Guide</p>
            <h1>Adult Residential Facility Roadmap</h1>
            <p className="mpp-subtitle">
              Follow each phase in order. Expand any section to review key actions, owners, and completion criteria.
            </p>
          </header>

          {/* 2. Wrap the interactive components in the Provider */}
          <ChecklistProvider trackType="arf">
            
            {/* Mobile */}
            <div className="mobile-only">
              <PhaseTabs facilityType="arf" phases={phases} />
            </div>

            {/* Desktop */}
            <div className="desktop-only">
              <DesktopFacility facilityType="arf" phases={phases} />
            </div>

          </ChecklistProvider>
        </div>
      </main>
    </DisclaimerGate>
  );
}