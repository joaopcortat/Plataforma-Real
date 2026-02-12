import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import { TaskCard } from '../components/schedule/TaskCard';
import { CreateTaskModal } from '../components/schedule/CreateTaskModal';
import { GeneratorWizard } from '../components/schedule/generator/GeneratorWizard';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '../lib/supabase';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragStartEvent,
    type DragOverEvent,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Task {
    id: string;
    user_id: string;
    date: string;
    subject: string;
    title: string;
    type: 'class' | 'exercise' | 'review' | 'simulation';
    completed: boolean;
    is_ia_generated?: boolean;
}

// Draggable Task Wrapper
function SortableTask({ task, timeRange, duration, onToggle, onDelete }: { task: Task, timeRange: string, duration: number, onToggle: (id: string, val: boolean) => void, onDelete: () => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: task.id, data: { date: task.date, task } });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        zIndex: isDragging ? 999 : 'auto',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none">
            <TaskCard
                {...task}
                onToggle={(completed) => onToggle(task.id, completed)}
                onDelete={onDelete}
                timeRange={timeRange}
                duration={duration}
            />
        </div>
    );
}

// Memoized Droppable Day Container
const DroppableDay = React.memo(function DroppableDay({ date, children, isToday, loading }: { date: string, children: React.ReactNode, isToday: boolean, loading: boolean }) {
    const { setNodeRef } = useSortable({
        id: date,
        data: { type: 'day', date }
    });

    return (
        <div
            ref={setNodeRef}
            className={clsx(
                "flex flex-col min-h-[600px] bg-zinc-900/50 transition-opacity duration-300",
                isToday ? "bg-zinc-900" : "",
                loading ? "opacity-50" : "opacity-100"
            )}
        >
            {children}
        </div>
    );
});

