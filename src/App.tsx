import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AccessProvider } from "@/lib/accessControl";
import Index from "./pages/Index";
import CalendarPage from "./pages/Calendar";
import ProductsPage from "./pages/Products";
import SupportPage from "./pages/Support";
import CrisisPage from "./pages/Crisis";
import DevReport from "./pages/DevReport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AccessProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/crisis" element={<CrisisPage />} />
            <Route path="/dev-report" element={<DevReport />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AccessProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
