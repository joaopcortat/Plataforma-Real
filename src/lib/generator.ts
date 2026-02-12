import { SYLLABUS, type Subject, type Topic } from './syllabus';
import { addDays, format, getDay } from 'date-fns';

// ─── Public Types ────────────────────────────────────────
export interface UserPreferences {
    hoursPerDay: {
        weekdays: number;
        weekend: number;
    };
    proficiency: Record<Subject, number>; // 1–5
    startDate: Date;
    focusCourse?: 'Medicina' | 'Engenharia' | 'Direito' | 'Geral';
}

export interface GeneratedTask {
    date: string;          // YYYY-MM-DD
    subject: Subject;
    title: string;
    type: 'class' | 'exercise' | 'review' | 'simulation';
    is_ia_generated: boolean;
}

// ─── Constants ───────────────────────────────────────────
const BLOCK_CLASS = 60;   // minutes for a theory block
const BLOCK_EXERCISE = 45;   // minutes for a fixation block
const BLOCK_REVIEW = 20;   // minutes for a spaced-review
const BLOCK_REDACAO = 90;   // minutes for weekly essay
const MAX_SUBJECTS_DAY = 4;   // max distinct subjects per day

// ─── Scoring ─────────────────────────────────────────────
function scoreOf(topic: Topic, prefs: UserPreferences): number {
    let s = 0;
    s += (4 - topic.tier) * 200;                                         // Tier weight
    s += (6 - (prefs.proficiency[topic.subject] || 3)) * 30;            // Low prof → high score
    if (prefs.focusCourse === 'Medicina') {
        if (['Matemática', 'Física', 'Química', 'Biologia'].includes(topic.subject)) s += 80;
    }
    if (topic.category === 'Basics') s += 20;
    return s;
}

