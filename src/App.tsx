import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { StudyTimerProvider } from './contexts/StudyTimerContext';

import { Shell } from './layouts/Shell';
import { AuthLayout } from './layouts/AuthLayout';

import {
    Dashboard,
    Login,
    Schedule,
    Achievements,
    Simulations,
    Performance,
    Courses,
    Ranking,
    Profile,
    Materials,
} from './pages';

import { RequireSubscription } from './components/auth/RequireSubscription';

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <SubscriptionProvider>
                    <StudyTimerProvider>
                        <Routes>
                            {/* Auth routes — sem proteção */}
                            <Route element={<AuthLayout />}>
                                <Route path="/login" element={<Login />} />
                            </Route>

                            {/* App routes — requer auth + assinatura ativa */}
                            <Route
                                element={
                                    <RequireSubscription>
                                        <Shell />
                                    </RequireSubscription>
                                }
                            >
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/schedule" element={<Schedule />} />
                                <Route path="/simulations" element={<Simulations />} />
                                <Route path="/materials" element={<Materials />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/performance" element={<Performance />} />
                                <Route path="/ranking" element={<Ranking />} />
                                <Route path="/achievements" element={<Achievements />} />
                                <Route path="/courses" element={<Courses />} />
                            </Route>

                            {/* Fallback */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </StudyTimerProvider>
                </SubscriptionProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}
