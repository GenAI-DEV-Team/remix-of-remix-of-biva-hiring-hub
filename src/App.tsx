import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/ThemeProvider";
import Jobs from "./pages/Jobs";
import DepartmentJobs from "./pages/DepartmentJobs";
import JobDetail from "./pages/JobDetail";
import CMSDashboard from "./pages/CMSDashboard";
import Editor from "./pages/Editor";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Jobs />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* CMS routes */}
              <Route path="/cms" element={<CMSDashboard />} />
              <Route path="/editor/new" element={<Editor />} />
              <Route path="/editor/:jobId" element={<Editor />} />
              
              {/* Dynamic job routes */}
              <Route path="/:departmentSlug" element={<DepartmentJobs />} />
              <Route path="/:departmentSlug/:jobSlug" element={<JobDetail />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
