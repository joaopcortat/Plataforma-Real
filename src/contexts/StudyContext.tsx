import { createContext, useContext, useState, type ReactNode } from 'react';
import { isBefore, startOfDay, parseISO } from 'date-fns';

export interface ScheduleItem {
    id: string;
    day: string; // "Seg", "Ter", etc.
    date: string; // ISO Date string
    subject: string;
    topic: string;
    duration: string;
    completed: boolean;
}

export interface Goal {
    id: string;
    title: string;
    target: number;
    current: number;
    unit: string;
    deadline: string; // ISO Date string
    category: 'questions' | 'hours' | 'topics';
}

interface StudyContextType {
    scheduleItems: ScheduleItem[];
    goals: Goal[];
    toggleTaskCompletion: (id: string) => void;
    recalculateRoute: () => void;
}

// Initial Mock Data
const INITIAL_SCHEDULE: ScheduleItem[] = [
    { id: '1', day: 'Seg', date: '2024-02-12', subject: 'Matemática', topic: 'Geometria Analítica', duration: '2h', completed: true },
    { id: '2', day: 'Seg', date: '2024-02-12', subject: 'Física', topic: 'Cinemática', duration: '1.5h', completed: true },
    { id: '3', day: 'Ter', date: '2024-02-13', subject: 'Química', topic: 'Estequiometria', duration: '2h', completed: false },
    { id: '4', day: 'Ter', date: '2024-02-13', subject: 'Biologia', topic: 'Citologia', duration: '1h', completed: false },
    { id: '5', day: 'Qua', date: '2024-02-14', subject: 'História', topic: 'Era Vargas', duration: '1.5h', completed: false },
    { id: '6', day: 'Qui', date: '2024-02-15', subject: 'Geografia', topic: 'Geopolítica', duration: '1.5h', completed: false },
    { id: '7', day: 'Sex', date: '2024-02-16', subject: 'Redação', topic: 'Tema: IA na Educação', duration: '2h', completed: false },
];

const INITIAL_GOALS: Goal[] = [
    { id: 'g1', title: 'Resolução de Questões', target: 500, current: 320, unit: 'questões', deadline: '2024-02-20', category: 'questions' },
    { id: 'g2', title: 'Horas de Estudo', target: 40, current: 24.5, unit: 'horas', deadline: '2024-02-18', category: 'hours' },
    { id: 'g3', title: 'Tópicos Finalizados', target: 20, current: 8, unit: 'tópicos', deadline: '2024-02-25', category: 'topics' },
];

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export function StudyProvider({ children }: { children: ReactNode }) {
    const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>(INITIAL_SCHEDULE);
    const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);

    const toggleTaskCompletion = (id: string) => {
        setScheduleItems(prev => prev.map(item => {
            if (item.id === id) {
                const newCompleted = !item.completed;

                // Side effect: Update goals
                updateGoals(item, newCompleted);

                return { ...item, completed: newCompleted };
            }
            return item;
        }));
    };

    const updateGoals = (item: ScheduleItem, isCompleted: boolean) => {
        setGoals(prev => prev.map(goal => {
            if (goal.category === 'topics') {
                return {
                    ...goal,
                    current: isCompleted ? goal.current + 1 : goal.current - 1
                };
            }
            // Simple heuristic for hours (parsing "2h" -> 2)
            if (goal.category === 'hours') {
                const hours = parseFloat(item.duration);
                return {
                    ...goal,
                    current: isCompleted ? goal.current + hours : goal.current - hours
                };
            }
            return goal;
        }));
    };

    const recalculateRoute = () => {
        // Logic: Move past uncompleted tasks to today or future
        const today = startOfDay(new Date('2024-02-13')); // Simulating "Today" is Tue Feb 13 for demo

        setScheduleItems(prev => {
            const newSchedule = [...prev];

            // Find overdue unfinished items
            const overdueItems = newSchedule.filter(item =>
                !item.completed && isBefore(parseISO(item.date), today)
            );

            if (overdueItems.length === 0) return prev;

            // Move them to "Tomorrow" (Wed) and pushing others forward - SIMPLIFIED LOGIC
            // In a real app this would complex algorithm.
            // For MVP: Mark them as "Moved" visually or just update date.

            alert(`Recalculando rota para ${overdueItems.length} itens atrasados...`);

            return newSchedule.map(item => {
                if (overdueItems.find(ov => ov.id === item.id)) {
                    return { ...item, date: '2024-02-14', day: 'Qua (Recuperação)' };
                }
                return item;
            });
        });
    };

    return (
        <StudyContext.Provider value={{ scheduleItems, goals, toggleTaskCompletion, recalculateRoute }}>
            {children}
        </StudyContext.Provider>
    );
}

export function useStudy() {
    const context = useContext(StudyContext);
    if (context === undefined) {
        throw new Error('useStudy must be used within a StudyProvider');
    }
    return context;
}
