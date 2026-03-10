import FacilityGuide from '../../components/FacilityGuide'; // Use the new unified component
import DisclaimerGate from '../../components/DisclaimerGate';
import { ChecklistProvider } from '../../app/contexts/ChecklistProvider'; 
import type { PhaseData } from '../../types/types';

import prerequisites from '../../content/arf/prerequisites.json';
import licensing from '../../content/arf/licensing.json';
import vendorization from '../../content/arf/vendorization.json';

export default function ArfPage() {
  const phases: Record<'prerequisites' | 'licensing' | 'vendorization', PhaseData> = {
    prerequisites,
    licensing,
    vendorization,
  };

  return (
    <DisclaimerGate>
      <ChecklistProvider trackType="arf">
        <main className="page" data-facility-type="arf">
          <div className="page-inner">
            <header className="mpp-header">
              <p className="mpp-eyebrow">ARF Guide</p>
              <h1>Adult Residential Facility Roadmap</h1>
              <p className="mpp-subtitle">
                Follow each phase in order. Expand any section to review key actions, owners, and completion criteria.
              </p>
            </header>
            <FacilityGuide facilityType="arf" phases={phases} />
          </div>
        </main>
      </ChecklistProvider>
    </DisclaimerGate>
  );
}