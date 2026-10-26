import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TurntableWashSection from './components/TurntableWashSection';
import PackagesSection from './components/PackagesSection';
import FacilitySection from './components/FacilitySection';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';
import BookingDrawer from './components/BookingDrawer';
import AdminLoginModal from './components/AdminLoginModal';
import AdminCRM from './components/AdminCRM';

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showingAdminView, setShowingAdminView] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const handleOpenBooking = (pkg = null) => {
    setSelectedPackage(pkg);
    setIsBookingOpen(true);
  };

  const handleScrollToTurntable = () => {
    if (showingAdminView) {
      setShowingAdminView(false);
      setTimeout(() => {
        const el = document.getElementById('turntable');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('turntable');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setShowingAdminView(true);
  };

  return (
    <div className="bg-[#080808] text-neutral-100 min-h-screen selection:bg-[#ff1e38] selection:text-white font-sans">
      
      {/* Sticky Luxury Navbar */}
      <Navbar
        onOpenBooking={() => handleOpenBooking(null)}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        onToggleAdminView={(val) => setShowingAdminView(val)}
        showingAdminView={showingAdminView}
      />

      {/* Main Content Area: switches between public Atelier and Admin CRM Leads */}
      {showingAdminView ? (
        <AdminCRM
          onReturnToSite={() => setShowingAdminView(false)}
          onOpenNewBooking={() => handleOpenBooking(null)}
        />
      ) : (
        <main>
          {/* Hero Section */}
          <Hero
            onOpenBooking={() => handleOpenBooking(null)}
            onScrollToTurntable={handleScrollToTurntable}
          />

          {/* Interactive Turntable & Scroll-to-Wash Section */}
          <TurntableWashSection
            onOpenBooking={() => handleOpenBooking(null)}
          />

          {/* Tailored Packages Section */}
          <PackagesSection
            onSelectPackage={(pkg) => handleOpenBooking(pkg)}
          />

          {/* Cleanroom Facility Section */}
          <FacilitySection
            onOpenBooking={() => handleOpenBooking(null)}
          />

          {/* FAQ Knowledge Base */}
          <FAQSection />

          {/* Atelier Footer */}
          <Footer
            onOpenAdminLogin={() => {
              if (isAdminLoggedIn) {
                setShowingAdminView(true);
              } else {
                setIsAdminLoginOpen(true);
              }
            }}
          />
        </main>
      )}

      {/* Booking Drawer (Slide-out panel) */}
      <BookingDrawer
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialPackage={selectedPackage}
        onOpenAdminCRM={() => {
          setIsAdminLoggedIn(true);
          setShowingAdminView(true);
        }}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}
