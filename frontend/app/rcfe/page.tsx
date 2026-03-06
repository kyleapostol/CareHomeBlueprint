import PhaseTabs from '@/components/PhaseTabs';
import DesktopFacility from '@/components/FacilityGuide';
import DisclaimerGate from '@/components/DisclaimerGate';

import type { PhaseData } from '@/types/types';

// Placeholder content - replace with RCFE specific JSONs when available
import prerequisites from '@/content/arf/prerequisites.json';
import licensing from '@/content/arf/licensing.json';
import vendorization from '@/content/arf/vendorization.json';

export default function RcfePage() {
  const phases: Record<'prerequisites' | 'licensing' | 'vendorization', PhaseData> = {
    prerequisites,
    licensing,
    vendorization,
  };

  return (
    <DisclaimerGate>
      <main className="page" data-facility-type="rcfe">
        <div className="page-inner">
          <header className="mpp-header">
            <p className="mpp-eyebrow">RCFE Guide</p>
            <h1>Residential Care Facility for the Elderly Roadmap</h1>
            <p className="mpp-subtitle">
              Follow each phase in order. Expand any section to review key actions, owners, and completion criteria.
            </p>
          </header>

          {/* Mobile */}
          <div className="mobile-only">
            <PhaseTabs facilityType="rcfe" phases={phases} />
          </div>

          {/* Desktop */}
          <div className="desktop-only">
            <DesktopFacility facilityType="rcfe" phases={phases} />
          </div>
        </div>
      </main>
    </DisclaimerGate>
  );
}