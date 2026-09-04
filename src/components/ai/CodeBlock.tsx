import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Props {
  language: string;
  value: string;
  copyable: boolean;
}

/**
 * Standalone code block component, loaded via React.lazy() so its
 * heavy Prism grammar tree (1MB+) only downloads when a chat message
 * actually contains a fenced code block.
 */
export default function CodeBlock({ language, value, copyable }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  return (
    <div className="my-2 rounded-lg overflow-hidden border border-border bg-[#1a1b26] text-xs">
      <div className="flex items-center justify-between px-3 py-1 bg-bg-2/80 border-b border-border">
        <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
          {language}
        </span>
        {copyable && (
          <button
            type="button"
            onClick={handleCopy}
            className="text-[10px] uppercase tracking-widest text-text-muted hover:text-primary-light transition-colors"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: '0.75rem 1rem',
          background: 'transparent',
          fontSize: '0.78rem',
        }}
        wrapLongLines
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}
