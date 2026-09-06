"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import {
  Home,
  ImageIcon,
  Menu,
  MessageCircle,
  Scissors,
  Star,
  User,
  X,
} from "lucide-react";
import HeroFx from "@/components/hero-fx";
import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock";

const navLinks = [
  { label: "Início", href: "#home", icon: Home },
  { label: "Serviços", href: "#services", icon: Scissors },
  { label: "Galeria", href: "#gallery", icon: ImageIcon },
  { label: "Sobre", href: "#about", icon: User },
  { label: "Avaliações", href: "#reviews", icon: Star },
  { label: "Contato", href: "#contact", icon: MessageCircle },
] as const;
const services = ["Corte", "Barba", "Navalha", "Sobrancelha"];
const heroVideos = ["hero.mp4", "hero.mp4", "hero.mp4"];

const Hero = () => {
  const [titleNumber, setTitleNumber] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (current) => {
    const shouldShowBackground = current > 24;
    setHeaderScrolled((previous) =>
      previous === shouldShowBackground ? previous : shouldShowBackground,
    );
  });

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setTitleNumber((current) => (current + 1) % services.length);
    }, 2200);
    return () => window.clearTimeout(timeout);
  }, [titleNumber]);

  return (
    <section
      id="home"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-ink"
    >
      <video
        key={selectedVideo}
        className="absolute inset-0 h-full w-full object-cover animate-[slow-zoom_18s_ease-in-out_infinite_alternate]"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={heroVideos[selectedVideo]} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/75 to-ink/35" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(8,10,15,0.2)_45%,rgba(8,10,15,0.68)_100%)]" />
      <HeroFx />

      <header
        className={`fixed inset-x-0 top-0 z-999 flex h-16 items-center justify-between border-b px-6 transition-[background-color,border-color,backdrop-filter] duration-300 md:h-20 md:px-12 ${
          headerScrolled || mobileMenuOpen
            ? "border-bone/10 bg-ink/75 backdrop-blur-xl"
            : "border-transparent bg-transparent backdrop-blur-none"
        }`}
      >
        <a
          href="#home"
          className="font-display text-2xl tracking-wide text-white md:text-3xl"
        >
          J.D
        </a>

        <div className="absolute left-1/2 top-1 hidden -translate-x-1/2 md:block">
          <Dock panelHeight={56} magnification={62}>
            {navLinks.map(({ label, href, icon: Icon }) => (
              <DockItem
                key={label}
                className="rounded-full border border-bone/10 bg-surface text-bone/65 transition-colors hover:border-gold/45 hover:bg-bone/5 hover:text-bone"
              >
                <a
                  href={href}
                  aria-label={label}
                  className="absolute inset-0 z-10 rounded-full"
                />
                <DockLabel>{label}</DockLabel>
                <DockIcon>
                  <Icon className="h-full w-full" strokeWidth={1.6} />
                </DockIcon>
              </DockItem>
            ))}
          </Dock>
        </div>

        <a
          href="#contact"
          className="hidden min-h-12 items-center rounded-full border border-white/60 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-ink hover:shadow-xl hover:shadow-black/20 active:translate-y-0 md:inline-flex"
        >
          Agendar
        </a>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-bone/15 text-bone transition-colors hover:border-gold/50 hover:text-gold md:hidden"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>

        <AnimatePresence>
          {mobileMenuOpen ? (
            <motion.nav
              id="mobile-navigation"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-x-0 top-full border-b border-bone/10 bg-ink/95 px-6 py-5 shadow-2xl backdrop-blur-xl md:hidden"
            >
              <div className="grid gap-1">
                {navLinks.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-bone/70 transition-colors hover:bg-bone/5 hover:text-gold"
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.6} />
                    {label}
                  </a>
                ))}
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-3 flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-medium text-ink"
                >
                  Agendar
                </a>
              </div>
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </header>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-7 px-6 pb-8 pt-28 text-center md:gap-8 md:px-12">
        <h1 className="flex w-full flex-col items-center font-display text-5xl leading-[0.84] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
          <motion.span
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            J.D BARBEARIA
          </motion.span>

          <span className="relative mt-2 flex h-[0.95em] w-full items-center justify-center overflow-hidden text-gold md:mt-3">
            {services.map((service, index) => (
              <motion.span
                key={service}
                className="absolute whitespace-nowrap font-display"
                initial={{ opacity: 0, y: -120 }}
                animate={
                  titleNumber === index
                    ? { y: 0, opacity: 1 }
                    : { y: titleNumber > index ? -140 : 140, opacity: 0 }
                }
                transition={{ type: "spring", stiffness: 55, damping: 16 }}
              >
                {service}
              </motion.span>
            ))}
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="max-w-xl text-pretty text-sm leading-relaxed text-bone/70 md:text-lg"
        >
          Tradição de barbearia clássica com a precisão de um corte pensado pra
          você. Corte, barba e acabamento num ambiente pensado pra você sair
          renovado e no seu estilo.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
        >
          <a
            href="#contact"
            className="inline-flex rounded-xl bg-white px-7 py-3 text-sm font-medium text-ink shadow-xl shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-bone hover:shadow-2xl active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Marcar horário
          </a>
        </motion.div>
      </div>

      <div
        className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 md:bottom-8"
        role="group"
        aria-label="Selecionar vídeo de fundo"
      >
        {heroVideos.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setSelectedVideo(index)}
            aria-label={`Exibir vídeo ${index + 1}`}
            aria-pressed={selectedVideo === index}
            className={`h-1 rounded-full transition-[width,background-color] duration-300 ${
              selectedVideo === index
                ? "w-12 bg-gold"
                : "w-5 bg-bone/45 hover:bg-bone/75"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
