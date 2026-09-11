"use client";

interface FeatureCarouselProps {
  activeCard: number;
  progress: number;
  onCardClick: (index: number) => void;
}

function FeatureCard({
  title,
  description,
  isActive,
  progress,
  onClick,
}: {
  title: string;
  description: string;
  isActive: boolean;
  progress: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`group flex-1 overflow-hidden flex flex-col justify-start items-start text-left transition-colors duration-200 cursor-pointer border-b md:border-b-0 md:border-r border-border last:border-0 ${
        isActive ? "bg-surface" : "bg-transparent hover:bg-surface/50"
      }`}
    >
      <span
        aria-hidden="true"
        className={`w-full h-1 bg-border/40 overflow-hidden transition-opacity ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      >
        <span
          className="block h-1 bg-primary transition-[width] duration-100"
          style={{ width: `${progress}%` }}
        />
      </span>
      <span className="px-6 py-5 w-full flex flex-col gap-2">
        <span className="self-stretch text-primary text-sm font-semibold leading-6 font-intert transition-colors group-hover:text-brand">
          {title}
        </span>
        <span className="self-stretch text-muted text-[13px] font-normal leading-[22px] font-intert whitespace-pre-line">
          {description}
        </span>
      </span>
    </button>
  );
}

export default function FeatureCarousel({
  activeCard,
  progress,
  onCardClick,
}: FeatureCarouselProps) {
  return (
    <section className="w-full border-b border-border flex justify-center">
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row">
        <FeatureCard
          title="Potential Fishing Zone Routing"
          description="Pinpoint nearest productive fishing zones derived daily from Oceansat and thermal satellite data."
          isActive={activeCard === 0}
          progress={activeCard === 0 ? progress : 0}
          onClick={() => onCardClick(0)}
        />
        <FeatureCard
          title="Proactive Hazard and Cyclone Alerts"
          description="Receive real-time push warnings for squalls, lightning, and high waves before leaving harbor."
          isActive={activeCard === 1}
          progress={activeCard === 1 ? progress : 0}
          onClick={() => onCardClick(1)}
        />
        <FeatureCard
          title="Search and Rescue Drift Simulation"
          description="Predict drift coordinates for missing vessels using OpenDrift physics over live currents and winds."
          isActive={activeCard === 2}
          progress={activeCard === 2 ? progress : 0}
          onClick={() => onCardClick(2)}
        />
      </div>
    </section>
  );
}
