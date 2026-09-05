/**
 * Threshold brand mark — three stacked bars rising like a staircase.
 *
 * Inline SVG so we don't pull in another icon dep and avoid font-glyph
 * drift across browsers. Used in both the chat bubble and the chat
 * widget header.
 */
interface Props {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export default function ThresholdMark({
  size = 24,
  strokeWidth = 2.25,
  className,
}: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M4 18h4v-4H4z" />
      <path d="M10 18h4V8h-4z" />
      <path d="M16 18h4V4h-4z" />
    </svg>
  );
}
