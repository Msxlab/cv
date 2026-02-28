export type Language = 'tr' | 'en' | 'fr' | 'de' | 'es';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  headline: string;
  summary: string;
  photo?: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  otherLinks?: { label: string; url: string }[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string[];
  achievements: string[];
  metrics: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa?: string;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: SkillLevel;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface Project {
  id: string;
  name: string;
  role: string;
  description: string;
  technologies: string[];
  impact?: string;
  url?: string;
  startDate: string;
  endDate: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface LanguageSkill {
  id: string;
  language: string;
  proficiency: 'native' | 'fluent' | 'professional' | 'intermediate' | 'basic';
}

export interface Volunteer {
  id: string;
  organization: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

export interface Publication {
  id: string;
  title: string;
  publisher: string;
  date: string;
  url?: string;
  description?: string;
}

export interface Reference {
  id: string;
  name: string;
  position: string;
  company: string;
  email: string;
  phone?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

export interface CVData {
  id: string;
  name: string;
  language: Language;
  template: 'classic' | 'modern' | 'executive' | 'technical' | 'creative';
  layout: 'single' | 'double';
  showPhoto: boolean;
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  projects: Project[];
  achievements: Achievement[];
  languages: LanguageSkill[];
  volunteers: Volunteer[];
  publications: Publication[];
  references: Reference[];
  customSections: CustomSection[];
  sectionOrder: string[];
  createdAt: string;
  updatedAt: string;
}

export interface JobDescription {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  keywords: string[];
}

export interface ATSAnalysis {
  score: number;
  missingKeywords: string[];
  suggestions: string[];
  warnings: string[];
  strengths: string[];
}

export interface ContentSuggestion {
  type: 'improvement' | 'warning' | 'info';
  section: string;
  message: string;
  suggestion?: string;
}
