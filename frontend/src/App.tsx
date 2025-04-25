import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { AuthProvider } from "./context/auth-context";
import Dashboard from "./pages/Dashboard";
import Today from "./pages/Today";
import { StickyNotesBoard } from "./pages/StickyNotesBoard";
import TasksList from "./components/TasksList";
import Settings from "./pages/Settings";
import AllTasksPage from "./pages/AllTasks";
import Upcoming from "./pages/Upcoming";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route path="tasks" element={<AllTasksPage />} />
            <Route path="today" element={<Today />} />
            <Route path="upcoming" element={<Upcoming />} />
            <Route path="sticky" element={<StickyNotesBoard />} />
            <Route path="lists/:listId" element={<TasksList />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="*"
            element={<Navigate to="/dashboard/tasks" replace />}
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
