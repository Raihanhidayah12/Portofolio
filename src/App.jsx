import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import React, { useState, lazy, Suspense, useMemo } from "react";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import About from "./Pages/About";
import AnimatedBackground from "./components/Background";
import FluidCursor from "./components/FluidCursor";
import { AnimatePresence, motion } from "framer-motion";
import { useAOS } from "./hooks/useAOS";
import { pageEnter, routeTransition } from "./lib/motion";
import Footer from "./components/Footer";

import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const Portofolio = lazy(() => import("./Pages/Portofolio"));
const ContactPage = lazy(() => import("./Pages/Contact"));
const ProjectDetails = lazy(() => import("./components/ProjectDetail"));
const WelcomeScreen = lazy(() => import("./Pages/WelcomeScreen"));
const NotFoundPage = lazy(() => import("./Pages/404"));

// Detect low-end device
const isLowEndDevice = () => {
  if (typeof window === 'undefined') return false;
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    navigator.hardwareConcurrency < 4 ||
    navigator.deviceMemory < 4
  );
};

const LandingPage = ({ showWelcome, setShowWelcome }) => {
  useAOS(!showWelcome);
  const isLowEnd = useMemo(() => isLowEndDevice(), []);

  return (
    <>
      <AnimatePresence mode="wait">
        {showWelcome && (
          <Suspense fallback={null}>
            <WelcomeScreen onLoadingComplete={() => setShowWelcome(false)} />
          </Suspense>
        )}
      </AnimatePresence>

      {!showWelcome && (
        <motion.div
          key="landing"
          initial="hidden"
          animate="visible"
          variants={pageEnter}
          className="relative"
        >
          <Navbar />
          <Home />
          <About />
          <Suspense fallback={<div className="h-20" />}>
            <Portofolio />
            <ContactPage />
          </Suspense>
          <Footer />
        </motion.div>
      )}
    </>
  );
};

const ProjectPageLayout = () => (
  <motion.div {...routeTransition}>
    <Suspense fallback={<div className="min-h-screen" />}>
      <ProjectDetails />
    </Suspense>
    <Footer />
  </motion.div>
);

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* PUBLIC */}
        <Route
          path="/"
          element={<LandingPageWrapper />}
        />

        <Route path="/project/:slug" element={<ProjectPageLayout />} />

        {/* AUTH */}
        <Route
          path="/login"
          element={
            <motion.div {...routeTransition}>
              <Login />
            </motion.div>
          }
        />

        {/* ADMIN (PROTECTED) */}
        <Route
          path="/dashboard/*"
          element={
            <motion.div {...routeTransition}>
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </motion.div>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <motion.div {...routeTransition}>
              <Suspense fallback={null}>
                <NotFoundPage />
              </Suspense>
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function LandingPageWrapper() {
  const [showWelcome, setShowWelcome] = useState(true);
  return (
    <motion.div {...routeTransition}>
      <LandingPage showWelcome={showWelcome} setShowWelcome={setShowWelcome} />
    </motion.div>
  );
}

function App() {
  const isLowEnd = useMemo(() => isLowEndDevice(), []);
  
  return (
    <HelmetProvider>
      {!isLowEnd && (
        <div className="pointer-events-none">
          <AnimatedBackground />
        </div>
      )}
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        {!isLowEnd && <FluidCursor />}
        <AppRoutes />
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;