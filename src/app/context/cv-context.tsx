import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { CVData } from '../types/cv';
import {
  clearAppSessionStorage,
  createEmptyCV,
  createId,
  ensureUniqueCVIds,
  hasMeaningfulCVContent,
  loadSessionFromStorage,
  normalizeCVData,
  saveSessionToStorage,
  StoredSessionState,
} from '../utils/cv-schema';

type SaveStatus = 'idle' | 'unsaved' | 'saved' | 'error';
export type ExportKind = 'backup' | 'pdf' | 'docx';

interface CVContextType {
  cvs: CVData[];
  currentCV: CVData | null;
  history: CVData[][];
  historyIndex: number;
  saveStatus: SaveStatus;
  lastSavedAt?: string;
  lastExportedAt?: string;
  lastBackupExportedAt?: string;
  lastPDFExportedAt?: string;
  lastDOCXExportedAt?: string;
  createCV: (name: string, initialData?: Partial<CVData>) => CVData;
  importCVAsNew: (cv: CVData) => CVData;
  replaceSessionWithCV: (cv: CVData) => CVData;
  startNewCV: (name?: string) => CVData;
  selectCV: (id: string) => void;
  updateCV: (data: Partial<CVData>) => void;
  deleteCV: (id: string) => void;
  duplicateCV: (id: string) => void;
  clearAllData: () => void;
  endSession: () => void;
  markExported: (kind?: ExportKind) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  hasMeaningfulContent: (cv?: CVData | null) => boolean;
}

const CVContext = createContext<CVContextType | undefined>(undefined);
const MAX_HISTORY = 75;

function pushHistorySnapshot(history: CVData[][], snapshot: CVData[], historyIndex: number) {
  const nextHistory = history.slice(0, historyIndex + 1);
  nextHistory.push(snapshot);
  return nextHistory.slice(-MAX_HISTORY);
}

