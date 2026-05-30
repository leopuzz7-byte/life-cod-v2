import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AccessProvider } from "@/lib/accessControl";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Footer } from "@/components/Footer";
import { LoadingScreen } from "@/components/LoadingScreen";

// Главная грузится сразу (первый экран), остальные страницы — лениво,
// чтобы стартовый бандл был меньше и сайт открывался быстрее.
import Index from "./pages/Index";
const CalendarPage = lazy(() => import("./pages/Calendar"));
const ProductsPage = lazy(() => import("./pages/Products"));
const SupportPage = lazy(() => import("./pages/Support"));
const CrisisPage = lazy(() => import("./pages/Crisis"));
const DevReport = lazy(() => import("./pages/DevReport"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Profile = lazy(() => import("./pages/Profile"));
const MyAnalyses = lazy(() => import("./pages/MyAnalyses"));
const AnalysisDetail = lazy(() => import("./pages/AnalysisDetail"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentFail = lazy(() => import("./pages/PaymentFail"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <AccessProvider>
            <Toaster />
            <Sonner />
            <div className="flex flex-col min-h-screen">
            <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/crisis" element={<CrisisPage />} />
              <Route path="/dev-report" element={<DevReport />} />

              {/* Auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Protected — личный кабинет */}
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/my-analyses" element={<ProtectedRoute><MyAnalyses /></ProtectedRoute>} />
              <Route path="/my-analyses/:id" element={<ProtectedRoute><AnalysisDetail /></ProtectedRoute>} />

              {/* Оплата — возврат после Робокассы */}
              <Route path="/payment/success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
              <Route path="/payment/fail" element={<PaymentFail />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
            <Footer />
            </div>
          </AccessProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
