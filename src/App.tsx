import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Hero from '@/components/home/Hero';
import SkillsGrid from '@/components/skills/SkillsGrid';
import Projects from '@/components/projects/Projects';
import Dashboard from '@/components/dashboard/Dashboard';
import Achievements from '@/components/achievements/Achievements';
import Interests from '@/components/interests/Interests';
import Contact from '@/components/contact/Contact';
import ChatBubble from '@/components/ai/ChatBubble';
import { SkillFilterProvider } from '@/hooks/useSkillFilter';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

export default function App() {
  useSmoothScroll();
  return (
    <SkillFilterProvider>
      <div className="min-h-screen bg-bg text-text font-body selection:bg-primary selection:text-white">
        <Navbar />
        <main>
          <Hero />
          <SkillsGrid />
          <Projects />
          <Dashboard />
          <Achievements />
          <Interests />
          <Contact />
        </main>
        <Footer />
        <ChatBubble />
      </div>
    </SkillFilterProvider>
  );
}
