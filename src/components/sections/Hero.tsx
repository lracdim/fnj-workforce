import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import {
  GraduationCap, ClipboardList, Video, Newspaper,
  MapPin, Calendar, Play, ChevronDown,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const quickLinks = [
  { icon: GraduationCap, label: 'Academic Programs', href: '/programs' },
  { icon: ClipboardList, label: 'Admissions',         href: '/admissions' },
  { icon: Video,         label: 'Campus Tour',        href: '/tour' },
  { icon: Newspaper,     label: 'Latest News',        href: '/news' },
];

const particles = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  size: Math.random() * 3 + 2,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 5,
  duration: Math.random() * 6 + 7,
}));

export default function Hero() {
  const heroRef    = useRef<HTMLDivElement>(null);
  const imgRef     = useRef<HTMLDivElement>(null);
  const headRef    = useRef<HTMLDivElement>(null);
  const subRef     = useRef<HTMLParagraphElement>(null);
  const ctaRef     = useRef<HTMLDivElement>(null);
  const panelRef   = useRef<HTMLDivElement>(null);
  const stripRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Campus image zooms in on load
      gsap.fromTo(imgRef.current,
        { scale: 1.13 },
        { scale: 1.04, duration: 2.8, ease: 'power2.out' }
      );

      // Headline lines reveal upward, one by one
      const lines = headRef.current?.querySelectorAll('.h-line');
      gsap.fromTo(lines,
        { yPercent: 115, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.14, ease: 'power3.out', delay: 0.45 }
      );

      // Supporting text fades up
      gsap.fromTo(subRef.current,
        { y: 26, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 1.05 }
      );

      // CTA buttons stagger up
      const ctaChildren = ctaRef.current ? Array.from(ctaRef.current.children) : [];
      gsap.fromTo(ctaChildren,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, stagger: 0.1, ease: 'power2.out', delay: 1.2 }
      );

      // Glass panel slides in from right
      gsap.fromTo(panelRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.1, ease: 'power3.out', delay: 0.8 }
      );

      // Quick-access strip staggered up
      const stripChildren = stripRef.current ? Array.from(stripRef.current.children) : [];
      gsap.fromTo(stripChildren,
        { y: 38, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.09, ease: 'power2.out', delay: 1.4 }
      );

      // Scroll: image scales & drifts while hero exits
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
        onUpdate: (self) => {
          gsap.set(imgRef.current, {
            scale: 1.04 + self.progress * 0.09,
            yPercent: self.progress * 12,
          });
        },
      });
    }, heroRef);

    // Mouse parallax — image drifts subtly with cursor
    const onMouse = (e: MouseEvent) => {
      const xShift = (e.clientX / window.innerWidth - 0.5) * 16;
      const yShift = (e.clientY / window.innerHeight - 0.5) * 10;
      gsap.to(imgRef.current, {
        x: xShift,
        y: yShift,
        duration: 1.8,
        ease: 'power1.out',
        overwrite: 'auto',
      });
    };
    window.addEventListener('mousemove', onMouse);

    return () => {
      ctx.revert();
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen min-h-[700px] max-h-[1080px] overflow-hidden bg-ink"
    >
      {/* ── Campus image ── */}
      <div ref={imgRef} className="absolute inset-[-5%] will-change-transform">
        <img
          src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1920&q=85"
          alt="NSSC Campus"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>

      {/* ── Color overlays ── */}
      {/* Left-to-right gradient darkens the content side */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/45 to-ink/10" />
      {/* Bottom vignette for strip legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent" />
      {/* Soft green tint over entire image */}
      <div className="absolute inset-0" style={{ background: 'rgba(14,92,63,0.22)' }} />
      {/* Warm radial bloom on left */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 55% 60% at 15% 55%, rgba(14,92,63,0.38) 0%, transparent 70%)',
        }}
      />

      {/* ── Floating particles ── */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: 'rgba(255,255,255,0.18)',
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
          }}
        />
      ))}

      {/* ── Main layout ── */}
      <div className="relative z-10 h-full flex flex-col justify-between px-8 md:px-16 xl:px-24 pt-28 pb-0">

        {/* ── Content row ── */}
        <div className="flex items-center justify-between flex-1 gap-10">

          {/* Left — headline + description + CTAs */}
          <div className="max-w-[580px]">

            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-5">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="font-kanit text-gold/90 text-xs uppercase tracking-[0.22em] font-medium">
                Santa Rosa, Laguna · Est. NSSC
              </span>
            </div>

            {/* Headline */}
            <div ref={headRef} className="mb-6">
              {[
                { text: 'BUILD YOUR', gold: false },
                { text: 'FUTURE',     gold: true  },
                { text: 'AT NSSC',    gold: false },
              ].map(({ text, gold }) => (
                <div key={text} className="overflow-hidden leading-none">
                  <span
                    className={`h-line block font-teko font-bold uppercase tracking-tight
                      text-[76px] sm:text-[96px] lg:text-[112px] xl:text-[128px]
                      ${gold ? 'text-gold' : 'text-white'}`}
                    style={{ lineHeight: 0.9 }}
                  >
                    {text}
                  </span>
                </div>
              ))}
            </div>

            {/* Supporting text */}
            <p
              ref={subRef}
              className="font-kanit text-white/72 text-lg md:text-[1.2rem] leading-relaxed max-w-[460px] mb-9 font-light"
            >
              From Preschool to College, discover a campus where knowledge,<br className="hidden md:block" />
              character, and opportunity come together.
            </p>

            {/* CTAs */}
            <div ref={ctaRef} className="flex flex-wrap items-center gap-4">
              <Link
                to="/programs"
                className="font-kanit font-semibold px-8 py-4 bg-forest text-white rounded-full text-sm uppercase tracking-wider shadow-lg shadow-forest/40 hover:bg-forest-dark transition-all duration-300"
              >
                Explore Programs
              </Link>
              <Link
                to="/admissions"
                className="font-kanit font-semibold px-8 py-4 border-2 border-white/30 text-white rounded-full text-sm uppercase tracking-wider hover:border-white/65 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                Apply Now
              </Link>
            </div>
          </div>

          {/* Right — glass campus showcase panel */}
          <div ref={panelRef} className="hidden lg:block flex-shrink-0 w-[300px] xl:w-[340px]">
            <div
              className="rounded-3xl overflow-hidden border border-white/18 shadow-2xl"
              style={{ background: 'rgba(255,255,255,0.09)', backdropFilter: 'blur(22px)' }}
            >
              {/* 30-sec tour preview */}
              <div className="relative h-44 overflow-hidden group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=700&q=80"
                  alt="Campus preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-ink/45" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-13 h-13 w-12 h-12 rounded-full border-2 border-white/55 bg-white/12 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Play size={18} className="text-white ml-0.5" fill="white" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="font-kanit text-white/80 text-[11px] bg-ink/55 backdrop-blur-sm px-3 py-1 rounded-full">
                    🎥 30-sec campus tour preview
                  </span>
                </div>
              </div>

              {/* Info rows */}
              <div className="p-5 space-y-3.5">
                {[
                  {
                    icon: MapPin, bg: 'bg-gold/15', color: 'text-gold',
                    label: 'Location', value: 'Santa Rosa, Laguna',
                  },
                  {
                    icon: GraduationCap, bg: 'bg-gold/15', color: 'text-gold',
                    label: 'Academic Levels', value: 'Preschool → College',
                  },
                  {
                    icon: Calendar, bg: 'bg-forest/35', color: 'text-green-300',
                    label: 'Status', value: 'Enrollment Now Open', valueClass: 'text-green-300',
                  },
                ].map(({ icon: Icon, bg, color, label, value, valueClass }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon size={14} className={color} />
                    </div>
                    <div>
                      <p className="font-kanit text-white/45 text-[10px] uppercase tracking-wider mb-0.5">{label}</p>
                      <p className={`font-kanit text-sm font-medium ${valueClass ?? 'text-white'}`}>{value}</p>
                    </div>
                  </div>
                ))}

                <Link
                  to="/admissions"
                  className="block w-full mt-1 py-3 text-center bg-gold hover:bg-gold-light text-ink rounded-2xl font-kanit font-semibold text-sm transition-colors"
                >
                  Start Your Application →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Quick-access strip ── */}
        <div ref={stripRef} className="grid grid-cols-2 md:grid-cols-4 gap-3 py-6">
          {quickLinks.map(({ icon: Icon, label, href }) => (
            <Link
              key={label}
              to={href}
              className="group flex items-center gap-3 px-4 py-4 rounded-2xl border border-white/14 hover:border-white/32 hover:bg-white/12 transition-all duration-300"
              style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}
            >
              <div className="w-9 h-9 rounded-xl bg-gold/20 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/35 transition-colors duration-300">
                <Icon size={16} className="text-gold" />
              </div>
              <span className="font-kanit text-white text-sm font-medium leading-tight">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-[7.5rem] left-8 md:left-16 xl:left-24 z-10 flex items-center gap-2">
        <ChevronDown size={16} className="text-white/35 animate-bounce" />
        <span className="font-kanit text-white/35 text-[11px] uppercase tracking-[0.2em]">Scroll</span>
      </div>
    </section>
  );
}