export const CVProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cvs, setCVs] = useState<CVData[]>([]);
  const [currentCV, setCurrentCV] = useState<CVData | null>(null);
  const [history, setHistory] = useState<CVData[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [sessionState, setSessionState] = useState<StoredSessionState>({ initialized: false });
  const [hydrated, setHydrated] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const skipNextPersistRef = useRef(false);

  useEffect(() => {
    const loaded = loadSessionFromStorage();
    setCVs(loaded.cvs);
    setCurrentCV(loaded.cvs.find((cv) => cv.id === loaded.currentCVId) || loaded.cvs[0] || null);
    setHistory(loaded.cvs.length > 0 ? [loaded.cvs] : []);
    setHistoryIndex(loaded.cvs.length > 0 ? 0 : -1);
    setSessionState(loaded.sessionState);
    setHydrated(true);

    if (loaded.recoveredFromError) {
      toast.error('We could not read your last session, so we started a fresh one.');
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (skipNextPersistRef.current) {
      skipNextPersistRef.current = false;
      setSaveStatus('saved');
      return;
    }

    try {
      const nextState = {
        ...sessionState,
        initialized: true,
        lastSavedAt: new Date().toISOString(),
      };
      saveSessionToStorage(cvs, currentCV?.id || null, nextState);
      setSessionState(nextState);
      setSaveStatus('saved');
    } catch (error) {
      setSaveStatus('error');
      toast.error('This tab is out of space. Download your backup before continuing.');
    }
  }, [
    cvs,
    currentCV?.id,
    hydrated,
    sessionState.lastBackupExportedAt,
    sessionState.lastDOCXExportedAt,
    sessionState.lastExportedAt,
    sessionState.lastPDFExportedAt,
  ]);

  const replaceCVs = useCallback((nextCVs: CVData[], nextCurrentCV: CVData | null, trackHistory = true) => {
    const uniqueCVs = ensureUniqueCVIds(nextCVs.map((cv) => normalizeCVData(cv)));
    const safeCurrent = nextCurrentCV ? uniqueCVs.find((cv) => cv.id === nextCurrentCV.id) || uniqueCVs[0] || null : uniqueCVs[0] || null;

    setSaveStatus('unsaved');
    setCVs(uniqueCVs);
    setCurrentCV(safeCurrent);

    if (trackHistory && safeCurrent) {
      setHistory((prev) => {
        const next = pushHistorySnapshot(prev, uniqueCVs, historyIndex);
        setHistoryIndex(next.length - 1);
        return next;
      });
    }
  }, [historyIndex]);

  const createCV = useCallback((name: string, initialData?: Partial<CVData>) => {
    const now = new Date().toISOString();
    const newCV = initialData
      ? normalizeCVData(
          {
            ...initialData,
            id: createId(),
            name: initialData.name || name,
            createdAt: initialData.createdAt || now,
            updatedAt: initialData.updatedAt || now,
          },
          { forceNewId: true, fallbackName: name }
        )
      : createEmptyCV(name);

    setSaveStatus('unsaved');
    setCVs((prev) => ensureUniqueCVIds([...prev, newCV]));
    setCurrentCV(newCV);
    setHistory((prev) => {
      const snapshot = ensureUniqueCVIds([...cvs, newCV]);
      const next = pushHistorySnapshot(prev, snapshot, historyIndex);
      setHistoryIndex(next.length - 1);
      return next;
    });
    return newCV;
  }, [cvs, historyIndex]);

  const importCVAsNew = useCallback((cv: CVData) => {
    return createCV(cv.name || 'Imported Backup', cv);
  }, [createCV]);

  const replaceSessionWithCV = useCallback((cv: CVData) => {
    clearAppSessionStorage();
    const importedCV = normalizeCVData(cv, { forceNewId: true, fallbackName: cv.name || 'Imported Backup' });
    setCVs([importedCV]);
    setCurrentCV(importedCV);
    setHistory([[importedCV]]);
    setHistoryIndex(0);
    setSessionState({ initialized: true });
    setSaveStatus('unsaved');
    return importedCV;
  }, []);

  const startNewCV = useCallback((name = 'My Resume') => {
    clearAppSessionStorage();
    const newCV = createEmptyCV(name);
    setCVs([newCV]);
    setCurrentCV(newCV);
    setHistory([[newCV]]);
    setHistoryIndex(0);
    setSessionState({ initialized: true });
    setSaveStatus('unsaved');
    return newCV;
  }, []);

  const selectCV = useCallback((id: string) => {
    const cv = cvs.find((item) => item.id === id);
    if (cv) setCurrentCV(cv);
  }, [cvs]);

  const updateCV = useCallback((data: Partial<CVData>) => {
    if (!currentCV) return;

    const updatedCV = normalizeCVData({
      ...currentCV,
      ...data,
      id: currentCV.id,
      createdAt: currentCV.createdAt,
      updatedAt: new Date().toISOString(),
    });

    const nextCVs = cvs.map((cv) => (cv.id === currentCV.id ? updatedCV : cv));
    replaceCVs(nextCVs, updatedCV);
  }, [currentCV, cvs, replaceCVs]);

  const deleteCV = useCallback((id: string) => {
    const nextCVs = cvs.filter((cv) => cv.id !== id);
    const nextCurrent = currentCV?.id === id ? nextCVs[0] || null : currentCV;
    replaceCVs(nextCVs, nextCurrent);
  }, [currentCV, cvs, replaceCVs]);

  const duplicateCV = useCallback((id: string) => {
    const cv = cvs.find((item) => item.id === id);
    if (!cv) return;

    const duplicatedCV = normalizeCVData(
      {
        ...cv,
        id: createId(),
        name: `${cv.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      { forceNewId: true }
    );
    replaceCVs([...cvs, duplicatedCV], duplicatedCV);
  }, [cvs, replaceCVs]);

  const clearAllData = useCallback(() => {
    clearAppSessionStorage();
    skipNextPersistRef.current = true;
    setCVs([]);
    setCurrentCV(null);
    setHistory([]);
    setHistoryIndex(-1);
    setSessionState({ initialized: true });
    setSaveStatus('saved');
  }, []);

  const endSession = useCallback(() => {
    clearAllData();
  }, [clearAllData]);

  const markExported = useCallback((kind: ExportKind = 'backup') => {
    const now = new Date().toISOString();
    setSessionState((prev) => ({
      ...prev,
      initialized: true,
      lastExportedAt: now,
      lastBackupExportedAt: kind === 'backup' ? now : prev.lastBackupExportedAt,
      lastPDFExportedAt: kind === 'pdf' ? now : prev.lastPDFExportedAt,
      lastDOCXExportedAt: kind === 'docx' ? now : prev.lastDOCXExportedAt,
    }));
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasMeaningfulCVContent(currentCV)) return;
      if (sessionState.lastBackupExportedAt && currentCV?.updatedAt && sessionState.lastBackupExportedAt >= currentCV.updatedAt) return;

      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentCV, sessionState.lastBackupExportedAt]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      const snapshot = history[nextIndex];
      setCVs(snapshot);
      setHistoryIndex(nextIndex);
      setCurrentCV((prev) => (prev ? snapshot.find((cv) => cv.id === prev.id) || snapshot[0] || null : snapshot[0] || null));
      setSaveStatus('unsaved');
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const snapshot = history[nextIndex];
      setCVs(snapshot);
      setHistoryIndex(nextIndex);
      setCurrentCV((prev) => (prev ? snapshot.find((cv) => cv.id === prev.id) || snapshot[0] || null : snapshot[0] || null));
      setSaveStatus('unsaved');
    }
  }, [history, historyIndex]);

  const value: CVContextType = useMemo(() => ({
    cvs,
    currentCV,
    history,
    historyIndex,
    saveStatus,
    lastSavedAt: sessionState.lastSavedAt,
    lastExportedAt: sessionState.lastExportedAt,
    lastBackupExportedAt: sessionState.lastBackupExportedAt,
    lastPDFExportedAt: sessionState.lastPDFExportedAt,
    lastDOCXExportedAt: sessionState.lastDOCXExportedAt,
    createCV,
    importCVAsNew,
    replaceSessionWithCV,
    startNewCV,
    selectCV,
    updateCV,
    deleteCV,
    duplicateCV,
    clearAllData,
    endSession,
    markExported,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    hasMeaningfulContent: (cv?: CVData | null) => hasMeaningfulCVContent(cv === undefined ? currentCV : cv),
  }), [
    cvs,
    currentCV,
    history,
    historyIndex,
    saveStatus,
    sessionState.lastSavedAt,
    sessionState.lastExportedAt,
    sessionState.lastBackupExportedAt,
    sessionState.lastPDFExportedAt,
    sessionState.lastDOCXExportedAt,
    createCV,
    importCVAsNew,
    replaceSessionWithCV,
    startNewCV,
    selectCV,
    updateCV,
    deleteCV,
    duplicateCV,
    clearAllData,
    endSession,
    markExported,
    undo,
    redo,
  ]);

  return <CVContext.Provider value={value}>{children}</CVContext.Provider>;
};

export const useCV = () => {
  const context = useContext(CVContext);
  if (context === undefined) {
    throw new Error('useCV must be used within a CVProvider');
  }
  return context;
};
