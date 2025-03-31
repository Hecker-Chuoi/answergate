
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import LoginPage from "./pages/LoginPage";
import StudentHome from "./pages/StudentHome";
import AdminHome from "./pages/AdminHome";
import TestConfirmation from "./pages/TestConfirmation";
import TestPage from "./pages/TestPage";
import ResultsPage from "./pages/ResultsPage";
import DetailedResultsPage from "./pages/DetailedResultsPage";
import UserManagementPage from "./pages/UserManagementPage";
import ExamListPage from "./pages/ExamListPage";
import TestDetailsPage from "./pages/TestDetailsPage";
import TestFormPage from "./pages/TestFormPage";
import SessionListPage from "./pages/SessionListPage";
import SessionDetailsPage from "./pages/SessionDetailsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Student routes */}
          <Route path="/student-home" element={
            <RequireAuth allowedRoles={["USER"]}>
              <StudentHome />
            </RequireAuth>
          } />
          
          <Route path="/test-confirmation/:sessionId" element={
            <RequireAuth allowedRoles={["USER"]}>
              <TestConfirmation />
            </RequireAuth>
          } />
          
          <Route path="/test/:sessionId" element={
            <RequireAuth allowedRoles={["USER"]}>
              <TestPage />
            </RequireAuth>
          } />
          
          <Route path="/results/:sessionId" element={
            <RequireAuth allowedRoles={["USER"]}>
              <ResultsPage />
            </RequireAuth>
          } />
          
          {/* Admin routes */}
          <Route path="/admin-home" element={
            <RequireAuth allowedRoles={["ADMIN"]}>
              <AdminHome />
            </RequireAuth>
          } />
          
          <Route path="/user-management" element={
            <RequireAuth allowedRoles={["ADMIN"]}>
              <UserManagementPage />
            </RequireAuth>
          } />
          
          <Route path="/exam-list" element={
            <RequireAuth allowedRoles={["ADMIN"]}>
              <ExamListPage />
            </RequireAuth>
          } />

          <Route path="/create-test" element={
            <RequireAuth allowedRoles={["ADMIN"]}>
              <TestFormPage />
            </RequireAuth>
          } />

          <Route path="/edit-test/:id" element={
            <RequireAuth allowedRoles={["ADMIN"]}>
              <TestFormPage />
            </RequireAuth>
          } />

          <Route path="/test-details/:id" element={
            <RequireAuth allowedRoles={["ADMIN"]}>
              <TestDetailsPage />
            </RequireAuth>
          } />
          
          <Route path="/session-list" element={
            <RequireAuth allowedRoles={["ADMIN"]}>
              <SessionListPage />
            </RequireAuth>
          } />
          
          <Route path="/session-details/:id" element={
            <RequireAuth allowedRoles={["ADMIN"]}>
              <SessionDetailsPage />
            </RequireAuth>
          } />
          
          <Route path="/detailed-results/:sessionId" element={
            <RequireAuth allowedRoles={["ADMIN"]}>
              <DetailedResultsPage />
            </RequireAuth>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
