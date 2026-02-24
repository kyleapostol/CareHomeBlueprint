export type ArfBullet = {
  id: string;      // Added for Checklist logic & persistence
  label: string;
  detail: string;
};

export type ArfSection = {
  id: string;
  title: string;
  summary: string;
  bullets: ArfBullet[];
};

export type PhaseData = {
  phase: string;
  description?: string;
  timeline?: string;       
  commonDelays?: string[]; 
  reviewerFocus?: string[];
  sections: ArfSection[];
};

/**
 * HoverDetail helps the Right Panel distinguish between 
 * a Section (Phase Overview) and a Bullet (Expert Guidance).
 */
export type HoverDetail = ArfSection | ArfBullet;