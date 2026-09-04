import { lazy, Suspense } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';

// Lazy-load the heavy syntax highlighter so the ~1MB Prism grammars
// only download when the chat widget actually renders a code block.
const CodeBlock = lazy(() => import('./CodeBlock'));

interface Props {
  content: string;
  copyable?: boolean;
}

export default function MarkdownContent({ content, copyable = true }: Props) {
  return (
    <div className="md prose-invert max-w-none text-sm leading-relaxed break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ children }) => (
            <h1 className="font-heading font-semibold text-base mt-2 mb-1">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-heading font-semibold text-base mt-2 mb-1">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-heading font-semibold text-sm mt-2 mb-1">{children}</h3>
          ),
          p: ({ children }) => <p className="my-1.5 first:mt-0 last:mb-0">{children}</p>,
          ul: ({ children }) => (
            <ul className="my-1.5 list-disc pl-5 space-y-0.5">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-1.5 list-decimal pl-5 space-y-0.5">{children}</ol>
          ),
          li: ({ children }) => <li className="text-sm leading-relaxed">{children}</li>,
          code({ inline, className, children }: any) {
            const text = String(children ?? '').replace(/\n$/, '');
            const lang = /language-(\w+)/.exec(className || '')?.[1] ?? '';
            if (inline || !lang) {
              return (
                <code className="px-1 py-0.5 rounded bg-bg-2 border border-border text-[0.85em] font-mono text-secondary-light">
                  {children}
                </code>
              );
            }
            return (
              <Suspense
                fallback={
                  <pre className="my-2 rounded-lg overflow-x-auto bg-[#1a1b26] border border-border p-3 text-xs font-mono text-text">
                    {text}
                  </pre>
                }
              >
                <CodeBlock language={lang} value={text} copyable={copyable} />
              </Suspense>
            );
          },
          pre: ({ children }) => <>{children}</>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-light underline-offset-2 hover:underline"
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="my-2 overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-xs">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-surface-2/60 text-left">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-2 py-1 font-heading font-semibold">{children}</th>
          ),
          td: ({ children }) => <td className="px-2 py-1 border-t border-border">{children}</td>,
          blockquote: ({ children }) => (
            <blockquote className="my-1.5 border-l-2 border-primary/50 pl-3 text-text-muted italic">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-3 border-border" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
