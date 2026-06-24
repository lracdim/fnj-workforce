import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';

import Home from './pages/Home';
import About from './pages/About';
import Industries from './pages/Industries';
import Services from './pages/Services';
import Resources from './pages/Resources';
import ResourcePost from './pages/ResourcePost';

import { ContactModalProvider } from './context/ContactModalContext';
import ContactModal from './components/ui/ContactModal';
import { AuthProvider } from './admin/context/AuthContext';
import AdminLogin from './admin/pages/Login';
import Dashboard from './admin/pages/Dashboard';
import Candidates from './admin/pages/Candidates';
import CandidateProfile from './admin/pages/CandidateProfile';
import ClientCompanies from './admin/pages/ClientCompanies';
import ClientCompanyProfile from './admin/pages/ClientCompanyProfile';
import JobOrders from './admin/pages/JobOrders';
import JobOrderDetail from './admin/pages/JobOrderDetail';
import Placements from './admin/pages/Placements';
import Pipeline from './admin/pages/Pipeline';
import Interviews from './admin/pages/Interviews';
import ActivityLog from './admin/pages/ActivityLog';
import Reports from './admin/pages/Reports';
import BlogCMS from './admin/pages/BlogCMS';
import WebsiteEditor from './admin/pages/WebsiteEditor';
import AdminDocumentation from './admin/pages/Documentation';

gsap.registerPlugin(ScrollTrigger);

function useIsAdmin() {
  const location = useLocation();
  return location.pathname.startsWith('/admin');
}

function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);
}

function PublicRoutes() {
  useLenis();
  return (
    <ContactModalProvider>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/industries" element={<Industries />} />
          <Route path="/services" element={<Services />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resources/:slug" element={<ResourcePost />} />
        </Routes>
      </main>
      <Footer />
      <ContactModal />
    </ContactModalProvider>
  );
}

function AdminRoutes() {
  useLenis();
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/candidates" element={<Candidates />} />
      <Route path="/admin/candidates/:id" element={<CandidateProfile />} />
      <Route path="/admin/companies" element={<ClientCompanies />} />
      <Route path="/admin/companies/:id" element={<ClientCompanyProfile />} />
      <Route path="/admin/job-orders" element={<JobOrders />} />
      <Route path="/admin/job-orders/:id" element={<JobOrderDetail />} />
      <Route path="/admin/placements" element={<Placements />} />
      <Route path="/admin/pipeline" element={<Pipeline />} />
      <Route path="/admin/interviews" element={<Interviews />} />
      <Route path="/admin/activity" element={<ActivityLog />} />
      <Route path="/admin/reports" element={<Reports />} />
      <Route path="/admin/blog" element={<BlogCMS />} />
      <Route path="/admin/website-editor" element={<WebsiteEditor />} />
      <Route path="/admin/docs" element={<AdminDocumentation />} />
    </Routes>
  );
}

function AppContent() {
  const isAdmin = useIsAdmin();
  return isAdmin ? <AdminRoutes /> : <PublicRoutes />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}