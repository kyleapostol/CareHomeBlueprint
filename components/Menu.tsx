'use client';

import React from 'react';
import Link from 'next/link';

interface MenuProps {
  activeOnly?: boolean;
}

const menuItems = [
  { label: 'Adult Residential Facility (ARF)', href: '/arf', active: true, icon: '🏠' },
  { label: 'Residential Care Facility for the Elderly (RCFE)', href: '/rcfe', active: true, icon: '👴' },
  { label: 'Adult Day Program (ADP)', href: '/adp', active: false, icon: '☀️' },
  { label: 'Contact Info', href: '/contact', active: true, icon: '📧' },
];

export default function Menu({ activeOnly = false }: MenuProps) {
  return (
    <nav className="mpp-menu-card">
      <div className="mpp-menu-header">
        <span className="mpp-menu-label">Navigation Tracks</span>
      </div>

      <ul className="mpp-menu-list">
        {menuItems.map((item) => {
          const isMuted = activeOnly && !item.active;

          return (
            <li key={item.label} className="mpp-menu-item-wrap">
              <Link 
                href={isMuted ? '#' : item.href} 
                onClick={(e) => isMuted && e.preventDefault()}
                className={`mpp-menu-link ${isMuted ? 'is-muted' : 'is-active'}`}
              >
                <span className="mpp-menu-icon">{item.icon}</span>
                
                <div className="mpp-menu-content">
                  <span className="mpp-menu-item-title">{item.label}</span>
                  {isMuted && <span className="mpp-menu-status">Phase: Development</span>}
                </div>

                {item.active && !isMuted && <div className="mpp-menu-indicator" />}
              </Link>
            </li>
          );
        })}
      </ul>
      
      <div className="mpp-menu-footer">
          <p className="mpp-menu-credits">Developed by Kyle Apostol</p>
      </div>
    </nav>
  );
}