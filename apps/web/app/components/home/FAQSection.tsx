"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQSection() {
  const [openFAQItems, setOpenFAQItems] = useState<number[]>([]);

  const faqData: FAQItem[] = [
    {
      question: "What is ORCA and who is it built for?",
      answer:
        "ORCA is an agentic marine intelligence platform built for India's 7 million coastal fishermen, disaster authorities, and marine operators. It converts technical Earth Observation rasters into clear voice and map advisories.",
    },
    {
      question: "How does the multi-agent reasoning architecture work?",
      answer:
        "The system dispatches eight specialized Pydantic AI agents in parallel covering weather intelligence, ocean analytics, risk assessment, and geospatial reasoning. Each agent queries authoritative live tools rather than relying on ungrounded language model generation.",
    },
    {
      question: "How does Indic voice access work at sea?",
      answer:
        "Fishermen can speak in coastal Indian dialects including Tamil, Telugu, Malayalam, Gujarati, Bengali, and Odia. Sarvam Saaras converts audio to text, and Sarvam Bulbul reads back answers with natural intonation.",
    },
    {
      question: "What happens when cellular connectivity is lost offshore?",
      answer:
        "The Next.js PWA caches 72-hour forecast bulletins and active boundary geofences in browser storage before leaving port. Cached advisories remain accessible with clear observation timestamps until network reconnects.",
    },
    {
      question: "How does crowdsourced ground-truth verification work?",
      answer:
        "Fishermen upload live sea state photos and GPS coordinates from their boat. Multimodal analysis confirms wave heights, detects discrepancies against satellite models, and pushes immediate hazard warnings to nearby vessels.",
    },
    {
      question: "Which government data sources are integrated?",
      answer:
        "ORCA pulls live bulletins from IMD APIs, Potential Fishing Zone advisories from INCOIS, and satellite oceanographic layers from ISRO Bhuvan and MOSDAC, backed by Open-Meteo fallback redundancy.",
    },
  ];

  const toggleFAQItem = (index: number) => {
    setOpenFAQItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  return (
    <section id="faq" className="w-full border-b border-border">
      <div className="w-full max-w-6xl mx-auto border-x border-border px-4 sm:px-8 py-12 sm:py-16 flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="w-full lg:w-1/3 flex flex-col gap-3">
          <h2 className="text-primary font-normal text-3xl md:text-5xl font-instrument tracking-tight text-balance">
            Frequently asked questions
          </h2>
          <p className="text-muted text-sm sm:text-base font-intert leading-relaxed text-pretty">
            How ORCA uses marine data, voice access, and safety checks to
            support decisions at sea.
          </p>
        </div>

        <div className="w-full lg:w-2/3 flex flex-col">
          {faqData.map((item, index) => {
            const isOpen = openFAQItems.includes(index);

            return (
              <div
                key={index}
                className="w-full border-b border-border/80 last:border-b-0 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQItem(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${index}`}
                  className="w-full rounded-sm py-4 flex justify-between items-center gap-4 text-left hover:text-brand transition-colors"
                >
                  <span className="flex-1 text-primary text-sm sm:text-base font-medium font-intert">
                    {item.question}
                  </span>
                  <ChevronDown
                    size={18}
                    aria-hidden="true"
                    className={`text-muted transition-transform duration-200 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                <div
                  id={`faq-panel-${index}`}
                  role="region"
                  className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-muted text-sm font-intert leading-relaxed pb-4 max-w-prose">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
