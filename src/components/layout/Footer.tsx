import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
} from './SocialIcons';

const industries = [
  'Healthcare',
  'Hospitality',
  'Food & Beverage',
  'Information Technology',
  'Manufacturing',
];

export default function Footer() {
  return (
    <footer className="w-full bg-ink text-cream/80 pt-20 pb-8 px-6 md:px-14">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="font-display font-extrabold text-2xl text-gold">F&J</span>
              <span className="text-sm uppercase tracking-[0.15em] text-cream font-semibold">WorkForce</span>
            </div>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              Bringing talent and opportunity together since day one. A staffing partner built on trust, precision, and genuine care for people.
            </p>
            <div className="flex gap-3">
              {[FacebookIcon, InstagramIcon, LinkedinIcon].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center hover:bg-gold hover:border-gold hover:text-ink transition-all duration-300"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-gold text-xs uppercase tracking-[0.15em] font-bold mb-5">Company</h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Industries', href: '/industries' },
                { label: 'Services', href: '/services' },
                { label: 'Resources', href: '/resources' },
                { label: 'Contact', href: '/about#contact-form' },
              ].map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gold text-xs uppercase tracking-[0.15em] font-bold mb-5">Industries</h4>
            <ul className="space-y-3 text-sm">
              {industries.map((ind) => (
                <li key={ind}>
                  <Link to="/industries" className="hover:text-gold transition-colors">
                    {ind}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/industries"
                  className="text-gold inline-flex items-center gap-1 hover:gap-2 transition-all"
                >
                  View All <ArrowRight size={13} />
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-gold text-xs uppercase tracking-[0.15em] font-bold mb-5">Get in Touch</h4>
            <ul className="space-y-3 text-sm mb-6">
              <li className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 flex-shrink-0" />
                <span>Rio Vista, California</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={15} className="flex-shrink-0" />
                <span>[Phone TODO]</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={15} className="flex-shrink-0" />
                <span>[Email TODO]</span>
              </li>
            </ul>
            <Link
              to="/about#contact-form"
              className="inline-flex items-center gap-1.5 text-gold text-sm font-semibold hover:gap-2.5 transition-all mt-2"
            >
              Send a Message <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-cream/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-cream/50">
          <span>© {new Date().getFullYear()} F&J WorkForce LLC. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gold">Privacy Policy</a>
            <a href="#" className="hover:text-gold">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

