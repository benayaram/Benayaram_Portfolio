import Navigation from './Navigation';
import Hero from './hero/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Work from './sections/Work';
import Certifications from './sections/Certifications';
import Experience from './sections/Experience';
import Achievements from './sections/Achievements';
import Contact from './sections/Contact';
import RevealObserver from './ui/RevealObserver';
import { SmoothScroll } from '@/lib/scroll';
export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SmoothScroll />
      <Navigation />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Work />
        <Certifications />
        <Experience />
        <Achievements />
        <Contact />
      </main>
      <RevealObserver />
    </>
  );
}
