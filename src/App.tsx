
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import TestPage from "./pages/TestPage";
import ResultsPage from "./pages/ResultsPage";
import NotFound from "./pages/NotFound";
import { TestProvider } from "./context/TestContext";
import LoginPage from "./pages/LoginPage";
import StudentHome from "./pages/StudentHome";
import TeacherHome from "./pages/TeacherHome";
import AdminHome from "./pages/AdminHome";
import TestConfirmation from "./pages/TestConfirmation";
import RequireAuth from "./components/RequireAuth";
import CandidateListPage from "./pages/CandidateListPage";
import ExamListPage from "./pages/ExamListPage";
import DetailedResultsPage from "./pages/DetailedResultsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <TestProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/student-home" element={
              <RequireAuth allowedRoles={["student"]}>
                <StudentHome />
              </RequireAuth>
            } />
            
            <Route path="/teacher-home" element={
              <RequireAuth allowedRoles={["teacher"]}>
                <TeacherHome />
              </RequireAuth>
            } />
            
            <Route path="/admin-home" element={
              <RequireAuth allowedRoles={["admin"]}>
                <AdminHome />
              </RequireAuth>
            } />
            
            <Route path="/test-confirmation" element={
              <RequireAuth allowedRoles={["student"]}>
                <TestConfirmation />
              </RequireAuth>
            } />
            
            <Route path="/test" element={
              <RequireAuth allowedRoles={["student"]}>
                <TestPage />
              </RequireAuth>
            } />
            
            <Route path="/results" element={<ResultsPage />} />
            
            {/* New routes for candidate list, exam list, and detailed results */}
            <Route path="/candidate-list" element={
              <RequireAuth allowedRoles={["admin", "teacher"]}>
                <CandidateListPage />
              </RequireAuth>
            } />
            
            <Route path="/exam-list" element={
              <RequireAuth allowedRoles={["admin", "teacher"]}>
                <ExamListPage />
              </RequireAuth>
            } />
            
            <Route path="/detailed-results/:id" element={<DetailedResultsPage />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TestProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
