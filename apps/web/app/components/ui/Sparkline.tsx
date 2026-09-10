"use client";

interface SparklineProps {
  values: number[];
  color?: string;
  className?: string;
}

const WIDTH = 80;
const HEIGHT = 30;

export function Sparkline({
  values,
  color = "var(--brand-2)",
  className,
}: SparklineProps) {
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = WIDTH / (values.length - 1);

  const points = values
    .map((value, index) => {
      const x = index * step;
      const y = HEIGHT - ((value - min) / span) * (HEIGHT - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={`w-16 h-7 shrink-0 ${className ?? ""}`}
      aria-hidden
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
