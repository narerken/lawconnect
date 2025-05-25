import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ClientDashboard from './pages/ClientDashboard';
import LawyerDashboard from './pages/LawyerDashboard';
import AskQuestionPage from './pages/AskQuestionPage';
import LawyerListPage from './pages/LawyerListPage';
import BookConsultationPage from './pages/BookConsultationPage';
import AnswerQuestionPage from './pages/AnswerQuestionPage';
import ChatPage from './pages/ChatPage';
import ProtectedRoute from './components/ProtectedRoute';
import LawyerRatingPage from './pages/LawyerRatingPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';


function App() {
  return (
    <Routes>
      <Route path='/' element={<HomePage/>} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/client-dashboard" element={<ProtectedRoute role="client"><ClientDashboard /></ProtectedRoute>} />
      <Route path="/lawyer-dashboard" element={<ProtectedRoute role="lawyer"><LawyerDashboard /></ProtectedRoute>} />
      <Route path="/ask" element={<ProtectedRoute role="client"><AskQuestionPage /></ProtectedRoute>} />
      <Route path="/lawyers" element={<ProtectedRoute role="client"><LawyerListPage /></ProtectedRoute>} />
      <Route path="/book/:lawyerId" element={<ProtectedRoute role="client"><BookConsultationPage /></ProtectedRoute>} />
      <Route path="/answer" element={<ProtectedRoute role="lawyer"><AnswerQuestionPage /></ProtectedRoute>} />
      <Route path="/chat/:partnerId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      <Route path="/lawyer-rating" element={<ProtectedRoute role="lawyer"><LawyerRatingPage /></ProtectedRoute>} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;