export type ArfSection = {
  id: string;
  title: string;
  summary: string;
  bullets: string[];
};

export type Item = {
  title: string;
  notes?: string;
};

export type Section = {
  id: string;
  title: string;
  summary?: string;        // optional short intro for the section
  items?: Item[];          // optional for now
};

export type PhaseData = {
  phase: string;
  description?: string;

  // NEW: right-panel content (optional)
  timeline?: string;       // e.g. "3–5 months"
  commonDelays?: string[]; // bullets
  reviewerFocus?: string[];// bullets

  sections: Section[];
};
