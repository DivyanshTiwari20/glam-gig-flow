import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";

// Import Layout components
import { Layout } from "./components/Layout";
import { AppLayout } from "./components/app/AppLayout";

// Import Page Components
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { Auth } from "./pages/Auth";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ProfilePage from "./pages/Profile";
import ProfileEditor from "./pages/ProfileEditor";
import TasksPage from "./pages/Tasks";
import CalendarPage from "./pages/Calendar";
import AnalyticsPage from "./pages/Analytics.tsx";
import PublicProfile from "./pages/PublicProfile";
import BookingsTablePage from "./pages/BookingsTablePage";
import PaymentStatus from "./pages/PaymentStatus";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsPage from "./pages/TermsPage";
import LandingPage from "./pages/LandingPage.tsx";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import Pricing from "./pages/Pricing.tsx";
import HelpCenterPage from "./pages/HelpCenterPage";
import Refundpage from "./pages/Refundpage.tsx";
import InvoicePage from "./pages/InvoicePage";
import Settings from "./pages/settings";
// ... other page imports if any

const queryClient = new QueryClient();

const App = () => {
  React.useEffect(() => {
    // Service worker is registered in src/main.tsx (prod only)

    // Add manifest link
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = '/manifest.json';
    document.head.appendChild(manifestLink);

    // Add theme color meta tag
    const themeColorMeta = document.createElement('meta');
    themeColorMeta.name = 'theme-color';
    themeColorMeta.content = '#8B5CF6';
    document.head.appendChild(themeColorMeta);

    // Add apple touch icon
    const appleTouchIcon = document.createElement('link');
    appleTouchIcon.rel = 'apple-touch-icon';
    appleTouchIcon.href = '/icon-192x192.png';
    document.head.appendChild(appleTouchIcon);

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme" enableSystem>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* --- PUBLIC Routes WITH Website Navbar --- */}
                <Route element={<Layout />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/contactpage" element={<ContactPage />} />
                  <Route path="/privacypolicy" element={<PrivacyPolicy />} />
                  <Route path="/termspage" element={<TermsPage />} />
                  <Route path="/help" element={<HelpCenterPage />} />
                  <Route path="/refundpage" element={<Refundpage />} />
                </Route>

                {/* --- AUTH Routes WITHOUT Navbar --- */}
                <Route path="/auth" element={<Auth />} />
                <Route path="/payment-status" element={<PaymentStatus />} />
                <Route path="/public-profile/:userId" element={<PublicProfile />} />

                {/* --- APP Routes WITH App Navbar (Protected) --- */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<AppLayout />}>
                    <Route path="/app" element={<Dashboard />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/profile-editor" element={<ProfileEditor />} />
                    <Route path="/tasks" element={<TasksPage />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/bookings" element={<BookingsTablePage />} />
                    <Route path="/invoice" element={<InvoicePage />} />
                    <Route path="/settings" element={<Settings />} />
                  </Route>
                </Route>
                
                {/* 404 Not Found Page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;