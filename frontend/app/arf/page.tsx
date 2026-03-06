import FacilityGuide from '@/components/FacilityGuide'; // Use the new unified component
import DisclaimerGate from '@/components/DisclaimerGate';
import { ChecklistProvider } from '@/app/contexts/ChecklistProvider'; 
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
        <div className="page-inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <header className="mpp-header mb-8">
            <p className="mpp-eyebrow text-blue-600 font-semibold tracking-wide uppercase">ARF Guide</p>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">Adult Residential Facility Roadmap</h1>
            <p className="mpp-subtitle text-lg text-gray-600 mt-2 max-w-3xl">
              Follow each phase in order. Review key actions, owners, and completion criteria.
            </p>
          </header>

          <ChecklistProvider trackType="arf">
            <FacilityGuide facilityType="arf" phases={phases} />
          </ChecklistProvider>
          
        </div>
      </main>
    </DisclaimerGate>
  );
}