import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ProfilePage from '../pages/ProfilePage';
import SettingsPage from '../pages/SettingsPage';
import DashboardPage from '../pages/DashboardPage';
import SoilAnalysisPage from '../pages/SoilAnalysisPage';
import SoilAnalysisResultPage from '../pages/SoilAnalysisResultPage';
import HistoryPage from '../pages/HistoryPage';
import HistoryDetailPage from '../pages/HistoryDetailPage';
import HistoryComparePage from '../pages/HistoryComparePage';
import AnalyticsPage from '../pages/AnalyticsPage';
import RecommendationsPage from '../pages/RecommendationsPage';
import FertilizerRecommendationPage from '../pages/FertilizerRecommendationPage';
import CropRecommendationPage from '../pages/CropRecommendationPage';
import SoilImprovementPage from '../pages/SoilImprovementPage';
import ReportsPage from '../pages/ReportsPage';
import ReportDetailPage from '../pages/ReportDetailPage';
import AIAssistantPage from '../pages/AIAssistantPage';
import KnowledgeHubPage from '../pages/KnowledgeHubPage';
import { ProtectedRoute, PublicRoute } from '../components/ProtectedRoute';
import { AdminRoute } from '../components/ProtectedRoute';
import AdminPage from '../pages/AdminPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/knowledge" element={<KnowledgeHubPage />} />

      {/* Authentication Routes */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected Routes - Authenticated Users Only */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/soil-analysis" element={<ProtectedRoute><SoilAnalysisPage /></ProtectedRoute>} />
      <Route path="/soil-health" element={<ProtectedRoute><SoilAnalysisPage /></ProtectedRoute>} />
      <Route path="/nutrient-analysis" element={<ProtectedRoute><SoilAnalysisPage /></ProtectedRoute>} />
      <Route path="/soil-risks" element={<ProtectedRoute><SoilAnalysisPage /></ProtectedRoute>} />
      <Route path="/soil-analysis/upload-report" element={<ProtectedRoute><SoilAnalysisPage /></ProtectedRoute>} />
      <Route path="/soil-analysis/result/:id" element={<ProtectedRoute><SoilAnalysisResultPage /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
      <Route path="/history/compare" element={<ProtectedRoute><HistoryComparePage /></ProtectedRoute>} />
      <Route path="/history/:id" element={<ProtectedRoute><HistoryDetailPage /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
      <Route path="/recommendations" element={<ProtectedRoute><RecommendationsPage /></ProtectedRoute>} />
      <Route path="/recommendations/fertilizer" element={<ProtectedRoute><FertilizerRecommendationPage /></ProtectedRoute>} />
      <Route path="/recommendations/crops" element={<ProtectedRoute><CropRecommendationPage /></ProtectedRoute>} />
      <Route path="/recommendations/soil-improvement" element={<ProtectedRoute><SoilImprovementPage /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
      <Route path="/reports/:id" element={<ProtectedRoute><ReportDetailPage /></ProtectedRoute>} />
      <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistantPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

      <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminPage /></AdminRoute>} />
      <Route path="/admin/users/:id" element={<AdminRoute><AdminPage /></AdminRoute>} />
      <Route path="/admin/soil-analyses" element={<AdminRoute><AdminPage /></AdminRoute>} />
      <Route path="/admin/fertilizers" element={<AdminRoute><AdminPage /></AdminRoute>} />
      <Route path="/admin/crops" element={<AdminRoute><AdminPage /></AdminRoute>} />
      <Route path="/admin/reports" element={<AdminRoute><AdminPage /></AdminRoute>} />
      <Route path="/admin/analytics" element={<AdminRoute><AdminPage /></AdminRoute>} />
      <Route path="/admin/settings" element={<AdminRoute><AdminPage /></AdminRoute>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
