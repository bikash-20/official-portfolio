import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

/* -------------------------------------------------------------------------- */
/*  Skill normalization — bridges mismatched naming across data files.        */
/*                                                                             */
/*  Examples:                                                                  */
/*    "React 18"   → "react"                                                   */
/*    "Next.js 16" → "next.js"                                                 */
/*    "Spring Boot 3" → "spring boot"                                          */
/*    "Java 17"    → "java"                                                    */
/*    "HTML / CSS" → "html / css"                                              */
/*                                                                             */
/*  Versions, dots after acronyms, and minor punctuation are preserved.       */
/*  This gives us the same key for "React" / "React 18" / "React.js" etc.     */
/* -------------------------------------------------------------------------- */

export function normalizeSkill(input: string): string {
  return input
    .toLowerCase()
    .replace(/\s+\d+(\.\d+)*$/g, '')   // trailing version: "Spring Boot 3", "Next.js 16", "Java 17"
    .replace(/\.js$/g, '.js')          // no-op, kept for clarity
    .replace(/\s+/g, ' ')
    .trim();
}

interface SkillFilterContextValue {
  /** Currently selected skill keys (normalized). Empty = show everything. */
  selected: Set<string>;
  /** Toggle a skill in/out of the active filter. */
  toggle: (displayName: string) => void;
  /** Programmatically clear all filters. */
  clear: () => void;
  /** True when any filter is active. */
  isActive: boolean;
  /** True when a given display name is currently selected. */
  isSelected: (displayName: string) => boolean;
}

const SkillFilterContext = createContext<SkillFilterContextValue | null>(null);

export function SkillFilterProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set());

  const toggle = useCallback((displayName: string) => {
    const key = normalizeSkill(displayName);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const clear = useCallback(() => setSelected(new Set()), []);

  const isSelected = useCallback(
    (displayName: string) => selected.has(normalizeSkill(displayName)),
    [selected],
  );

  const value = useMemo<SkillFilterContextValue>(
    () => ({
      selected,
      toggle,
      clear,
      isActive: selected.size > 0,
      isSelected,
    }),
    [selected, toggle, clear, isSelected],
  );

  return (
    <SkillFilterContext.Provider value={value}>
      {children}
    </SkillFilterContext.Provider>
  );
}

export function useSkillFilter(): SkillFilterContextValue {
  const ctx = useContext(SkillFilterContext);
  if (!ctx) {
    throw new Error('useSkillFilter must be used within SkillFilterProvider');
  }
  return ctx;
}

/* -------------------------------------------------------------------------- */
/*  Pure helper — keeps component code clean.                                 */
/* -------------------------------------------------------------------------- */

/** True when any project-tech string matches any selected skill key. */
export function projectMatchesFilter(
  projectTech: readonly string[],
  selectedKeys: ReadonlySet<string>,
): boolean {
  if (selectedKeys.size === 0) return true;
  for (const t of projectTech) {
    if (selectedKeys.has(normalizeSkill(t))) return true;
  }
  return false;
}
