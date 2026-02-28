import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CVData, JobDescription, ATSAnalysis, ContentSuggestion } from '../types/cv';

interface CVContextType {
  cvs: CVData[];
  currentCV: CVData | null;
  jobDescription: JobDescription | null;
  atsAnalysis: ATSAnalysis | null;
  suggestions: ContentSuggestion[];
  history: CVData[][];
  historyIndex: number;
  createCV: (name: string) => void;
  selectCV: (id: string) => void;
  updateCV: (data: Partial<CVData>) => void;
  deleteCV: (id: string) => void;
  duplicateCV: (id: string) => void;
  clearAllData: () => void;
  setJobDescription: (job: JobDescription | null) => void;
  analyzeATS: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

const createEmptyCV = (name: string): CVData => ({
  id: Date.now().toString(),
  name,
  language: 'en',
  template: 'modern',
  layout: 'single',
  accentColor: 'blue',
  fontFamily: 'sans',
  fontSize: 'medium',
  spacing: 'normal',
  showPhoto: true,
  personalInfo: {
    firstName: '',
    lastName: '',
    headline: '',
    summary: '',
    email: '',
    phone: '',
    location: '',
    otherLinks: [],
  },
  experiences: [],
  education: [],
  skills: [],
  certifications: [],
  projects: [],
  achievements: [],
  languages: [],
  volunteers: [],
  publications: [],
  references: [],
  customSections: [],
  sectionOrder: [
    'personalInfo',
    'summary',
    'experiences',
    'education',
    'skills',
    'projects',
    'certifications',
    'achievements',
    'languages',
    'volunteers',
    'publications',
    'references',
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const CVProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cvs, setCVs] = useState<CVData[]>([]);
  const [currentCV, setCurrentCV] = useState<CVData | null>(null);
  const [jobDescription, setJobDescription] = useState<JobDescription | null>(null);
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis | null>(null);
  const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([]);
  const [history, setHistory] = useState<CVData[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Initialize: load from sessionStorage, or create a fresh empty CV
  useEffect(() => {
    const savedCVs = sessionStorage.getItem('cvs');
    const savedCurrentCVId = sessionStorage.getItem('currentCVId');

    if (savedCVs) {
      const parsedCVs = JSON.parse(savedCVs);
      setCVs(parsedCVs);
      const current = parsedCVs.find((cv: CVData) => cv.id === savedCurrentCVId);
      setCurrentCV(current || parsedCVs[0] || null);
      setHistory([parsedCVs]);
      setHistoryIndex(0);
    } else {
      const initialCV = createEmptyCV('My Resume');
      setCVs([initialCV]);
      setCurrentCV(initialCV);
      setHistory([[initialCV]]);
      setHistoryIndex(0);
    }
  }, []);

  // Auto-save to sessionStorage
  useEffect(() => {
    if (cvs.length > 0) {
      sessionStorage.setItem('cvs', JSON.stringify(cvs));
      sessionStorage.setItem('currentCVId', currentCV?.id || '');
    }
  }, [cvs, currentCV]);

  const createCV = useCallback((name: string) => {
    const newCV = createEmptyCV(name);
    setCVs(prev => [...prev, newCV]);
    setCurrentCV(newCV);
  }, []);

  const selectCV = useCallback((id: string) => {
    const cv = cvs.find(c => c.id === id);
    if (cv) setCurrentCV(cv);
  }, [cvs]);

  const updateCV = useCallback((data: Partial<CVData>) => {
    if (!currentCV) return;

    const updatedCV = {
      ...currentCV,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    setCVs(prev => prev.map(cv => cv.id === currentCV.id ? updatedCV : cv));
    setCurrentCV(updatedCV);

    // Update history for undo/redo
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(cvs.map(cv => cv.id === currentCV.id ? updatedCV : cv));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [currentCV, cvs, history, historyIndex]);

  const deleteCV = useCallback((id: string) => {
    setCVs(prev => {
      const filtered = prev.filter(cv => cv.id !== id);
      if (currentCV?.id === id) {
        setCurrentCV(filtered.length > 0 ? filtered[0] : null);
      }
      return filtered;
    });
  }, [currentCV]);

  const duplicateCV = useCallback((id: string) => {
    const cv = cvs.find(c => c.id === id);
    if (!cv) return;

    const duplicatedCV = {
      ...cv,
      id: Date.now().toString(),
      name: `${cv.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCVs(prev => [...prev, duplicatedCV]);
    setCurrentCV(duplicatedCV);
  }, [cvs]);

  const clearAllData = useCallback(() => {
    const confirmClear = window.confirm(
      'This will delete all your CVs. This action cannot be undone. Continue?'
    );
    
    if (confirmClear) {
      const newCV = createEmptyCV('My Resume');
      setCVs([newCV]);
      setCurrentCV(newCV);
      setJobDescription(null);
      setAtsAnalysis(null);
      setSuggestions([]);
      setHistory([[newCV]]);
      setHistoryIndex(0);
      sessionStorage.clear();
    }
  }, []);

  const analyzeATS = useCallback(() => {
    if (!currentCV) return;

    // Mock ATS analysis - in real app, this would use AI/ML
    const keywords = jobDescription?.keywords || [];
    const cvText = JSON.stringify(currentCV).toLowerCase();
    
    const missingKeywords = keywords.filter(
      keyword => !cvText.includes(keyword.toLowerCase())
    );

    const score = Math.max(0, 100 - (missingKeywords.length * 10));

    const analysis: ATSAnalysis = {
      score,
      missingKeywords,
      suggestions: [
        'Add more quantifiable achievements with metrics',
        'Use action verbs at the start of bullet points',
        'Include relevant technical keywords from job description',
      ],
      warnings: [
        currentCV.experiences.length === 0 ? 'No work experience added' : '',
        currentCV.skills.length < 5 ? 'Add more relevant skills' : '',
      ].filter(Boolean),
      strengths: [
        currentCV.personalInfo.summary ? 'Professional summary present' : '',
        currentCV.projects.length > 0 ? 'Projects section included' : '',
      ].filter(Boolean),
    };

    setAtsAnalysis(analysis);
  }, [currentCV, jobDescription]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setCVs(history[newIndex]);
      setHistoryIndex(newIndex);
      
      const currentId = currentCV?.id;
      if (currentId) {
        const restoredCV = history[newIndex].find(cv => cv.id === currentId);
        if (restoredCV) setCurrentCV(restoredCV);
      }
    }
  }, [history, historyIndex, currentCV]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setCVs(history[newIndex]);
      setHistoryIndex(newIndex);
      
      const currentId = currentCV?.id;
      if (currentId) {
        const restoredCV = history[newIndex].find(cv => cv.id === currentId);
        if (restoredCV) setCurrentCV(restoredCV);
      }
    }
  }, [history, historyIndex, currentCV]);

  const value: CVContextType = {
    cvs,
    currentCV,
    jobDescription,
    atsAnalysis,
    suggestions,
    history,
    historyIndex,
    createCV,
    selectCV,
    updateCV,
    deleteCV,
    duplicateCV,
    clearAllData,
    setJobDescription,
    analyzeATS,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  };

  return <CVContext.Provider value={value}>{children}</CVContext.Provider>;
};

export const useCV = () => {
  const context = useContext(CVContext);
  if (context === undefined) {
    throw new Error('useCV must be used within a CVProvider');
  }
  return context;
};
