import { skillCategories } from '@/data/skills';
import SectionHeading from '@/components/common/SectionHeading';
import SkillCard from './SkillCard';

export default function SkillsGrid() {
  return (
    <section id="skills" className="relative py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Tech Stack"
          title="Skills & Tools"
          subtitle="A curated set of technologies I use to design, build, and ship production-grade systems across the stack."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillCategories.map((cat, i) => (
            <SkillCard key={cat.name} category={cat} delay={i * 0.05} />
          ))}
        </div>
      </div>
    </section>
  );
}
