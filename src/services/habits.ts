import { supabase } from '../lib/supabase';
import { format, subDays } from 'date-fns';

export interface Habit {
    id: string;
    user_id: string;
    name: string;
    created_at: string;
}

export interface HabitLog {
    id: string;
    user_id: string;
    habit_id: string;
    date: string;
    completed: boolean;
}

const DEFAULT_HABITS = [
    'Sol pela manhã',
    'Ingestão de 2L água',
    'Leitura',
    'Higiene bucal',
    'Ambiente de estudo organizado',
    'Almoço sem telas',
    'Telas off'
];

// Fetch all habits for the current user
export async function fetchHabits(): Promise<Habit[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

    if (error) throw error;

    // Auto-create default habits if user has 0 habits
    if (data && data.length === 0) {
        const defaultInserts = DEFAULT_HABITS.map(name => ({
            user_id: user.id,
            name
        }));

        const { data: newHabits, error: insertError } = await supabase
            .from('habits')
            .insert(defaultInserts)
            .select('*');

        if (insertError) throw insertError;
        return newHabits as Habit[];
    }

    return data as Habit[];
}

// Create a new habit
export async function createHabit(name: string): Promise<Habit> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
        .from('habits')
        .insert([{ user_id: user.id, name }])
        .select()
        .single();

    if (error) throw error;
    return data as Habit;
}

// Fetch habit logs for a date range (default last 14 days)
export async function fetchHabitLogs(days = 14): Promise<HabitLog[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const startDate = format(subDays(new Date(), days - 1), 'yyyy-MM-dd');
    const endDate = format(new Date(), 'yyyy-MM-dd');

    const { data, error } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDate)
        .lte('date', endDate);

    if (error) throw error;
    return data as HabitLog[];
}

// Toggle a habit log for today
export async function toggleHabitLog(habitId: string, date: string, completed: boolean): Promise<HabitLog> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Supabase upsert requires the unique constraint or primary key. 
    // We unique constraint on (habit_id, date) in our schema.
    const { data, error } = await supabase
        .from('habit_logs')
        .upsert({
            user_id: user.id,
            habit_id: habitId,
            date: date,
            completed: completed
        }, { onConflict: 'habit_id,date' })
        .select()
        .single();

    if (error) throw error;
    return data as HabitLog;
}

// Delete a habit
export async function deleteHabit(habitId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId)
        .eq('user_id', user.id);

    if (error) throw error;
}
