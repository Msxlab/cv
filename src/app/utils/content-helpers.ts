import { format, isValid, parse, parseISO } from 'date-fns';
import { Language, PersonalInfo } from '../types/cv';
import { getTranslation } from './localization';

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
const monthDatePattern = /^\d{4}-\d{2}$/;

export function safeParseDate(dateStr: string | undefined | null): Date | null {
  if (!dateStr) return null;
  const normalized = dateStr.trim();
  if (!normalized) return null;

  const parsed = isoDatePattern.test(normalized)
    ? parseISO(normalized)
    : monthDatePattern.test(normalized)
      ? parse(normalized, 'yyyy-MM', new Date())
      : parseISO(normalized);

  return isValid(parsed) ? parsed : null;
}

export function toStoredDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function safeFormat(dateStr: string | undefined | null, fmt: string): string {
  const date = safeParseDate(dateStr);
  if (!date) return '';
  return format(date, fmt);
}

export function formatDateRange(
  startDate: string | undefined | null,
  endDate: string | undefined | null,
  current: boolean,
  language: Language,
  fmt = 'MMM yyyy'
): string {
  const start = safeFormat(startDate, fmt);
  const end = current ? getTranslation(language, 'present') : safeFormat(endDate, fmt);

  if (start && end) return `${start} – ${end}`;
  return start || end;
}

export function normalizeUrl(url: string | undefined | null): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) return trimmed;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return `mailto:${trimmed}`;
  if (/^[+\d][\d\s().-]+$/.test(trimmed)) return `tel:${trimmed.replace(/\s+/g, '')}`;
  return `https://${trimmed.replace(/^\/+/, '')}`;
}

export function getDisplayUrl(url: string | undefined | null): string {
  if (!url) return '';
  return url
    .trim()
    .replace(/^(https?:\/\/|mailto:|tel:)/i, '')
    .replace(/\/$/, '');
}

export interface PersonalLinkEntry {
  key: string;
  label: string;
  value: string;
  display: string;
}

export function getPersonalLinks(personalInfo: PersonalInfo): PersonalLinkEntry[] {
  return [
    personalInfo.website
      ? { key: 'website', label: 'website', value: personalInfo.website, display: getDisplayUrl(personalInfo.website) }
      : null,
    personalInfo.linkedin
      ? { key: 'linkedin', label: 'linkedin', value: personalInfo.linkedin, display: 'LinkedIn' }
      : null,
    personalInfo.github
      ? { key: 'github', label: 'github', value: personalInfo.github, display: 'GitHub' }
      : null,
    personalInfo.portfolio
      ? { key: 'portfolio', label: 'portfolio', value: personalInfo.portfolio, display: 'Portfolio' }
      : null,
    ...(personalInfo.otherLinks || [])
      .filter(link => link.url?.trim())
      .map((link, index) => ({
        key: `other-${index}`,
        label: link.label?.trim() || 'link',
        value: link.url,
        display: link.label?.trim() || getDisplayUrl(link.url),
      })),
  ].filter((link): link is PersonalLinkEntry => Boolean(link));
}

// Action verbs for CV writing
export const actionVerbs = {
  leadership: [
    'Led', 'Directed', 'Managed', 'Supervised', 'Coordinated', 'Orchestrated',
    'Spearheaded', 'Championed', 'Mentored', 'Guided'
  ],
  achievement: [
    'Achieved', 'Accomplished', 'Delivered', 'Exceeded', 'Surpassed',
    'Completed', 'Attained', 'Realized', 'Secured', 'Won'
  ],
  technical: [
    'Developed', 'Built', 'Implemented', 'Designed', 'Architected',
    'Engineered', 'Programmed', 'Coded', 'Created', 'Deployed'
  ],
  improvement: [
    'Improved', 'Optimized', 'Enhanced', 'Streamlined', 'Upgraded',
    'Revamped', 'Transformed', 'Modernized', 'Refined', 'Boosted'
  ],
  analysis: [
    'Analyzed', 'Evaluated', 'Assessed', 'Researched', 'Investigated',
    'Examined', 'Studied', 'Measured', 'Tested', 'Validated'
  ],
  communication: [
    'Presented', 'Communicated', 'Documented', 'Reported', 'Articulated',
    'Collaborated', 'Consulted', 'Advised', 'Negotiated', 'Facilitated'
  ],
};

