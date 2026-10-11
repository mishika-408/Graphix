import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Concept {
  term: string;
  emoji: string;
  short: string;
  detail: string;
  example?: string;
}

interface MathConceptsProps {
  concepts: Concept[];
  title?: string;
}

function ConceptItem({ concept }: { concept: Concept }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-muted/40 transition-colors"
        data-testid={`concept-toggle-${concept.term.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <div className="flex items-center gap-2">
          <span className="text-base" aria-hidden>{concept.emoji}</span>
          <span className="font-semibold text-sm text-foreground">{concept.term}</span>
          <span className="text-sm text-muted-foreground hidden sm:inline">— {concept.short}</span>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 space-y-2 border-t border-border bg-muted/20">
              <p className="text-sm text-muted-foreground leading-relaxed">{concept.detail}</p>
              {concept.example && (
                <div className="flex items-start gap-2 bg-background/40 rounded-md p-2.5">
                  <span className="text-xs font-semibold text-primary shrink-0 mt-0.5">Example</span>
                  <p className="text-xs text-muted-foreground leading-relaxed">{concept.example}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MathConcepts({ concepts, title = 'Math Concepts' }: MathConceptsProps) {
  const [sectionOpen, setSectionOpen] = useState(false);

  return (
    <div className="bg-card border border-card-border rounded-lg overflow-hidden">
      <button
        onClick={() => setSectionOpen(!sectionOpen)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-muted/20 transition-colors"
        data-testid="concepts-section-toggle"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm text-primary">{title}</span>
          <span className="text-xs text-muted-foreground">(click to expand)</span>
        </div>
        {sectionOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {sectionOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 space-y-2 border-t border-border">
              {concepts.map((c) => (
                <ConceptItem key={c.term} concept={c} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
