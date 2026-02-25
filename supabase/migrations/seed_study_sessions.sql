-- ═══════════════════════════════════════════════════════════
--  seed_study_sessions.sql
--  10 dias de sessões de estudo para o usuário de teste
--  User ID: 8dc6a433-5e3e-4c65-8e2d-a7bc6005e447
--  Data atual: 2026-02-25 (Brasília)
--  Execute no SQL Editor do Supabase
-- ═══════════════════════════════════════════════════════════

-- Limpa sessões anteriores deste usuário (opcional — comente se não quiser)
-- DELETE FROM public.study_sessions WHERE user_id = '8dc6a433-5e3e-4c65-8e2d-a7bc6005e447';

INSERT INTO public.study_sessions
    (user_id, duration_seconds, classes_count, questions_count, subject_breakdown, notes, created_at)
VALUES

-- Dia 1: 25/02 - 10 dias atrás = 15/02 (segunda) — 4h
('8dc6a433-5e3e-4c65-8e2d-a7bc6005e447',
 14400, 3, 25,
 '{"linguagens": 10, "humanas": 6, "natureza": 9, "matematica": 0,
   "classes_linguagens": 1, "classes_humanas": 1, "classes_natureza": 1, "classes_matematica": 0}',
 'Revisão de Redação, Sociologia moderna',
 '2026-02-15T09:00:00'),

-- Dia 2: 16/02 (terça) — 6h
('8dc6a433-5e3e-4c65-8e2d-a7bc6005e447',
 21600, 4, 40,
 '{"linguagens": 12, "humanas": 8, "natureza": 12, "matematica": 8,
   "classes_linguagens": 1, "classes_humanas": 1, "classes_natureza": 1, "classes_matematica": 1}',
 'Funções, Ciências da Natureza, Literatura',
 '2026-02-16T09:00:00'),

-- Dia 3: 17/02 (quarta) — 4h
('8dc6a433-5e3e-4c65-8e2d-a7bc6005e447',
 14400, 2, 20,
 '{"linguagens": 0, "humanas": 5, "natureza": 10, "matematica": 5,
   "classes_linguagens": 0, "classes_humanas": 1, "classes_natureza": 1, "classes_matematica": 0}',
 'Química orgânica, Revolução Francesa',
 '2026-02-17T10:00:00'),

-- Dia 4: 18/02 (quinta) — 6h
('8dc6a433-5e3e-4c65-8e2d-a7bc6005e447',
 21600, 5, 45,
 '{"linguagens": 15, "humanas": 10, "natureza": 10, "matematica": 10,
   "classes_linguagens": 2, "classes_humanas": 1, "classes_natureza": 1, "classes_matematica": 1}',
 'Geometria plana, Biologia celular, Interpretação de texto',
 '2026-02-18T08:30:00'),

-- Dia 5: 19/02 (sexta) — 4h
('8dc6a433-5e3e-4c65-8e2d-a7bc6005e447',
 14400, 3, 22,
 '{"linguagens": 8, "humanas": 0, "natureza": 8, "matematica": 6,
   "classes_linguagens": 1, "classes_humanas": 0, "classes_natureza": 1, "classes_matematica": 1}',
 'Probabilidade, Ecologia',
 '2026-02-19T09:00:00'),

-- Dia 6: 20/02 (sábado) — 6h
('8dc6a433-5e3e-4c65-8e2d-a7bc6005e447',
 21600, 4, 38,
 '{"linguagens": 10, "humanas": 12, "natureza": 8, "matematica": 8,
   "classes_linguagens": 1, "classes_humanas": 2, "classes_natureza": 1, "classes_matematica": 0}',
 'Brasil Colônia, Modernismo literário',
 '2026-02-20T08:00:00'),

-- Dia 7: 21/02 (domingo) — 4h
('8dc6a433-5e3e-4c65-8e2d-a7bc6005e447',
 14400, 2, 18,
 '{"linguagens": 6, "humanas": 4, "natureza": 5, "matematica": 3,
   "classes_linguagens": 1, "classes_humanas": 0, "classes_natureza": 1, "classes_matematica": 0}',
 'Revisão geral leve',
 '2026-02-21T10:00:00'),

-- Dia 8: 22/02 (segunda) — 6h
('8dc6a433-5e3e-4c65-8e2d-a7bc6005e447',
 21600, 5, 42,
 '{"linguagens": 10, "humanas": 8, "natureza": 14, "matematica": 10,
   "classes_linguagens": 1, "classes_humanas": 1, "classes_natureza": 2, "classes_matematica": 1}',
 'Física mecânica, Trigonometria, Romantismo',
 '2026-02-22T09:00:00'),

-- Dia 9: 23/02 (terça) — 4h
('8dc6a433-5e3e-4c65-8e2d-a7bc6005e447',
 14400, 3, 28,
 '{"linguagens": 8, "humanas": 6, "natureza": 8, "matematica": 6,
   "classes_linguagens": 1, "classes_humanas": 1, "classes_natureza": 1, "classes_matematica": 0}',
 'Progressões, Segunda Guerra Mundial',
 '2026-02-23T09:30:00'),

-- Dia 10: 24/02 (quarta, ontem) — 6h
('8dc6a433-5e3e-4c65-8e2d-a7bc6005e447',
 21600, 4, 35,
 '{"linguagens": 10, "humanas": 5, "natureza": 12, "matematica": 8,
   "classes_linguagens": 1, "classes_humanas": 1, "classes_natureza": 1, "classes_matematica": 1}',
 'Ondulatória, Análise Combinatória, Regionalismo',
 '2026-02-24T09:00:00');

-- Verificação rápida
SELECT
    created_at::date AS dia,
    duration_seconds / 3600.0 AS horas,
    classes_count AS aulas,
    questions_count AS questoes
FROM public.study_sessions
WHERE user_id = '8dc6a433-5e3e-4c65-8e2d-a7bc6005e447'
ORDER BY created_at;
