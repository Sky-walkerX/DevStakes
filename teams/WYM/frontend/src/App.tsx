import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import CalendarPage from './pages/CalendarPage';
import SyllabusPage from './pages/SyllabusPage';
import AnalyticsPage from './pages/AnalyticsPage';
import NewNodePage from './pages/NewNodePage';
import NewProjectPage from './pages/NewProjectPage';
import { useCalendarStore } from './store/useCalendarStore';
import { useNodeStore } from './store/useNodeStore';

/* ──────────────────────────────────────────────────────────
   App — Root component with routing
   All pages render inside the DashboardLayout shell
   Fetches data from FastAPI backend on mount (falls back to local data)
   ────────────────────────────────────────────────────────── */

function App() {
  const fetchCalendar = useCalendarStore((s) => s.fetchFromBackend);
  const fetchNodes = useNodeStore((s) => s.fetchFromBackend);

  useEffect(() => {
    // Fetch data from the backend on initial load
    fetchCalendar();
    fetchNodes();
  }, [fetchCalendar, fetchNodes]);

  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/syllabus" element={<SyllabusPage />} />
          <Route path="/syllabus/new" element={<NewNodePage />} />
          <Route path="/project/new" element={<NewProjectPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}

export default App;
