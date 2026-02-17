'use client';

import Image from 'next/image';

export default function Header() {
    return (
        <header className="topbar">
            <div className="topbar-inner">
                <div className="topbar-left">
                    <Image
                        src="/icon.png"
                        alt="CareHomeBlueprint"
                        width={140}
                        height={95}
                        sizes="140px"
                        priority
                    />

                    <div className="topbar-title">
                        <span className="topbar-brand">CareHome</span>
                        <span className="topbar-muted"> Navigator</span>
                    </div>
                </div>

                <div className="topbar-actions">
                    <button className="topbar-icon" aria-label="Menu">≡</button>
                    <button className="topbar-icon" aria-label="Help">?</button>
                </div>
            </div>
        </header>
    );
}
