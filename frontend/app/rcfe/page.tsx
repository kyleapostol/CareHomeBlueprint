import FacilityGuide from '@/components/FacilityGuide';
import DisclaimerGate from '@/components/DisclaimerGate';
import { ChecklistProvider } from '@/app/contexts/ChecklistProvider';

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
      <ChecklistProvider trackType="rcfe">
        <main className="page" data-facility-type="rcfe">
          <div className="page-inner">
            <header className="mpp-header">
              <p className="mpp-eyebrow">RCFE Guide</p>
              <h1>Residential Care Facility for the Elderly Roadmap</h1>
              <p className="mpp-subtitle">
                Follow each phase in order. Expand any section to review key actions, owners, and completion criteria.
              </p>
            </header>

            <FacilityGuide facilityType="rcfe" phases={phases} />
          </div>
        </main>
      </ChecklistProvider>
    </DisclaimerGate>
  );
}