import { motion } from 'framer-motion';
import SectionHeading from '@/components/common/SectionHeading';
import { RevealGroup, RevealItem } from '@/components/common/Reveal';
import { interests } from '@/data/interests';

export default function Interests() {
  return (
    <section id="interests" className="relative py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Research & Curiosity"
          title="Interests"
          subtitle="The frontiers of intelligence I'm actively exploring — from today's neural networks to tomorrow's quantum-aware systems."
        />

        <RevealGroup
          stagger={0.08}
          amount={0.1}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
        >
          {interests.map((it) => (
            <RevealItem key={it.id} className="h-full">
              <motion.div
                whileHover={{ y: -6 }}
                className="group relative h-full glass rounded-2xl p-6 border border-border hover:border-primary/40 overflow-hidden transition-all"
              >
                {/* Gradient glow on hover */}
                <div
                  className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${it.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500 -z-10`}
                />

                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${it.gradient} flex items-center justify-center font-heading font-bold text-2xl text-white shadow-lg`}
                  >
                    {it.icon.charAt(0)}
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-text-muted font-mono">
                    #{it.id.toString().padStart(2, '0')}
                  </span>
                </div>

                <h3 className="font-heading font-semibold text-lg sm:text-xl mb-3 group-hover:text-primary-light transition-colors">
                  {it.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed line-clamp-5 group-hover:line-clamp-none transition-all">
                  {it.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {getTags(it.title).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[11px] rounded-md bg-surface/60 border border-border text-text-muted font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

function getTags(title: string): string[] {
  switch (title) {
    case 'AI / ML':
      return ['Neural Nets', 'PyTorch', 'Production AI'];
    case 'Deep Learning':
      return ['CNNs', 'Transformers', 'QLoRA', 'Transfer Learning'];
    case 'NLP':
      return ['Multilingual', 'RAG', 'Transformers', 'OCR'];
    case 'LLM Engineering':
      return ['Prompting', 'Fallback Chains', 'Guardrails', 'Voice'];
    default:
      return ['VQC', 'Quantum Kernels', 'Hybrid Models'];
  }
}
