import { Link, NavLink, useLocation } from 'react-router-dom';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { useContactModal } from '../../context/ContactModalContext';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Industries', href: '/industries' },
  { label: 'Services', href: '/services' },
  { label: 'Resources', href: '/resources' },
  { label: 'About', href: '/about' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { openModal } = useContactModal();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-400 flex items-center justify-between px-6 md:px-14 ${
          scrolled
            ? 'h-16 bg-cream/95 backdrop-blur-md shadow-sm'
            : 'h-[84px] bg-transparent'
        }`}
      >
        <Link to="/" className="flex items-baseline gap-2 z-10">
          <span className="font-display font-extrabold text-2xl text-gold">F&J</span>
          <span className="text-sm uppercase tracking-[0.15em] text-forest font-semibold hidden sm:inline">
            WorkForce
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === '/'}
              className={({ isActive }) =>
                `relative px-4 py-2 text-[13px] uppercase tracking-[0.04em] font-semibold transition-colors duration-200 ${
                  isActive ? 'text-forest' : 'text-ink/70 hover:text-forest'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-0.5 left-4 right-4 h-[2px] bg-gold"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={openModal}
          className="hidden lg:flex items-center gap-2 px-6 py-2.5 bg-forest text-cream rounded-full text-[13px] font-bold uppercase tracking-wide group hover:bg-forest-dark transition-colors duration-300"
        >
          Let's Work Together
          <ArrowUpRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </button>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden z-10 text-ink">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-cream z-[90] flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
              >
                <Link
                  to={link.href}
                  className="font-display font-bold text-3xl text-ink hover:text-forest transition-colors"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + navLinks.length * 0.06 }}
            >
              <button
                onClick={() => { setMobileOpen(false); openModal(); }}
                className="mt-4 px-8 py-3 bg-forest text-cream rounded-full text-sm font-bold uppercase tracking-wide"
              >
                Let's Work Together
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

