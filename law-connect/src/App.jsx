import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ClientDashboard from './pages/ClientDashboard';
import LawyerDashboard from './pages/LawyerDashboard';
import AskQuestionPage from './pages/AskQuestionPage';
import LawyerListPage from './pages/LawyerListPage';
import AnswerQuestionPage from './pages/AnswerQuestionPage';
import BookConsultationPage from './pages/BookConsultationPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/client-dashboard"
        element={
          <ProtectedRoute role="client">
            <ClientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lawyer-dashboard"
        element={
          <ProtectedRoute role="lawyer">
            <LawyerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ask"
        element={
          <ProtectedRoute role="client">
            <AskQuestionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lawyers"
        element={
          <ProtectedRoute role="client">
            <LawyerListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/book/:lawyerId"
        element={
          <ProtectedRoute role="client">
            <BookConsultationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/answer"
        element={
          <ProtectedRoute role="lawyer">
            <AnswerQuestionPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
