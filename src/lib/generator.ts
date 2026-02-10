import { SYLLABUS, type Subject } from './syllabus';
import { addDays, format } from 'date-fns';

export interface UserPreferences {
    hoursPerDay: {
        weekdays: number; // Mon-Fri
        weekend: number;  // Sat-Sun
    };
    proficiency: Record<Subject, number>; // 1 (Bad) to 5 (Good)
    startDate: Date;
}

export interface GeneratedTask {
    date: string; // YYYY-MM-DD
    subject: Subject;
    title: string;
    type: 'class' | 'exercise' | 'review' | 'simulation';
    is_ia_generated: boolean;
}

/**
 * Generates a schedule based on Proficiency and Importance.
 * Algorithm:
 * 1. Calculate Priority Score: (6 - Proficiency) + ImportanceBonus
 * 2. Sort all topics by Score.
 * 3. Distribute into available slots.
 */
export function generateSchedule(prefs: UserPreferences): GeneratedTask[] {
    const tasks: GeneratedTask[] = [];

    // --- 1. Graph Setup ---
    const topicMap = new Map(SYLLABUS.map(t => [t.id, t]));
    const dependents = new Map<string, string[]>(); // topicId -> [dependentIds]
    const inDegree = new Map<string, number>(); // topicId -> count of unmet prereqs

    // Initialize
    SYLLABUS.forEach(t => {
        inDegree.set(t.id, 0);
        dependents.set(t.id, []);
    });

    // Build Graph
    SYLLABUS.forEach(topic => {
        topic.prerequisites.forEach(prereqId => {
            if (topicMap.has(prereqId)) {
                dependents.get(prereqId)?.push(topic.id);
                inDegree.set(topic.id, (inDegree.get(topic.id) || 0) + 1);
            }
        });
    });

    // --- 2. Scoring Helper ---
    const importanceWeight: Record<string, number> = {
        'Very High': 4,
        'High': 3,
        'Medium': 2,
        'Low': 1
    };

    const getTopicScore = (topicId: string) => {
        const topic = topicMap.get(topicId)!;
        const prof = prefs.proficiency[topic.subject] || 3;

        // Lower proficiency (1) = Higher weight (10)
        // Higher proficiency (5) = Lower weight (2)
        const proficiencyScore = (6 - prof) * 2;

        const impactScore = importanceWeight[topic.importance];

        return proficiencyScore + impactScore;
    };

    // --- 3. Available Queue (Priority Queue logic) ---
    // Topics with inDegree 0 (no unmet prereqs)
    let availableQueue: string[] = SYLLABUS
        .filter(t => (inDegree.get(t.id) || 0) === 0)
        .map(t => t.id);

    // Sort queue initially
    availableQueue.sort((a, b) => getTopicScore(b) - getTopicScore(a));

    const processedTopics = new Set<string>();

    // --- 4. Scheduling Loop ---
    const DAYS_TO_PLAN = 90; // 3 months
    let currentDate = prefs.startDate;

    for (let day = 0; day < DAYS_TO_PLAN; day++) {
        // Stop if no more topics
        if (processedTopics.size === SYLLABUS.length) break;
        if (availableQueue.length === 0) break;

        const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
        const hoursAvailable = isWeekend ? prefs.hoursPerDay.weekend : prefs.hoursPerDay.weekdays;
        let minutesLeft = hoursAvailable * 60;

        // Try to fill the day
        let lastSubject: string | null = null;

        if (isWeekend) {
            // Forcing Essay on Weekends (e.g. Sunday) or if user prefers, just once a week.
            // Simple logic: If it's Sunday (0), add Essay task if not present.
            // Or better: Just check if we haven't added one this week.
        }

        // --- Weekly Essay Injection ---
        // Let's force it on Sundays (day 0) or Saturdays (6) if available, or just every 7 days.
        // Current logic: If Sunday, add Redação.
        if (currentDate.getDay() === 0) { // Sunday
            tasks.push({
                date: format(currentDate, 'yyyy-MM-dd'),
                subject: 'Redação',
                title: 'Produção de Redação Semanal',
                type: 'simulation', // or 'exercise'
                is_ia_generated: true
            });
            minutesLeft -= 90; // Dedicate 1h30 for essay
        }

        while (minutesLeft >= 45 && availableQueue.length > 0) {
            // Interleaving Logic:
            // Try to find a high-priority topic that is NOT the same subject as the last one.
            // valid candidates are top 5 of the queue
            const candidateWindow = 6;
            let selectedIndex = 0;

            if (lastSubject) {
                // Look ahead in the top N to find a different subject
                for (let i = 0; i < Math.min(candidateWindow, availableQueue.length); i++) {
                    const tId = availableQueue[i];
                    const t = topicMap.get(tId)!;
                    if (t.subject !== lastSubject) {
                        selectedIndex = i;
                        break;
                    }
                }
            }

            // If we strictly only have one subject left or priority gap is too huge, we might naturally pick index 0.
            // But if we found a good alternative, swap it to front to "shift" it.

            const topicId = availableQueue.splice(selectedIndex, 1)[0]; // Remove selected
            const topic = topicMap.get(topicId)!;

            lastSubject = topic.subject;
            processedTopics.add(topicId);

            // Calculate Time Needed
            // If proficiency is low (1 or 2), add 50% more time
            const prof = prefs.proficiency[topic.subject] || 3;
            const timeMultiplier = prof <= 2 ? 1.5 : 1.0;
            const actualMinutes = Math.ceil(topic.estimatedMinutes * timeMultiplier);

            // Create Tasks (Split into 90min blocks max)
            let remainingDuration = actualMinutes;
            let blockCount = 1;

            while (remainingDuration > 0) {
                // If unlikely to fit even a small slot, we break ensuring we don't overfill
                if (minutesLeft < 30) break;

                // Adjust block duration to fit remaining time
                const maxBlock = 90;
                let duration = Math.min(remainingDuration, maxBlock);
                if (duration > minutesLeft) duration = minutesLeft; // Cap at daily limit

                tasks.push({
                    date: format(currentDate, 'yyyy-MM-dd'),
                    subject: topic.subject,
                    title: blockCount > 1
                        ? `${topic.title} (Parte ${blockCount})`
                        : topic.title,
                    type: 'class',
                    is_ia_generated: true
                });

                remainingDuration -= duration;
                minutesLeft -= duration;
                blockCount++;

                // If we finished the topic theory, add exercise if time permits
                if (remainingDuration <= 0) {
                    // Check if we have space for exercise (min 30m)
                    if (minutesLeft >= 30) {
                        tasks.push({
                            date: format(currentDate, 'yyyy-MM-dd'),
                            subject: topic.subject,
                            title: `Exercícios: ${topic.title}`,
                            type: 'exercise',
                            is_ia_generated: true
                        });
                        minutesLeft -= 45; // Assume optimized 45m block for exercise
                    }
                }
            }

            // Unlock Dependents
            const children = dependents.get(topicId) || [];
            children.forEach(childId => {
                const currentInDegree = inDegree.get(childId) || 0;
                inDegree.set(childId, currentInDegree - 1);

                if (currentInDegree - 1 === 0) {
                    availableQueue.push(childId);
                }
            });

            // Re-sort Queue to maintain Priority
            availableQueue.sort((a, b) => getTopicScore(b) - getTopicScore(a));
        }

        currentDate = addDays(currentDate, 1);
    }

    return tasks;
}
