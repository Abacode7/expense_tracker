/**
 * EmptyListIcon component - SVG clipboard icon for empty state.
 * @module components/icons/EmptyListIcon
 */

/** Common props for icon components */
interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Renders an empty list/clipboard icon.
 * @param props - Icon properties
 * @param props.className - CSS class names for styling (default: 'w-16 h-16')
 * @param props.style - Inline styles for the icon
 */
export default function EmptyListIcon({ className = 'w-16 h-16', style }: IconProps) {
  return (
    <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
  );
}
