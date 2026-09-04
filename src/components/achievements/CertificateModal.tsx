import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  open: boolean;
  onClose: () => void;
  src?: string;
  title: string;
  type?: 'pdf' | 'image';
}

export default function CertificateModal({ open, onClose, src, title, type }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-[90vh] glass-strong rounded-2xl overflow-hidden border border-border"
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <h3 className="font-heading font-semibold truncate pr-4">{title}</h3>
              <div className="flex items-center gap-2 shrink-0">
                {src && (
                  <a
                    href={src}
                    download
                    className="px-3 py-1.5 rounded-lg hover:bg-surface text-text-muted hover:text-text transition-colors text-sm inline-flex items-center gap-1.5"
                  >
                    Download
                  </a>
                )}
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-lg hover:bg-surface text-text-muted hover:text-text transition-colors text-sm"
                  aria-label="Close"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="bg-bg-2 p-4 overflow-auto max-h-[calc(90vh-60px)] flex items-center justify-center">
              {src ? (
                type === 'pdf' ? (
                  <iframe
                    src={src}
                    title={title}
                    className="w-full h-[75vh] rounded-lg bg-white"
                  />
                ) : (
                  <img
                    src={src}
                    alt={title}
                    className="max-w-full max-h-[75vh] rounded-lg object-contain"
                  />
                )
              ) : (
                <p className="text-text-muted py-12">No certificate uploaded yet.</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