// Common skill categories by role
export const skillsByRole = {
  'Software Engineer': {
    technical: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'Git'],
    tools: ['VS Code', 'Docker', 'AWS', 'PostgreSQL', 'MongoDB', 'Redis'],
    soft: ['Problem Solving', 'Team Collaboration', 'Code Review', 'Agile/Scrum'],
  },
  'Product Manager': {
    technical: ['Product Analytics', 'SQL', 'A/B Testing', 'User Research'],
    tools: ['Jira', 'Figma', 'Google Analytics', 'Mixpanel', 'Amplitude'],
    soft: ['Strategic Thinking', 'Stakeholder Management', 'Prioritization', 'Communication'],
  },
  'Data Scientist': {
    technical: ['Python', 'R', 'Machine Learning', 'Statistics', 'SQL', 'TensorFlow'],
    tools: ['Jupyter', 'Pandas', 'NumPy', 'Scikit-learn', 'Tableau', 'Power BI'],
    soft: ['Analytical Thinking', 'Data Visualization', 'Statistical Analysis', 'Communication'],
  },
  'Designer': {
    technical: ['UI/UX Design', 'Design Systems', 'Prototyping', 'User Research'],
    tools: ['Figma', 'Adobe XD', 'Sketch', 'Adobe Photoshop', 'Adobe Illustrator'],
    soft: ['Creative Thinking', 'User Empathy', 'Collaboration', 'Attention to Detail'],
  },
};

// Sample professional summaries by role and level
export const sampleSummaries = {
  'Software Engineer': {
    junior: 'Motivated software engineer with experience in full-stack development. Proficient in modern JavaScript frameworks and passionate about building scalable web applications. Strong foundation in computer science fundamentals and eager to contribute to innovative projects.',
    mid: 'Results-driven software engineer with 3-5 years of experience building high-performance web applications. Expertise in React, Node.js, and cloud technologies. Proven track record of delivering features that improve user experience and business metrics.',
    senior: 'Senior software engineer with 7+ years of experience architecting and building enterprise-scale applications. Deep expertise in full-stack development, system design, and technical leadership. Passionate about mentoring teams and driving engineering excellence.',
  },
  'Product Manager': {
    junior: 'Product manager with a passion for creating user-centric products. Experience working with cross-functional teams to deliver features that solve real customer problems. Strong analytical skills and data-driven approach to decision making.',
    mid: 'Strategic product manager with 3-5 years of experience driving product vision and execution. Proven ability to launch successful products, increase user engagement, and drive business growth through data-informed decisions.',
    senior: 'Senior product manager with 7+ years of experience leading product strategy for B2B and B2C products. Track record of launching products that have generated millions in revenue and served millions of users. Expert in product discovery, roadmap planning, and stakeholder management.',
  },
};

// Tips for different sections
export const sectionTips = {
  summary: [
    'Keep it to 2-3 sentences',
    'Highlight your most relevant experience',
    'Include measurable achievements',
    'Tailor to the job you\'re applying for',
    'Use strong action words',
  ],
  experience: [
    'Start with strong action verbs',
    'Quantify achievements with numbers',
    'Focus on impact, not just responsibilities',
    'Use the STAR method (Situation, Task, Action, Result)',
    'Include relevant keywords from job descriptions',
  ],
  skills: [
    'Separate technical and soft skills',
    'Be honest about your skill levels',
    'Include relevant tools and technologies',
    'Update regularly as you learn new skills',
    'Prioritize skills relevant to target roles',
  ],
  projects: [
    'Describe the problem you solved',
    'Highlight technologies used',
    'Quantify the impact if possible',
    'Include links to live projects or repositories',
    'Explain your specific role and contributions',
  ],
};

// ATS-friendly formatting tips
export const atsOptimizationTips = [
  'Use standard section headings (Experience, Education, Skills)',
  'Avoid images, graphics, or unusual formatting',
  'Use simple bullet points, not symbols',
  'Include relevant keywords from the job description',
  'Use standard fonts and consistent formatting',
  'Avoid tables and text boxes',
  'Save as PDF for best compatibility',
  'Include both acronyms and full terms (e.g., "ATS (Applicant Tracking System)")',
];

// Common CV mistakes
export const commonMistakes = [
  'Generic professional summary that could apply to anyone',
  'Listing responsibilities instead of achievements',
  'Not quantifying accomplishments',
  'Including irrelevant work experience',
  'Poor grammar and spelling errors',
  'Inconsistent formatting and dates',
  'Missing contact information',
  'Using personal pronouns (I, me, my)',
  'Including age, photo in countries where it\'s not standard',
  'Making CV too long (keep to 1-2 pages for most roles)',
];

export function improveBulletPoint(text: string): string {
  // Simple improvement suggestions (in a real app, this would use AI)
  let improved = text.trim();
  
  // Add action verb if missing
  const startsWithActionVerb = Object.values(actionVerbs)
    .flat()
    .some(verb => improved.toLowerCase().startsWith(verb.toLowerCase()));
  
  if (!startsWithActionVerb) {
    improved = `Led ${improved}`;
  }
  
  return improved;
}

export function extractKeywords(text: string): string[] {
  // Simple keyword extraction (in a real app, this would use NLP)
  const words = text.toLowerCase()
    .split(/\W+/)
    .filter(word => word.length > 4)
    .filter((word, idx, arr) => arr.indexOf(word) === idx);
  
  return words.slice(0, 20);
}