// Memoized Day Column
const DayColumn = React.memo(function DayColumn({
    day,
    isToday,
    dateKey,
    tasks,
    loading,
    onAddTask,
    onToggleTask,
    onDeleteTask
}: {
    day: Date,
    isToday: boolean,
    dateKey: string,
    tasks: Task[],
    loading: boolean,
    onAddTask: (date: Date) => void,
    onToggleTask: (id: string, val: boolean) => void,
    onDeleteTask: (id: string) => void
}) {
    let currentMinutes = 8 * 60; // Start at 8:00 AM

    // Duration by task type
    const durationFor = (type: string) => {
        switch (type) {
            case 'class': return 60;
            case 'exercise': return 45;
            case 'review': return 20;
            case 'simulation': return 90;
            default: return 60;
        }
    };

    return (
        <DroppableDay date={dateKey} isToday={isToday} loading={loading}>
            {/* Day Header */}
            <div className={clsx(
                "text-center py-4 border-b border-zinc-800",
                isToday ? "bg-indigo-500/10" : "bg-zinc-900"
            )}>
                <div className="text-xs font-medium uppercase text-zinc-500 mb-1">
                    {format(day, 'EEE', { locale: ptBR })}
                </div>
                <div className={clsx(
                    "text-2xl font-bold flex justify-center items-center mx-auto w-10 h-10 rounded-full",
                    isToday ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25" : "text-zinc-400"
                )}>
                    {format(day, 'd')}
                </div>
            </div>

            {/* Sortable Area */}
            <div className="flex-1 p-2 space-y-2 relative">
                <SortableContext
                    items={tasks.map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {tasks.map((task) => {
                        const durationMin = durationFor(task.type);
                        const startMin = currentMinutes;
                        const endMin = startMin + durationMin;
                        const startStr = `${Math.floor(startMin / 60).toString().padStart(2, '0')}:${(startMin % 60).toString().padStart(2, '0')}`;
                        const endStr = `${Math.floor(endMin / 60).toString().padStart(2, '0')}:${(endMin % 60).toString().padStart(2, '0')}`;
                        currentMinutes = endMin;

                        return (
                            <SortableTask
                                key={task.id}
                                task={task}
                                timeRange={`${startStr} - ${endStr}`}
                                duration={durationMin}
                                onToggle={onToggleTask}
                                onDelete={() => onDeleteTask(task.id)}
                            />
                        );
                    })}
                </SortableContext>

                {/* Add Button */}
                <button
                    onClick={() => onAddTask(day)}
                    className="w-full py-3 rounded-lg border border-dashed border-zinc-800 flex items-center justify-center text-zinc-600 hover:text-zinc-400 hover:border-zinc-600 transition-all gap-2 text-xs font-medium mt-4 group"
                >
                    <Plus size={14} className="group-hover:scale-110 transition-transform" />
                    Adicionar
                </button>
            </div>
        </DroppableDay>
    );
});

export function Schedule() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [activeId, setActiveId] = useState<string | null>(null);

    const startOfCurrentWeek = useMemo(() => startOfWeek(currentDate, { weekStartsOn: 0 }), [currentDate]);
    const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i)), [startOfCurrentWeek]);

    // DnD Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Handlers
    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setLoading(false);
                return;
            }

            const start = weekDays[0].toISOString().split('T')[0];
            const end = weekDays[6].toISOString().split('T')[0];

            const { data } = await supabase
                .from('schedule_tasks')
                .select('*')
                .eq('user_id', user.id)
                .gte('date', start)
                .lte('date', end);

            if (data) {
                setTasks(data);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setTimeout(() => setLoading(false), 300);
        }
    }, [weekDays]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const toggleTask = useCallback(async (taskId: string, completed: boolean) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed } : t));
        try {
            await supabase.from('schedule_tasks').update({ completed }).eq('id', taskId);
        } catch (error) {
            console.error('Error updating task:', error);
            fetchTasks();
        }
    }, [fetchTasks]);

    const handleDeleteTask = useCallback((taskId: string) => {
        if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;

        setTasks(prev => prev.filter(t => t.id !== taskId));
        supabase.from('schedule_tasks').delete().eq('id', taskId).then(({ error }) => {
            if (error) {
                console.error('Error deleting task:', error);
                fetchTasks(); // Revert
            }
        });
    }, [fetchTasks]);

    const handleAddTask = useCallback((date: Date) => {
        setSelectedDate(date);
        setIsModalOpen(true);
    }, []);

    // --- DnD Handlers ---

    const handleDragStart = useCallback((event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    }, []);

    const handleDragOver = useCallback((event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        // Find items
        const activeTask = tasks.find(t => t.id === activeId);
        const overTask = tasks.find(t => t.id === overId);
        const isOverDay = weekDays.some(d => format(d, 'yyyy-MM-dd') === overId);

        if (!activeTask) return;

        // Moving between different containers (days)
        if (overTask && activeTask.date !== overTask.date) {
            setTasks((items) => {
                const activeIndex = items.findIndex((t) => t.id === activeId);
                const overIndex = items.findIndex((t) => t.id === overId);

                if (items[activeIndex].date !== items[overIndex].date) {
                    items[activeIndex].date = items[overIndex].date;
                    return arrayMove(items, activeIndex, overIndex - 1); // Insert before
                }
                return items;
            });
        }

        // Dropping directly onto a day column
        if (isOverDay && activeTask.date !== overId) {
            setTasks((items) => {
                const activeIndex = items.findIndex((t) => t.id === activeId);
                items[activeIndex].date = overId as string;
                return [...items]; // Trigger re-render
            });
        }
    }, [tasks, weekDays]);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeId = active.id as string;

        // Just find the task in current 'tasks' list (which should have the new date).
        const finalTask = tasks.find(t => t.id === activeId);

        if (finalTask) {
            supabase
                .from('schedule_tasks')
                .update({ date: finalTask.date })
                .eq('id', finalTask.id)
                .then(({ error }) => {
                    if (error) console.error('Error saving move:', error);
                });
        }
    }, [tasks]);


    // Group tasks by date for rendering
    const tasksByDate = useMemo(() => weekDays.reduce((acc, day) => {
        const dateKey = format(day, 'yyyy-MM-dd');
        acc[dateKey] = tasks.filter(task => task.date === dateKey);
        return acc;
    }, {} as Record<string, Task[]>), [tasks, weekDays]);

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Cronograma Semanal</h1>
                    <p className="text-zinc-400">Organize sua rotina. Arraste as tarefas para replanejar.</p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsGeneratorOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-indigo-500/20 mr-2 border border-indigo-400/30"
                    >
                        <Sparkles size={20} />
                        Novo Planejamento
                    </button>

                    <button
                        onClick={() => handleAddTask(new Date())}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
                    >
                        <Plus size={20} />
                        Nova Tarefa
                    </button>

                    <div className="flex items-center gap-2 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800">
                        <button
                            onClick={() => setCurrentDate(addDays(currentDate, -7))}
                            className="p-2 hover:bg-zinc-800 rounded-md transition-colors text-zinc-400 hover:text-white"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <span className="px-4 font-medium text-white min-w-[140px] text-center capitalize">
                            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                        </span>
                        <button
                            onClick={() => setCurrentDate(addDays(currentDate, 7))}
                            className="p-2 hover:bg-zinc-800 rounded-md transition-colors text-zinc-400 hover:text-white"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                {/* Days Grid */}
                <div className="grid grid-cols-1 md:grid-cols-7 gap-px bg-zinc-800 border border-zinc-800 rounded-xl overflow-hidden relative min-h-[600px]">

                    {loading && (
                        <div className="absolute inset-0 z-10 bg-zinc-900/50 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
                            <div className="flex flex-col items-center gap-3 animate-pulse">
                                <Sparkles className="text-indigo-500 w-10 h-10 animate-spin-slow" />
                                <p className="text-sm font-medium text-zinc-400">Carregando cronograma...</p>
                            </div>
                        </div>
                    )}

                    {weekDays.map((day) => {
                        const isToday = isSameDay(day, new Date());
                        const dateKey = format(day, 'yyyy-MM-dd');
                        const dayTasks = tasksByDate[dateKey] || [];

                        return (
                            <DayColumn
                                key={dateKey}
                                day={day}
                                isToday={isToday}
                                dateKey={dateKey}
                                tasks={dayTasks}
                                loading={loading}
                                onAddTask={handleAddTask}
                                onToggleTask={toggleTask}
                                onDeleteTask={handleDeleteTask}
                            />
                        );
                    })}
                </div>

                {/* Drag Overlay for smooth visual */}
                <DragOverlay>
                    {activeId ? (
                        <div className="opacity-80 rotate-2 scale-105 cursor-grabbing">
                            <TaskCard
                                {...tasks.find(t => t.id === activeId)!}
                                completed={false}
                                timeRange="Move to..."
                                duration={(() => { const t = tasks.find(t => t.id === activeId); return t ? ({ class: 60, exercise: 45, review: 20, simulation: 90 }[t.type] || 60) : 60; })()}
                            />
                        </div>
                    ) : null}
                </DragOverlay>

            </DndContext>

            <CreateTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchTasks}
                defaultDate={selectedDate}
            />

            {isGeneratorOpen && (
                <GeneratorWizard
                    onComplete={() => {
                        setIsGeneratorOpen(false);
                        fetchTasks();
                    }}
                    onCancel={() => setIsGeneratorOpen(false)}
                />
            )}
        </div>
    );
}