// ─── Main Generator ──────────────────────────────────────
export function generateSchedule(prefs: UserPreferences): GeneratedTask[] {
    const tasks: GeneratedTask[] = [];

    // ── 1. Build Dependency Graph ────────────────────────
    const topicMap = new Map<string, Topic>();
    const dependents = new Map<string, string[]>();
    const inDegree = new Map<string, number>();
    const remaining = new Map<string, number>();      // minutes left per topic

    for (const t of SYLLABUS) {
        topicMap.set(t.id, t);
        dependents.set(t.id, []);
        inDegree.set(t.id, 0);

        const prof = prefs.proficiency[t.subject] || 3;
        const mult = prof <= 2 ? 1.3 : 1.0;
        remaining.set(t.id, Math.ceil(t.estimatedMinutes * mult));
    }

    for (const t of SYLLABUS) {
        for (const prereq of t.prerequisites) {
            if (topicMap.has(prereq)) {
                dependents.get(prereq)!.push(t.id);
                inDegree.set(t.id, (inDegree.get(t.id) || 0) + 1);
            }
        }
    }

    // ── 2. Initialize Available Queue ────────────────────
    //    All topics with 0 in-degree are ready
    const available = new Set<string>();
    for (const t of SYLLABUS) {
        if ((inDegree.get(t.id) || 0) === 0) available.add(t.id);
    }

    const completed = new Set<string>();

    // ── 3. Spaced Reviews ────────────────────────────────
    const reviews = new Map<string, GeneratedTask[]>();
    function addReview(d: Date, task: GeneratedTask) {
        const k = format(d, 'yyyy-MM-dd');
        if (!reviews.has(k)) reviews.set(k, []);
        reviews.get(k)!.push(task);
    }

    // ── 4. Day-by-Day Scheduling ─────────────────────────
    let cur = new Date(prefs.startDate);
    const deadline = new Date(cur.getFullYear(), 9, 15);   // Oct 15
    const MAX_DAYS = 365;

    for (let d = 0; d < MAX_DAYS; d++) {
        if (cur > deadline) break;
        if (completed.size >= SYLLABUS.length && available.size === 0) break;

        const dateKey = format(cur, 'yyyy-MM-dd');
        const dow = getDay(cur);                       // 0 = Sun
        const isWknd = dow === 0 || dow === 6;
        const budget = (isWknd ? prefs.hoursPerDay.weekend : prefs.hoursPerDay.weekdays) * 60;
        let used = 0;
        const subjectsToday = new Set<Subject>();
        let lastSubj: Subject | null = null;

        // helper: can I fit X more minutes?
        const fits = (mins: number) => used + mins <= budget;

        // ─ A) Sunday Redação ─
        if (dow === 0 && fits(BLOCK_REDACAO)) {
            tasks.push({ date: dateKey, subject: 'Redação', title: 'Produção Textual Semanal', type: 'simulation', is_ia_generated: true });
            used += BLOCK_REDACAO;
            subjectsToday.add('Redação');
            lastSubj = 'Redação';
        }

        // ─ B) Scheduled Reviews ─
        const todayRevs = reviews.get(dateKey) || [];
        for (const rev of todayRevs) {
            if (!fits(BLOCK_REVIEW)) break;
            tasks.push(rev);
            used += BLOCK_REVIEW;
            subjectsToday.add(rev.subject);
        }
        reviews.delete(dateKey);

        // ─ C) Fill with New Content ─
        let iters = 0;
        while (fits(BLOCK_CLASS) && iters < 30) {
            iters++;

            // Sort available by score
            const sorted = Array.from(available)
                .map(id => ({ id, topic: topicMap.get(id)!, score: scoreOf(topicMap.get(id)!, prefs) }))
                .sort((a, b) => b.score - a.score);

            if (sorted.length === 0) break;

            // Pick candidate: prefer a different subject from lastSubj,
            // AND check subject count limit
            let pick: typeof sorted[0] | null = null;

            // Pass 1: different subject, not at limit
            for (const c of sorted) {
                if (c.topic.subject !== lastSubj && subjectsToday.size < MAX_SUBJECTS_DAY) {
                    pick = c;
                    break;
                }
                if (c.topic.subject !== lastSubj && subjectsToday.has(c.topic.subject)) {
                    pick = c;
                    break;
                }
            }

            // Pass 2: same subject is ok
            if (!pick) {
                for (const c of sorted) {
                    if (subjectsToday.has(c.topic.subject) || subjectsToday.size < MAX_SUBJECTS_DAY) {
                        pick = c;
                        break;
                    }
                }
            }

            // Pass 3: just take the first one
            if (!pick) pick = sorted[0];

            const topic = pick.topic;
            const topicId = pick.id;
            const rem = remaining.get(topicId) || 0;

            // How much time for this block?
            const blockTime = Math.min(BLOCK_CLASS, rem, budget - used);
            if (blockTime < 20) break;   // not worth it

            // ── Add Theory Task ──
            tasks.push({
                date: dateKey,
                subject: topic.subject,
                title: topic.title,
                type: 'class',
                is_ia_generated: true,
            });
            used += blockTime;
            subjectsToday.add(topic.subject);
            lastSubj = topic.subject;

            // Update remaining
            const newRem = rem - blockTime;
            remaining.set(topicId, newRem);

            // ── Topic Complete? ──
            if (newRem <= 0) {
                available.delete(topicId);
                completed.add(topicId);

                // Exercise block
                if (fits(BLOCK_EXERCISE)) {
                    const exTime = Math.min(BLOCK_EXERCISE, budget - used);
                    if (exTime >= 20) {
                        tasks.push({
                            date: dateKey,
                            subject: topic.subject,
                            title: `Fixação: ${topic.title}`,
                            type: 'exercise',
                            is_ia_generated: true,
                        });
                        used += exTime;
                    }
                }

                // Unlock dependents
                for (const childId of (dependents.get(topicId) || [])) {
                    const deg = (inDegree.get(childId) || 1) - 1;
                    inDegree.set(childId, deg);
                    if (deg <= 0 && !completed.has(childId) && !available.has(childId)) {
                        available.add(childId);
                    }
                }

                // Schedule spaced reviews (D+1, D+7, D+30)
                for (const [offset, label] of [[1, 'Revisão D+1'], [7, 'Revisão D+7'], [30, 'Revisão D+30']] as [number, string][]) {
                    const rd = addDays(cur, offset);
                    addReview(rd, {
                        date: format(rd, 'yyyy-MM-dd'),
                        subject: topic.subject,
                        title: `${label}: ${topic.title}`,
                        type: 'review',
                        is_ia_generated: true,
                    });
                }
            }
            // If topic not complete, it stays in `available` and will be picked up next day
        }

        cur = addDays(cur, 1);
    }

    return tasks;
}
