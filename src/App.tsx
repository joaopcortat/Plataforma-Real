import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Shell } from './layouts/Shell';
import { AuthLayout } from './layouts/AuthLayout';
import { StudyTimerProvider } from './contexts/StudyTimerContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
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
  Materials
} from './pages';

function PrivateRoute() {
  const { session, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Carregando...</div>;

  return session ? <Outlet /> : <Navigate to="/login" replace />;
}

function PublicRoute() {
  const { session, loading } = useAuth();

  if (loading) return null;

  return !session ? <Outlet /> : <Navigate to="/" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StudyTimerProvider>
          <Routes>
            {/* Public Routes (Login) */}
            <Route element={<AuthLayout />}>
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
              </Route>
            </Route>

            {/* Protected Routes (App) */}
            <Route element={<PrivateRoute />}>
              <Route element={<Shell />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/materials" element={<Materials />} />
                <Route path="/achievements" element={<Achievements />} />

                {/* Non-MVP Routes -> Under Construction */}
                <Route path="/performance" element={<Performance />} />
                <Route path="/simulations" element={<Simulations />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/ranking" element={<Ranking />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </StudyTimerProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App
