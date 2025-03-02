
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TestProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
