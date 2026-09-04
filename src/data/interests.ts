import type { Interest } from '@/types';

export const interests: Interest[] = [
  {
    id: 1,
    title: 'AI / ML',
    description:
      'I am deeply fascinated by artificial intelligence and machine learning as transformative technologies. My work spans practical applications of neural networks, deep learning architectures, and intelligent system design. I actively experiment with state-of-the-art models, build production AI pipelines, and explore how AI can solve real-world problems — from education (Nexora AI, CENDRIX AI) to healthcare (Healthcare Triage AI) to enterprise tooling (LiquiGuard, QueueStorm).',
    icon: 'Brain',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 2,
    title: 'Deep Learning',
    description:
      'I work hands-on with PyTorch to design, train, and fine-tune deep neural networks including CNNs, RNNs, and Transformer-based architectures. My interests include transfer learning, model compression, and domain-specific fine-tuning — most notably my QLoRA fine-tuned TinyLlama model inside CENDRIX AI. I believe in understanding models from first principles rather than treating them as black boxes.',
    icon: 'Bolt',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    id: 3,
    title: 'NLP',
    description:
      'I am passionate about building systems that understand and generate human language. My NLP work spans multilingual processing (Bangla, English, Banglish in QueueStorm), text summarization, sentiment analysis, conversational AI, and document understanding (OCR + PDF extraction in Cognexa AI). I actively follow the latest research in transformer architectures and retrieval-augmented generation.',
    icon: 'Chat',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    id: 4,
    title: 'LLM Engineering',
    description:
      'A core focus area — I architect end-to-end LLM systems including prompt engineering, fallback provider chains (OpenRouter → Cloudflare → Pollinations), context injection for zero-hallucination answers (Rentify), guardrails for safety (QueueStorm), and voice pipelines combining Whisper, LLMs, and TTS (JARVIS-MK1, Nocta). I treat LLM engineering as a first-class software discipline.',
    icon: 'Crystal',
    gradient: 'from-rose-500 to-orange-500',
  },
  {
    id: 5,
    title: 'Quantum Machine Learning',
    description:
      'An emerging frontier that captivates my curiosity. I am actively exploring how quantum computing principles — superposition, entanglement, and quantum parallelism — can accelerate classical machine learning workloads. My long-term research interest lies in hybrid quantum-classical models, variational quantum circuits (VQCs), and quantum kernel methods for high-dimensional data. I see QML as the next paradigm shift in computational intelligence.',
    icon: 'Atom',
    gradient: 'from-indigo-500 to-purple-600',
  },
];
