import { createContext, useContext, useState, ReactNode } from 'react';

interface StudyTimerContextType {
    isTimerOpen: boolean;
    openTimer: () => void;
    closeTimer: () => void;

    isSessionModalOpen: boolean;
    sessionSeconds: number;
    openSessionModal: (seconds: number) => void;
    closeSessionModal: () => void;

    sessionNotes: string;
    setSessionNotes: (notes: string) => void;
}

const StudyTimerContext = createContext<StudyTimerContextType | undefined>(undefined);

export function StudyTimerProvider({ children }: { children: ReactNode }) {
    const [isTimerOpen, setIsTimerOpen] = useState(false);

    const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
    const [sessionSeconds, setSessionSeconds] = useState(0);
    const [sessionNotes, setSessionNotes] = useState('');

    const openTimer = () => setIsTimerOpen(true);
    const closeTimer = () => setIsTimerOpen(false);

    const openSessionModal = (seconds: number) => {
        setSessionSeconds(seconds);
        setIsSessionModalOpen(true);
    };

    const closeSessionModal = () => {
        setIsSessionModalOpen(false);
        setSessionSeconds(0);
        setSessionNotes(''); // Clear notes on close
    };

    return (
        <StudyTimerContext.Provider value={{
            isTimerOpen,
            openTimer,
            closeTimer,
            isSessionModalOpen,
            sessionSeconds,
            openSessionModal,
            closeSessionModal,
            sessionNotes,
            setSessionNotes
        }}>
            {children}
        </StudyTimerContext.Provider>
    );
}

export function useStudyTimer() {
    const context = useContext(StudyTimerContext);
    if (context === undefined) {
        throw new Error('useStudyTimer must be used within a StudyTimerProvider');
    }
    return context;
}
