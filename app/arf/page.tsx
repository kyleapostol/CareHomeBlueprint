import PhaseTabs from '@/components/arf/PhaseTabs';
import DesktopArf from '@/components/arf/DesktopArf';
import DisclaimerGate from '@/components/arf/DisclaimerGate';

import type { PhaseData } from '@/types/types';

import prerequisites from '@/content/arf/prerequisites.json';
import licensing from '@/content/arf/licensing.json';
import vendorization from '@/content/arf/vendorization.json';
import './styles.css';

export default function ArfPage() {
  const phases: Record<'prerequisites' | 'licensing' | 'vendorization', PhaseData> = {
    prerequisites,
    licensing,
    vendorization,
  };

  return (
    <DisclaimerGate>
      <main className="page">
        <div className="page-inner">

          {/* Mobile */}
          <div className="mobile-only">
            <PhaseTabs phases={phases} />
          </div>

          {/* Desktop */}
          <div className="desktop-only">
            <DesktopArf phases={phases} />
          </div>
        </div>

        {/* <header className="arf-header">
          <p className="arf-eyebrow">ARF Guide</p>
          <h1>Adult Residential Facility Roadmap</h1>
          <p className="arf-subtitle">
            Follow each phase in order. Expand any section to review key actions,
            owners, and completion criteria.
          </p>
        </header> */}

      </main>
    </DisclaimerGate>
  );
}
