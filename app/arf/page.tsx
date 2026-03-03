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
          <div className="desktop-only arf-desktop">
            <DesktopArf phases={phases} />
          </div>
        </div>

      </main>
    </DisclaimerGate>
  );
}
