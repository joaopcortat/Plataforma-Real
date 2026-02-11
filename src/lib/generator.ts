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
// Helper to identify phase
function getPhase(date: Date): 'foundation' | 'consolidation' {
    const month = date.getMonth(); // 0 = Jan, 1 = Feb, ..., 5 = June, 8 = Sept
    if (month >= 1 && month <= 4) return 'foundation'; // Feb - May
    return 'consolidation'; // June onwards
}

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
        'Very High': 5,
        'High': 4,
        'Medium': 3,
        'Low': 2
    };

    const getTopicScore = (topicId: string, currentPhase: 'foundation' | 'consolidation') => {
        const topic = topicMap.get(topicId)!;
        const prof = prefs.proficiency[topic.subject] || 3;

        // Base Score: Proficiency impact
        // Lower proficiency = Higher need
        const proficiencyScore = (6 - prof) * 2;
        const impactScore = importanceWeight[topic.importance];

        let score = proficiencyScore + impactScore;

        // Phase Tuning
        if (currentPhase === 'foundation') {
            // Boost "Basic" or "Foundation" categories
            if (topic.category === 'Basics' || topic.category === 'Física' || topic.category === 'Química' || topic.category === 'Biologia') {
                // Slightly boost basics to ensure we clear them
                if (topic.category === 'Basics') score += 5;
            }
        }

        return score;
    };

    // --- 3. Available Queue ---
    // Topics with inDegree 0
    let availableQueue: string[] = SYLLABUS
        .filter(t => (inDegree.get(t.id) || 0) === 0)
        .map(t => t.id);

    const processedTopics = new Set<string>();
    const completedTopics = new Set<string>(); // For review logic later

    // --- 4. Scheduling Loop (Feb -> Sept 30) ---
    let currentDate = new Date(prefs.startDate);
    const endOfYear = new Date(currentDate.getFullYear(), 8, 30); // Sept 30 (Month is 0-indexed: 8=Sept)

    // Safety break
    const MAX_DAYS = 300;
    let dayCount = 0;

    while (currentDate <= endOfYear && dayCount < MAX_DAYS) {
        dayCount++;

        // Stop if no more topics AND we are just filling with reviews (optional, but let's keep filling)
        // Actually user wants "June - Sept igualar conteúdo com questões"
        // If we run out of content, we should just do exercises/reviews.

        const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
        const hoursAvailable = isWeekend ? prefs.hoursPerDay.weekend : prefs.hoursPerDay.weekdays;
        let minutesLeft = hoursAvailable * 60;

        const phase = getPhase(currentDate);

        // --- Weekly Essay (Force on Sundays) ---
        if (currentDate.getDay() === 0) { // Sunday
            tasks.push({
                date: format(currentDate, 'yyyy-MM-dd'),
                subject: 'Redação',
                title: 'Produção de Redação Semanal',
                type: 'simulation',
                is_ia_generated: true
            });
            minutesLeft -= 90;
        }

        // Determine Strategy based on Phase
        // Phase 1: Mostly Theory (Classes), minimal exercises.
        // Phase 2: Theory + Exercises (1:1).

        // Sort queue for current phase preference
        availableQueue.sort((a, b) => getTopicScore(b, phase) - getTopicScore(a, phase));

        let lastSubject: string | null = null;

        while (minutesLeft >= 45) {
            // Interleaving Logic
            const candidateWindow = 6;
            let selectedIndex = -1;

            // Try to find a topic in availableQueue
            if (availableQueue.length > 0) {
                selectedIndex = 0; // Default to top
                if (lastSubject) {
                    for (let i = 0; i < Math.min(candidateWindow, availableQueue.length); i++) {
                        const tId = availableQueue[i];
                        const t = topicMap.get(tId)!;
                        if (t.subject !== lastSubject) {
                            selectedIndex = i;
                            break;
                        }
                    }
                }
            }

            // If we have a topic to study
            if (selectedIndex !== -1) {
                const topicId = availableQueue.splice(selectedIndex, 1)[0];
                const topic = topicMap.get(topicId)!;

                lastSubject = topic.subject;
                processedTopics.add(topicId);
                completedTopics.add(topicId);

                // Time Clalc
                const prof = prefs.proficiency[topic.subject] || 3;
                // In phase 1, we might spend more time on theory to be solid
                const timeMultiplier = prof <= 2 ? 1.5 : 1.0;
                const actualMinutes = Math.ceil(topic.estimatedMinutes * timeMultiplier);

                // Create Theory Blocks
                let remainingDuration = actualMinutes;
                let blockCount = 1;

                while (remainingDuration > 0 && minutesLeft >= 30) {
                    const maxBlock = 90;
                    let duration = Math.min(remainingDuration, maxBlock);
                    if (duration > minutesLeft) duration = minutesLeft;

                    tasks.push({
                        date: format(currentDate, 'yyyy-MM-dd'),
                        subject: topic.subject,
                        title: blockCount > 1 ? `${topic.title} (Parte ${blockCount})` : topic.title,
                        type: 'class',
                        is_ia_generated: true
                    });

                    remainingDuration -= duration;
                    minutesLeft -= duration;
                    blockCount++;
                }

                // Unlock Dependents immediately
                const children = dependents.get(topicId) || [];
                children.forEach(childId => {
                    const currentInDegree = inDegree.get(childId) || 0;
                    inDegree.set(childId, currentInDegree - 1);
                    if (currentInDegree - 1 === 0) {
                        availableQueue.push(childId);
                    }
                });

                // Exercises Logic based on Phase
                if (minutesLeft >= 30) {
                    if (phase === 'foundation') {
                        // Phase 1: Only small fixating exercise if we have time, NOT mandatory 1:1
                        // Let's add a small block if we have decent time left (e.g. > 45m)
                        if (minutesLeft >= 45) {
                            tasks.push({
                                date: format(currentDate, 'yyyy-MM-dd'),
                                subject: topic.subject,
                                title: `Fixação: ${topic.title}`,
                                type: 'exercise',
                                is_ia_generated: true
                            });
                            minutesLeft -= 45;
                        }
                    } else {
                        // Phase 2: "Igualar conteúdo com questões"
                        // Aggressively add exercise block
                        tasks.push({
                            date: format(currentDate, 'yyyy-MM-dd'),
                            subject: topic.subject,
                            title: `Exercícios Práticos: ${topic.title}`,
                            type: 'exercise',
                            is_ia_generated: true
                        });
                        minutesLeft -= 60; // Dedicate a solid hour
                    }
                }

            } else {
                // No new topics available (caught up or finished syllabus)
                // Fill with Reviews or Exercises from COMPLETED topics

                // Pick a random completed topic to review
                if (completedTopics.size > 0 && minutesLeft >= 45) {
                    const completedArray = Array.from(completedTopics);
                    // Prefer topics from weak subjects? For now random from completed.
                    const randomTopicId = completedArray[Math.floor(Math.random() * completedArray.length)];
                    const topic = topicMap.get(randomTopicId)!;

                    if (topic.subject !== lastSubject) {
                        tasks.push({
                            date: format(currentDate, 'yyyy-MM-dd'),
                            subject: topic.subject,
                            title: `Revisão/Questões: ${topic.title}`,
                            type: 'review',
                            is_ia_generated: true
                        });
                        minutesLeft -= 60;
                        lastSubject = topic.subject;
                    } else {
                        // Force break to avoid infinite loop if only 1 subject done
                        if (minutesLeft < 60) break;
                    }
                } else {
                    break; // Nothing to do
                }
            }
        }

        currentDate = addDays(currentDate, 1);
        // Resort provided queue for next day
        availableQueue.sort((a, b) => getTopicScore(b, phase) - getTopicScore(a, phase));
    }

    return tasks;
}
